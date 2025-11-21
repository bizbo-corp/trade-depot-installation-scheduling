"use client";

import Image from "next/image";
import { Header } from "@/components/header";
import { Header as HeaderComponent } from "@/components/header"; // Alias to avoid conflict if needed, but Header is fine
import { HeroSection } from "@/components/sections/HeroSection";
import { ValuePropositionSection } from "@/components/sections/ValuePropositionSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { LogoSection } from "@/components/sections/LogoSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { Footer } from "@/components/sections/Footer";
import { CTAhome } from "@/components/sections/CTAhome";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { useHeroScrollAnimation } from "@/hooks/useHeroScrollAnimation";
import { bitmapImages } from "@/lib/images";
import { FaIcon } from "@/components/ui/fa-icon";
import { BookingDialog } from "@/components/booking/BookingDialog";
import { Button } from "@/components/ui/button";
import { LottieAnimation } from "@/components/LottieAnimation";
import { animations } from "@/lib/images";
import { UXIllustration } from "@/app/ux-design/UXIllustration";
import { UXAnalysisForm } from "@/components/ux-analysis/UXAnalysisForm";
import { EmailCollectionDialog, EmailCollectionData } from "@/components/ux-analysis/EmailCollectionDialog";
import { useState, useEffect } from "react";
import type {
  AnalyzeUXResponse,
  AnalyzeUXErrorResponse,
  SubmitAnalysisErrorResponse,
} from "@/types/ux-analysis";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle2, RefreshCw, Loader2 } from "lucide-react";

const FEATURE_ITEMS = [
  {
    icon: "hand-scissors",
    title: "Eliminate user journey friction points",
    description:
      "We identify and remove the frustrating roadblocks on your website, from clunky forms to confusing checkout flows, so your visitors can convert into paying customers with ease.",
  },
  {
    icon: "rocket-launch",
    title: "Speed up your site and reduce bounce",
    description:
      "We optimise for fast loading times and responsiveness, making a great first impression and keeping people from leaving.",
  },
  {
    icon: "bullseye-pointer",
    title: "Reach more people and improve your SEO",
    description:
      "Don't let your website turn away potential customers. Our accessible designs are compliant for every visitor, naturally boosting your visibility and organic search rankings.",
  },
  {
    icon: "filter",
    title: "Continuous optimisation",
    description:
      "Let us help you run a hypothesis-driven optimisation to refine your website so it becomes the best tool it can be for generating leads and engaged customers.",
  },
  {
    icon: "heart-pulse",
    title: "Grow your business with a healthy sales funnel",
    description:
      "We guide visitors toward your goals, turning your website into an effective engine for leads, sign-ups, and sales.",
  },
  {
    icon: "vial",
    title: "Discover how your customers behave",
    description:
      "Our A/B and usability testing helps you understand what works and what doesn't, so you can make data-driven decisions that improve user experience and boost your bottom line.",
  },
]

type AnalysisStatus = 'idle' | 'capturing' | 'analyzing' | 'complete' | 'error';

