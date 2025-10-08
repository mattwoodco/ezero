"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface TemplatesSidebarProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AVAILABLE_TAGS = [
  {
    id: "launch",
    label: "Launch",
  },
  {
    id: "promotion",
    label: "Promotion",
  },
  {
    id: "deal",
    label: "Deal",
  },
  {
    id: "event",
    label: "Event",
  },
  {
    id: "announcement",
    label: "Announcement",
  },
  {
    id: "update",
    label: "Update",
  },
  {
    id: "feedback",
    label: "Feedback",
  },
];

export function TemplatesSidebar({
  selectedTags,
  onTagToggle,
  onClearTags,
  isOpen = false,
  onOpenChange,
}: TemplatesSidebarProps) {
  const sidebarContent = (showClose = false) => (
    <div className="px-7 py-2">
      <div className="flex items-center justify-between mb-6 h-9">
        <h1 className="font-mono text-xl font-semibold cursor-pointer hover:opacity-70 transition-opacity leading-none relative top-[1.5px]">
          e0
        </h1>
        <div className="flex items-center gap-2">
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
          {showClose && onOpenChange && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close sidebar"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
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
  );

  return (
    <>
      {/* Mobile: Sheet drawer */}
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className="w-[280px] p-0 overflow-y-auto @md/app:hidden"
          showCloseButton={false}
        >
          {sidebarContent(true)}
        </SheetContent>
      </Sheet>

      {/* Desktop: Fixed sidebar */}
      <div className="hidden @md/app:block @md/app:w-[320px] @lg/app:w-[360px] @md/app:overflow-y-auto">
        {sidebarContent(false)}
      </div>
    </>
  );
}
