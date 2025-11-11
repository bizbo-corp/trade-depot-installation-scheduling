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

const CIRCLE_ART = "/svg/circles.svg";

export default function TestPage() {
  useEffect(() => {
    const { gsap } = ensureGsap();
    const context = gsap.context(() => {
      // This is a Tween
      gsap.to(".box", { rotation: 360, x: 200, duration: 1, repeat: 20, yoyo: true });

      // And this is a Timeline, containing three sequenced tweens
      const tl = gsap.timeline();

      tl.to("#green", { duration: 1, x: 786, ease: "power2.inOut" })
        .to("#blue", { duration: 2, x: 786, ease: "power2.inOut" })
        .to("#orange", { duration: 1, x: 786, ease: "power2.inOut" });
    });

    return () => {
      context.revert();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col ">
      <Header />

        <div
          id="hero-scroll-section"
          className="min-h-[calc(100vh)] bg-amber-500/10 pt-16"
        >
          hero-scroll-section
          <div className="bg-red-500/10 p-12 top-10 right-10 left-10 bottom-10 w-full min-h-[calc(100vh-100px)]">
            <div
              id="hero-scroll-container"
              className="container mx-auto min-h-[calc(100vh-100px)] flex flex-col items-stretch lg:flex-row lg:items-stretch lg:h-[calc(100vh-100px)] justify-center px-4 md:px-6 bg-green-500/10"
            >
              <div
                id="hero-left-col"
                className="bg-lime-500/10 w-full grow h-full lg:min-w-1/2 lg:self-stretch"
              >
                Left
              </div>
              <div
                id="hero-right-col"
                className="bg-pink-500/10 w-full grow h-full lg:min-w-1/2 lg:self-stretch"
              >
                Right
              </div>
            </div>
            <div className="absolute bottom-0 w-full h-1/2 right-0 lg:w-1/2 lg:h-full bg-blue-500/10">
              <div className="relative h-full w-full overflow-hidden">
                <div className="box w-16 h-16 mt-24 bg-amber-400/80 flex items-center justify-center text-lg font-semibold text-white">
                  aa
                </div>
                <div className="mt-8 flex flex-col gap-4">
                  <div
                    id="green"
                    className="h-12 w-12 rounded-full bg-green-500"
                  ></div>
                  <div
                    id="blue"
                    className="h-12 w-12 rounded-full bg-blue-500"
                  ></div>
                  <div
                    id="orange"
                    className="h-12 w-12 rounded-full bg-orange-500"
                  ></div>
                </div>
                <Image
                  src="/svg/circles.svg"
                  alt="Abstract circular accent graphic"
                  fill
                  className="object-cover object-top lg:object-left"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        <LogoSection />
        <CtaSection variant="analysis" sectionTheme="dark" />
      <Footer />
    </div>
  );
}
