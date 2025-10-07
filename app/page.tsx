"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { TemplatesSidebar } from "@/components/templates-sidebar";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { TemplateMetadata } from "@/lib/email-templates";

export default function Home() {
  const [templates, setTemplates] = useState<TemplateMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    async function loadTemplates() {
      try {
        setLoading(true);
        const response = await fetch("/api/templates?starters=true");
        const data = await response.json();

        if (data.success) {
          setTemplates(data.templates);
        } else {
          setError(data.error || "Failed to load templates");
        }
      } catch (err) {
        console.error("Error loading templates:", err);
        setError("Failed to load templates");
      } finally {
        setLoading(false);
      }
    }

    loadTemplates();
  }, []);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  const filteredTemplates = useMemo(() => {
    if (selectedTags.length === 0) {
      return templates;
    }

    return templates.filter((template) => {
      if (!template.tags || template.tags.length === 0) {
        return false;
      }

      // Normalize tags to lowercase for case-insensitive comparison
      const normalizedTemplateTags = template.tags.map((t) => t.toLowerCase());
      const normalizedSelectedTags = selectedTags.map((t) => t.toLowerCase());

      // Template matches if it has ANY of the selected tags
      return normalizedSelectedTags.some((selectedTag) =>
        normalizedTemplateTags.includes(selectedTag),
      );
    });
  }, [templates, selectedTags]);

  return (
    <TooltipProvider>
      <div className="h-[100dvh] bg-background flex">
        <TemplatesSidebar
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearTags={handleClearTags}
        />

        <main className="flex-1 ml-[360px] py-28 overflow-y-auto h-full">
          {loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading templates...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {!loading && !error && templates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No templates found. Create your first template!
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            filteredTemplates.length === 0 &&
            templates.length > 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No templates match the selected filters. Try adjusting your
                  filter selection.
                </p>
              </div>
            )}

          {!loading && !error && filteredTemplates.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-[960px] px-20">
              {filteredTemplates.map((template) => (
                <Link key={template.id} href={`/template/${template.id}`}>
                  <div className="group relative bg-white overflow-hidden cursor-pointer">
                    {/* 3:4 aspect ratio container */}
                    <div className="relative aspect-[3/4] bg-gray-50 flex items-center justify-center rounded-lg overflow-hidden">
                      <div className="text-center p-6">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <title>Template</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono">
                          Email Template
                        </p>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <Button variant="secondary">View Details</Button>
                      </div>
                    </div>

                    {/* Template info */}
                    <div className="pt-3">
                      {template.category && (
                        <span className="uppercase mb-2 mr-2 text-xs text-muted-foreground font-light tracking-wider">
                          {template.category}
                        </span>
                      )}
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {template.name}
                      </h3>
                      {/* {template.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {template.description}
                        </p>
                      )}
                      */}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </TooltipProvider>
  );
}
