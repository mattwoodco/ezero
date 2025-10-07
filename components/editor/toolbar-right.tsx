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
    <div className="fixed top-20 right-20 flex gap-2 z-30">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPreviewMode("desktop")}
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
          >
            <Smartphone className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Mobile preview</TooltipContent>
      </Tooltip>
    </div>
  );
}
