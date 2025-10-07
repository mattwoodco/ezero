"use client";

import { Heart, Send, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ToolbarLeft() {
  return (
    <div className="fixed top-20 left-20 z-30 flex flex-col gap-2">
      {/* Send Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Send className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Send</p>
        </TooltipContent>
      </Tooltip>

      {/* Favorite Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Heart className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Favorite</p>
        </TooltipContent>
      </Tooltip>

      {/* Share Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Share2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Share</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
