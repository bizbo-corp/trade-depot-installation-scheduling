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
            transformOrigin: "bottom right",
            height: "20vh",
            width: "50vw",
            scaleY: 0.4,
            right: "0",
          },
          {
            transformOrigin: "top center",
            height: "100vh",
            width: "100vw",
            scaleY: 2,
          }
        );
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
              className="bg-lime-500/20 w-full grow h-full lg:min-w-1/2 lg:self-stretch"
            >
              Left
            </div>
            <div
              id="hero-right-col"
              className="bg-pink-500/05 w-full grow h-full lg:min-w-1/2 lg:self-stretch"
            >
              Right
            </div>
          </div>
          <div
            id="hero-accent"
            className="absolute -z-10 bottom-0 right-0 bg-blue-500/80 border border-red-500"
          >
            id="hero-accent
          </div>
        </div>
      </div>
      <div className="bg-blue-500/10 min-h-screen">sss</div>
      <LogoSection />
      <CtaSection variant="analysis" sectionTheme="dark" />
      <Footer />
    </div>
  );
}
