"use client";

import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import { Button, type buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IconButtonProps
  extends Omit<React.ComponentProps<"button">, "children">,
    VariantProps<typeof buttonVariants> {
  /**
   * The icon to display in the button
   */
  icon: React.ReactNode;
  /**
   * Tooltip text to display on hover
   */
  tooltip: string;
  /**
   * Button variant (defaults to 'ghost')
   */
  variant?: VariantProps<typeof buttonVariants>["variant"];
  /**
   * Button size (defaults to 'icon')
   */
  size?: VariantProps<typeof buttonVariants>["size"];
  /**
   * Side on which the tooltip should appear
   */
  tooltipSide?: "top" | "right" | "bottom" | "left";
}

/**
 * IconButton component - A button with an integrated tooltip
 *
 * Features:
 * - Instant tooltip appearance (0ms delay)
 * - Defaults to ghost variant for minimal styling
 * - Defaults to icon size for proper icon-only button dimensions
 * - Smooth fade transition for tooltip
 *
 * @example
 * ```tsx
 * <IconButton
 *   icon={<PlusIcon />}
 *   tooltip="Add new item"
 *   onClick={() => console.log('clicked')}
 * />
 * ```
 */
function IconButton({
  icon,
  tooltip,
  variant = "ghost",
  size = "icon",
  tooltipSide = "bottom",
  className,
  ...props
}: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          aria-label={tooltip}
          {...props}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide} sideOffset={4}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

export { IconButton };
export type { IconButtonProps };
