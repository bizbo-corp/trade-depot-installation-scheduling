"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/sections/HeroSection"
import { ValuePropositionSection } from "@/components/sections/ValuePropositionSection"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { LogoSection } from "@/components/sections/LogoSection"
import { AboutSection } from "@/components/sections/AboutSection"
import { CtaSection } from "@/components/sections/CtaSection"
import { Footer } from "@/components/sections/Footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <HeroSection sectionTheme="light" />
        <ValuePropositionSection sectionTheme="light" />
        <TestimonialsSection />
        <LogoSection />
        <AboutSection />
        <CtaSection sectionTheme="dark" />
      </main>
      <Footer />
    </div>
  )
}
