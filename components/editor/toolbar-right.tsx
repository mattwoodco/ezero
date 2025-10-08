"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditor } from "@/contexts/editor-context";
import { Monitor, Smartphone } from "lucide-react";

export function ToolbarRight() {
  const { setPreviewMode, selectedBlockId } = useEditor();

  return (
    <div
      className={`
        fixed top-20 z-30
        flex gap-0 p-0
        bg-background
        transition-all duration-200
        ${selectedBlockId ? "right-[380px]" : "right-8"}
      `}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPreviewMode("desktop")}
            className="h-9 w-9"
          >
            <Monitor className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Desktop preview</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPreviewMode("mobile")}
            className="h-9 w-9"
          >
            <Smartphone className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Mobile preview</TooltipContent>
      </Tooltip>
    </div>
  );
}
