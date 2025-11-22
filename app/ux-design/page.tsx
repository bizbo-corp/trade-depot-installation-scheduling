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
import { UXProcessAccordion } from "@/components/ux-analysis/UXProcessAccordion";

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
              className="bg-lime-500/00 w-full grow h-full lg:min-w-2/3 bg-lime-500/00 lg:self-stretch md:flex md:flex-col md:justify-center"
            >
              <div className="flex flex-col gap-8 ">
                <div className="flex flex-col gap-6">
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl leading-none">
                    <span className="block">Want to grow twice as fast?</span>
                    <span className="block text-foreground/80 mt-1">You have two choices:</span>
                  </h1>
                  
                      <div className="flex flex-row gap-16">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <FaIcon
                          icon="circle-1"
                          style="duotone"
                          size={2}
                          className="h-12 w-12 shrink-0 text-foreground"
                        />
                        <h3 className="text-xl font-bold text-foreground md:text-2xl">
                          Throw good money after bad
                        </h3>
                      </div>
                                            <div className="flex items-center gap-4">

                      <ul className="flex flex-col gap-1.5 pl-14">
                        <li className="flex items-start gap-3">
                          <FaIcon
                            icon="square"
                            className="h-4 w-4 shrink-0 text-foreground/80 mt-1.5"
                          />
                          <span className="text-lg text-foreground/80">
                            Raise twice the cash
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <FaIcon
                            icon="square"
                            className="h-4 w-4 shrink-0 text-foreground/80 mt-1.5"
                          />
                          <span className="text-lg text-foreground/80">
                            Hire twice the staff
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <FaIcon
                            icon="square"
                            className="h-4 w-4 shrink-0 text-foreground/80 mt-1.5"
                          />
                          <span className="text-lg text-foreground/80">
                            Spend twice as much on ads
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <FaIcon
                            icon="square"
                            className="h-4 w-4 shrink-0 text-foreground/80 mt-1.5"
                          />
                          <span className="text-lg text-foreground/80">
                            Cross both your fingers
                          </span>
                        </li>
                      </ul>
                      </div>
                      </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <FaIcon
                          icon="circle-2"
                          style="duotone"
                          size={2}
                          className="h-12 w-12 shrink-0 text-foreground"
                        />
                        <h3 className="text-xl font-bold text-foreground md:text-2xl">
                          Optimise your UX
                        </h3>
                      </div>
                      <ul className="flex flex-col gap-1.5 pl-14">
                        <li className="flex items-start gap-3">
                          <FaIcon
                            icon="square"
                            className="h-4 w-4 shrink-0 text-foreground/80 mt-1.5"
                          />
                          <span className="text-lg text-foreground/80">
                            Increase conversions from 1% to 2% <br /><i>(That's twice as many)</i>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-xl font-medium leading-relaxed text-foreground/80 max-w-2xl">
                    Stop pouring money into websites & ads that don't convert. We optimise your digital presence to turn visitors into customers, not just traffic.
                  </p>
                </div>
                


                <div className="flex flex-col gap-4 w-full max-w-md">
                  <UXAnalysisForm />
                </div>
              </div>
            </div>
            <div
              id="hero-right-col"
              className="bg-pink-500/00 w-full grow h-full lg:min-w-1/3 bg-red-500/00 lg:self-stretch"
            >
            <div className="flex items-center justify-center h-full w-full">
              <UXIllustration className="w-full h-auto" />
            </div>

            </div>
          </div>

        </div>
      </div>
      <UXProcessAccordion />
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

    </div>
  );
}
