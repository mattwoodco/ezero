"use client";

import { Plus } from "lucide-react";
import type { EmailBlock as EmailBlockType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EmailBlockProps {
  block: EmailBlockType;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onAddAbove: () => void;
  onAddBelow: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function EmailBlock({
  block,
  isSelected,
  isHovered,
  onSelect,
  onAddAbove,
  onAddBelow,
  onMouseEnter,
  onMouseLeave,
}: EmailBlockProps) {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Mouse events for hover state management
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Top Plus Button - appears on hover */}
      {isHovered && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddAbove();
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 size-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center shadow-md"
          aria-label="Add block above"
        >
          <Plus className="size-4" />
        </button>
      )}

      {/* Main Block Content */}
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "relative border transition-all duration-200 cursor-pointer min-h-[100px] p-4 w-full text-left",
          isHovered && !isSelected && "border-primary shadow-2xl",
          isSelected && "border-primary shadow-2xl",
          !isHovered && !isSelected && "border-transparent",
        )}
        aria-label={`Select ${block.type} block`}
      >
        {/* Placeholder content - will be replaced with actual block rendering */}
        <div className="text-sm text-muted-foreground">
          <div className="font-medium mb-2">{block.type} Block</div>
          <div className="text-xs">Block ID: {block.id}</div>
        </div>
      </button>

      {/* Bottom Plus Button - appears on hover */}
      {isHovered && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddBelow();
          }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10 size-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center shadow-md"
          aria-label="Add block below"
        >
          <Plus className="size-4" />
        </button>
      )}
    </div>
  );
}
