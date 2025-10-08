import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { EmailTemplate } from "@/types/email";
import { createTemplate } from "./queries";

export async function migrateTemplates() {
  const templatesDir = join(process.cwd(), "templates");
  const files = await readdir(templatesDir);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  console.log(`Found ${jsonFiles.length} templates to migrate...`);

  let success = 0;
  let failed = 0;
  const errors: { file: string; error: string }[] = [];

  for (const file of jsonFiles) {
    try {
      const content = await readFile(join(templatesDir, file), "utf-8");
      const template: EmailTemplate = JSON.parse(content);

      await createTemplate({
        id: template.metadata.id,
        name: template.metadata.name,
        blocks: template.blocks,
        description: template.metadata.description,
        category: template.metadata.category,
      });

      console.log(`✓ ${template.metadata.name}`);
      success++;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Check if it's a duplicate key error (UNIQUE constraint)
      if (
        errorMessage.includes("UNIQUE constraint failed") ||
        errorMessage.includes("duplicate key")
      ) {
        console.log(`⊘ ${file}: Already exists (skipped)`);
        success++;
      } else {
        console.error(`✗ ${file}:`, errorMessage);
        errors.push({ file, error: errorMessage });
        failed++;
      }
    }
  }

  console.log(`\nMigration complete: ${success} succeeded, ${failed} failed`);

  if (errors.length > 0) {
    console.log("\nErrors:");
    errors.forEach(({ file, error }) => {
      console.log(`  ${file}: ${error}`);
    });
  }

  return { success, failed, total: jsonFiles.length, errors };
}

// Run if called directly
// Note: Use `tsx lib/db/migrate-templates.ts` to run this script
if (
  require.main === module ||
  (typeof import.meta !== "undefined" &&
    import.meta.url === `file://${process.argv[1]}`)
) {
  migrateTemplates()
    .then(({ failed }) => {
      process.exit(failed > 0 ? 1 : 0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
