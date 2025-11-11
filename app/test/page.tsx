"use client"

import { Header } from "@/components/header"
import { FeatureSection } from "@/components/sections/FeatureSection"
import { CtaSection } from "@/components/sections/CtaSection"
import { Footer } from "@/components/sections/Footer"
import { LogoSection } from "@/components/sections/LogoSection"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const FEATURE_ITEMS = [
  {
    icon: "rocket-launch",
    title: "Scale your business",
    description:
      "Automation lets you handle a higher volume of traffic and orders without adding staff, giving you the flexibility to meet demand without increasing your overheads.",
  },
  {
    icon: "square-user",
    title: "Improve customer engagement",
    description:
      "Boost conversions with timely, personalised offers that resonate with each customer. Time messaging and strike when it counts.",
  },
  {
    icon: "message-bot",
    title: "Provide 24/7 customer support",
    description:
      "Give your customers instant answers around the clock with intelligent chatbots trained on your company's information, improving satisfaction and freeing up your team.",
  },
  {
    icon: "square-dollar",
    title: "Build and qualify leads",
    description:
      "Automatically find new prospects online, extract key information, and qualify them, allowing your sales team to focus on closing.",
  },
  {
    icon: "scissors",
    title: "Eliminate repetitive tasks",
    description:
      "Automatically read and capture data from emails and documents, format it, and transfer it to your systems, freeing up your team from manual entry.",
  },
  {
    icon: "megaphone",
    title: "Turn your content into a powerful growth engine",
    description:
      "Stop creating content that just sits there. We build a content strategy engineered for organic SEO and AI search, turning visitors into loyal customers and brand advocates.",
  },
]

const HERO_CHECKLIST = [
  "Launch a user-ready prototype in weeks, not months.",
  "Validate with real customers before you invest heavily.",
  "Optimise every build sprint with embedded AI co-pilots.",
]

export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container relative z-10 flex w-full flex-1 flex-col justify-center gap-12 px-4 py-16 md:px-6 md:py-24">
          <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-16">
            <div className="flex flex-col gap-8 md:max-w-2xl">
              <div className="flex flex-col gap-6">
                <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl lg:text-6xl">
                  <span className="mb-2 block">From idea to app.</span>
                  <span className="text-accent-foreground dark:text-accent-foreground">
                    We build it.
                  </span>
                </h1>
                <p className="max-w-xl text-lg font-medium leading-relaxed text-foreground md:text-xl">
                  Partner with Bizbo to design, prototype, and launch the next generation of digital
                  products. We combine user-centred design, automation, and AI-assisted development to
                  remove the bottlenecks that hold brilliant ideas back.
                </p>
              </div>
              <ul className="flex flex-col gap-4">
                {HERO_CHECKLIST.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-foreground md:h-6 md:w-6" />
                    <span className="text-lg text-foreground/70 md:text-xl">{item}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="w-full px-8 sm:w-auto">
                Start your build
              </Button>
            </div>
            <div className="order-first aspect-square rounded-3xl bg-neutral-200/40 p-6 dark:bg-neutral-800/40 md:order-none">
              <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-neutral-400/40 bg-background/80">
                <span className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
                  Prototype Preview
                </span>
              </div>
            </div>
          </div>
        </section>

        <FeatureSection
          title="Be 10x you"
          description="At Bizbo, we believe that user-centric design is the cornerstone of successful digital experiences. By prioritising the needs of your users, we create intuitive interfaces that not only engage but also convert."
          features={FEATURE_ITEMS}
          className="bg-muted"
        />

        <TestimonialsSection />
        <LogoSection />
        <CtaSection variant="analysis" sectionTheme="dark" />
      </main>
      <Footer />
    </div>
  )
}
