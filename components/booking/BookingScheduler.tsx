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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCalendlyEventScheduled = async (eventData?: any) => {
    setLoading(true);

    try {
      // Extract booking date and time from Calendly event payload
      let bookingDate: string | undefined;
      let bookingTime: string | undefined;

      if (eventData?.payload?.event) {
        const startTime = eventData.payload.event.start_time;
        if (startTime) {
          const date = new Date(startTime);
          // Format date as DD/MM/YYYY
          bookingDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
          // Format time as HH:MM
          bookingTime = date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        }
      }

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "installer_notification",
          orderId: customerDetails.orderId,
          customerName: `${customerDetails.firstName} ${customerDetails.lastName}`,
          customerEmail: customerDetails.email,
          customerPhone: customerDetails.phone,
          bookingDate,
          bookingTime,
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
        {isMounted ? (
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
        ) : (
          <div className="flex items-center justify-center" style={{ height: "1200px" }}>
            <div className="text-foreground/50">Loading calendar...</div>
          </div>
        )}
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
  onEventScheduled: (eventData?: any) => void;
}) {
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event && e.data.event === "calendly.event_scheduled") {
        // Pass the full event data so we can extract booking details
        onEventScheduled(e.data);
      }
    };

    window.addEventListener("message", handleCalendlyEvent);
    return () => window.removeEventListener("message", handleCalendlyEvent);
  }, [onEventScheduled]);

  return null;
}
