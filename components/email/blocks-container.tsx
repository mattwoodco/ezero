"use client";

import { useState } from "react";
import type { EmailBlock as EmailBlockType } from "@/lib/types";
import { BlockToolbar } from "./block-toolbar";
import { EmailBlock } from "./email-block";

interface BlocksContainerProps {
  initialBlocks?: EmailBlockType[];
  onBlocksChange?: (blocks: EmailBlockType[]) => void;
}

export function BlocksContainer({
  initialBlocks = [],
  onBlocksChange,
}: BlocksContainerProps) {
  const [blocks, setBlocks] = useState<EmailBlockType[]>(
    initialBlocks.length > 0
      ? initialBlocks
      : [
          {
            id: "1",
            type: "Text",
            content: {},
            settings: {},
          },
        ],
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);

  const updateBlocks = (newBlocks: EmailBlockType[]) => {
    setBlocks(newBlocks);
    onBlocksChange?.(newBlocks);
  };

  const handleAddBlock = (index: number) => {
    const newBlock: EmailBlockType = {
      id: Date.now().toString(),
      type: "Text",
      content: {},
      settings: {},
    };
    const newBlocks = [...blocks];
    newBlocks.splice(index, 0, newBlock);
    updateBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
  };

  const handleMoveUp = (blockId: string) => {
    const index = blocks.findIndex((b) => b.id === blockId);
    if (index > 0) {
      const newBlocks = [...blocks];
      [newBlocks[index - 1], newBlocks[index]] = [
        newBlocks[index],
        newBlocks[index - 1],
      ];
      updateBlocks(newBlocks);
    }
  };

  const handleMoveDown = (blockId: string) => {
    const index = blocks.findIndex((b) => b.id === blockId);
    if (index < blocks.length - 1) {
      const newBlocks = [...blocks];
      [newBlocks[index], newBlocks[index + 1]] = [
        newBlocks[index + 1],
        newBlocks[index],
      ];
      updateBlocks(newBlocks);
    }
  };

  const handleDuplicate = (blockId: string) => {
    const index = blocks.findIndex((b) => b.id === blockId);
    if (index !== -1) {
      const blockToDuplicate = blocks[index];
      const newBlock: EmailBlockType = {
        ...blockToDuplicate,
        id: Date.now().toString(),
      };
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      updateBlocks(newBlocks);
      setSelectedBlockId(newBlock.id);
    }
  };

  const handleDelete = (blockId: string) => {
    if (blocks.length === 1) {
      // Don't delete the last block
      return;
    }
    const newBlocks = blocks.filter((b) => b.id !== blockId);
    updateBlocks(newBlocks);
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };

  const handleSaveToFavorites = (blockId: string) => {
    // Placeholder for save to favorites functionality
    console.log("Save to favorites:", blockId);
  };

  return (
    <div className="w-full max-w-[600px] mx-auto">
      {blocks.map((block, index) => {
        const isSelected = selectedBlockId === block.id;
        const isHovered = hoveredBlockId === block.id;

        return (
          <div key={block.id} className="relative">
            <EmailBlock
              block={block}
              isSelected={isSelected}
              isHovered={isHovered}
              onSelect={() => setSelectedBlockId(block.id)}
              onAddAbove={() => handleAddBlock(index)}
              onAddBelow={() => handleAddBlock(index + 1)}
              onMouseEnter={() => setHoveredBlockId(block.id)}
              onMouseLeave={() => setHoveredBlockId(null)}
            />
            {isSelected && (
              <BlockToolbar
                onMoveUp={() => handleMoveUp(block.id)}
                onMoveDown={() => handleMoveDown(block.id)}
                onSave={() => handleSaveToFavorites(block.id)}
                onDuplicate={() => handleDuplicate(block.id)}
                onDelete={() => handleDelete(block.id)}
                canMoveUp={index > 0}
                canMoveDown={index < blocks.length - 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
