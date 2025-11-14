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
import { DevelopmentIllustration } from "@/app/development/DevelopmentIllustration";

const FEATURE_ITEMS = [
  {
    icon: "chart-network",
    title: "Integrate your systems to boost sales and service",
    description:
      "We build custom integrations that link your CRM, sales tools, and applications, giving your team a holistic view of the customer to unlock new revenue opportunities.",
  },
  {
    icon: "arrow-pointer",
    title: "Differentiate your brand with unique digital presence",
    description:
      "From a custom-built brochure website to a bespoke Shopify store, we develop unique digital solutions that differentiate your brand and give you a competitive edge.",
  },
  {
    icon: "atom",
    title: "Build a consistent cross-platform design system",
    description:
      "Our design systems provide a scalable UI that enhances brand consistency. They bridge the gap between design and development, speeding up your time to market.",
  },
  {
    icon: "user",
    title: "Elevate your customer experience",
    description:
      "We design and build intuitive web applications, including AI-powered chatbots, to provide your customers with seamless, round-the-clock support and service.",
  },
  {
    icon: "microchip-ai",
    title: "Power your business with cloud and AI infrastructure",
    description:
      "Automatically read and capture data from emails and documents, format it, and transfer it to your systems, freeing up your team from manual entry.",
  },
  {
    icon: "rocket-launch",
    title: "Boost your team's productivity",
    description:
      "We build streamlined custom applications and agent setups that automate tedious workflows, connect siloed systems, and allow staff to focus on high-value tasks.",
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
              <span>Tailored web development solutions for a </span><span className="text-muted-foreground">seamless user experience</span>
                  </h1>
                  <p className="max-w-xl text-lg font-medium leading-relaxed text-foreground md:text-xl">
                  Tie together your process from workshop, design and turn your idea or enhance your website.
                  Whether you need to create a beautiful brochure website or a compelling web application, integration or automation, we can see the solution fits together for you.                   </p>
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
              <DevelopmentIllustration className="w-full h-auto" />
            </div>

            </div>
          </div>

        </div>
      </div>

      <FeatureSection
          title="Unify your technology, amplify your growth."
          description="We create bespoke digital solutions that seamlessly integrate all your business tools, from CRM and web applications to AI-powered chatbots. The result is a powerful, unified platform that drives sales, elevates your customer experience, and boosts your team's productivity."
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
