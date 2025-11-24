"use client";

import { useState } from "react";
import { DeliveryConfirmationGate } from "@/components/DeliveryConfirmationGate";
import { BookingModal } from "@/components/BookingModal";
import InstallationBookingOverlay from "@/components/InstallationBookingOverlay";

type BookingFlowProps = {
  orderId: string;
};

export function BookingFlow({ orderId }: BookingFlowProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <DeliveryConfirmationGate
        orderId={orderId}
        onConfirm={() => setShowModal(true)}
      />

      {showModal && (
        <InstallationBookingOverlay
          embedded={false}
          defaultMode="booking"
          defaultOrderId={orderId}
          onClose={() => setShowModal(false)}
          skipGate={true}
        />
      )}
    </>
  );
}
