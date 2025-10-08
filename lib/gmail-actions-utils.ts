import type { GmailActionConfig } from "@/types/email";

interface ValidationResult {
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
      } else {
        // Handle both string and string[] for target
        const targetToValidate = Array.isArray(action.target)
          ? action.target[0]
          : action.target;
        if (targetToValidate && !isValidUrl(targetToValidate)) {
          errors.push("ViewAction target must be a valid URL");
        } else if (!targetToValidate) {
          errors.push("ViewAction target array must contain at least one URL");
        }
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
 * Validates a Flight Reservation configuration
 */
function _validateFlightReservation(flight: any): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!flight.reservationNumber) {
    errors.push("Reservation number is required");
  }
  if (!flight.passengerName) {
    errors.push("Passenger name is required");
  }
  if (!flight.flightNumber) {
    errors.push("Flight number is required");
  }
  if (!flight.departureTime) {
    errors.push("Departure time is required");
  } else if (!isValidISODate(flight.departureTime)) {
    errors.push("Departure time must be in ISO 8601 format");
  }
  if (!flight.arrivalTime) {
    errors.push("Arrival time is required");
  } else if (!isValidISODate(flight.arrivalTime)) {
    errors.push("Arrival time must be in ISO 8601 format");
  }
  if (!flight.departureAirport || !flight.departureAirportCode) {
    errors.push("Departure airport and code are required");
  }
  if (!flight.arrivalAirport || !flight.arrivalAirportCode) {
    errors.push("Arrival airport and code are required");
  }
  if (!flight.airline || !flight.airlineCode) {
    errors.push("Airline name and code are required");
  }

  return { errors, warnings };
}

/**
 * Validates a Lodging Reservation configuration
 */
function _validateLodgingReservation(lodging: any): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!lodging.reservationNumber) {
    errors.push("Reservation number is required");
  }
  if (!lodging.guestName) {
    errors.push("Guest name is required");
  }
  if (!lodging.hotelName) {
    errors.push("Hotel name is required");
  }
  if (!lodging.checkinDate) {
    errors.push("Check-in date is required");
  } else if (!isValidISODate(lodging.checkinDate)) {
    errors.push("Check-in date must be in ISO 8601 format");
  }
  if (!lodging.checkoutDate) {
    errors.push("Check-out date is required");
  } else if (!isValidISODate(lodging.checkoutDate)) {
    errors.push("Check-out date must be in ISO 8601 format");
  }
  if (!lodging.hotelAddress) {
    errors.push("Hotel address is required");
  }

  return { errors, warnings };
}

/**
 * Validates a Train Reservation configuration
 */
function _validateTrainReservation(train: any): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!train.reservationNumber) {
    errors.push("Reservation number is required");
  }
  if (!train.passengerName) {
    errors.push("Passenger name is required");
  }
  if (!train.departureStation) {
    errors.push("Departure station is required");
  }
  if (!train.departureTime) {
    errors.push("Departure time is required");
  } else if (!isValidISODate(train.departureTime)) {
    errors.push("Departure time must be in ISO 8601 format");
  }
  if (!train.arrivalStation) {
    errors.push("Arrival station is required");
  }
  if (!train.arrivalTime) {
    errors.push("Arrival time is required");
  } else if (!isValidISODate(train.arrivalTime)) {
    errors.push("Arrival time must be in ISO 8601 format");
  }

  return { errors, warnings };
}

/**
 * Validates a Bus Reservation configuration
 */
function _validateBusReservation(bus: any): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!bus.reservationNumber) {
    errors.push("Reservation number is required");
  }
  if (!bus.passengerName) {
    errors.push("Passenger name is required");
  }
  if (!bus.busCompany) {
    errors.push("Bus company is required");
  }
  if (!bus.departureStop) {
    errors.push("Departure stop is required");
  }
  if (!bus.departureTime) {
    errors.push("Departure time is required");
  } else if (!isValidISODate(bus.departureTime)) {
    errors.push("Departure time must be in ISO 8601 format");
  }
  if (!bus.arrivalStop) {
    errors.push("Arrival stop is required");
  }
  if (!bus.arrivalTime) {
    errors.push("Arrival time is required");
  } else if (!isValidISODate(bus.arrivalTime)) {
    errors.push("Arrival time must be in ISO 8601 format");
  }

  return { errors, warnings };
}

/**
 * Validates a Rental Car Reservation configuration
 */
