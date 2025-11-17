import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Header } from "@/components/header";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { updateVerificationStatus } from "@/lib/hubspot";

interface ReportPageProps {
  params: Promise<{ token: string }>;
}

async function getReportData(token: string): Promise<{
  success: true;
  data: {
    report: string;
    screenshot: string;
    url: string;
  };
} | {
  success: false;
  error: string;
  details?: string;
}> {
  try {
    // Find report by token
    const report = await prisma.uXAnalysisReport.findUnique({
      where: { verificationToken: token },
    });

    if (!report) {
      return {
        success: false,
        error: "Invalid token",
        details: "The verification token is invalid or has expired",
      };
    }

    // Check if token has expired
    if (new Date() > report.tokenExpiresAt) {
      return {
        success: false,
        error: "Token expired",
        details: "The verification link has expired. Please request a new analysis.",
      };
    }

    // Update verified status if not already verified
    if (!report.emailVerified) {
      await prisma.uXAnalysisReport.update({
        where: { id: report.id },
        data: { emailVerified: true },
      });

      // Update HubSpot if contact ID exists (non-blocking)
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

    return {
      success: true,
      data: {
        report: report.report,
        screenshot: report.screenshot,
        url: report.url,
      },
    };
  } catch (error) {
    console.error("Failed to load report:", error);
    return {
      success: false,
      error: "Failed to load report",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { token } = await params;
  const result = await getReportData(token);

  if (!result.success) {
    return (
      <div className="flex bg-background flex-col min-h-screen">
        <Header />
        <div className="flex-1 container mx-auto px-4 md:px-6 py-16">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive mb-2">{result.error}</p>
              {result.details && (
                <p className="text-sm text-muted-foreground">{result.details}</p>
              )}
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const { report, screenshot, url } = result.data;

  return (
    <div className="flex bg-background flex-col min-h-screen">
      <Header />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-16">
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>UX Analysis Report</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">URL Analyzed: {url}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {screenshot && (
              <div className="w-full rounded-lg overflow-hidden border">
                <img
                  src={screenshot}
                  alt="Website screenshot"
                  className="w-full h-auto"
                />
              </div>
            )}
            <div
              className={cn(
                "prose",
                "prose-lg",
                "max-w-none",
                "dark:prose-invert",
                "prose-headings:font-bold",
                "prose-headings:text-foreground",
                "prose-p:text-foreground",
                "prose-p:mb-4",
                "prose-p:mt-0",
                "prose-strong:text-foreground",
                "prose-strong:font-bold",
                "prose-ul:text-foreground",
                "prose-ul:my-4",
                "prose-ol:text-foreground",
                "prose-ol:my-4",
                "prose-li:text-foreground",
                "prose-li:my-2",
                "prose-a:text-primary",
                "prose-a:no-underline",
                "hover:prose-a:underline",
                "prose-h1:text-4xl",
                "prose-h1:font-bold",
                "prose-h1:mt-8",
                "prose-h1:mb-4",
                "prose-h2:text-3xl",
                "prose-h2:font-bold",
                "prose-h2:mt-8",
                "prose-h2:mb-4",
                "prose-h3:text-2xl",
                "prose-h3:font-bold",
                "prose-h3:mt-6",
                "prose-h3:mb-3",
                "prose-h4:text-xl",
                "prose-h4:font-bold",
                "prose-h4:mt-4",
                "prose-h4:mb-2",
                "prose-blockquote:border-l-4",
                "prose-blockquote:border-primary",
                "prose-blockquote:pl-4",
                "prose-blockquote:italic",
                "prose-blockquote:my-4",
                "prose-hr:my-8",
                "prose-hr:border-border",
                "prose-table:w-full",
                "prose-table:my-8",
                "prose-th:border",
                "prose-th:border-border",
                "prose-th:bg-muted",
                "prose-th:px-4",
                "prose-th:py-3",
                "prose-th:text-left",
                "prose-th:font-semibold",
                "prose-td:border",
                "prose-td:border-border",
                "prose-td:px-4",
                "prose-td:py-3"
              )}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{report}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

