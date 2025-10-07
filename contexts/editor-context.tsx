"use client";

import { parseAsString, useQueryState } from "nuqs";
import { createContext, useCallback, useContext, useState } from "react";

export interface EmailBlock {
  id: string;
  type: "text" | "heading" | "image" | "button" | "divider" | "spacer";
  content?: string;
  settings?: Record<string, unknown>;
}

interface HistoryState {
  blocks: EmailBlock[];
  selectedBlockId: string | null;
}

interface EditorContextType {
  blocks: EmailBlock[];
  selectedBlockId: string | null;
  previewMode: "desktop" | "mobile" | null;
  canUndo: boolean;
  canRedo: boolean;
  selectBlock: (id: string | null) => void;
  addBlock: (index: number, type: EmailBlock["type"]) => void;
  moveBlock: (id: string, direction: "up" | "down") => void;
  duplicateBlock: (id: string) => void;
  deleteBlock: (id: string) => void;
  updateBlock: (id: string, updates: Partial<EmailBlock>) => void;
  setPreviewMode: (mode: "desktop" | "mobile" | null) => void;
  undo: () => void;
  redo: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

const defaultBlocks: EmailBlock[] = [
  {
    id: "1",
    type: "text",
    content: "Welcome to your email",
    settings: {},
  },
  {
    id: "2",
    type: "text",
    content: "This is a sample email template.",
    settings: {},
  },
];

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [blocks, setBlocks] = useState<EmailBlock[]>(defaultBlocks);
  const [selectedBlockId, setSelectedBlockId] = useQueryState(
    "block",
    parseAsString,
  );
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile" | null>(
    null,
  );

  // History management
  const [history, setHistory] = useState<HistoryState[]>([
    { blocks: defaultBlocks, selectedBlockId: null },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const saveToHistory = useCallback(
    (newBlocks: EmailBlock[], newSelectedBlockId: string | null) => {
      const newState = {
        blocks: newBlocks,
        selectedBlockId: newSelectedBlockId,
      };
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newState);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex],
  );

  const selectBlock = useCallback(
    (id: string | null) => {
      setSelectedBlockId(id);
    },
    [setSelectedBlockId],
  );

  const addBlock = useCallback(
    (index: number, type: EmailBlock["type"]) => {
      const newBlock: EmailBlock = {
        id: Date.now().toString(),
        type,
        content: type === "text" ? "New text block" : "",
        settings: {},
      };

      const newBlocks = [...blocks];
      newBlocks.splice(index, 0, newBlock);
      setBlocks(newBlocks);
      saveToHistory(newBlocks, newBlock.id);
      setSelectedBlockId(newBlock.id);
    },
    [blocks, saveToHistory, setSelectedBlockId],
  );

  const moveBlock = useCallback(
    (id: string, direction: "up" | "down") => {
      const index = blocks.findIndex((b) => b.id === id);
      if (index === -1) return;

      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= blocks.length) return;

      const newBlocks = [...blocks];
      [newBlocks[index], newBlocks[newIndex]] = [
        newBlocks[newIndex],
        newBlocks[index],
      ];

      setBlocks(newBlocks);
      saveToHistory(newBlocks, selectedBlockId);
    },
    [blocks, selectedBlockId, saveToHistory],
  );

  const duplicateBlock = useCallback(
    (id: string) => {
      const index = blocks.findIndex((b) => b.id === id);
      if (index === -1) return;

      const blockToDuplicate = blocks[index];
      const newBlock: EmailBlock = {
        ...blockToDuplicate,
        id: Date.now().toString(),
      };

      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      setBlocks(newBlocks);
      saveToHistory(newBlocks, newBlock.id);
      setSelectedBlockId(newBlock.id);
    },
    [blocks, saveToHistory, setSelectedBlockId],
  );

  const deleteBlock = useCallback(
    (id: string) => {
      const newBlocks = blocks.filter((b) => b.id !== id);
      setBlocks(newBlocks);
      saveToHistory(newBlocks, null);
      setSelectedBlockId(null);
    },
    [blocks, saveToHistory, setSelectedBlockId],
  );

  const updateBlock = useCallback(
    (id: string, updates: Partial<EmailBlock>) => {
      const newBlocks = blocks.map((b) =>
        b.id === id ? { ...b, ...updates } : b,
      );
      setBlocks(newBlocks);
      saveToHistory(newBlocks, selectedBlockId);
    },
    [blocks, selectedBlockId, saveToHistory],
  );

  const undo = useCallback(() => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      setHistoryIndex(newIndex);
      setBlocks(state.blocks);
      setSelectedBlockId(state.selectedBlockId);
    }
  }, [canUndo, history, historyIndex, setSelectedBlockId]);

  const redo = useCallback(() => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      setHistoryIndex(newIndex);
      setBlocks(state.blocks);
      setSelectedBlockId(state.selectedBlockId);
    }
  }, [canRedo, history, historyIndex, setSelectedBlockId]);

  return (
    <EditorContext.Provider
      value={{
        blocks,
        selectedBlockId,
        previewMode,
        canUndo,
        canRedo,
        selectBlock,
        addBlock,
        moveBlock,
        duplicateBlock,
        deleteBlock,
        updateBlock,
        setPreviewMode,
        undo,
        redo,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within EditorProvider");
  }
  return context;
}