function _validateRentalCarReservation(rentalCar: any): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!rentalCar.reservationNumber) {
    errors.push("Reservation number is required");
  }
  if (!rentalCar.renterName) {
    errors.push("Renter name is required");
  }
  if (!rentalCar.pickupLocation) {
    errors.push("Pickup location is required");
  }
  if (!rentalCar.pickupTime) {
    errors.push("Pickup time is required");
  } else if (!isValidISODate(rentalCar.pickupTime)) {
    errors.push("Pickup time must be in ISO 8601 format");
  }
  if (!rentalCar.dropoffLocation) {
    errors.push("Dropoff location is required");
  }
  if (!rentalCar.dropoffTime) {
    errors.push("Dropoff time is required");
  } else if (!isValidISODate(rentalCar.dropoffTime)) {
    errors.push("Dropoff time must be in ISO 8601 format");
  }
  if (!rentalCar.carModel || !rentalCar.carBrand) {
    errors.push("Car model and brand are required");
  }

  return { errors, warnings };
}

/**
 * Validates a Food Establishment Reservation configuration
 */
function _validateFoodEstablishmentReservation(restaurant: any): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!restaurant.reservationNumber) {
    errors.push("Reservation number is required");
  }
  if (!restaurant.guestName) {
    errors.push("Guest name is required");
  }
  if (!restaurant.restaurantName) {
    errors.push("Restaurant name is required");
  }
  if (!restaurant.reservationTime) {
    errors.push("Reservation time is required");
  } else if (!isValidISODate(restaurant.reservationTime)) {
    errors.push("Reservation time must be in ISO 8601 format");
  }
  if (!restaurant.partySize || restaurant.partySize < 1) {
    errors.push("Party size must be at least 1");
  }
  if (!restaurant.restaurantAddress) {
    errors.push("Restaurant address is required");
  }

  return { errors, warnings };
}

/**
 * Validates an Order configuration
 */
function _validateOrder(order: any): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!order.orderNumber) {
    errors.push("Order number is required");
  }
  if (!order.orderDate) {
    errors.push("Order date is required");
  } else if (!isValidISODate(order.orderDate)) {
    errors.push("Order date must be in ISO 8601 format");
  }
  if (!order.merchantName) {
    errors.push("Merchant name is required");
  }
  if (!order.customerName) {
    errors.push("Customer name is required");
  }
  if (!order.items || order.items.length === 0) {
    errors.push("At least one order item is required");
  }
  if (order.total === undefined || order.total < 0) {
    errors.push("Total amount is required and must be non-negative");
  }
  if (!order.currency) {
    errors.push("Currency is required");
  }

  return { errors, warnings };
}

/**
 * Validates an Invoice configuration
 */
function _validateInvoice(invoice: any): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!invoice.invoiceNumber) {
    errors.push("Invoice number is required");
  }
  if (!invoice.invoiceDate) {
    errors.push("Invoice date is required");
  } else if (!isValidISODate(invoice.invoiceDate)) {
    errors.push("Invoice date must be in ISO 8601 format");
  }
  if (!invoice.dueDate) {
    errors.push("Due date is required");
  } else if (!isValidISODate(invoice.dueDate)) {
    errors.push("Due date must be in ISO 8601 format");
  }
  if (!invoice.providerName) {
    errors.push("Provider name is required");
  }
  if (!invoice.customerName) {
    errors.push("Customer name is required");
  }
  if (!invoice.accountId) {
    errors.push("Account ID is required");
  }
  if (invoice.total === undefined || invoice.total < 0) {
    errors.push("Total amount is required and must be non-negative");
  }
  if (!invoice.currency) {
    errors.push("Currency is required");
  }

  return { errors, warnings };
}

/**
 * Validates a Promotion configuration
 */
function _validatePromotion(promotion: any): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!promotion.description) {
    errors.push("Promotion description is required");
  }
  if (
    promotion.availabilityStarts &&
    !isValidISODate(promotion.availabilityStarts)
  ) {
    errors.push("Availability start date must be in ISO 8601 format");
  }
  if (
    promotion.availabilityEnds &&
    !isValidISODate(promotion.availabilityEnds)
  ) {
    errors.push("Availability end date must be in ISO 8601 format");
  }
  if (!promotion.discountCode && !promotion.promotionUrl) {
    warnings.push(
      "Either discount code or promotion URL should be provided for best results",
    );
  }

  return { errors, warnings };
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

    case "FlightReservation":
      return generateFlightReservationJsonLd(action);

    case "LodgingReservation":
      return generateLodgingReservationJsonLd(action);

    case "TrainReservation":
      return generateTrainReservationJsonLd(action);

    case "BusReservation":
      return generateBusReservationJsonLd(action);

    case "RentalCarReservation":
      return generateRentalCarReservationJsonLd(action);

    case "FoodEstablishmentReservation":
      return generateFoodEstablishmentReservationJsonLd(action);

    case "OrderAction":
      return generateOrderJsonLd(action);

    case "Invoice":
      return generateInvoiceJsonLd(action);

    case "UpdateAction":
      return generateUpdateActionJsonLd(action);

    case "CancelAction":
      return generateCancelActionJsonLd(action);

    case "DownloadAction":
      return generateDownloadActionJsonLd(action);

    default:
      return "";
  }
}

