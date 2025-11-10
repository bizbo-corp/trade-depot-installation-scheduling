"use client"

import { ArrowRight, Check, X } from "lucide-react"
import Script from "next/script"

import { BookingDialog } from "@/components/booking/BookingDialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { animations } from "@/lib/images"
import { cn } from "@/lib/utils"

type SectionTheme = "light" | "light-olive" | "olive-light" | "olive" | "neutral-olive" | "dark"

type CtaVariant = "discovery" | "analysis"

export interface CtaFeature {
  text: string
}

interface VariantContent {
  subtitle: string
  title: string
  description: string
  features: CtaFeature[]
  featureIcon: "x" | "check"
  buttonText: string
  buttonHref?: string
  showArrow?: boolean
  buttonVariant?: "default" | "secondary" | "outline" | "ghost"
}

const CTA_VARIANTS: Record<CtaVariant, VariantContent> = {
  discovery: {
    subtitle: "Limited availability",
    title: "Free discovery session",
    description: "Go from stuck idea to funded prototype",
    features: [
      { text: "Build the right product with real customer value" },
      { text: "Test, gain buy-in, and secure funding fast" },
      { text: "Beat your competition to market" }
    ],
    featureIcon: "x",
    buttonText: "Book a discovery session",
    showArrow: true
  },
  analysis: {
    subtitle: "Free",
    title: "Website analysis report",
    description: "Get free tips to boost your ROI",
    features: [
      { text: "Find quick-win user experience improvements" },
      { text: "Increase conversions and sales funnel health" },
      { text: "Boost accessibility and improve your page rank" }
    ],
    featureIcon: "check",
    buttonText: "Get my free UX analysis report",
    showArrow: true
  }
}

const FEATURE_ICONS = {
  x: X,
  check: Check
}

const CTA_GLOBE_ANIMATION = animations.ctaGlobe?.path ?? "/animations/globe-animation.lottie"

export interface CtaSectionProps {
  variant?: CtaVariant
  sectionTheme?: SectionTheme
  title?: string
  subtitle?: string
  description?: string
  features?: CtaFeature[]
  featureIcon?: "x" | "check"
  buttonText?: string
  buttonHref?: string
  buttonVariant?: "default" | "secondary" | "outline" | "ghost"
  showButtonArrow?: boolean
  animationSrc?: string
  className?: string
}

export const CtaSection = ({
  variant = "discovery",
  sectionTheme = "dark",
  title,
  subtitle,
  description,
  features,
  featureIcon,
  buttonText,
  buttonHref,
  buttonVariant,
  showButtonArrow,
  animationSrc,
  className
}: CtaSectionProps) => {
  const defaults = CTA_VARIANTS[variant]

  const resolvedSubtitle = subtitle ?? defaults.subtitle
  const resolvedTitle = title ?? defaults.title
  const resolvedDescription = description ?? defaults.description
  const resolvedFeatures = (features ?? defaults.features).filter(Boolean)
  const resolvedFeatureIcon = featureIcon ?? defaults.featureIcon
  const resolvedButtonText = buttonText ?? defaults.buttonText
  const resolvedButtonHref = buttonHref ?? defaults.buttonHref
  const resolvedButtonVariant = buttonVariant ?? defaults.buttonVariant ?? "default"
  const resolvedShowArrow = showButtonArrow ?? defaults.showArrow ?? true
  const resolvedAnimationSrc = animationSrc ?? CTA_GLOBE_ANIMATION

  const FeatureIcon = FEATURE_ICONS[resolvedFeatureIcon]

  return (
    <section className="py-12 md:py-24 bg-background">
      <Script
        id="dotlottie-player"
        src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.js"
        strategy="afterInteractive"
      />
      <div className={cn("container mx-auto px-4 md:px-6", sectionTheme, className)}>
        <div className="relative overflow-hidden rounded-3xl bg-background-4 text-muted-foreground shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
          <div className="relative grid gap-10 px-6 py-10 sm:px-10 md:px-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:gap-16 lg:px-16">
            <div className="relative z-10 flex flex-col gap-10">
              <div className="flex flex-col gap-6">
                {resolvedSubtitle && (
                  <p className="text-sm font-medium text-muted-foreground/80">{resolvedSubtitle}</p>
                )}
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {resolvedTitle}
                </h2>
                {resolvedFeatures.length > 0 && (
                  <ul className="flex flex-col gap-4 text-base text-muted-foreground">
                    {resolvedFeatures.map((feature, index) => (
                      <li key={`${feature.text}-${index}`} className="flex items-start gap-3">
                        <FeatureIcon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {resolvedDescription && (
                  <p className="text-lg text-muted-foreground">{resolvedDescription}</p>
                )}
              </div>

              {resolvedButtonText && (
                <div className="flex flex-col gap-4 sm:flex-row">
                  {resolvedButtonHref ? (
                    <Button variant={resolvedButtonVariant} size="lg" asChild>
                      <a href={resolvedButtonHref}>
                        {resolvedButtonText}
                        {resolvedShowArrow && <ArrowRight className="ml-2 h-4 w-4" />}
                      </a>
                    </Button>
                  ) : (
                    <BookingDialog>
                      <Button variant={resolvedButtonVariant} size="lg">
                        {resolvedButtonText}
                        {resolvedShowArrow && <ArrowRight className="ml-2 h-4 w-4" />}
                      </Button>
                    </BookingDialog>
                  )}
                </div>
              )}
            </div>
            <CtaGlobeAnimation className="hidden md:flex" src={resolvedAnimationSrc} />
          </div>

          <div className="px-6 pb-10 md:hidden">
            <CtaGlobeAnimation variant="mobile" src={resolvedAnimationSrc} />
          </div>
        </div>
      </div>
    </section>
  )
}

interface CtaGlobeAnimationProps {
  className?: string
  variant?: "desktop" | "mobile"
  src?: string
}

const CtaGlobeAnimation = ({ className, variant = "desktop", src }: CtaGlobeAnimationProps) => {
  const ratio = variant === "mobile" ? 336 / 260 : 612 / 436
  const animationPath = src ?? CTA_GLOBE_ANIMATION

  if (!animationPath) {
    return null
  }

  return (
    <div
      className={cn("relative isolate flex h-full w-full items-end justify-end", className)}
      aria-hidden="true"
    >
      <AspectRatio ratio={ratio} className="w-full">
        <div className="relative h-full w-full overflow-hidden">
          <dotlottie-player
            src={animationPath}
            autoplay
            loop
            mode="normal"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0" />
        </div>
      </AspectRatio>
    </div>
  )
}

