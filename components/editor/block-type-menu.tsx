"use client";

import {
  ArrowRight,
  CalendarCheck,
  CheckCircle,
  CreditCard,
  Eye,
  Heading as HeadingIcon,
  Heart,
  Image,
  Mail,
  MapPin,
  MessageSquare,
  Minus,
  MousePointerClick,
  Package,
  QrCode,
  Share2,
  ShoppingCart,
  Space,
  Star,
  Ticket,
  Type,
  UserPlus,
  X,
  Zap,
} from "lucide-react";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { EmailBlockType } from "@/types/email";

interface BlockTypeMenuProps {
  onSelect: (type: EmailBlockType) => void;
  onClose?: () => void;
  children?: React.ReactNode;
}

// Map block types to preview images
const blockPreviewImages: Record<string, string> = {
  goto: "/images/2_ViewAction-Go-to-URL.png",
  confirm: "/images/3_ConfirmAction-One-Click-Confirm.png",
  rsvp: "/images/4_RsvpAction-Event-RSVP.png",
  rating: "/images/5_ReviewAction-Quick-Review-and-Feedback.png",
  track: "/images/6_TrackAction-Shipment-Tracking.png",
  order: "/images/7_OrderAction-View-Order-Details.png",
  favorite: "/images/8_SaveAction-One-Click-Save.png",
  pay: "/images/9_PayAction-Initiate-Payment.png",
};

const blockTypes: Array<{
  type: EmailBlockType;
  label: string;
  icon: React.ReactNode;
  category: "basic" | "interactive" | "gmail";
}> = [
  // Basic blocks
  {
    type: "text",
    label: "Text",
    icon: <Type className="h-4 w-4" />,
    category: "basic",
  },
  {
    type: "heading",
    label: "Heading",
    icon: <HeadingIcon className="h-4 w-4" />,
    category: "basic",
  },
  {
    type: "button",
    label: "Button",
    icon: <MousePointerClick className="h-4 w-4" />,
    category: "basic",
  },
  {
    type: "image",
    label: "Image",
    icon: <Image className="h-4 w-4" />,
    category: "basic",
  },
  {
    type: "divider",
    label: "Divider",
    icon: <Minus className="h-4 w-4" />,
    category: "basic",
  },
  {
    type: "spacer",
    label: "Spacer",
    icon: <Space className="h-4 w-4" />,
    category: "basic",
  },

  // Interactive blocks
  {
    type: "footer",
    label: "Footer",
    icon: <Mail className="h-4 w-4" />,
    category: "interactive",
  },
  {
    type: "address",
    label: "Address",
    icon: <MapPin className="h-4 w-4" />,
    category: "interactive",
  },
  {
    type: "social",
    label: "Social Links",
    icon: <Share2 className="h-4 w-4" />,
    category: "interactive",
  },
  {
    type: "rating",
    label: "Rating",
    icon: <Star className="h-4 w-4" />,
    category: "interactive",
  },
  {
    type: "feedback",
    label: "Feedback",
    icon: <MessageSquare className="h-4 w-4" />,
    category: "interactive",
  },
  {
    type: "subscribe",
    label: "Subscribe",
    icon: <UserPlus className="h-4 w-4" />,
    category: "interactive",
  },
  {
    type: "promocode",
    label: "Promo Code",
    icon: <Ticket className="h-4 w-4" />,
    category: "interactive",
  },
  {
    type: "qr",
    label: "QR Code",
    icon: <QrCode className="h-4 w-4" />,
    category: "interactive",
  },

  // Gmail Actions
  {
    type: "gmailActions",
    label: "Gmail Actions",
    icon: <Zap className="h-4 w-4" />,
    category: "gmail",
  },
  {
    type: "track",
    label: "Track Package",
    icon: <Package className="h-4 w-4" />,
    category: "gmail",
  },
  {
    type: "order",
    label: "Order Details",
    icon: <ShoppingCart className="h-4 w-4" />,
    category: "gmail",
  },
  {
    type: "viewDetails",
    label: "View Details",
    icon: <Eye className="h-4 w-4" />,
    category: "gmail",
  },
  {
    type: "favorite",
    label: "Favorite",
    icon: <Heart className="h-4 w-4" />,
    category: "gmail",
  },
  {
    type: "pay",
    label: "Payment",
    icon: <CreditCard className="h-4 w-4" />,
    category: "gmail",
  },
  {
    type: "rsvp",
    label: "RSVP",
    icon: <CalendarCheck className="h-4 w-4" />,
    category: "gmail",
  },
  {
    type: "confirm",
    label: "Confirm",
    icon: <CheckCircle className="h-4 w-4" />,
    category: "gmail",
  },
  {
    type: "goto",
    label: "Go To",
    icon: <ArrowRight className="h-4 w-4" />,
    category: "gmail",
  },
];

