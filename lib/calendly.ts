/**
 * Calendly API integration
 * 
 * Functions to interact with Calendly API to fetch event details
 * and extract installer/host email addresses.
 */

const CALENDLY_API_BASE = 'https://api.calendly.com';

export interface CalendlyEvent {
  uri: string;
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  event_type: string;
  location: {
    type: string;
    location?: string;
  };
  invitees_counter: {
    total: number;
    active: number;
    limit: number;
  };
  created_at: string;
  updated_at: string;
  event_memberships: Array<{
    user: string; // URI to user resource
    user_email?: string; // May be included in some responses
  }>;
}

export interface CalendlyUser {
  uri: string;
  name: string;
  email: string;
  slug: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CalendlyEventResponse {
  resource: CalendlyEvent;
}

export interface CalendlyUserResponse {
  resource: CalendlyUser;
}

/**
 * Fetches event details from Calendly API using event URI
 */
export async function getCalendlyEvent(eventUri: string): Promise<CalendlyEvent> {
  const apiToken = process.env.CALENDLY_API_TOKEN;
  
  if (!apiToken) {
    throw new Error('CALENDLY_API_TOKEN environment variable is not set');
  }

  // Extract UUID from URI if full URI is provided
  const eventUuid = eventUri.includes('/') 
    ? eventUri.split('/').pop() 
    : eventUri;

  if (!eventUuid) {
    throw new Error('Invalid event URI format');
  }

  const url = `${CALENDLY_API_BASE}/scheduled_events/${eventUuid}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Calendly API error: ${response.status} ${response.statusText}. ${errorText}`
    );
  }

  const data: CalendlyEventResponse = await response.json();
  return data.resource;
}

/**
 * Fetches user details from Calendly API using user URI
 */
export async function getCalendlyUser(userUri: string): Promise<CalendlyUser> {
  const apiToken = process.env.CALENDLY_API_TOKEN;
  
  if (!apiToken) {
    throw new Error('CALENDLY_API_TOKEN environment variable is not set');
  }

  // Extract UUID from URI if full URI is provided
  const userUuid = userUri.includes('/') 
    ? userUri.split('/').pop() 
    : userUri;

  if (!userUuid) {
    throw new Error('Invalid user URI format');
  }

  const url = `${CALENDLY_API_BASE}/users/${userUuid}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Calendly API error: ${response.status} ${response.statusText}. ${errorText}`
    );
  }

  const data: CalendlyUserResponse = await response.json();
  return data.resource;
}

/**
 * Extracts installer/host email from Calendly event
 * 
 * This function fetches the event details and then fetches the user details
 * to get the email address of the event host/organizer.
 */
export async function getInstallerEmailFromEvent(eventUri: string): Promise<string> {
  try {
    // Fetch event details
    const event = await getCalendlyEvent(eventUri);

    // Get the first event member (host/organizer)
    if (!event.event_memberships || event.event_memberships.length === 0) {
      throw new Error('No event memberships found in event');
    }

    const userUri = event.event_memberships[0].user;
    
    if (!userUri) {
      throw new Error('User URI not found in event memberships');
    }

    // Fetch user details to get email
    const user = await getCalendlyUser(userUri);

    if (!user.email) {
      throw new Error('Email not found for user');
    }

    return user.email;
  } catch (error) {
    console.error('[Calendly] Error fetching installer email:', error);
    throw error;
  }
}

