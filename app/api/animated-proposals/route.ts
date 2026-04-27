import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/lib/api-auth";
import { createAnimatedProposalSchema } from "@/lib/animated-proposal-schema";
import { validateAnimatedProposal } from "@/lib/animated-proposal-validation";

export async function POST(request: Request) {
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  const body = await request.json();
  const parsed = createAnimatedProposalSchema.safeParse({ ...body, created_by: user!.id });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = await createClient();
  const { package_id, tos_template_id, override_warnings, ...insertData } = parsed.data;

  let pkg = null;
  let tos = null;

  if (package_id) {
    const { data } = await (supabase as any).from("packages").select("price, currency, usd_price, brand").eq("id", package_id).single();
    pkg = data;
  }

  if (tos_template_id) {
    const { data } = await (supabase as any).from("tos_templates").select("terms, brand").eq("id", tos_template_id).single();
    tos = data;
  }

  const { warnings } = validateAnimatedProposal(parsed.data, pkg, tos);

  const { data, error } = await (supabase as any)
    .from("animated_proposals")
    .insert({ ...insertData, package_id: package_id ?? null, tos_template_id: tos_template_id ?? null, created_by: user!.id, status: "draft" })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ...data, warnings }, { status: 201 });
}

export async function GET(request: Request) {
  const { user, error: authError } = await requireAuth();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  let query = (supabase as any)
    .from("animated_proposals")
    .select("id, token, slug, status, brand, client_full_name, company_name, project_title, total_price_cents, currency, created_at, updated_at, client_signed_at, provider_signed_at", { count: "exact" })
    .is("archived_at", null)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("status", status);

  const { data, error, count } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, count, page, limit });
}
