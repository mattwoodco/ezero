"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MobilePanelIndicatorProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function MobilePanelIndicator({
  containerRef,
}: MobilePanelIndicatorProps) {
  const [activePanel, setActivePanel] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const width = container.clientWidth;
      const currentPanel = Math.round(scrollLeft / width);
      setActivePanel(currentPanel);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef]);

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-40 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-full border">
      <div
        className={cn(
          "w-2 h-2 rounded-full transition-colors",
          activePanel === 0 ? "bg-primary" : "bg-border",
        )}
      />
      <div
        className={cn(
          "w-2 h-2 rounded-full transition-colors",
          activePanel === 1 ? "bg-primary" : "bg-border",
        )}
      />
    </div>
  );
}
