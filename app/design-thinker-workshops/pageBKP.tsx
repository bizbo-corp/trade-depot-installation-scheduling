"use client"

import { Header } from "@/components/header"
import { FeatureSection } from "@/components/sections/FeatureSection"
import { CtaSection } from "@/components/sections/CtaSection"
import { Footer } from "@/components/sections/Footer"
import { HeroSection } from "@/components/sections/HeroSection"
import { LogoSection } from "@/components/sections/LogoSection"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"

const HERO_FEATURES = [
  { text: "Build the right product with real customer value" },
  { text: "Test, gain buy-in, and secure funding fast" },
  { text: "Beat your competition to market" },
]

const FEATURE_ITEMS = [
  {
    icon: "diamond",
    title: "Design-thinking process",
    description:
      "Explore user challenges, empathise with their needs, and develop solutions that you can test and validate. These workshops are great for building cohesive, collaborative teams and great products and services.",
  },
  {
    icon: "megaphone",
    title: "Brand strategy sessions",
    description:
      "Align your market position with your unique value proposition. We'll help craft a compelling brand voice that resonates with your target audience and consistently delivers your message.",
  },
  {
    icon: "pencil",
    title: "Co-designing",
    description:
      "Don't let your website turn away potential customers. Our accessible designs are compliant for every visitor, naturally boosting your visibility and organic search rankings.",
  },
  {
    icon: "users-rays",
    title: "Team development",
    description:
      "Build high-performing teams that drive results. We help you design and grow effective teams with improved communication, collaboration, and productivity.",
  },
  {
    icon: "lightbulb-exclamation-on",
    title: "Innovation catalysts",
    description:
      "We help teams break through creative blocks with proven ideation techniques. Our facilitators will guide your team to uncover breakthrough solutions to your most challenging business problems.",
  },
  {
    icon: "list-timeline",
    title: "Roadmap projects",
    description:
      "Evaluate your product roadmap and identify key opportunities for innovation. We help you prioritise features, align stakeholders, and create a clear path to success.",
  },
]

export default function DesignThinkerWorkshopsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <HeroSection
          sectionTheme="neutral-olive"
          title={
            <>
              <span className="block">Design Thinking workshops for</span>
              <span>collaboration and creativity.</span>
            </>
          }
          description="The Bizbo approach helps teams uncover hidden opportunities and tackle complex challenges effectively. We guide your team through a design-led process to explore user challenges and develop breakthrough solutions. Our facilitated workshops and expert sessions build cohesive, high-performing teams that transform ideas into actionable strategies and drive your business forward."
          features={HERO_FEATURES}
          primaryCta={{
            text: "Schedule a discovery call",
          }}
          secondaryCta={undefined}
          lottieSrc={undefined}
        />

        <FeatureSection
          title="Solve your toughest challenges with a design-led strategy"
          description="Dive deep to explore user challenges, empathise with their needs, and develop innovative solutions you can test and validate. These workshops are a great way to foster cohesive teams that build on each other's ideas and share their solutions."
          features={FEATURE_ITEMS}
          className="bg-muted"
        />

        <TestimonialsSection />
        <LogoSection />
        <CtaSection variant="discovery" sectionTheme="dark" />
      </main>
      <Footer />
    </div>
  )
}

