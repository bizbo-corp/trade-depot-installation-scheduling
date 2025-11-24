"use client";

import { FaTruck, FaCheckCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

type DeliveryConfirmationGateProps = {
  orderId: string;
  onConfirm: () => void;
};

export function DeliveryConfirmationGate({
  orderId,
  onConfirm,
}: DeliveryConfirmationGateProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <FaTruck className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Order #{orderId}
        </h2>
        <p className="text-lg text-gray-700">
          To ensure a successful installation, please confirm your items have
          arrived.
        </p>
      </div>
      <Button onClick={onConfirm} size="lg" className="w-full max-w-md">
        <FaCheckCircle className="mr-2 h-5 w-5" />
        Yes, I have received my delivery
      </Button>
    </div>
  );
}
