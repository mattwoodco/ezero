export type EmailBlockType =
  | "text"
  | "heading"
  | "button"
  | "image"
  | "divider"
  | "spacer"
  | "footer"
  | "address"
  | "social"
  | "rating"
  | "feedback"
  | "subscribe"
  | "track"
  | "order"
  | "viewDetails"
  | "favorite"
  | "pay"
  | "rsvp"
  | "confirm"
  | "goto"
  | "promocode"
  | "qr"
  | "gmailActions";

export type GmailActionType =
  | "ViewAction"
  | "ConfirmAction"
  | "SaveAction"
  | "RsvpAction"
  | "TrackAction";

export interface GmailActionConfig {
  type: GmailActionType;
  name: string;
  description?: string;
  // For ViewAction and TrackAction
  target?: string;
  // For ConfirmAction and SaveAction
  handler?: {
    url: string;
    method?: "POST" | "GET";
  };
  // For RsvpAction
  event?: {
    name: string;
    startDate: string;
    endDate?: string;
    location: {
      name: string;
      streetAddress?: string;
      addressLocality?: string;
      addressRegion?: string;
      postalCode?: string;
      addressCountry?: string;
    };
    organizer?: {
      name: string;
      url?: string;
    };
  };
  // For TrackAction (ParcelDelivery)
  parcel?: {
    trackingNumber?: string;
    trackingUrl?: string;
    carrier?: string;
    itemShipped?: string;
    deliveryAddress?: {
      name: string;
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
    expectedArrivalUntil?: string;
    orderNumber?: string;
    merchant?: string;
  };
}

export interface GmailActionsSettings {
  actions: GmailActionConfig[];
}

export interface EmailBlock {
  id: string;
  type: EmailBlockType;
  content?: string;
  settings?: Record<string, unknown>;
}
