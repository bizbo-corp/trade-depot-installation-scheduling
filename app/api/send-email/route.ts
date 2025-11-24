import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      orderId,
      customerEmail,
      customerName,
      bookingLink,
      customerPhone,
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
          from: "Trade Depot <noreply@tradedepot.co.nz>",
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
          from: "Trade Depot <noreply@tradedepot.co.nz>",
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
        if (!orderId || !customerName || !customerEmail || !customerPhone) {
          return NextResponse.json(
            { error: "Missing required fields for installer notification" },
            { status: 400 }
          );
        }

        emailData = {
          from: "Trade Depot Bookings <noreply@tradedepot.co.nz>",
          to: "michael@bizbo.co.nz",
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
    const data = await resend.emails.send(emailData);

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
