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
import type { EmailBlockType as BlockType } from "@/types/email";
import { BlockTypeMenu } from "./block-type-menu";

interface EmailBlockProps {
  block: EmailBlockType;
  index: number;
}

export function EmailBlock({ block, index }: EmailBlockProps) {
  const { selectedBlockId, selectBlock, addBlock, openMenuId, setOpenMenuId } = useEditor();
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = selectedBlockId === block.id;

  const menuAboveId = `${block.id}-above`;
  const menuBelowId = `${block.id}-below`;
  const showMenuAbove = openMenuId === menuAboveId;
  const showMenuBelow = openMenuId === menuBelowId;

  const handleAddAbove = (type: BlockType) => {
    addBlock(index, type);
    setOpenMenuId(null);
  };

  const handleAddBelow = (type: BlockType) => {
    addBlock(index + 1, type);
    setOpenMenuId(null);
  };

  const blockTypeLabel =
    block.type.charAt(0).toUpperCase() + block.type.slice(1);

  return (
    <>
      {/* Inline menu above */}
      {showMenuAbove && (
        <div onClick={(e) => e.stopPropagation()}>
          <BlockTypeMenu
            onSelect={handleAddAbove}
            onClose={() => setOpenMenuId(null)}
          />
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
              "min-h-[44px]", // Minimum touch target height for mobile
              isHovered && "outline outline-1 outline-primary shadow-xl z-10",
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
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="rounded-full !bg-background shadow-md !border !border-primary text-muted-foreground hover:!bg-primary hover:!text-primary-foreground cursor-pointer h-6 w-6 p-0"
                  onClick={() => setOpenMenuId(menuAboveId)}
                >
                  <Plus className="size-3" />
                </Button>
              </div>
            )}

            {/* Block content - now using React Email components */}
            <BlockContent block={block} />

            {/* Add button below */}
            {isHovered && !showMenuAbove && (
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="rounded-full !bg-background shadow-md !border !border-primary text-muted-foreground hover:!bg-primary hover:!text-primary-foreground cursor-pointer h-6 w-6 p-0"
                  onClick={() => setOpenMenuId(menuBelowId)}
                >
                  <Plus className="size-3" />
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
          <BlockTypeMenu
            onSelect={handleAddBelow}
            onClose={() => setOpenMenuId(null)}
          />
        </div>
      )}
    </>
  );
}
