"use client";

import { Analytics } from "@vercel/analytics/next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

import { CommandDialog } from "@/components/command-dialog";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { EditorProvider } from "@/contexts/editor-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <NuqsAdapter>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <EditorProvider>
            {children}
            <Analytics />
            <CommandDialog />
          </EditorProvider>
        </ThemeProvider>
      </NuqsAdapter>
    </Suspense>
  );
}
