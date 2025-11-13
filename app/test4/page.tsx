"use client";

import { useEffect } from "react";
import { Header } from "@/components/header";
// import { HeroCircleScrollSection } from "@/components/sections/HeroCircleScrollSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { Footer } from "@/components/sections/Footer";
import { LogoSection } from "@/components/sections/LogoSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { TempCTA } from "@/components/sections/tempCTA";
import Image from "next/image";
import { ensureGsap } from "@/lib/gsap";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { ValuePropositionSection } from "@/components/sections/ValuePropositionSection";

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

const CIRCLE_ART = "/svg/circles.svg";

export default function TestPage() {
  useEffect(() => {
    const { gsap, ScrollTrigger } = ensureGsap();
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "power1.inOut", duration: 3 },
          scrollTrigger: {
            trigger: "#hero-scroll-section",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        })
        .fromTo(
          "#hero-accent",
          {
            transformOrigin: "left center",
            height: "40vh",
            width: "50vw",
            scaleX: 0.2,
            scaleY: 0.2,
            backgroundPosition: "bottom -500px, right -500px",
          },
          {
            transformOrigin: "center center",
            height: "100vh",
            width: "100vw",
            scaleX: 4,
            scaleY: 4,
          }
        );
    });

    return () => {
      context.revert();
    };
  }, []);

  return (
    <div className="flex bg-background min-h-screen flex-col ">
      <Header />

      <div
        id="hero-scroll-section"
        className="min-h-[calc(100vh)] bg-amber-500/00 z-10 pt-16"
      >
        hero-scroll-section
        <div className="bg-red-500/00 p-12 top-10 right-10 left-10 bottom-10 w-full min-h-[calc(100vh-100px)]">
          <div
            id="hero-scroll-container"
            className="container mx-auto min-h-[calc(100vh-100px)] flex flex-col items-stretch lg:flex-row lg:items-stretch lg:h-[calc(100vh-100px)] justify-center px-4 md:px-6 bg-green-500/00"
          >
            <div
              id="hero-left-col"
              className="bg-lime-500/0 w-full grow h-full lg:min-w-1/2 lg:self-stretch"
            >
              <TempCTA />
            </div>
            <div
              id="hero-right-col"
              className="bg-pink-500/00 w-full grow h-full lg:min-w-1/2 lg:self-stretch"
            >
              Right
            </div>
          </div>
          <div
            id="hero-accent"
            className="absolute -z-10 bottom-0 right-0"
          >
          {/* Manually import the SVG */}
          {/*
            eslint-disable-next-line @next/next/no-img-element
          */}
          <img
            src="/svg/circles.svg"
            alt="Circle Manual Import"
            style={{
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "fill  ",
              aspectRatio: "1/1",
              zIndex: -1,
              pointerEvents: "none"
            }}
            draggable={false}
          />
          </div>
        </div>
      </div>
      <div className="bg-tra min-h-screen z-20">
        <div className="container">

        <ValuePropositionSection sectionTheme="dark" />
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
