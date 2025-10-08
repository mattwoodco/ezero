"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditor } from "@/contexts/editor-context";
import { Redo, Undo, ChevronDown } from "lucide-react";
import { GmailActionsSettingsPanel } from "./gmail-actions-settings";
import { BlockTypeMenu } from "./block-type-menu";
import type { GmailActionsSettings } from "@/types/email";

export function SettingsPanel() {
  const {
    selectedBlockId,
    blocks,
    canUndo,
    canRedo,
    undo,
    redo,
    updateBlockSettings,
    updateBlockType,
  } = useEditor();

  if (!selectedBlockId) return null;

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  return (
    <div className="fixed right-0 top-14 bottom-0 w-[360px] bg-background border-l flex flex-col z-30">
      <Tabs defaultValue="block" className="flex-1 flex flex-col">
        <div className="border-b">
          <TabsList className="w-full bg-transparent p-0 h-auto rounded-none justify-start gap-8 px-6 pt-4">
            <TabsTrigger
              value="font"
              className="!bg-transparent !shadow-none text-muted-foreground data-[state=active]:text-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-foreground px-0 pb-3 w-auto data-[state=active]:!bg-transparent data-[state=active]:!shadow-none !border-transparent !border-x-0 !border-t-0 cursor-pointer"
            >
              Font
            </TabsTrigger>
            <TabsTrigger
              value="block"
              className="!bg-transparent !shadow-none text-muted-foreground data-[state=active]:text-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-foreground px-0 pb-3 w-auto data-[state=active]:!bg-transparent data-[state=active]:!shadow-none !border-transparent !border-x-0 !border-t-0 cursor-pointer"
            >
              Layout
            </TabsTrigger>
            <TabsTrigger
              value="link"
              className="!bg-transparent !shadow-none text-muted-foreground data-[state=active]:text-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-foreground px-0 pb-3 w-auto data-[state=active]:!bg-transparent data-[state=active]:!shadow-none !border-transparent !border-x-0 !border-t-0 cursor-pointer"
            >
              Link
            </TabsTrigger>
            <TabsTrigger
              value="blockSettings"
              className="!bg-transparent !shadow-none text-muted-foreground data-[state=active]:text-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-foreground px-0 pb-3 w-auto data-[state=active]:!bg-transparent data-[state=active]:!shadow-none !border-transparent !border-x-0 !border-t-0 cursor-pointer"
            >
              Block
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="block">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Block Type</h3>
                <BlockTypeMenu
                  onSelect={(type) => updateBlockType(selectedBlockId, type)}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal"
                  >
                    <span className="capitalize">{selectedBlock?.type}</span>
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
                    (selectedBlock.settings as GmailActionsSettings) || {
                      actions: [],
                    }
                  }
                  onChange={(newSettings) =>
                    updateBlockSettings(selectedBlockId, newSettings)
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

        <div className="border-t px-4 py-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={!canUndo}
                  onClick={undo}
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
    </div>
  );
}
