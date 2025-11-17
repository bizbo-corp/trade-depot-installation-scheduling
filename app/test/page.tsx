"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Header } from "@/components/header";
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyzeUXResponse, AnalyzeUXErrorResponse } from "@/types/ux-analysis";
import { cn } from "@/lib/utils";

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

const STORAGE_KEY = "ux-analysis-results";

interface StoredAnalysisData {
  report: string;
  screenshot: string;
  url: string;
}

/**
 * Helper function to check if localStorage is available (SSR safety)
 */
function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Save analysis results to localStorage
 */
function saveAnalysisResults(data: StoredAnalysisData): void {
  if (!isLocalStorageAvailable()) {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save analysis results to localStorage:", error);
  }
}

/**
 * Load analysis results from localStorage
 */
function loadAnalysisResults(): StoredAnalysisData | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    const data = JSON.parse(stored) as StoredAnalysisData;
    // Validate the data structure
    if (data && typeof data.report === "string" && typeof data.screenshot === "string" && typeof data.url === "string") {
      return data;
    }
    // If data is corrupted, remove it
    localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch (error) {
    console.error("Failed to load analysis results from localStorage:", error);
    // Remove corrupted data
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore errors when removing
    }
    return null;
  }
}

/**
 * Clear analysis results from localStorage
 */
function clearAnalysisResults(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear analysis results from localStorage:", error);
  }
}

export default function Home() {
  useHeroScrollAnimation();
  
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load persisted data on component mount
  useEffect(() => {
    const storedData = loadAnalysisResults();
    if (storedData) {
      setReport(storedData.report);
      setScreenshot(storedData.screenshot);
      setUrl(storedData.url);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    // Clear localStorage and reset state at the start of new submission
    clearAnalysisResults();
    setLoading(true);
    setError(null);
    setReport(null);
    setScreenshot(null);

    try {
      const response = await fetch("/api/analyze-ux", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
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
        setReport(successData.report);
        setScreenshot(successData.screenshot);
        
        // Save results to localStorage after successful analysis
        saveAnalysisResults({
          report: successData.report,
          screenshot: successData.screenshot,
          url: url.trim(),
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect to the analysis service";
      setError(errorMessage);
      console.error("Analysis request failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-background flex-col ">
      <Header />

      <div
        id="hero-scroll-section"
        className=" bg-amber-500/05 z-10 pt-16"
      >

        <div className="relative overflow-hidden bg-red-500/00 p-0 w-full ">
          {/* Animated circles background */}
          {/* Top circle - smallest (w-3) - Olive-500 */}


          <div
            id="hero-scroll-container"
            className="container mx-auto flex flex-col justify-center px-4 md:px-6 bg-green-500/00 relative z-40"
          >
            <div
              id="hero-left-col"
              className="bg-lime-500/00 w-full grow h-full lg:self-stretch md:flex md:flex-col md:justify-center"
            >
              <div className="flex flex-col gap-8 w-full">

                <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-6xl">Get a website analysis!</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                  <label htmlFor="url" className="text-sm font-medium text-foreground">URL</label>
                  <Input
                    id="url"
                    placeholder="Enter your URL"
                    className="w-full h-12"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="px-8 sm:w-auto"
                    disabled={loading}
                  >
                    {loading ? "Analysing..." : "Get a website analysis!"}
                  </Button>
                </form>

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

                {report && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Analysis Report</CardTitle>
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
                          "prose-h2:!font-bold",
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
                )}
              </div>
            </div>

          </div>

        </div>
      </div>



      <CtaSection variant="analysis" sectionTheme="dark" />
      <Footer />
    </div>
  );
}
