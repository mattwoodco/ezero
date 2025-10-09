import { desc, eq } from "drizzle-orm";
import type {
  EmailBlock,
  EmailTemplate,
  TemplateMetadata,
} from "@/types/email";
import { db } from "./index";
import { type Template, templates } from "./schema";

// Helper to convert DB model to app format
function toAppTemplate(t: Template): EmailTemplate {
  return {
    metadata: {
      id: t.id,
      name: t.name,
      description: t.description || undefined,
      category: t.category || undefined,
      tags: (t.tags as string[] | null) || undefined,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    },
    blocks: t.blocks as EmailBlock[],
  };
}

// List all templates (metadata only)
export async function listAllTemplates(): Promise<TemplateMetadata[]> {
  const results = await db
    .select({
      id: templates.id,
      name: templates.name,
      description: templates.description,
      category: templates.category,
      tags: templates.tags,
      createdAt: templates.createdAt,
      updatedAt: templates.updatedAt,
    })
    .from(templates)
    .orderBy(desc(templates.updatedAt));

  return results.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description || undefined,
    category: t.category || undefined,
    tags: (t.tags as string[] | null) || undefined,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));
}

// Get template by ID (full template with blocks)
export async function getTemplateById(
  id: string,
): Promise<EmailTemplate | null> {
  const result = await db
    .select()
    .from(templates)
    .where(eq(templates.id, id))
    .limit(1);

  return result[0] ? toAppTemplate(result[0]) : null;
}

// Create new template
export async function createTemplate(data: {
  id: string;
  name: string;
  blocks: EmailBlock[];
  description?: string;
  category?: string;
  tags?: string[];
}): Promise<EmailTemplate> {
  const result = await db
    .insert(templates)
    .values({
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      tags: data.tags ? JSON.parse(JSON.stringify(data.tags)) : null,
      blocks: JSON.parse(JSON.stringify(data.blocks)),
    })
    .returning();

  return toAppTemplate(result[0]);
}

// Update existing template
export async function updateTemplate(
  id: string,
  data: {
    name: string;
    blocks: EmailBlock[];
    description?: string;
    category?: string;
    tags?: string[];
  },
): Promise<EmailTemplate | null> {
  const result = await db
    .update(templates)
    .set({
      name: data.name,
      description: data.description,
      category: data.category,
      tags: data.tags ? JSON.parse(JSON.stringify(data.tags)) : null,
      blocks: JSON.parse(JSON.stringify(data.blocks)),
      updatedAt: new Date(),
    })
    .where(eq(templates.id, id))
    .returning();

  return result[0] ? toAppTemplate(result[0]) : null;
}

// Delete template
export async function deleteTemplate(id: string): Promise<boolean> {
  const result = await db
    .delete(templates)
    .where(eq(templates.id, id))
    .returning();

  return result.length > 0;
}
