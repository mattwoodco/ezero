"use client";

import { Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditor } from "@/contexts/editor-context";

export function ToolbarRight() {
  const { setPreviewMode } = useEditor();

  return (
    <div className="fixed top-14 left-0 right-0 z-30 flex flex-row gap-2 justify-center p-2 bg-background/80 backdrop-blur @lg/editor:top-20 @lg/editor:right-7 @lg/editor:left-auto @lg/editor:bg-transparent @lg/editor:backdrop-blur-none @lg/editor:p-0">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPreviewMode("desktop")}
            className="h-11 w-11 @lg/editor:h-9 @lg/editor:w-9"
          >
            <Monitor className="size-5 @lg/editor:size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Desktop preview</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPreviewMode("mobile")}
            className="h-11 w-11 @lg/editor:h-9 @lg/editor:w-9"
          >
            <Smartphone className="size-5 @lg/editor:size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Mobile preview</TooltipContent>
      </Tooltip>
    </div>
  );
}
