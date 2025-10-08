import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type * as React from "react";
import type { EmailBlock } from "@/types/email";

interface EmailWrapperProps {
  blocks: EmailBlock[];
  previewText?: string;
  title?: string;
}

/**
 * Renders a single email block with proper inline styles for email clients
 */
function renderBlock(block: EmailBlock) {
  const { type, content = "", settings = {} } = block;

  switch (type) {
    case "heading":
      return (
        <Heading
          key={block.id}
          style={{
            margin: "16px 0",
            padding: 0,
            fontSize: "24px",
            fontWeight: 600,
            color: "hsl(var(--foreground))",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
            ...((settings.style as React.CSSProperties) || {}),
          }}
          {...settings}
        >
          {content || "Heading"}
        </Heading>
      );

    case "text":
      return (
        <Text
          key={block.id}
          style={{
            fontSize: "14px",
            lineHeight: "24px",
            color: "hsl(var(--foreground))",
            margin: "0 0 16px 0",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
            ...((settings.style as React.CSSProperties) || {}),
          }}
          {...settings}
        >
          {content || "Empty text block"}
        </Text>
      );

    case "button":
      return (
        <Section
          key={block.id}
          style={{ margin: "16px 0", textAlign: "center" }}
        >
          <Button
            style={{
              borderRadius: "6px",
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
              fontSize: "12px",
              fontWeight: 600,
              textDecoration: "none",
              textAlign: "center",
              display: "inline-block",
              padding: "12px 20px",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
              ...((settings.style as React.CSSProperties) || {}),
            }}
            href={(settings.href as string) || "#"}
            {...settings}
          >
            {content || "Click me"}
          </Button>
        </Section>
      );

    case "image":
      return (
        <Section key={block.id} style={{ margin: "16px 0" }}>
          {settings.src ? (
            <Img
              src={settings.src as string}
              alt={(settings.alt as string) || ""}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                ...((settings.style as React.CSSProperties) || {}),
              }}
              {...settings}
            />
          ) : (
            <div
              style={{
                backgroundColor: "hsl(var(--muted))",
                height: "128px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "hsl(var(--muted-foreground))",
                border: "2px dashed hsl(var(--border))",
                borderRadius: "4px",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
              }}
            >
              Add image URL in settings
            </div>
          )}
        </Section>
      );

    case "divider":
      return (
        <Hr
          key={block.id}
          style={{
            width: "100%",
            border: "none",
            borderTop: "1px solid hsl(var(--border))",
            margin: "24px 0",
            ...((settings.style as React.CSSProperties) || {}),
          }}
          {...settings}
        />
      );

    case "spacer":
      return (
        <Section
          key={block.id}
          style={{
            height: (settings.height as string) || "20px",
            ...((settings.style as React.CSSProperties) || {}),
          }}
          {...settings}
        />
      );

    default:
      return (
        <Text
          key={block.id}
          style={{
            color: "hsl(var(--muted-foreground))",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
          }}
        >
          Unknown block type: {type}
        </Text>
      );
  }
}

/**
 * EmailWrapper - Production-ready email component wrapper
 *
 * Wraps an array of EmailBlock[] in proper React Email structure with:
 * - Email client compatible HTML structure
 * - Proper meta tags and DOCTYPE
 * - Inline styles for maximum email client compatibility
 * - Responsive container with max-width
 * - Web-safe font fallbacks
 *
 * Compatible with @react-email/render for HTML generation and Resend for sending.
 *
 * @param blocks - Array of email blocks to render
 * @param previewText - Preview text shown in email client inbox (optional)
 * @param title - Email title/subject for the head tag (optional)
 */
export function EmailWrapper({
  blocks,
  previewText,
  title,
}: EmailWrapperProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        {title && <title>{title}</title>}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta
          name="format-detection"
          content="telephone=no,address=no,email=no,date=no,url=no"
        />
      </Head>
      {previewText && <Preview>{previewText}</Preview>}
      <Body
        style={{
          backgroundColor: "hsl(var(--background))",
          margin: 0,
          padding: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <Container
          style={{
            margin: "0 auto",
            padding: "20px 12px",
            maxWidth: "600px",
            width: "100%",
          }}
        >
          {blocks.map((block) => renderBlock(block))}
        </Container>
      </Body>
    </Html>
  );
}

/**
 * Default export for compatibility with @react-email/render
 */
export default EmailWrapper;
