import { getAdminUser, createAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const admin = await getAdminUser(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { email, password, full_name } = await request.json();

  if (!email || !password) {
    return Response.json({ error: "Email and password are required." }, { status: 400 });
  }

  const supabase = createAdminClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !user) {
    return Response.json(
      { error: authError?.message ?? "Failed to create user." },
      { status: 500 }
    );
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    email: user.email,
    full_name: full_name || null,
  });

  if (profileError) {
    return Response.json(
      { error: `User created but profile insert failed: ${profileError.message}` },
      { status: 500 }
    );
  }

  return Response.json({ user: { id: user.id, email: user.email, full_name } });
}
