import { google } from 'googleapis';
import { format, parse, getDay } from 'date-fns';

const NZT_TIMEZONE = 'Pacific/Auckland';

interface CreateEventParams {
  date: string; // ISO date string (YYYY-MM-DD)
  timeSlot: '10:30' | '11:00' | '11:30';
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

/**
 * Validates that the date is a weekday (Monday-Friday)
 */
export function isWeekday(date: Date): boolean {
  const day = getDay(date);
  // getDay returns 0 for Sunday, 6 for Saturday
  // Monday = 1, Friday = 5
  return day >= 1 && day <= 5;
}

/**
 * Validates that the date string represents a weekday
 */
export function validateWeekday(dateString: string): boolean {
  try {
    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    return isWeekday(date);
  } catch {
    return false;
  }
}

/**
 * Normalizes the private key by handling various line break formats
 */
function normalizePrivateKey(key: string): string {
  // Remove quotes if present (both single and double)
  let normalized = key.trim();
  
  // Remove surrounding quotes
  if ((normalized.startsWith('"') && normalized.endsWith('"')) ||
      (normalized.startsWith("'") && normalized.endsWith("'"))) {
    normalized = normalized.slice(1, -1);
  }
  
  // Handle escaped newlines (\\n) - this is the most common format in env vars
  normalized = normalized.replace(/\\n/g, '\n');
  
  // If there are no newlines at all but we have BEGIN/END markers, the key might be on one line
  // This shouldn't happen with proper Google keys, but handle it
  if (!normalized.includes('\n') && normalized.includes('BEGIN') && normalized.includes('END')) {
    // Try to insert newlines after BEGIN and before END
    normalized = normalized.replace(
      /(-----BEGIN[^-]+-----)([^-]+)(-----END[^-]+-----)/,
      '$1\n$2\n$3\n'
    );
  }
  
  // Ensure the key has proper BEGIN marker
  if (!normalized.includes('-----BEGIN')) {
    throw new Error('Private key must include -----BEGIN PRIVATE KEY----- marker');
  }
  
  // Ensure it ends with a newline for proper formatting
  if (!normalized.endsWith('\n')) {
    normalized += '\n';
  }
  
  return normalized;
}

/**
 * Creates an authenticated Google Calendar client using Service Account
 */
async function getCalendarClient() {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!serviceAccountEmail || !rawPrivateKey) {
    throw new Error('Google Service Account credentials are not configured');
  }

  let privateKey: string;
  try {
    privateKey = normalizePrivateKey(rawPrivateKey);
  } catch (error) {
    console.error('Error normalizing private key:', error);
    throw new Error('Invalid private key format. Please check your GOOGLE_PRIVATE_KEY environment variable.');
  }

  // Create JWT auth - don't pre-authorize, let it happen on first API call
  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  // Return calendar client - authorization will happen automatically on first API call
  // This avoids the OpenSSL error that can occur during pre-authorization
  return google.calendar({ version: 'v3', auth });
}

/**
 * Creates a calendar event in Google Calendar
 */
export async function createCalendarEvent(params: CreateEventParams): Promise<string> {
  const { date, timeSlot, firstName, lastName, email, mobile } = params;

  // Validate date is a weekday
  if (!validateWeekday(date)) {
    throw new Error('Date must be a weekday (Monday-Friday)');
  }

  // Validate time slot
  const validTimeSlots = ['10:30', '11:00', '11:30'];
  if (!validTimeSlots.includes(timeSlot)) {
    throw new Error(`Time slot must be one of: ${validTimeSlots.join(', ')}`);
  }

  // Parse date and time
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const dateObj = parse(date, 'yyyy-MM-dd', new Date());
  
  // Create RFC3339 date-time strings (ISO 8601 format)
  // When timeZone is provided separately, dateTime should be in YYYY-MM-DDTHH:mm:ss format
  // The timeZone field will handle the timezone conversion
  const dateStr = format(dateObj, 'yyyy-MM-dd');
  const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  
  // Format as RFC3339 without timezone offset (timeZone field handles it)
  const startDateTimeStr = `${dateStr}T${timeStr}`;
  
  // Calculate end time (30 minutes later)
  const endMinutes = minutes + 30;
  const endHours = endMinutes >= 60 ? hours + 1 : hours;
  const finalEndMinutes = endMinutes % 60;
  const endTimeStr = `${String(endHours).padStart(2, '0')}:${String(finalEndMinutes).padStart(2, '0')}:00`;
  const endDateTimeStr = `${dateStr}T${endTimeStr}`;

  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error('Google Calendar ID is not configured');
  }

  const calendar = await getCalendarClient();

  const event = {
    summary: `Discovery Call - ${firstName} ${lastName}`,
    description: `Discovery Call Booking\n\nContact Details:\nName: ${firstName} ${lastName}\nEmail: ${email}\nMobile: ${mobile}\n\nPlease contact the client to confirm the appointment.`,
    start: {
      dateTime: startDateTimeStr,
      timeZone: NZT_TIMEZONE,
    },
    end: {
      dateTime: endDateTimeStr,
      timeZone: NZT_TIMEZONE,
    },
    // Note: Attendees removed because service accounts cannot invite attendees
    // without Domain-Wide Delegation. The event owner can manually add the
    // attendee if needed, or set up Domain-Wide Delegation for automatic invites.
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 day before
        { method: 'popup', minutes: 15 }, // 15 minutes before
      ],
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    if (!response.data.id) {
      throw new Error('Failed to create calendar event');
    }

    return response.data.id;
  } catch (error: any) {
    console.error('Error creating calendar event:', error);
    
    // Extract more details from Google API errors
    if (error?.response?.data?.error) {
      const apiError = error.response.data.error;
      const errorMessage = apiError.message || JSON.stringify(apiError);
      
      // Provide specific guidance for common permission errors
      if (errorMessage.includes('writer access') || (errorMessage.includes('permission') && !errorMessage.includes('Domain-Wide'))) {
        const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        throw new Error(
          `Calendar permission error: The service account needs write access to your calendar.\n\n` +
          `To fix this:\n` +
          `1. Open your Google Calendar\n` +
          `2. Go to Settings > Share with specific people\n` +
          `3. Add the service account email: ${serviceAccountEmail || 'your-service-account@...'}\n` +
          `4. Set permission to "Make changes to events"\n` +
          `5. Save and try again`
        );
      }

      // Handle Domain-Wide Delegation errors (shouldn't occur after removing attendees)
      if (errorMessage.includes('Domain-Wide Delegation') || errorMessage.includes('invite attendees')) {
        throw new Error(
          `Domain-Wide Delegation error: ${errorMessage}\n\n` +
          `This error should not occur with the current implementation. If you see this, ` +
          `please check that the code hasn't been modified to include attendees in calendar events.`
        );
      }
      
      throw new Error(`Google Calendar API error: ${errorMessage}`);
    }

    if (error?.code) {
      throw new Error(`Failed to create calendar event: ${error.code} - ${error.message || 'Unknown error'}`);
    }

    throw new Error(
      error instanceof Error
        ? `Failed to create calendar event: ${error.message}`
        : 'Failed to create calendar event'
    );
  }
}

