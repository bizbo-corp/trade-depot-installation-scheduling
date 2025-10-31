"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Check, Linkedin, Mail, Menu, Phone, Star, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Logo = () => (
  <div className="flex items-center gap-2">
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground">
      <rect width="36" height="36" rx="18" fill="currentColor"/>
      <rect x="10" y="10" width="8" height="8" rx="4" fill="hsl(var(--background))"/>
      <rect x="10" y="20" width="16" height="6" rx="3" fill="hsl(var(--background))"/>
    </svg>
    <svg width="84" height="36" viewBox="0 0 84 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden md:block text-foreground">
      <path d="M11.8383 13.9189C11.8383 12.0628 12.3888 10.4215 13.49 9.00977C14.5911 7.58411 16.0967 6.87128 17.9818 6.87128C19.7828 6.87128 21.2333 7.51997 22.3344 8.81836L21.0772 10.4215C20.26 9.46289 19.2705 8.98358 18.1089 8.98358C16.5192 8.98358 15.3452 9.71032 14.5825 11.1618C13.8337 12.5995 13.4593 14.4556 13.4593 16.7297V18.1674H18.7241V19.9546H13.4593V28H11.8383V13.9189Z" fill="currentColor"/>
      <path d="M26.9744 28H25.3534V7.12372H26.9744V28Z" fill="currentColor"/>
      <path d="M37.7554 21.362C38.643 22.5641 39.6146 23.1652 40.6703 23.1652C41.726 23.1652 42.5053 22.7809 43.0019 22.0124C43.5123 21.2301 43.7675 20.0811 43.7675 18.5654V18.0026H39.5027V16.3816H45.3885V18.5654C45.3885 20.7395 44.838 22.3969 43.7369 23.5386C42.6358 24.6663 41.2255 25.2301 39.5027 25.2301C37.892 25.2301 36.4399 24.5173 35.1415 23.0916L36.3266 21.6277C36.837 22.2531 37.4598 22.7595 38.1947 23.1438C37.6981 22.4048 37.3837 21.9082 37.2551 21.654C35.039 20.1384 33.931 18.0026 33.931 15.264C33.931 12.4277 35.039 10.2197 37.2551 8.63007C38.6032 7.61901 40.1335 7.11347 41.8424 7.12372C43.5513 7.13396 44.9751 7.71032 46.1044 8.85888L44.8612 10.4215C44.0304 9.53388 43.0409 9.09003 41.8885 9.09003C40.2348 9.09003 38.9916 9.89062 38.1608 11.4938C37.33 13.083 36.9146 14.9948 36.9146 17.2285C36.9146 18.8495 37.229 20.2285 37.7554 21.362Z" fill="currentColor"/>
      <path d="M57.9627 21.362C58.8493 22.5641 59.8209 23.1652 60.8766 23.1652C61.9323 23.1652 62.7116 22.7809 63.2082 22.0124C63.7186 21.2301 63.9738 20.0811 63.9738 18.5654V18.0026H59.709V16.3816H65.5948V18.5654C65.5948 20.7395 65.0443 22.3969 63.9432 23.5386C62.8421 24.6663 61.4318 25.2301 59.709 25.2301C58.0983 25.2301 56.6462 24.5173 55.3478 23.0916L56.5329 21.6277C57.0433 22.2531 57.6661 22.7595 58.401 23.1438C57.9044 22.4048 57.59 21.9082 57.4614 21.654C55.2453 20.1384 54.1373 18.0026 54.1373 15.264C54.1373 12.4277 55.2453 10.2197 57.4614 8.63007C58.8095 7.61901 60.3398 7.11347 62.0487 7.12372C63.7576 7.13396 65.1814 7.71032 66.3107 8.85888L65.0675 10.4215C64.2367 9.53388 63.2472 9.09003 62.0948 9.09003C60.4411 9.09003 59.1979 9.89062 58.3671 11.4938C57.5363 13.083 57.1209 14.9948 57.1209 17.2285C57.1209 18.8495 57.4353 20.2285 57.9627 21.362Z" fill="currentColor"/>
      <path d="M78.611 13.5332C77.4959 12.2349 76.0152 11.5862 74.1685 11.5862C72.2378 11.5862 70.7109 12.2831 69.5816 13.6771C68.4664 15.0571 67.9088 16.8214 67.9088 18.9691C67.9088 21.129 68.4664 22.8934 69.5816 24.2733C70.7109 25.6393 72.2378 26.3223 74.1685 26.3223C76.0152 26.3223 77.4959 25.6736 78.611 24.3752L77.3538 22.7721C76.5363 23.7307 75.5204 24.21 74.2964 24.21C72.7667 24.21 71.5816 23.5386 70.7387 22.1963C70.0244 20.9801 69.6672 19.4977 69.6672 17.7492V16.8214H77.9442V18.5916C77.9442 17.4859 77.9022 16.5983 77.8181 15.9289H69.6395C69.8317 14.4912 70.4585 13.4355 71.5142 12.7621C72.5699 12.0886 73.5858 11.7519 74.5651 11.7519C75.3959 11.7519 76.1209 12.0171 76.7298 12.5475L78.611 13.5332Z" fill="currentColor"/>
    </svg>
  </div>
)

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const navLinks = [
    { name: "Consultancy workshops", href: "#" },
    { name: "UX Design", href: "#" },
    { name: "Development", href: "#" },
    { name: "Shopify", href: "#" },
    { name: "Contact", href: "#" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Button key={link.name} variant="ghost" asChild>
              <a href={link.href}>{link.name}</a>
            </Button>
          ))}
          <Button variant="ghost" size="icon">
            <UserRound className="h-4 w-4" />
            <span className="sr-only">Account</span>
          </Button>
        </nav>
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Button key={link.name} variant="ghost" asChild className="justify-start">
                    <a href={link.href} onClick={() => setIsOpen(false)}>{link.name}</a>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

const HeroSection = () => {
  return (
    <section className="bg-background py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                From idea to app. We build it.
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
            <Logo />
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
      <Navbar />
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
