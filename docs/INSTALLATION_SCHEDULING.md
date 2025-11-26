# Installation Scheduling System - Documentation

## Overview

This system provides a two-sided installation booking application with:

- **Admin View**: Send post-purchase and delivery emails with booking links
- **Customer View**: Multi-step booking flow with Calendly integration

## Architecture

### Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Email Service**: Resend SDK
- **Scheduling**: react-calendly
- **Styling**: Tailwind CSS with Shadcn UI
- **Icons**: react-icons/fa
- **State Management**: useSearchParams, useState

### Files Created

1. **`components/InstallationBookingOverlay.tsx`** - Main overlay component
2. **`app/api/send-email/route.ts`** - Email API endpoint

## Environment Variables

Add these to your `.env.local` file:

```env
# Resend API Key (for sending emails)
RESEND_API_KEY=your_resend_api_key_here

# Calendly URL (for the booking widget)
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-calendly-link

# Calendly API Token (for fetching installer email from events)
CALENDLY_API_TOKEN=your_calendly_api_token_here

# Installer Email (fallback if Calendly API fails)
INSTALLER_EMAIL=installer@example.com
```

### Getting Your API Keys

**Resend API Key:**

1. Sign up at [resend.com](https://resend.com)
2. Navigate to API Keys section
3. Create a new API key
4. Add to `.env.local`

**Calendly URL:**

1. Log into your Calendly account
2. Go to your event type
3. Copy the scheduling link
4. Add to `.env.local`

**Calendly API Token:**

1. Log into your Calendly account
2. Go to [Integrations > API & Webhooks](https://calendly.com/integrations/api_webhooks)
3. Click "Personal Access Tokens"
4. Create a new token with appropriate permissions
5. Copy the token and add to `.env.local` as `CALENDLY_API_TOKEN`

**Installer Email (Optional Fallback):**

- Set `INSTALLER_EMAIL` to the default installer email address
- This will be used if Calendly API fails or is not configured
- If not set, the system will return an error when Calendly API is unavailable

## Usage

### Admin View

Access the admin panel by navigating to:

```
http://localhost:3000?mode=admin
```

**Features:**

- Input BigCommerce Order ID, Customer Email, and Customer Name
- Two email types:
  1. **Post-Purchase Email**: Informational email (no booking link)
  2. **Delivery & Booking Email**: Contains booking link for customer

**Workflow:**

1. Fill in customer details
2. Select email type (tabs)
3. Click send button
4. Confirmation message appears

### Customer View

Customers access the booking flow via:

```
http://localhost:3000?mode=booking&orderId=12345
```

**Multi-Step Flow:**

**Step 1: The Gate**

- Confirms customer has received delivery
- Button: "Yes, I have received my delivery"

**Step 2: Customer Details**

- Collects: First Name, Last Name, Email, Phone
- All fields required
- Validation on submit

**Step 3: Scheduler**

- Calendly inline widget
- Pre-filled with customer details
- UTM tracking with order ID
- Auto-detects when booking is complete

**Step 4: Success**

- Confirmation screen
- Next steps information
- Close button

## Email Templates

### 1. Post-Purchase Email

**Trigger:** Admin sends via "Send Post-Purchase Email" button

**Subject:** "Important Information regarding your Installation"

**Content:**

- Trade Depot header image
- Installation information
- Damage inspection instructions
- Download order button (placeholder)

**Variables:**

- `customerName`
- `orderId` (in subject)

### 2. Delivery & Booking Email

**Trigger:** Admin sends via "Send Delivery & Booking Email" button

**Subject:** "Schedule your installation for Order #[orderId]"

**Content:**

- Trade Depot header image
- Delivery notification
- Next steps section
- "Book Installation Now" button with unique link

**Variables:**

- `customerName`
- `orderId`
- `bookingLink` (auto-generated)

### 3. Installer Notification Email

**Trigger:** Customer completes Calendly booking

**To:** Automatically extracted from Calendly event host/organizer (or fallback to `INSTALLER_EMAIL`)

**Subject:** "NEW BOOKING: Order #[orderId]"

**Content:**

- Booking confirmation
- Customer details (name, email, phone)
- Order ID
- Booking date and time (if available)
- Link to Calendly dashboard

**Variables:**

- `orderId`
- `customerName`
- `customerEmail`
- `customerPhone`
- `bookingDate` (optional)
- `bookingTime` (optional)
- `installerEmail` (automatically fetched from Calendly event)

## API Endpoint

### POST `/api/send-email`

**Request Body:**

```typescript
// Post-Purchase Email
{
  type: 'purchase',
  orderId: string,
  customerEmail: string,
  customerName: string
}

// Delivery & Booking Email
{
  type: 'delivery',
  orderId: string,
  customerEmail: string,
  customerName: string,
  bookingLink: string
}

// Installer Notification
{
  type: 'installer_notification',
  orderId: string,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  installerEmail: string,  // Required - fetched from Calendly event
  bookingDate?: string,    // Optional - DD/MM/YYYY format
  bookingTime?: string     // Optional - HH:MM format
}
```

**Response:**

```typescript
// Success
{
  success: true,
  data: ResendResponse
}

// Error
{
  error: string,
  details?: string
}
```

## Component Props & State

### InstallationBookingOverlay

**URL Parameters:**

- `mode`: 'admin' | 'booking'
- `orderId`: string (required for booking mode)

**Admin State:**

```typescript
adminOrderId: string;
adminEmail: string;
adminName: string;
adminLoading: boolean;
adminMessage: string;
```

**Customer State:**

```typescript
bookingStep: "gate" | "details" | "scheduler" | "success";
customerDetails: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
customerLoading: boolean;
```

## Calendly Integration

### Event Listener

The component listens for Calendly's `event_scheduled` message:

```typescript
window.addEventListener("message", (e) => {
  if (e.data.event === "calendly.event_scheduled") {
    // Extract event URI from payload
    // Fetch installer email from Calendly API
    // Trigger installer notification email
    // Move to success step
  }
});
```

### Installer Email Extraction

When a booking is completed, the system:

1. Extracts the event URI from the Calendly event payload (`eventData.payload.event.uri`)
2. Calls `/api/calendly/get-installer-email` with the event URI
3. The API endpoint fetches event details from Calendly API
4. Extracts the host/organizer email from `event_memberships`
5. Returns the installer email to the client
6. Includes the installer email in the notification email request

**Fallback Behaviour:**

- If Calendly API fails or is not configured, falls back to `INSTALLER_EMAIL` environment variable
- If no fallback is available, the email request will fail with a clear error message

### Prefill Configuration

Customer details are automatically prefilled:

```typescript
prefill={{
  name: `${firstName} ${lastName}`,
  email: email,
  customAnswers: {
    a1: phone  // Custom field for phone
  }
}}
```

### UTM Tracking

Order ID is tracked via UTM parameters:

```typescript
utm={{
  utmContent: orderId
}}
```

## Calendly API Integration

### API Endpoint: `/api/calendly/get-installer-email`

**Purpose:** Fetches the installer/host email from a Calendly scheduled event.

**Method:** POST

**Request Body:**
```typescript
{
  eventUri: string  // Calendly event URI (e.g., "https://api.calendly.com/scheduled_events/ABC123")
}
```

**Response:**
```typescript
// Success
{
  installerEmail: string,
  source: 'calendly' | 'fallback'
}

// Error
{
  error: string,
  details?: string
}
```

**Implementation Details:**

- Uses Calendly Personal Access Token for authentication
- Fetches event details from `/scheduled_events/{uuid}` endpoint
- Extracts user URI from `event_memberships[0].user`
- Fetches user details from `/users/{uuid}` endpoint
- Returns user email address
- Falls back to `INSTALLER_EMAIL` environment variable if API fails

**Files:**
- `lib/calendly.ts` - Calendly API integration functions
- `app/api/calendly/get-installer-email/route.ts` - API endpoint

## Styling

### Design Principles

- Shadcn UI component library
- Clean, professional aesthetic
- Clear visual hierarchy
- Responsive design
- Accessible forms

### Color Scheme

- Primary: Blue (#0070f3)
- Success: Green
- Error: Red
- Background: White
- Text: Gray scale

## Testing

### Test Admin View

1. Navigate to `/?mode=admin`
2. Fill in test data:
   - Order ID: `TEST-001`
   - Email: Your test email
   - Name: `Test Customer`
3. Send both email types
4. Check inbox for emails

### Test Customer View

1. Navigate to `/?mode=booking&orderId=TEST-001`
2. Click "Yes, I have received my delivery"
3. Fill in customer details
4. Proceed to scheduler
5. Complete Calendly booking
6. Verify success screen
7. Check michael@bizbo.co.nz for notification

## Troubleshooting

### Emails Not Sending

**Check:**

1. `RESEND_API_KEY` is set in `.env.local`
2. Resend account is active
3. Domain is verified in Resend (for production)
4. Check browser console for errors
5. Check API response in Network tab

### Calendly Not Loading

**Check:**

1. `NEXT_PUBLIC_CALENDLY_URL` is set correctly
2. URL is publicly accessible
3. Calendly account is active
4. Check browser console for errors

### Installer Email Not Being Sent

**Check:**

1. `CALENDLY_API_TOKEN` is set in `.env.local`
2. Calendly API token has correct permissions
3. `INSTALLER_EMAIL` is set as fallback (optional but recommended)
4. Check browser console for API errors
5. Check server logs for Calendly API errors
6. Verify event URI is being extracted from Calendly payload
7. Test `/api/calendly/get-installer-email` endpoint directly

### Overlay Not Appearing

**Check:**

1. URL has `?mode=admin` or `?mode=booking&orderId=XXX`
2. Component is imported in page
3. No z-index conflicts
4. Check browser console for errors

## Production Deployment

### Checklist

- [ ] Set `RESEND_API_KEY` in production environment
- [ ] Set `NEXT_PUBLIC_CALENDLY_URL` in production environment
- [ ] Set `CALENDLY_API_TOKEN` in production environment
- [ ] Set `INSTALLER_EMAIL` in production environment (fallback)
- [ ] Verify Resend domain in production
- [ ] Update email sender domain from `tradedepot.co.nz`
- [ ] Test all email types in production
- [ ] Test complete booking flow
- [ ] Verify installer email is being fetched correctly
- [ ] Update placeholder header images
- [ ] Configure Calendly custom fields
- [ ] Set up email monitoring/logging

### Email Domain Setup

For production emails from your domain:

1. Add domain in Resend dashboard
2. Add DNS records (SPF, DKIM, DMARC)
3. Verify domain
4. Update `from` addresses in API route

### Monitoring

Consider adding:

- Email delivery tracking
- Error logging (Sentry, LogRocket)
- Analytics for booking completion rate
- Admin notification for failed emails

## Future Enhancements

### Potential Features

- Email templates in database
- Admin dashboard for viewing bookings
- Rescheduling capability
- SMS notifications
- Multiple installer support
- Booking history
- Customer portal
- Integration with BigCommerce API
- Automated email triggers based on order status

## Support

For issues or questions:

- Check browser console for errors
- Review API responses in Network tab
- Verify environment variables
- Check Resend dashboard for email logs
- Review Calendly event logs

## License

Proprietary - Trade Depot Installation Scheduling System
