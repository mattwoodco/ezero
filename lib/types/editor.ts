/**
 * Block type definitions for the email editor
 */
export type BlockType =
  | "text"
  | "heading"
  | "image"
  | "button"
  | "divider"
  | "spacer"
  | "columns"
  | "container";

/**
 * Base settings shared by all blocks
 */
export interface BaseBlockSettings {
  backgroundColor?: string;
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

/**
 * Text block specific content and settings
 */
export interface TextBlockContent {
  text: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right";
}

/**
 * Heading block specific content and settings
 */
export interface HeadingBlockContent {
  text: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  color?: string;
  textAlign?: "left" | "center" | "right";
}

/**
 * Image block specific content and settings
 */
export interface ImageBlockContent {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  align?: "left" | "center" | "right";
}

/**
 * Button block specific content and settings
 */
export interface ButtonBlockContent {
  text: string;
  href: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  align?: "left" | "center" | "right";
}

/**
 * Divider block specific content and settings
 */
export interface DividerBlockContent {
  color?: string;
  height?: number;
  width?: string;
}

/**
 * Spacer block specific content and settings
 */
export interface SpacerBlockContent {
  height: number;
}

/**
 * Columns block specific content and settings
 */
export interface ColumnsBlockContent {
  columns: EmailBlock[][];
  columnCount?: 2 | 3 | 4;
}

/**
 * Container block specific content and settings
 */
export interface ContainerBlockContent {
  children: EmailBlock[];
  maxWidth?: number;
}

/**
 * Union type for all possible block content types
 */
export type BlockContent =
  | TextBlockContent
  | HeadingBlockContent
  | ImageBlockContent
  | ButtonBlockContent
  | DividerBlockContent
  | SpacerBlockContent
  | ColumnsBlockContent
  | ContainerBlockContent;

/**
 * Core email block definition
 */
export interface EmailBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  settings: BaseBlockSettings;
}

/**
 * Preview mode options
 */
export type PreviewMode = "desktop" | "mobile" | null;

/**
 * Editor state definition
 */
export interface EditorState {
  blocks: EmailBlock[];
  selectedBlockId: string | null;
  previewMode: PreviewMode;
  isDirty: boolean;
  lastSaved: Date | null;
}

/**
 * Block action types for state updates
 */
export type BlockAction =
  | { type: "ADD_BLOCK"; block: EmailBlock; position?: number }
  | { type: "REMOVE_BLOCK"; blockId: string }
  | { type: "UPDATE_BLOCK"; blockId: string; updates: Partial<EmailBlock> }
  | { type: "MOVE_BLOCK"; blockId: string; direction: "up" | "down" }
  | { type: "DUPLICATE_BLOCK"; blockId: string }
  | { type: "REORDER_BLOCKS"; blockIds: string[] }
  | { type: "SET_BLOCKS"; blocks: EmailBlock[] };

/**
 * History state for undo/redo functionality
 */
export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

/**
 * Editor context value type
 */
export interface EditorContextValue {
  // State
  blocks: EmailBlock[];
  selectedBlockId: string | null;
  previewMode: PreviewMode;

  // Block operations
  addBlock: (block: EmailBlock, position?: number) => void;
  removeBlock: (blockId: string) => void;
  updateBlock: (blockId: string, updates: Partial<EmailBlock>) => void;
  moveBlock: (blockId: string, direction: "up" | "down") => void;
  duplicateBlock: (blockId: string) => void;
  reorderBlocks: (blockIds: string[]) => void;

  // Selection
  setSelectedBlockId: (blockId: string | null) => void;

  // Preview
  setPreviewMode: (mode: PreviewMode) => void;

  // History
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
