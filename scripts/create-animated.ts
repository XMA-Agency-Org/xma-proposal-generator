import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

async function main() {
  const jsonPath = process.argv[2];

  if (!jsonPath) {
    console.error("Usage: bun run scripts/create-animated.ts <path-to-proposal.json>");
    process.exit(1);
  }

  const resolvedPath = path.isAbsolute(jsonPath) ? jsonPath : path.join(process.cwd(), jsonPath);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
  }

  const proposalData = JSON.parse(fs.readFileSync(resolvedPath, "utf-8"));

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError) {
    console.error("Failed to fetch users:", usersError.message);
    process.exit(1);
  }

  const adminEmail = "admin@xmaagency.com";
  const adminUser = users.users.find((u) => u.email === adminEmail);
  if (!adminUser) {
    console.error(`Admin user not found: ${adminEmail}`);
    process.exit(1);
  }

  console.log(`Creating proposal for: ${proposalData.company_name} — ${proposalData.client_full_name}`);

  const { data, error } = await (supabase as any)
    .from("animated_proposals")
    .insert({ ...proposalData, created_by: adminUser.id, status: "draft" })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      console.error("Slug already in use:", proposalData.slug);
    } else {
      console.error("Insert failed:", error.message);
    }
    process.exit(1);
  }

  console.log("\n✓ Proposal created (status: draft)\n");
  console.log(`  ID:          ${data.id}`);
  console.log(`  Token:       ${data.token}`);
  console.log(`  Admin URL:   ${baseUrl}/animated-proposals/${data.id}`);
  console.log(`  Public URL:  ${baseUrl}/animated/${data.token} (inactive until approved)\n`);
  console.log("Next step: admin must approve at the admin URL above.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
