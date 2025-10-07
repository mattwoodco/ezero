"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TemplatesSidebarProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
}

const AVAILABLE_TAGS = [
  {
    id: "newsletter",
    label: "Newsletter",
  },
  {
    id: "marketing",
    label: "Marketing",
  },
  {
    id: "transactional",
    label: "Transactional",
  },
  {
    id: "welcome",
    label: "Welcome",
  },
  {
    id: "notification",
    label: "Notification",
  },
  {
    id: "receipt",
    label: "Receipt",
  },
  {
    id: "invitation",
    label: "Invitation",
  },
  {
    id: "imported",
    label: "Imported",
  },
];

export function TemplatesSidebar({
  selectedTags,
  onTagToggle,
  onClearTags,
}: TemplatesSidebarProps) {
  return (
    <div className="w-[360px] fixed left-0 top-0 h-screen bg-background border-r overflow-y-auto">
      <div className="px-7 py-2">
        <div className="flex items-center justify-between mb-6 h-9">
          <h1 className="font-mono text-xl font-semibold cursor-pointer hover:opacity-70 transition-opacity leading-none relative top-[1.5px]">
            e0
          </h1>
          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearTags}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="space-y-4 mt-20">
          <div className="min-h-[80px]">
            <h3 className="sr-only">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    type="button"
                    key={tag.id}
                    onClick={() => onTagToggle(tag.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    )}
                  >
                    {tag.label}
                    {isSelected && <X className="size-3" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
