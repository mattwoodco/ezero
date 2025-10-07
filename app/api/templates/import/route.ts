import { type NextRequest, NextResponse } from "next/server";
import {
  importAndSaveReactEmailTemplate,
  listReactEmailTemplates,
} from "@/lib/email-templates";

/**
 * GET /api/templates/import
 * Lists available React Email templates for import
 */
export async function GET() {
  try {
    const templates = await listReactEmailTemplates();

    return NextResponse.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error("Error listing React Email templates:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to list React Email templates",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/templates/import
 * Imports a React Email template
 * Body: { templateName: string, customName?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateName, customName } = body;

    if (!templateName) {
      return NextResponse.json(
        {
          success: false,
          error: "Template name is required",
        },
        { status: 400 },
      );
    }

    const template = await importAndSaveReactEmailTemplate(
      templateName,
      customName,
    );

    if (!template) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found or failed to import",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error("Error importing React Email template:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to import template",
      },
      { status: 500 },
    );
  }
}
