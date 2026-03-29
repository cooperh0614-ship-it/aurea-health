import { getAdminUser, createAdminClient } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  const admin = await getAdminUser(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, created_at")
    .order("created_at", { ascending: true });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ data });
}
