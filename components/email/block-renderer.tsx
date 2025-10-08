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

    case "text": {
      // Filter out non-HTML attributes to avoid React warnings
      const { bold, italic, underline, style, ...textSettings } = settings as {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        style?: React.CSSProperties;
        [key: string]: unknown;
      };
      return (
        <div className={wrapperClass}>
          <Text
            className="text-[14px] text-foreground leading-[24px]"
            style={{
              fontSize: "14px",
              lineHeight: "24px",
              color: "hsl(var(--foreground))",
              margin: 0,
              fontWeight: bold ? "bold" : "normal",
              fontStyle: italic ? "italic" : "normal",
              textDecoration: underline ? "underline" : "none",
              ...((style as React.CSSProperties) || {}),
            }}
            {...textSettings}
          >
            {content || "Empty text block"}
          </Text>
        </div>
      );
    }

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

    case "order": {
      const order = settings.order as
        | import("@/types/email").OrderSettings
        | undefined;
      if (!order) {
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
      }

      return (
        <div className={wrapperClass}>
          <Section className="my-4">
            <div
              style={{
                maxWidth: "600px",
                margin: "20px auto",
                padding: "24px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              {/* Order Header */}
              <div style={{ marginBottom: "24px" }}>
                {order.merchantLogo && (
                  <>
                    {/* biome-ignore lint/performance/noImgElement: Email rendering requires standard img tags */}
                    <img
                      src={order.merchantLogo}
                      alt={order.merchantName || "Merchant"}
                      style={{ height: "40px", marginBottom: "12px" }}
                    />
                  </>
                )}
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "0 0 8px 0",
                  }}
                >
                  Order Confirmation
                </h2>
                <div style={{ color: "#6b7280", fontSize: "14px" }}>
                  Order #{order.orderNumber || "123456"} ·{" "}
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString()
                    : "Order Date"}
                </div>
              </div>

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                  {order.items.map(
                    (
                      item: import("@/types/email").OrderItem,
                      index: number,
                    ) => (
                      <div
                        key={item.sku || `${item.name}-${index}`}
                        style={{
                          display: "flex",
                          gap: "16px",
                          marginBottom: "16px",
                          paddingBottom: "16px",
                          borderBottom:
                            index < order.items.length - 1
                              ? "1px solid #f3f4f6"
                              : "none",
                        }}
                      >
                        {item.image && (
                          <>
                            {/* biome-ignore lint/performance/noImgElement: Email rendering requires standard img tags */}
                            <img
                              src={item.image}
                              alt={item.name || "Product"}
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </>
                        )}
                        <div style={{ flex: 1 }}>
                          <div
                            style={{ fontWeight: "600", marginBottom: "4px" }}
                          >
                            {item.name || "Product Name"}
                          </div>
                          {item.sku && (
                            <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                              SKU: {item.sku}
                            </div>
                          )}
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#6b7280",
                              marginTop: "4px",
                            }}
                          >
                            Qty: {item.quantity || 1} × $
                            {(item.price || 0).toFixed(2)}
                          </div>
                        </div>
                        <div style={{ fontWeight: "600" }}>
                          $
                          {((item.price || 0) * (item.quantity || 1)).toFixed(
                            2,
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}

              {/* Order Summary */}
              <div
                style={{
                  paddingTop: "16px",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "#6b7280" }}>Subtotal</span>
                  <span>${(order.subtotal || 0).toFixed(2)}</span>
                </div>
                {order.shipping !== undefined && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ color: "#6b7280" }}>Shipping</span>
                    <span>${order.shipping.toFixed(2)}</span>
                  </div>
                )}
                {order.tax !== undefined && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ color: "#6b7280" }}>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "16px",
                    paddingTop: "16px",
                    borderTop: "2px solid #e5e7eb",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  <span>Total</span>
                  <span>${(order.total || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* View Order Button */}
              {order.viewOrderUrl && (
                <div style={{ marginTop: "24px" }}>
                  <a
                    href={order.viewOrderUrl}
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "12px 24px",
                      backgroundColor: "#1d4ed8",
                      color: "#ffffff",
                      textDecoration: "none",
                      borderRadius: "6px",
                      fontWeight: "600",
                    }}
                  >
                    View Order Details
                  </a>
                </div>
              )}
            </div>
          </Section>
        </div>
      );
    }

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

    case "promocode": {
      const promo = settings.promotion as
        | import("@/types/email").PromotionSettings
        | undefined;
      if (!promo) {
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
      }

      return (
        <div className={wrapperClass}>
          <Section className="my-4">
            <div
              style={{
                maxWidth: "600px",
                margin: "20px auto",
                padding: "32px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "12px",
                color: "#ffffff",
                textAlign: "center",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              {promo.promotionImage && (
                <>
                  {/* biome-ignore lint/performance/noImgElement: Email rendering requires standard img tags */}
                  <img
                    src={promo.promotionImage}
                    alt="Promotion"
                    style={{
                      width: "100%",
                      maxWidth: "400px",
                      marginBottom: "24px",
                      borderRadius: "8px",
                    }}
                  />
                </>
              )}

              {promo.headline && (
                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    margin: "0 0 16px 0",
                  }}
                >
                  {promo.headline}
                </h2>
              )}

              <p
                style={{
                  fontSize: "16px",
                  marginBottom: "24px",
                  opacity: 0.95,
                }}
              >
                {promo.description || "Special offer just for you!"}
              </p>

              {promo.discountCode && (
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "8px",
                      opacity: 0.9,
                    }}
                  >
                    Use Code
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "12px 32px",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      border: "2px dashed rgba(255, 255, 255, 0.5)",
                      fontSize: "24px",
                      fontWeight: "bold",
                      letterSpacing: "2px",
                      fontFamily: "monospace",
                      marginBottom: "16px",
                    }}
                  >
                    {promo.discountCode}
                  </div>
                </div>
              )}

              {promo.availabilityEnds && (
                <div
                  style={{
                    fontSize: "14px",
                    opacity: 0.8,
                    marginTop: "16px",
                  }}
                >
                  Expires:{" "}
                  {new Date(promo.availabilityEnds).toLocaleDateString()}
                </div>
              )}

              {promo.promotionUrl && (
                <div style={{ marginTop: "24px" }}>
                  <a
                    href={promo.promotionUrl}
                    style={{
                      display: "inline-block",
                      padding: "14px 40px",
                      backgroundColor: "#ffffff",
                      color: "#667eea",
                      textDecoration: "none",
                      borderRadius: "8px",
                      fontWeight: "700",
                      fontSize: "16px",
                    }}
                  >
                    Shop Now
                  </a>
                </div>
              )}
            </div>
          </Section>
        </div>
      );
    }

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
                    buttonHref =
                      (Array.isArray(action.target)
                        ? action.target[0]
                        : action.target) || "#";
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
                      (Array.isArray(action.target)
                        ? action.target[0]
                        : action.target) ||
                      action.parcel?.trackingUrl ||
                      "#";
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

    // Reservation block renderers
    case "flight": {
      const flight = settings.flight as
        | import("@/types/email").FlightReservationSettings
        | undefined;
      if (!flight) return null;

      return (
        <div className={wrapperClass}>
          <Section className="my-4">
            <div
              style={{
                maxWidth: "600px",
                margin: "20px auto",
                padding: "24px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              {/* Airline Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#1d4ed8",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "12px",
                  }}
                >
                  <span
                    style={{
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    {flight.airlineCode || "AA"}
                  </span>
                </div>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "16px" }}>
                    {flight.airline || "Airline"}{" "}
                    {flight.flightNumber || "1234"}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "14px" }}>
                    Confirmation: {flight.reservationNumber || "ABC123"}
                  </div>
                </div>
              </div>

              {/* Flight Route */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "24px 0",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {flight.departureAirportCode || "SFO"}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "14px" }}>
                    {flight.departureTime
                      ? new Date(flight.departureTime).toLocaleString()
                      : "Departure Time"}
                  </div>
                  {flight.departureGate && (
                    <div style={{ fontSize: "12px", marginTop: "4px" }}>
                      Gate {flight.departureGate}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "0 16px",
                  }}
                >
                  <div
                    style={{
                      height: "2px",
                      backgroundColor: "#d1d5db",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        right: "-6px",
                        top: "-5px",
                        width: "12px",
                        height: "12px",
                        borderTop: "2px solid #d1d5db",
                        borderRight: "2px solid #d1d5db",
                        transform: "rotate(45deg)",
                      }}
                    />
                  </div>
                </div>

                <div style={{ flex: 1, textAlign: "right" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {flight.arrivalAirportCode || "JFK"}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "14px" }}>
                    {flight.arrivalTime
                      ? new Date(flight.arrivalTime).toLocaleString()
                      : "Arrival Time"}
                  </div>
                </div>
              </div>

              {/* Passenger & Seat Info */}
              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  paddingTop: "16px",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "4px",
                    }}
                  >
                    Passenger
                  </div>
                  <div style={{ fontWeight: "600" }}>
                    {flight.passengerName || "John Doe"}
                  </div>
                </div>
                {flight.seatNumber && (
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginBottom: "4px",
                      }}
                    >
                      Seat
                    </div>
                    <div style={{ fontWeight: "600" }}>{flight.seatNumber}</div>
                  </div>
                )}
              </div>

              {/* Boarding Pass */}
              {flight.ticketToken && (
                <div
                  style={{
                    marginTop: "24px",
                    padding: "16px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "8px",
                    }}
                  >
                    Boarding Pass
                  </div>
                  <div
                    style={{
                      fontSize: "32px",
                      letterSpacing: "4px",
                      fontFamily: "monospace",
                    }}
                  >
                    {flight.ticketToken.substring(0, 12)}
                  </div>
                </div>
              )}
            </div>
          </Section>
        </div>
      );
    }

    case "hotel": {
      const hotel = settings.lodging as
        | import("@/types/email").LodgingReservationSettings
        | undefined;
      if (!hotel) return null;

      return (
        <div className={wrapperClass}>
          <Section className="my-4">
            <div
              style={{
                maxWidth: "600px",
                margin: "20px auto",
                padding: "24px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              {/* Hotel Header */}
              <div style={{ marginBottom: "24px" }}>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "0 0 8px 0",
                  }}
                >
                  {hotel.hotelName || "Hotel Name"}
                </h2>
                <div style={{ color: "#6b7280", fontSize: "14px" }}>
                  Confirmation: {hotel.reservationNumber || "ABC123"}
                </div>
              </div>

              {/* Address */}
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "4px",
                  }}
                >
                  Address
                </div>
                <div style={{ fontSize: "14px" }}>
                  {hotel.hotelAddress?.streetAddress || "123 Main St"}
                  <br />
                  {hotel.hotelAddress?.addressLocality || "City"},{" "}
                  {hotel.hotelAddress?.addressRegion || "ST"}{" "}
                  {hotel.hotelAddress?.postalCode || "12345"}
                </div>
              </div>

              {/* Check-in/Check-out */}
              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  marginBottom: "24px",
                  paddingBottom: "24px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "4px",
                    }}
                  >
                    Check-in
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "16px" }}>
                    {hotel.checkinDate
                      ? new Date(hotel.checkinDate).toLocaleDateString()
                      : "Check-in Date"}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "4px",
                    }}
                  >
                    Check-out
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "16px" }}>
                    {hotel.checkoutDate
                      ? new Date(hotel.checkoutDate).toLocaleDateString()
                      : "Check-out Date"}
                  </div>
                </div>
              </div>

              {/* Guest Info */}
              <div style={{ display: "flex", gap: "24px" }}>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "4px",
                    }}
                  >
                    Guest Name
                  </div>
                  <div style={{ fontWeight: "600" }}>
                    {hotel.guestName || "John Doe"}
                  </div>
                </div>
                {hotel.roomType && (
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginBottom: "4px",
                      }}
                    >
                      Room Type
                    </div>
                    <div style={{ fontWeight: "600" }}>{hotel.roomType}</div>
                  </div>
                )}
              </div>
            </div>
          </Section>
        </div>
      );
    }

    case "train": {
      const train = settings.train as
        | import("@/types/email").TrainReservationSettings
        | undefined;
      if (!train) return null;

      return (
        <div className={wrapperClass}>
          <Section className="my-4">
            <div
              style={{
                maxWidth: "600px",
                margin: "20px auto",
                padding: "24px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              {/* Train Header */}
              <div style={{ marginBottom: "24px" }}>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "0 0 8px 0",
                  }}
                >
                  Train {train.trainNumber || "123"}
                </h2>
                <div style={{ color: "#6b7280", fontSize: "14px" }}>
                  Confirmation: {train.reservationNumber || "ABC123"}
                </div>
              </div>

              {/* Route */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "24px 0",
                  paddingBottom: "24px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {train.departureStation || "Departure Station"}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "14px" }}>
                    {train.departureTime
                      ? new Date(train.departureTime).toLocaleString()
                      : "Departure Time"}
                  </div>
                </div>

                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "0 16px",
                  }}
                >
                  <div
                    style={{
                      height: "2px",
                      backgroundColor: "#d1d5db",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        right: "-6px",
                        top: "-5px",
                        width: "12px",
                        height: "12px",
                        borderTop: "2px solid #d1d5db",
                        borderRight: "2px solid #d1d5db",
                        transform: "rotate(45deg)",
                      }}
                    />
                  </div>
                </div>

                <div style={{ flex: 1, textAlign: "right" }}>
                  <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {train.arrivalStation || "Arrival Station"}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "14px" }}>
                    {train.arrivalTime
                      ? new Date(train.arrivalTime).toLocaleString()
                      : "Arrival Time"}
                  </div>
                </div>
              </div>

              {/* Passenger & Seat Info */}
              <div style={{ display: "flex", gap: "24px" }}>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "4px",
                    }}
                  >
                    Passenger
                  </div>
                  <div style={{ fontWeight: "600" }}>
                    {train.passengerName || "John Doe"}
                  </div>
                </div>
                {train.coach && (
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginBottom: "4px",
                      }}
                    >
                      Coach
                    </div>
                    <div style={{ fontWeight: "600" }}>{train.coach}</div>
                  </div>
                )}
                {train.seatNumber && (
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginBottom: "4px",
                      }}
                    >
                      Seat
                    </div>
                    <div style={{ fontWeight: "600" }}>{train.seatNumber}</div>
                  </div>
                )}
              </div>
            </div>
          </Section>
        </div>
      );
    }

    case "bus": {
      const bus = settings.bus as
        | import("@/types/email").BusReservationSettings
        | undefined;
      if (!bus) return null;

      return (
        <div className={wrapperClass}>
          <Section className="my-4">
            <div
              style={{
                maxWidth: "600px",
                margin: "20px auto",
                padding: "24px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              {/* Bus Header */}
              <div style={{ marginBottom: "24px" }}>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "0 0 8px 0",
                  }}
                >
                  {bus.busCompany || "Bus Company"}
                </h2>
                <div style={{ color: "#6b7280", fontSize: "14px" }}>
                  Confirmation: {bus.reservationNumber || "ABC123"}
                </div>
              </div>

              {/* Route */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "24px 0",
                  paddingBottom: "24px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {bus.departureStop || "Departure Stop"}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "14px" }}>
                    {bus.departureTime
                      ? new Date(bus.departureTime).toLocaleString()
                      : "Departure Time"}
                  </div>
                </div>

                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "0 16px",
                  }}
                >
                  <div
                    style={{
                      height: "2px",
                      backgroundColor: "#d1d5db",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        right: "-6px",
                        top: "-5px",
                        width: "12px",
                        height: "12px",
                        borderTop: "2px solid #d1d5db",
                        borderRight: "2px solid #d1d5db",
                        transform: "rotate(45deg)",
                      }}
                    />
                  </div>
                </div>

                <div style={{ flex: 1, textAlign: "right" }}>
                  <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {bus.arrivalStop || "Arrival Stop"}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "14px" }}>
                    {bus.arrivalTime
                      ? new Date(bus.arrivalTime).toLocaleString()
                      : "Arrival Time"}
                  </div>
                </div>
              </div>

              {/* Passenger & Seat Info */}
              <div style={{ display: "flex", gap: "24px" }}>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "4px",
                    }}
                  >
                    Passenger
                  </div>
                  <div style={{ fontWeight: "600" }}>
                    {bus.passengerName || "John Doe"}
                  </div>
                </div>
                {bus.seatNumber && (
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginBottom: "4px",
                      }}
                    >
                      Seat
                    </div>
                    <div style={{ fontWeight: "600" }}>{bus.seatNumber}</div>
                  </div>
                )}
              </div>
            </div>
          </Section>
        </div>
      );
    }

    case "rental": {
      const rental = settings.rentalCar as
        | import("@/types/email").RentalCarReservationSettings
        | undefined;
      if (!rental) return null;

      return (
        <div className={wrapperClass}>
          <Section className="my-4">
            <div
              style={{
                maxWidth: "600px",
                margin: "20px auto",
                padding: "24px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              {/* Header */}
              <div style={{ marginBottom: "24px" }}>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "0 0 8px 0",
                  }}
                >
                  {rental.carBrand || "Car Brand"} {rental.carModel || "Model"}
                </h2>
                <div style={{ color: "#6b7280", fontSize: "14px" }}>
                  Confirmation: {rental.reservationNumber || "ABC123"}
                </div>
              </div>

              {/* Pickup/Dropoff */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "24px",
                  marginBottom: "24px",
                  paddingBottom: "24px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "4px",
                    }}
                  >
                    Pickup
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "16px" }}>
                    {rental.pickupLocation?.name || "Pickup Location"}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "14px" }}>
                    {rental.pickupTime
                      ? new Date(rental.pickupTime).toLocaleString()
                      : "Pickup Time"}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "4px",
                    }}
                  >
                    Dropoff
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "16px" }}>
                    {rental.dropoffLocation?.name || "Dropoff Location"}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "14px" }}>
                    {rental.dropoffTime
                      ? new Date(rental.dropoffTime).toLocaleString()
                      : "Dropoff Time"}
                  </div>
                </div>
              </div>

              {/* Renter Info */}
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "4px",
                  }}
                >
                  Renter Name
                </div>
                <div style={{ fontWeight: "600" }}>
                  {rental.renterName || "John Doe"}
                </div>
              </div>
            </div>
          </Section>
        </div>
      );
    }

    case "restaurant": {
      const restaurant = settings.restaurant as
        | import("@/types/email").FoodEstablishmentReservationSettings
        | undefined;
      if (!restaurant) return null;

      return (
        <div className={wrapperClass}>
          <Section className="my-4">
            <div
              style={{
                maxWidth: "600px",
                margin: "20px auto",
                padding: "24px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              {/* Restaurant Header */}
              <div style={{ marginBottom: "24px" }}>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "0 0 8px 0",
                  }}
                >
                  {restaurant.restaurantName || "Restaurant Name"}
                </h2>
                <div style={{ color: "#6b7280", fontSize: "14px" }}>
                  Confirmation: {restaurant.reservationNumber || "ABC123"}
                </div>
              </div>

              {/* Address */}
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "4px",
                  }}
                >
                  Address
                </div>
                <div style={{ fontSize: "14px" }}>
                  {restaurant.restaurantAddress?.streetAddress || "123 Main St"}
                  <br />
                  {restaurant.restaurantAddress?.addressLocality || "City"},{" "}
                  {restaurant.restaurantAddress?.addressRegion || "ST"}{" "}
                  {restaurant.restaurantAddress?.postalCode || "12345"}
                </div>
              </div>

              {/* Reservation Details */}
              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  paddingTop: "16px",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "4px",
                    }}
                  >
                    Date & Time
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "16px" }}>
                    {restaurant.reservationTime
                      ? new Date(restaurant.reservationTime).toLocaleString()
                      : "Reservation Time"}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "4px",
                    }}
                  >
                    Party Size
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "16px" }}>
                    {restaurant.partySize || 2} guests
                  </div>
                </div>
              </div>

              {/* Guest Name */}
              <div style={{ marginTop: "16px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "4px",
                  }}
                >
                  Guest Name
                </div>
                <div style={{ fontWeight: "600" }}>
                  {restaurant.guestName || "John Doe"}
                </div>
              </div>
            </div>
          </Section>
        </div>
      );
    }

    // Commerce block renderers
    case "invoice": {
      const invoice = settings.invoice as
        | import("@/types/email").InvoiceSettings
        | undefined;
      if (!invoice) return null;

      return (
        <div className={wrapperClass}>
          <Section className="my-4">
            <div
              style={{
                maxWidth: "600px",
                margin: "20px auto",
                padding: "24px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              {/* Invoice Header */}
              <div style={{ marginBottom: "24px" }}>
                {invoice.providerLogo && (
                  <>
                    {/* biome-ignore lint/performance/noImgElement: Email rendering requires standard img tags */}
                    <img
                      src={invoice.providerLogo}
                      alt={invoice.providerName || "Provider"}
                      style={{ height: "40px", marginBottom: "12px" }}
                    />
                  </>
                )}
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "0 0 8px 0",
                  }}
                >
                  Invoice
                </h2>
                <div style={{ color: "#6b7280", fontSize: "14px" }}>
                  Invoice #{invoice.invoiceNumber || "INV-123456"} ·{" "}
                  {invoice.invoiceDate
                    ? new Date(invoice.invoiceDate).toLocaleDateString()
                    : "Invoice Date"}
                </div>
              </div>

              {/* Payment Status */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                  padding: "12px",
                  backgroundColor:
                    invoice.paymentStatus === "Paid" ? "#ecfdf5" : "#fef2f2",
                  borderRadius: "6px",
                }}
              >
                <span style={{ fontWeight: "600" }}>Payment Status</span>
                <span
                  style={{
                    color:
                      invoice.paymentStatus === "Paid" ? "#059669" : "#dc2626",
                    fontWeight: "600",
                  }}
                >
                  {invoice.paymentStatus || "Unpaid"}
                </span>
              </div>

              {/* Due Date */}
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "4px",
                  }}
                >
                  Due Date
                </div>
                <div style={{ fontWeight: "600", fontSize: "16px" }}>
                  {invoice.dueDate
                    ? new Date(invoice.dueDate).toLocaleDateString()
                    : "Due Date"}
                </div>
              </div>

              {/* Line Items */}
              {invoice.items && invoice.items.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                  {invoice.items.map(
                    (
                      item: import("@/types/email").InvoiceItem,
                      index: number,
                    ) => (
                      <div
                        key={`${item.description}-${index}`}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                          paddingBottom: "12px",
                          borderBottom:
                            index < invoice.items.length - 1
                              ? "1px solid #f3f4f6"
                              : "none",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "600" }}>
                            {item.description || "Service"}
                          </div>
                          <div style={{ fontSize: "14px", color: "#6b7280" }}>
                            {item.quantity || 1} × $
                            {(item.unitPrice || 0).toFixed(2)}
                          </div>
                        </div>
                        <div style={{ fontWeight: "600" }}>
                          ${(item.total || 0).toFixed(2)}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}

              {/* Invoice Summary */}
              <div
                style={{
                  paddingTop: "16px",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "#6b7280" }}>Subtotal</span>
                  <span>${(invoice.subtotal || 0).toFixed(2)}</span>
                </div>
                {invoice.tax !== undefined && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ color: "#6b7280" }}>Tax</span>
                    <span>${invoice.tax.toFixed(2)}</span>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "16px",
                    paddingTop: "16px",
                    borderTop: "2px solid #e5e7eb",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  <span>Total Due</span>
                  <span>${(invoice.total || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Pay Button */}
              {invoice.paymentUrl && invoice.paymentStatus !== "Paid" && (
                <div style={{ marginTop: "24px" }}>
                  <a
                    href={invoice.paymentUrl}
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "12px 24px",
                      backgroundColor: "#059669",
                      color: "#ffffff",
                      textDecoration: "none",
                      borderRadius: "6px",
                      fontWeight: "600",
                    }}
                  >
                    Pay Invoice
                  </a>
                </div>
              )}
            </div>
          </Section>
        </div>
      );
    }

    // Additional action block renderers
    case "update": {
      const updateAction = settings.gmailAction as
        | { name?: string; target?: string | string[]; description?: string }
        | undefined;
      const actionName = updateAction?.name || content || "Update";
      const actionTarget =
        updateAction?.target || (settings.href as string) || "#";
      const actionDescription = updateAction?.description;

      return (
        <div className={wrapperClass}>
          <Section className="my-4 text-center">
            <a
              href={
                Array.isArray(actionTarget) ? actionTarget[0] : actionTarget
              }
              style={{
                display: "inline-block",
                padding: "12px 32px",
                backgroundColor: "#f59e0b",
                color: "#ffffff",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              {actionName}
            </a>
            {actionDescription && (
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                {actionDescription}
              </div>
            )}
          </Section>
        </div>
      );
    }

    case "cancel": {
      const cancelAction = settings.gmailAction as
        | { name?: string; target?: string | string[]; description?: string }
        | undefined;
      const actionName = cancelAction?.name || content || "Cancel";
      const actionTarget =
        cancelAction?.target || (settings.href as string) || "#";
      const actionDescription = cancelAction?.description;

      return (
        <div className={wrapperClass}>
          <Section className="my-4 text-center">
            <a
              href={
                Array.isArray(actionTarget) ? actionTarget[0] : actionTarget
              }
              style={{
                display: "inline-block",
                padding: "12px 32px",
                backgroundColor: "#dc2626",
                color: "#ffffff",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              {actionName}
            </a>
            {actionDescription && (
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                {actionDescription}
              </div>
            )}
          </Section>
        </div>
      );
    }

    case "download": {
      const downloadAction = settings.gmailAction as
        | { name?: string; target?: string | string[]; description?: string }
        | undefined;
      const actionName = downloadAction?.name || content || "Download";
      const actionTarget =
        downloadAction?.target || (settings.href as string) || "#";
      const actionDescription = downloadAction?.description;

      return (
        <div className={wrapperClass}>
          <Section className="my-4 text-center">
            <a
              href={
                Array.isArray(actionTarget) ? actionTarget[0] : actionTarget
              }
              style={{
                display: "inline-block",
                padding: "12px 32px",
                backgroundColor: "#1d4ed8",
                color: "#ffffff",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              {actionName}
            </a>
            {actionDescription && (
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                {actionDescription}
              </div>
            )}
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
