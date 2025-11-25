import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  generatePurchaseEmailHtml,
  generateDeliveryEmailHtml,
  generateInstallerNotificationEmailHtml,
  getPurchaseEmailSubject,
  getDeliveryEmailSubject,
  getInstallerNotificationEmailSubject,
} from "@/lib/email-templates";

// Validate RESEND_API_KEY is set
if (!process.env.RESEND_API_KEY) {
  console.error("[Send Email API] RESEND_API_KEY is not set in environment variables");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Check if RESEND_API_KEY is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("[Send Email API] RESEND_API_KEY missing");
      return NextResponse.json(
        {
          error: "Email service not configured",
          details: "RESEND_API_KEY environment variable is not set",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log("[Send Email API] Received request:", {
      type: body.type,
      orderId: body.orderId,
      customerEmail: body.customerEmail,
    });
    const {
      type,
      orderId,
      customerEmail,
      customerName,
      bookingLink,
      customerPhone,
      installerEmail,
      bookingDate,
      bookingTime,
    } = body;

    // Validate required fields based on type
    if (!type) {
      return NextResponse.json(
        { error: "Email type is required" },
        { status: 400 }
      );
    }

    let emailData;

    switch (type) {
      case "purchase":
        // Post-Purchase Email (Informational, no link)
        if (!customerEmail || !customerName || !orderId) {
          return NextResponse.json(
            { error: "Missing required fields for purchase email" },
            { status: 400 }
          );
        }

        emailData = {
          from: process.env.RESEND_FROM_EMAIL || "michael@bizbo.co.nz",
          to: customerEmail,
          subject: getPurchaseEmailSubject(),
          html: generatePurchaseEmailHtml({
            customerName,
            orderId,
          }),
        };
        break;

      case "delivery":
        // Delivery & Booking Email (Contains booking link)
        if (!customerEmail || !customerName || !orderId || !bookingLink) {
          return NextResponse.json(
            { error: "Missing required fields for delivery email" },
            { status: 400 }
          );
        }

        emailData = {
          from: process.env.RESEND_FROM_EMAIL || "michael@bizbo.co.nz",
          to: customerEmail,
          subject: getDeliveryEmailSubject(orderId),
          html: generateDeliveryEmailHtml({
            customerName,
            orderId,
            bookingLink,
          }),
        };
        break;

      case "installer_notification":
        // Installer Notification Email
        if (!orderId || !customerName || !customerEmail || !customerPhone || !installerEmail) {
          return NextResponse.json(
            { error: "Missing required fields for installer notification" },
            { status: 400 }
          );
        }

        emailData = {
          from: process.env.RESEND_FROM_EMAIL || "michael@bizbo.co.nz",
          to: installerEmail,
          subject: getInstallerNotificationEmailSubject(orderId),
          html: generateInstallerNotificationEmailHtml({
            orderId,
            customerName,
            customerEmail,
            customerPhone,
            bookingDate,
            bookingTime,
          }),
        };
        break;

      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        );
    }

    // Send email via Resend
    console.log("[Send Email API] Sending email via Resend:", {
      type,
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject,
      usingEnvFromEmail: !!process.env.RESEND_FROM_EMAIL,
    });

    try {
      const data = await resend.emails.send(emailData);
      
      // Log full response for debugging
      console.log("[Send Email API] Full Resend response:", JSON.stringify(data, null, 2));
      
      // Check if email was actually sent (Resend returns { data: { id: "..." }, error: null } on success)
      if (!data || (data.error !== null && data.error !== undefined)) {
        console.error("[Send Email API] Resend returned error:", data);
        return NextResponse.json(
          {
            error: "Failed to send email via Resend",
            details: data?.error?.message || "Resend API returned an error",
            resendResponse: data,
          },
          { status: 500 }
        );
      }
      
      // Check if ID is missing (Resend nests the ID in data.data.id)
      const emailId = data.data?.id;
      if (!emailId) {
        console.warn("[Send Email API] Resend response missing ID - possible domain verification issue:", data);
        return NextResponse.json(
          {
            error: "Email may not have been sent",
            details: "Resend API did not return an email ID. This usually means the 'from' domain is not verified in Resend. Please verify 'michael@bizbo.co.nz' domain in your Resend dashboard.",
            resendResponse: data,
          },
          { status: 500 }
        );
      }
      
      console.log("[Send Email API] Email sent successfully:", {
        type,
        orderId,
        resendId: emailId,
      });
      return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (resendError: unknown) {
      // Handle Resend-specific errors
      console.error("[Send Email API] Resend API error:", resendError);
      
      let errorMessage = "Failed to send email via Resend";
      let errorDetails = "Unknown Resend error";

      if (resendError && typeof resendError === "object") {
        // Resend errors typically have a message property
        if ("message" in resendError && typeof resendError.message === "string") {
          errorDetails = resendError.message;
        }
        // Some Resend errors have nested error objects
        if ("error" in resendError && resendError.error && typeof resendError.error === "object") {
          if ("message" in resendError.error && typeof resendError.error.message === "string") {
            errorDetails = resendError.error.message;
          }
        }
      } else if (resendError instanceof Error) {
        errorDetails = resendError.message;
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: errorDetails,
          type: "resend_api_error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[Send Email API] Unexpected error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: errorMessage,
        type: "unexpected_error",
      },
      { status: 500 }
    );
  }
}