/**
 * Generates JSON-LD for Flight Reservation
 */
function generateFlightReservationJsonLd(action: GmailActionConfig): string {
  if (!action.flight) throw new Error("Flight data is required");
  const flight = action.flight;

  return JSON.stringify({
    "@context": "http://schema.org",
    "@type": "FlightReservation",
    reservationNumber: flight.reservationNumber,
    reservationStatus: `http://schema.org/Reservation${flight.reservationStatus}`,
    bookingTime: new Date().toISOString(),
    underName: {
      "@type": "Person",
      name: flight.passengerName,
    },
    ...(flight.frequentFlyerNumber && {
      programMembershipUsed: {
        "@type": "ProgramMembership",
        memberNumber: flight.frequentFlyerNumber,
        ...(flight.frequentFlyerProgram && {
          program: {
            "@type": "Organization",
            name: flight.frequentFlyerProgram,
          },
        }),
      },
    }),
    reservationFor: {
      "@type": "Flight",
      flightNumber: flight.flightNumber,
      airline: {
        "@type": "Airline",
        name: flight.airline,
        iataCode: flight.airlineCode,
      },
      departureAirport: {
        "@type": "Airport",
        name: flight.departureAirport,
        iataCode: flight.departureAirportCode,
      },
      departureTime: flight.departureTime,
      ...(flight.departureGate && { departureGate: flight.departureGate }),
      ...(flight.boardingTime && { boardingTime: flight.boardingTime }),
      arrivalAirport: {
        "@type": "Airport",
        name: flight.arrivalAirport,
        iataCode: flight.arrivalAirportCode,
      },
      arrivalTime: flight.arrivalTime,
    },
    ...(flight.seatNumber && {
      reservedTicket: {
        "@type": "Ticket",
        ...(flight.ticketToken && { ticketToken: flight.ticketToken }),
        ticketedSeat: {
          "@type": "Seat",
          seatNumber: flight.seatNumber,
        },
      },
    }),
  });
}

/**
 * Generates JSON-LD for Lodging Reservation
 */
function generateLodgingReservationJsonLd(action: GmailActionConfig): string {
  if (!action.lodging) throw new Error("Lodging data is required");
  const lodging = action.lodging;

  return JSON.stringify({
    "@context": "http://schema.org",
    "@type": "LodgingReservation",
    reservationNumber: lodging.reservationNumber,
    reservationStatus: `http://schema.org/Reservation${lodging.reservationStatus}`,
    bookingTime: new Date().toISOString(),
    underName: {
      "@type": "Person",
      name: lodging.guestName,
    },
    reservationFor: {
      "@type": "LodgingBusiness",
      name: lodging.hotelName,
      address: {
        "@type": "PostalAddress",
        streetAddress: lodging.hotelAddress.streetAddress,
        addressLocality: lodging.hotelAddress.addressLocality,
        addressRegion: lodging.hotelAddress.addressRegion,
        postalCode: lodging.hotelAddress.postalCode,
        addressCountry: lodging.hotelAddress.addressCountry,
      },
      ...(lodging.hotelPhone && { telephone: lodging.hotelPhone }),
    },
    checkinTime: lodging.checkinDate,
    checkoutTime: lodging.checkoutDate,
    ...(lodging.numGuests && {
      partySize: lodging.numGuests.toString(),
    }),
    ...(lodging.roomType && {
      reservedTicket: {
        "@type": "Ticket",
        ticketedSeat: {
          "@type": "Seat",
          seatingType: lodging.roomType,
        },
      },
    }),
  });
}

/**
 * Generates JSON-LD for Train Reservation
 */
