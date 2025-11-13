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
];

const CIRCLE_ART = "/svg/circles.svg";

export default function TestPage() {
  useEffect(() => {
    const { gsap, ScrollTrigger } = ensureGsap();
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const heroAccent0 = document.getElementById("hero-accent0");
      const heroAccent1 = document.getElementById("hero-accent1");
      const heroAccent2 = document.getElementById("hero-accent2");
      const heroAccent3 = document.getElementById("hero-accent3");

      if (!heroAccent0 || !heroAccent1 || !heroAccent2 || !heroAccent3) return;

      const heroScrollSection = document.getElementById("hero-scroll-section");
      if (!heroScrollSection) return;

      const container = heroAccent1.parentElement;
      if (!container) return;

      // Get actual computed sizes from elements
      const heroAccent0Rect = heroAccent0.getBoundingClientRect();
      const heroAccent1Rect = heroAccent1.getBoundingClientRect();
      const heroAccent2Rect = heroAccent2.getBoundingClientRect();
      const heroAccent3Rect = heroAccent3.getBoundingClientRect();

      const heroScrollSectionRect = heroScrollSection.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Get actual starting sizes from computed dimensions
      const actualSizes = {
        accent0: heroAccent0Rect.width, // hero-accent0
        top: heroAccent1Rect.width, // hero-accent1
        middle: heroAccent2Rect.width, // hero-accent2
        bottom: heroAccent3Rect.width, // hero-accent3
      };

      // Scale factor for final size (proportional to starting size)
      const scaleFactor = 3.2;

      // Calculate starting position: center at 50% down hero-scroll-section, 0% from right
      const heroScrollSection50Percent =
        heroScrollSectionRect.top + heroScrollSectionRect.height / 2;
      // Convert 50% of hero-scroll-section to position relative to container top
      const yPositionFromTop = heroScrollSection50Percent - containerRect.top;

      // Calculate final position: center horizontally (50% X), same Y position (50% down hero-scroll-section)
      const calculateFinalTransform = (finalSize: number) => {
        return {
          x: containerRect.width / 2 - finalSize / 2, // Center horizontally
          y: yPositionFromTop - finalSize / 2, // Same Y position as start (50% down hero-scroll-section)
        };
      };

      // Set initial positions immediately, overriding CSS bottom-0 right-0
      const elements = [
        { element: heroAccent1, size: actualSizes.top },
        { element: heroAccent2, size: actualSizes.middle },
        { element: heroAccent3, size: actualSizes.bottom },
      ];
      
      // hero-accent0 will be animated separately with a delay
      const heroAccent0Element = { element: heroAccent0, size: actualSizes.accent0 };

      elements.forEach(({ element, size }) => {
        // Override CSS positioning and set initial position
        // Position center at right edge (x = container width - half circle size)
        // Position center at 50% height of hero-scroll-section (y = yPositionFromTop - half circle size)
        gsap.set(element, {
          bottom: "auto",
          right: "auto",
          left: "auto",
          top: "auto",
          x: containerRect.width - size / 2, // Center at right edge
          y: yPositionFromTop - size / 2, // Center at 50% of hero-scroll-section height
          width: `${size}px`,
          height: `${size}px`,
          opacity: 1, // Start invisible, will fade in during final quarter
        });
      });

      // Set initial position for hero-accent0
      gsap.set(heroAccent0Element.element, {
        bottom: "auto",
        right: "auto",
        left: "auto",
        top: "auto",
        x: containerRect.width - heroAccent0Element.size / 2, // Center at right edge
        y: yPositionFromTop - heroAccent0Element.size / 2, // Center at 50% of hero-scroll-section height
        width: `${heroAccent0Element.size}px`,
        height: `${heroAccent0Element.size}px`,
      });
      

      // Calculate scroll end point: 50% of hero-scroll-section height
      const scrollEndDistance = heroScrollSectionRect.height * 0.5;

      // Create timeline with ScrollTrigger
      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: heroScrollSection,
          start: "top+=250 top", // When top of hero-scroll-section hits top of viewport + 150px delay
          end: `+=${scrollEndDistance}`, // End after scrolling 50% of hero-scroll-section height
          scrub: true, // Tie animation progress to scroll position
        },
      });

      // Animate all three circles (no stagger, all animate together)
      elements.forEach(({ element, size }) => {
        const finalSize = size * scaleFactor;
        const finalPos = calculateFinalTransform(finalSize);

        timeline.fromTo(
          element,
          {
            // Start: right edge, 50% down hero-scroll-section (already set with gsap.set)
            x: containerRect.width - size / 2,
            y: yPositionFromTop - size / 2,
            width: `${size}px`,
            height: `${size}px`,
          },
          {
            // End: center horizontally (50% X), same Y position (50% down hero-scroll-section), scaled proportionally
            x: finalPos.x,
            y: finalPos.y,
            width: `${finalSize}px`,
            height: `${finalSize}px`,
            ease: "power2.out",
          },
          0 // All animations start at the same time
        );

      });

      // Animate hero-accent0 with a staggered delay after the other circles start
      const scaleFactor0 = scaleFactor * 4; // 4x the scale factor of other circles
      const finalSize0 = heroAccent0Element.size * scaleFactor0;
      const finalPos0 = calculateFinalTransform(finalSize0);
      const staggerDelay = 0.02; // Delay in timeline (20% of scroll distance)

      timeline.fromTo(
        heroAccent0Element.element,
        {
          // Start: right edge, 50% down hero-scroll-section (already set with gsap.set)
          x: containerRect.width - heroAccent0Element.size / 2,
          y: yPositionFromTop - heroAccent0Element.size / 2,
          width: `${heroAccent0Element.size}px`,
          height: `${heroAccent0Element.size}px`,
        },
        {
          // End: center horizontally (50% X), same Y position (50% down hero-scroll-section), scaled proportionally
          x: finalPos0.x,
          y: finalPos0.y,
          width: `${finalSize0}px`,
          height: `${finalSize0}px`,
          ease: "power2.out",
        },
        staggerDelay // Start after other circles have begun moving
      );

      // Animate all hero accent circles to scale down, move to 0,0, and fade out
      // Starting at 25% of timeline (last three-quarters)
      const allHeroAccents = [
        { element: heroAccent0, originalWidth: heroAccent0Rect.width, originalHeight: heroAccent0Rect.height },
        { element: heroAccent1, originalWidth: heroAccent1Rect.width, originalHeight: heroAccent1Rect.height },
        { element: heroAccent2, originalWidth: heroAccent2Rect.width, originalHeight: heroAccent2Rect.height },
        { element: heroAccent3, originalWidth: heroAccent3Rect.width, originalHeight: heroAccent3Rect.height },
      ];

      allHeroAccents.forEach(({ element, originalWidth, originalHeight }) => {
        // Scale down, move to 0,0 (top-left of browser), and fade out from 25% to 100% of timeline
        // Since GSAP x/y are relative to element center, we need to offset by half the size
        // to position the top-left corner at 0,0
        timeline.to(
          element,
          {
            x: originalWidth / 2, // Move center to left edge + half width (so left edge is at 0)
            y: originalHeight / 2, // Move center to top edge + half height (so top edge is at 0)
            width: `${originalWidth}px`, // Scale back to original width
            height: `${originalHeight}px`, // Scale back to original height
            opacity: 0, // Fade out
            ease: "power2.in",
          },
          0.25 // Start at 25% of timeline (last three-quarters)
        );
      });

      // Animate ValuePropositionSection fade-in, pause, and fade-out
      const valuePropSection = document.getElementById("value-prop-section");
      if (valuePropSection) {
        // Set initial state: invisible and fixed
        gsap.set(valuePropSection, {
          opacity: 0,
          position: "fixed",
          top: 0,
          left: 0,
        });

        // Fade in from 30% to 40% of timeline (10% scroll distance)
        timeline.fromTo(
          valuePropSection,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            ease: "power2.out",
            duration: 0.1, // 10% of timeline duration
          },
          0.3 // Start fade-in at 30% of timeline
        );

        // Hold at full opacity (pause) from 40% to 70% of timeline
        // This happens automatically as there's no animation between fade-in and fade-out

        // Fade out from 70% to 90% of timeline (20% scroll distance)
        timeline.to(
          valuePropSection,
          {
            opacity: 0,
            ease: "power2.in",
            duration: 0.2, // 20% of timeline duration
          },
          0.6 // Start fade-out at 70% of timeline
        );
      }
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
              <TempCTA />
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
