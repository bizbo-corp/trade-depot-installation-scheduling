"use client";

import { useState } from "react";
import { FaEnvelope, FaTruck } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AdminEmailManager() {
  const [adminOrderId, setAdminOrderId] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");

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

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
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
                installation purchase. This email does NOT include a booking
                link.
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
                Sends an email with a booking link for the customer to schedule
                their installation. The link will direct them to the booking
                flow.
              </p>
            </div>
            <Button
              onClick={handleSendDeliveryEmail}
              disabled={adminLoading}
              className="w-full"
            >
              <FaTruck className="mr-2 h-4 w-4" />
              {adminLoading ? "Sending..." : "Send Delivery & Booking Email"}
            </Button>
          </TabsContent>
        </Tabs>

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
  );
}
