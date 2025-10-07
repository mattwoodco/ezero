"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-background border-b flex items-center justify-between px-6 z-40 shadow-sm">
      <h1 className="font-mono text-lg font-semibold">e0</h1>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Download className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Export</TooltipContent>
      </Tooltip>
    </header>
  );
}
