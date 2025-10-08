"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  Check,
  ChevronDown,
  Loader2,
  Redo,
  Undo,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  InvoiceSettingsComponent,
  OrderSettingsComponent,
  PromotionSettingsComponent,
} from "@/components/editor/commerce-settings";
import {
  BusSettings,
  FlightSettings,
  HotelSettings,
  RentalCarSettings,
  RestaurantSettings,
  TrainSettings,
} from "@/components/editor/reservation-settings";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditor } from "@/contexts/editor-context";
import type {
  BusReservationSettings,
  FlightReservationSettings,
  FoodEstablishmentReservationSettings,
  GmailActionsSettings,
  InvoiceSettings,
  LodgingReservationSettings,
  OrderSettings,
  PromotionSettings,
  RentalCarReservationSettings,
  TrainReservationSettings,
} from "@/types/email";
import { BlockTypeMenu } from "./block-type-menu";
import { GmailActionsSettingsPanel } from "./gmail-actions-settings";

interface SettingsPanelProps {
  isMobileScrollSnap?: boolean;
  saveStatus?: "idle" | "saving" | "saved" | "error";
}

export function SettingsPanel({
  isMobileScrollSnap = false,
  saveStatus = "idle",
}: SettingsPanelProps) {
  const {
    selectedBlockId,
    blocks,
    canUndo,
    canRedo,
    undo,
    redo,
    updateBlockSettings,
    updateBlockType,
    selectBlock,
    gmailActionsEnabled,
  } = useEditor();

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  // Debounced open/close state to prevent flashing
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    // Clear any pending close timeout immediately
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = undefined;
    }

    if (selectedBlockId !== null) {
      setIsOpen(true);
    } else {
      // Immediate close - no delay
      setIsOpen(false);
    }

    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [selectedBlockId]);

  const handleClose = () => {
    selectBlock(null);
  };

  // Shared content component
  const panelContent = (showTitle: boolean = false) => (
    <Tabs defaultValue="block" className="flex-1 flex flex-col">
      {/* Header with Close Button */}
      <div className="flex items-center justify-between px-4 py-3">
        {showTitle ? (
          <Dialog.Title asChild>
            <h2 className="text-sm font-medium">Block Settings</h2>
          </Dialog.Title>
        ) : (
          <h2 className="text-sm font-medium">Block Settings</h2>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-8 w-8"
          aria-label="Close settings panel"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs Navigation */}
      <div>
        <TabsList
          className="
            w-full bg-transparent p-0 h-auto rounded-none
            justify-start gap-4 px-4 pt-4
            overflow-x-auto overflow-y-hidden
            scrollbar-hide
            -webkit-overflow-scrolling-touch
          "
        >
          <TabsTrigger
            value="font"
            className="
              !bg-transparent !shadow-none text-muted-foreground
              data-[state=active]:text-foreground rounded-none
              border-b-2 border-transparent data-[state=active]:border-foreground
              px-0 pb-3 w-auto flex-shrink-0
              data-[state=active]:!bg-transparent data-[state=active]:!shadow-none
              !border-transparent !border-x-0 !border-t-0 cursor-pointer
            "
          >
            Font
          </TabsTrigger>
          <TabsTrigger
            value="block"
            className="
              !bg-transparent !shadow-none text-muted-foreground
              data-[state=active]:text-foreground rounded-none
              border-b-2 border-transparent data-[state=active]:border-foreground
              px-0 pb-3 w-auto flex-shrink-0
              data-[state=active]:!bg-transparent data-[state=active]:!shadow-none
              !border-transparent !border-x-0 !border-t-0 cursor-pointer
            "
          >
            Layout
          </TabsTrigger>
          <TabsTrigger
            value="link"
            className="
              !bg-transparent !shadow-none text-muted-foreground
              data-[state=active]:text-foreground rounded-none
              border-b-2 border-transparent data-[state=active]:border-foreground
              px-0 pb-3 w-auto flex-shrink-0
              data-[state=active]:!bg-transparent data-[state=active]:!shadow-none
              !border-transparent !border-x-0 !border-t-0 cursor-pointer
            "
          >
            Link
          </TabsTrigger>
          <TabsTrigger
            value="blockSettings"
            className="
              !bg-transparent !shadow-none text-muted-foreground
              data-[state=active]:text-foreground rounded-none
              border-b-2 border-transparent data-[state=active]:border-foreground
              px-0 pb-3 w-auto flex-shrink-0
              data-[state=active]:!bg-transparent data-[state=active]:!shadow-none
              !border-transparent !border-x-0 !border-t-0 cursor-pointer
            "
          >
            Block
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <TabsContent value="block">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Block Type</h3>
              <BlockTypeMenu
                onSelect={(type) =>
                  selectedBlockId && updateBlockType(selectedBlockId, type)
                }
                gmailActionsEnabled={gmailActionsEnabled}
              >
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal"
                >
                  <span className="capitalize">{selectedBlock?.type}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </BlockTypeMenu>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Content</h3>
              <p className="text-sm text-muted-foreground">
                {selectedBlock?.content || "No content"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Block settings coming soon...
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="font">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Font settings coming soon...
            </p>
          </div>
        </TabsContent>

        <TabsContent value="link">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Link settings coming soon...
            </p>
          </div>
        </TabsContent>

        <TabsContent value="blockSettings">
          <div className="space-y-4">
            {selectedBlock?.type === "gmailActions" && (
              <GmailActionsSettingsPanel
                settings={
                  (selectedBlock.settings as
                    | GmailActionsSettings
                    | undefined) || {
                    actions: [],
                  }
                }
                onChange={(newSettings) =>
                  selectedBlockId &&
                  updateBlockSettings(
                    selectedBlockId,
                    newSettings as unknown as Record<string, unknown>,
                  )
                }
              />
            )}

            {selectedBlock?.type === "flight" && (
              <FlightSettings
                settings={
                  (selectedBlock.settings as
                    | FlightReservationSettings
                    | undefined) || {
                    reservationNumber: "",
                    reservationStatus: "Confirmed",
                    passengerName: "",
                    flightNumber: "",
                    airline: "",
                    airlineCode: "",
                    departureAirport: "",
                    departureAirportCode: "",
                    departureTime: "",
                    arrivalAirport: "",
                    arrivalAirportCode: "",
                    arrivalTime: "",
                  }
                }
                onChange={(newSettings) =>
                  selectedBlockId &&
                  updateBlockSettings(
                    selectedBlockId,
                    newSettings as unknown as Record<string, unknown>,
                  )
                }
              />
            )}

            {selectedBlock?.type === "hotel" && (
              <HotelSettings
                settings={
                  (selectedBlock.settings as
                    | LodgingReservationSettings
                    | undefined) || {
                    reservationNumber: "",
                    reservationStatus: "Confirmed",
                    guestName: "",
                    hotelName: "",
                    hotelAddress: {
                      streetAddress: "",
                      addressLocality: "",
                      addressRegion: "",
                      postalCode: "",
                      addressCountry: "",
                    },
                    checkinDate: "",
                    checkoutDate: "",
                  }
                }
                onChange={(newSettings) =>
                  selectedBlockId &&
                  updateBlockSettings(
                    selectedBlockId,
                    newSettings as unknown as Record<string, unknown>,
                  )
                }
              />
            )}

            {selectedBlock?.type === "train" && (
              <TrainSettings
                settings={
                  (selectedBlock.settings as
                    | TrainReservationSettings
                    | undefined) || {
                    reservationNumber: "",
                    reservationStatus: "Confirmed",
                    passengerName: "",
                    departureStation: "",
                    departureTime: "",
                    arrivalStation: "",
                    arrivalTime: "",
                  }
                }
                onChange={(newSettings) =>
                  selectedBlockId &&
                  updateBlockSettings(
                    selectedBlockId,
                    newSettings as unknown as Record<string, unknown>,
                  )
                }
              />
            )}

            {selectedBlock?.type === "bus" && (
              <BusSettings
                settings={
                  (selectedBlock.settings as
                    | BusReservationSettings
                    | undefined) || {
                    reservationNumber: "",
                    reservationStatus: "Confirmed",
                    passengerName: "",
                    busCompany: "",
                    departureStop: "",
                    departureTime: "",
                    arrivalStop: "",
                    arrivalTime: "",
                  }
                }
                onChange={(newSettings) =>
                  selectedBlockId &&
                  updateBlockSettings(
                    selectedBlockId,
                    newSettings as unknown as Record<string, unknown>,
                  )
                }
              />
            )}

            {selectedBlock?.type === "rental" && (
              <RentalCarSettings
                settings={
                  (selectedBlock.settings as
                    | RentalCarReservationSettings
                    | undefined) || {
                    reservationNumber: "",
                    reservationStatus: "Confirmed",
                    renterName: "",
                    pickupLocation: {
                      streetAddress: "",
                      addressLocality: "",
                      addressRegion: "",
                      postalCode: "",
                      addressCountry: "",
                    },
                    pickupTime: "",
                    dropoffLocation: {
                      streetAddress: "",
                      addressLocality: "",
                      addressRegion: "",
                      postalCode: "",
                      addressCountry: "",
                    },
                    dropoffTime: "",
                    carModel: "",
                    carBrand: "",
                  }
                }
                onChange={(newSettings) =>
                  selectedBlockId &&
                  updateBlockSettings(
                    selectedBlockId,
                    newSettings as unknown as Record<string, unknown>,
                  )
                }
              />
            )}

            {selectedBlock?.type === "restaurant" && (
              <RestaurantSettings
                settings={
                  (selectedBlock.settings as
                    | FoodEstablishmentReservationSettings
                    | undefined) || {
                    reservationNumber: "",
                    reservationStatus: "Confirmed",
                    guestName: "",
                    restaurantName: "",
                    restaurantAddress: {
                      streetAddress: "",
                      addressLocality: "",
                      addressRegion: "",
                      postalCode: "",
                      addressCountry: "",
                    },
                    reservationTime: "",
                    partySize: 2,
                  }
                }
                onChange={(newSettings) =>
                  selectedBlockId &&
                  updateBlockSettings(
                    selectedBlockId,
                    newSettings as unknown as Record<string, unknown>,
                  )
                }
              />
            )}

            {selectedBlock?.type === "order" && (
              <OrderSettingsComponent
                settings={
                  (selectedBlock.settings as OrderSettings | undefined) || {
                    orderNumber: "",
                    orderDate: "",
                    orderStatus: "OrderProcessing",
                    merchantName: "",
                    customerName: "",
                    items: [],
                    subtotal: 0,
                    total: 0,
                    currency: "USD",
                  }
                }
                onChange={(newSettings) =>
                  selectedBlockId &&
                  updateBlockSettings(
                    selectedBlockId,
                    newSettings as unknown as Record<string, unknown>,
                  )
                }
              />
            )}

            {selectedBlock?.type === "invoice" && (
              <InvoiceSettingsComponent
                settings={
                  (selectedBlock.settings as InvoiceSettings | undefined) || {
                    invoiceNumber: "",
                    invoiceDate: "",
                    dueDate: "",
                    paymentStatus: "Unpaid",
                    providerName: "",
                    customerName: "",
                    accountId: "",
                    items: [],
                    subtotal: 0,
                    total: 0,
                    currency: "USD",
                  }
                }
                onChange={(newSettings) =>
                  selectedBlockId &&
                  updateBlockSettings(
                    selectedBlockId,
                    newSettings as unknown as Record<string, unknown>,
                  )
                }
              />
            )}

            {selectedBlock?.type === "promocode" && (
              <PromotionSettingsComponent
                settings={
                  (selectedBlock.settings as PromotionSettings | undefined) || {
                    description: "",
                  }
                }
                onChange={(newSettings) =>
                  selectedBlockId &&
                  updateBlockSettings(
                    selectedBlockId,
                    newSettings as unknown as Record<string, unknown>,
                  )
                }
              />
            )}

            {!selectedBlock?.type ||
              (![
                "gmailActions",
                "flight",
                "hotel",
                "train",
                "bus",
                "rental",
                "restaurant",
                "order",
                "invoice",
                "promocode",
              ].includes(selectedBlock.type) && (
                <p className="text-sm text-muted-foreground">
                  No settings available for this block type.
                </p>
              ))}
          </div>
        </TabsContent>
      </div>

      {/* Footer - Undo/Redo */}
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={!canUndo}
                onClick={undo}
                aria-label="Undo last action"
              >
                <Undo className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={!canRedo}
                onClick={redo}
                aria-label="Redo last action"
              >
                <Redo className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-1.5">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Saving...</span>
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <Check className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600">Saved</span>
            </>
          )}
          {saveStatus === "error" && (
            <>
              <XCircle className="h-3 w-3 text-red-600" />
              <span className="text-xs text-red-600">Save failed</span>
            </>
          )}
          {saveStatus === "idle" && (
            <span className="text-xs text-muted-foreground">
              Auto-save enabled
            </span>
          )}
        </div>
      </div>
    </Tabs>
  );

  // Mobile scroll-snap variant
  if (isMobileScrollSnap) {
    return (
      <div className="h-full w-full bg-background flex flex-col">
        {panelContent(false)}
      </div>
    );
  }

  // Default Dialog-based implementation
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      modal={false}
    >
      <Dialog.Portal>
        {/* Overlay - hidden for now */}
        {/* <Dialog.Overlay
          className="fixed inset-0 bg-black/50 z-30 animate-in fade-in duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out"
          aria-label="Settings panel overlay"
        /> */}

        {/* Panel Content - Sidebar for all breakpoints */}
        <Dialog.Content
          className={`
            fixed top-0 bottom-0 right-0
            w-[360px] h-screen bg-background
            flex flex-col z-30
            shadow-xl
            transition-transform duration-200
            ${selectedBlockId ? "translate-x-0" : "translate-x-full"}
          `}
          aria-label="Block settings panel"
          aria-describedby="settings-panel-description"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            // Check if the click target is within an email block or block toolbar
            const target = e.target as HTMLElement;
            const isClickOnBlock = target.closest(
              '[role="button"][tabindex="0"]',
            );
            const isClickOnToolbar = target.closest("[data-block-toolbar]");

            // Prevent dialog from closing when clicking on blocks or toolbar
            // The block's click handler will manage selection
            if (isClickOnBlock || isClickOnToolbar) {
              e.preventDefault();
            }
          }}
          forceMount
        >
          <div id="settings-panel-description" className="sr-only">
            Configure settings for the selected block including layout, fonts,
            links, and block-specific options.
          </div>

          {panelContent(true)}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
