/**
 * EmailWrapper Usage Examples
 *
 * This file demonstrates how to use the EmailWrapper component
 * with @react-email/render and Resend for production email sending.
 */

import { render } from "@react-email/components";
import type { EmailBlock } from "@/types/email";
import { EmailWrapper } from "./email-wrapper";

// ============================================================================
// Example 1: Basic Usage - Simple Welcome Email
// ============================================================================

const welcomeBlocks: EmailBlock[] = [
  {
    id: "1",
    type: "heading",
    content: "Welcome to Our Service!",
    settings: {},
  },
  {
    id: "2",
    type: "text",
    content:
      "We're thrilled to have you on board. Get started by exploring our features.",
    settings: {},
  },
  {
    id: "3",
    type: "button",
    content: "Get Started",
    settings: {
      href: "https://example.com/onboarding",
    },
  },
];

async function renderWelcomeEmail() {
  const html = await render(
    EmailWrapper({
      blocks: welcomeBlocks,
      previewText: "Welcome! Get started with our platform",
      title: "Welcome Email",
    }),
  );
  return html;
}

// ============================================================================
// Example 2: Advanced Usage - Email with Custom Styling
// ============================================================================

const styledBlocks: EmailBlock[] = [
  {
    id: "1",
    type: "heading",
    content: "Special Announcement",
    settings: {
      style: {
        color: "#4F46E5", // Indigo color
        fontSize: "32px",
        textAlign: "center",
      },
    },
  },
  {
    id: "2",
    type: "image",
    content: "",
    settings: {
      src: "https://example.com/images/announcement.jpg",
      alt: "Special announcement banner",
      style: {
        borderRadius: "8px",
      },
    },
  },
  {
    id: "3",
    type: "spacer",
    settings: {
      height: "40px",
    },
  },
  {
    id: "4",
    type: "text",
    content:
      "We have exciting news to share with you about our latest updates.",
    settings: {
      style: {
        fontSize: "16px",
        textAlign: "center",
      },
    },
  },
  {
    id: "5",
    type: "button",
    content: "Learn More",
    settings: {
      href: "https://example.com/announcement",
      style: {
        backgroundColor: "#4F46E5",
        fontSize: "14px",
        padding: "16px 32px",
      },
    },
  },
  {
    id: "6",
    type: "divider",
    settings: {},
  },
  {
    id: "7",
    type: "text",
    content: "Questions? Contact our support team anytime.",
    settings: {
      style: {
        fontSize: "12px",
        color: "hsl(var(--muted-foreground))",
        textAlign: "center",
      },
    },
  },
];

async function renderStyledEmail() {
  const html = await render(
    EmailWrapper({
      blocks: styledBlocks,
      previewText: "Special announcement - Don't miss out!",
      title: "Announcement",
    }),
  );
  return html;
}

// ============================================================================
// Example 3: Integration with Resend (Production)
// ============================================================================

import { Resend } from "resend";

async function sendEmailViaResend() {
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Render email to HTML
  const html = await render(
    EmailWrapper({
      blocks: welcomeBlocks,
      previewText: "Welcome to our platform",
      title: "Welcome",
    }),
  );

  // Send via Resend
  const { data, error } = await resend.emails.send({
    from: "noreply@yourdomain.com",
    to: "user@example.com",
    subject: "Welcome to Our Platform",
    html,
  });

  if (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }

  console.log("Email sent successfully:", data);
  return { success: true, data };
}

// ============================================================================
// Example 4: Using with the Email Exporter Helper Functions
// ============================================================================

import { renderEmailToHTML, renderEmailToText } from "@/lib/email-exporter";

async function exportEmailExample() {
  const blocks: EmailBlock[] = [
    {
      id: "1",
      type: "heading",
      content: "Your Order Confirmation",
    },
    {
      id: "2",
      type: "text",
      content:
        "Thank you for your order. Your items will ship within 2-3 business days.",
    },
    {
      id: "3",
      type: "button",
      content: "Track Your Order",
      settings: {
        href: "https://example.com/track/12345",
      },
    },
  ];

  // Get HTML version
  const htmlVersion = await renderEmailToHTML(blocks);

  // Get plain text version (for email fallback)
  const textVersion = await renderEmailToText(blocks);

  return { html: htmlVersion, text: textVersion };
}

// ============================================================================
// Example 5: Dynamic Email Generation from User Data
// ============================================================================

interface UserData {
  name: string;
  email: string;
  verificationLink: string;
}

function generateVerificationEmail(user: UserData): EmailBlock[] {
  return [
    {
      id: "1",
      type: "heading",
      content: `Hi ${user.name}!`,
    },
    {
      id: "2",
      type: "text",
      content:
        "Please verify your email address to complete your registration.",
    },
    {
      id: "3",
      type: "button",
      content: "Verify Email Address",
      settings: {
        href: user.verificationLink,
      },
    },
    {
      id: "4",
      type: "divider",
    },
    {
      id: "5",
      type: "text",
      content:
        "If you didn't create an account, you can safely ignore this email.",
      settings: {
        style: {
          fontSize: "12px",
          color: "hsl(var(--muted-foreground))",
        },
      },
    },
  ];
}

async function sendVerificationEmail(user: UserData) {
  const blocks = generateVerificationEmail(user);

  const _html = await render(
    EmailWrapper({
      blocks,
      previewText: "Verify your email address",
      title: "Email Verification",
    }),
  );

  // Send with your preferred email service
  // ...
}

// ============================================================================
// Example 6: Testing Email Rendering Locally
// ============================================================================

async function testEmailLocally() {
  const testBlocks: EmailBlock[] = [
    {
      id: "1",
      type: "heading",
      content: "Test Email",
    },
    {
      id: "2",
      type: "text",
      content: "This is a test email to verify the rendering.",
    },
  ];

  const html = await render(
    EmailWrapper({
      blocks: testBlocks,
      previewText: "Test email",
    }),
  );

  // Save to file for inspection
  const fs = require("node:fs");
  const path = require("node:path");
  const outputPath = path.join(process.cwd(), "test-email.html");
  fs.writeFileSync(outputPath, html);

  console.log(`Test email saved to: ${outputPath}`);
  console.log("Open this file in a browser to preview the email.");
}

// ============================================================================
// Export examples
// ============================================================================

export {
  renderWelcomeEmail,
  renderStyledEmail,
  sendEmailViaResend,
  exportEmailExample,
  generateVerificationEmail,
  sendVerificationEmail,
  testEmailLocally,
};
