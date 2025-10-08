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
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [topPosition, setTopPosition] = useState<string>("50%");
  const [shouldCenter, setShouldCenter] = useState<boolean>(true);

  const blockIndex = blocks.findIndex((b) => b.id === blockId);
  const canMoveUp = blockIndex > 0;
  const canMoveDown = blockIndex < blocks.length - 1;

  useEffect(() => {
    const updatePosition = () => {
      if (!toolbarRef.current) return;

      const blockElement = toolbarRef.current.closest("[data-block-id]");
      if (!blockElement) return;

      const blockRect = blockElement.getBoundingClientRect();
      const _headerHeight = 56; // Header height
      const toolbarHeight = toolbarRef.current.offsetHeight;
      const minTopOffset = 120; // Minimum distance from top (header + blue toolbar + padding)

      // Calculate the ideal centered position
      const blockCenter = blockRect.top + blockRect.height / 2;

      // If the centered position would be too close to the top, use minimum offset
      if (blockCenter - toolbarHeight / 2 < minTopOffset) {
        setTopPosition(`${minTopOffset - blockRect.top}px`);
        setShouldCenter(false);
      } else {
        setTopPosition("50%");
        setShouldCenter(true);
      }
    };

    updatePosition();

    // Find the scroll container
    const scrollContainer = toolbarRef.current?.closest(".overflow-y-auto");

    scrollContainer?.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      scrollContainer?.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  return (
    <div
      ref={toolbarRef}
      data-block-toolbar
      style={{ top: topPosition } as React.CSSProperties}
      className={`z-40 flex transition-all duration-200 @max-md/workspace:relative @max-md/workspace:flex-row @max-md/workspace:justify-center @max-md/workspace:gap-1 @max-md/workspace:py-2 @max-md/workspace:px-4 @md/workspace:absolute @md/workspace:flex-col @md/workspace:left-full @md/workspace:ml-3  ${shouldCenter ? "@md/workspace:-translate-y-1/2" : ""}`}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={!canMoveUp}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              moveBlock(blockId, "up");
            }}
            className="@max-md/workspace:min-h-[44px] @max-md/workspace:min-w-[44px]"
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              moveBlock(blockId, "down");
            }}
            className="@max-md/workspace:min-h-[44px] @max-md/workspace:min-w-[44px]"
          >
            <ArrowDown className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Move down</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="@max-md/workspace:min-h-[44px] @max-md/workspace:min-w-[44px]"
          >
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              duplicateBlock(blockId);
            }}
            className="@max-md/workspace:min-h-[44px] @max-md/workspace:min-w-[44px]"
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteBlock(blockId);
            }}
            className="@max-md/workspace:min-h-[44px] @max-md/workspace:min-w-[44px]"
          >
            <Trash2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Delete</TooltipContent>
      </Tooltip>
    </div>
  );
}
