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
      const heroAccent = document.getElementById("hero-accent");
      if (!heroAccent) return;

      const container = heroAccent.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      
      // Calculate center position relative to bottom-right corner
      // Element is positioned at bottom-0 right-0, so we need to move it
      // to center: left by (containerWidth/2 - elementWidth/2), up by (containerHeight/2 - elementHeight/2)
      const calculateCenterTransform = () => {
        const finalSize = 2480; // Final size (2480px)

        // Since element is at bottom-right, negative x moves left, negative y moves up
        return {
          x: -(containerRect.width / 2 - finalSize / 2),
          y: -(containerRect.height / 2 - finalSize / 2),
        };
      };

      const centerPos = calculateCenterTransform();
      
      // Calculate starting position at midway point of height
      // Element is at bottom-0, so to move to midway point, move up by half the container height
      const startY = -(containerRect.height / 2);

      gsap
        .timeline({
          defaults: { ease: "power1.inOut", duration: 3 },
        })
        .fromTo(
          "#hero-accent",
          {
            // Start: right side at midway point of height
            x: 0,
            y: startY,
            width: "120px",
            height: "120px",
          },
          {
            // End: center of screen, scaled up (180px)
            x: centerPos.x,
            y: centerPos.y,
            width: "2480px",
            height: "2480px",
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
          <div className="relative overflow-hidden min-h-[calc(200vh-100px)] bg-amber-300/00">
            <div
              id="hero-accent"
              className="absolute w-5 h-5 bg-olive-500/10 rounded-full bottom-0 right-0"
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
