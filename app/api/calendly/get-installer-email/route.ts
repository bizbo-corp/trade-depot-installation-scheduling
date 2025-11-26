import { NextRequest, NextResponse } from 'next/server';
import { getInstallerEmailFromEvent } from '@/lib/calendly';

/**
 * API endpoint to fetch installer email from Calendly event
 * 
 * POST /api/calendly/get-installer-email
 * Body: { eventUri: string }
 * 
 * Returns: { installerEmail: string } or error
 */
export async function POST(request: NextRequest) {
  try {
    // Check if CALENDLY_API_TOKEN is configured
    if (!process.env.CALENDLY_API_TOKEN) {
      console.error('[Get Installer Email API] CALENDLY_API_TOKEN missing');
      
      // Fallback to environment variable if available
      const fallbackEmail = process.env.INSTALLER_EMAIL;
      if (fallbackEmail) {
        console.log('[Get Installer Email API] Using fallback INSTALLER_EMAIL');
        return NextResponse.json(
          { installerEmail: fallbackEmail, source: 'fallback' },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          error: 'Calendly API not configured',
          details: 'CALENDLY_API_TOKEN environment variable is not set. Set INSTALLER_EMAIL as fallback.',
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { eventUri } = body;

    if (!eventUri) {
      return NextResponse.json(
        { error: 'Missing required field: eventUri' },
        { status: 400 }
      );
    }

    console.log('[Get Installer Email API] Fetching installer email for event:', eventUri);

    try {
      const installerEmail = await getInstallerEmailFromEvent(eventUri);
      
      console.log('[Get Installer Email API] Successfully retrieved installer email');
      
      return NextResponse.json(
        { installerEmail, source: 'calendly' },
        { status: 200 }
      );
    } catch (calendlyError) {
      console.error('[Get Installer Email API] Calendly API error:', calendlyError);
      
      // Fallback to environment variable if Calendly API fails
      const fallbackEmail = process.env.INSTALLER_EMAIL;
      if (fallbackEmail) {
        console.log('[Get Installer Email API] Using fallback INSTALLER_EMAIL after Calendly API error');
        return NextResponse.json(
          { installerEmail: fallbackEmail, source: 'fallback' },
          { status: 200 }
        );
      }

      // Return error if no fallback available
      const errorMessage = calendlyError instanceof Error 
        ? calendlyError.message 
        : 'Unknown error fetching installer email from Calendly';
      
      return NextResponse.json(
        {
          error: 'Failed to fetch installer email from Calendly',
          details: errorMessage,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Get Installer Email API] Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        error: 'Failed to process request',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

