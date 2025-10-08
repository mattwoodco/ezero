import { type NextRequest, NextResponse } from "next/server";
import { createTemplate, listAllTemplates } from "@/lib/db/queries";
import { insertSchema } from "@/lib/db/schema";

/**
 * GET /api/templates
 * Lists all available templates
 */
export async function GET() {
  try {
    const templates = await listAllTemplates();

    return NextResponse.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error("Error listing templates:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to list templates",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/templates
 * Creates a new template
 * Body: { name: string, blocks: EmailBlock[], description?: string, category?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input using Zod schema
    const validation = insertSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid template data",
          details: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const { name, blocks, description, category } = validation.data;

    // Generate ID from name
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const template = await createTemplate({
      id,
      name,
      blocks,
      description: description ?? undefined,
      category: category ?? undefined,
    });

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error("Error saving template:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save template",
      },
      { status: 500 },
    );
  }
}
