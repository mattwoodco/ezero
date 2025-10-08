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
  const [containerWidth, setContainerWidth] = useState(0);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Detect container width using ResizeObserver
  useEffect(() => {
    const workspaceContainer = document.querySelector(
      '[class*="@container/workspace"]',
    );
    if (!workspaceContainer) return;

    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });

    observer.observe(workspaceContainer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const HEADER_HEIGHT = 56; // h-14 = 56px

    const updatePosition = () => {
      const blockElement = document.querySelector(
        `[data-block-id="${blockId}"]`,
      ) as HTMLElement;

      if (blockElement && toolbarRef.current) {
        const blockRect = blockElement.getBoundingClientRect();
        const toolbarRect = toolbarRef.current.getBoundingClientRect();

        const idealTop =
          blockRect.top + blockRect.height / 2 - toolbarRect.height / 2;
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

  // Mobile breakpoint is 768px (md)
  const isMobile = containerWidth > 0 && containerWidth < 768;

  return (
    <div
      ref={toolbarRef}
      className="z-40 flex transition-all duration-200 @max-md/workspace:relative @max-md/workspace:flex-row @max-md/workspace:justify-center @max-md/workspace:gap-1 @max-md/workspace:py-2 @max-md/workspace:px-4 @md/workspace:fixed @md/workspace:flex-col"
      style={
        // Only use absolute positioning on desktop (>= 768px)
        !isMobile
          ? { top: `${position.top}px`, left: `${position.left}px` }
          : {}
      }
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={!canMoveUp}
            onClick={() => moveBlock(blockId, "up")}
            className="@max-md/workspace:min-h-[44px] @max-md/workspace:min-w-[44px]"
          >
            <ArrowUp className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side={isMobile ? "top" : "right"}>
          Move up
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={!canMoveDown}
            onClick={() => moveBlock(blockId, "down")}
            className="@max-md/workspace:min-h-[44px] @max-md/workspace:min-w-[44px]"
          >
            <ArrowDown className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side={isMobile ? "top" : "right"}>
          Move down
        </TooltipContent>
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
        <TooltipContent side={isMobile ? "top" : "right"}>
          Save to favorites
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => duplicateBlock(blockId)}
            className="@max-md/workspace:min-h-[44px] @max-md/workspace:min-w-[44px]"
          >
            <Copy className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side={isMobile ? "top" : "right"}>
          Duplicate
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteBlock(blockId)}
            className="@max-md/workspace:min-h-[44px] @max-md/workspace:min-w-[44px]"
          >
            <Trash2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side={isMobile ? "top" : "right"}>
          Delete
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
