"use client";

import { ArrowLeft, Monitor, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { BlockContent } from "@/components/email/block-renderer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditor } from "@/contexts/editor-context";
import { cn } from "@/lib/utils";

export function PreviewDialog() {
  const { previewMode, setPreviewMode, blocks } = useEditor();
  const [localMode, setLocalMode] = useState<"desktop" | "mobile">("desktop");

  const isOpen = previewMode !== null;

  // Sync localMode with previewMode when dialog opens
  useEffect(() => {
    if (previewMode) {
      setLocalMode(previewMode);
    }
  }, [previewMode]);

  const handleClose = () => {
    setPreviewMode(null);
  };

  const handleModeChange = (mode: "desktop" | "mobile") => {
    setLocalMode(mode);
  };

  const activeMode = localMode;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-full h-full p-0 gap-0">
        <DialogTitle className="sr-only">Email Preview</DialogTitle>
        <DialogDescription className="sr-only">
          Preview your email in desktop or mobile view
        </DialogDescription>
        <div className="flex flex-col h-full bg-background">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="gap-2"
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Close preview</TooltipContent>
              </Tooltip>

              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleModeChange("desktop")}
                      className={cn(activeMode === "desktop" && "text-primary")}
                    >
                      <Monitor className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Desktop preview</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleModeChange("mobile")}
                      className={cn(activeMode === "mobile" && "text-primary")}
                    >
                      <Smartphone className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mobile preview</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto p-8 flex items-start justify-center bg-muted/30">
            {activeMode === "desktop" ? (
              <div className="w-full max-w-[600px] bg-white shadow-lg">
                <EmailPreview blocks={blocks} />
              </div>
            ) : (
              <div className="p-2.5 bg-black rounded-[2.5rem] border-8 border-black shadow-2xl hover:shadow-3xl transition-shadow">
                <div className="w-[375px] h-[667px] bg-white rounded-[2rem] overflow-auto">
                  <EmailPreview blocks={blocks} />
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Email preview component using React Email components
function EmailPreview({
  blocks,
}: {
  blocks: Array<{
    id: string;
    type: "text" | "heading" | "image" | "button" | "divider" | "spacer";
    content?: string;
    settings?: Record<string, unknown>;
  }>;
}) {
  return (
    <div className="email-template">
      {blocks.map((block) => (
        <BlockContent key={block.id} block={block} />
      ))}
    </div>
  );
}
