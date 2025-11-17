"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import Fade from "embla-carousel-fade"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ImageAsset } from "@/lib/images"

interface FadeCarouselProps {
  images: ImageAsset[]
  className?: string
  interval?: number
  ariaLabel?: string
}

export const FadeCarousel = ({
  images,
  className,
  interval = 5000,
  ariaLabel = "Workshop imagery carousel",
}: FadeCarouselProps) => {
  const autoplayPlugin = useRef(
    Autoplay({
      delay: interval,
      stopOnInteraction: false,
    }),
  )
  const fadePlugin = useRef(Fade())
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
    },
    [fadePlugin.current, autoplayPlugin.current],
  )
  const [selectedIndex, setSelectedIndex] = useState(0)

  const slideCount = images.length

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index)
    },
    [emblaApi],
  )

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()

    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  const indicators = useMemo(
    () =>
      images.map((image, index) => ({
        ...image,
        index,
      })),
    [images],
  )

  if (!images.length) {
    return null
  }

  return (
    <div className={cn("relative w-full", className)}>
      <AspectRatio ratio={6 / 4} className="overflow-hidden relative">
        <div
          ref={emblaRef}
          className="h-full w-full"
          aria-label={ariaLabel}
          onMouseEnter={autoplayPlugin.current.stop}
          onMouseLeave={autoplayPlugin.current.reset}
        >
          <div className="flex h-full w-full">
            {images.map((image, index) => (
              <div className="relative min-w-0 shrink-0 grow-0 basis-full" key={image.path}>
                <Image
                  src={image.path}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                />
                {image.description ? (
                  <span className="sr-only">{image.description}</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-4">
          <div className="flex w-full items-end justify-between">
            <div className="pointer-events-auto flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-background/80 text-foreground shadow"
                onClick={scrollPrev}
                aria-label="Previous slide"
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-background/80 text-foreground shadow"
                onClick={scrollNext}
                aria-label="Next slide"
              >
                <ChevronRight className="size-5" />
              </Button>
            </div>

            <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-background/60 backdrop-blur px-3 py-1.5 text-xs font-semibold text-foreground shadow">
              {indicators.map(({ index, alt }) => (
                <button
                  key={`${alt}-${index}`}
                  onClick={() => scrollTo(index)}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-opacity",
                    selectedIndex === index
                      ? "bg-primary opacity-100"
                      : "bg-foreground/50 opacity-70",
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={selectedIndex === index}
                />
              ))}
            </div>
          </div>
        </div>
      </AspectRatio>
    </div>
  )
}


