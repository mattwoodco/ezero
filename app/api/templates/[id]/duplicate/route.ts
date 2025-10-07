import { type NextRequest, NextResponse } from "next/server";
import { duplicateTemplate } from "@/lib/email-templates";

/**
 * POST /api/templates/[id]/duplicate
 * Duplicates a template with a new name
 * Body: { name: string }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Name is required",
        },
        { status: 400 },
      );
    }

    const template = await duplicateTemplate(id, name);

    if (!template) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    const { id } = await params;
    console.error(`Error duplicating template ${id}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to duplicate template",
      },
      { status: 500 },
    );
  }
}
