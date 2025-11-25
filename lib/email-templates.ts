/**
 * Email templates for Trade Depot installation scheduling
 * 
 * These templates are used both for sending emails via the API
 * and for previewing emails in the admin interface.
 */

export interface PurchaseEmailParams {
  customerName: string;
  orderId: string;
}

export interface DeliveryEmailParams {
  customerName: string;
  orderId: string;
  bookingLink: string;
}

export interface InstallerNotificationEmailParams {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate?: string;
  bookingTime?: string;
}

/**
 * Generates the HTML for the post-purchase email
 */
export function generatePurchaseEmailHtml(params: PurchaseEmailParams): string {
  const { customerName } = params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const headerImageUrl = `${siteUrl}/bitmap/trade-depot-email-header.png`;
  
  return `
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
            background-color: #1e1eaa;
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
        <img src="${headerImageUrl}" alt="Trade Depot" class="header-image" />
        
        <p>Hi ${customerName},</p>
        
        <p>Thanks for choosing Trade Depot! We see that you have selected installation for your new items.</p>
        
        <p>To ensure everything goes smoothly, please note that delivery and installation happen separately. The delivery driver will drop off your goods, and you will need to book the installation for a later date. Keep an eye on your inbox—we'll email you as soon as your order is delivered.</p>
        
        <p><strong>A quick tip to avoid extra costs:</strong></p>
        
        <p>Please unpack and inspect your items as soon as they arrive. If the installer arrives and finds damaged goods, they won't be able to do the work, and a callout fee will apply. We definitely want to avoid that, so please let us know immediately if you spot any issues!</p>
        
        <div class="footer">
          <p>Best regards,<br/>The Trade Depot Team</p>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generates the HTML for the delivery & booking email
 */
export function generateDeliveryEmailHtml(params: DeliveryEmailParams): string {
  const { customerName, bookingLink } = params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const headerImageUrl = `${siteUrl}/bitmap/trade-depot-email-header.png`;
  
  return `
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
            background-color: #1e1eaa;
            color: #FFFFFF;
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
        <img src="${headerImageUrl}" alt="Trade Depot" class="header-image" />
        
        <p>Hi ${customerName},</p>
        
        <p>Great news! Your items have been dispatched and are currently on their way to you.</p>
        
        <p>Since you included installation with your order, we are now ready to get that organised for you.</p>
        
        <h3>Your Next Steps:</h3>
        
        <p><strong>Receive & Inspect:</strong> Once the driver drops off your order, please give everything a quick check to make sure it arrived safely and damage-free. Let us know if there are any problems <a href="https://support.tradedepot.co.nz/support/tickets/new" target="_blank">here</a>.</p>
        
        <p><strong>Book your slot:</strong> Click the link below to choose a time and date that works best for our installer to come by.</p>
        
        <a href="${bookingLink}" class="button" target="_blank">Book Installation Now</a>
        
        <div class="footer">
          <p>Thanks again for shopping with us!<br/><br/>The Trade Depot Team</p>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generates the HTML for the installer notification email
 */
export function generateInstallerNotificationEmailHtml(params: InstallerNotificationEmailParams): string {
  const { orderId, customerName, customerEmail, customerPhone, bookingDate, bookingTime } = params;
  
  return `
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
            color: #1e1eaa;
            border-bottom: 3px solid #1e1eaa;
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
          ${bookingDate ? `<li><strong>Booking Date:</strong> ${bookingDate}</li>` : ''}
          ${bookingTime ? `<li><strong>Booking Time:</strong> ${bookingTime}</li>` : ''}
        </ul>
        
        ${bookingDate && bookingTime 
          ? `<p><strong>Scheduled for:</strong> ${bookingDate} at ${bookingTime}</p>`
          : '<p>Please check your <a href="https://calendly.com/app/scheduled_events/user/me" target="_blank">Calendly dashboard</a> for the specific time slot.</p>'
        }
        
        <div class="footer">
          <p>This is an automated notification from the Trade Depot Installation Booking System.</p>
        </div>
      </body>
    </html>
  `;
}

/**
 * Email subject generators
 */
export function getPurchaseEmailSubject(): string {
  return "Important Information regarding your Installation";
}

export function getDeliveryEmailSubject(orderId?: string): string {
  return "Your Trade Depot delivery is on its way! 🚚 (+ Book your installation)";
}

export function getInstallerNotificationEmailSubject(orderId: string): string {
  return `NEW BOOKING: Order #${orderId}`;
}

