import type { GmailActionConfig } from "@/types/email";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a Gmail Action configuration
 */
export function validateGmailAction(
  action: GmailActionConfig,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic validation
  if (!action.type) {
    errors.push("Action type is required");
  }

  if (!action.name || action.name.trim() === "") {
    errors.push("Action name is required");
  } else {
    // Name validation
    if (action.name.includes("!") || action.name.includes(".")) {
      warnings.push("Action name should not include punctuation");
    }
    if (action.name === action.name.toUpperCase()) {
      warnings.push("Action name should not be all caps");
    }
    if (action.name.length > 20) {
      warnings.push(
        "Action name should be under 20 characters for best display",
      );
    }
  }

  // Type-specific validation
  switch (action.type) {
    case "ViewAction":
      if (!action.target) {
        errors.push("ViewAction requires a target URL");
      } else if (!isValidUrl(action.target)) {
        errors.push("ViewAction target must be a valid URL");
      }
      break;

    case "ConfirmAction":
    case "SaveAction":
      if (!action.handler?.url) {
        errors.push(`${action.type} requires a handler URL`);
      } else {
        if (!action.handler.url.startsWith("https://")) {
          errors.push(`${action.type} handler URL must use HTTPS`);
        }
        if (!isValidUrl(action.handler.url)) {
          errors.push(`${action.type} handler URL must be valid`);
        }
      }
      break;

    case "RsvpAction":
      if (!action.event) {
        errors.push("RsvpAction requires event details");
      } else {
        if (!action.event.name) {
          errors.push("Event name is required");
        }
        if (!action.event.startDate) {
          errors.push("Event start date is required");
        } else if (!isValidISODate(action.event.startDate)) {
          errors.push("Event start date must be in ISO 8601 format");
        }
        if (!action.event.location?.name) {
          errors.push("Event location name is required");
        }
      }
      break;

    case "TrackAction":
      if (!action.target && !action.parcel?.trackingUrl) {
        errors.push(
          "TrackAction requires either a target URL or parcel trackingUrl",
        );
      }
      if (action.parcel) {
        if (
          action.parcel.trackingUrl &&
          !isValidUrl(action.parcel.trackingUrl)
        ) {
          errors.push("Parcel tracking URL must be valid");
        }
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Generates JSON-LD markup for a Gmail Action
 */
export function generateJsonLd(action: GmailActionConfig): string {
  switch (action.type) {
    case "ViewAction":
      return JSON.stringify({
        "@context": "http://schema.org",
        "@type": "EmailMessage",
        potentialAction: {
          "@type": "ViewAction",
          target: action.target,
          name: action.name,
        },
        description: action.description || "",
      });

    case "ConfirmAction":
    case "SaveAction":
      return JSON.stringify({
        "@context": "http://schema.org",
        "@type": "EmailMessage",
        potentialAction: {
          "@type": action.type,
          name: action.name,
          handler: {
            "@type": "HttpActionHandler",
            url: action.handler?.url,
            method:
              action.handler?.method === "GET"
                ? "http://schema.org/HttpRequestMethod/GET"
                : "http://schema.org/HttpRequestMethod/POST",
          },
        },
        description: action.description || "",
      });

    case "RsvpAction":
      return JSON.stringify({
        "@context": "http://schema.org",
        "@type": "EventReservation",
        reservationNumber: `EVT-${Date.now()}`,
        reservationStatus: "http://schema.org/ReservationConfirmed",
        underName: {
          "@type": "Person",
          name: "Recipient",
        },
        reservationFor: {
          "@type": "Event",
          name: action.event?.name,
          startDate: action.event?.startDate,
          endDate: action.event?.endDate,
          location: {
            "@type": "Place",
            name: action.event?.location?.name,
            address: {
              "@type": "PostalAddress",
              streetAddress: action.event?.location?.streetAddress,
              addressLocality: action.event?.location?.addressLocality,
              addressRegion: action.event?.location?.addressRegion,
              postalCode: action.event?.location?.postalCode,
              addressCountry: action.event?.location?.addressCountry,
            },
          },
          ...(action.event?.organizer
            ? {
                organizer: {
                  "@type": "Organization",
                  name: action.event.organizer.name,
                  url: action.event.organizer.url,
                },
              }
            : {}),
        },
      });

    case "TrackAction":
      if (action.parcel) {
        return JSON.stringify({
          "@context": "http://schema.org",
          "@type": "ParcelDelivery",
          deliveryAddress: action.parcel.deliveryAddress
            ? {
                "@type": "PostalAddress",
                name: action.parcel.deliveryAddress.name,
                streetAddress: action.parcel.deliveryAddress.streetAddress,
                addressLocality: action.parcel.deliveryAddress.addressLocality,
                addressRegion: action.parcel.deliveryAddress.addressRegion,
                postalCode: action.parcel.deliveryAddress.postalCode,
                addressCountry: action.parcel.deliveryAddress.addressCountry,
              }
            : undefined,
          expectedArrivalUntil: action.parcel.expectedArrivalUntil,
          carrier: action.parcel.carrier
            ? {
                "@type": "Organization",
                name: action.parcel.carrier,
              }
            : undefined,
          itemShipped: action.parcel.itemShipped
            ? {
                "@type": "Product",
                name: action.parcel.itemShipped,
              }
            : undefined,
          partOfOrder: action.parcel.orderNumber
            ? {
                "@type": "Order",
                orderNumber: action.parcel.orderNumber,
                merchant: action.parcel.merchant
                  ? {
                      "@type": "Organization",
                      name: action.parcel.merchant,
                    }
                  : undefined,
              }
            : undefined,
          trackingUrl: action.parcel.trackingUrl,
          trackingNumber: action.parcel.trackingNumber,
        });
      } else {
        return JSON.stringify({
          "@context": "http://schema.org",
          "@type": "EmailMessage",
          potentialAction: {
            "@type": "TrackAction",
            target: action.target,
            name: action.name,
          },
          description: action.description || "",
        });
      }

    default:
      return "";
  }
}

/**
 * Generates multiple JSON-LD scripts for an array of actions
 */
export function generateMultipleJsonLd(actions: GmailActionConfig[]): string[] {
  return actions.map((action) => generateJsonLd(action));
}

/**
 * Validates a URL
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates ISO 8601 date format
 */
function isValidISODate(dateString: string): boolean {
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)$/;
  return isoRegex.test(dateString);
}

/**
 * Helper to get action type display name
 */
export function getActionTypeLabel(type: GmailActionConfig["type"]): string {
  const labels: Record<GmailActionConfig["type"], string> = {
    ViewAction: "Go To Action",
    ConfirmAction: "Confirm Action",
    SaveAction: "Save Action",
    RsvpAction: "RSVP Action",
    TrackAction: "Track Action",
  };
  return labels[type] || type;
}

/**
 * Helper to get action type description
 */
export function getActionTypeDescription(
  type: GmailActionConfig["type"],
): string {
  const descriptions: Record<GmailActionConfig["type"], string> = {
    ViewAction:
      "Opens a web page or deep links to an app. Can be clicked multiple times.",
    ConfirmAction:
      "One-click button for approvals or confirmations. Can only be clicked once.",
    SaveAction:
      "Save items like coupons or offers to user's account. Can only be clicked once.",
    RsvpAction: "Allow users to RSVP to events with Yes/No/Maybe responses.",
    TrackAction:
      "Provide package tracking functionality with delivery information.",
  };
  return descriptions[type] || "";
}

/**
 * Helper to get required fields for an action type
 */
export function getRequiredFields(type: GmailActionConfig["type"]): string[] {
  const requirements: Record<GmailActionConfig["type"], string[]> = {
    ViewAction: ["name", "target"],
    ConfirmAction: ["name", "handler.url"],
    SaveAction: ["name", "handler.url"],
    RsvpAction: ["name", "event.name", "event.startDate", "event.location"],
    TrackAction: ["name", "target or parcel"],
  };
  return requirements[type] || [];
}
