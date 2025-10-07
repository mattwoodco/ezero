"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { EmailBlock, HistoryState } from "@/lib/types/editor";

/**
 * Maximum number of history states to keep
 */
const MAX_HISTORY_LENGTH = 50;

/**
 * Hook that provides undo/redo functionality for email blocks
 * Wraps the blocks state and tracks history
 *
 * @param blocks - Current blocks array
 * @param setBlocks - Function to update blocks
 * @returns Object with undo/redo functions and state
 */
export function useHistory(
  blocks: EmailBlock[],
  setBlocks: (
    blocks: EmailBlock[] | ((prev: EmailBlock[]) => EmailBlock[]),
  ) => void,
) {
  // Initialize history state
  const [history, setHistory] = useState<HistoryState<EmailBlock[]>>({
    past: [],
    present: blocks,
    future: [],
  });

  // Track if we're in the middle of an undo/redo operation
  const isUndoRedoRef = useRef(false);

  // Sync blocks with history present state when blocks change externally
  useEffect(() => {
    // If we're in an undo/redo operation, don't update history
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      return;
    }

    // Only update if blocks actually changed
    const blocksChanged =
      JSON.stringify(blocks) !== JSON.stringify(history.present);

    if (blocksChanged) {
      setHistory((prev) => {
        // Add current present to past
        const newPast = [...prev.past, prev.present];

        // Limit history length
        const trimmedPast = newPast.slice(-MAX_HISTORY_LENGTH);

        return {
          past: trimmedPast,
          present: blocks,
          future: [], // Clear future when new change is made
        };
      });
    }
  }, [blocks, history.present]);

  /**
   * Undo the last change
   */
  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) {
        return prev;
      }

      const newPast = [...prev.past];
      const newPresent = newPast.pop();
      if (!newPresent) return prev;
      const newFuture = [prev.present, ...prev.future];

      // Mark that we're doing an undo operation
      isUndoRedoRef.current = true;
      setBlocks(newPresent);

      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    });
  }, [setBlocks]);

  /**
   * Redo the last undone change
   */
  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) {
        return prev;
      }

      const newFuture = [...prev.future];
      const newPresent = newFuture.shift();
      if (!newPresent) return prev;
      const newPast = [...prev.past, prev.present];

      // Mark that we're doing a redo operation
      isUndoRedoRef.current = true;
      setBlocks(newPresent);

      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    });
  }, [setBlocks]);

  /**
   * Check if undo is available
   */
  const canUndo = history.past.length > 0;

  /**
   * Check if redo is available
   */
  const canRedo = history.future.length > 0;

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setHistory({
      past: [],
      present: blocks,
      future: [],
    });
  }, [blocks]);

  /**
   * Reset history to a specific state
   */
  const resetHistory = useCallback(
    (newBlocks: EmailBlock[]) => {
      setHistory({
        past: [],
        present: newBlocks,
        future: [],
      });
      setBlocks(newBlocks);
    },
    [setBlocks],
  );

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    resetHistory,
  };
}

/**
 * Hook that provides keyboard shortcuts for undo/redo
 * Call this in your component to enable Cmd+Z and Cmd+Shift+Z
 *
 * @param undo - Undo function
 * @param redo - Redo function
 * @param canUndo - Whether undo is available
 * @param canRedo - Whether redo is available
 */
export function useHistoryKeyboardShortcuts(
  undo: () => void,
  redo: () => void,
  canUndo: boolean,
  canRedo: boolean,
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const isCtrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

      // Undo: Cmd/Ctrl + Z
      if (isCtrlOrCmd && event.key === "z" && !event.shiftKey && canUndo) {
        event.preventDefault();
        undo();
      }

      // Redo: Cmd/Ctrl + Shift + Z
      if (isCtrlOrCmd && event.key === "z" && event.shiftKey && canRedo) {
        event.preventDefault();
        redo();
      }

      // Alternative Redo: Cmd/Ctrl + Y
      if (isCtrlOrCmd && event.key === "y" && canRedo) {
        event.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);
}