function generateTrainReservationJsonLd(action: GmailActionConfig): string {
  if (!action.train) throw new Error("Train data is required");
  const train = action.train;

  return JSON.stringify({
    "@context": "http://schema.org",
    "@type": "TrainReservation",
    reservationNumber: train.reservationNumber,
    reservationStatus: `http://schema.org/Reservation${train.reservationStatus}`,
    bookingTime: new Date().toISOString(),
    underName: {
      "@type": "Person",
      name: train.passengerName,
    },
    reservationFor: {
      "@type": "TrainTrip",
      ...(train.trainNumber && { trainNumber: train.trainNumber }),
      departureStation: {
        "@type": "TrainStation",
        name: train.departureStation,
      },
      departureTime: train.departureTime,
      arrivalStation: {
        "@type": "TrainStation",
        name: train.arrivalStation,
      },
      arrivalTime: train.arrivalTime,
    },
    ...((train.seatNumber || train.coach) && {
      reservedTicket: {
        "@type": "Ticket",
        ...(train.seatNumber && {
          ticketedSeat: {
            "@type": "Seat",
            seatNumber: train.seatNumber,
            ...(train.coach && { seatSection: train.coach }),
          },
        }),
      },
    }),
  });
}

/**
 * Generates JSON-LD for Bus Reservation
 */
function generateBusReservationJsonLd(action: GmailActionConfig): string {
  if (!action.bus) throw new Error("Bus data is required");
  const bus = action.bus;

  return JSON.stringify({
    "@context": "http://schema.org",
    "@type": "BusReservation",
    reservationNumber: bus.reservationNumber,
    reservationStatus: `http://schema.org/Reservation${bus.reservationStatus}`,
    bookingTime: new Date().toISOString(),
    underName: {
      "@type": "Person",
      name: bus.passengerName,
    },
    reservationFor: {
      "@type": "BusTrip",
      provider: {
        "@type": "Organization",
        name: bus.busCompany,
      },
      departureBusStop: {
        "@type": "BusStop",
        name: bus.departureStop,
      },
      departureTime: bus.departureTime,
      arrivalBusStop: {
        "@type": "BusStop",
        name: bus.arrivalStop,
      },
      arrivalTime: bus.arrivalTime,
    },
    ...(bus.seatNumber && {
      reservedTicket: {
        "@type": "Ticket",
        ticketedSeat: {
          "@type": "Seat",
          seatNumber: bus.seatNumber,
        },
      },
    }),
  });
}

/**
 * Generates JSON-LD for Rental Car Reservation
 */
function generateRentalCarReservationJsonLd(action: GmailActionConfig): string {
  if (!action.rentalCar) throw new Error("Rental car data is required");
  const rentalCar = action.rentalCar;

  return JSON.stringify({
    "@context": "http://schema.org",
    "@type": "RentalCarReservation",
    reservationNumber: rentalCar.reservationNumber,
    reservationStatus: `http://schema.org/Reservation${rentalCar.reservationStatus}`,
    bookingTime: new Date().toISOString(),
    underName: {
      "@type": "Person",
      name: rentalCar.renterName,
    },
    reservationFor: {
      "@type": "Vehicle",
      name: `${rentalCar.carBrand} ${rentalCar.carModel}`,
      brand: {
        "@type": "Brand",
        name: rentalCar.carBrand,
      },
      model: rentalCar.carModel,
    },
    pickupLocation: {
      "@type": "Place",
      name: rentalCar.pickupLocation.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: rentalCar.pickupLocation.streetAddress,
        addressLocality: rentalCar.pickupLocation.addressLocality,
        addressRegion: rentalCar.pickupLocation.addressRegion,
        postalCode: rentalCar.pickupLocation.postalCode,
        addressCountry: rentalCar.pickupLocation.addressCountry,
      },
    },
    pickupTime: rentalCar.pickupTime,
    dropoffLocation: {
      "@type": "Place",
      name: rentalCar.dropoffLocation.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: rentalCar.dropoffLocation.streetAddress,
        addressLocality: rentalCar.dropoffLocation.addressLocality,
        addressRegion: rentalCar.dropoffLocation.addressRegion,
        postalCode: rentalCar.dropoffLocation.postalCode,
        addressCountry: rentalCar.dropoffLocation.addressCountry,
      },
    },
    dropoffTime: rentalCar.dropoffTime,
  });
}

/**
 * Generates JSON-LD for Food Establishment Reservation
 */
