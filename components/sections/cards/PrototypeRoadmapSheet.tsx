"use client"

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { bitmapImages } from "@/lib/images"
import { FadeCarousel } from "@/components/ui/fade-carousel"
import { FaIcon } from "@/components/ui/fa-icon"

interface PrototypeRoadmapSheetProps {
  onPrevious?: () => void
  onNext?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
}

export const PrototypeRoadmapSheet = ({
  onPrevious,
  onNext,
  hasPrevious = true,
  hasNext = true,
}: PrototypeRoadmapSheetProps) => {
  return (
    <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <FadeCarousel
          images={[bitmapImages.mobilePrototype, bitmapImages.onboardingJourney]}
          ariaLabel="Prototype and roadmap imagery"
        />
        <SheetHeader className="border-b border-border">
          <div className="flex items-start gap-4 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-extrabold text-primary shrink-0">
              2
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <SheetTitle className="text-xl font-extrabold text-foreground transition-colors duration-200 ease-out">
                Prototype & roadmap
              </SheetTitle>
              <SheetDescription className="text-base font-medium text-accent-foreground">
                Turn your concept into high-fidelity clickable prototypes in two weeks to test affordably, secure investor confidence, and get a roadmap for building the right features in the right sequence.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="flex flex-col gap-2 px-12">
            <div className="flex items-center gap-2">

            </div>
            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-md font-semibold text-primary shrink-0 mt-0.5">
                  <FaIcon icon="arrow-pointer" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Prototype & secure buy-in</p>
                  <p className="text-sm text-muted-foreground">
                    Turn your concept into a precise, actionable strategy using high-fidelity clickable prototypes.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-md font-semibold text-primary shrink-0 mt-0.5">
                <FaIcon icon="vial" />

                </div>
                <div>
                  <p className="font-semibold text-foreground">Test affordably</p>
                  <p className="text-sm text-muted-foreground">
                    Use the prototypes (delivered in two weeks) to gain investor confidence and test your product.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-md font-semibold text-primary shrink-0 mt-0.5">
                <FaIcon icon="chart-line" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Maximise success</p>
                  <p className="text-sm text-muted-foreground">
                    Get a roadmap that ensures you build the right features in the right sequence for maximum market impact.
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

