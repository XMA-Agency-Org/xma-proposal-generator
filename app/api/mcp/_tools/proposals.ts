import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { updateAnimatedProposalSchema } from "@/lib/animated-proposal-schema";
import { createMcpServiceClient } from "../_lib/supabase";
import type { McpAuthContext } from "../_lib/auth";

const PROPOSAL_SELECT = "id, slug, token, status, client_full_name, client_first_name, company_name, project_title, provider_name, agency_name, brand, total_price_cents, currency, created_by, created_at, updated_at";

export function registerProposalTools(server: McpServer, ctx: McpAuthContext) {
  server.tool(
    "get_animated_proposal",
    "Fetch an existing animated proposal by its ID or slug. Returns full proposal data including all fields.",
    {
      id: z.string().optional().describe("Proposal UUID"),
      slug: z.string().optional().describe("Proposal slug (e.g. 'acme-corp-q2-2026')"),
    },
    async ({ id, slug }) => {
      if (!id && !slug) {
        return { content: [{ type: "text", text: "Error: provide either id or slug" }] };
      }

      const supabase = createMcpServiceClient();
      let query = supabase.from("animated_proposals").select("*");

      if (id) {
        query = query.eq("id", id);
      } else {
        query = query.eq("slug", slug!);
      }

      query = query.eq("created_by", ctx.userId);

      const { data, error } = await query.single();

      if (error || !data) {
        return { content: [{ type: "text", text: error ? `Error: ${error.message}` : "Proposal not found or access denied" }] };
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            ...data,
            public_url: `${baseUrl}/proposal/${data.token}`,
            admin_url: `${baseUrl}/proposals/animated/${data.id}`,
          }, null, 2),
        }],
      };
    }
  );

  server.tool(
    "update_animated_proposal",
    "Partially update an existing animated proposal. Only updates fields you provide — all other fields remain unchanged. Can only update proposals you created.",
    {
      id: z.string().uuid().describe("Proposal UUID to update"),
      updates: updateAnimatedProposalSchema,
    },
    async ({ id, updates }) => {
      const parsed = updateAnimatedProposalSchema.safeParse(updates);
      if (!parsed.success) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ errors: parsed.error.flatten() }, null, 2),
          }],
        };
      }

      if (Object.keys(parsed.data).length === 0) {
        return { content: [{ type: "text", text: "Error: no fields to update" }] };
      }

      const supabase = createMcpServiceClient();

      const { data: existing, error: fetchError } = await supabase
        .from("animated_proposals")
        .select("id, created_by")
        .eq("id", id)
        .single();

      if (fetchError || !existing) {
        return { content: [{ type: "text", text: "Proposal not found" }] };
      }

      if (existing.created_by !== ctx.userId) {
        return { content: [{ type: "text", text: "Access denied: you can only update proposals you created" }] };
      }

      const { override_warnings, ...updateFields } = parsed.data as any;

      const { data: updated, error } = await supabase
        .from("animated_proposals")
        .update(updateFields)
        .eq("id", id)
        .select(PROPOSAL_SELECT)
        .single();

      if (error) {
        return { content: [{ type: "text", text: `Error: ${error.message}` }] };
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            ...updated,
            public_url: `${baseUrl}/proposal/${(updated as any).token}`,
            admin_url: `${baseUrl}/proposals/animated/${updated!.id}`,
            note: "Proposal updated successfully.",
          }, null, 2),
        }],
      };
    }
  );
}
