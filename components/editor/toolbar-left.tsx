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
    <div className="fixed top-20 left-20 flex flex-col gap-2 z-30">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Send className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Send</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Heart className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Favorite</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Share2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Share</TooltipContent>
      </Tooltip>
    </div>
  );
}
