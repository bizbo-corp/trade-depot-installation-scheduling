"use client"

import { Header } from "@/components/header"
import { FeatureSection } from "@/components/sections/FeatureSection"
import { CtaSection } from "@/components/sections/CtaSection"
import { Footer } from "@/components/sections/Footer"
import { HeroSection } from "@/components/sections/HeroSection"
import { LogoSection } from "@/components/sections/LogoSection"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"

const HERO_FEATURES = [
  { text: "Find quick-win user experience improvements" },
  { text: "Increase conversions and sales funnel health" },
  { text: "Boost accessibility and improve your page rank" },
]

const FEATURE_ITEMS = [
  {
    icon: "hand-scissors",
    title: "Eliminate user journey friction points",
    description:
      "We identify and remove the frustrating roadblocks on your website, from clunky forms to confusing checkout flows, so your visitors can convert into paying customers with ease.",
  },
  {
    icon: "rocket-launch",
    title: "Speed up your site and reduce bounce",
    description:
      "We optimise for fast loading times and responsiveness, making a great first impression and keeping people from leaving.",
  },
  {
    icon: "bullseye-pointer",
    title: "Reach more people and improve your SEO",
    description:
      "Don't let your website turn away potential customers. Our accessible designs are compliant for every visitor, naturally boosting your visibility and organic search rankings.",
  },
  {
    icon: "filter",
    title: "Continuous optimisation",
    description:
      "Let us help you run a hypothesis-driven optimisation to refine your website so it becomes the best tool it can be for generating leads and engaged customers.",
  },
  {
    icon: "heart-pulse",
    title: "Grow your business with a healthy sales funnel",
    description:
      "We guide visitors toward your goals, turning your website into an effective engine for leads, sign-ups, and sales.",
  },
  {
    icon: "vial",
    title: "Discover how your customers behave",
    description:
      "Our A/B and usability testing helps you understand what works and what doesn't, so you can make data-driven decisions that improve user experience and boost your bottom line.",
  },
]

export default function UxDesignPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <HeroSection
          sectionTheme="neutral-olive"
          title={
            <>
              <span className="block">Transform your digital presence with expert</span>
              <span className="text-muted-foreground">UX design</span>
            </>
          }
          description="Identify and eliminate user journey friction points for enhanced engagement and conversion. Our UX experts provide tailored insights to improve user engagement and boost conversion rates."
          features={HERO_FEATURES}
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

