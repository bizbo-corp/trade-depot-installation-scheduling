"use client";

import { Header } from "@/components/header";
import { CtaSection } from "@/components/sections/CtaSection";
import { Footer } from "@/components/sections/Footer";
import { UXAnalysisForm } from "@/components/ux-analysis/UXAnalysisForm";



export default function Home() {


  return (
    <div className="flex bg-background flex-col ">
      <Header />

      <div id="hero-scroll-section" className=" bg-amber-500/05 z-10 pt-16">
        <div className="relative overflow-hidden bg-red-500/00 p-0 w-full ">
          <div
            id="hero-scroll-container"
            className="container mx-auto flex flex-col justify-center px-4 md:px-6 bg-green-500/00 relative z-40"
          >
            <div
              id="hero-left-col"
              className="bg-lime-500/00 w-full grow h-full lg:self-stretch md:flex md:flex-col md:justify-center"
            >
              <div className="flex flex-col gap-8 w-full">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-6xl">
                  Get a website analysis!
                </h1>

                <UXAnalysisForm />
              </div>
            </div>
          </div>
        </div>
      </div>



      <CtaSection variant="analysis" sectionTheme="dark" />
      <Footer />
    </div>
  );
}
