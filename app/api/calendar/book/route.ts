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
          details: validationResult.error.errors,
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
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('credentials') || error.message.includes('not configured')) {
        return NextResponse.json(
          {
            error: 'Server configuration error',
            message: 'Calendar service is not properly configured',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
          },
          { status: 500 }
        );
      }

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

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to process booking request. Please try again later.',
      },
      { status: 500 }
    );
  }
}

