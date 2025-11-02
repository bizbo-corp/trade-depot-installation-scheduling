import Image from "next/image"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ReactNode } from "react"

export interface HeroFeature {
  text: string
}

export interface HeroCta {
  text: string
  href?: string
  variant?: "default" | "secondary" | "outline" | "ghost"
  showArrow?: boolean
}

export interface HeroSectionProps {
  title: string | ReactNode
  description: string
  features?: HeroFeature[]
  primaryCta?: HeroCta
  secondaryCta?: HeroCta
  image?: {
    src: string
    alt: string
  }
  imageOrder?: "first" | "last"
}

export const HeroSection = ({
  title,
  description,
  features = [],
  primaryCta,
  secondaryCta,
  image,
  imageOrder = "last"
}: HeroSectionProps) => {
  return (
    <section className="bg-background py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold tracking-tight leading-tight md:text-5xl">
                {title}
              </h1>
              <p className="text-lg text-muted-foreground">{description}</p>
            </div>
            {features.length > 0 && (
              <ul className="flex flex-col gap-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            )}
            {(primaryCta || secondaryCta) && (
              <div className="flex flex-col gap-3 sm:flex-row">
                {primaryCta && (
                  primaryCta.href ? (
                    <Button size="lg" className="w-full sm:w-auto" variant={primaryCta.variant} asChild>
                      <a href={primaryCta.href}>
                        {primaryCta.text}
                        {primaryCta.showArrow && <ArrowRight className="ml-2 h-4 w-4" />}
                      </a>
                    </Button>
                  ) : (
                    <Button size="lg" className="w-full sm:w-auto" variant={primaryCta.variant}>
                      {primaryCta.text}
                      {primaryCta.showArrow && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  )
                )}
                {secondaryCta && (
                  secondaryCta.href ? (
                    <Button size="lg" variant={secondaryCta.variant || "ghost"} className="w-full sm:w-auto" asChild>
                      <a href={secondaryCta.href}>
                        {secondaryCta.text}
                        {secondaryCta.showArrow && <ArrowRight className="ml-2 h-4 w-4" />}
                      </a>
                    </Button>
                  ) : (
                    <Button size="lg" variant={secondaryCta.variant || "ghost"} className="w-full sm:w-auto">
                      {secondaryCta.text}
                      {secondaryCta.showArrow && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  )
                )}
              </div>
            )}
          </div>
          {image && (
            <div className={imageOrder === "first" ? "order-first lg:order-first" : "hidden lg:block"}>
              <AspectRatio ratio={1 / 1}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="rounded-xl object-cover"
                />
              </AspectRatio>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

