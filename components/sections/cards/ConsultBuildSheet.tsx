"use client"

import { useState, useEffect, useRef } from "react"
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { bitmapImages } from "@/lib/images"
import Image from "next/image"

interface ConsultBuildSheetProps {
  onPrevious?: () => void
  onNext?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
}

export const ConsultBuildSheet = ({
  onPrevious,
  onNext,
  hasPrevious = true,
  hasNext = true,
}: ConsultBuildSheetProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [nextImageIndex, setNextImageIndex] = useState(1)
  const [currentOpacity, setCurrentOpacity] = useState(1)
  const [nextOpacity, setNextOpacity] = useState(0)
  const images = [bitmapImages.techStrategy, bitmapImages.techStack]
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      // Start crossfade: current fades out, next fades in simultaneously
      setCurrentOpacity(0)
      setNextOpacity(1)
      
      // After transition completes, update which images are shown
      timeoutRef.current = setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
        setNextImageIndex((prev) => (prev + 1) % images.length)
        // Reset opacities - current becomes fully visible, next becomes hidden
        setCurrentOpacity(1)
        setNextOpacity(0)
      }, 1000) // Matches transition duration
    }, 6000) // Change image every 3 seconds

    return () => {
      clearInterval(interval)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [images.length])

  const currentImage = images[currentImageIndex]
  const nextImage = images[nextImageIndex]

  return (
    <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <AspectRatio ratio={6 / 4} className="w-full relative">
          <Image 
            src={currentImage.path} 
            alt={currentImage.alt} 
            fill 
            className="object-cover transition-opacity duration-1000 ease-in-out absolute inset-0"
            style={{ opacity: currentOpacity }}
          />
          <Image 
            src={nextImage.path} 
            alt={nextImage.alt} 
            fill 
            className="object-cover transition-opacity duration-1000 ease-in-out absolute inset-0"
            style={{ opacity: nextOpacity }}
          />
        </AspectRatio>
        <SheetHeader className="border-b border-border">
          <div className="flex items-center gap-2 p-4">

            <div className="flex flex-1 flex-col gap-1">
              <SheetTitle className="text-xl font-extrabold text-foreground transition-colors duration-200 ease-out">
                Consult and build
              </SheetTitle>
              <SheetDescription className="text-base font-medium text-accent-foreground">
                Get dedicated expert guidance at every stage, choose the optimal strategy and technical stack, and access a vetted network of developers for seamless mobile, web, and systems integration
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="flex flex-col gap-2 px-12">
            <div className="flex items-center gap-2">

            </div>
            <div className="space-y-3">
              <div className="flex gap-6">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-semibold text-foreground">Get expert guidance</p>
                  <p className="text-sm text-muted-foreground">
                    Get a dedicated industry guru and immediate expert consultancy to guide every stage.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-semibold text-foreground">Optimise Your Tech</p>
                  <p className="text-sm text-muted-foreground">
                    Choose the best strategy, design, and development path, including the optimal technical stack.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-semibold text-foreground">Seamless Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    Access a vetted network of developers and gurus for mobile, web, and systems integration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SheetFooter className="flex flex-row items-center justify-between gap-4 border-t border-border p-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={onPrevious}
            disabled={!hasPrevious}
            aria-label="Previous sheet"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={onNext}
            disabled={!hasNext}
            aria-label="Next sheet"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <SheetClose asChild>
          <Button variant="default" aria-label="Close">
            Close
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  )
}

