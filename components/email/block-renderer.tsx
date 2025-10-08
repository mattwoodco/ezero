"use client";

import {
  Button,
  Heading,
  Hr,
  Img,
  Section,
  Text,
} from "@react-email/components";
import type { EmailBlock } from "@/contexts/editor-context";
import { getActionTypeLabel } from "@/lib/gmail-actions-utils";
import type { GmailActionsSettings } from "@/types/email";

interface BlockContentProps {
  block: EmailBlock;
}

export function BlockContent({ block }: BlockContentProps) {
  const { type, content = "", settings = {} } = block;

  // Wrapper div to ensure minimum height and padding for all blocks
  const wrapperClass = "p-4 min-h-[60px]";

  switch (type) {
    case "heading":
      return (
        <div className={wrapperClass}>
          <Heading
            className="mx-0 my-4 p-0 text-[24px] font-semibold text-foreground"
            style={{
              margin: "16px 0",
              padding: 0,
              fontSize: "24px",
              fontWeight: 600,
              color: "hsl(var(--foreground))",
              ...((settings.style as React.CSSProperties) || {}),
            }}
            {...settings}
          >
            {content || "Heading"}
          </Heading>
        </div>
      );

    case "text":
      return (
        <div className={wrapperClass}>
          <Text
            className="text-[14px] text-foreground leading-[24px]"
            style={{
              fontSize: "14px",
              lineHeight: "24px",
              color: "hsl(var(--foreground))",
              margin: 0,
              ...((settings.style as React.CSSProperties) || {}),
            }}
            {...settings}
          >
            {content || "Empty text block"}
          </Text>
        </div>
      );

    case "button":
      return (
        <div className={wrapperClass}>
          <Section className="my-4 text-center">
            <Button
              className="rounded bg-primary px-5 py-3 text-center font-semibold text-[12px] text-primary-foreground no-underline"
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
                ...((settings.style as React.CSSProperties) || {}),
              }}
              href={(settings.href as string) || "#"}
              {...settings}
            >
              {content || "Click me"}
            </Button>
          </Section>
        </div>
      );

    case "image":
      return (
        <div className={wrapperClass}>
          <Section className="my-4">
            {settings.src ? (
              <Img
                src={settings.src as string}
                alt={(settings.alt as string) || ""}
                className="w-full"
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
                className="bg-muted h-32 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded"
                style={{
                  backgroundColor: "hsl(var(--muted))",
                  height: "128px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "hsl(var(--muted-foreground))",
                  border: "2px dashed hsl(var(--border))",
                  borderRadius: "4px",
                }}
              >
                Add image URL in settings
              </div>
            )}
          </Section>
        </div>
      );

    case "divider":
      return (
        <div className={wrapperClass}>
          <Hr
            className="mx-0 my-6 w-full border border-border border-solid"
            style={{
              width: "100%",
              border: "none",
              borderTop: "1px solid hsl(var(--border))",
              margin: "24px 0",
              ...((settings.style as React.CSSProperties) || {}),
            }}
            {...settings}
          />
        </div>
      );

    case "spacer":
      return (
        <div className={wrapperClass}>
          <Section
            className="my-4"
            style={{
              height: (settings.height as string) || "20px",
              ...((settings.style as React.CSSProperties) || {}),
            }}
            {...settings}
          />
        </div>
      );

    case "footer":
      return (
        <div className={wrapperClass}>
          <Section className="my-4">
            <Text
              className="text-[12px] text-muted-foreground text-center leading-[20px]"
              style={{
                fontSize: "12px",
                lineHeight: "20px",
                color: "hsl(var(--muted-foreground))",
                textAlign: "center",
                margin: 0,
                ...((settings.style as React.CSSProperties) || {}),
              }}
              {...settings}
            >
              {content ||
                "© 2025 Company Name. All rights reserved.\nUnsubscribe | Privacy Policy"}
            </Text>
          </Section>
        </div>
      );

    case "address":
      return (
        <div className={wrapperClass}>
          <Text
            className="text-[14px] text-foreground leading-[24px]"
            style={{
              fontSize: "14px",
              lineHeight: "24px",
              color: "hsl(var(--foreground))",
              margin: 0,
              ...((settings.style as React.CSSProperties) || {}),
            }}
            {...settings}
          >
            {content || "123 Main Street\nCity, State 12345\nCountry"}
          </Text>
        </div>
      );

    case "social":
      return (
        <div className={wrapperClass}>
          <Section className="my-4 text-center">
            <table style={{ margin: "0 auto" }}>
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
        </div>
      );

    case "rating":
      return (
        <div className={wrapperClass}>
          <Section className="my-4 text-center">
            <Text
              className="text-[20px]"
              style={{
                fontSize: "20px",
                textAlign: "center",
                margin: 0,
                ...((settings.style as React.CSSProperties) || {}),
              }}
            >
              {content || "⭐⭐⭐⭐⭐"}
            </Text>
          </Section>
        </div>
      );

    case "feedback":
      return (
        <div className={wrapperClass}>
          <Section className="my-4 text-center">
            <Text
              className="text-[14px] text-foreground mb-2"
              style={{
                fontSize: "14px",
                color: "hsl(var(--foreground))",
                marginBottom: "8px",
                textAlign: "center",
              }}
            >
              {content || "How was your experience?"}
            </Text>
            <table style={{ margin: "0 auto" }}>
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
        </div>
      );

    case "subscribe":
      return (
        <div className={wrapperClass}>
          <Section className="my-4 text-center">
            <Button
              className="rounded bg-primary px-5 py-3 text-center font-semibold text-[12px] text-primary-foreground no-underline"
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
                ...((settings.style as React.CSSProperties) || {}),
              }}
              href={(settings.href as string) || "#"}
              {...settings}
            >
              {content || "Subscribe to Newsletter"}
            </Button>
          </Section>
        </div>
      );

    case "track":
      return (
        <div className={wrapperClass}>
          <Section className="my-4">
            <Text
              className="text-[14px] text-foreground leading-[24px]"
              style={{
                fontSize: "14px",
                lineHeight: "24px",
                color: "hsl(var(--foreground))",
                margin: "0 0 8px 0",
              }}
            >
              Tracking Number:{" "}
              <strong>
                {(settings.trackingNumber as string) || "1234567890"}
              </strong>
            </Text>
            <Button
              className="rounded bg-primary px-4 py-2 text-center text-[12px] text-primary-foreground no-underline"
              style={{
                borderRadius: "6px",
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                fontSize: "12px",
                textDecoration: "none",
                display: "inline-block",
                padding: "8px 16px",
              }}
              href={(settings.trackingUrl as string) || "#"}
            >
              {content || "Track Package"}
            </Button>
          </Section>
        </div>
      );

    case "order":
      return (
        <div className={wrapperClass}>
          <Section className="my-4">
            <Text
              className="text-[16px] font-semibold text-foreground"
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "hsl(var(--foreground))",
                margin: "0 0 8px 0",
              }}
            >
              Order #{(settings.orderNumber as string) || "123456"}
            </Text>
            <Text
              className="text-[14px] text-foreground leading-[24px]"
              style={{
                fontSize: "14px",
                lineHeight: "24px",
                color: "hsl(var(--foreground))",
                margin: 0,
                ...((settings.style as React.CSSProperties) || {}),
              }}
            >
              {content || "Order Total: $99.99\nStatus: Processing"}
            </Text>
          </Section>
        </div>
      );

    case "viewDetails":
      return (
        <div className={wrapperClass}>
          <Section className="my-4 text-center">
            <Button
              className="rounded bg-primary px-5 py-3 text-center font-semibold text-[12px] text-primary-foreground no-underline"
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
                ...((settings.style as React.CSSProperties) || {}),
              }}
              href={(settings.href as string) || "#"}
              {...settings}
            >
              {content || "View Details"}
            </Button>
          </Section>
        </div>
      );

    case "favorite":
      return (
        <div className={wrapperClass}>
          <Section className="my-4 text-center">
            <Button
              className="rounded bg-primary px-5 py-3 text-center font-semibold text-[12px] text-primary-foreground no-underline"
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
                ...((settings.style as React.CSSProperties) || {}),
              }}
              href={(settings.href as string) || "#"}
              {...settings}
            >
              {content || "❤️ Add to Favorites"}
            </Button>
          </Section>
        </div>
      );

    case "pay":
      return (
        <div className={wrapperClass}>
          <Section className="my-4 text-center">
            <Button
              className="rounded bg-primary px-5 py-3 text-center font-semibold text-[12px] text-primary-foreground no-underline"
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
                ...((settings.style as React.CSSProperties) || {}),
              }}
              href={(settings.href as string) || "#"}
              {...settings}
            >
              {content || "💳 Pay Now"}
            </Button>
          </Section>
        </div>
      );

    case "rsvp":
      return (
        <div className={wrapperClass}>
          <Section className="my-4 text-center">
            <Button
              className="rounded bg-primary px-5 py-3 text-center font-semibold text-[12px] text-primary-foreground no-underline"
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
                ...((settings.style as React.CSSProperties) || {}),
              }}
              href={(settings.href as string) || "#"}
              {...settings}
            >
              {content || "RSVP Now"}
            </Button>
          </Section>
        </div>
      );

    case "confirm":
      return (
        <div className={wrapperClass}>
          <Section className="my-4 text-center">
            <Button
              className="rounded bg-primary px-5 py-3 text-center font-semibold text-[12px] text-primary-foreground no-underline"
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
                ...((settings.style as React.CSSProperties) || {}),
              }}
              href={(settings.href as string) || "#"}
              {...settings}
            >
              {content || "Confirm"}
            </Button>
          </Section>
        </div>
      );

    case "goto":
      return (
        <div className={wrapperClass}>
          <Section className="my-4 text-center">
            <Button
              className="rounded bg-primary px-5 py-3 text-center font-semibold text-[12px] text-primary-foreground no-underline"
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
                ...((settings.style as React.CSSProperties) || {}),
              }}
              href={(settings.href as string) || "#"}
              {...settings}
            >
              {content || "Go To →"}
            </Button>
          </Section>
        </div>
      );

    case "promocode":
      return (
        <div className={wrapperClass}>
          <Section className="my-4 text-center">
            <div
              style={{
                display: "inline-block",
                border: "2px dashed hsl(var(--border))",
                borderRadius: "8px",
                padding: "16px 24px",
                backgroundColor: "hsl(var(--muted))",
                ...((settings.style as React.CSSProperties) || {}),
              }}
            >
              <Text
                className="text-[12px] text-muted-foreground uppercase"
                style={{
                  fontSize: "12px",
                  color: "hsl(var(--muted-foreground))",
                  margin: "0 0 4px 0",
                  textTransform: "uppercase",
                }}
              >
                Promo Code
              </Text>
              <Text
                className="text-[20px] font-bold text-foreground"
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "hsl(var(--foreground))",
                  margin: 0,
                  fontFamily: "monospace",
                }}
              >
                {content || "SAVE20"}
              </Text>
            </div>
          </Section>
        </div>
      );

    case "qr":
      return (
        <div className={wrapperClass}>
          <Section className="my-4 text-center">
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
                  backgroundColor: "hsl(var(--muted))",
                  border: "2px dashed hsl(var(--border))",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                QR Code
              </div>
            )}
          </Section>
        </div>
      );

    case "gmailActions": {
      const gmailSettings = settings as unknown as GmailActionsSettings;
      const actions = gmailSettings.actions || [];

      if (actions.length === 0) {
        return (
          <div className={wrapperClass}>
            <Section
              className="my-4 p-4 border-2 border-dashed rounded"
              style={{
                margin: "16px 0",
                padding: "16px",
                border: "2px dashed hsl(var(--border))",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  color: "hsl(var(--muted-foreground))",
                  fontSize: "14px",
                }}
              >
                No Gmail Actions configured. Add actions in the settings panel.
              </Text>
            </Section>
          </div>
        );
      }

      return (
        <div className={wrapperClass}>
          <Section className="my-4">
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  actions.length === 1
                    ? "1fr"
                    : actions.length === 2
                      ? "1fr 1fr"
                      : "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                margin: "16px 0",
              }}
            >
              {actions.map((action, index) => {
                let buttonHref = "#";
                const buttonText = action.name;

                switch (action.type) {
                  case "ViewAction":
                    buttonHref = action.target || "#";
                    break;
                  case "ConfirmAction":
                    buttonHref = action.handler?.url || "#";
                    break;
                  case "SaveAction":
                    buttonHref = action.handler?.url || "#";
                    break;
                  case "RsvpAction":
                    break;
                  case "TrackAction":
                    buttonHref =
                      action.target || action.parcel?.trackingUrl || "#";
                    break;
                }

                return (
                  <div
                    key={`${action.type}-${action.name}-${index}`}
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <Button
                      className="rounded bg-primary px-4 py-3 text-center font-semibold text-[12px] text-primary-foreground no-underline w-full"
                      style={{
                        borderRadius: "6px",
                        backgroundColor: "hsl(var(--primary))",
                        color: "hsl(var(--primary-foreground))",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none",
                        textAlign: "center",
                        display: "inline-block",
                        padding: "12px 16px",
                        width: "100%",
                      }}
                      href={buttonHref}
                    >
                      {buttonText}
                    </Button>
                    <Text
                      style={{
                        fontSize: "10px",
                        color: "hsl(var(--muted-foreground))",
                        marginTop: "4px",
                        textAlign: "center",
                      }}
                    >
                      {getActionTypeLabel(action.type)}
                    </Text>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>
      );
    }

    default:
      return (
        <div className={wrapperClass}>
          <Text style={{ color: "hsl(var(--muted-foreground))" }}>
            Unknown block type: {type}
          </Text>
        </div>
      );
  }
}
