"use client";

import { Header } from "@/components/header";
// import { HeroCircleScrollSection } from "@/components/sections/HeroCircleScrollSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { Footer } from "@/components/sections/Footer";
import { LogoSection } from "@/components/sections/LogoSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { TempCTA } from "@/components/sections/tempCTA";
import Image from "next/image";
import { ensureGsap } from "@/lib/gsap";

const CIRCLE_ART = "/svg/circles.svg";

export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col ">
      <Header />
      <main className="flex-1">
        {/* <HeroCircleScrollSection /> */}

        <div
          id="hero-scroll-section"
          className="min-h-[calc(100vh)] bg-amber-500/20 pt-16"
        >
          hero-scroll-section
          <div className="bg-red-500/20 p-12 top-10 right-10 left-10 bottom-10 w-full min-h-[calc(100vh-100px)]">
            <div
              id="hero-scroll-container"
              className="container mx-auto min-h-[calc(100vh-100px)] flex flex-col items-stretch lg:flex-row lg:items-stretch lg:h-[calc(100vh-100px)] justify-center px-4 md:px-6 bg-green-500/20"
            >
              <div
                id="hero-left-col"
                className="bg-lime-500/20 w-full grow h-full lg:min-w-1/2 lg:self-stretch"
              >
                Left
              </div>
              <div
                id="hero-right-col"
                className="bg-pink-500/20 w-full grow h-full lg:min-w-1/2 lg:self-stretch"
              >
                Right
              </div>
            </div>
            <div className="absolute bottom-0 w-full h-1/2 right-0 lg:w-1/2 lg:h-full bg-blue-500/20">  dwwddw</div>
          </div>
        </div>

        <LogoSection />
        <CtaSection variant="analysis" sectionTheme="dark" />
      </main>
      <Footer />
    </div>
  );
}
