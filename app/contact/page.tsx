"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/sections/Footer";
import { CtaSection } from "@/components/sections/CtaSection";
import { BookingDialog } from "@/components/booking/BookingDialog";
import { Button } from "@/components/ui/button";
import { FaIcon } from "@/components/ui/fa-icon";
import { peoplePortraits } from "@/lib/images";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 pt-16">
        {/* Mobile: About Michael Section (shown first on mobile) */}
        <section className="bg-background py-12 md:py-16 lg:hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  About Michael
                </h2>
                <div className="flex flex-col gap-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Founder of Bizbo is a design and technology professional
                    with expertise in UX, product design and development.
                  </p>
                  <p>
                    Michael has broad experience across media, e-commerce,
                    agencies and service design, building digital experiences
                    for brands such as Woolworths, AA Insurance, The Times, BMW
                    and Mini.
                  </p>
                  <p>
                    A skilled workshop facilitator specialising in
                    design-thinking methodologies. With a passion for fresh
                    challenges, he thrives on finding the sweet spot between
                    user needs, business strategy and technology innovation.
                    There&apos;s nothing that can&apos;t be solved through
                    collaborative activities, a sheet of paper and a group of
                    motivated individuals. At home,
                  </p>
                  <p>
                    Michael is a dedicated dad, builder of Lego, chef to
                    ungrateful toddlers, and enthusiast of sport and the
                    outdoors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section - Desktop: Two columns, Mobile: Stacked */}
        <section className="bg-background py-12 md:py-16 lg:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left Column - Contact Info */}
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-5">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    Contact
                  </h1>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    I would be pleased to hear about your aspirations, business
                    challenges and how I might be able to help achieve digital
                    product success.
                  </p>
                </div>

                {/* Contact Information */}
                <div className="flex flex-col gap-3">
                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      <FaIcon
                        icon="envelope"
                        style="duotone"
                        size={1}
                        className="text-muted-foreground"
                      />
                    </div>
                    <Link
                      href="mailto:michael@bizbo.co.nz"
                      className="text-base font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
                    >
                      michael@bizbo.co.nz
                    </Link>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      <FaIcon
                        icon="phone-office"
                        style="duotone"
                        size={1}
                        className="text-muted-foreground"
                      />
                    </div>
                    <Link
                      href="tel:+64223287067"
                      className="text-base font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
                    >
                      022 328 7067
                    </Link>
                  </div>

                  {/* LinkedIn */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      <FaIcon
                        icon="linkedin"
                        style="brand"
                        size={1}
                        className="text-muted-foreground"
                      />
                    </div>
                    <Link
                      href="https://www.linkedin.com/in/mchristie79/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
                    >
                      linkedin.com/in/mchristie79/
                    </Link>
                  </div>
                </div>

                {/* Schedule a Call Button */}
                <div className="flex">
                  <BookingDialog>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full lg:w-auto"
                    >
                      Schedule a Call
                    </Button>
                  </BookingDialog>
                </div>
              </div>

              {/* Right Column - Profile Image (Desktop only) */}
              <div className="hidden lg:block">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                  <Image
                    src={peoplePortraits.michaelChristie.path}
                    alt={peoplePortraits.michaelChristie.alt}
                    fill
                    className="object-cover"
                    priority
                  />
                  
                </div>
                <div className="container mx-auto px-4 md:px-0 mt-12">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              About me
            </h2>
            <div className="grid grid-cols-2 gap-16">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    My company brand is Bizbo, and I&apos;m Michael Christie - a
                    solopreneur UX designer and tech enthusiast. Being a
                    solopreneur enables me to select great clients and deliver
                    meaningful, high-quality work without the unnecessary
                    complexity of larger organisations.
                  </p>
                  <p>
                    I specialise in UX, consulting, development and automations,
                    providing exceptional service for SaaS startups, Shopify
                    store owners, and sales and lead-based businesses.
                  </p>
                  <p>
                    I&apos;ve worked with companies of all sizes, both locally
                    and globally, including The Times, Woolworths, AA Insurance,
                    dynamic marketing agencies and small startups. This diverse
                    experience across different sectors (e-commerce, media,
                    financial services) has given me a broad perspective -
                    though I recognise my limitations.
                  </p>
                  <p>
                    That&apos;s why I partner with other like-minded talent:
                    brand storytellers, IT providers, graphic designers and
                    videographers I trust and respect for their expertise. I
                    stay in my lane and rely on my strong network when something
                    isn&apos;t my core strength.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 text-base leading-relaxed text-muted-foreground">

                  <p>
                    I deliver agency-level UX design and development quality to
                    small and medium-sized businesses without the bloat and
                    agency overheads. I excel at running workshops using
                    Design-thinking methodologies to help people transform their
                    ideas into reality—validating, streamlining and focusing
                    concepts to launch or elevate them. I can execute the entire
                    process from Figma designs to live implementation, turning
                    business aspirations into shipped products.
                  </p>
                  <p>
                    My ideal day involves co-designing with workshop
                    participants, prototyping ideas, creating engaging
                    frontends, and leveraging cutting-edge AI tools with my
                    preferred tech stack—{" "}
                    <Link
                      href="http://Cursor.AI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-foreground"
                    >
                      Cursor.AI
                    </Link>
                    , Vercel (Next.js), and Tailwind.
                  </p>
                  <p>
                    So if working together sounds like a bit of you (client or
                    partner), I&apos;d like to hear from you. Let&apos;s make
                    some amazing together.
                  </p>
                  <p className="font-bold text-foreground mt-12">
                    Learn, Create, Give.
                  </p>
                  <p>Michael Christie</p>
                </div>
              </div>
            </div>
          </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile: Profile Image (shown after contact info on mobile) */}
        <section className="bg-background pb-12 lg:hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl">
              <Image
                src={peoplePortraits.michaelChristie.path}
                alt={peoplePortraits.michaelChristie.alt}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>



        {/* CTA Section */}
        <CtaSection variant="discovery" sectionTheme="dark" />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
