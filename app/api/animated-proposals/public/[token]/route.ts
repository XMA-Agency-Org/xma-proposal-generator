import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token || token.length < 16) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_animated_by_token", {
    p_token: token,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const proposal = Array.isArray(data) ? data[0] : data;

  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found or not yet active" }, { status: 404 });
  }

  return NextResponse.json(proposal);
}
