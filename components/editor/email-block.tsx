"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { BlockContent } from "@/components/email/block-renderer";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { EmailBlock as EmailBlockType } from "@/contexts/editor-context";
import { useEditor } from "@/contexts/editor-context";
import { cn } from "@/lib/utils";
import { BlockTypeMenu } from "./block-type-menu";
import type { EmailBlockType as BlockType } from "@/types/email";

interface EmailBlockProps {
  block: EmailBlockType;
  index: number;
}

export function EmailBlock({ block, index }: EmailBlockProps) {
  const { selectedBlockId, selectBlock, addBlock } = useEditor();
  const [isHovered, setIsHovered] = useState(false);
  const [showMenuAbove, setShowMenuAbove] = useState(false);
  const [showMenuBelow, setShowMenuBelow] = useState(false);
  const isSelected = selectedBlockId === block.id;

  const handleAddAbove = (type: BlockType) => {
    addBlock(index, type);
    setShowMenuAbove(false);
  };

  const handleAddBelow = (type: BlockType) => {
    addBlock(index + 1, type);
    setShowMenuBelow(false);
  };

  const blockTypeLabel =
    block.type.charAt(0).toUpperCase() + block.type.slice(1);

  return (
    <>
      {/* Inline menu above */}
      {showMenuAbove && (
        <div onClick={(e) => e.stopPropagation()}>
          <BlockTypeMenu onSelect={handleAddAbove} onClose={() => setShowMenuAbove(false)} />
        </div>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          {/* biome-ignore lint/a11y/useSemanticElements: Using div to avoid nested button elements which would be invalid HTML */}
          <div
            role="button"
            tabIndex={0}
            className={cn(
              "relative w-full text-left cursor-pointer",
              index > 0 && "-mt-px",
              "transition-all duration-150",
              isHovered && "outline outline-2 outline-primary shadow-xl z-10",
              isSelected && !isHovered && "outline outline-1 outline-border",
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => selectBlock(block.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectBlock(block.id);
              }
            }}
          >
            {/* Add button above */}
            {isHovered && !showMenuBelow && (
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="rounded-full !bg-background shadow-md !border-2 !border-primary text-muted-foreground hover:!bg-primary hover:!text-primary-foreground cursor-pointer"
                  onClick={() => setShowMenuAbove(true)}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            )}

            {/* Block content - now using React Email components */}
            <BlockContent block={block} />

            {/* Add button below */}
            {isHovered && !showMenuAbove && (
              <div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="rounded-full !bg-background shadow-md !border-2 !border-primary text-muted-foreground hover:!bg-primary hover:!text-primary-foreground cursor-pointer"
                  onClick={() => setShowMenuBelow(true)}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">{blockTypeLabel} settings</TooltipContent>
      </Tooltip>

      {/* Inline menu below */}
      {showMenuBelow && (
        <div onClick={(e) => e.stopPropagation()}>
          <BlockTypeMenu onSelect={handleAddBelow} onClose={() => setShowMenuBelow(false)} />
        </div>
      )}
    </>
  );
}
