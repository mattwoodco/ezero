"use client";

import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-background shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: Logo */}
        <div className="font-mono text-lg font-medium">e0</div>

        {/* Right: Export Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <FileDown className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