function generateFoodEstablishmentReservationJsonLd(
  action: GmailActionConfig,
): string {
  if (!action.restaurant) throw new Error("Restaurant data is required");
  const restaurant = action.restaurant;

  return JSON.stringify({
    "@context": "http://schema.org",
    "@type": "FoodEstablishmentReservation",
    reservationNumber: restaurant.reservationNumber,
    reservationStatus: `http://schema.org/Reservation${restaurant.reservationStatus}`,
    bookingTime: new Date().toISOString(),
    underName: {
      "@type": "Person",
      name: restaurant.guestName,
    },
    reservationFor: {
      "@type": "FoodEstablishment",
      name: restaurant.restaurantName,
      address: {
        "@type": "PostalAddress",
        streetAddress: restaurant.restaurantAddress.streetAddress,
        addressLocality: restaurant.restaurantAddress.addressLocality,
        addressRegion: restaurant.restaurantAddress.addressRegion,
        postalCode: restaurant.restaurantAddress.postalCode,
        addressCountry: restaurant.restaurantAddress.addressCountry,
      },
    },
    startTime: restaurant.reservationTime,
    partySize: restaurant.partySize.toString(),
  });
}

/**
 * Generates JSON-LD for Order
 */
function generateOrderJsonLd(action: GmailActionConfig): string {
  if (!action.order) throw new Error("Order data is required");
  const order = action.order;

  return JSON.stringify({
    "@context": "http://schema.org",
    "@type": "Order",
    merchant: {
      "@type": "Organization",
      name: order.merchantName,
      ...(order.merchantLogo && { logo: order.merchantLogo }),
    },
    orderNumber: order.orderNumber,
    orderDate: order.orderDate,
    orderStatus: `http://schema.org/${order.orderStatus}`,
    priceCurrency: order.currency,
    price: order.total.toString(),
    customer: {
      "@type": "Person",
      name: order.customerName,
      ...(order.customerEmail && { email: order.customerEmail }),
    },
    acceptedOffer: order.items.map((item) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: item.name,
        ...(item.sku && { sku: item.sku }),
        ...(item.image && { image: item.image }),
        ...(item.description && { description: item.description }),
      },
      price: item.price.toString(),
      priceCurrency: order.currency,
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        value: item.quantity.toString(),
      },
    })),
    ...(order.shippingAddress && {
      orderDelivery: {
        "@type": "ParcelDelivery",
        deliveryAddress: {
          "@type": "PostalAddress",
          ...(order.shippingAddress.name && {
            name: order.shippingAddress.name,
          }),
          streetAddress: order.shippingAddress.streetAddress,
          addressLocality: order.shippingAddress.addressLocality,
          addressRegion: order.shippingAddress.addressRegion,
          postalCode: order.shippingAddress.postalCode,
          addressCountry: order.shippingAddress.addressCountry,
        },
      },
    }),
    ...(order.viewOrderUrl && {
      potentialAction: {
        "@type": "ViewAction",
        target: order.viewOrderUrl,
        name: "View Order",
      },
    }),
  });
}

/**
 * Generates JSON-LD for Invoice
 */
function generateInvoiceJsonLd(action: GmailActionConfig): string {
  if (!action.invoice) throw new Error("Invoice data is required");
  const invoice = action.invoice;

  return JSON.stringify({
    "@context": "http://schema.org",
    "@type": "Invoice",
    accountId: invoice.accountId,
    paymentDue: invoice.dueDate,
    paymentStatus: `http://schema.org/Payment${invoice.paymentStatus}`,
    provider: {
      "@type": "Organization",
      name: invoice.providerName,
      ...(invoice.providerLogo && { logo: invoice.providerLogo }),
    },
    customer: {
      "@type": "Person",
      name: invoice.customerName,
    },
    referencesOrder: {
      "@type": "Order",
      orderNumber: invoice.invoiceNumber,
      orderDate: invoice.invoiceDate,
    },
    totalPaymentDue: {
      "@type": "PriceSpecification",
      price: invoice.total.toString(),
      priceCurrency: invoice.currency,
    },
    ...(invoice.minimumPaymentDue && {
      minimumPaymentDue: {
        "@type": "PriceSpecification",
        price: invoice.minimumPaymentDue.toString(),
        priceCurrency: invoice.currency,
      },
    }),
    ...(invoice.paymentUrl && {
      potentialAction: {
        "@type": "ViewAction",
        target: invoice.paymentUrl,
        name: "Pay Invoice",
      },
    }),
  });
}

/**
 * Generates JSON-LD for Promotion
 */
