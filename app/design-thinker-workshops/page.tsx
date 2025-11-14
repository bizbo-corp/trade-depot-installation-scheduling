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
import { DesignThinkingIllustration } from "@/app/design-thinker-workshops/DesignThinkingIllustration";

const FEATURE_ITEMS = [
  {
    icon: "diamond",
    title: "Design-thinking process",
    description:
      "Explore user challenges, empathise with their needs, and develop solutions that you can test and validate. These workshops are great for building cohesive, collaborative teams and great products and services.",
  },
  {
    icon: "megaphone",
    title: "Brand strategy sessions",
    description:
      "Align your market position with your unique value proposition. We'll help craft a compelling brand voice that resonates with your target audience and consistently delivers your message.",
  },
  {
    icon: "pencil",
    title: "Co-designing",
    description:
      "Don't let your website turn away potential customers. Our accessible designs are compliant for every visitor, naturally boosting your visibility and organic search rankings.",
  },
  {
    icon: "users-rays",
    title: "Team development",
    description:
      "Build high-performing teams that drive results. We help you design and grow effective teams with improved communication, collaboration, and productivity.",
  },
  {
    icon: "lightbulb-exclamation-on",
    title: "Innovation catalysts",
    description:
      "We help teams break through creative blocks with proven ideation techniques. Our facilitators will guide your team to uncover breakthrough solutions to your most challenging business problems.",
  },
  {
    icon: "list-timeline",
    title: "Roadmap projects",
    description:
      "Evaluate your product roadmap and identify key opportunities for innovation. We help you prioritise features, align stakeholders, and create a clear path to success.",
  },
];

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
                    <span className="mb-2 block">
                      Design Thinking workshops for{" "}
                    </span>
                    <span className="text-accent-foreground dark:text-accent-foreground">
                      collaboration and creativity.
                    </span>
                  </h1>
                  <p className="max-w-xl text-lg font-medium leading-relaxed text-foreground md:text-xl">
                    The Bizbo approach helps teams uncover hidden opportunities
                    and tackle complex challenges effectively. We guide your
                    team through a design-led process to explore user challenges
                    and develop breakthrough solutions. Our facilitated
                    workshops and expert sessions build cohesive,
                    high-performing teams that transform ideas into actionable
                    strategies and drive your business forward.
                  </p>
                </div>
                <ul className="flex flex-col gap-4">
                  <li className="flex items-start gap-3">
                    <FaIcon
                      icon="check"
                      className="mt-0.5 h-5 w-5 shrink-0 text-foreground md:h-6 md:w-6"
                    />
                    <span className="text-lg text-foreground/70 md:text-xl">
                      Build the right product with real customer value
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaIcon
                      icon="check"
                      className="mt-0.5 h-5 w-5 shrink-0 text-foreground md:h-6 md:w-6"
                    />
                    <span className="text-lg text-foreground/70 md:text-xl">
                      Test, gain buy-in, and secure funding fast
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaIcon
                      icon="check"
                      className="mt-0.5 h-5 w-5 shrink-0 text-foreground md:h-6 md:w-6"
                    />
                    <span className="text-lg text-foreground/70 md:text-xl">
                      Beat your competition to market
                    </span>
                  </li>
                </ul>
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
              <DesignThinkingIllustration className="w-full h-auto" />
            </div>

            </div>
          </div>

        </div>
      </div>

      <FeatureSection
        theme="dark"
        title="Solve your toughest challenges with a design-led strategy"
        description="Dive deep to explore user challenges, empathise with their needs, and develop innovative solutions you can test and validate. These workshops are a great way to foster cohesive teams that build on each other's ideas and share their solutions."
        features={FEATURE_ITEMS}
        className=""
      />
      <TestimonialsSection />
      <LogoSection />
      <AboutSection />

      <CtaSection variant="analysis" sectionTheme="dark" />
      <Footer />
    </div>
  );
}
