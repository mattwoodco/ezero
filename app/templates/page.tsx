"use client";

import { Header } from "@/components/editor/header";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { TemplateMetadata } from "@/lib/email-templates";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20 px-6 pb-12 max-w-7xl mx-auto">

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

          {!loading && !error && templates.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-16">
              {templates.map((template) => (
                <Link key={template.id} href={`/${template.id}`}>
                  <div className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    {/* 3:4 aspect ratio container */}
                    <div className="aspect-[3/4] bg-gray-50 flex items-center justify-center border-b">
                      <div className="text-center p-6">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
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
                    </div>

                    {/* Template info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {template.name}
                      </h3>
                      {template.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {template.description}
                        </p>
                      )}
                      {template.category && (
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                          {template.category}
                        </span>
                      )}
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
