"use client";

import { ArrowDown, ArrowUp, Copy, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BlockToolbarProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSave: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function BlockToolbar({
  onMoveUp,
  onMoveDown,
  onSave,
  onDuplicate,
  onDelete,
  canMoveUp,
  canMoveDown,
}: BlockToolbarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="absolute top-1/2 -translate-y-1/2 left-[calc(100%+20px)] flex flex-col gap-1 z-20">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              aria-label="Move up"
            >
              <ArrowUp className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="animate-in fade-in duration-200"
          >
            <p>Move up</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              aria-label="Move down"
            >
              <ArrowDown className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="animate-in fade-in duration-200"
          >
            <p>Move down</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSave}
              aria-label="Save to favorites"
            >
              <Star className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="animate-in fade-in duration-200"
          >
            <p>Save to favorites</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDuplicate}
              aria-label="Duplicate"
            >
              <Copy className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="animate-in fade-in duration-200"
          >
            <p>Duplicate</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              aria-label="Delete"
            >
              <Trash2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="animate-in fade-in duration-200"
          >
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
