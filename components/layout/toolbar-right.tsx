"use client";

import { Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolbarRightProps {
  onPreview?: (mode: "desktop" | "mobile") => void;
}

export function ToolbarRight({ onPreview }: ToolbarRightProps) {
  return (
    <div className="fixed top-20 right-20 z-30 flex flex-row gap-2">
      {/* Desktop Preview Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPreview?.("desktop")}
          >
            <Monitor className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Desktop preview</p>
        </TooltipContent>
      </Tooltip>

      {/* Mobile Preview Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPreview?.("mobile")}
          >
            <Smartphone className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Mobile preview</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
