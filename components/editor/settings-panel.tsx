"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditor } from "@/contexts/editor-context";
import type { GmailActionsSettings } from "@/types/email";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, Redo, Undo, X } from "lucide-react";
import { BlockTypeMenu } from "./block-type-menu";
import { GmailActionsSettingsPanel } from "./gmail-actions-settings";

interface SettingsPanelProps {
  isMobileScrollSnap?: boolean;
}

export function SettingsPanel({ isMobileScrollSnap = false }: SettingsPanelProps) {
  const {
    selectedBlockId,
    blocks,
    canUndo,
    canRedo,
    undo,
    redo,
    updateBlockSettings,
    updateBlockType,
    selectBlock,
  } = useEditor();

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  // Debounced open/close state to prevent flashing
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (selectedBlockId !== null) {
      // Clear any pending close
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      setIsOpen(true);
    } else {
      // Delay close to ignore rapid flicker
      closeTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 50);
    }

    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [selectedBlockId]);

  const handleClose = () => {
    selectBlock(null);
  };

  // Shared content component
  const panelContent = (
    <Tabs defaultValue="block" className="flex-1 flex flex-col">
      {/* Header with Close Button */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-sm font-medium">Block Settings</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-8 w-8"
          aria-label="Close settings panel"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs Navigation */}
      <div>
        <TabsList
          className="
            w-full bg-transparent p-0 h-auto rounded-none
            justify-start gap-4 px-4 pt-4
            overflow-x-auto overflow-y-hidden
            scrollbar-hide
            -webkit-overflow-scrolling-touch
          "
        >
          <TabsTrigger
            value="font"
            className="
              !bg-transparent !shadow-none text-muted-foreground
              data-[state=active]:text-foreground rounded-none
              border-b-2 border-transparent data-[state=active]:border-foreground
              px-0 pb-3 w-auto flex-shrink-0
              data-[state=active]:!bg-transparent data-[state=active]:!shadow-none
              !border-transparent !border-x-0 !border-t-0 cursor-pointer
            "
          >
            Font
          </TabsTrigger>
          <TabsTrigger
            value="block"
            className="
              !bg-transparent !shadow-none text-muted-foreground
              data-[state=active]:text-foreground rounded-none
              border-b-2 border-transparent data-[state=active]:border-foreground
              px-0 pb-3 w-auto flex-shrink-0
              data-[state=active]:!bg-transparent data-[state=active]:!shadow-none
              !border-transparent !border-x-0 !border-t-0 cursor-pointer
            "
          >
            Layout
          </TabsTrigger>
          <TabsTrigger
            value="link"
            className="
              !bg-transparent !shadow-none text-muted-foreground
              data-[state=active]:text-foreground rounded-none
              border-b-2 border-transparent data-[state=active]:border-foreground
              px-0 pb-3 w-auto flex-shrink-0
              data-[state=active]:!bg-transparent data-[state=active]:!shadow-none
              !border-transparent !border-x-0 !border-t-0 cursor-pointer
            "
          >
            Link
          </TabsTrigger>
          <TabsTrigger
            value="blockSettings"
            className="
              !bg-transparent !shadow-none text-muted-foreground
              data-[state=active]:text-foreground rounded-none
              border-b-2 border-transparent data-[state=active]:border-foreground
              px-0 pb-3 w-auto flex-shrink-0
              data-[state=active]:!bg-transparent data-[state=active]:!shadow-none
              !border-transparent !border-x-0 !border-t-0 cursor-pointer
            "
          >
            Block
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <TabsContent value="block">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Block Type</h3>
              <BlockTypeMenu
                onSelect={(type) =>
                  updateBlockType(selectedBlockId, type)
                }
              >
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal"
                >
                  <span className="capitalize">
                    {selectedBlock?.type}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </BlockTypeMenu>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Content</h3>
              <p className="text-sm text-muted-foreground">
                {selectedBlock?.content || "No content"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Block settings coming soon...
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="font">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Font settings coming soon...
            </p>
          </div>
        </TabsContent>

        <TabsContent value="link">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Link settings coming soon...
            </p>
          </div>
        </TabsContent>

        <TabsContent value="blockSettings">
          <div className="space-y-4">
            {selectedBlock?.type === "gmailActions" ? (
              <GmailActionsSettingsPanel
                settings={
                  (selectedBlock.settings as
                    | GmailActionsSettings
                    | undefined) || {
                    actions: [],
                  }
                }
                onChange={(newSettings) =>
                  updateBlockSettings(
                    selectedBlockId,
                    newSettings as unknown as Record<string, unknown>,
                  )
                }
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Block settings coming soon...
              </p>
            )}
          </div>
        </TabsContent>
      </div>

      {/* Footer - Undo/Redo */}
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={!canUndo}
                onClick={undo}
                aria-label="Undo last action"
              >
                <Undo className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={!canRedo}
                onClick={redo}
                aria-label="Redo last action"
              >
                <Redo className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>

        <span className="text-xs text-muted-foreground">Saved</span>
      </div>
    </Tabs>
  );

  // Mobile scroll-snap variant
  if (isMobileScrollSnap) {
    return (
      <div className="h-full w-full bg-background flex flex-col">
        {panelContent}
      </div>
    );
  }

  // Default Dialog-based implementation
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      modal={false}
    >
      <Dialog.Portal>
        {/* Overlay - hidden for now */}
        {/* <Dialog.Overlay
          className="fixed inset-0 bg-black/50 z-30 animate-in fade-in duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out"
          aria-label="Settings panel overlay"
        /> */}

        {/* Panel Content - Sidebar for all breakpoints */}
        <Dialog.Content
          className={`
            fixed top-0 bottom-0 right-0
            w-[360px] h-screen bg-background
            flex flex-col z-30
            shadow-xl
            transition-transform duration-200
            ${selectedBlockId ? 'translate-x-0' : 'translate-x-full'}
          `}
          aria-label="Block settings panel"
          aria-describedby="settings-panel-description"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          forceMount
        >
          <div id="settings-panel-description" className="sr-only">
            Configure settings for the selected block including layout, fonts,
            links, and block-specific options.
          </div>

          {panelContent}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
