"use client";

import {
  Type,
  Heading as HeadingIcon,
  MousePointerClick,
  Image,
  Minus,
  Space,
  Mail,
  MapPin,
  Share2,
  Star,
  MessageSquare,
  UserPlus,
  Package,
  ShoppingCart,
  Eye,
  Heart,
  CreditCard,
  CalendarCheck,
  CheckCircle,
  ArrowRight,
  Ticket,
  QrCode,
  Zap,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EmailBlockType } from "@/types/email";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NextImage from "next/image";

interface BlockTypeMenuProps {
  onSelect: (type: EmailBlockType) => void;
  onClose?: () => void;
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
  { type: "text", label: "Text", icon: <Type className="h-4 w-4" />, category: "basic" },
  { type: "heading", label: "Heading", icon: <HeadingIcon className="h-4 w-4" />, category: "basic" },
  { type: "button", label: "Button", icon: <MousePointerClick className="h-4 w-4" />, category: "basic" },
  { type: "image", label: "Image", icon: <Image className="h-4 w-4" />, category: "basic" },
  { type: "divider", label: "Divider", icon: <Minus className="h-4 w-4" />, category: "basic" },
  { type: "spacer", label: "Spacer", icon: <Space className="h-4 w-4" />, category: "basic" },

  // Interactive blocks
  { type: "footer", label: "Footer", icon: <Mail className="h-4 w-4" />, category: "interactive" },
  { type: "address", label: "Address", icon: <MapPin className="h-4 w-4" />, category: "interactive" },
  { type: "social", label: "Social Links", icon: <Share2 className="h-4 w-4" />, category: "interactive" },
  { type: "rating", label: "Rating", icon: <Star className="h-4 w-4" />, category: "interactive" },
  { type: "feedback", label: "Feedback", icon: <MessageSquare className="h-4 w-4" />, category: "interactive" },
  { type: "subscribe", label: "Subscribe", icon: <UserPlus className="h-4 w-4" />, category: "interactive" },
  { type: "promocode", label: "Promo Code", icon: <Ticket className="h-4 w-4" />, category: "interactive" },
  { type: "qr", label: "QR Code", icon: <QrCode className="h-4 w-4" />, category: "interactive" },

  // Gmail Actions
  { type: "gmailActions", label: "Gmail Actions", icon: <Zap className="h-4 w-4" />, category: "gmail" },
  { type: "track", label: "Track Package", icon: <Package className="h-4 w-4" />, category: "gmail" },
  { type: "order", label: "Order Details", icon: <ShoppingCart className="h-4 w-4" />, category: "gmail" },
  { type: "viewDetails", label: "View Details", icon: <Eye className="h-4 w-4" />, category: "gmail" },
  { type: "favorite", label: "Favorite", icon: <Heart className="h-4 w-4" />, category: "gmail" },
  { type: "pay", label: "Payment", icon: <CreditCard className="h-4 w-4" />, category: "gmail" },
  { type: "rsvp", label: "RSVP", icon: <CalendarCheck className="h-4 w-4" />, category: "gmail" },
  { type: "confirm", label: "Confirm", icon: <CheckCircle className="h-4 w-4" />, category: "gmail" },
  { type: "goto", label: "Go To", icon: <ArrowRight className="h-4 w-4" />, category: "gmail" },
];

export function BlockTypeMenu({ onSelect, onClose }: BlockTypeMenuProps) {
  const basicBlocks = blockTypes.filter((b) => b.category === "basic");
  const interactiveBlocks = blockTypes.filter((b) => b.category === "interactive");
  const gmailBlocks = blockTypes.filter((b) => b.category === "gmail");

  return (
    <div className="w-full bg-muted/30 border border-dashed border-border rounded-lg p-6 my-2 relative">
      {/* Close button */}
      {onClose && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      {/* Gmail Actions */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3 inline-flex items-center gap-2">
          <NextImage
            src="/images/google.svg"
            alt="Google"
            width={16}
            height={16}
            className="inline-block"
          />
          Gmail Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          {gmailBlocks.filter(({ type }) => type !== "gmailActions").map(({ type, label, icon }) => (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onSelect(type)}
                  className={cn(
                    "px-3 py-1.5 rounded-full border-2 border-border bg-background",
                    "hover:border-primary hover:bg-primary/5 transition-all cursor-pointer",
                    "text-xs font-medium inline-flex items-center gap-1.5"
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

      {/* Basic Blocks */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Basic Blocks</h3>
        <div className="flex flex-wrap gap-2">
          {basicBlocks.map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className={cn(
                "px-3 py-1.5 rounded-full border-2 border-border bg-background",
                "hover:border-primary hover:bg-primary/5 transition-all cursor-pointer",
                "text-xs font-medium inline-flex items-center gap-1.5"
              )}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Blocks */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Interactive Blocks</h3>
        <div className="flex flex-wrap gap-2">
          {interactiveBlocks.map(({ type, label, icon }) => (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onSelect(type)}
                  className={cn(
                    "px-3 py-1.5 rounded-full border-2 border-border bg-background",
                    "hover:border-primary hover:bg-primary/5 transition-all cursor-pointer",
                    "text-xs font-medium inline-flex items-center gap-1.5"
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
