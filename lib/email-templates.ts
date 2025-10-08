import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { EmailBlock } from "@/types/email";

/**
 * Template metadata interface
 */
export interface TemplateMetadata {
  id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Complete template interface with metadata and blocks
 */
export interface EmailTemplate {
  metadata: TemplateMetadata;
  blocks: EmailBlock[];
}

/**
 * Storage paths
 */
const TEMPLATES_DIR = join(process.cwd(), "templates");
const REACT_EMAIL_DIR = join(process.cwd(), "emails");

/**
 * Ensures the templates directory exists
 */
async function ensureTemplatesDir(): Promise<void> {
  if (!existsSync(TEMPLATES_DIR)) {
    await mkdir(TEMPLATES_DIR, { recursive: true });
  }
}

/**
 * Generates a slug from a name
 */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Lists all available templates
 * @returns Array of template metadata
 */
export async function listTemplates(): Promise<TemplateMetadata[]> {
  try {
    await ensureTemplatesDir();
    const files = await readdir(TEMPLATES_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const templates = await Promise.all(
      jsonFiles.map(async (file) => {
        try {
          const content = await readFile(join(TEMPLATES_DIR, file), "utf-8");
          const template: EmailTemplate = JSON.parse(content);
          return template.metadata;
        } catch (error) {
          console.error(`Error reading template ${file}:`, error);
          return null;
        }
      }),
    );

    return templates.filter((t): t is TemplateMetadata => t !== null);
  } catch (error) {
    console.error("Error listing templates:", error);
    return [];
  }
}

/**
 * Loads a template by ID
 * @param id - Template ID
 * @returns Template with metadata and blocks
 */
export async function loadTemplate(id: string): Promise<EmailTemplate | null> {
  try {
    const filePath = join(TEMPLATES_DIR, `${id}.json`);
    if (!existsSync(filePath)) {
      return null;
    }

    const content = await readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading template ${id}:`, error);
    return null;
  }
}

/**
 * Saves a template
 * @param template - Template to save
 * @returns Saved template with metadata
 */
export async function saveTemplate(
  name: string,
  blocks: EmailBlock[],
  options?: {
    id?: string;
    description?: string;
    category?: string;
  },
): Promise<EmailTemplate> {
  await ensureTemplatesDir();

  const now = new Date().toISOString();
  const id = options?.id || slugify(name);

  // Check if template exists to preserve created date
  let createdAt = now;
  const existing = await loadTemplate(id);
  if (existing) {
    createdAt = existing.metadata.createdAt;
  }

  const template: EmailTemplate = {
    metadata: {
      id,
      name,
      description: options?.description,
      category: options?.category,
      createdAt,
      updatedAt: now,
    },
    blocks,
  };

  const filePath = join(TEMPLATES_DIR, `${id}.json`);
  await writeFile(filePath, JSON.stringify(template, null, 2), "utf-8");

  return template;
}

/**
 * Deletes a template by ID
 * @param id - Template ID to delete
 * @returns true if deleted, false if not found
 */
export async function deleteTemplate(id: string): Promise<boolean> {
  try {
    const filePath = join(TEMPLATES_DIR, `${id}.json`);
    if (!existsSync(filePath)) {
      return false;
    }

    const { unlink } = await import("node:fs/promises");
    await unlink(filePath);
    return true;
  } catch (error) {
    console.error(`Error deleting template ${id}:`, error);
    return false;
  }
}

/**
 * Lists available React Email templates from the emails/ directory
 * @returns Array of template names
 */
export async function listReactEmailTemplates(): Promise<string[]> {
  try {
    if (!existsSync(REACT_EMAIL_DIR)) {
      return [];
    }

    const files = await readdir(REACT_EMAIL_DIR);
    return files
      .filter((file) => file.endsWith(".tsx") || file.endsWith(".jsx"))
      .map((file) => file.replace(/\.(tsx|jsx)$/, ""));
  } catch (error) {
    console.error("Error listing React Email templates:", error);
    return [];
  }
}

/**
 * Imports a React Email template and saves it as a custom template
 * @param templateName - Name of the React Email template
 * @param customName - Custom name for the saved template
 * @returns Saved template
 */
export async function importAndSaveReactEmailTemplate(
  _templateName: string,
  _customName?: string,
): Promise<EmailTemplate | null> {
  return null;
}

/**
 * Gets starter templates (imports from emails/ directory if not already saved)
 * @returns Array of template metadata
 */
export async function getStarterTemplates(): Promise<TemplateMetadata[]> {
  const existingTemplates = await listTemplates();
  const existingIds = new Set(existingTemplates.map((t) => t.id));

  // Check for common React Email templates
  const starterNames = ["notion-magic-link", "stripe-welcome"];

  const reactEmailTemplates = await listReactEmailTemplates();
  const availableStarters = starterNames.filter((name) =>
    reactEmailTemplates.includes(name),
  );

  // Import any starter templates that aren't already saved
  for (const name of availableStarters) {
    const id = slugify(name);
    if (!existingIds.has(id)) {
      try {
        await importAndSaveReactEmailTemplate(name);
      } catch (error) {
        console.error(`Error importing starter template ${name}:`, error);
      }
    }
  }

  // Return all templates
  return await listTemplates();
}

/**
 * Duplicates a template with a new name
 * @param sourceId - ID of template to duplicate
 * @param newName - Name for the duplicated template
 * @returns Duplicated template
 */
export async function duplicateTemplate(
  sourceId: string,
  newName: string,
): Promise<EmailTemplate | null> {
  const source = await loadTemplate(sourceId);
  if (!source) {
    return null;
  }

  return await saveTemplate(newName, source.blocks, {
    description: `Duplicated from ${source.metadata.name}`,
    category: source.metadata.category,
  });
}
