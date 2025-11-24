"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import InstallationBookingOverlay from "@/components/InstallationBookingOverlay";

type BookingModalProps = {
  orderId?: string;
  buttonText?: string;
  buttonVariant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "destructive";
  buttonSize?: "default" | "sm" | "lg" | "icon";
};

export function BookingModal({
  orderId,
  buttonText = "Book a time slot",
  buttonVariant = "default",
  buttonSize = "lg",
}: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant={buttonVariant}
        size={buttonSize}
      >
        {buttonText}
      </Button>

      {isOpen && (
        <InstallationBookingOverlay
          embedded={false}
          defaultMode="booking"
          defaultOrderId={orderId}
          onClose={() => setIsOpen(false)}
          skipGate={true}
        />
      )}
    </>
  );
}
