import { z } from "zod";
import { supabase } from "../supabase.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerPackageTools(server: McpServer) {
  server.tool(
    "list_packages",
    "List available packages from the catalog. Use brand filter to narrow to XMA or XMA Media.",
    { brand: z.enum(["xma", "xma_media"]).optional() },
    async ({ brand }) => {
      let query = (supabase as any).from("packages").select("id, name, price, currency, usd_price, brand, features, description, is_active").eq("is_active", true).order("name");
      if (brand) query = query.eq("brand", brand);
      const { data, error } = await query;
      if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "get_package",
    "Get full details for a specific package including features and pricing.",
    { id: z.string().uuid() },
    async ({ id }) => {
      const { data, error } = await (supabase as any).from("packages").select("*").eq("id", id).single();
      if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );
}
