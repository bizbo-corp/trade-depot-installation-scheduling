"use client"

import Image from "next/image"
import { Linkedin, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { BookingDialog } from "@/components/booking/BookingDialog"

export interface ContactInfo {
  email?: string
  phone?: string
  linkedin?: string
}

export interface AboutSectionProps {
  title?: string
  description: string
  contactInfo: ContactInfo
  image: {
    src: string
    alt: string
  }
  ctaButton?: {
    text: string
    href?: string
    onClick?: () => void
  }
  imageOrder?: "first" | "last"
}

export const AboutSection = ({
  title = "About Michael",
  description,
  contactInfo,
  image,
  ctaButton,
  imageOrder = "last"
}: AboutSectionProps) => {
  return (
    <section className="bg-background py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="flex flex-col gap-3">
              {contactInfo.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <span className="font-medium">{contactInfo.email}</span>
                </div>
              )}
              {contactInfo.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <span className="font-medium">{contactInfo.phone}</span>
                </div>
              )}
              {contactInfo.linkedin && (
                <div className="flex items-center gap-3">
                  <Linkedin className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <span className="font-medium">{contactInfo.linkedin}</span>
                </div>
              )}
            </div>
            {ctaButton && (
              <div className="mt-4">
                {ctaButton.href ? (
                  <Button asChild>
                    <a href={ctaButton.href}>{ctaButton.text}</a>
                  </Button>
                ) : ctaButton.onClick ? (
                  <Button onClick={ctaButton.onClick}>{ctaButton.text}</Button>
                ) : (
                  <BookingDialog>
                    <Button>{ctaButton.text}</Button>
                  </BookingDialog>
                )}
              </div>
            )}
          </div>
          <div className={imageOrder === "first" ? "order-first lg:order-first" : "order-first lg:order-last"}>
            <AspectRatio ratio={1 / 1}>
              <Image
                src={image.src}
                alt={image.alt}
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

