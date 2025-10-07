"use client";

import { Heart, Send, Share } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SendEmailDialog } from "./send-email-dialog";

export function ToolbarLeft() {
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);

  return (
    <>
      <div className="fixed top-20 left-5 flex flex-col gap-0 z-30">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSendDialogOpen(true)}
            >
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
              <Share className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Share</TooltipContent>
        </Tooltip>
      </div>

      <SendEmailDialog
        open={isSendDialogOpen}
        onOpenChange={setIsSendDialogOpen}
      />
    </>
  );
}
