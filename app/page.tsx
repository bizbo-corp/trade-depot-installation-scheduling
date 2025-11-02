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
  // Hero Section Data
  const heroData = {
    title: (
      <>
        From idea to app. <br />We build it.
      </>
    ),
    description: "Simplify the process of building a market-defining digital web app - one your customers can't live without and your rivals will desperately want to copy.",
    features: [
      { text: "Build the right product with real customer value" },
      { text: "Test, gain buy-in, and secure funding fast" },
      { text: "Beat your competition to market" }
    ],
    primaryCta: {
      text: "Schedule a discovery call",
      variant: "default" as const
    },
    secondaryCta: {
      text: "Get a website analysis",
      variant: "ghost" as const,
      showArrow: true
    },
    image: {
      src: "https://ui.shadcn.com/placeholder.svg",
      alt: "Hero Image"
    }
  }

  // Value Proposition Section Data
  const valuePropositionData = {
    subheading: "What you'll get",
    heading: "Idea to action, in 3 simple steps",
    description: "Clarity, Validation, and Quality-First Execution. We replace \"vibe code\" with a clear path forward, securing long-term success.",
    steps: [
      {
        number: "1",
        title: "DesignThinker 1-day workshop",
        subtitle: "Get clarity on your idea, fast",
        description: "Whether you have a complex challenge or a rough idea, this workshop cuts through the noise and will ensure diverse perspectives and customer pain points get solved. Stop risking capital on assumptions. In one-day intensive workshop, you'll gain expert validation to ensure a strong, undeniable product-market fit.",
        imageUrl: "https://ui.shadcn.com/placeholder.svg",
        className: "md:col-span-1"
      },
      {
        number: "2",
        title: "Prototype and actionable roadmap",
        subtitle: "Validate your idea & get buy-in",
        description: "Move from concept to a precise, actionable strategy with high-fidelity prototypes delivered just 2 weeks after the workshop. Use these clickable prototypes to secure investor buy-in, test inexpensively, and ensure your product roadmap builds the right features in the right sequence for maximum market success.",
        imageUrl: "https://ui.shadcn.com/placeholder.svg",
        className: "md:col-span-1"
      },
      {
        number: "3",
        title: "Technology kick-off",
        subtitle: "Get expert consultancy and build right",
        description: "Partner with a dedicated industry expert who guides you through every stage: strategy, design, and development. You'll not only choose the optimal tech stack, but gain immediate access to my vetted network of platform gurus when you need it - from mobile and web app developers to systems integration specialists.",
        imageUrl: "https://ui.shadcn.com/placeholder.svg",
        className: "md:col-span-1"
      }
    ],
    imageCards: [
      {
        imageUrl: "https://ui.shadcn.com/placeholder.svg",
        alt: "Image 1"
      },
      {
        imageUrl: "https://ui.shadcn.com/placeholder.svg",
        alt: "Image 2"
      },
      {
        imageUrl: "https://ui.shadcn.com/placeholder.svg",
        alt: "Image 3"
      }
    ]
  }

  // Testimonials Section Data
  const testimonialsData = {
    testimonials: [
      {
        quote: "Michael ran a Design Thinking Workshop with us after we approached him with some ideas on how we could better lean into AI tools to improve our processes and outputs. He drive the process extremely effectively, ensuring we gathered information from our clients to lay the groundwork, before running an in-person workshop. He was organised, creative, thoughtful and insightful. We are grateful for the talents, knowledge and skills he brought to the table and would recommend him to any future client.",
        author: "Irene Chapple",
        role: "Founder",
        company: "Better Aotearoa",
        avatar: "https://github.com/shadcn.png",
        initials: "IC"
      }
    ],
    subheading: "Testimonial section",
    heading: "Customer love"
  }

  // Logo Section Data
  const logoData = {
    logos: Array(6).fill("https://ui.shadcn.com/placeholder.svg")
  }

  // About Section Data
  const aboutData = {
    title: "About Michael",
    description: "Founder of Bizbo is a design and technology professional with expertise in UX, product design and development. Michael has broad experience across media, e-commerce, agencies and service design, building digital experiences for brands such as Woolworths, AA Insurance, The Times, BMW and Mini. A skilled workshop facilitator specialising in design-thinking methodologies. With a passion for fresh challenges, he thrives on finding the sweet spot between user needs, business strategy and technology innovation. There's nothing that can't be solved through collaborative activities, a sheet of paper and a group of motivated individuals. At home, Michael is a dedicated dad, builder of Lego, chef to ungrateful toddlers, and enthusiast of sport and the outdoors.",
    contactInfo: {
      email: "michael@bizbo.co.nz",
      phone: "022 328 7067",
      linkedin: "linkedin.com/in/mchristie79/"
    },
    image: {
      src: "https://ui.shadcn.com/placeholder.svg",
      alt: "About Michael"
    },
    ctaButton: {
      text: "Schedule a Call"
    }
  }

  // CTA Section Data
  const ctaData = {
    subtitle: "Limited availability",
    title: "Free discovery session",
    description: "Go from stuck idea to funded prototype",
    features: [
      { text: "Don't let your high-value idea remains trapped in complexity" },
      { text: "Don't let your competitors seize the market opportunity" },
      { text: "Don't go it alone and ship hastily made spaghetti code" }
    ],
    image: {
      src: "https://ui.shadcn.com/placeholder.svg",
      alt: "CTA Image"
    },
    buttonText: "Schedule a discovery session",
    buttonVariant: "secondary" as const
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <HeroSection {...heroData} />
        <ValuePropositionSection {...valuePropositionData} />
        <TestimonialsSection {...testimonialsData} />
        <LogoSection {...logoData} />
        <AboutSection {...aboutData} />
        <CtaSection {...ctaData} />
      </main>
      <Footer />
    </div>
  )
}
