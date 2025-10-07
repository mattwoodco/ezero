"use client";

import { ArrowLeft, Monitor, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { BlockContent } from "@/components/email/block-renderer";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
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
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content className="fixed inset-0 z-50 bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          <DialogPrimitive.Title className="sr-only">
            Email Preview
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Preview your email in desktop or mobile view
          </DialogPrimitive.Description>
          <div className="flex h-full w-full flex-col">
            {/* Header */}
            <div className="flex items-center gap-8 p-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="gap-2 text-foreground"
              >
                <ArrowLeft className="size-4" />
                Back to editing
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleModeChange("desktop")}
                  className={cn(
                    "size-8",
                    activeMode === "desktop" && "bg-accent"
                  )}
                >
                  <Monitor className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleModeChange("mobile")}
                  className={cn(
                    "size-8",
                    activeMode === "mobile" && "bg-accent"
                  )}
                >
                  <Smartphone className="size-4" />
                </Button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex flex-1 items-start justify-center overflow-auto bg-background px-8 pb-8">
              {activeMode === "desktop" ? (
                <div className="w-full max-w-[600px] bg-white">
                  <EmailPreview blocks={blocks} />
                </div>
              ) : (
                <div className="rounded-[2.5rem] border-8 border-black bg-black p-2.5 shadow-2xl">
                  <div className="h-[667px] w-[375px] overflow-auto rounded-[2rem] bg-white">
                    <EmailPreview blocks={blocks} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
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
