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
      <div className="fixed bottom-0 left-0 right-0 z-30 flex flex-row gap-2 justify-around p-2 bg-background border-t @lg/editor:flex-col @lg/editor:top-20 @lg/editor:left-5 @lg/editor:bottom-auto @lg/editor:right-auto @lg/editor:border-t-0 @lg/editor:border-r @lg/editor:gap-0 @lg/editor:p-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSendDialogOpen(true)}
              className="h-11 w-11 @lg/editor:h-9 @lg/editor:w-9"
            >
              <Send className="size-5 @lg/editor:size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Send</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 @lg/editor:h-9 @lg/editor:w-9"
            >
              <Heart className="size-5 @lg/editor:size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Favorite</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 @lg/editor:h-9 @lg/editor:w-9"
            >
              <Share className="size-5 @lg/editor:size-4" />
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
