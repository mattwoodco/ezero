"use client";

import { createContext, type ReactNode, useContext } from "react";
import {
  useBlocks,
  usePreviewMode,
  useSelectedBlockId,
} from "@/lib/hooks/use-editor-state";
import {
  useHistory,
  useHistoryKeyboardShortcuts,
} from "@/lib/hooks/use-history";
import type { EditorContextValue } from "@/types/editor";
import type { EmailBlock } from "@/types/email";

/**
 * Editor context
 */
const EditorContext = createContext<EditorContextValue | undefined>(undefined);

/**
 * Props for EditorProvider
 */
interface EditorProviderProps {
  children: ReactNode;
}

/**
 * EditorProvider component that provides editor state and functions
 * to all child components
 */
export function EditorProvider({ children }: EditorProviderProps) {
  // Get blocks state and operations from nuqs
  const {
    blocks,
    addBlock: addBlockFromState,
    removeBlock: removeBlockFromState,
    updateBlock: updateBlockFromState,
    moveBlock: moveBlockFromState,
    duplicateBlock: duplicateBlockFromState,
    reorderBlocks: reorderBlocksFromState,
    setBlocks,
  } = useBlocks();

  // Get selected block ID from URL
  const [selectedBlockId, setSelectedBlockId] = useSelectedBlockId();

  // Get preview mode from URL
  const [previewModeRaw, setPreviewModeRaw] = usePreviewMode();

  // Convert string to PreviewMode type
  const previewMode: "desktop" | "mobile" | null =
    previewModeRaw === "desktop" || previewModeRaw === "mobile"
      ? previewModeRaw
      : null;

  const setPreviewMode = (mode: "desktop" | "mobile" | null) => {
    setPreviewModeRaw(mode || "");
  };

  // Setup history for undo/redo
  const { undo, redo, canUndo, canRedo } = useHistory(blocks, setBlocks);

  // Enable keyboard shortcuts for undo/redo
  useHistoryKeyboardShortcuts(undo, redo, canUndo, canRedo);

  // Wrap block operations to work with history
  const addBlock = (block: EmailBlock, position?: number) => {
    addBlockFromState(block, position);
  };

  const removeBlock = (blockId: string) => {
    removeBlockFromState(blockId);
    // Clear selection if the removed block was selected
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };

  const updateBlock = (blockId: string, updates: Partial<EmailBlock>) => {
    updateBlockFromState(blockId, updates);
  };

  const moveBlock = (blockId: string, direction: "up" | "down") => {
    moveBlockFromState(blockId, direction);
  };

  const duplicateBlock = (blockId: string) => {
    duplicateBlockFromState(blockId);
  };

  const reorderBlocks = (blockIds: string[]) => {
    reorderBlocksFromState(blockIds);
  };

  // Create context value
  const contextValue: EditorContextValue = {
    // State
    blocks,
    selectedBlockId: selectedBlockId || null,
    previewMode,

    // Block operations
    addBlock,
    removeBlock,
    updateBlock,
    moveBlock,
    duplicateBlock,
    reorderBlocks,

    // Selection
    setSelectedBlockId,

    // Preview
    setPreviewMode,

    // History
    undo,
    redo,
    canUndo,
    canRedo,
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
}

/**
 * Hook to access editor context
 * Must be used within EditorProvider
 *
 * @returns Editor context value with state and functions
 * @throws Error if used outside EditorProvider
 */
export function useEditor(): EditorContextValue {
  const context = useContext(EditorContext);

  if (context === undefined) {
    throw new Error("useEditor must be used within EditorProvider");
  }

  return context;
}

/**
 * Optional: Hook to check if we're inside EditorProvider
 * Useful for conditional rendering
 *
 * @returns Editor context value or undefined
 */
export function useEditorOptional(): EditorContextValue | undefined {
  return useContext(EditorContext);
}
