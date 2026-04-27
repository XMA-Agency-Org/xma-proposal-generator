import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerPackageTools } from "./tools/packages.js";
import { registerTosTools } from "./tools/tos.js";
import { registerSnippetTools } from "./tools/snippets.js";
import { registerCreateProposalTool } from "./tools/create-proposal.js";

const server = new McpServer({
  name: "xma-proposals",
  version: "1.0.0",
});

registerPackageTools(server);
registerTosTools(server);
registerSnippetTools(server);
registerCreateProposalTool(server);

const transport = new StdioServerTransport();
await server.connect(transport);
