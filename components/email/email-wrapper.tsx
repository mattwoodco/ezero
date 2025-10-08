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
import { generateJsonLd } from "@/lib/gmail-actions-utils";
import type { EmailBlock, GmailActionsSettings } from "@/types/email";

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

    case "footer":
      return (
        <Section key={block.id} style={{ margin: "24px 0 0 0" }}>
          <Text
            style={{
              fontSize: "12px",
              lineHeight: "20px",
              color: "#666666",
              textAlign: "center",
              margin: 0,
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
              ...((settings.style as React.CSSProperties) || {}),
            }}
            {...settings}
          >
            {content ||
              "© 2025 Company Name. All rights reserved.\nUnsubscribe | Privacy Policy"}
          </Text>
        </Section>
      );

    case "address":
      return (
        <Text
          key={block.id}
          style={{
            fontSize: "14px",
            lineHeight: "24px",
            color: "#000000",
            margin: "0 0 16px 0",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
            ...((settings.style as React.CSSProperties) || {}),
          }}
          {...settings}
        >
          {content || "123 Main Street\nCity, State 12345\nCountry"}
        </Text>
      );

    case "social":
      return (
        <Section
          key={block.id}
          style={{ margin: "16px 0", textAlign: "center" }}
        >
          <table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "0 8px" }}>
                  <a
                    href={(settings.facebook as string) || "#"}
                    style={{ textDecoration: "none" }}
                  >
                    <span style={{ fontSize: "24px" }}>📘</span>
                  </a>
                </td>
                <td style={{ padding: "0 8px" }}>
                  <a
                    href={(settings.twitter as string) || "#"}
                    style={{ textDecoration: "none" }}
                  >
                    <span style={{ fontSize: "24px" }}>🐦</span>
                  </a>
                </td>
                <td style={{ padding: "0 8px" }}>
                  <a
                    href={(settings.instagram as string) || "#"}
                    style={{ textDecoration: "none" }}
                  >
                    <span style={{ fontSize: "24px" }}>📷</span>
                  </a>
                </td>
                <td style={{ padding: "0 8px" }}>
                  <a
                    href={(settings.linkedin as string) || "#"}
                    style={{ textDecoration: "none" }}
                  >
                    <span style={{ fontSize: "24px" }}>💼</span>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </Section>
      );

    case "rating":
      return (
        <Section
          key={block.id}
          style={{ margin: "16px 0", textAlign: "center" }}
        >
          <Text
            style={{
              fontSize: "20px",
              textAlign: "center",
              margin: 0,
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
              ...((settings.style as React.CSSProperties) || {}),
            }}
          >
            {content || "⭐⭐⭐⭐⭐"}
          </Text>
        </Section>
      );

    case "feedback":
      return (
        <Section
          key={block.id}
          style={{ margin: "16px 0", textAlign: "center" }}
        >
          <Text
            style={{
              fontSize: "14px",
              color: "#000000",
              marginBottom: "8px",
              textAlign: "center",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
            }}
          >
            {content || "How was your experience?"}
          </Text>
          <table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "0 4px" }}>
                  <a
                    href={(settings.ratingUrl as string) || "#"}
                    style={{ textDecoration: "none", fontSize: "24px" }}
                  >
                    😞
                  </a>
                </td>
                <td style={{ padding: "0 4px" }}>
                  <a
                    href={(settings.ratingUrl as string) || "#"}
                    style={{ textDecoration: "none", fontSize: "24px" }}
                  >
                    😐
                  </a>
                </td>
                <td style={{ padding: "0 4px" }}>
                  <a
                    href={(settings.ratingUrl as string) || "#"}
                    style={{ textDecoration: "none", fontSize: "24px" }}
                  >
                    🙂
                  </a>
                </td>
                <td style={{ padding: "0 4px" }}>
                  <a
                    href={(settings.ratingUrl as string) || "#"}
                    style={{ textDecoration: "none", fontSize: "24px" }}
                  >
                    😊
                  </a>
                </td>
                <td style={{ padding: "0 4px" }}>
                  <a
                    href={(settings.ratingUrl as string) || "#"}
                    style={{ textDecoration: "none", fontSize: "24px" }}
                  >
                    😍
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </Section>
      );

    case "subscribe":
      return (
        <Section
          key={block.id}
          style={{ margin: "16px 0", textAlign: "center" }}
        >
          <Button
            style={{
              borderRadius: "6px",
              backgroundColor: "#0070f3",
              color: "#ffffff",
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
            {content || "Subscribe to Newsletter"}
          </Button>
        </Section>
      );

    case "track":
      return (
        <Section key={block.id} style={{ margin: "16px 0" }}>
          <Text
            style={{
              fontSize: "14px",
              lineHeight: "24px",
              color: "#000000",
              margin: "0 0 8px 0",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
            }}
          >
            Tracking Number:{" "}
            <strong>
              {(settings.trackingNumber as string) || "1234567890"}
            </strong>
          </Text>
          <Button
            style={{
              borderRadius: "6px",
              backgroundColor: "#0070f3",
              color: "#ffffff",
              fontSize: "12px",
              textDecoration: "none",
              display: "inline-block",
              padding: "8px 16px",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
            }}
            href={(settings.trackingUrl as string) || "#"}
          >
            {content || "Track Package"}
          </Button>
        </Section>
      );

    case "order":
      return (
        <Section key={block.id} style={{ margin: "16px 0" }}>
          <Text
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#000000",
              margin: "0 0 8px 0",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
            }}
          >
            Order #{(settings.orderNumber as string) || "123456"}
          </Text>
          <Text
            style={{
              fontSize: "14px",
              lineHeight: "24px",
              color: "#000000",
              margin: 0,
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
              ...((settings.style as React.CSSProperties) || {}),
            }}
          >
            {content || "Order Total: $99.99\nStatus: Processing"}
          </Text>
        </Section>
      );

    case "viewDetails":
      return (
        <Section
          key={block.id}
          style={{ margin: "16px 0", textAlign: "center" }}
        >
          <Button
            style={{
              borderRadius: "6px",
              backgroundColor: "#0070f3",
              color: "#ffffff",
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
            {content || "View Details"}
          </Button>
        </Section>
      );

    case "favorite":
      return (
        <Section
          key={block.id}
          style={{ margin: "16px 0", textAlign: "center" }}
        >
          <Button
            style={{
              borderRadius: "6px",
              backgroundColor: "#0070f3",
              color: "#ffffff",
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
            {content || "❤️ Add to Favorites"}
          </Button>
        </Section>
      );

    case "pay":
      return (
        <Section
          key={block.id}
          style={{ margin: "16px 0", textAlign: "center" }}
        >
          <Button
            style={{
              borderRadius: "6px",
              backgroundColor: "#0070f3",
              color: "#ffffff",
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
            {content || "💳 Pay Now"}
          </Button>
        </Section>
      );

    case "rsvp":
      return (
        <Section
          key={block.id}
          style={{ margin: "16px 0", textAlign: "center" }}
        >
          <Button
            style={{
              borderRadius: "6px",
              backgroundColor: "#0070f3",
              color: "#ffffff",
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
            {content || "RSVP Now"}
          </Button>
        </Section>
      );

    case "confirm":
      return (
        <Section
          key={block.id}
          style={{ margin: "16px 0", textAlign: "center" }}
        >
          <Button
            style={{
              borderRadius: "6px",
              backgroundColor: "#0070f3",
              color: "#ffffff",
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
            {content || "Confirm"}
          </Button>
        </Section>
      );

    case "goto":
      return (
        <Section
          key={block.id}
          style={{ margin: "16px 0", textAlign: "center" }}
        >
          <Button
            style={{
              borderRadius: "6px",
              backgroundColor: "#0070f3",
              color: "#ffffff",
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
            {content || "Go To →"}
          </Button>
        </Section>
      );

    case "promocode":
      return (
        <Section
          key={block.id}
          style={{ margin: "16px 0", textAlign: "center" }}
        >
          <div
            style={{
              display: "inline-block",
              border: "2px dashed #cccccc",
              borderRadius: "8px",
              padding: "16px 24px",
              backgroundColor: "#f5f5f5",
              ...((settings.style as React.CSSProperties) || {}),
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                color: "#666666",
                margin: "0 0 4px 0",
                textTransform: "uppercase",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
              }}
            >
              Promo Code
            </Text>
            <Text
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#000000",
                margin: 0,
                fontFamily: "monospace",
              }}
            >
              {content || "SAVE20"}
            </Text>
          </div>
        </Section>
      );

    case "qr":
      return (
        <Section
          key={block.id}
          style={{ margin: "16px 0", textAlign: "center" }}
        >
          {settings.src ? (
            <Img
              src={settings.src as string}
              alt={(settings.alt as string) || "QR Code"}
              style={{
                width: (settings.width as string) || "200px",
                height: (settings.height as string) || "200px",
                display: "inline-block",
                ...((settings.style as React.CSSProperties) || {}),
              }}
            />
          ) : (
            <div
              style={{
                width: "200px",
                height: "200px",
                display: "inline-block",
                backgroundColor: "#f5f5f5",
                border: "2px dashed #cccccc",
                borderRadius: "8px",
                color: "#666666",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
              }}
            >
              QR Code
            </div>
          )}
        </Section>
      );

    case "gmailActions": {
      const gmailSettings = settings as unknown as GmailActionsSettings;
      const actions = gmailSettings.actions || [];

      if (actions.length === 0) {
        return (
          <Section
            key={block.id}
            style={{
              margin: "16px 0",
              padding: "16px",
              border: "2px dashed #cccccc",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                color: "#666666",
                fontSize: "14px",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
              }}
            >
              No Gmail Actions configured.
            </Text>
          </Section>
        );
      }

      return (
        <Section key={block.id} style={{ margin: "16px 0" }}>
          <table
            width="100%"
            cellPadding="0"
            cellSpacing="0"
            style={{ margin: "16px 0" }}
          >
            <tbody>
              <tr>
                {actions.map((action, index) => {
                  let buttonHref = "#";
                  const buttonText = action.name;

                  switch (action.type) {
                    case "ViewAction":
                      buttonHref = action.target || "#";
                      break;
                    case "ConfirmAction":
                    case "SaveAction":
                      buttonHref = action.handler?.url || "#";
                      break;
                    case "TrackAction":
                      buttonHref =
                        action.target || action.parcel?.trackingUrl || "#";
                      break;
                    case "RsvpAction":
                      buttonHref = "#";
                      break;
                  }

                  return (
                    <td
                      key={index}
                      style={{
                        padding: "0 6px",
                        textAlign: "center",
                        width: `${100 / actions.length}%`,
                      }}
                    >
                      <Button
                        href={buttonHref}
                        style={{
                          borderRadius: "6px",
                          backgroundColor: "#0070f3",
                          color: "#ffffff",
                          fontSize: "12px",
                          fontWeight: 600,
                          textDecoration: "none",
                          textAlign: "center",
                          display: "inline-block",
                          padding: "12px 16px",
                          width: "100%",
                          fontFamily:
                            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
                        }}
                      >
                        {buttonText}
                      </Button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </Section>
      );
    }

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
  // Collect all Gmail Actions from blocks
  const gmailActionsBlocks = blocks.filter(
    (block) => block.type === "gmailActions",
  );

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
        {/* Inject JSON-LD for Gmail Actions */}
        {gmailActionsBlocks.map((block) => {
          const settings = block.settings as unknown as GmailActionsSettings;
          const actions = settings?.actions || [];

          return actions.map((action, index) => {
            const jsonLd = generateJsonLd(action);
            return (
              <script
                key={`${block.id}-${index}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: jsonLd }}
              />
            );
          });
        })}
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
