"use client"

import Image from "next/image"
import { ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { BookingDialog } from "@/components/booking/BookingDialog"

export interface CtaFeature {
  text: string
}

export interface CtaSectionProps {
  title: string
  subtitle?: string
  description: string
  features?: CtaFeature[]
  image: {
    src: string
    alt: string
  }
  buttonText: string
  buttonHref?: string
  buttonVariant?: "default" | "secondary" | "outline" | "ghost"
  imageOrder?: "first" | "last"
}

export const CtaSection = ({
  title,
  subtitle,
  description,
  features = [],
  image,
  buttonText,
  buttonHref,
  buttonVariant = "secondary",
  imageOrder = "first"
}: CtaSectionProps) => {
  return (
    <section className="py-12 md:py-24 bg-background ">
      <div className="container mx-auto px-4 md:px-6">
        <div className="rounded-xl olive bg-background text-foreground p-8 md:p-16 shadow-lg">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className={imageOrder === "first" ? "order-last lg:order-first" : "order-last lg:order-last"}>
              <AspectRatio ratio={4 / 3} className="hidden lg:block">
                <Image src={image.src} alt={image.alt} fill className="rounded-lg object-cover" />
              </AspectRatio>
              <Image
                src={image.src}
                alt={image.alt}
                width={336}
                height={260}
                className="block lg:hidden rounded-lg object-cover w-full h-auto"
              />
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4 text-center lg:text-left">
                {subtitle && <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>}
                <h2 className="text-3xl font-bold">{title}</h2>
              </div>
              <div className="flex flex-col gap-6 text-center lg:text-left">
                <p className="text-lg text-muted-foreground">{description}</p>
                {features.length > 0 && (
                  <ul className="flex flex-col gap-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <X className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
                        <span className="text-muted-foreground">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex justify-center lg:justify-start">
                  {buttonHref ? (
                    <Button variant={buttonVariant} size="lg" asChild>
                      <a href={buttonHref}>
                        {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <BookingDialog>
                      <Button variant={buttonVariant} size="lg">
                        {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </BookingDialog>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

