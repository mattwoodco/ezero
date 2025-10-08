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
  | "gmailActions"
  // Reservation blocks
  | "flight"
  | "hotel"
  | "train"
  | "bus"
  | "rental"
  | "restaurant"
  // Commerce blocks
  | "invoice"
  // Additional action blocks
  | "update"
  | "cancel"
  | "download";

export type GmailActionType =
  | "ViewAction"
  | "ConfirmAction"
  | "SaveAction"
  | "RsvpAction"
  | "TrackAction"
  // Additional actions
  | "UpdateAction"
  | "CancelAction"
  | "DownloadAction"
  // Reservation types
  | "FlightReservation"
  | "LodgingReservation"
  | "TrainReservation"
  | "BusReservation"
  | "RentalCarReservation"
  | "FoodEstablishmentReservation"
  // Commerce types
  | "OrderAction"
  | "Invoice";

export interface GmailActionConfig {
  type: GmailActionType;
  name: string;
  description?: string;
  // For ViewAction and TrackAction (supports deep linking)
  target?: string | string[];
  // For ConfirmAction, SaveAction, UpdateAction, CancelAction, DownloadAction (one-click actions)
  handler?: {
    url: string;
    method?: "POST" | "GET";
  };
  // For time-limited actions
  validFrom?: string;
  validUntil?: string;
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
  // Reservation settings
  flight?: FlightReservationSettings;
  lodging?: LodgingReservationSettings;
  train?: TrainReservationSettings;
  bus?: BusReservationSettings;
  rentalCar?: RentalCarReservationSettings;
  restaurant?: FoodEstablishmentReservationSettings;
  // Commerce settings
  order?: OrderSettings;
  invoice?: InvoiceSettings;
  promotion?: PromotionSettings;
}

export interface GmailActionsSettings {
  actions: GmailActionConfig[];
}

// Reservation Status Enums
export type ReservationStatus =
  | "Confirmed"
  | "Pending"
  | "Cancelled"
  | "CheckedIn";

export type PaymentStatus = "Paid" | "Unpaid" | "PartiallyPaid" | "Overdue";

export type OrderStatus =
  | "OrderProcessing"
  | "OrderShipped"
  | "OrderDelivered"
  | "OrderCancelled"
  | "OrderReturned";

// Address interface
export interface Address {
  name?: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

// Flight Reservation Settings
export interface FlightReservationSettings {
  reservationNumber: string;
  reservationStatus: ReservationStatus;
  passengerName: string;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  departureAirport: string;
  departureAirportCode: string;
  departureTime: string; // ISO 8601 format
  arrivalAirport: string;
  arrivalAirportCode: string;
  arrivalTime: string; // ISO 8601 format
  departureGate?: string;
  boardingTime?: string; // ISO 8601 format
  seatNumber?: string;
  ticketToken?: string;
  frequentFlyerNumber?: string;
  frequentFlyerProgram?: string;
}

// Lodging Reservation Settings
export interface LodgingReservationSettings {
  reservationNumber: string;
  reservationStatus: ReservationStatus;
  guestName: string;
  hotelName: string;
  hotelAddress: Address;
  hotelPhone?: string;
  checkinDate: string; // ISO 8601 format
  checkoutDate: string; // ISO 8601 format
  numGuests?: number;
  roomType?: string;
}

// Train Reservation Settings
export interface TrainReservationSettings {
  reservationNumber: string;
  reservationStatus: ReservationStatus;
  passengerName: string;
  trainNumber?: string;
  departureStation: string;
  departureTime: string; // ISO 8601 format
  arrivalStation: string;
  arrivalTime: string; // ISO 8601 format
  seatNumber?: string;
  coach?: string;
}

// Bus Reservation Settings
export interface BusReservationSettings {
  reservationNumber: string;
  reservationStatus: ReservationStatus;
  passengerName: string;
  busCompany: string;
  departureStop: string;
  departureTime: string; // ISO 8601 format
  arrivalStop: string;
  arrivalTime: string; // ISO 8601 format
  seatNumber?: string;
}

// Rental Car Reservation Settings
export interface RentalCarReservationSettings {
  reservationNumber: string;
  reservationStatus: ReservationStatus;
  renterName: string;
  pickupLocation: Address;
  pickupTime: string; // ISO 8601 format
  dropoffLocation: Address;
  dropoffTime: string; // ISO 8601 format
  carModel: string;
  carBrand: string;
}

// Food Establishment Reservation Settings
export interface FoodEstablishmentReservationSettings {
  reservationNumber: string;
  reservationStatus: ReservationStatus;
  guestName: string;
  restaurantName: string;
  restaurantAddress: Address;
  reservationTime: string; // ISO 8601 format
  partySize: number;
}

// Order Item interface
export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  sku?: string;
  image?: string;
  description?: string;
}

// Order Settings
export interface OrderSettings {
  orderNumber: string;
  orderDate: string; // ISO 8601 format
  orderStatus: OrderStatus;
  merchantName: string;
  merchantLogo?: string;
  customerName: string;
  customerEmail?: string;
  items: OrderItem[];
  subtotal: number;
  tax?: number;
  shipping?: number;
  total: number;
  currency: string;
  shippingAddress?: Address;
  viewOrderUrl?: string;
}

// Invoice Item interface
export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Invoice Settings
export interface InvoiceSettings {
  invoiceNumber: string;
  invoiceDate: string; // ISO 8601 format
  dueDate: string; // ISO 8601 format
  paymentStatus: PaymentStatus;
  providerName: string;
  providerLogo?: string;
  customerName: string;
  accountId: string;
  items: InvoiceItem[];
  subtotal: number;
  tax?: number;
  total: number;
  minimumPaymentDue?: number;
  currency: string;
  paymentUrl?: string;
}

// Promotion Settings
export interface PromotionSettings {
  description: string;
  discountCode?: string;
  availabilityStarts?: string; // ISO 8601 format
  availabilityEnds?: string; // ISO 8601 format
  discountPercent?: number;
  promotionImage?: string;
  promotionUrl?: string;
  headline?: string;
  price?: number;
  currency?: string;
}

export interface EmailBlock {
  id: string;
  type: EmailBlockType;
  content?: string;
  settings?: Record<string, unknown>;
}

export interface TemplateMetadata {
  id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  metadata: TemplateMetadata;
  blocks: EmailBlock[];
}
