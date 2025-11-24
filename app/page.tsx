"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/sections/Footer";

import { UXProcessAccordion } from "@/components/ux-analysis/UXProcessAccordion";
import { InstallationServices } from "@/components/sections/installation-services";
import { BookingFlow } from "@/components/BookingFlow";

export default function Home() {
  return (
    <div className="flex bg-background flex-col ">
      <Header />
      <div
        id="hero-scroll-section"
        className="min-h-[calc(100vh)] bg-amber-500/0 z-10"
      >
        <div className="relative overflow-hidden p-0 w-full min-h-[calc(200vh)] ">
          {/* Animated circles background */}

          <div
            id="hero-scroll-container"
            className="container mx-auto flex flex-col items-stretch lg:flex-row lg:items-stretch lg:h-[calc(100vh)] justify-center px-4 md:px-6 relative z-40"
          >
            <div
              id="hero-left-col"
              className="bg-lime-500/00 w-full grow h-full lg:min-w-2/3 bg-lime-500/0 lg:self-stretch md:flex md:flex-col md:justify-center"
            >
              <div className="flex flex-col gap-4 md:gap-8 ">
                <div className="flex flex-col gap-3 md:gap-6">
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl leading-tight md:leading-none">
                    <span className="block">Installation services</span>
                  </h1>

                  <div className="flex flex-col md:flex-row gap-6 md:gap-16">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold border bg-muted text-foreground border-border group-hover:border-primary/50 group-hover:text-foreground">
                          1
                        </span>
                        <h3 className="text-lg font-bold text-foreground md:text-2xl">
                          Select your time slot
                        </h3>
                      </div>
                      <ul className="flex flex-col gap-1 pl-12 md:pl-16 md:gap-1.5">
                        <li className="flex items-start gap-3">
                          <span className="text-base md:text-lg text-foreground/80">
                            <BookingFlow orderId="12345" />
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-base md:text-xl font-medium leading-normal md:leading-relaxed text-foreground/80 max-w-2xl pt-24">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam nec metus nec ante finibus finibus. Nullam nec metus
                    nec ante finibus finibus. Nullam nec metus nec ante finibus
                    finibus.
                  </p>
                </div>
              </div>
            </div>
            <div
              id="hero-right-col"
              className="bg-pink-500/00 w-full grow h-full lg:min-w-1/3 bg-red-500/0 lg:self-stretch order-first md:order-last"
            >
              <div className="flex justify-center md:justify-center h-full">
                <div className="w-32 md:w-full lg:w-[240%] lg:-mr-[50%] md:h-full flex flex-col justify-center -pt-24 z-[1001]">
                  <InstallationServices />
                </div>
              </div>
            </div>
          </div>
          <div className="relative min-h-[calc(100vh-100px)] flex flex-col justify-center items-center bg-foreground/00 z-[20000] ">
            <UXProcessAccordion />
          </div>
          <div className="relative min-h-[calc(100vh-100px)] flex flex-col justify-center items-center bg-foreground/0 z-[20000] "></div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
