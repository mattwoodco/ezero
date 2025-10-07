"use client";

import { parseAsJson, parseAsString, useQueryState } from "nuqs";
import { useCallback } from "react";
import type { EmailBlock } from "@/lib/types/editor";

/**
 * Hook to manage the selected block ID in the URL
 * @returns [selectedBlockId, setSelectedBlockId]
 */
export function useSelectedBlockId() {
  return useQueryState(
    "selected",
    parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  );
}

/**
 * Hook to manage the preview mode in the URL
 * @returns [previewMode, setPreviewMode]
 */
export function usePreviewMode() {
  return useQueryState(
    "preview",
    parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  );
}

/**
 * Custom parser for blocks array with validation
 */
const blocksParser = parseAsJson<EmailBlock[]>((value) => {
  if (!Array.isArray(value)) {
    return [];
  }
  // Validate that each item has required EmailBlock properties
  return value.filter(
    (block) =>
      block &&
      typeof block === "object" &&
      "id" in block &&
      "type" in block &&
      "content" in block &&
      "settings" in block,
  );
});

/**
 * Hook to manage email blocks array with add/remove/reorder/duplicate operations
 * @returns Object with blocks array and manipulation functions
 */
export function useBlocks() {
  const [blocks, setBlocks] = useQueryState(
    "blocks",
    blocksParser.withDefault([]).withOptions({
      history: "push",
      shallow: false,
    }),
  );

  /**
   * Add a new block at the specified position
   * @param block - The block to add
   * @param position - Optional position index (defaults to end)
   */
  const addBlock = useCallback(
    (block: EmailBlock, position?: number) => {
      setBlocks((current) => {
        if (current === null) return [block];

        if (position === undefined || position >= current.length) {
          return [...current, block];
        }

        const newBlocks = [...current];
        newBlocks.splice(position, 0, block);
        return newBlocks;
      });
    },
    [setBlocks],
  );

  /**
   * Remove a block by ID
   * @param blockId - The ID of the block to remove
   */
  const removeBlock = useCallback(
    (blockId: string) => {
      setBlocks((current) => {
        if (current === null) return current;
        return current.filter((block) => block.id !== blockId);
      });
    },
    [setBlocks],
  );

  /**
   * Update a block by ID with partial updates
   * @param blockId - The ID of the block to update
   * @param updates - Partial block updates
   */
  const updateBlock = useCallback(
    (blockId: string, updates: Partial<EmailBlock>) => {
      setBlocks((current) => {
        if (current === null) return current;
        return current.map((block) =>
          block.id === blockId ? { ...block, ...updates } : block,
        );
      });
    },
    [setBlocks],
  );

  /**
   * Move a block up or down
   * @param blockId - The ID of the block to move
   * @param direction - Direction to move ('up' or 'down')
   */
  const moveBlock = useCallback(
    (blockId: string, direction: "up" | "down") => {
      setBlocks((current) => {
        if (current === null) return current;

        const index = current.findIndex((block) => block.id === blockId);
        if (index === -1) return current;

        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= current.length) return current;

        const newBlocks = [...current];
        const [movedBlock] = newBlocks.splice(index, 1);
        newBlocks.splice(newIndex, 0, movedBlock);
        return newBlocks;
      });
    },
    [setBlocks],
  );

  /**
   * Duplicate a block by ID
   * @param blockId - The ID of the block to duplicate
   */
  const duplicateBlock = useCallback(
    (blockId: string) => {
      setBlocks((current) => {
        if (current === null) return current;

        const index = current.findIndex((block) => block.id === blockId);
        if (index === -1) return current;

        const blockToDuplicate = current[index];
        const duplicatedBlock: EmailBlock = {
          ...blockToDuplicate,
          id: `${blockToDuplicate.id}-copy-${Date.now()}`,
        };

        const newBlocks = [...current];
        newBlocks.splice(index + 1, 0, duplicatedBlock);
        return newBlocks;
      });
    },
    [setBlocks],
  );

  /**
   * Reorder blocks by providing new array of block IDs
   * @param blockIds - Array of block IDs in the new order
   */
  const reorderBlocks = useCallback(
    (blockIds: string[]) => {
      setBlocks((current) => {
        if (current === null) return current;

        const blockMap = new Map(current.map((block) => [block.id, block]));
        const reorderedBlocks: EmailBlock[] = [];

        for (const id of blockIds) {
          const block = blockMap.get(id);
          if (block) {
            reorderedBlocks.push(block);
          }
        }

        return reorderedBlocks;
      });
    },
    [setBlocks],
  );

  /**
   * Set blocks directly (useful for initializing or resetting)
   * @param newBlocks - New blocks array or updater function
   */
  const setBlocksDirectly = useCallback(
    (newBlocks: EmailBlock[] | ((prev: EmailBlock[]) => EmailBlock[])) => {
      if (typeof newBlocks === "function") {
        setBlocks((current) => newBlocks(current || []));
      } else {
        setBlocks(newBlocks);
      }
    },
    [setBlocks],
  );

  return {
    blocks: blocks || [],
    setBlocks: setBlocksDirectly,
    addBlock,
    removeBlock,
    updateBlock,
    moveBlock,
    duplicateBlock,
    reorderBlocks,
  };
}
