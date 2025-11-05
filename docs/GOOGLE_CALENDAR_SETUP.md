# Google Calendar Booking Integration Setup

This guide explains how to set up Google Calendar API integration for the booking system.

## Prerequisites

- A Google account with access to Google Cloud Console
- A Google Calendar that you want to use for bookings

## Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project name for later reference

### 2. Enable Google Calendar API

1. Navigate to **APIs & Services** > **Library**
2. Search for "Google Calendar API"
3. Click on it and click **Enable**

### 3. Create Service Account

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **Service Account**
3. Fill in the details:
   - **Service account name**: `calendar-booking-service` (or any name you prefer)
   - **Service account ID**: Will be auto-generated
   - **Description**: Optional description
4. Click **Create and Continue**
5. For **Grant this service account access to project**:
   - Select role: **Editor** (or create a custom role with minimal permissions)
6. Click **Continue** then **Done**

### 4. Generate JSON Key

1. Click on the service account you just created
2. Go to the **Keys** tab
3. Click **Add Key** > **Create new key**
4. Choose **JSON** format
5. Click **Create**
6. The JSON file will download automatically - **save this file securely** (you'll need it)

### 5. Extract Credentials from JSON

Open the downloaded JSON file. You'll need these values:

- `client_email`: The service account email (e.g., `calendar-booking-service@your-project.iam.gserviceaccount.com`)
- `private_key`: The private key (starts with `-----BEGIN PRIVATE KEY-----`)

### 6. Share Calendar with Service Account ⚠️ CRITICAL STEP

**This step is essential - without it, you'll get a "writer access" error.**

1. Open your Google Calendar in a web browser
2. On the left sidebar, find your calendar (or the calendar you want to use)
3. Click the **three dots (⋮)** next to your calendar name
4. Select **Settings and sharing**
5. Scroll down to the **Share with specific people** section
6. Click **Add people**
7. Enter the service account email address (the `client_email` from your JSON file)
   - Example: `calendar-booking-service@your-project.iam.gserviceaccount.com`
8. In the dropdown, select **Make changes to events** (NOT "See all event details")
9. Click **Send** (or **Add** if there's no send button)
10. **Important**: You may need to uncheck "Notify people" if you don't want to send an email

**Verification**: After adding, you should see the service account email listed under "Share with specific people" with "Make changes to events" permission.

**Common Issues:**
- If you get "writer access" error, double-check the service account email is correct
- Make sure you selected "Make changes to events" (not just "See all event details")
- Wait a few moments after adding for permissions to propagate

### 7. Get Your Calendar ID

1. Go to your Google Calendar settings
2. Scroll to **Integrate calendar** section
3. Find **Calendar ID** - it's usually your email address (e.g., `your-email@gmail.com`)
4. Alternatively, for a shared calendar, the ID might be in a different format

### 8. Configure Environment Variables

Create or update your `.env.local` file in the project root:

```bash
# Google Calendar Service Account Email
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com

# Google Service Account Private Key (keep the \n characters as-is)
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"

# Your Google Calendar ID
GOOGLE_CALENDAR_ID=your-calendar-id@gmail.com
```

**Important Notes:**

1. The `GOOGLE_PRIVATE_KEY` should include the entire key including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines
2. Keep the `\n` characters in the private key - they represent newlines
3. Wrap the private key value in quotes if it contains special characters
4. Never commit `.env.local` to version control

### 9. Verify Setup

1. Start your development server: `npm run dev`
2. Navigate to your website
3. Click on a "Schedule a discovery call" button
4. Try booking an appointment
5. Check your Google Calendar to verify the event was created

## Troubleshooting

### Error: "You need to have writer access to this calendar"

**This is the most common error.** It means the service account doesn't have write permissions.

**Solution:**
1. Go to Google Calendar > Settings > Share with specific people
2. Find your service account email in the list
3. If it's not there, add it following Step 6 above
4. If it's there, make sure the permission is set to **"Make changes to events"** (not "See all event details")
5. Wait 1-2 minutes for permissions to propagate
6. Try booking again

**Still not working?**
- Double-check the service account email in `.env.local` matches the one you added to the calendar
- Try removing and re-adding the service account to the calendar
- Make sure you're sharing the correct calendar (the one matching `GOOGLE_CALENDAR_ID`)

### Error: "Calendar service is not properly configured"

- Verify all environment variables are set correctly
- Check that the private key includes newlines (`\n`)
- Ensure the service account email is correct

### Error: "Failed to create calendar event"

- Verify the service account has been granted access to your calendar (see above)
- Check that the calendar ID is correct
- Ensure the Calendar API is enabled in Google Cloud Console

### Events not appearing in calendar

- Verify calendar sharing settings
- Check that the service account has "Make changes to events" permission
- Ensure you're checking the correct calendar

## Security Best Practices

1. **Never commit credentials**: Always keep `.env.local` in `.gitignore`
2. **Use environment variables**: Never hardcode credentials in source code
3. **Limit permissions**: Use the minimum required permissions for the service account
4. **Rotate keys**: Regularly rotate service account keys if compromised
5. **Monitor usage**: Check Google Cloud Console for unusual API usage

## Production Deployment

For production (e.g., Vercel, Netlify):

1. Add the same environment variables to your hosting platform's environment settings
2. Ensure the private key is properly formatted (with `\n` for newlines)
3. Test the booking flow in production before going live

## Support

For issues with Google Calendar API setup, refer to:
- [Google Calendar API Documentation](https://developers.google.com/calendar/api/guides/overview)
- [Service Accounts Documentation](https://cloud.google.com/iam/docs/service-accounts)

