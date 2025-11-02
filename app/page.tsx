"use client"

import Image from "next/image"
import { ArrowLeft, ArrowRight, Check, Linkedin, Mail, Phone, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Separator } from "@/components/ui/separator"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/header"
import { Logotype } from "@/components/site-parts/logotype"
import { Logo } from "@/components/site-parts/logo"
const HeroSection = () => {
  return (
    <section className="bg-background py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold tracking-tight leading-tight md:text-5xl">
                From idea to app. <br />We build it.
              </h1>
              <p className="text-lg text-muted-foreground">
                Simplify the process of building a market-defining digital web app - one your customers can&apos;t live without and your rivals will desperately want to copy.
              </p>
            </div>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                <span>Build the right product with real customer value</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                <span>Test, gain buy-in, and secure funding fast</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                <span>Beat your competition to market</span>
              </li>
            </ul>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto">Schedule a discovery call</Button>
              <Button size="lg" variant="ghost" className="w-full sm:w-auto">
                Get a website analysis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <AspectRatio ratio={1 / 1}>
              <Image
                src="https://ui.shadcn.com/placeholder.svg"
                alt="Hero Image"
                fill
                className="rounded-xl object-cover"
              />
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  )
}

const BentoCard = ({ title, number, subtitle, description, imageUrl, className }: { title: string, number: string, subtitle: string, description: string, imageUrl: string, className?: string }) => (
  <div className={`flex flex-col overflow-hidden rounded-xl border bg-muted ${className}`}>
    <Image
      src={imageUrl}
      alt={title}
      width={400}
      height={236}
      className="h-auto w-full object-cover"
    />
    <div className="flex flex-col gap-2 p-6">
      <div className="flex items-start gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
          {number}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-accent-foreground">{subtitle}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

const ValuePropositionSection = () => {
  const steps = [
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
    },
     {
      number: "4",
      title: "Feature Card",
      subtitle: "Placeholder subtitle",
      description: "This is a placeholder description for the feature card. It gives an overview of what the feature is about.",
      imageUrl: "https://ui.shadcn.com/placeholder.svg",
      className: "md:col-span-1 lg:col-span-3"
    }
  ];

  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="container mx-auto flex flex-col items-center gap-12 px-4 md:px-6">
        <div className="flex max-w-xl flex-col items-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">What you'll get</p>
          <h2 className="text-3xl font-bold tracking-tight">Idea to action, in 3 simple steps</h2>
          <p className="text-muted-foreground">
            Clarity, Validation, and Quality-First Execution. We replace &quot;vibe code&quot; with a clear path forward, securing long-term success.
          </p>
        </div>
        <div className="grid w-full max-w-6xl grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <BentoCard key={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}

const TestimonialsSection = () => {
  return (
    <section className="bg-muted py-12 md:py-24">
      <div className="container mx-auto flex flex-col items-center gap-6 px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">Testimonial section</p>
          <h2 className="text-3xl font-bold">Customer love</h2>
        </div>
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-6 w-6 text-muted-foreground/30 fill-muted-foreground" />
          ))}
        </div>
        <Carousel className="w-full max-w-4xl">
          <CarouselContent>
            <CarouselItem>
              <div className="flex flex-col items-center gap-8 text-center">
                <blockquote className="max-w-2xl text-lg md:text-xl">
                  "Michael ran a Design Thinking Workshop with us after we approached him with some ideas on how we could better lean into AI tools to improve our processes and outputs. He drive the process extremely effectively, ensuring we gathered information from our clients to lay the groundwork, before running an in-person workshop. He was organised, creative, thoughtful and insightful. We are grateful for the talents, knowledge and skills he brought to the table and would recommend him to any future client."
                </blockquote>
                <div className="flex flex-col items-center gap-4 md:flex-row">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>IC</AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left">
                    <p className="font-semibold">Irene Chapple</p>
                    <p className="text-sm text-muted-foreground">Founder, Better Aotearoa</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </section>
  )
}

