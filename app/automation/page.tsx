"use client";

import Image from "next/image";
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
import { AutomationIllustration } from "@/app/automation/AutomationIllustration";

const FEATURE_ITEMS = [
  {
    icon: "rocket-launch",
    title: "Scale your business",
    description:
      "Automation lets you handle a higher volume of traffic and orders without adding staff, giving you the flexibility to meet demand without increasing your overheads.",
  },
  {
    icon: "square-user",
    title: "Improve customer engagement",
    description:
      "Boost conversions with timely, personalised offers that resonate with each customer. Time messaging and strike when it counts.",
  },
  {
    icon: "message-bot",
    title: "Provide 24/7 customer support",
    description:
      "Give your customers instant answers around the clock with intelligent chatbots trained on your company's information, improving satisfaction and freeing up your team.",
  },
  {
    icon: "square-dollar",
    title: "Build and qualify leads",
    description:
      "Automatically find new prospects online, extract key information, and qualify them, allowing your sales team to focus on closing.",
  },
  {
    icon: "scissors",
    title: "Eliminate repetitive tasks",
    description:
      "Automatically read and capture data from emails and documents, format it, and transfer it to your systems, freeing up your team from manual entry.",
  },
  {
    icon: "megaphone",
    title: "Turn your content into a powerful growth engine",
    description:
      "Stop creating content that just sits there. We build a content strategy engineered for organic SEO and AI search, turning visitors into loyal customers and brand advocates.",
  },
]

export default function Home() {
  useHeroScrollAnimation();

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
          {/* Top circle - smallest (w-3) - Olive-500 */}
          <div
            id="hero-accent0"
            className="absolute w-[200px] h-[200px] bg-background rounded-full z-1000"
          ></div>
          <div
            id="hero-accent1"
            className="absolute w-[1200px] h-[400px] bg-olive-600/25 rounded-full z-30"
          ></div>
          {/* Middle circle (w-4) - Olive-400 */}
          <div
            id="hero-accent2"
            className="absolute w-[1600px] h-[800px] bg-olive-600/25 rounded-full z-20"
          ></div>
          {/* Bottom circle - largest (w-5) - Olive-300 */}
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
                  <span className="text-muted-foreground">Become 10x you</span>
                  <span className="block">with automations and integrated business tools</span>
                  </h1>
                  <p className="max-w-xl text-lg font-medium leading-relaxed text-foreground md:text-xl">
                  Boost your business potential with our automation and integration services. Break down siloed technology choices and get digital working for you. Automation streamlines your processes, reduces manual effort, and keeps your business running 24/7. Marketing automation helps you generate GEO and SEO content and monitor paid search activity so you can stay focused on growth.
                  </p>
                  </div>
                <div className="flex flex-row gap-4 w-full">
                  <BookingDialog>
                    <Button
                      variant="primary"
                      size="lg"
                      className="px-8 sm:w-auto"
                    >
                      Schedule a call
                    </Button>
                  </BookingDialog>
                  <Button variant="ghost" size="lg" className="px-8 sm:w-auto">
                    Find out more
                  </Button>
                </div>
              </div>
            </div>
            <div
              id="hero-right-col"
              className="bg-pink-500/00 w-full grow h-full lg:min-w-1/2 lg:self-stretch"
            >
            <div className="flex items-center justify-center h-full w-full">
              <AutomationIllustration className="w-full h-auto" />
            </div>

            </div>
          </div>

        </div>
      </div>

      <FeatureSection
          title="Be 10x you"
          description="At Bizbo, we believe that user-centric design is the cornerstone of successful digital experiences. By prioritising the needs of your users, we create intuitive interfaces that not only engage but also convert."
          features={FEATURE_ITEMS}
          className="bg-muted"
        />
      <TestimonialsSection />
      <LogoSection />
      <AboutSection />

      <CtaSection variant="analysis" sectionTheme="dark" />
      <Footer />
    </div>
  );
}
