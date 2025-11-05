import { NextRequest, NextResponse } from 'next/server';
import { createCalendarEvent, validateWeekday } from '@/lib/google-calendar';
import { z } from 'zod';

const bookingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  timeSlot: z.enum(['10:30', '11:00', '11:30']),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(1, 'Mobile number is required').max(20),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = bookingSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { date, timeSlot, firstName, lastName, email, mobile } = validationResult.data;

    // Validate date is a weekday
    if (!validateWeekday(date)) {
      return NextResponse.json(
        {
          error: 'Invalid date',
          message: 'Bookings are only available on weekdays (Monday-Friday)',
        },
        { status: 400 }
      );
    }

    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return NextResponse.json(
        {
          error: 'Invalid date',
          message: 'Cannot book appointments in the past',
        },
        { status: 400 }
      );
    }

    // Create calendar event
    const eventId = await createCalendarEvent({
      date,
      timeSlot,
      firstName,
      lastName,
      email,
      mobile,
    });

    return NextResponse.json(
      {
        success: true,
        eventId,
        message: 'Booking confirmed successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing booking request:', error);

    // Handle specific error cases
    if (error instanceof Error) {
      // Configuration errors - check for missing environment variables
      if (
        error.message.includes('credentials') || 
        error.message.includes('not configured') ||
        error.message.includes('GOOGLE_SERVICE_ACCOUNT_EMAIL') ||
        error.message.includes('GOOGLE_PRIVATE_KEY') ||
        error.message.includes('GOOGLE_CALENDAR_ID')
      ) {
        return NextResponse.json(
          {
            error: 'Server configuration error',
            message: 'Calendar service is not properly configured. Please check server logs.',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Missing required environment variables',
          },
          { status: 500 }
        );
      }

      // Permission errors from Google Calendar API
      if (error.message.includes('writer access') || error.message.includes('permission')) {
        return NextResponse.json(
          {
            error: 'Calendar permission error',
            message: 'The calendar service account does not have write access. Please check server logs.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
          },
          { status: 500 }
        );
      }

      // Google API errors
      if (error.message.includes('Google Calendar API') || error.message.includes('Google API')) {
        return NextResponse.json(
          {
            error: 'Calendar API error',
            message: 'An error occurred while creating the calendar event. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
          },
          { status: 500 }
        );
      }

      // Weekday validation errors
      if (error.message.includes('weekday')) {
        return NextResponse.json(
          {
            error: 'Invalid date',
            message: error.message,
          },
          { status: 400 }
        );
      }

      // Return more detailed error in development
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(
          {
            error: 'Internal server error',
            message: error.message,
            details: error.stack,
          },
          { status: 500 }
        );
      }
    }

    // Generic error for production
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to process booking request. Please try again later.',
      },
      { status: 500 }
    );
  }
}