export function generatePromotionJsonLd(action: GmailActionConfig): string {
  if (!action.promotion) throw new Error("Promotion data is required");
  const promo = action.promotion;

  const emailMessage: Record<string, unknown> = {
    "@context": "http://schema.org",
    "@type": "EmailMessage",
  };

  // Add DiscountOffer if discount code exists
  if (promo.discountCode) {
    emailMessage.discount = {
      "@type": "DiscountOffer",
      description: promo.description,
      discountCode: promo.discountCode,
      ...(promo.availabilityStarts && {
        availabilityStarts: promo.availabilityStarts,
      }),
      ...(promo.availabilityEnds && {
        availabilityEnds: promo.availabilityEnds,
      }),
      ...(promo.discountPercent && {
        discount: promo.discountPercent.toString(),
      }),
    };
  }

  // Add PromotionCard if image exists
  if (promo.promotionImage && promo.promotionUrl) {
    emailMessage.promotionCard = {
      "@type": "PromotionCard",
      image: promo.promotionImage,
      url: promo.promotionUrl,
      ...(promo.headline && { headline: promo.headline }),
      ...(promo.price && {
        price: promo.price.toString(),
        priceCurrency: promo.currency || "USD",
      }),
      ...(promo.discountPercent && {
        discountValue: promo.discountPercent.toString(),
      }),
    };
  }

  return JSON.stringify(emailMessage);
}

/**
 * Generates JSON-LD for UpdateAction
 */
function generateUpdateActionJsonLd(action: GmailActionConfig): string {
  return JSON.stringify({
    "@context": "http://schema.org",
    "@type": "EmailMessage",
    potentialAction: {
      "@type": "UpdateAction",
      name: action.name,
      ...(action.description && { description: action.description }),
      target: Array.isArray(action.target) ? action.target : [action.target],
      ...(action.validFrom && { validFrom: action.validFrom }),
      ...(action.validUntil && { validUntil: action.validUntil }),
    },
    description: action.description || "Update your reservation or settings",
  });
}

/**
 * Generates JSON-LD for CancelAction
 */
function generateCancelActionJsonLd(action: GmailActionConfig): string {
  return JSON.stringify({
    "@context": "http://schema.org",
    "@type": "EmailMessage",
    potentialAction: {
      "@type": "CancelAction",
      name: action.name,
      ...(action.description && { description: action.description }),
      target: Array.isArray(action.target) ? action.target : [action.target],
      ...(action.validFrom && { validFrom: action.validFrom }),
      ...(action.validUntil && { validUntil: action.validUntil }),
    },
    description:
      action.description || "Cancel your reservation or subscription",
  });
}

/**
 * Generates JSON-LD for DownloadAction
 */
function generateDownloadActionJsonLd(action: GmailActionConfig): string {
  return JSON.stringify({
    "@context": "http://schema.org",
    "@type": "EmailMessage",
    potentialAction: {
      "@type": "DownloadAction",
      name: action.name,
      ...(action.description && { description: action.description }),
      target: Array.isArray(action.target) ? action.target : [action.target],
    },
    description: action.description || "Download your document",
  });
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
    UpdateAction: "Update Action",
    CancelAction: "Cancel Action",
    DownloadAction: "Download Action",
    FlightReservation: "Flight Reservation",
    LodgingReservation: "Hotel Reservation",
    TrainReservation: "Train Reservation",
    BusReservation: "Bus Reservation",
    RentalCarReservation: "Rental Car Reservation",
    FoodEstablishmentReservation: "Restaurant Reservation",
    OrderAction: "Order Details",
    Invoice: "Invoice",
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
    UpdateAction:
      "Allow users to modify reservations or update settings. Supports deep linking.",
    CancelAction:
      "Allow users to cancel reservations or subscriptions. One-click action.",
    DownloadAction:
      "Provide download links for documents, receipts, or other files.",
    FlightReservation:
      "Display flight booking details with boarding pass information and structured itinerary.",
    LodgingReservation:
      "Show hotel reservation details with check-in/check-out dates and property information.",
    TrainReservation:
      "Display train ticket details with departure/arrival stations and seat information.",
    BusReservation:
      "Show bus booking details with route information and ticket details.",
    RentalCarReservation:
      "Display rental car reservation with pickup/dropoff locations and vehicle details.",
    FoodEstablishmentReservation:
      "Show restaurant reservation with date, time, party size, and location details.",
    OrderAction:
      "Display order confirmation with structured product data, pricing, and delivery information.",
    Invoice:
      "Show invoice details with payment due date, amount, and payment action button.",
  };
  return descriptions[type] || "";
}
