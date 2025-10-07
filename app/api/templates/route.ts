import { type NextRequest, NextResponse } from "next/server";
import {
  getStarterTemplates,
  listTemplates,
  saveTemplate,
} from "@/lib/email-templates";
import type { EmailBlock } from "@/types/email";

/**
 * GET /api/templates
 * Lists all available templates
 * Query params:
 *   - starters: 'true' to include/initialize starter templates
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeStarters = searchParams.get("starters") === "true";

    const templates = includeStarters
      ? await getStarterTemplates()
      : await listTemplates();

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
    const { name, blocks, description, category } = body;

    if (!name || !blocks || !Array.isArray(blocks)) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and blocks array are required",
        },
        { status: 400 },
      );
    }

    const template = await saveTemplate(name, blocks as EmailBlock[], {
      description,
      category,
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
