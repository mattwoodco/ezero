import { type NextRequest, NextResponse } from "next/server";
import {
  deleteTemplate,
  loadTemplate,
  saveTemplate,
} from "@/lib/email-templates";
import type { EmailBlock } from "@/types/email";

/**
 * GET /api/templates/[id]
 * Gets a specific template by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const template = await loadTemplate(id);

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
    console.error(`Error loading template ${id}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load template",
      },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/templates/[id]
 * Updates an existing template
 * Body: { name: string, blocks: EmailBlock[], description?: string, category?: string }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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
      id,
      description,
      category,
    });

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    const { id } = await params;
    console.error(`Error updating template ${id}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update template",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/templates/[id]
 * Deletes a template
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const success = await deleteTemplate(id);

    if (!success) {
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
      message: "Template deleted successfully",
    });
  } catch (error) {
    const { id } = await params;
    console.error(`Error deleting template ${id}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete template",
      },
      { status: 500 },
    );
  }
}
