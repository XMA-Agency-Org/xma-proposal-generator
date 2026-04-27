import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAdmin } from "@/lib/api-auth";
import { createPaymentLink } from "@/lib/stripe-animated";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error: authError } = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const supabase = await createClient();

  const { data: proposal, error: fetchError } = await (supabase as any)
    .from("animated_proposals")
    .select("id, status, total_price_cents, currency, company_name, stripe_link")
    .eq("id", id)
    .single();

  if (fetchError || !proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  if (!["draft", "pending_approval"].includes(proposal.status)) {
    return NextResponse.json({ error: "Only draft or pending proposals can be approved" }, { status: 400 });
  }

  let stripeLink = proposal.stripe_link;

  if (!stripeLink && process.env.STRIPE_SECRET_KEY) {
    try {
      stripeLink = await createPaymentLink(
        proposal.total_price_cents,
        proposal.currency,
        id,
        proposal.company_name
      );
    } catch {
      // Non-fatal — admin can set Stripe link manually
    }
  }

  const { data, error } = await (supabase as any)
    .from("animated_proposals")
    .update({
      status: "approved",
      approved_by: user!.id,
      approved_at: new Date().toISOString(),
      ...(stripeLink ? { stripe_link: stripeLink } : {}),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
