"use client";

import { Download } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditor } from "@/contexts/editor-context";

const handleExport = (format: "jsx" | "html" | "json") => {
  const content = "hello world";
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `export.${format === "jsx" ? "jsx" : format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export function Header() {
  const { gmailActionsEnabled, setGmailActionsEnabled } = useEditor();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-background flex items-center justify-between px-7 z-40 shadow-accent shadow-lg">
      <Link href="/">
        <h1 className="font-mono text-xl font-semibold cursor-pointer hover:opacity-70 transition-opacity">
          e0
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <NextImage
                src="/images/google.svg"
                width={16}
                height={16}
                alt="Google"
              />
              <Switch
                checked={gmailActionsEnabled}
                onCheckedChange={setGmailActionsEnabled}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p>
              Learn about Gmail Actions and how they enhance emails with
              interactive buttons.{" "}
              <a
                href="https://developers.google.com/workspace/gmail/markup/actions/actions-overview"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline hover:no-underline font-medium"
              >
                Read the docs
              </a>
            </p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="min-h-[44px] min-w-[44px]"
                >
                  <Download className="size-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Export</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport("jsx")}>
              Export as JSX
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("html")}>
              Export as HTML
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("json")}>
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
