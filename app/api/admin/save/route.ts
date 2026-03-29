import { getAdminUser, createAdminClient } from "@/lib/supabase-admin";

const VALID_TABLES = new Set([
  "whoop_data",
  "dexa_scans",
  "supplements",
  "nutrition_plans",
  "workout_plans",
  "checkins",
]);

export async function POST(request: Request) {
  const admin = await getAdminUser(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { table, userId } = body;

  if (!VALID_TABLES.has(table)) {
    return Response.json({ error: "Invalid table" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Supplements: multi-row upsert/delete
  if (table === "supplements") {
    const { rows, deletedIds } = body;

    if (deletedIds?.length > 0) {
      const { error } = await supabase
        .from("supplements")
        .delete()
        .in("id", deletedIds);
      if (error) return Response.json({ error: error.message }, { status: 500 });
    }

    for (const row of rows) {
      const rowData = {
        name: row.name,
        dose: row.dose || null,
        timing: row.timing || null,
        sort_order: Number(row.sort_order) || 0,
        active: row.active !== false,
      };

      if (row.id) {
        const { error } = await supabase
          .from("supplements")
          .update(rowData)
          .eq("id", row.id);
        if (error) return Response.json({ error: error.message }, { status: 500 });
      } else {
        const { error } = await supabase
          .from("supplements")
          .insert({ ...rowData, user_id: userId });
        if (error) return Response.json({ error: error.message }, { status: 500 });
      }
    }

    return Response.json({ success: true });
  }

  // Single-row tables
  const { id, data } = body;

  const withTimestamp = ["nutrition_plans", "workout_plans"].includes(table)
    ? { ...data, updated_at: new Date().toISOString() }
    : data;

  if (id) {
    const { error } = await supabase
      .from(table)
      .update(withTimestamp)
      .eq("id", id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabase
      .from(table)
      .insert({ ...withTimestamp, user_id: userId });
    if (error) return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
