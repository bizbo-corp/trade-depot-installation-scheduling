"use client";

import { useState, useMemo } from "react";
import { FaEnvelope, FaTruck, FaUserCog, FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  generatePurchaseEmailHtml,
  generateDeliveryEmailHtml,
  generateInstallerNotificationEmailHtml,
  getPurchaseEmailSubject,
  getDeliveryEmailSubject,
  getInstallerNotificationEmailSubject,
} from "@/lib/email-templates";

export function AdminEmailManager() {
  const [adminOrderId, setAdminOrderId] = useState(() => 
    String(Math.floor(Math.random() * 900000) + 100000)
  );
  const [adminEmail, setAdminEmail] = useState("christie.michael@gmail.com");
  const [adminName, setAdminName] = useState("Michael Christie");
  const [adminPhone, setAdminPhone] = useState("+64 21 123 4567");
  const [installerEmail, setInstallerEmail] = useState("michael@bizbo.co.nz");
  const [emailType, setEmailType] = useState("purchase");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const handleSendPurchaseEmail = async () => {
    if (!adminOrderId || !adminEmail || !adminName) {
      setAdminMessage("Please fill in all fields");
      return;
    }

    setAdminLoading(true);
    setAdminMessage("");

    try {
      console.log("[Post-Purchase Email] Sending email:", {
        type: "purchase",
        orderId: adminOrderId,
        customerEmail: adminEmail,
        customerName: adminName,
      });

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

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("[Post-Purchase Email] Failed to parse response:", parseError);
        setAdminMessage("❌ Error: Invalid response from server");
        return;
      }

      console.log("[Post-Purchase Email] API Response:", {
        status: response.status,
        ok: response.ok,
        data,
      });

      if (response.ok) {
        setAdminMessage("✅ Post-purchase email sent successfully!");
      } else {
        const errorMsg = data.error || "Failed to send email";
        const detailsMsg = data.details ? ` (${data.details})` : "";
        console.error("[Post-Purchase Email] API Error:", {
          error: errorMsg,
          details: data.details,
          fullResponse: data,
        });
        setAdminMessage(`❌ Error: ${errorMsg}${detailsMsg}`);
      }
    } catch (error) {
      console.error("[Post-Purchase Email] Network/Fetch Error:", error);
      const errorMessage =
        error instanceof Error
          ? `Network error: ${error.message}`
          : "Failed to send email - network error";
      setAdminMessage(`❌ ${errorMessage}`);
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
      const bookingLink = `${window.location.origin}/?orderId=${adminOrderId}`;

      console.log("[Delivery & Booking Email] Sending email:", {
        type: "delivery",
        orderId: adminOrderId,
        customerEmail: adminEmail,
        customerName: adminName,
        bookingLink,
      });

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

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("[Delivery & Booking Email] Failed to parse response:", parseError);
        setAdminMessage("❌ Error: Invalid response from server");
        return;
      }

      console.log("[Delivery & Booking Email] API Response:", {
        status: response.status,
        ok: response.ok,
        data,
      });

      if (response.ok) {
        setAdminMessage("✅ Delivery & booking email sent successfully!");
      } else {
        const errorMsg = data.error || "Failed to send email";
        const detailsMsg = data.details ? ` (${data.details})` : "";
        console.error("[Delivery & Booking Email] API Error:", {
          error: errorMsg,
          details: data.details,
          fullResponse: data,
        });
        setAdminMessage(`❌ Error: ${errorMsg}${detailsMsg}`);
      }
    } catch (error) {
      console.error("[Delivery & Booking Email] Network/Fetch Error:", error);
      const errorMessage =
        error instanceof Error
          ? `Network error: ${error.message}`
          : "Failed to send email - network error";
      setAdminMessage(`❌ ${errorMessage}`);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleSendInstallerEmail = async () => {
    if (!adminOrderId || !adminEmail || !adminName || !adminPhone || !installerEmail) {
      setAdminMessage("Please fill in all fields");
      return;
    }

    setAdminLoading(true);
    setAdminMessage("");

    try {
      console.log("[Installer Notification Email] Sending email:", {
        type: "installer_notification",
        orderId: adminOrderId,
        customerEmail: adminEmail,
        customerName: adminName,
        customerPhone: adminPhone,
        installerEmail,
      });

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "installer_notification",
          orderId: adminOrderId,
          customerEmail: adminEmail,
          customerName: adminName,
          customerPhone: adminPhone,
          installerEmail,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("[Installer Notification Email] Failed to parse response:", parseError);
        setAdminMessage("❌ Error: Invalid response from server");
        return;
      }

      console.log("[Installer Notification Email] API Response:", {
        status: response.status,
        ok: response.ok,
        data,
      });

      if (response.ok) {
        setAdminMessage("✅ Installer notification email sent successfully!");
      } else {
        const errorMsg = data.error || "Failed to send email";
        const detailsMsg = data.details ? ` (${data.details})` : "";
        console.error("[Installer Notification Email] API Error:", {
          error: errorMsg,
          details: data.details,
          fullResponse: data,
        });
        setAdminMessage(`❌ Error: ${errorMsg}${detailsMsg}`);
      }
    } catch (error) {
      console.error("[Installer Notification Email] Network/Fetch Error:", error);
      const errorMessage =
        error instanceof Error
          ? `Network error: ${error.message}`
          : "Failed to send email - network error";
      setAdminMessage(`❌ ${errorMessage}`);
    } finally {
      setAdminLoading(false);
    }
  };

  // Generate email preview HTML based on current form values
  const emailPreviewHtml = useMemo(() => {
    if (emailType === "purchase") {
      if (!adminOrderId || !adminEmail || !adminName) return null;
      return generatePurchaseEmailHtml({
        customerName: adminName,
        orderId: adminOrderId,
      });
    } else if (emailType === "delivery") {
      if (!adminOrderId || !adminEmail || !adminName) return null;
      const bookingLink = typeof window !== "undefined" 
        ? `${window.location.origin}/?orderId=${adminOrderId}`
        : `/?orderId=${adminOrderId}`;
      return generateDeliveryEmailHtml({
        customerName: adminName,
        orderId: adminOrderId,
        bookingLink,
      });
    }
    return null;
  }, [emailType, adminOrderId, adminEmail, adminName]);

  const installerEmailPreviewHtml = useMemo(() => {
    if (!adminOrderId || !adminEmail || !adminName || !adminPhone) return null;
    return generateInstallerNotificationEmailHtml({
      orderId: adminOrderId,
      customerName: adminName,
      customerEmail: adminEmail,
      customerPhone: adminPhone,
    });
  }, [adminOrderId, adminEmail, adminName, adminPhone]);

  const getEmailSubject = () => {
    if (emailType === "purchase") {
      return getPurchaseEmailSubject();
    } else if (emailType === "delivery") {
      return getDeliveryEmailSubject(adminOrderId);
    }
    return "";
  };

  return (
    <div className="bg-white max-w-4xl mx-auto">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin</h1>
        <h2 className="text-lg font-medium">Simulate Emails</h2>
        <Tabs defaultValue="customer" className="">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="customer">
              <FaEnvelope className="mr-2 h-4 w-4" />
              Customer Emails
            </TabsTrigger>
            <TabsTrigger value="installer">
              <FaUserCog className="mr-2 h-4 w-4" />
              Installer Emails
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customer" className="space-y-6 mt-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Customer Email Simulation</h2>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="orderId">BigCommerce Order ID (Randomised for testing)</Label>
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
                    <Label htmlFor="customerEmail">Customer Email (Example)</Label>
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
                    <Label htmlFor="customerName">Customer Name (Example)</Label>
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

                <div className="space-y-4">
                  <RadioGroup value={emailType} onValueChange={setEmailType} className="grid grid-cols-2 gap-4">
                    <div>
                      <RadioGroupItem value="purchase" id="purchase" className="peer sr-only" />
                      <Label
                        htmlFor="purchase"
                        className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          emailType === "purchase"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center">
                          <FaEnvelope className="mr-2 h-4 w-4" />
                          <span className="font-medium">Post-Purchase Email (Trigger: Post Purchase)</span>
                        </div>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="delivery" id="delivery" className="peer sr-only" />
                      <Label
                        htmlFor="delivery"
                        className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          emailType === "delivery"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center">
                          <FaTruck className="mr-2 h-4 w-4" />
                          <span className="font-medium">Installation Booking Email (Trigger: Post Delivery)</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {emailType === "purchase" && (
                    <div className="space-y-4 mt-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-2">
                          Post-Purchase Email
                        </h3>
                        <p className="text-sm text-blue-800 mb-4">
                        This email variant is sent only if the customer has purchased the installation service. 
                        Sends an informational email to the customer about their
                          order and the next steps for installation. This email does NOT include a booking
                          link but a link to download the order.
                        </p>
                        <Button
                          onClick={() => {
                            setShowPreview(!showPreview);
                            setPreviewKey((prev) => prev + 1);
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          {showPreview ? (
                            <>
                              <FaEyeSlash className="mr-2 h-4 w-4" />
                              Hide Preview
                            </>
                          ) : (
                            <>
                              <FaEye className="mr-2 h-4 w-4" />
                              Show Preview
                            </>
                          )}
                        </Button>
                      </div>
                      {showPreview && emailPreviewHtml && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden mt-4">
                          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                            <p className="text-sm font-medium text-gray-700">
                              <strong>To:</strong> {adminEmail}
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                              <strong>Subject:</strong> {getEmailSubject()}
                            </p>
                          </div>
                          <div className="bg-white" style={{ height: "600px", overflow: "auto" }}>
                            <iframe
                              key={`preview-${emailType}-${previewKey}`}
                              srcDoc={emailPreviewHtml}
                              className="w-full h-full border-0"
                              title="Email Preview"
                              onLoad={() => {
                                // Force re-render if needed
                                if (previewKey === 0) setPreviewKey(1);
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <Button
                        onClick={handleSendPurchaseEmail}
                        disabled={adminLoading}
                        className="w-full"
                      >
                        <FaEnvelope className="mr-2 h-4 w-4" />
                        {adminLoading ? "Sending..." : "Send Post-Purchase Email"}
                      </Button>
                    </div>
                  )}

                  {emailType === "delivery" && (
                    <div className="space-y-4 mt-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-900 mb-2">
                          Installation Booking Email (Triggered - Post Delivery)
                        </h3>
                        <p className="text-sm text-green-800 mb-4">
                          Sends an email with a booking link for the customer to schedule
                          their installation. The link will direct them to the booking
                          flow.
                        </p>
                        <Button
                          onClick={() => {
                            setShowPreview(!showPreview);
                            setPreviewKey((prev) => prev + 1);
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          {showPreview ? (
                            <>
                              <FaEyeSlash className="mr-2 h-4 w-4" />
                              Hide Preview
                            </>
                          ) : (
                            <>
                              <FaEye className="mr-2 h-4 w-4" />
                              Show Preview
                            </>
                          )}
                        </Button>
                      </div>
                      {showPreview && emailPreviewHtml && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden mt-4">
                          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                            <p className="text-sm font-medium text-gray-700">
                              <strong>To:</strong> {adminEmail}
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                              <strong>Subject:</strong> {getEmailSubject()}
                            </p>
                          </div>
                          <div className="bg-white" style={{ height: "600px", overflow: "auto" }}>
                            <iframe
                              key={`preview-delivery-${previewKey}`}
                              srcDoc={emailPreviewHtml}
                              className="w-full h-full border-0"
                              title="Email Preview"
                            />
                          </div>
                        </div>
                      )}
                      <Button
                        onClick={handleSendDeliveryEmail}
                        disabled={adminLoading}
                        className="w-full"
                      >
                        <FaTruck className="mr-2 h-4 w-4" />
                        {adminLoading ? "Sending..." : "Send Delivery & Booking Email"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="installer" className="space-y-6 mt-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Installer Email Simulation</h2>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="installerOrderId">BigCommerce Order ID (Randomised for testing)</Label>
                    <Input
                      id="installerOrderId"
                      type="text"
                      placeholder="e.g., 12345"
                      value={adminOrderId}
                      onChange={(e) => setAdminOrderId(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="installerCustomerEmail">Customer Email</Label>
                    <Input
                      id="installerCustomerEmail"
                      type="email"
                      placeholder="customer@example.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="installerCustomerName">Customer Name</Label>
                    <Input
                      id="installerCustomerName"
                      type="text"
                      placeholder="John Doe"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="installerCustomerPhone">Customer Phone</Label>
                    <Input
                      id="installerCustomerPhone"
                      type="tel"
                      placeholder="+64 21 123 4567"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="installerEmail">Installer Email (Recipient)</Label>
                    <Input
                      id="installerEmail"
                      type="email"
                      placeholder="installer@example.com"
                      value={installerEmail}
                      onChange={(e) => setInstallerEmail(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This email is automatically sent to the installer when a booking is completed.
                    </p>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">
                    Installer Notification Email
                  </h3>
                  <p className="text-sm text-purple-800 mb-4">
                    Simulates the email sent to the installer when a customer completes
                    their booking. This email contains customer details and order information.
                  </p>
                  <Button
                    onClick={() => {
                      setShowPreview(!showPreview);
                      setPreviewKey((prev) => prev + 1);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    {showPreview ? (
                      <>
                        <FaEyeSlash className="mr-2 h-4 w-4" />
                        Hide Preview
                      </>
                    ) : (
                      <>
                        <FaEye className="mr-2 h-4 w-4" />
                        Show Preview
                      </>
                    )}
                  </Button>
                </div>
                {showPreview && installerEmailPreviewHtml && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden mt-4">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-700">
                        <strong>To:</strong> {installerEmail}
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        <strong>Subject:</strong> {getInstallerNotificationEmailSubject(adminOrderId)}
                      </p>
                    </div>
                    <div className="bg-white" style={{ height: "600px", overflow: "auto" }}>
                      <iframe
                        key={`preview-installer-${previewKey}`}
                        srcDoc={installerEmailPreviewHtml}
                        className="w-full h-full border-0"
                        title="Email Preview"
                      />
                    </div>
                  </div>
                )}
                <Button
                  onClick={handleSendInstallerEmail}
                  disabled={adminLoading}
                  className="w-full"
                >
                  <FaUserCog className="mr-2 h-4 w-4" />
                  {adminLoading ? "Sending..." : "Send Installer Notification Email"}
                </Button>
              </div>
            </div>
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
