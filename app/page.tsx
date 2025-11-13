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
import { TempCTA } from "@/components/sections/tempCTA";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { useHeroScrollAnimation } from "@/hooks/useHeroScrollAnimation";
import { bitmapImages } from "@/lib/images";

export default function Home() {
  useHeroScrollAnimation();

  return (
    <div className="flex bg-background min-h-screen flex-col ">
      <Header />

      <div
        id="hero-scroll-section"
        className="min-h-[calc(100vh)] bg-amber-500/00 z-10 pt-16"
      >
        <div className="absolute right-0 bottom-0 w-[540px] h-[756px] rounded-b-none rounded-lg z-1002 overflow-hidden">
          <Image
            src={bitmapImages.desktopApp.path}
            alt={bitmapImages.desktopApp.alt}
            width={992}
            height={512}
            className="object-contain object-bottom w-full h-full"
            quality={100}
            priority
            
          />
        </div>

        <div className="absolute right-146 bottom-0 h-108 rounded-b-none rounded-lg z-1003 overflow-hidden border-0 border-red-500/100">
          <Image
            src={bitmapImages.mobileApp.path}
            alt={bitmapImages.mobileApp.alt}
            width={800}
            height={512}
            className="object-contain w-full h-full"
            quality={100}
            priority
          />
        </div>
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
            <div
              id="value-prop-section"
              className="fixed z-[1001] opacity-0 w-full bg-blue-500/00"
            >
              <ValuePropositionSection sectionTheme="dark" />
            </div>
          </div>
        </div>
      </div>

      <TestimonialsSection />
      <LogoSection />
      <AboutSection />

      <CtaSection variant="analysis" sectionTheme="dark" />
      <Footer />
    </div>
  );
}
