"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { EmailBlock as EmailBlockType } from "@/contexts/editor-context";
import { useEditor } from "@/contexts/editor-context";
import { cn } from "@/lib/utils";
import { BlockContent } from "./block-content";

interface EmailBlockProps {
  block: EmailBlockType;
  index: number;
}

export function EmailBlock({ block, index }: EmailBlockProps) {
  const { selectedBlockId, selectBlock, addBlock } = useEditor();
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = selectedBlockId === block.id;

  const handleAddAbove = () => {
    addBlock(index, "text");
  };

  const handleAddBelow = () => {
    addBlock(index + 1, "text");
  };

  const blockTypeLabel =
    block.type.charAt(0).toUpperCase() + block.type.slice(1);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* biome-ignore lint/a11y/useSemanticElements: Using div to avoid nested button elements which would be invalid HTML */}
        <div
          role="button"
          tabIndex={0}
          className={cn(
            "relative border border-transparent transition-all duration-200 w-full text-left cursor-pointer",
            isHovered && "border-primary shadow-2xl",
            isSelected && "border-primary",
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
          {isHovered && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full bg-background shadow-md hover:bg-primary hover:text-primary-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddAbove();
                }}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          )}

          {/* Block content - now using React Email components */}
          <BlockContent block={block} />

          {/* Add button below */}
          {isHovered && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full bg-background shadow-md hover:bg-primary hover:text-primary-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddBelow();
                }}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>{blockTypeLabel} settings</TooltipContent>
    </Tooltip>
  );
}
