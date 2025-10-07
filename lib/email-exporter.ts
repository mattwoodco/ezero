import { render } from "@react-email/components";
import EmailWrapper from "@/components/email/email-wrapper";
import type { EmailBlock } from "@/types/email";

/**
 * Renders email blocks to HTML string
 * @param blocks - Array of EmailBlock objects to render
 * @returns HTML string suitable for email clients
 */
export async function renderEmailToHTML(blocks: EmailBlock[]): Promise<string> {
  const html = await render(EmailWrapper({ blocks }), {
    pretty: false,
  });

  return html;
}

/**
 * Renders email blocks to plain text
 * @param blocks - Array of EmailBlock objects to render
 * @returns Plain text version of the email
 */
export async function renderEmailToText(blocks: EmailBlock[]): Promise<string> {
  const text = await render(EmailWrapper({ blocks }), {
    plainText: true,
  });

  return text;
}
