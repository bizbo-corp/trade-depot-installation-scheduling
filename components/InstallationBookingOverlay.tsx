"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { InlineWidget } from "react-calendly";
import {
  FaCheckCircle,
  FaTimes,
  FaEnvelope,
  FaTruck,
  FaCalendarAlt,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CustomerDetails = {
  orderId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type BookingStep = "gate" | "details" | "scheduler" | "success";

type InstallationBookingOverlayProps = {
  embedded?: boolean;
  defaultMode?: "admin" | "booking";
  defaultOrderId?: string;
  onClose?: () => void;
  skipGate?: boolean;
  forcedStep?: BookingStep;
  onStepChange?: (step: BookingStep, details: CustomerDetails) => void;
};

export default function InstallationBookingOverlay({
  embedded = false,
  defaultMode,
  defaultOrderId,
  onClose,
  skipGate = false,
  forcedStep,
  onStepChange,
}: InstallationBookingOverlayProps = {}) {
  const searchParams = useSearchParams();
  const mode = defaultMode || searchParams.get("mode");
  const orderId = defaultOrderId || searchParams.get("orderId");

  // Admin state
  const [adminOrderId, setAdminOrderId] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");

  // Customer state
  const initialStep: BookingStep =
    (forcedStep as BookingStep) || (skipGate || orderId ? "details" : "gate");
  const [bookingStep, setBookingStep] = useState<BookingStep>(initialStep);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    orderId: orderId || "",
    firstName: searchParams.get("firstName") || "",
    lastName: searchParams.get("lastName") || "",
    email: searchParams.get("email") || "",
    phone: searchParams.get("phone") || "",
  });
  const [customerLoading, setCustomerLoading] = useState(false);

  // Sync forcedStep if it changes
  // Sync forcedStep if it changes
  useEffect(() => {
    if (forcedStep) {
      setBookingStep(forcedStep as BookingStep);
    }
  }, [forcedStep]);

  // Return null if no mode parameter
  if (!mode) {
    return null;
  }

  // Close overlay handler
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (!embedded) {
      window.history.back();
    }
  };

  // Admin: Send Post-Purchase Email
  const handleSendPurchaseEmail = async () => {
    if (!adminOrderId || !adminEmail || !adminName) {
      setAdminMessage("Please fill in all fields");
      return;
    }

    setAdminLoading(true);
    setAdminMessage("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "purchase",
          orderId: adminOrderId,
          customerEmail: adminEmail,
          customerName: adminName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAdminMessage("✅ Post-purchase email sent successfully!");
      } else {
        setAdminMessage(`❌ Error: ${data.error || "Failed to send email"}`);
      }
    } catch (error) {
      setAdminMessage("❌ Error: Failed to send email");
    } finally {
      setAdminLoading(false);
    }
  };

  // Admin: Send Delivery & Booking Email
  const handleSendDeliveryEmail = async () => {
    if (!adminOrderId || !adminEmail || !adminName) {
      setAdminMessage("Please fill in all fields");
      return;
    }

    setAdminLoading(true);
    setAdminMessage("");

    try {
      const bookingLink = `${window.location.origin}?mode=booking&orderId=${adminOrderId}`;

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "delivery",
          orderId: adminOrderId,
          customerEmail: adminEmail,
          customerName: adminName,
          bookingLink,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAdminMessage("✅ Delivery & booking email sent successfully!");
      } else {
        setAdminMessage(`❌ Error: ${data.error || "Failed to send email"}`);
      }
    } catch (error) {
      setAdminMessage("❌ Error: Failed to send email");
    } finally {
      setAdminLoading(false);
    }
  };

  // Customer: Handle Calendly event scheduled
  const handleCalendlyEventScheduled = async () => {
    setCustomerLoading(true);

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
        if (onStepChange) {
          onStepChange("success", customerDetails);
        } else {
          setBookingStep("success");
        }
      } else {
        alert(
          "Booking recorded but notification failed. Please contact support."
        );
        if (onStepChange) {
          onStepChange("success", customerDetails);
        } else {
          setBookingStep("success");
        }
      }
    } catch (error) {
      alert(
        "Booking recorded but notification failed. Please contact support."
      );
      if (onStepChange) {
        onStepChange("success", customerDetails);
      } else {
        setBookingStep("success");
      }
    } finally {
      setCustomerLoading(false);
    }
  };

  // Customer: Validate details form
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !customerDetails.orderId ||
      !customerDetails.firstName ||
      !customerDetails.lastName ||
      !customerDetails.email ||
      !customerDetails.phone
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (onStepChange) {
      onStepChange("scheduler", customerDetails);
    } else {
      setBookingStep("scheduler");
    }
  };

  // Helper for container classes
  const containerClass = embedded
    ? "w-full"
    : "bg-white border border-gray-200 rounded-lg shadow-sm p-8";

  // Render Admin View
  if (mode === "admin") {
    return (
      <div
        className={
          embedded
            ? "w-full"
            : "fixed inset-0 z-[9999] bg-white overflow-y-auto"
        }
      >
        <div className={embedded ? "w-full" : "min-h-screen p-8"}>
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            {!embedded && (
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Installation Email Manager
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="hover:bg-gray-100"
                >
                  <FaTimes className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Admin Form */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="space-y-6">
                {/* Common Fields */}
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="orderId">BigCommerce Order ID</Label>
                    <Input
                      id="orderId"
                      type="text"
                      placeholder="e.g., 12345"
                      value={adminOrderId}
                      onChange={(e) => setAdminOrderId(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">Customer Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      placeholder="customer@example.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      type="text"
                      placeholder="John Doe"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Action Tabs */}
                <Tabs defaultValue="purchase" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="purchase">
                      <FaEnvelope className="mr-2 h-4 w-4" />
                      Post-Purchase Email
                    </TabsTrigger>
                    <TabsTrigger value="delivery">
                      <FaTruck className="mr-2 h-4 w-4" />
                      Delivery & Booking Email
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="purchase" className="space-y-4 mt-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">
                        Post-Purchase Email
                      </h3>
                      <p className="text-sm text-blue-800">
                        Sends an informational email to the customer about their
                        installation purchase. This email does NOT include a
                        booking link.
                      </p>
                    </div>
                    <Button
                      onClick={handleSendPurchaseEmail}
                      disabled={adminLoading}
                      className="w-full"
                    >
                      <FaEnvelope className="mr-2 h-4 w-4" />
                      {adminLoading ? "Sending..." : "Send Post-Purchase Email"}
                    </Button>
                  </TabsContent>

                  <TabsContent value="delivery" className="space-y-4 mt-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-semibold text-green-900 mb-2">
                        Delivery & Booking Email
                      </h3>
                      <p className="text-sm text-green-800">
                        Sends an email with a booking link for the customer to
                        schedule their installation. The link will direct them
                        to the booking flow.
                      </p>
                    </div>
                    <Button
                      onClick={handleSendDeliveryEmail}
                      disabled={adminLoading}
                      className="w-full"
                    >
                      <FaTruck className="mr-2 h-4 w-4" />
                      {adminLoading
                        ? "Sending..."
                        : "Send Delivery & Booking Email"}
                    </Button>
                  </TabsContent>
                </Tabs>

                {/* Message Display */}
                {adminMessage && (
                  <div
                    className={`p-4 rounded-lg ${
                      adminMessage.includes("✅")
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                    }`}
                  >
                    {adminMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Customer View
  if (mode === "booking" && orderId) {
    return (
      <div
        className={
          embedded
            ? "w-full"
            : "fixed inset-0 z-[9999] bg-white overflow-y-auto"
        }
      >
        <div className={embedded ? "w-full" : "min-h-screen p-8"}>
          <div className={embedded ? "w-full" : "max-w-3xl mx-auto"}>
            {/* Header */}
            {!embedded && (
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Schedule Your Installation
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="hover:bg-gray-100"
                >
                  <FaTimes className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Step 1: Gate */}
            {bookingStep === "gate" && (
              <div className={`${containerClass} text-center`}>
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <FaTruck className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Order #{orderId}
                  </h2>
                  <p className="text-lg text-gray-700">
                    To ensure a successful installation, please confirm your
                    items have arrived.
                  </p>
                </div>
                <Button
                  onClick={() => setBookingStep("details")}
                  size="lg"
                  className="w-full max-w-md"
                >
                  <FaCheckCircle className="mr-2 h-5 w-5" />
                  Yes, I have received my delivery
                </Button>
              </div>
            )}

            {/* Step 2: Customer Details */}
            {bookingStep === "details" && (
              <div className={containerClass}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Your Details
                  </h2>
                  <p className="text-gray-600">
                    Please provide your contact information
                  </p>
                </div>
                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="orderId">Order ID *</Label>
                    <Input
                      id="orderId"
                      type="text"
                      required
                      value={customerDetails.orderId}
                      onChange={(e) =>
                        setCustomerDetails({
                          ...customerDetails,
                          orderId: e.target.value,
                        })
                      }
                      disabled={!!orderId}
                      className="mt-1"
                      placeholder="e.g., 12345"
                    />
                    {orderId && (
                      <p className="text-sm text-gray-500 mt-1">
                        Order ID provided via link
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        required
                        value={customerDetails.firstName}
                        onChange={(e) =>
                          setCustomerDetails({
                            ...customerDetails,
                            firstName: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        required
                        value={customerDetails.lastName}
                        onChange={(e) =>
                          setCustomerDetails({
                            ...customerDetails,
                            lastName: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={customerDetails.email}
                      onChange={(e) =>
                        setCustomerDetails({
                          ...customerDetails,
                          email: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={customerDetails.phone}
                      onChange={(e) =>
                        setCustomerDetails({
                          ...customerDetails,
                          phone: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    {!skipGate && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setBookingStep("gate")}
                        className="flex-1"
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      type="submit"
                      className={skipGate ? "w-full" : "flex-1"}
                    >
                      Continue to Booking
                      <FaCalendarAlt className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Scheduler */}
            {bookingStep === "scheduler" && (
              <div className={containerClass}>
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
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setBookingStep("details")}
                  className="w-full mt-4"
                >
                  Back to Details
                </Button>
              </div>
            )}

            {/* Step 4: Success */}
            {bookingStep === "success" && (
              <div className={`${containerClass} text-center`}>
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <FaCheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Booking Confirmed!
                  </h2>
                  <p className="text-lg text-gray-700 mb-4">
                    Thank you for scheduling your installation. You should
                    receive a confirmation email shortly.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      What's Next?
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Check your email for booking confirmation</li>
                      <li>• Ensure someone is present at the scheduled time</li>
                      <li>• Have your items ready for installation</li>
                      <li>• Contact us if you need to reschedule</li>
                    </ul>
                  </div>
                </div>
                <Button
                  onClick={handleClose}
                  size="lg"
                  className="w-full max-w-md"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Calendly Event Listener */}
        {bookingStep === "scheduler" && (
          <CalendlyEventListener
            onEventScheduled={handleCalendlyEventScheduled}
          />
        )}
      </div>
    );
  }

  return null;
}

// Separate component to handle Calendly events
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
