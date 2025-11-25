import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

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
          subject: "Important Information regarding your Installation",
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                  }
                  .header-image {
                    width: 100%;
                    max-width: 600px;
                    height: auto;
                    margin-bottom: 30px;
                  }
                  .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #0070f3;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    margin: 20px 0;
                    font-weight: 600;
                  }
                  .footer {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    color: #666;
                    font-size: 14px;
                  }
                  strong {
                    color: #000;
                  }
                </style>
              </head>
              <body>
                <img src="https://placehold.co/600x100?text=Trade+Depot+Header" alt="Trade Depot" class="header-image" />
                
                <p>Dear ${customerName},</p>
                
                <p>With your recent Trade Depot purchase, you have selected one or more items to be installed at your address. Please note that installations are not undertaken at the time of delivery and you will need to book the installation separately.</p>
                
                <p><strong>We'll send out an email once your order has been delivered.</strong></p>
                
                <p>Once you have received your items, please inspect them thoroughly for any damages and notify us immediately. If our installer is unable to install your item due to damages, we will on-charge the callout fee and you will need to re-book the installation.</p>
                
                <a href="#" class="button">Download Order</a>
                
                <div class="footer">
                  <p>Thank you,<br/>The Trade Depot Team.</p>
                </div>
              </body>
            </html>
          `,
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
          subject: `Schedule your installation for Order #${orderId}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                  }
                  .header-image {
                    width: 100%;
                    max-width: 600px;
                    height: auto;
                    margin-bottom: 30px;
                  }
                  h3 {
                    color: #000;
                    margin-top: 30px;
                  }
                  .button {
                    display: inline-block;
                    padding: 14px 28px;
                    background-color: #0070f3;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    margin: 20px 0;
                    font-weight: 600;
                    font-size: 16px;
                  }
                  .button:hover {
                    background-color: #0051cc;
                  }
                  .footer {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    color: #666;
                    font-size: 14px;
                  }
                </style>
              </head>
              <body>
                <img src="https://placehold.co/600x100?text=Trade+Depot+Header" alt="Trade Depot" class="header-image" />
                
                <p>Dear ${customerName},</p>
                
                <p>Your items have been sent for delivery. Since you purchased installation services, we will need to schedule a suitable time and date for installation.</p>
                
                <h3>Next steps:</h3>
                
                <p>Follow the link to book a suitable time and date for your installer to come:</p>
                
                <a href="${bookingLink}" class="button">Book Installation Now</a>
                
                <div class="footer">
                  <p>Thank you,<br/>The Trade Depot Team.</p>
                </div>
              </body>
            </html>
          `,
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
          subject: `NEW BOOKING: Order #${orderId}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                  }
                  h1 {
                    color: #0070f3;
                    border-bottom: 3px solid #0070f3;
                    padding-bottom: 10px;
                  }
                  ul {
                    list-style: none;
                    padding: 0;
                    background-color: #f5f5f5;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                  }
                  li {
                    padding: 8px 0;
                    border-bottom: 1px solid #ddd;
                  }
                  li:last-child {
                    border-bottom: none;
                  }
                  strong {
                    color: #000;
                    display: inline-block;
                    min-width: 150px;
                  }
                  .footer {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    color: #666;
                    font-size: 14px;
                  }
                </style>
              </head>
              <body>
                <h1>New Installation Scheduled</h1>
                
                <p>The customer has completed the Calendly booking flow.</p>
                
                <ul>
                  <li><strong>Order ID:</strong> ${orderId}</li>
                  <li><strong>Customer Name:</strong> ${customerName}</li>
                  <li><strong>Email:</strong> ${customerEmail}</li>
                  <li><strong>Phone:</strong> ${customerPhone}</li>
                </ul>
                
                <p>Please check your Calendly dashboard for the specific time slot.</p>
                
                <div class="footer">
                  <p>This is an automated notification from the Trade Depot Installation Booking System.</p>
                </div>
              </body>
            </html>
          `,
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
