"use client";

import { use, useEffect, useRef, useState } from "react";
import { BlockToolbar } from "@/components/editor/block-toolbar";
import { EmailBlock } from "@/components/editor/email-block";
import { Header } from "@/components/editor/header";
import { MobilePanelIndicator } from "@/components/editor/mobile-panel-indicator";
import { PreviewDialog } from "@/components/editor/preview-dialog";
import { SettingsPanel } from "@/components/editor/settings-panel";
import { ToolbarLeft } from "@/components/editor/toolbar-left";
import { ToolbarRight } from "@/components/editor/toolbar-right";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEditor } from "@/contexts/editor-context";
import type { EmailTemplate } from "@/types/email";

export default function TemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: templateId } = use(params);
  const { blocks, selectedBlockId, setBlocks } = useEditor();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [template, setTemplate] = useState<EmailTemplate | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadedTemplateIdRef = useRef<string | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Prevent duplicate loads for the same template
    if (loadedTemplateIdRef.current === templateId) {
      return;
    }

    async function loadTemplateData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/templates/${templateId}`);
        const data = await response.json();

        if (data.success && data.template) {
          setBlocks(data.template.blocks);
          setTemplate(data.template);
          loadedTemplateIdRef.current = templateId;
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
  }, [templateId, setBlocks]);

  // Scroll back to template view when block is deselected (mobile only)
  useEffect(() => {
    if (!selectedBlockId && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  }, [selectedBlockId]);

  // Auto-save effect
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!template) {
      return;
    }

    const timer = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        const response = await fetch(`/api/templates/${templateId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: template.metadata.name,
            blocks,
            description: template.metadata.description,
            category: template.metadata.category,
          }),
        });

        if (response.ok) {
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        } else {
          setSaveStatus("error");
        }
      } catch (error) {
        console.error("Error saving template:", error);
        setSaveStatus("error");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [blocks, templateId, template]);

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
      <div className="h-[100dvh] bg-background overflow-y-auto @container/editor overscroll-none">
        {/* Header */}
        <Header />

        {/* Left Toolbar */}
        <ToolbarLeft />

        {/* Right Toolbar */}
        <ToolbarRight />

        {/* Desktop: Traditional layout with fixed sidebar */}
        <div className="hidden @lg/editor:block">
          <main
            className={`
              pt-14 min-h-screen flex items-start justify-center
              transition-all duration-200
              @container/workspace
              ml-16 pl-4
              ${selectedBlockId ? "mr-[360px] pr-16" : "mr-4 pr-4"}
            `}
          >
            <div className="w-full max-w-[600px] py-20 flex-shrink-0">
              <div className="email-template bg-card rounded-lg">
                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    data-block-id={block.id}
                    className="relative"
                  >
                    <EmailBlock block={block} index={index} />
                    {/* Block Toolbar (appears when block is selected) */}
                    {selectedBlockId === block.id && (
                      <BlockToolbar blockId={selectedBlockId} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Settings Panel - Desktop sidebar */}
          <SettingsPanel saveStatus={saveStatus} />
        </div>

        {/* Mobile: Horizontal scroll-snap container */}
        <div className="@lg/editor:hidden h-[calc(100dvh-56px)] mt-14">
          <div
            ref={scrollContainerRef}
            data-scroll-container
            className={`
              flex h-full w-full
              overflow-y-hidden
              scroll-snap-x-mandatory
              overscroll-none
              ${selectedBlockId ? "overflow-x-auto" : "overflow-x-hidden"}
            `}
          >
            {/* Panel 1: Template View */}
            <div className="flex-shrink-0 w-full h-full scroll-snap-start overflow-y-auto">
              <main className="min-h-screen">
                <div className="w-full max-w-[600px] mx-auto py-20">
                  <div className="email-template bg-card rounded-lg">
                    {blocks.map((block, index) => (
                      <div
                        key={block.id}
                        data-block-id={block.id}
                        className="relative"
                      >
                        <EmailBlock block={block} index={index} />
                        {/* Block Toolbar (appears when block is selected) */}
                        {selectedBlockId === block.id && (
                          <BlockToolbar blockId={selectedBlockId} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </main>
            </div>

            {/* Panel 2: Settings Panel */}
            {selectedBlockId && (
              <div className="flex-shrink-0 w-full h-full scroll-snap-start overflow-y-auto">
                <SettingsPanel
                  isMobileScrollSnap={true}
                  saveStatus={saveStatus}
                />
              </div>
            )}
          </div>

          {/* Scroll indicators */}
          {selectedBlockId && (
            <MobilePanelIndicator containerRef={scrollContainerRef} />
          )}
        </div>

        {/* Preview Dialog */}
        <PreviewDialog />
      </div>
    </TooltipProvider>
  );
}
