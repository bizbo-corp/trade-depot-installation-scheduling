"use client";

import { Button } from "@/components/ui/button";
import { FaIcon } from "@/components/ui/fa-icon";

type DeliveryConfirmationGateProps = {
  orderId: string;
  onConfirm: () => void;
};

export function DeliveryConfirmationGate({
  orderId,
  onConfirm,
}: DeliveryConfirmationGateProps) {
  return (
    <div className="bg-foreground/0 rounded-lg p-8 text-center max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
          <FaIcon icon="box-circle-check" style="duotone" size={2} />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Order #{orderId}
        </h2>
        <p className="text-lg text-foreground">
          To ensure a successful installation, please confirm your items have
          arrived.
        </p>
      </div>
      <Button onClick={onConfirm} size="lg" className="w-full max-w-md">
        <FaIcon icon="check-circle" style="light" size={1.5} />
        Yes, I have received my delivery
      </Button>
    </div>
  );
}