const LogoSection = () => {
    const logos = Array(6).fill("https://ui.shadcn.com/placeholder.svg");
    return (
        <section className="py-12 md:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 items-center justify-center gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {logos.map((src, index) => (
                        <div key={index} className="flex justify-center p-6 bg-muted">
                            <Image src={src} alt={`Logo ${index + 1}`} width={140} height={40} className="grayscale" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const AboutSection = () => {
  return (
    <section className="bg-background py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold tracking-tight">About Michael</h2>
              <p className="text-muted-foreground">
                Founder of Bizbo is a design and technology professional with expertise in UX, product design and development. Michael has broad experience across media, e-commerce, agencies and service design, building digital experiences for brands such as Woolworths, AA Insurance, The Times, BMW and Mini. A skilled workshop facilitator specialising in design-thinking methodologies. With a passion for fresh challenges, he thrives on finding the sweet spot between user needs, business strategy and technology innovation. There&apos;s nothing that can&apos;t be solved through collaborative activities, a sheet of paper and a group of motivated individuals. At home, Michael is a dedicated dad, builder of Lego, chef to ungrateful toddlers, and enthusiast of sport and the outdoors.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <span className="font-medium">michael@bizbo.co.nz</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <span className="font-medium">022 328 7067</span>
              </div>
              <div className="flex items-center gap-3">
                <Linkedin className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <span className="font-medium">linkedin.com/in/mchristie79/</span>
              </div>
            </div>
            <div className="mt-4">
              <Button>Schedule a Call</Button>
            </div>
          </div>
          <div className="order-first lg:order-last">
            <AspectRatio ratio={1 / 1}>
              <Image
                src="https://ui.shadcn.com/placeholder.svg"
                alt="About Michael"
                fill
                className="rounded-xl object-cover"
              />
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  )
}


const CtaSection = () => {
  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-7xl mx-auto rounded-xl bg-primary text-primary-foreground p-8 md:p-16 shadow-lg">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="order-last lg:order-first">
              <AspectRatio ratio={4/3} className="hidden lg:block">
                 <Image src="https://ui.shadcn.com/placeholder.svg" alt="CTA Image" fill className="rounded-lg object-cover" />
              </AspectRatio>
               <Image src="https://ui.shadcn.com/placeholder.svg" alt="CTA Image" width={336} height={260} className="block lg:hidden rounded-lg object-cover w-full h-auto" />
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4 text-center lg:text-left">
                <p className="text-sm font-medium opacity-80">Limited availability</p>
                <h2 className="text-3xl font-bold">Free discovery session</h2>
              </div>
              <div className="flex flex-col gap-6 text-center lg:text-left">
                <p className="text-lg opacity-80 whitespace-pre-line">
                  Go from stuck idea to funded prototype
                  <br/><br/>
                  x Don't let your high-value idea remains trapped in complexity
                  <br/>
                  x Don't let your competitors seize the market opportunity
                  <br/>
                  x Don't go it alone and ship hastily made spaghetti code
                  <br/><br/>
                  Starting with one conversation today
                </p>
                <div className="flex justify-center lg:justify-start">
                  <Button variant="secondary" size="lg">
                    Schedule a discovery session <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const Footer = () => {
  return (
    <footer className="bg-background py-12 md:py-24">
      <div className="container mx-auto flex max-w-7xl flex-col gap-12 px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
            <Logotype />
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">Home</a>
              <a href="#" className="hover:text-foreground">Consultancy workshops</a>
              <a href="#" className="hover:text-foreground">UX Design</a>
              <a href="#" className="hover:text-foreground">Development</a>
              <a href="#" className="hover:text-foreground">Shopify</a>
            </nav>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col-reverse items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>Copyright © bizbo.co.nz</p>
          <a href="#" className="hover:text-foreground">Privacy Policy</a>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <HeroSection />
        <ValuePropositionSection />
        <TestimonialsSection />
        <LogoSection />
        <AboutSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
