import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const schemaOnly = process.argv.includes("--schema-only");
const dbUrl = process.env.SUPABASE_DB_URL;

if (!dbUrl) {
  console.error("SUPABASE_DB_URL not set in environment.");
  process.exit(1);
}

const backupsDir = path.join(process.cwd(), "backups");
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const prefix = schemaOnly ? "schema" : "full";
const outFile = path.join(backupsDir, `pre-animated-${prefix}-${timestamp}.sql`);

const flags = schemaOnly ? "--schema-only" : "";
execSync(`pg_dump ${flags} "${dbUrl}" -f "${outFile}"`, { stdio: "inherit" });

console.log(`Backup written to: ${outFile}`);
