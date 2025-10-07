"use client";

import { BlockToolbar } from "@/components/editor/block-toolbar";
import { EmailBlock } from "@/components/editor/email-block";
import { Header } from "@/components/editor/header";
import { PreviewDialog } from "@/components/editor/preview-dialog";
import { SettingsPanel } from "@/components/editor/settings-panel";
import { ToolbarLeft } from "@/components/editor/toolbar-left";
import { ToolbarRight } from "@/components/editor/toolbar-right";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEditor } from "@/contexts/editor-context";

export default function Home() {
  const { blocks, selectedBlockId } = useEditor();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <Header />

        {/* Left Toolbar */}
        <ToolbarLeft />

        {/* Right Toolbar */}
        <ToolbarRight />

        {/* Main Canvas */}
        <main className="pt-14 min-h-screen flex items-start justify-center">
          <div className="w-full max-w-[600px] py-20">
            <div className="email-template bg-white">
              {blocks.map((block, index) => (
                <div key={block.id} data-block-id={block.id}>
                  <EmailBlock block={block} index={index} />
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Block Toolbar (appears when block is selected) */}
        {selectedBlockId && <BlockToolbar blockId={selectedBlockId} />}

        {/* Settings Panel (appears when block is selected) */}
        <SettingsPanel />

        {/* Preview Dialog */}
        <PreviewDialog />
      </div>
    </TooltipProvider>
  );
}
