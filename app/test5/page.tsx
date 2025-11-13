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

const CIRCLE_ART = "/svg/circles.svg";

export default function TestPage() {
  useEffect(() => {
    const { gsap } = ensureGsap();
    const context = gsap.context(() => {
      const heroAccent1 = document.getElementById("hero-accent1");
      const heroAccent2 = document.getElementById("hero-accent2");
      const heroAccent3 = document.getElementById("hero-accent3");
      
      if (!heroAccent1 || !heroAccent2 || !heroAccent3) return;

      const heroScrollSection = document.getElementById("hero-scroll-section");
      if (!heroScrollSection) return;

      const container = heroAccent1.parentElement;
      if (!container) return;

      // Get actual computed sizes from elements
      const heroAccent1Rect = heroAccent1.getBoundingClientRect();
      const heroAccent2Rect = heroAccent2.getBoundingClientRect();
      const heroAccent3Rect = heroAccent3.getBoundingClientRect();

      const heroScrollSectionRect = heroScrollSection.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      // Calculate center position relative to bottom-right corner
      const calculateCenterTransform = (finalSize: number) => {
        return {
          x: -(containerRect.width / 2 - finalSize / 2),
          y: -(containerRect.height / 2 - finalSize / 2),
        };
      };

      // Get actual starting sizes from computed dimensions
      const actualSizes = {
        top: heroAccent1Rect.width,    // hero-accent1
        middle: heroAccent2Rect.width, // hero-accent2
        bottom: heroAccent3Rect.width, // hero-accent3
      };

      // Scale factor for final size (proportional to starting size)
      const scaleFactor = 12.4;

      // Calculate starting position: center at 50% down hero-scroll-section, 0% from right
      const heroScrollSection50Percent = heroScrollSectionRect.top + heroScrollSectionRect.height / 2;
      // Convert 50% of hero-scroll-section to position relative to container top
      const yPositionFromTop = heroScrollSection50Percent - containerRect.top;

      // Set initial positions immediately, overriding CSS bottom-0 right-0
      const elements = [
        { element: heroAccent1, size: actualSizes.top },
        { element: heroAccent2, size: actualSizes.middle },
        { element: heroAccent3, size: actualSizes.bottom },
      ];

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
        });
      });

      // Create timeline with 2 second delay before animation starts
      const timeline = gsap.timeline({
        defaults: { ease: "power2.out", duration: 3 },
        delay: 2, // 2 second delay before any animation starts
      });

      // Stagger delay between each animation (in seconds)
      const staggerDelay = 0.4;

      // Animate all three circles with stagger
      elements.forEach(({ element, size }, index) => {
        const finalSize = size * scaleFactor;
        const centerPos = calculateCenterTransform(finalSize);
        const startTime = index * staggerDelay; // Stagger each animation
        
        timeline.to(
          element,
          {
            // End: center of screen, scaled proportionally
            x: centerPos.x,
            y: centerPos.y,
            width: `${finalSize}px`,
            height: `${finalSize}px`,
            ease: "power2.out",
          },
          startTime // Stagger the start time
        );
      });
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
        className="min-h-[calc(100vh)] bg-amber-500/00 z-10 pt-16 border-2 border-red-500"
      >
        hero-scroll-section
          <div className="relative overflow-hidden min-h-[calc(200vh-100px)] bg-amber-300/00">
            {/* Top circle - smallest (w-3) - Olive-500 */}
            <div
              id="hero-accent1"
              className="absolute w-[200px] h-[200px] bg-olive-500/10 rounded-full z-30"
            ></div>
            {/* Middle circle (w-4) - Olive-400 */}
            <div
              id="hero-accent2"
              className="absolute w-[300px] h-[300px] bg-olive-400/10 rounded-full z-20"
            ></div>
            {/* Bottom circle - largest (w-5) - Olive-300 */}
            <div
              id="hero-accent3"
              className="absolute w-[400px] h-[400px] bg-olive-300/10 rounded-full z-10"
            ></div>
          </div>
        </div>
      <div className="bg-transparent min-h-screen z-20"></div>
      <LogoSection />
      <CtaSection variant="analysis" sectionTheme="dark" />
      <Footer />
    </div>
  );
}
