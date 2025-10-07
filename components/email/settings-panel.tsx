"use client";

import { Redo, Undo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingsPanelProps {
  selectedBlockId: string | null;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaved: boolean;
}

export function SettingsPanel({
  selectedBlockId,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isSaved,
}: SettingsPanelProps) {
  if (!selectedBlockId) {
    return null;
  }

  return (
    <div className="fixed right-0 top-0 h-screen w-[360px] flex flex-col bg-background border-l">
      {/* Panel Header with Tabs */}
      <div className="border-b px-4 py-3">
        <Tabs defaultValue="block" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="block" className="text-sm">
              Block
            </TabsTrigger>
            <TabsTrigger value="font" className="text-sm">
              Font
            </TabsTrigger>
            <TabsTrigger value="link" className="text-sm">
              Link
            </TabsTrigger>
          </TabsList>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-1 py-4">
            <TabsContent value="block" className="mt-0">
              <div className="text-sm text-muted-foreground">
                Block settings
              </div>
            </TabsContent>

            <TabsContent value="font" className="mt-0">
              <div className="text-sm text-muted-foreground">Font settings</div>
            </TabsContent>

            <TabsContent value="link" className="mt-0">
              <div className="text-sm text-muted-foreground">Link settings</div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Main Content Area (spacer to push footer to bottom) */}
      <div className="flex-1" />

      {/* Panel Footer */}
      <div className="border-t px-4 py-3 flex items-center justify-between">
        {/* Left side: Undo and Redo buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="Undo"
          >
            <Undo className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onRedo}
            disabled={!canRedo}
            aria-label="Redo"
          >
            <Redo className="size-4" />
          </Button>
        </div>

        {/* Right side: Saved status */}
        <div className="text-sm text-muted-foreground">
          {isSaved ? "Saved" : "Saving..."}
        </div>
      </div>
    </div>
  );
}
