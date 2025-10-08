"use client";

import { ArrowDown, ArrowUp, Copy, Heart, Trash2 } from "lucide-react";
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

  const blockIndex = blocks.findIndex((b) => b.id === blockId);
  const canMoveUp = blockIndex > 0;
  const canMoveDown = blockIndex < blocks.length - 1;

  return (
    <div className="z-40 flex transition-all duration-200 @max-md/workspace:relative @max-md/workspace:flex-row @max-md/workspace:justify-center @max-md/workspace:gap-1 @max-md/workspace:py-2 @max-md/workspace:px-4 @md/workspace:absolute @md/workspace:flex-col @md/workspace:left-full @md/workspace:ml-3 @md/workspace:top-1/2 @md/workspace:-translate-y-1/2"
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
        <TooltipContent side="right">Move up</TooltipContent>
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
            onClick={() => duplicateBlock(blockId)}
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
            onClick={() => deleteBlock(blockId)}
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
