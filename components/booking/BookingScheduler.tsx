"use client";

import { useEffect, useState } from "react";
import { InlineWidget } from "react-calendly";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type CustomerDetails = {
  orderId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type BookingSchedulerProps = {
  customerDetails: CustomerDetails;
  onSuccess: () => void;
  onBack?: () => void;
};

export function BookingScheduler({
  customerDetails,
  onSuccess,
  onBack,
}: BookingSchedulerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCalendlyEventScheduled = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "installer_notification",
          orderId: customerDetails.orderId,
          customerName: `${customerDetails.firstName} ${customerDetails.lastName}`,
          customerEmail: customerDetails.email,
          customerPhone: customerDetails.phone,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert(
          "Booking recorded but notification failed. Please contact support."
        );
        onSuccess();
      }
    } catch (error) {
      alert(
        "Booking recorded but notification failed. Please contact support."
      );
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Time Slot
        </h2>
        <p className="text-gray-600">
          Select a convenient time for your installation
        </p>
      </div>
      <div className="calendly-widget-container">
        <InlineWidget
          url={
            process.env.NEXT_PUBLIC_CALENDLY_URL ||
            "https://calendly.com/your-calendly-link"
          }
          prefill={{
            name: `${customerDetails.firstName} ${customerDetails.lastName}`,
            email: customerDetails.email,
            customAnswers: {
              a1: customerDetails.phone,
            },
          }}
          utm={{
            utmContent: customerDetails.orderId,
          }}
          pageSettings={{
            hideEventTypeDetails: false,
            hideLandingPageDetails: false,
            primaryColor: "00a2ff",
            textColor: "4d5055",
            backgroundColor: "ffffff",
          }}
          styles={{
            height: "700px",
          }}
        />
      </div>
      {onBack && (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-full mt-4"
        >
          Back to Details
        </Button>
      )}
      <CalendlyEventListener onEventScheduled={handleCalendlyEventScheduled} />
    </div>
  );
}

function CalendlyEventListener({
  onEventScheduled,
}: {
  onEventScheduled: () => void;
}) {
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event && e.data.event === "calendly.event_scheduled") {
        onEventScheduled();
      }
    };

    window.addEventListener("message", handleCalendlyEvent);
    return () => window.removeEventListener("message", handleCalendlyEvent);
  }, [onEventScheduled]);

  return null;
}
