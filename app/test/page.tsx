"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { CtaSection } from "@/components/sections/CtaSection";
import { Footer } from "@/components/sections/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UXAnalysisForm } from "@/components/ux-analysis/UXAnalysisForm";
import { EmailCollectionDialog } from "@/components/ux-analysis/EmailCollectionDialog";
import type {
  AnalyzeUXResponse,
  AnalyzeUXErrorResponse,
  SubmitAnalysisErrorResponse,
} from "@/types/ux-analysis";
import type { EmailCollectionData } from "@/components/ux-analysis/EmailCollectionDialog";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<{
    url: string;
    report: string;
    screenshot: string;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleUrlSubmit = async (url: string) => {
    setLoading(true);
    setError(null);
    setAnalysisData(null);
    // Open dialog immediately after URL submission
    setDialogOpen(true);

    try {
      const response = await fetch("/api/analyze-ux", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as AnalyzeUXErrorResponse;
        setError(errorData.error || "An error occurred during analysis");
        if (errorData.details) {
          console.error("Analysis error details:", errorData.details);
        }
      } else {
        const successData = data as AnalyzeUXResponse;
        setAnalysisData({
          url,
          report: successData.report,
          screenshot: successData.screenshot,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to connect to the analysis service";
      setError(errorMessage);
      console.error("Analysis request failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (data: EmailCollectionData) => {
    if (!analysisData) {
      setError("No analysis data available. Please try again.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/submit-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: analysisData.url,
          report: analysisData.report,
          screenshot: analysisData.screenshot,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          mobile: data.mobile || undefined,
          areaOfInterest: ["UX optimisation"], // Hidden field - automatically set for UX form
        }),
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      let responseData: SubmitAnalysisErrorResponse | { success: boolean; message: string };
      
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        // If not JSON, read as text to see what we got
        const text = await response.text();
        console.error("Non-JSON response received:", text.substring(0, 200));
        setError(`Server error: ${response.status} ${response.statusText}`);
        return;
      }

      if (!response.ok) {
        const errorData = responseData as SubmitAnalysisErrorResponse;
        setError(errorData.error || "Failed to submit analysis");
        if (errorData.details) {
          console.error("Submit error details:", errorData.details);
        }
        return;
      }

      // Success - close dialog and show success message
      setDialogOpen(false);
      // Could show a toast/notification here if desired
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit analysis";
      setError(errorMessage);
      console.error("Submit request failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex bg-background flex-col ">
      <Header />

      <div id="hero-scroll-section" className=" bg-amber-500/05 z-10 pt-16">
        <div className="relative overflow-hidden bg-red-500/00 p-0 w-full ">
          <div
            id="hero-scroll-container"
            className="container mx-auto flex flex-col justify-center px-4 md:px-6 bg-green-500/00 relative z-40"
          >
            <div
              id="hero-left-col"
              className="bg-lime-500/00 w-full grow h-full lg:self-stretch md:flex md:flex-col md:justify-center"
            >
              <div className="flex flex-col gap-8 w-full">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-6xl">
                  Get a website analysis!
                </h1>

                <UXAnalysisForm onSubmit={handleUrlSubmit} loading={loading} />

                {error && (
                  <Card className="border-destructive">
                    <CardHeader>
                      <CardTitle className="text-destructive">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-destructive">{error}</p>
                    </CardContent>
                  </Card>
                )}

                {analysisData && !dialogOpen && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Analysis Complete</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Your analysis is ready! Please check your email to verify
                        and access your report.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EmailCollectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleEmailSubmit}
        isSubmitting={submitting}
        screenshot={analysisData?.screenshot}
        isAnalyzing={loading}
      />

      <CtaSection variant="analysis" sectionTheme="dark" />
      <Footer />
    </div>
  );
}
