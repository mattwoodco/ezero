"use client";

import { ArrowLeftIcon, MonitorIcon, SmartphoneIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { EmailBlock } from "@/types/email";
import { EmailRenderer } from "./email-renderer";
import { IPhoneFrame } from "./iphone-frame";

interface PreviewDialogProps {
  open: boolean;
  onClose: () => void;
  blocks: EmailBlock[];
  initialMode?: "desktop" | "mobile";
}

export function PreviewDialog({
  open,
  onClose,
  blocks,
  initialMode = "desktop",
}: PreviewDialogProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">(initialMode);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogTitle className="sr-only">Email Preview</DialogTitle>
      <DialogDescription className="sr-only">
        Preview your email in desktop or mobile view
      </DialogDescription>
      <DialogPortal>
        <div className="fixed inset-0 z-50 bg-background">
          {/* Header Controls */}
          <div className="fixed top-20 left-20 flex flex-col gap-4">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="gap-2"
            >
              <ArrowLeftIcon className="size-4" />
              Back
            </Button>

            {/* View Mode Toggles */}
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setViewMode("desktop")}
                className={cn(
                  viewMode === "desktop"
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                <MonitorIcon className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setViewMode("mobile")}
                className={cn(
                  viewMode === "mobile"
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                <SmartphoneIcon className="size-4" />
              </Button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex items-center justify-center min-h-screen p-8">
            {viewMode === "desktop" ? (
              <div className="w-full max-w-[600px] bg-white">
                <EmailRenderer blocks={blocks} />
              </div>
            ) : (
              <IPhoneFrame>
                <EmailRenderer blocks={blocks} />
              </IPhoneFrame>
            )}
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
