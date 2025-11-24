"use client";

import { useEffect, useState } from "react";
import { InlineWidget } from "react-calendly";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { clearBookingFormState } from "./BookingDetailsForm";

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
        clearBookingFormState();
        onSuccess();
      } else {
        alert(
          "Booking recorded but notification failed. Please contact support."
        );
        clearBookingFormState();
        onSuccess();
      }
    } catch (error) {
      alert(
        "Booking recorded but notification failed. Please contact support."
      );
      clearBookingFormState();
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="mb-6">
        <p className="text-foreground/50 text-center">
          Select a convenient time for your installation
        </p>
      </div>
      <div className="calendly-widget-container">
        <InlineWidget
          url={
            process.env.NEXT_PUBLIC_CALENDLY_URL ||
            "https://calendly.com/michael-bizbo?hide_landing_page_details=1&hide_gdpr_banner=1"
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
            primaryColor: "1e1eaa",
            textColor: "4d5055",
            backgroundColor: "ffffff",
          }}
          styles={{
            height: "1200px",
          }}
        />
      </div>
      {onBack && (
        <div className="flex justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          className="mt-4"
        >
          Back to Details
        </Button>
        </div>
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
