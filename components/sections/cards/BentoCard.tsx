import Image from "next/image"

import { cn } from "@/lib/utils"

export interface BentoCardPoint {
  highlight: string
  description: string
}

export interface BentoCardProps {
  title: string
  number: string
  subtitle: string
  imageUrl: string
  imageAlt?: string
  description?: string
  points?: BentoCardPoint[]
  className?: string
}

export const BentoCard = ({
  title,
  number,
  subtitle,
  description,
  imageUrl,
  imageAlt,
  points,
  className,
}: BentoCardProps) => {
  return (
    <div className={cn("flex flex-col overflow-hidden rounded-xl bg-muted/50 shadow-xs", className)}>
      <div className="relative h-[200px] w-full">
        <Image
          src={imageUrl}
          alt={imageAlt ?? title}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-start gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background-2 text-sm font-extrabold text-foreground">
            {number}
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <h3 className="text-xl font-extrabold text-foreground">{title}</h3>
            <p className="text-base font-light text-accent-foreground">{subtitle}</p>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            {points?.length ? (
              <div className="flex flex-col gap-4 text-sm text-muted-foreground pt-8">
                {points.map((point, index) => (
                  <p key={index} className="text-left">
                    <span className="font-semibold text-foreground">{point.highlight.trim()}</span>
                    <span>{point.description}</span>
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

