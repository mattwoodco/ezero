"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileSidebarToggleProps {
  onClick: () => void;
  className?: string;
}

export function MobileSidebarToggle({
  onClick,
  className,
}: MobileSidebarToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn("@md/app:hidden", className)}
      aria-label="Toggle sidebar"
    >
      <Menu className="size-5" />
    </Button>
  );
}
