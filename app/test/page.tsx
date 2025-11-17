"use client";

import { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
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

export default function Home() {
  useHeroScrollAnimation();
  
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    // Reset state
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
            className="container mx-auto min-h-[calc(100vh-100px)] flex flex-col items-stretch lg:flex-row lg:items-stretch lg:h-[calc(100vh-100px)] justify-center px-4 md:px-6 bg-green-500/00 relative z-40"
          >
            <div
              id="hero-left-col"
              className="bg-lime-500/00 w-full grow h-full lg:min-w-1/2 lg:self-stretch md:flex md:flex-col md:justify-center"
            >
              <div className="flex flex-col gap-8 md:max-w-2xl">

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
                      <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-h3:text-2xl prose-h3:font-bold prose-h3:mt-8 prose-h3:mb-4 prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4">
                        <ReactMarkdown>{report}</ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>
                )}
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



      <CtaSection variant="analysis" sectionTheme="dark" />
      <Footer />
    </div>
  );
}
