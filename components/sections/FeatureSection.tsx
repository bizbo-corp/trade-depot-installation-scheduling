"use client"

import type { PropsWithChildren } from "react"

import type { FaIconStyle } from "@/components/ui/fa-icon"
import { cn } from "@/lib/utils"

import { FeatureCard } from "@/components/sections/cards/FeatureCard"

export interface FeatureSectionItem extends PropsWithChildren {
  title: string
  description: string
  icon: string
  iconStyle?: FaIconStyle
}

export interface FeatureSectionProps {
  title: string
  description?: string
  features: FeatureSectionItem[]
  sectionTheme?: string
  className?: string
  tagline?: string
}

export function FeatureSection({
  title,
  description,
  features,
  sectionTheme,
  className,
  tagline,
}: FeatureSectionProps) {
  return (
    <section className={cn("py-16 md:py-24", sectionTheme, className)}>
      <div className="container mx-auto flex flex-col gap-12 px-4 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-4">
            {tagline ? (
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                {tagline}
              </p>
            ) : null}
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {title}
            </h2>
            {description ? (
              <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              device="desktop"
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              iconStyle={feature.iconStyle}
              className="h-full"
              headingClassName="text-foreground"
            >
              {feature.children}
            </FeatureCard>
          ))}
        </div>
      </div>
    </section>
  )
}

