"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Address,
  BusReservationSettings,
  FlightReservationSettings,
  FoodEstablishmentReservationSettings,
  LodgingReservationSettings,
  RentalCarReservationSettings,
  ReservationStatus,
  TrainReservationSettings,
} from "@/types/email";

// Flight Settings Component
interface FlightSettingsProps {
  settings: FlightReservationSettings;
  onChange: (settings: FlightReservationSettings) => void;
}

export function FlightSettings({ settings, onChange }: FlightSettingsProps) {
  const updateField = <K extends keyof FlightReservationSettings>(
    field: K,
    value: FlightReservationSettings[K],
  ) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="flight-reservation-number">Reservation Number *</Label>
        <Input
          id="flight-reservation-number"
          value={settings.reservationNumber || ""}
          onChange={(e) => updateField("reservationNumber", e.target.value)}
          placeholder="e.g., ABC123"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="flight-status">Reservation Status *</Label>
        <Select
          value={settings.reservationStatus}
          onValueChange={(value) =>
            updateField("reservationStatus", value as ReservationStatus)
          }
        >
          <SelectTrigger id="flight-status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
            <SelectItem value="CheckedIn">Checked In</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="flight-passenger-name">Passenger Name *</Label>
        <Input
          id="flight-passenger-name"
          value={settings.passengerName || ""}
          onChange={(e) => updateField("passengerName", e.target.value)}
          placeholder="e.g., John Doe"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="flight-airline">Airline *</Label>
          <Input
            id="flight-airline"
            value={settings.airline || ""}
            onChange={(e) => updateField("airline", e.target.value)}
            placeholder="e.g., United Airlines"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="flight-airline-code">Airline Code *</Label>
          <Input
            id="flight-airline-code"
            value={settings.airlineCode || ""}
            onChange={(e) => updateField("airlineCode", e.target.value)}
            placeholder="e.g., UA"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="flight-number">Flight Number *</Label>
        <Input
          id="flight-number"
          value={settings.flightNumber || ""}
          onChange={(e) => updateField("flightNumber", e.target.value)}
          placeholder="e.g., UA123"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="flight-departure-airport">Departure Airport *</Label>
          <Input
            id="flight-departure-airport"
            value={settings.departureAirport || ""}
            onChange={(e) => updateField("departureAirport", e.target.value)}
            placeholder="e.g., San Francisco Intl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="flight-departure-code">Code *</Label>
          <Input
            id="flight-departure-code"
            value={settings.departureAirportCode || ""}
            onChange={(e) =>
              updateField("departureAirportCode", e.target.value)
            }
            placeholder="e.g., SFO"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="flight-departure-time">
          Departure Time * (ISO 8601)
        </Label>
        <Input
          id="flight-departure-time"
          type="datetime-local"
          value={
            settings.departureTime
              ? settings.departureTime.substring(0, 16)
              : ""
          }
          onChange={(e) =>
            updateField("departureTime", `${e.target.value}:00Z`)
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="flight-arrival-airport">Arrival Airport *</Label>
          <Input
            id="flight-arrival-airport"
            value={settings.arrivalAirport || ""}
            onChange={(e) => updateField("arrivalAirport", e.target.value)}
            placeholder="e.g., Los Angeles Intl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="flight-arrival-code">Code *</Label>
          <Input
            id="flight-arrival-code"
            value={settings.arrivalAirportCode || ""}
            onChange={(e) => updateField("arrivalAirportCode", e.target.value)}
            placeholder="e.g., LAX"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="flight-arrival-time">Arrival Time * (ISO 8601)</Label>
        <Input
          id="flight-arrival-time"
          type="datetime-local"
          value={
            settings.arrivalTime ? settings.arrivalTime.substring(0, 16) : ""
          }
          onChange={(e) => updateField("arrivalTime", `${e.target.value}:00Z`)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="flight-gate">Departure Gate</Label>
          <Input
            id="flight-gate"
            value={settings.departureGate || ""}
            onChange={(e) => updateField("departureGate", e.target.value)}
            placeholder="e.g., A12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="flight-seat">Seat Number</Label>
          <Input
            id="flight-seat"
            value={settings.seatNumber || ""}
            onChange={(e) => updateField("seatNumber", e.target.value)}
            placeholder="e.g., 12A"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="flight-boarding-time">Boarding Time (ISO 8601)</Label>
        <Input
          id="flight-boarding-time"
          type="datetime-local"
          value={
            settings.boardingTime ? settings.boardingTime.substring(0, 16) : ""
          }
          onChange={(e) => updateField("boardingTime", `${e.target.value}:00Z`)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="flight-ticket-token">Ticket Token / QR Code</Label>
        <Input
          id="flight-ticket-token"
          value={settings.ticketToken || ""}
          onChange={(e) => updateField("ticketToken", e.target.value)}
          placeholder="e.g., TKT123456789"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="flight-ff-number">Frequent Flyer #</Label>
          <Input
            id="flight-ff-number"
            value={settings.frequentFlyerNumber || ""}
            onChange={(e) => updateField("frequentFlyerNumber", e.target.value)}
            placeholder="e.g., FF123456"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="flight-ff-program">FF Program</Label>
          <Input
            id="flight-ff-program"
            value={settings.frequentFlyerProgram || ""}
            onChange={(e) =>
              updateField("frequentFlyerProgram", e.target.value)
            }
            placeholder="e.g., MileagePlus"
          />
        </div>
      </div>
    </div>
  );
}

// Hotel Settings Component
interface HotelSettingsProps {
  settings: LodgingReservationSettings;
  onChange: (settings: LodgingReservationSettings) => void;
}

export function HotelSettings({ settings, onChange }: HotelSettingsProps) {
  const updateField = <K extends keyof LodgingReservationSettings>(
    field: K,
    value: LodgingReservationSettings[K],
  ) => {
    onChange({ ...settings, [field]: value });
  };

  const updateAddress = <K extends keyof Address>(field: K, value: string) => {
    onChange({
      ...settings,
      hotelAddress: { ...settings.hotelAddress, [field]: value },
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="hotel-reservation-number">Reservation Number *</Label>
        <Input
          id="hotel-reservation-number"
          value={settings.reservationNumber || ""}
          onChange={(e) => updateField("reservationNumber", e.target.value)}
          placeholder="e.g., HTL123456"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hotel-status">Reservation Status *</Label>
        <Select
          value={settings.reservationStatus}
          onValueChange={(value) =>
            updateField("reservationStatus", value as ReservationStatus)
          }
        >
          <SelectTrigger id="hotel-status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
            <SelectItem value="CheckedIn">Checked In</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hotel-guest-name">Guest Name *</Label>
        <Input
          id="hotel-guest-name"
          value={settings.guestName || ""}
          onChange={(e) => updateField("guestName", e.target.value)}
          placeholder="e.g., John Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hotel-name">Hotel Name *</Label>
        <Input
          id="hotel-name"
          value={settings.hotelName || ""}
          onChange={(e) => updateField("hotelName", e.target.value)}
          placeholder="e.g., Grand Hotel"
        />
      </div>

      <div className="space-y-2">
        <Label>Hotel Address *</Label>
        <Input
          placeholder="Street Address"
          value={settings.hotelAddress?.streetAddress || ""}
          onChange={(e) => updateAddress("streetAddress", e.target.value)}
          className="mb-2"
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="City"
            value={settings.hotelAddress?.addressLocality || ""}
            onChange={(e) => updateAddress("addressLocality", e.target.value)}
          />
          <Input
            placeholder="State"
            value={settings.hotelAddress?.addressRegion || ""}
            onChange={(e) => updateAddress("addressRegion", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input
            placeholder="Postal Code"
            value={settings.hotelAddress?.postalCode || ""}
            onChange={(e) => updateAddress("postalCode", e.target.value)}
          />
          <Input
            placeholder="Country"
            value={settings.hotelAddress?.addressCountry || ""}
            onChange={(e) => updateAddress("addressCountry", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hotel-phone">Hotel Phone</Label>
        <Input
          id="hotel-phone"
          value={settings.hotelPhone || ""}
          onChange={(e) => updateField("hotelPhone", e.target.value)}
          placeholder="e.g., +1-555-123-4567"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hotel-checkin">Check-in Date *</Label>
          <Input
            id="hotel-checkin"
            type="datetime-local"
            value={
              settings.checkinDate ? settings.checkinDate.substring(0, 16) : ""
            }
            onChange={(e) =>
              updateField("checkinDate", `${e.target.value}:00Z`)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hotel-checkout">Check-out Date *</Label>
          <Input
            id="hotel-checkout"
            type="datetime-local"
            value={
              settings.checkoutDate
                ? settings.checkoutDate.substring(0, 16)
                : ""
            }
            onChange={(e) =>
              updateField("checkoutDate", `${e.target.value}:00Z`)
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hotel-guests">Number of Guests</Label>
          <Input
            id="hotel-guests"
            type="number"
            value={settings.numGuests || ""}
            onChange={(e) =>
              updateField(
                "numGuests",
                parseInt(e.target.value, 10) || undefined,
              )
            }
            placeholder="e.g., 2"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hotel-room-type">Room Type</Label>
          <Input
            id="hotel-room-type"
            value={settings.roomType || ""}
            onChange={(e) => updateField("roomType", e.target.value)}
            placeholder="e.g., Deluxe King"
          />
        </div>
      </div>
    </div>
  );
}

// Train Settings Component
interface TrainSettingsProps {
  settings: TrainReservationSettings;
  onChange: (settings: TrainReservationSettings) => void;
}

export function TrainSettings({ settings, onChange }: TrainSettingsProps) {
  const updateField = <K extends keyof TrainReservationSettings>(
    field: K,
    value: TrainReservationSettings[K],
  ) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="train-reservation-number">Reservation Number *</Label>
        <Input
          id="train-reservation-number"
          value={settings.reservationNumber || ""}
          onChange={(e) => updateField("reservationNumber", e.target.value)}
          placeholder="e.g., TRN123456"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="train-status">Reservation Status *</Label>
        <Select
          value={settings.reservationStatus}
          onValueChange={(value) =>
            updateField("reservationStatus", value as ReservationStatus)
          }
        >
          <SelectTrigger id="train-status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
            <SelectItem value="CheckedIn">Checked In</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="train-passenger-name">Passenger Name *</Label>
        <Input
          id="train-passenger-name"
          value={settings.passengerName || ""}
          onChange={(e) => updateField("passengerName", e.target.value)}
          placeholder="e.g., John Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="train-number">Train Number</Label>
        <Input
          id="train-number"
          value={settings.trainNumber || ""}
          onChange={(e) => updateField("trainNumber", e.target.value)}
          placeholder="e.g., 123"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="train-departure-station">Departure Station *</Label>
        <Input
          id="train-departure-station"
          value={settings.departureStation || ""}
          onChange={(e) => updateField("departureStation", e.target.value)}
          placeholder="e.g., Union Station"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="train-departure-time">
          Departure Time * (ISO 8601)
        </Label>
        <Input
          id="train-departure-time"
          type="datetime-local"
          value={
            settings.departureTime
              ? settings.departureTime.substring(0, 16)
              : ""
          }
          onChange={(e) =>
            updateField("departureTime", `${e.target.value}:00Z`)
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="train-arrival-station">Arrival Station *</Label>
        <Input
          id="train-arrival-station"
          value={settings.arrivalStation || ""}
          onChange={(e) => updateField("arrivalStation", e.target.value)}
          placeholder="e.g., Penn Station"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="train-arrival-time">Arrival Time * (ISO 8601)</Label>
        <Input
          id="train-arrival-time"
          type="datetime-local"
          value={
            settings.arrivalTime ? settings.arrivalTime.substring(0, 16) : ""
          }
          onChange={(e) => updateField("arrivalTime", `${e.target.value}:00Z`)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="train-seat">Seat Number</Label>
          <Input
            id="train-seat"
            value={settings.seatNumber || ""}
            onChange={(e) => updateField("seatNumber", e.target.value)}
            placeholder="e.g., 12A"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="train-coach">Coach</Label>
          <Input
            id="train-coach"
            value={settings.coach || ""}
            onChange={(e) => updateField("coach", e.target.value)}
            placeholder="e.g., 3"
          />
        </div>
      </div>
    </div>
  );
}

// Bus Settings Component
interface BusSettingsProps {
  settings: BusReservationSettings;
  onChange: (settings: BusReservationSettings) => void;
}

export function BusSettings({ settings, onChange }: BusSettingsProps) {
  const updateField = <K extends keyof BusReservationSettings>(
    field: K,
    value: BusReservationSettings[K],
  ) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bus-reservation-number">Reservation Number *</Label>
        <Input
          id="bus-reservation-number"
          value={settings.reservationNumber || ""}
          onChange={(e) => updateField("reservationNumber", e.target.value)}
          placeholder="e.g., BUS123456"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bus-status">Reservation Status *</Label>
        <Select
          value={settings.reservationStatus}
          onValueChange={(value) =>
            updateField("reservationStatus", value as ReservationStatus)
          }
        >
          <SelectTrigger id="bus-status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
            <SelectItem value="CheckedIn">Checked In</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bus-passenger-name">Passenger Name *</Label>
        <Input
          id="bus-passenger-name"
          value={settings.passengerName || ""}
          onChange={(e) => updateField("passengerName", e.target.value)}
          placeholder="e.g., John Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bus-company">Bus Company *</Label>
        <Input
          id="bus-company"
          value={settings.busCompany || ""}
          onChange={(e) => updateField("busCompany", e.target.value)}
          placeholder="e.g., Greyhound"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bus-departure-stop">Departure Stop *</Label>
        <Input
          id="bus-departure-stop"
          value={settings.departureStop || ""}
          onChange={(e) => updateField("departureStop", e.target.value)}
          placeholder="e.g., Downtown Terminal"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bus-departure-time">Departure Time * (ISO 8601)</Label>
        <Input
          id="bus-departure-time"
          type="datetime-local"
          value={
            settings.departureTime
              ? settings.departureTime.substring(0, 16)
              : ""
          }
          onChange={(e) =>
            updateField("departureTime", `${e.target.value}:00Z`)
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bus-arrival-stop">Arrival Stop *</Label>
        <Input
          id="bus-arrival-stop"
          value={settings.arrivalStop || ""}
          onChange={(e) => updateField("arrivalStop", e.target.value)}
          placeholder="e.g., Airport Terminal"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bus-arrival-time">Arrival Time * (ISO 8601)</Label>
        <Input
          id="bus-arrival-time"
          type="datetime-local"
          value={
            settings.arrivalTime ? settings.arrivalTime.substring(0, 16) : ""
          }
          onChange={(e) => updateField("arrivalTime", `${e.target.value}:00Z`)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bus-seat">Seat Number</Label>
        <Input
          id="bus-seat"
          value={settings.seatNumber || ""}
          onChange={(e) => updateField("seatNumber", e.target.value)}
          placeholder="e.g., 12A"
        />
      </div>
    </div>
  );
}

// Rental Car Settings Component
interface RentalCarSettingsProps {
  settings: RentalCarReservationSettings;
  onChange: (settings: RentalCarReservationSettings) => void;
}

export function RentalCarSettings({
  settings,
  onChange,
}: RentalCarSettingsProps) {
  const updateField = <K extends keyof RentalCarReservationSettings>(
    field: K,
    value: RentalCarReservationSettings[K],
  ) => {
    onChange({ ...settings, [field]: value });
  };

  const updatePickupAddress = <K extends keyof Address>(
    field: K,
    value: string,
  ) => {
    onChange({
      ...settings,
      pickupLocation: { ...settings.pickupLocation, [field]: value },
    });
  };

  const updateDropoffAddress = <K extends keyof Address>(
    field: K,
    value: string,
  ) => {
    onChange({
      ...settings,
      dropoffLocation: { ...settings.dropoffLocation, [field]: value },
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="rental-reservation-number">Reservation Number *</Label>
        <Input
          id="rental-reservation-number"
          value={settings.reservationNumber || ""}
          onChange={(e) => updateField("reservationNumber", e.target.value)}
          placeholder="e.g., CAR123456"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rental-status">Reservation Status *</Label>
        <Select
          value={settings.reservationStatus}
          onValueChange={(value) =>
            updateField("reservationStatus", value as ReservationStatus)
          }
        >
          <SelectTrigger id="rental-status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
            <SelectItem value="CheckedIn">Checked In</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rental-renter-name">Renter Name *</Label>
        <Input
          id="rental-renter-name"
          value={settings.renterName || ""}
          onChange={(e) => updateField("renterName", e.target.value)}
          placeholder="e.g., John Doe"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rental-car-brand">Car Brand *</Label>
          <Input
            id="rental-car-brand"
            value={settings.carBrand || ""}
            onChange={(e) => updateField("carBrand", e.target.value)}
            placeholder="e.g., Toyota"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rental-car-model">Car Model *</Label>
          <Input
            id="rental-car-model"
            value={settings.carModel || ""}
            onChange={(e) => updateField("carModel", e.target.value)}
            placeholder="e.g., Camry"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Pickup Location *</Label>
        <Input
          placeholder="Location Name"
          value={settings.pickupLocation?.name || ""}
          onChange={(e) => updatePickupAddress("name", e.target.value)}
          className="mb-2"
        />
        <Input
          placeholder="Street Address"
          value={settings.pickupLocation?.streetAddress || ""}
          onChange={(e) => updatePickupAddress("streetAddress", e.target.value)}
          className="mb-2"
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="City"
            value={settings.pickupLocation?.addressLocality || ""}
            onChange={(e) =>
              updatePickupAddress("addressLocality", e.target.value)
            }
          />
          <Input
            placeholder="State"
            value={settings.pickupLocation?.addressRegion || ""}
            onChange={(e) =>
              updatePickupAddress("addressRegion", e.target.value)
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input
            placeholder="Postal Code"
            value={settings.pickupLocation?.postalCode || ""}
            onChange={(e) => updatePickupAddress("postalCode", e.target.value)}
          />
          <Input
            placeholder="Country"
            value={settings.pickupLocation?.addressCountry || ""}
            onChange={(e) =>
              updatePickupAddress("addressCountry", e.target.value)
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rental-pickup-time">Pickup Time * (ISO 8601)</Label>
        <Input
          id="rental-pickup-time"
          type="datetime-local"
          value={
            settings.pickupTime ? settings.pickupTime.substring(0, 16) : ""
          }
          onChange={(e) => updateField("pickupTime", `${e.target.value}:00Z`)}
        />
      </div>

      <div className="space-y-2">
        <Label>Dropoff Location *</Label>
        <Input
          placeholder="Location Name"
          value={settings.dropoffLocation?.name || ""}
          onChange={(e) => updateDropoffAddress("name", e.target.value)}
          className="mb-2"
        />
        <Input
          placeholder="Street Address"
          value={settings.dropoffLocation?.streetAddress || ""}
          onChange={(e) =>
            updateDropoffAddress("streetAddress", e.target.value)
          }
          className="mb-2"
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="City"
            value={settings.dropoffLocation?.addressLocality || ""}
            onChange={(e) =>
              updateDropoffAddress("addressLocality", e.target.value)
            }
          />
          <Input
            placeholder="State"
            value={settings.dropoffLocation?.addressRegion || ""}
            onChange={(e) =>
              updateDropoffAddress("addressRegion", e.target.value)
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input
            placeholder="Postal Code"
            value={settings.dropoffLocation?.postalCode || ""}
            onChange={(e) => updateDropoffAddress("postalCode", e.target.value)}
          />
          <Input
            placeholder="Country"
            value={settings.dropoffLocation?.addressCountry || ""}
            onChange={(e) =>
              updateDropoffAddress("addressCountry", e.target.value)
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rental-dropoff-time">Dropoff Time * (ISO 8601)</Label>
        <Input
          id="rental-dropoff-time"
          type="datetime-local"
          value={
            settings.dropoffTime ? settings.dropoffTime.substring(0, 16) : ""
          }
          onChange={(e) => updateField("dropoffTime", `${e.target.value}:00Z`)}
        />
      </div>
    </div>
  );
}

// Restaurant Settings Component
interface RestaurantSettingsProps {
  settings: FoodEstablishmentReservationSettings;
  onChange: (settings: FoodEstablishmentReservationSettings) => void;
}

export function RestaurantSettings({
  settings,
  onChange,
}: RestaurantSettingsProps) {
  const updateField = <K extends keyof FoodEstablishmentReservationSettings>(
    field: K,
    value: FoodEstablishmentReservationSettings[K],
  ) => {
    onChange({ ...settings, [field]: value });
  };

  const updateAddress = <K extends keyof Address>(field: K, value: string) => {
    onChange({
      ...settings,
      restaurantAddress: { ...settings.restaurantAddress, [field]: value },
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="restaurant-reservation-number">
          Reservation Number *
        </Label>
        <Input
          id="restaurant-reservation-number"
          value={settings.reservationNumber || ""}
          onChange={(e) => updateField("reservationNumber", e.target.value)}
          placeholder="e.g., RES123456"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="restaurant-status">Reservation Status *</Label>
        <Select
          value={settings.reservationStatus}
          onValueChange={(value) =>
            updateField("reservationStatus", value as ReservationStatus)
          }
        >
          <SelectTrigger id="restaurant-status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
            <SelectItem value="CheckedIn">Checked In</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="restaurant-guest-name">Guest Name *</Label>
        <Input
          id="restaurant-guest-name"
          value={settings.guestName || ""}
          onChange={(e) => updateField("guestName", e.target.value)}
          placeholder="e.g., John Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="restaurant-name">Restaurant Name *</Label>
        <Input
          id="restaurant-name"
          value={settings.restaurantName || ""}
          onChange={(e) => updateField("restaurantName", e.target.value)}
          placeholder="e.g., The French Laundry"
        />
      </div>

      <div className="space-y-2">
        <Label>Restaurant Address *</Label>
        <Input
          placeholder="Street Address"
          value={settings.restaurantAddress?.streetAddress || ""}
          onChange={(e) => updateAddress("streetAddress", e.target.value)}
          className="mb-2"
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="City"
            value={settings.restaurantAddress?.addressLocality || ""}
            onChange={(e) => updateAddress("addressLocality", e.target.value)}
          />
          <Input
            placeholder="State"
            value={settings.restaurantAddress?.addressRegion || ""}
            onChange={(e) => updateAddress("addressRegion", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input
            placeholder="Postal Code"
            value={settings.restaurantAddress?.postalCode || ""}
            onChange={(e) => updateAddress("postalCode", e.target.value)}
          />
          <Input
            placeholder="Country"
            value={settings.restaurantAddress?.addressCountry || ""}
            onChange={(e) => updateAddress("addressCountry", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="restaurant-time">Reservation Time * (ISO 8601)</Label>
        <Input
          id="restaurant-time"
          type="datetime-local"
          value={
            settings.reservationTime
              ? settings.reservationTime.substring(0, 16)
              : ""
          }
          onChange={(e) =>
            updateField("reservationTime", `${e.target.value}:00Z`)
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="restaurant-party-size">Party Size *</Label>
        <Input
          id="restaurant-party-size"
          type="number"
          value={settings.partySize || ""}
          onChange={(e) =>
            updateField("partySize", parseInt(e.target.value, 10) || 0)
          }
          placeholder="e.g., 4"
        />
      </div>
    </div>
  );
}
