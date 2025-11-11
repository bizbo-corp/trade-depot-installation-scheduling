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
    icon: "chart-network",
    title: "Integrate your systems to boost sales and service",
    description:
      "We build custom integrations that link your CRM, sales tools, and applications, giving your team a holistic view of the customer to unlock new revenue opportunities.",
  },
  {
    icon: "arrow-pointer",
    title: "Differentiate your brand with unique digital presence",
    description:
      "From a custom-built brochure website to a bespoke Shopify store, we develop unique digital solutions that differentiate your brand and give you a competitive edge.",
  },
  {
    icon: "atom",
    title: "Build a consistent cross-platform design system",
    description:
      "Our design systems provide a scalable UI that enhances brand consistency. They bridge the gap between design and development, speeding up your time to market.",
  },
  {
    icon: "user",
    title: "Elevate your customer experience",
    description:
      "We design and build intuitive web applications, including AI-powered chatbots, to provide your customers with seamless, round-the-clock support and service.",
  },
  {
    icon: "microchip-ai",
    title: "Power your business with cloud and AI infrastructure",
    description:
      "Automatically read and capture data from emails and documents, format it, and transfer it to your systems, freeing up your team from manual entry.",
  },
  {
    icon: "rocket-launch",
    title: "Boost your team's productivity",
    description:
      "We build streamlined custom applications and agent setups that automate tedious workflows, connect siloed systems, and allow staff to focus on high-value tasks.",
  },
]

export default function DevelopmentPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <HeroSection
          sectionTheme="neutral-olive"
          title={
            <>
              <span>Tailored web development solutions for a</span>
              <span className="block text-muted-foreground">seamless user experience</span>
            </>
          }
          description="Tie together your process from workshop through design and turn your idea into an enhanced website. Whether you need a beautiful brochure site or a compelling web application, integration, or automation, we'll make sure every solution fits together for you."
          features={[]}
          primaryCta={{
            text: "Get a website analysis",
          }}
          secondaryCta={undefined}
          lottieSrc={undefined}
        />

        <FeatureSection
          title="User-centric design"
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

