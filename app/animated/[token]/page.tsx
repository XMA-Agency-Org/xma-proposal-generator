import { notFound } from "next/navigation";
import { AnimatedProposalView } from "./_components/AnimatedProposalView";
import type { AnimatedProposal } from "@/types/animated-proposal";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ token: string }>;
}

async function fetchProposal(token: string): Promise<AnimatedProposal | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/animated-proposals/public/${token}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const proposal = await fetchProposal(token);
  if (!proposal) return { title: "Proposal" };
  return {
    title: `${proposal.project_title} — ${proposal.company_name}`,
    description: proposal.intro_paragraph.slice(0, 160),
  };
}

export default async function AnimatedProposalPage({ params }: Props) {
  const { token } = await params;

  if (process.env.NEXT_PUBLIC_ANIMATED_ENABLED === "false") notFound();

  const proposal = await fetchProposal(token);
  if (!proposal) notFound();

  return <AnimatedProposalView proposal={proposal} />;
}