export default function Home() {
  useHeroScrollAnimation();
  
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

  const handleAnalysisSubmit = async (url: string) => {
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
        body: JSON.stringify({ url }),
      });

      const captureData = await captureResponse.json();

      if (!captureResponse.ok) {
        throw new Error(captureData.error || "Failed to capture website screenshot");
      }

      // Update state with screenshot immediately
      setAnalysisData({
        url,
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
  };

  return (
    <div className="flex bg-background min-h-screen flex-col ">
      <Header />

      <div
        id="hero-scroll-section"
        className="min-h-[calc(100vh)] bg-amber-500/00 z-10 pt-16"
      >
        <div
          id="desktop-app-image"
          className="fixed right-0 bottom-0 w-[480px] h-[756px] rounded-b-none rounded-lg z-1002 overflow-hidden"
        ></div>

        <div
          id="mobile-app-image"
          className="fixed right-108 bottom-0 w-[208px] rounded-b-none rounded-lg z-1003 overflow-hidden border-0 border-red-500/100"
        ></div>
        <div className="relative overflow-hidden bg-red-500/00 p-0 w-full min-h-[calc(100vh-100px)] ">
          {/* Animated circles background */}
          <div
            id="hero-accent0"
            className="absolute w-[200px] h-[200px] bg-background rounded-full z-1000"
          ></div>
          <div
            id="hero-accent1"
            className="absolute w-[1200px] h-[400px] bg-olive-600/25 rounded-full z-30"
          ></div>
          <div
            id="hero-accent2"
            className="absolute w-[1600px] h-[800px] bg-olive-600/25 rounded-full z-20"
          ></div>
          <div
            id="hero-accent3"
            className="absolute w-[2000px] h-[1200px] bg-olive-600/25 rounded-full z-10"
          ></div>

          <div
            id="hero-scroll-container"
            className="container mx-auto min-h-[calc(100vh-100px)] flex flex-col items-stretch lg:flex-row lg:items-stretch lg:h-[calc(100vh-100px)] justify-center px-4 md:px-6 bg-green-500/00 relative z-40"
          >
            <div
              id="hero-left-col"
              className="bg-lime-500/00 w-full grow h-full lg:min-w-1/2 lg:self-stretch md:flex md:flex-col md:justify-center"
            >
              <div className="flex flex-col gap-8 md:max-w-2xl">
                <div className="flex flex-col gap-6 ">
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-6xl">
              <span className="block">Transform your digital presence with expert</span>
              <span className="text-muted-foreground">UX design</span>
                  </h1>
                  <p className="max-w-xl text-lg font-medium leading-relaxed text-foreground md:text-xl">
                  Identify and eliminate user journey friction points for enhanced engagement and conversion. Our UX experts provide tailored insights to improve user engagement and boost conversion rates.
                  </p>
                </div>
                
                {/* Feature List */}
                {!isReportSent && (
                  <ul className="flex flex-col gap-4">
                    <li className="flex items-start gap-3">
                      <FaIcon
                        icon="check"
                        className="mt-0.5 h-5 w-5 shrink-0 text-foreground md:h-6 md:w-6"
                      />
                      <span className="text-lg text-foreground/70 md:text-xl">
                      Find quick-win user experience improvements
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FaIcon
                        icon="check"
                        className="mt-0.5 h-5 w-5 shrink-0 text-foreground md:h-6 md:w-6"
                      />
                      <span className="text-lg text-foreground/70 md:text-xl">
                      Increase conversions and sales funnel health
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FaIcon
                        icon="check"
                        className="mt-0.5 h-5 w-5 shrink-0 text-foreground md:h-6 md:w-6"
                      />
                      <span className="text-lg text-foreground/70 md:text-xl">
                      Boost accessibility and improve your page rank
                      </span>
                    </li>
                  </ul>
                )}

                <div className="flex flex-col gap-4 w-full max-w-md">
                  {isWaitingForAnalysis ? (
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
                  ) : isReportSent ? (
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
                  ) : (
                    <UXAnalysisForm 
                      onSubmit={handleAnalysisSubmit} 
                      loading={analysisStatus === 'capturing' || analysisStatus === 'analyzing'} 
                    />
                  )}
                  
                  {error && (
                    <Card className="border-destructive bg-destructive/10">
                      <CardHeader className="p-4">
                        <CardTitle className="text-destructive text-sm">Error</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-destructive">{error}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
            <div
              id="hero-right-col"
              className="bg-pink-500/00 w-full grow h-full lg:min-w-1/2 lg:self-stretch"
            >
            <div className="flex items-center justify-center h-full w-full">
              <UXIllustration className="w-full h-auto" />
            </div>

            </div>
          </div>

        </div>
      </div>

      <FeatureSection
          title="User-centric design"
          description="At Bizbo, we believe that user-centric design is the cornerstone of successful digital experiences. By prioritising the needs of your users, we create intuitive interfaces that not only engage but also convert."
          features={FEATURE_ITEMS}
          className="bg-muted"
        />
      <TestimonialsSection />
      <LogoSection />
      <AboutSection />

      <CtaSection variant="analysis" sectionTheme="dark" />
      <Footer />
      <EmailCollectionDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          // Only allow closing if not submitting email
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
