"use client"

import { Header } from "@/components/header"
import { FeatureSection } from "@/components/sections/FeatureSection"
import { CtaSection } from "@/components/sections/CtaSection"
import { Footer } from "@/components/sections/Footer"
import { LogoSection } from "@/components/sections/LogoSection"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { TempCTA } from "@/components/sections/tempCTA"
import Image from "next/image"



export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col ">
      <Header />
      <main className="flex-1">
        <section className="relative z-10 box-border flex w-full flex-1 flex-col  ">
          
          
          
          <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-16 bg-amber-400/20 min-h-[calc(100vh)]">
            <TempCTA />
            <div className="order-first aspect-square rounded-3xl md:order-none">
              <div className="relative flex h-full w-full items-end justify-center overflow-hidden rounded-2xl border border-dashed min-h-[calc(100vh)] border-neutral-400/40">
                <Image
                  src="/svg/circles.svg"
                  alt="Abstract circular accent graphic"
                  fill
                  className="object-cover object-left translate-y-[20%] md:translate-y-[200px]"
                  priority
                />
                <span className="relative z-10 text-sm font-semibold uppercase tracking-widest text-neutral-500">
                  Prototype Preview
                </span>
              </div>
            </div>
          </div>
        </section>



        <LogoSection />
        <CtaSection variant="analysis" sectionTheme="dark" />
      </main>
      <Footer />
    </div>
  )
}
