"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface TemplatesSidebarProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TEMPLATE_TAGS = [
  "Welcome",
  "Newsletter",
  "Promotion",
  "Transactional",
  "Announcement",
  "Product Update",
  "Event",
  "Survey",
] as const;

export function TemplatesSidebar({
  selectedTags,
  onTagsChange,
}: TemplatesSidebarProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearAllTags = () => {
    onTagsChange([]);
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[360px] bg-background border-r flex flex-col z-30">
      {/* Logo/Branding */}
      <div className="h-14 border-b flex items-center px-7">
        <Link href="/templates">
          <h1 className="font-mono text-xl font-semibold cursor-pointer hover:opacity-70 transition-opacity">
            e0
          </h1>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Templates Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">
                Filter by Category
              </h2>
              {selectedTags.length > 0 && (
                <button
                  onClick={clearAllTags}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Tag Filters */}
            <div className="space-y-2">
              {TEMPLATE_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <label
                    key={tag}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all",
                      "hover:bg-accent/50",
                      isSelected && "bg-accent"
                    )}
                  >
                    {/* Custom Checkbox */}
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleTag(tag)}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          "w-4 h-4 rounded border-2 transition-all flex items-center justify-center",
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-input bg-background"
                        )}
                      >
                        {isSelected && (
                          <svg
                            className="w-3 h-3 text-primary-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Tag Label */}
                    <span
                      className={cn(
                        "text-sm transition-colors flex-1",
                        isSelected
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {tag}
                    </span>

                    {/* Badge with count (optional - can be connected to actual counts) */}
                    {isSelected && (
                      <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {selectedTags.indexOf(tag) + 1}
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Selected Tags Summary */}
          {selectedTags.length > 0 && (
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-3">
                {selectedTags.length} {selectedTags.length === 1 ? "filter" : "filters"} active
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                      "bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                  >
                    {tag}
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer (optional - could add settings, help, etc.) */}
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground text-center">
          {TEMPLATE_TAGS.length} categories available
        </p>
      </div>
    </aside>
  );
}
