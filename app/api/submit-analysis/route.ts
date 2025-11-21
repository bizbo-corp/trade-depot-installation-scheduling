import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { upsertContact, addAnalysisMetadata, logAnalysisEngagement } from "@/lib/hubspot";
import { sendVerificationEmail } from "@/lib/resend";
import type {
  SubmitAnalysisRequest,
  SubmitAnalysisResponse,
  SubmitAnalysisErrorResponse,
} from "@/types/ux-analysis";

export async function POST(request: NextRequest) {
  try {
    let body: SubmitAnalysisRequest;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json<SubmitAnalysisErrorResponse>(
        {
          error: "Invalid request body",
          details: "Request body must be valid JSON",
        },
        { status: 400 }
      );
    }

    const {
      url,
      report,
      screenshot,
      firstName,
      lastName,
      email,
      mobile,
      areaOfInterest = ["UX optimisation"], // Default for UX analysis form
    } = body;

    // Validate required fields
    if (!url || !report || !screenshot || !firstName || !lastName || !email) {
      return NextResponse.json<SubmitAnalysisErrorResponse>(
        {
          error: "Missing required fields",
          details: "URL, report, screenshot, firstName, lastName, and email are required",
        },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomUUID();

    // Calculate token expiry (24 hours from now)
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 24);

    // Save to database
    let analysisReport;
    try {
      analysisReport = await prisma.uXAnalysisReport.create({
        data: {
          url,
          firstName,
          lastName,
          email,
          mobile: mobile || null,
          areaOfInterest,
          report,
          screenshot,
          verificationToken,
          tokenExpiresAt,
          emailVerified: false,
        },
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      const errorMessage =
        dbError instanceof Error ? dbError.message : "Database operation failed";
      
      // Check if it's a connection error
      if (errorMessage.includes("DATABASE_URL") || errorMessage.includes("connection")) {
        return NextResponse.json<SubmitAnalysisErrorResponse>(
          {
            error: "Database connection error",
            details: process.env.NODE_ENV === "development" 
              ? "Please ensure DATABASE_URL is configured correctly" 
              : "Service temporarily unavailable",
          },
          { status: 503 }
        );
      }
      
      throw dbError; // Re-throw to be caught by outer catch
    }

    let hubspotContactId: string | null = null;

    // Sync to HubSpot (non-blocking - don't fail if this errors)
    try {
      // Upsert contact
      const contactId = await upsertContact({
        email,
        firstName,
        lastName,
        phone: mobile,
      });
      hubspotContactId = contactId;

      // Generate report link
      const reportLink = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/report/${verificationToken}`;

      // Add analysis metadata
      await addAnalysisMetadata({
        contactId,
        url,
        token: verificationToken,
        reportLink,
        areaOfInterest,
      });

      // Log engagement
      await logAnalysisEngagement({
        contactId,
        url,
      });

      // Update database with HubSpot contact ID
      await prisma.uXAnalysisReport.update({
        where: { id: analysisReport.id },
        data: { hubspotContactId: contactId },
      });
    } catch (hubspotError) {
      // Log error but don't fail the request
      console.error("HubSpot sync error (non-blocking):", hubspotError);
      // Continue with email sending
    }

    // Send verification email
    try {
      await sendVerificationEmail({
        email,
        firstName,
        token: verificationToken,
        screenshotUrl: screenshot,
      });
    } catch (emailError) {
      // If email fails, we should still return success but log the error
      console.error("Email sending error:", emailError);
      // Consider whether to rollback the database record or not
      // For now, we'll log it and return success with a warning
    }

    return NextResponse.json<SubmitAnalysisResponse>(
      {
        success: true,
        message: "Analysis submitted successfully. Please check your email to verify and access your report.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Submit analysis error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    // Ensure we always return JSON, never HTML
    return NextResponse.json<SubmitAnalysisErrorResponse>(
      {
        error: "Failed to submit analysis",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

