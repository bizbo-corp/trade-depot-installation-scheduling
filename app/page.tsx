"use client";

import Image from "next/image";
import { Header } from "@/components/header";
import { Header as HeaderComponent } from "@/components/header"; // Alias to avoid conflict if needed, but Header is fine
import { HeroSection } from "@/components/sections/HeroSection";
import { ValuePropositionSection } from "@/components/sections/ValuePropositionSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { LogoSection } from "@/components/sections/LogoSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { Footer } from "@/components/sections/Footer";
import { CTAhome } from "@/components/sections/CTAhome";
import { FeatureSection } from "@/components/sections/FeatureSection";

import { bitmapImages, svgGraphics } from "@/lib/images";
import { FaIcon } from "@/components/ui/fa-icon";
import { Button } from "@/components/ui/button";
import { LottieAnimation } from "@/components/LottieAnimation";
import { animations } from "@/lib/images";

import { UXProcessAccordion } from "@/components/ux-analysis/UXProcessAccordion";
import { InstallationServices } from "@/components/sections/installation-services";
import { PaperPlaneMoney } from "@/components/icons/PaperPlaneMoney";

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
];

export default function Home() {
  return (
    <div className="flex bg-background flex-col ">
      <Header />
      <div
        id="hero-scroll-section"
        className="min-h-[calc(100vh)] bg-amber-500/0 z-10"
      >
        <div className="relative overflow-hidden p-0 w-full min-h-[calc(200vh)] ">
          {/* Animated circles background */}

          <div
            id="hero-scroll-container"
            className="container mx-auto flex flex-col items-stretch lg:flex-row lg:items-stretch lg:h-[calc(100vh)] justify-center px-4 md:px-6 relative z-40"
          >
            <div
              id="hero-left-col"
              className="bg-lime-500/00 w-full grow h-full lg:min-w-2/3 bg-lime-500/0 lg:self-stretch md:flex md:flex-col md:justify-center"
            >
              <div className="flex flex-col gap-4 md:gap-8 ">
                <div className="flex flex-col gap-3 md:gap-6">
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl leading-tight md:leading-none">
                    <span className="block">Installation services</span>
                  </h1>

                  <div className="flex flex-col md:flex-row gap-6 md:gap-16">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold border bg-muted text-foreground border-border group-hover:border-primary/50 group-hover:text-foreground">
                          1
                        </span>
                        <h3 className="text-lg font-bold text-foreground md:text-2xl">
                          Select your time slot
                        </h3>
                      </div>
                      <ul className="flex flex-col gap-1 pl-12 md:pl-16 md:gap-1.5">
                        <li className="flex items-start gap-3">
                          <FaIcon
                            icon="square"
                            className="h-4 w-4 shrink-0 text-foreground/80 mt-1.5"
                          />
                          <span className="text-base md:text-lg text-foreground/80">
                            Increase conversions from 1% to 2% <br />
                            <strong>(That's twice as many)</strong>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-base md:text-xl font-medium leading-normal md:leading-relaxed text-foreground/80 max-w-2xl pt-24">
                    Stop pouring money into websites & ads that don't convert.
                    We optimise your digital presence to turn visitors into
                    customers, not just traffic.
                  </p>
                </div>
              </div>
            </div>
            <div
              id="hero-right-col"
              className="bg-pink-500/00 w-full grow h-full lg:min-w-1/3 bg-red-500/0 lg:self-stretch order-first md:order-last"
            >
              <div className="flex justify-center md:justify-center h-full">
                <div className="w-32 md:w-full lg:w-[240%] lg:-mr-[50%] md:h-full flex flex-col justify-center -pt-24 z-[1001]">
                  <InstallationServices />
                </div>
              </div>
            </div>
          </div>
          <div className="relative min-h-[calc(100vh-100px)] flex flex-col justify-center items-center bg-foreground/00 z-[20000] ">
            <UXProcessAccordion />
          </div>
          <div className="relative min-h-[calc(100vh-100px)] flex flex-col justify-center items-center bg-foreground/0 z-[20000] "></div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
