"use client";

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import type { EmailBlock } from "@/types/email";

interface EmailRendererProps {
  blocks: EmailBlock[];
}

function renderBlock(block: EmailBlock) {
  const { type, content = "", settings = {} } = block;

  switch (type) {
    case "heading":
      return (
        <Heading
          key={block.id}
          className="mx-0 my-4 p-0 text-[24px] font-semibold text-black"
          {...settings}
        >
          {content}
        </Heading>
      );

    case "text":
      return (
        <Text
          key={block.id}
          className="text-[14px] text-black leading-[24px]"
          {...settings}
        >
          {content}
        </Text>
      );

    case "button":
      return (
        <Section key={block.id} className="my-4 text-center">
          <Button
            className="rounded bg-black px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
            href={(settings.href as string) || "#"}
            {...settings}
          >
            {content}
          </Button>
        </Section>
      );

    case "image":
      return (
        <Section key={block.id} className="my-4">
          <Img
            src={(settings.src as string) || ""}
            alt={(settings.alt as string) || ""}
            className="w-full"
            {...settings}
          />
        </Section>
      );

    case "divider":
      return (
        <Hr
          key={block.id}
          className="mx-0 my-6 w-full border border-gray-300 border-solid"
          {...settings}
        />
      );

    case "spacer":
      return (
        <Section
          key={block.id}
          className="my-4"
          style={{ height: (settings.height as string) || "20px" }}
          {...settings}
        />
      );

    default:
      return null;
  }
}

export function EmailRenderer({ blocks }: EmailRendererProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-0 max-w-[600px]">
            {blocks.map((block) => renderBlock(block))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
