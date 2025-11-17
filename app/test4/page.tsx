"use client";

import { Header } from "@/components/header";
// import { HeroCircleScrollSection } from "@/components/sections/HeroCircleScrollSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { Footer } from "@/components/sections/Footer";
import { LogoSection } from "@/components/sections/LogoSection";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { ValuePropositionSection } from "@/components/sections/ValuePropositionSection";
import { useHeroScrollAnimation } from "@/hooks/useHeroScrollAnimation";

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
];

export default function TestPage() {
  useHeroScrollAnimation();

  return (
    <div className="flex bg-background min-h-screen flex-col ">
      <Header />

      <div
        id="hero-scroll-section"
        className="min-h-[calc(100vh)] bg-amber-500/00 z-10 pt-16"
      >
        <div className="relative overflow-hidden bg-red-500/00 p-0 w-full min-h-[calc(200vh-100px)]">
          {/* Animated circles background */}
          {/* Top circle - smallest (w-3) - Olive-500 */}
          <div
            id="hero-accent0"
            className="absolute w-[200px] h-[200px] bg-background rounded-full z-1000"
          ></div>
          <div
            id="hero-accent1"
            className="absolute w-[800px] h-[400px] bg-olive-600/25 rounded-full z-30"
          ></div>
          {/* Middle circle (w-4) - Olive-400 */}
          <div
            id="hero-accent2"
            className="absolute w-[1200px] h-[800px] bg-olive-600/25 rounded-full z-20"
          ></div>
          {/* Bottom circle - largest (w-5) - Olive-300 */}
          <div
            id="hero-accent3"
            className="absolute w-[1600px] h-[1200px] bg-olive-600/25 rounded-full z-10"
          ></div>

          <div
            id="hero-scroll-container"
            className="container mx-auto min-h-[calc(100vh-100px)] flex flex-col items-stretch lg:flex-row lg:items-stretch lg:h-[calc(100vh-100px)] justify-center px-4 md:px-6 bg-green-500/00 relative z-40"
          >
            <div
              id="hero-left-col"
              className="bg-lime-500/00 w-full grow h-full lg:min-w-1/2 lg:self-stretch md:flex md:flex-col md:justify-center"
            >
            </div>
            <div
              id="hero-right-col"
              className="bg-pink-500/00 w-full grow h-full lg:min-w-1/2 lg:self-stretch"
            ></div>
          </div>
          <div className="relative">
            <div id="value-prop-section" className="fixed z-[1001] opacity-0 w-full bg-blue-500/00">
              <ValuePropositionSection sectionTheme="dark" />
            </div>
          </div>
        </div>
      </div>
      <div
        id="hero-scroll-section-two"
        className="bg-transparent min-h-screen z-20"
      >
        <div className="container">
          <FeatureSection
            title="User-centric design"
            description="At Bizbo, we believe that user-centric design is the cornerstone of successful digital experiences. By prioritising the needs of your users, we create intuitive interfaces that not only engage but also convert."
            features={FEATURE_ITEMS}
            className=""
          />
        </div>
      </div>
      <LogoSection />
      <CtaSection variant="analysis" sectionTheme="dark" />
      <Footer />
    </div>
  );
}
