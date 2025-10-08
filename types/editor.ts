import type { EmailBlock } from "./email";

/**
 * Editor context value type
 */
export interface EditorContextValue {
  // State
  blocks: EmailBlock[];
  selectedBlockId: string | null;
  previewMode: "desktop" | "mobile" | null;

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
  setPreviewMode: (mode: "desktop" | "mobile" | null) => void;

  // History
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
