"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IPhoneFrameProps {
  children: ReactNode;
  className?: string;
}

export function IPhoneFrame({ children, className }: IPhoneFrameProps) {
  return (
    <div
      className={cn(
        "p-[10px] border border-border rounded-[36px] transition-shadow duration-200 hover:shadow-2xl",
        className,
      )}
    >
      <div className="relative w-[375px] h-[667px] bg-white rounded-[26px] border border-border overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[180px] h-[30px] bg-black rounded-b-[20px] z-10" />

        {/* Content */}
        <div className="w-full h-full overflow-y-auto pt-[30px]">
          {children}
        </div>
      </div>
    </div>
  );
}
