import { Resend } from "resend";
import type { EmailBlock } from "@/types/email";
import { renderEmailToHTML, renderEmailToText } from "./email-exporter";

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  blocks: EmailBlock[];
  from?: string;
}

export interface SendEmailResponse {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Sends an email using Resend
 * @param params - Email parameters including recipient, subject, and blocks
 * @returns Response object with success status and email ID or error
 */
export async function sendEmail({
  to,
  subject,
  blocks,
  from = process.env.FROM_EMAIL || "onboarding@resend.dev", // Use FROM_EMAIL from environment or fallback
}: SendEmailParams): Promise<SendEmailResponse> {
  try {
    // Render blocks to HTML and plain text
    const html = await renderEmailToHTML(blocks);
    const text = await renderEmailToText(blocks);

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("Resend API error:", error);
      return {
        success: false,
        error: error.message || "Failed to send email",
      };
    }

    return {
      success: true,
      id: data?.id,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
