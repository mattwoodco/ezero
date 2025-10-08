import { type NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/resend";
import type { EmailBlock } from "@/types/email";

interface SendEmailRequestBody {
  to: string | string[];
  subject: string;
  blocks: EmailBlock[];
  from?: string;
}

/**
 * POST /api/send-email
 * Sends an email using the provided blocks, subject, and recipient(s)
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: SendEmailRequestBody = await request.json();

    // Validate required fields
    if (!body.to) {
      return NextResponse.json(
        { error: "Missing required field: to" },
        { status: 400 },
      );
    }

    if (!body.subject) {
      return NextResponse.json(
        { error: "Missing required field: subject" },
        { status: 400 },
      );
    }

    if (!body.blocks || !Array.isArray(body.blocks)) {
      return NextResponse.json(
        { error: "Missing or invalid field: blocks (must be an array)" },
        { status: 400 },
      );
    }

    if (body.blocks.length === 0) {
      return NextResponse.json(
        { error: "Blocks array cannot be empty" },
        { status: 400 },
      );
    }

    // Validate email block structure
    for (const block of body.blocks) {
      if (!block.id || !block.type) {
        return NextResponse.json(
          {
            error: "Invalid block structure: each block must have id and type",
          },
          { status: 400 },
        );
      }
    }

    // Check if RESEND_API_KEY is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 },
      );
    }

    // Send the email
    const result = await sendEmail({
      to: body.to,
      subject: body.subject,
      blocks: body.blocks,
      from: body.from,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        id: result.id,
        message: "Email sent successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("API error:", error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
