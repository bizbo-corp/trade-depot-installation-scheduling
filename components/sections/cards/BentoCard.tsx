"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"
import { FaIcon } from "@/components/ui/fa-icon"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

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
  icon?: string
  iconStyle?: "light" | "solid" | "duotone" | "brand"
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
  icon,
  iconStyle = "duotone",
}: BentoCardProps) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 20

    setTilt({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div
          ref={cardRef}
          className={cn(
            "group relative flex flex-col overflow-hidden rounded-xl hover:bg-muted/50 hover:shadow-2xl transition-all duration-200 ease-out group-hover:bg-background-2 cursor-pointer",
            className
          )}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(2000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute bottom-3 right-3 z-10 rounded-full bg-background/20 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 hover:bg-background"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Plus className="size-4" />
            <span className="sr-only">View more details</span>
          </Button>
          <div className="relative h-[200px] w-full flex p-24">
          {icon ? (
            <FaIcon
              icon={icon}
              style={iconStyle}
              size={8}
              className="text-current transition-colors duration-200 ease-out group-hover:text-foreground"
              {...(iconStyle === "duotone" && {
                duotoneBaseStyle: "thin" as const,
                secondaryOpacity: 0.4,
              })}
            />
          ) : (
            <Image
              src={imageUrl}
              alt={imageAlt ?? title}
              fill
              sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          )}
        </div>
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-start gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-extrabold bg-background-2 text-foreground">
              {number}
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <h3 className="text-xl font-extrabold text-foreground transition-colors duration-200 ease-out group-hover:text-card-foreground">
                {title}
              </h3>
              <p className="text-base font-light text-accent-foreground">{subtitle}</p>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}

            </div>
          </div>
        </div>
        </div>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{subtitle}</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {description && (
            <div>
              <h4 className="font-semibold mb-2">Overview</h4>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          )}
          {points?.length ? (
            <div>
              <h4 className="font-semibold mb-3">Key Points</h4>
              <div className="space-y-3">
                {points.map((point, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{point.highlight.trim()}</p>
                      <p className="text-sm text-muted-foreground">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h4 className="font-semibold mb-2">Details</h4>
              <p className="text-sm text-muted-foreground">
                This is additional information about {title}. Here you can find more detailed
                explanations, use cases, and implementation details that complement the main
                overview provided on the card.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Feature highlights:</strong> This section
                  provides comprehensive details about the key aspects and benefits of this
                  offering.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Implementation:</strong> Learn more about
                  how this can be integrated into your workflow and the steps required to get
                  started.
                </p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

