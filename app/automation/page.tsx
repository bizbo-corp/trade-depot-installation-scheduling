"use client"

import { Header } from "@/components/header"
import { FeatureSection } from "@/components/sections/FeatureSection"
import { CtaSection } from "@/components/sections/CtaSection"
import { Footer } from "@/components/sections/Footer"
import { HeroSection } from "@/components/sections/HeroSection"
import { LogoSection } from "@/components/sections/LogoSection"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"

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

export default function AutomationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <HeroSection
          sectionTheme="neutral-olive"
          title={
            <>
              <span className="text-muted-foreground">Become 10x you</span>
              <span className="block">with automations and integrated business tools</span>
            </>
          }
          description="Boost your business potential with our automation and integration services. Break down siloed technology choices and get digital working for you. Automation streamlines your processes, reduces manual effort, and keeps your business running 24/7. Marketing automation helps you generate GEO and SEO content and monitor paid search activity so you can stay focused on growth."
          features={[]}
          primaryCta={{
            text: "Get a website analysis",
          }}
          secondaryCta={undefined}
          lottieSrc={undefined}
        />

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

