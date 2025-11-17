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
  return (
    <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <FadeCarousel
          images={[bitmapImages.techStrategy, bitmapImages.techStack]}
          ariaLabel="Consult and build imagery"
        />
        <SheetHeader className="border-b border-border">
          <div className="flex items-start gap-4 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-extrabold text-primary shrink-0">
              3
            </div>
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
            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-md font-semibold text-primary shrink-0 mt-0.5">
                  <FaIcon icon="user-tie" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Get expert guidance</p>
                  <p className="text-sm text-muted-foreground">
                    Get a dedicated industry guru and immediate expert consultancy to guide every stage.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-md font-semibold text-primary shrink-0 mt-0.5">
                  <FaIcon icon="gears" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Optimise Your Tech</p>
                  <p className="text-sm text-muted-foreground">
                    Choose the best strategy, design, and development path, including the optimal technical stack.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-md font-semibold text-primary shrink-0 mt-0.5">
                  <FaIcon icon="rocket" />
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

