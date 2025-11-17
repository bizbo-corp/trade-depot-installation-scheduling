import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateVerificationStatus } from "@/lib/hubspot";
import type {
  VerifyEmailResponse,
  VerifyEmailErrorResponse,
} from "@/types/ux-analysis";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json<VerifyEmailErrorResponse>(
        {
          error: "Token is required",
          details: "Please provide a verification token",
        },
        { status: 400 }
      );
    }

    // Find report by token
    const report = await prisma.uXAnalysisReport.findUnique({
      where: { verificationToken: token },
    });

    if (!report) {
      return NextResponse.json<VerifyEmailErrorResponse>(
        {
          error: "Invalid token",
          details: "The verification token is invalid or has expired",
        },
        { status: 404 }
      );
    }

    // Check if token has expired
    if (new Date() > report.tokenExpiresAt) {
      return NextResponse.json<VerifyEmailErrorResponse>(
        {
          error: "Token expired",
          details: "The verification link has expired. Please request a new analysis.",
        },
        { status: 410 }
      );
    }

    // Update verified status if not already verified
    if (!report.emailVerified) {
      await prisma.uXAnalysisReport.update({
        where: { id: report.id },
        data: { emailVerified: true },
      });

      // Update HubSpot if contact ID exists
      if (report.hubspotContactId) {
        try {
          await updateVerificationStatus({
            contactId: report.hubspotContactId,
            verified: true,
          });
        } catch (hubspotError) {
          // Log but don't fail - verification already succeeded in database
          console.error("HubSpot verification status update error (non-blocking):", hubspotError);
        }
      }
    }

    // Return report data
    return NextResponse.json<VerifyEmailResponse>(
      {
        success: true,
        report: report.report,
        screenshot: report.screenshot,
        url: report.url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify email error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json<VerifyEmailErrorResponse>(
      {
        error: "Failed to verify email",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

