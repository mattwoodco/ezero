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
    color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  },
  {
    id: "marketing",
    label: "Marketing",
    color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
  },
  {
    id: "transactional",
    label: "Transactional",
    color: "bg-green-100 text-green-700 hover:bg-green-200",
  },
  {
    id: "welcome",
    label: "Welcome",
    color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
  },
  {
    id: "notification",
    label: "Notification",
    color: "bg-orange-100 text-orange-700 hover:bg-orange-200",
  },
  {
    id: "receipt",
    label: "Receipt",
    color: "bg-pink-100 text-pink-700 hover:bg-pink-200",
  },
  {
    id: "invitation",
    label: "Invitation",
    color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
  },
  {
    id: "imported",
    label: "Imported",
    color: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  },
];

export function TemplatesSidebar({
  selectedTags,
  onTagToggle,
  onClearTags,
}: TemplatesSidebarProps) {
  return (
    <div className="w-[360px] fixed left-0 top-0 h-screen bg-background border-r overflow-y-auto">
      <div className="px-7 p-3">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-mono text-xl font-semibold cursor-pointer hover:opacity-70 transition-opacity mt-1 leading-none relative top-[1.5px]">
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
          <div>
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
                        ? tag.color +
                            " ring-2 ring-offset-2 ring-offset-background ring-current/20"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                    )}
                  >
                    {tag.label}
                    {isSelected && <X className="size-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedTags.length > 0 && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {selectedTags.length}
                </span>{" "}
                {selectedTags.length === 1 ? "filter" : "filters"} active
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
