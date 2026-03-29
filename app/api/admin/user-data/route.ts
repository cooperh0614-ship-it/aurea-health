import { NextRequest } from "next/server";
import { getAdminUser, createAdminClient } from "@/lib/supabase-admin";

const ORDER_COLS: Record<string, string> = {
  whoop_data: "synced_at",
  dexa_scans: "scan_date",
  nutrition_plans: "updated_at",
  workout_plans: "updated_at",
  checkins: "checkin_date",
};

const VALID_TABLES = new Set([
  "whoop_data",
  "dexa_scans",
  "supplements",
  "nutrition_plans",
  "workout_plans",
  "checkins",
]);

export async function GET(request: NextRequest) {
  const admin = await getAdminUser(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const userId = request.nextUrl.searchParams.get("userId");
  const table = request.nextUrl.searchParams.get("table");

  if (!userId || !table || !VALID_TABLES.has(table)) {
    return Response.json({ error: "Invalid params" }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (table === "supplements") {
    const { data, error } = await supabase
      .from("supplements")
      .select("*")
      .eq("user_id", userId)
      .order("sort_order");
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ data });
  }

  const orderCol = ORDER_COLS[table] ?? "id";
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("user_id", userId)
    .order(orderCol, { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ data });
}
