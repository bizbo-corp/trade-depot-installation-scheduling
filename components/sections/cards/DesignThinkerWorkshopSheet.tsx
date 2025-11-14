"use client"

import { FaIcon } from "@/components/ui/fa-icon"
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

interface DesignThinkerWorkshopSheetProps {
  onPrevious?: () => void
  onNext?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
}

export const DesignThinkerWorkshopSheet = ({
  onPrevious,
  onNext,
  hasPrevious = true,
  hasNext = true,
}: DesignThinkerWorkshopSheetProps) => {
  return (
    <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col neutral-olive">
      <div className="flex-1 overflow-y-auto">
        <AspectRatio ratio={6 / 4} className="w-full">
          <Image src={bitmapImages.workshopSession.path} alt="DesignThinker workshop" fill className="object-cover" />
        </AspectRatio>
        <SheetHeader className="border-b border-border">
          <div className="flex items-center gap-2 p-4">

            <div className="flex flex-1 flex-col gap-1">
              <SheetTitle className="text-xl font-extrabold text-foreground transition-colors duration-200 ease-out">
                DesignThinker workshop
              </SheetTitle>
              <SheetDescription className="text-base font-medium text-accent-foreground">
                Clarify customer needs, validate your idea has the potential to be a product-market fit in one intensive day.
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
                  <p className="font-semibold text-foreground">Validate your idea</p>
                  <p className="text-sm text-muted-foreground">
                    Cut through the noise and get validation on your concept in one intensive day.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-semibold text-foreground">Zero in and clarify</p>
                  <p className="text-sm text-muted-foreground">
                    on the exact customer need or business problem to ensure you're making what matters.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-semibold text-foreground">De-risk investment</p>
                  <p className="text-sm text-muted-foreground">
                    Secure the evidence needed to establish an undeniable product-market fit before you build.
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