export function BlockTypeMenu({
  onSelect,
  onClose,
  children,
}: BlockTypeMenuProps) {
  const basicBlocks = blockTypes.filter((b) => b.category === "basic");
  const interactiveBlocks = blockTypes.filter(
    (b) => b.category === "interactive",
  );
  const gmailBlocks = blockTypes.filter((b) => b.category === "gmail");

  // If children is provided, render it (for trigger usage in dialogs)
  if (children) {
    return <>{children}</>;
  }

  return (
    <div className="w-full bg-muted/30 border border-dashed border-border rounded-lg p-6 my-2 relative">
      {/* Close button */}
      {onClose && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px]"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-4 items-start">
        {/* Gmail Actions Row */}
        <div className="text-sm font-semibold pt-1.5 inline-flex items-center gap-2 justify-end text-right">
          <NextImage
            src="/images/google.svg"
            alt="Google"
            width={16}
            height={16}
            className="inline-block"
          />
          Gmail Actions
        </div>
        <div className="flex flex-wrap gap-2">
          {gmailBlocks
            .filter(({ type }) => type !== "gmailActions")
            .map(({ type, label, icon }) => (
              <Tooltip key={type}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onSelect(type)}
                    className={cn(
                      "px-3 py-0.5 rounded-full border-2 border-border bg-background",
                      "hover:border-primary hover:bg-primary/5 transition-all cursor-pointer",
                      "text-sm font-medium inline-flex items-center gap-1.5",
                      "min-h-[44px]", // Minimum touch target for mobile
                    )}
                  >
                    {icon}
                    {label}
                  </button>
                </TooltipTrigger>
                {blockPreviewImages[type] && (
                  <TooltipContent side="right" className="p-1">
                    <NextImage
                      src={blockPreviewImages[type]}
                      alt={label}
                      width={300}
                      height={200}
                      className="rounded"
                    />
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
        </div>

        {/* Basic Row */}
        <div className="text-sm font-semibold pt-1.5 text-right">
          Basic
        </div>
        <div className="flex flex-wrap gap-2">
          {basicBlocks.map(({ type, label, icon }) => (
            <button
              type="button"
              key={type}
              onClick={() => onSelect(type)}
              className={cn(
                "px-3 py-0.5 rounded-full border-2 border-border bg-background",
                "hover:border-primary hover:bg-primary/5 transition-all cursor-pointer",
                "text-sm font-medium inline-flex items-center gap-1.5",
                "min-h-[44px]", // Minimum touch target for mobile
              )}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Interactive Row */}
        <div className="text-sm font-semibold pt-1.5 text-right">
          Interactive
        </div>
        <div className="flex flex-wrap gap-2">
          {interactiveBlocks.map(({ type, label, icon }) => (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onSelect(type)}
                  className={cn(
                    "px-3 py-0.5 rounded-full border-2 border-border bg-background",
                    "hover:border-primary hover:bg-primary/5 transition-all cursor-pointer",
                    "text-sm font-medium inline-flex items-center gap-1.5",
                    "min-h-[44px]", // Minimum touch target for mobile
                  )}
                >
                  {icon}
                  {label}
                </button>
              </TooltipTrigger>
              {blockPreviewImages[type] && (
                <TooltipContent side="right" className="p-1">
                  <NextImage
                    src={blockPreviewImages[type]}
                    alt={label}
                    width={300}
                    height={200}
                    className="rounded"
                  />
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}
