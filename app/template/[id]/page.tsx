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
import { use, useEffect, useState } from "react";

export default function TemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: templateId } = use(params);
  const { blocks, selectedBlockId, setBlocks } = useEditor();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTemplateData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/templates/${templateId}`);
        const data = await response.json();

        if (data.success && data.template) {
          setBlocks(data.template.blocks);
        } else {
          setError(data.error || "Template not found");
        }
      } catch (err) {
        console.error("Error loading template:", err);
        setError("Failed to load template");
      } finally {
        setLoading(false);
      }
    }

    loadTemplateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  if (loading) {
    return (
      <TooltipProvider>
        <div className="h-[100dvh] bg-background overflow-y-auto">
          <Header />
          <main className="pt-14 min-h-screen flex items-center justify-center">
            <p className="text-muted-foreground">Loading template...</p>
          </main>
        </div>
      </TooltipProvider>
    );
  }

  if (error) {
    return (
      <TooltipProvider>
        <div className="h-[100dvh] bg-background overflow-y-auto">
          <Header />
          <main className="pt-14 min-h-screen flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </main>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="h-[100dvh] bg-background overflow-y-auto ">
        {/* Header */}
        <Header />

        {/* Left Toolbar */}
        <ToolbarLeft />

        {/* Right Toolbar */}
        <ToolbarRight />

        {/* Main Canvas */}
        <main
          className="pt-14 min-h-screen flex items-start justify-center transition-all duration-200"
          style={{
            marginRight: selectedBlockId ? "360px" : "0",
          }}
        >
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
