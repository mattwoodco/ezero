"use client";

import { parseAsString, useQueryState } from "nuqs";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { EmailBlock } from "@/types/email";

export type { EmailBlock };

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
  openMenuId: string | null;
  gmailActionsEnabled: boolean;
  selectBlock: (id: string | null) => void;
  addBlock: (index: number, type: EmailBlock["type"]) => void;
  moveBlock: (id: string, direction: "up" | "down") => void;
  duplicateBlock: (id: string) => void;
  deleteBlock: (id: string) => void;
  updateBlock: (id: string, updates: Partial<EmailBlock>) => void;
  updateBlockType: (id: string, type: EmailBlock["type"]) => void;
  updateBlockSettings: (id: string, settings: EmailBlock["settings"]) => void;
  setPreviewMode: (mode: "desktop" | "mobile" | null) => void;
  setBlocks: (blocks: EmailBlock[]) => void;
  setOpenMenuId: (id: string | null) => void;
  setGmailActionsEnabled: (enabled: boolean) => void;
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
    parseAsString.withOptions({
      shallow: true,
      throttleMs: 50,
    }),
  );
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile" | null>(
    null,
  );
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [gmailActionsEnabled, setGmailActionsEnabled] = useState<boolean>(true);

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
      setHistoryIndex((prevIndex) => {
        setHistory((prevHistory) => {
          const newHistory = prevHistory.slice(0, prevIndex + 1);
          newHistory.push(newState);
          return newHistory;
        });
        return prevIndex + 1;
      });
    },
    [],
  );

  const selectBlock = useCallback(
    (id: string | null) => {
      // Guard clause: if clicking the same block, do nothing (prevent redundant updates)
      if (id === selectedBlockId) {
        return;
      }

      // Only update if actually changing to a different value
      setSelectedBlockId(id);
      setOpenMenuId(null);
    },
    [setSelectedBlockId, selectedBlockId],
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

  const updateBlockType = useCallback(
    (id: string, type: EmailBlock["type"]) => {
      const newBlocks = blocks.map((b) =>
        b.id === id ? { ...b, type, settings: {} } : b,
      );
      setBlocks(newBlocks);
      saveToHistory(newBlocks, selectedBlockId);
    },
    [blocks, selectedBlockId, saveToHistory],
  );

  const updateBlockSettings = useCallback(
    (id: string, settings: EmailBlock["settings"]) => {
      const newBlocks = blocks.map((b) =>
        b.id === id ? { ...b, settings } : b,
      );
      setBlocks(newBlocks);
      saveToHistory(newBlocks, selectedBlockId);
    },
    [blocks, selectedBlockId, saveToHistory],
  );

  const setBlocksWithHistory = useCallback(
    (newBlocks: EmailBlock[]) => {
      setBlocks(newBlocks);
      saveToHistory(newBlocks, null);
    },
    [saveToHistory],
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

  const value = useMemo(
    () => ({
      blocks,
      selectedBlockId,
      previewMode,
      canUndo,
      canRedo,
      openMenuId,
      gmailActionsEnabled,
      selectBlock,
      addBlock,
      moveBlock,
      duplicateBlock,
      deleteBlock,
      updateBlock,
      updateBlockType,
      updateBlockSettings,
      setPreviewMode,
      setBlocks: setBlocksWithHistory,
      setOpenMenuId,
      setGmailActionsEnabled,
      undo,
      redo,
    }),
    [
      blocks,
      selectedBlockId,
      previewMode,
      canUndo,
      canRedo,
      openMenuId,
      gmailActionsEnabled,
      selectBlock,
      addBlock,
      moveBlock,
      duplicateBlock,
      deleteBlock,
      updateBlock,
      updateBlockType,
      updateBlockSettings,
      setBlocksWithHistory,
      undo,
      redo,
    ],
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within EditorProvider");
  }
  return context;
}
