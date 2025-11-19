# Google Workspace Admin Setup for Calendar Booking

If you're a Google Workspace admin and the "Make changes to events" option is grayed out for service accounts, use one of these two options.

## Option 1: Enable External Sharing (Recommended - Simplest)

This allows your calendar to be shared with service accounts.

### Steps:

1. **Go to Google Admin Console**
   - Visit [admin.google.com](https://admin.google.com)
   - Sign in with your admin account

2. **Navigate to Calendar Settings**
   - In the left sidebar, go to **Apps** > **Google Workspace** > **Calendar**
   - Or search for "Calendar" in the admin console

3. **Enable External Sharing**
   - Click on **Sharing settings**
   - Find **External sharing options for primary calendars**
   - Enable: **"Allow users to share their calendars with people outside of [your domain]"**
   - Enable: **"Allow users to share calendar information with people outside of [your domain]"**
   - Scroll down and click **Save**

4. **Wait 5-10 minutes** for changes to propagate

5. **Go back to Google Calendar**
   - Go to your calendar settings
   - Try changing the service account permission to "Make changes to events" again
   - It should now be clickable

## Option 2: Domain-Wide Delegation (Advanced)

This gives the service account permission to act on behalf of users in your domain.

### Steps:

1. **Enable Domain-Wide Delegation in Service Account**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to **IAM & Admin** > **Service Accounts**
   - Click on your service account (`calendar-booking-service`)
   - Go to the **"Advanced settings"** tab (or look for "Domain-wide delegation")
   - Check **"Enable Google Workspace Domain-wide Delegation"**
   - Note the **Client ID** that appears (you'll need this)

2. **Add Client ID to Google Workspace Admin**
   - Go to [admin.google.com](https://admin.google.com)
   - Navigate to **Security** > **API Controls** > **Domain-wide Delegation**
   - Click **Add new**
   - Enter the **Client ID** from step 1
   - In **OAuth Scopes**, add:
     ```
     https://www.googleapis.com/auth/calendar
     https://www.googleapis.com/auth/calendar.events
     ```
   - Click **Authorize**

3. **Update Your Code (if needed)**
   - Domain-wide delegation works differently - you may need to specify which user's calendar to access
   - The service account can now act "on behalf of" users in your domain

4. **Restart your application** and test again

## Which Option to Choose?

- **Option 1** is simpler and recommended if you just want the service account to manage one calendar
- **Option 2** is better if you need the service account to manage multiple users' calendars or need more control

## After Enabling

Once either option is enabled:
1. Go back to Google Calendar
2. Open calendar settings
3. Find the service account in "Share with specific people"
4. Change permission from "See only free/busy" to **"Make changes to events"**
5. Save and test your booking form

## Troubleshooting

If Option 1 doesn't work:
- Check that you saved the settings in Admin Console
- Wait 10-15 minutes for changes to fully propagate
- Try logging out and back into Google Calendar
- Check if there are any other sharing restrictions in your Workspace settings

If Option 2 doesn't work:
- Verify the Client ID is correct
- Check that the OAuth scopes are exactly as shown above
- Ensure the service account has "Enable Google Workspace Domain-wide Delegation" checked














