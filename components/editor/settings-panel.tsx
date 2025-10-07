"use client";

import { Redo, Undo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditor } from "@/contexts/editor-context";

export function SettingsPanel() {
  const { selectedBlockId, blocks, canUndo, canRedo, undo, redo } = useEditor();

  if (!selectedBlockId) return null;

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  return (
    <div className="fixed right-0 top-14 bottom-0 w-[360px] bg-background border-l flex flex-col z-30">
      <Tabs defaultValue="block" className="flex-1 flex flex-col">
        <div className="border-b p-4">
          <TabsList className="w-full">
            <TabsTrigger value="block" className="flex-1">
              Block
            </TabsTrigger>
            <TabsTrigger value="font" className="flex-1">
              Font
            </TabsTrigger>
            <TabsTrigger value="link" className="flex-1">
              Link
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="block">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Block Type</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedBlock?.type}
                </p>
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
        </div>

        <div className="border-t p-4 flex items-center justify-between">
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
