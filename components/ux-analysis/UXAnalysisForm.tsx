"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmailCollectionDialog, EmailCollectionData } from "@/components/ux-analysis/EmailCollectionDialog";
import type {
  SubmitAnalysisErrorResponse,
} from "@/types/ux-analysis";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle2, RefreshCw, Loader2 } from "lucide-react";

type AnalysisStatus = 'idle' | 'capturing' | 'analyzing' | 'complete' | 'error';

interface UXAnalysisFormProps {
  className?: string;
}

export function UXAnalysisForm({ className }: UXAnalysisFormProps) {
  const [url, setUrl] = useState("");
  
  // State management
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<{
    url: string;
    report: string | null;
    screenshot: string | null;
    htmlContent?: string;
    screenshotWidth?: number;
    screenshotHeight?: number;
    viewportWidth?: number;
    viewportHeight?: number;
  } | null>(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isWaitingForAnalysis, setIsWaitingForAnalysis] = useState(false);
  const [emailFormData, setEmailFormData] = useState<EmailCollectionData | null>(null);
  const [isReportSent, setIsReportSent] = useState(false);

  // Effect to handle pending email submission when analysis completes
  useEffect(() => {
    const processPendingSubmission = async () => {
      if (analysisStatus === 'complete' && emailFormData && isWaitingForAnalysis && !isReportSent) {
        await submitEmailForm(emailFormData);
      }
    };

    processPendingSubmission();
  }, [analysisStatus, emailFormData, isWaitingForAnalysis, isReportSent]);

  // Effect to handle analysis errors while waiting
  useEffect(() => {
    if (analysisStatus === 'error' && isWaitingForAnalysis) {
      setIsWaitingForAnalysis(false);
      toast.error("Analysis failed. Please try again.");
      setEmailFormData(null);
    }
  }, [analysisStatus, isWaitingForAnalysis]);

  const handleAnalysisSubmit = async (urlToAnalyze: string) => {
    setAnalysisStatus('capturing');
    setError(null);
    setAnalysisData(null);
    setEmailFormData(null);
    setIsReportSent(false);
    setIsWaitingForAnalysis(false);
    
    // Open dialog immediately after URL submission
    setIsDialogOpen(true);

    try {
      // Step 1: Capture Screenshot
      const captureResponse = await fetch("/api/capture-screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToAnalyze }),
      });

      const captureData = await captureResponse.json();

      if (!captureResponse.ok) {
        throw new Error(captureData.error || "Failed to capture website screenshot");
      }

      // Update state with screenshot immediately
      setAnalysisData({
        url: urlToAnalyze,
        report: null,
        screenshot: captureData.screenshot,
        htmlContent: captureData.htmlContent,
        screenshotWidth: captureData.screenshotWidth,
        screenshotHeight: captureData.screenshotHeight,
        viewportWidth: captureData.viewportWidth,
        viewportHeight: captureData.viewportHeight,
      });
      
      setAnalysisStatus('analyzing');

      // Step 2: Generate Report
      const reportResponse = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screenshot: captureData.screenshot,
          htmlContent: captureData.htmlContent,
          screenshotWidth: captureData.screenshotWidth,
          screenshotHeight: captureData.screenshotHeight,
          viewportWidth: captureData.viewportWidth,
          viewportHeight: captureData.viewportHeight,
        }),
      });

      const reportData = await reportResponse.json();

      if (!reportResponse.ok) {
        throw new Error(reportData.error || "Failed to generate analysis report");
      }

      // Update state with report
      setAnalysisData(prev => prev ? {
        ...prev,
        report: reportData.report,
      } : null);
      
      setAnalysisStatus('complete');

    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred during analysis";
      setError(errorMessage);
      setAnalysisStatus('error');
      console.error("Analysis request failed:", err);
    }
  };

  const submitEmailForm = async (data: EmailCollectionData) => {
    if (!analysisData || !analysisData.report || !analysisData.screenshot) {
      console.error("Missing analysis data for submission");
      return;
    }

    setIsSubmittingEmail(true);
    // Don't clear waiting state here - wait for success
    // setIsWaitingForAnalysis(false); 
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
          areaOfInterest: ["UX optimisation"],
        }),
      });

      const contentType = response.headers.get("content-type");
      let responseData: SubmitAnalysisErrorResponse | { success: boolean; message: string };
      
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response received:", text.substring(0, 200));
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        const errorData = responseData as SubmitAnalysisErrorResponse;
        throw new Error(errorData.error || "Failed to submit analysis");
      }

      // Success
      setIsDialogOpen(false);
      setIsReportSent(true);
      setIsWaitingForAnalysis(false); // Clear waiting state only on success
      toast.success("Analysis sent - check your inbox");
      
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit analysis";
      setError(errorMessage);
      console.error("Submit request failed:", err);
      
      // On error, we should probably stop waiting so user can see the error
      setIsWaitingForAnalysis(false);
      toast.error(errorMessage);
    } finally {
      setIsSubmittingEmail(false);
      // Clear form data if successful to prevent re-submission loop
      if (!error) {
        setEmailFormData(null);
      }
    }
  };

  const handleEmailSubmit = async (data: EmailCollectionData) => {
    // Store form data
    setEmailFormData(data);
    
    // If analysis is already complete, submit immediately
    if (analysisStatus === 'complete' && analysisData?.report) {
      await submitEmailForm(data);
    } else {
      // Otherwise, wait for analysis to complete (handled by useEffect)
      setIsWaitingForAnalysis(true);
      setIsDialogOpen(false);
      toast.info("Analysis finalising...", {
        description: "We'll email you the report as soon as it's ready."
      });
    }
  };
  
  const handleReset = () => {
    setAnalysisStatus('idle');
    setAnalysisData(null);
    setError(null);
    setIsReportSent(false);
    setEmailFormData(null);
    setUrl("");
  };

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!url.trim()) {
      return;
    }

    await handleAnalysisSubmit(url.trim());
  };

  // Render content based on state
  if (isWaitingForAnalysis) {
    return (
      <>
        <Card className="border-primary/20 bg-primary/5 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary mb-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="font-semibold">Finalizing Analysis...</span>
            </div>
            <CardTitle>Generating Your Report</CardTitle>
            <CardDescription>
              We are compiling your comprehensive UX analysis. This usually takes about 30 seconds. Your report will be delivered to your inbox shortly.
            </CardDescription>
          </CardHeader>
        </Card>
        <EmailCollectionDialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!isSubmittingEmail) setIsDialogOpen(open);
          }}
          onSubmit={handleEmailSubmit}
          isSubmitting={isSubmittingEmail}
          screenshot={analysisData?.screenshot || undefined}
          isAnalyzing={analysisStatus === 'analyzing' || analysisStatus === 'capturing'}
        />
      </>
    );
  }

  if (isReportSent) {
    return (
      <Card className="border-primary/20 bg-primary/5 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary mb-2">
            <CheckCircle2 className="h-6 w-6" />
            <span className="font-semibold">Analysis Complete</span>
          </div>
          <CardTitle>Report Sent to Inbox</CardTitle>
          <CardDescription>
            We've sent the detailed UX analysis for <strong>{analysisData?.url}</strong> to your email address.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={handleReset} variant="outline" className="w-full gap-2">
            <RefreshCw className="h-4 w-4" />
            Run Another Analysis
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className={className}>
      <div className="bg-foreground p-8 rounded-lg">
        <form onSubmit={onFormSubmit} className="flex flex-col gap-4 w-full">
          <label htmlFor="url" className="text-sm font-medium text-background">
            <h2 className="text-xl font-bold mb-0">Get a free website analysis</h2>
            <p className="text-sm text-muted-foreground">Enter your website or landing page below</p>
          </label>
          <Input
            id="url"
            placeholder="Website or landing page URL"
            className="w-full h-12"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={analysisStatus === 'capturing' || analysisStatus === 'analyzing'}
            required
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="px-8 sm:w-auto"
            disabled={analysisStatus === 'capturing' || analysisStatus === 'analyzing'}
          >
            {analysisStatus === 'capturing' || analysisStatus === 'analyzing' ? "Analysing..." : "Get a website analysis!"}
          </Button>
        </form>
      </div>
      
      {error && (
        <Card className="border-destructive bg-destructive/10 mt-4">
          <CardHeader className="p-4">
            <CardTitle className="text-destructive text-sm">Error</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <EmailCollectionDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!isSubmittingEmail) setIsDialogOpen(open);
        }}
        onSubmit={handleEmailSubmit}
        isSubmitting={isSubmittingEmail}
        screenshot={analysisData?.screenshot || undefined}
        isAnalyzing={analysisStatus === 'analyzing' || analysisStatus === 'capturing'}
      />
    </div>
  );
}

