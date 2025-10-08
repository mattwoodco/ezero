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

    default:
      return (
        <div className={wrapperClass}>
          <Text style={{ color: "hsl(var(--muted-foreground))" }}>Unknown block type: {type}</Text>
        </div>
      );
  }
}
