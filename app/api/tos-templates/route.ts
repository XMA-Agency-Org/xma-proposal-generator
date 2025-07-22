import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/lib/api-auth";

// GET /api/tos-templates - List active ToS templates (accessible to all authenticated users)
export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  const supabase = await createClient();

  // Fetch only active templates, ordered by name
  const { data: templates, error: fetchError } = await supabase
    .from("tos_templates")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (fetchError) {
    return NextResponse.json(
      { error: fetchError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ templates });
}