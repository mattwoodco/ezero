export type EmailBlockType =
  | "text"
  | "heading"
  | "button"
  | "image"
  | "divider"
  | "spacer";

export interface EmailBlock {
  id: string;
  type: EmailBlockType;
  content?: string;
  settings?: Record<string, unknown>;
}
