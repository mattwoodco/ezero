"use client";

import { ArrowDown, ArrowUp, Copy, Heart, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditor } from "@/contexts/editor-context";

interface BlockToolbarProps {
  blockId: string;
}

export function BlockToolbar({ blockId }: BlockToolbarProps) {
  const { moveBlock, duplicateBlock, deleteBlock, blocks } = useEditor();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const HEADER_HEIGHT = 56; // h-14 = 56px

    const updatePosition = () => {
      const blockElement = document.querySelector(
        `[data-block-id="${blockId}"]`,
      ) as HTMLElement;

      if (blockElement && toolbarRef.current) {
        const blockRect = blockElement.getBoundingClientRect();
        const toolbarRect = toolbarRef.current.getBoundingClientRect();

        const idealTop = blockRect.top + blockRect.height / 2 - toolbarRect.height / 2;
        const constrainedTop = Math.max(HEADER_HEIGHT + 8, idealTop);

        setPosition({
          top: constrainedTop,
          left: blockRect.right + 20,
        });
      }
    };

    // Use requestAnimationFrame to ensure toolbar is rendered before calculating position
    requestAnimationFrame(updatePosition);

    // Update position on scroll
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [blockId]);

  const blockIndex = blocks.findIndex((b) => b.id === blockId);
  const canMoveUp = blockIndex > 0;
  const canMoveDown = blockIndex < blocks.length - 1;

  return (
    <div
      ref={toolbarRef}
      className="fixed flex flex-col z-40"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={!canMoveUp}
            onClick={() => moveBlock(blockId, "up")}
          >
            <ArrowUp className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Move up</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={!canMoveDown}
            onClick={() => moveBlock(blockId, "down")}
          >
            <ArrowDown className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Move down</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Heart className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Save to favorites</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => duplicateBlock(blockId)}
          >
            <Copy className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Duplicate</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteBlock(blockId)}
          >
            <Trash2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Delete</TooltipContent>
      </Tooltip>
    </div>
  );
}
