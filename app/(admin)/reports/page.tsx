import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { requireAdminRole } from "@/lib/auth/page";
import { commonClasses } from "@/lib/design-system";
import ReportsClient from "./ReportsClient";

export const metadata: Metadata = {
  title: "Reports - XMA Agency",
  description: "View proposal analytics and reports",
};

async function getClassicProposalsData(startDate?: Date, endDate?: Date) {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("proposals")
      .select(`
        *,
        client:clients(*),
        links:proposal_links(*),
        package:packages(*),
        created_by_profile:profiles!created_by(name, email)
      `);

    // Add date filtering if provided
    if (startDate && endDate) {
      query = query
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());
    }

    // Note: Admin access is enforced at the page level, so we can fetch all proposals
    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching classic proposals:", error);
    return [];
  }
}

// Animated proposals live in a separate table with their own status flow.
// Map those statuses onto the report's classic buckets so both proposal
// systems feed the same analytics.
const ANIMATED_STATUS_TO_REPORT_BUCKET: Record<string, string> = {
  draft: "draft",
  pending_approval: "draft",
  approved: "draft",
  sent: "sent",
  client_signed: "accepted",
  counter_signed: "accepted",
  paid: "paid",
};

async function getAnimatedProposalsData() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("animated_proposals")
      .select("id, status, total_price_cents, currency, created_at, archived_at")
      .is("archived_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map((proposal) => ({
      id: proposal.id,
      created_at: proposal.created_at,
      status: ANIMATED_STATUS_TO_REPORT_BUCKET[proposal.status] || "draft",
      isAnimated: true,
      total_price_cents: proposal.total_price_cents,
      currency: proposal.currency,
    }));
  } catch (error) {
    console.error("Error fetching animated proposals:", error);
    return [];
  }
}

export default async function ReportsPage() {
  // Require admin role to access reports
  await requireAdminRole();

  const [classic, animated] = await Promise.all([
    getClassicProposalsData(),
    getAnimatedProposalsData(),
  ]);

  const proposals = [...classic, ...animated].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className={commonClasses.pageContainer}>
      <div className={commonClasses.contentContainer}>
        <h1 className="text-3xl font-bold mb-6">
          Reports & Analytics
        </h1>
        <ReportsClient initialProposals={proposals} />
      </div>
    </div>
  );
}
