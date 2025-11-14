"use client"

import { useState } from "react"
import { BentoCard, BentoCardProps } from "@/components/sections/cards/BentoCard";
import { DesignThinkerWorkshopSheet } from "@/components/sections/cards/DesignThinkerWorkshopSheet";
import { PrototypeRoadmapSheet } from "@/components/sections/cards/PrototypeRoadmapSheet";
import { ConsultBuildSheet } from "@/components/sections/cards/ConsultBuildSheet";
import { bitmapImages } from "@/lib/images";
import { cn } from "@/lib/utils";

export interface ValuePropositionStep extends Omit<BentoCardProps, "className"> {
  className?: string;
}

export interface ValuePropositionSectionProps {
  heading?: string;
  subheading?: string;
  description?: string;
  steps?: ValuePropositionStep[];
  sectionTheme?: "light" | "light-olive" | "olive-light" | "olive" | "neutral-olive" | "dark";
}

export const ValuePropositionSection = ({
  steps = [
    {
      number: "1",
      title: "Design-thinking workshop",
      icon: "lightbulb-on",
      subtitle: "Clarify customer needs, validate your idea has the potential to be a product-market fit in one intensive day.",
      imageUrl: bitmapImages.workshopSession.path,
      imageAlt: bitmapImages.workshopSession.alt,
      points: [
        {
          highlight: "Validate your idea",
          description: "Cut through the noise and get validation on your concept in one intensive day.",
        },
        {
          highlight: "Zero in and clarify",
          description: "on the exact customer need or business problem to ensure you're making what matters.",
        },
        {
          highlight: "De-risk investment",
          description: "Secure the evidence needed to establish an undeniable product-market fit before you build.",
        },
      ],
      className: "md:col-span-1"
    },
    {
      number: "2",
      title: "Prototype & roadmap",
      icon: "arrow-pointer",
      subtitle: "Go from concept into high-fidelity clickable prototypes in two weeks to test affordably, secure investor confidence, and get a roadmap for building the right features in the right sequence.",
      imageUrl: bitmapImages.mobilePrototype.path,
      imageAlt: bitmapImages.mobilePrototype.alt,
      points: [
        {
          highlight: "Prototype & secure buy-in",
          description: "Turn your concept into a precise, actionable strategy using high-fidelity clickable prototypes.",
        },
        {
          highlight: "Test affordably",
          description: "Use the prototypes (delivered in two weeks) to gain investor confidence and test your product.",
        },
        {
          highlight: "Maximise success",
          description: "Get a roadmap that ensures you build the right features in the right sequence for maximum market impact.",
        },
      ],
      className: "md:col-span-1"
    },
    {
      number: "3",
      title: "Consult and build",
      icon: "mobile-alt",
      subtitle: "Get dedicated expert guidance at every stage, choose the optimal strategy and technical stack, and access a vetted network of developers for seamless mobile, web, and systems integration",
      imageUrl: bitmapImages.techStrategy.path,
      imageAlt: bitmapImages.techStrategy.alt,
      points: [
        {
          highlight: "Get expert guidance",
          description: "Get a dedicated industry guru and immediate expert consultancy to guide every stage.",
        },
        {
          highlight: "Optimise Your Tech",
          description: "Choose the best strategy, design, and development path, including the optimal technical stack.",
        },
        {
          highlight: "Seamless Delivery",
          description: "Access a vetted network of developers and gurus for mobile, web, and systems integration.",
        },
      ],
      className: "md:col-span-1"
    }
  ],
  sectionTheme,
}: ValuePropositionSectionProps) => {
  const [openSheetIndex, setOpenSheetIndex] = useState<number | null>(null)
  
  const themeClass =
    sectionTheme === "light-olive" ? "olive-light" : sectionTheme === "olive-light" ? "olive-light" : sectionTheme;

  const handleSheetOpenChange = (index: number) => (open: boolean) => {
    setOpenSheetIndex(open ? index : null)
  }

  const handlePrevious = () => {
    if (openSheetIndex !== null && openSheetIndex > 0) {
      setOpenSheetIndex(openSheetIndex - 1)
    }
  }

  const handleNext = () => {
    if (openSheetIndex !== null && openSheetIndex < steps.length - 1) {
      setOpenSheetIndex(openSheetIndex + 1)
    }
  }




  return (
    <section className="py-12 mt-24 md:py-24 ">
      <div className="container mx-auto flex flex-col items-center gap-12 px-4 md:px-6">
        <div className="flex max-w-xl flex-col items-center gap-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">What you'll get</p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground">Idea to action, in 3 simple steps</h2>
         <p className="text-base text-muted-foreground">Clarity, Validation, and Quality-First Execution. We replace \"vibe code\" with a clear path forward, securing long-term success.</p>
        </div>
        {steps.length > 0 && (
          <div className="grid w-full grid-cols-1 gap-8 items-stretch lg:grid-cols-3">
            <BentoCard
              {...steps[0]}
              className={cn("h-full", steps[0].className)}
              open={openSheetIndex === 0}
              onOpenChange={handleSheetOpenChange(0)}
              sheetContent={
                <DesignThinkerWorkshopSheet
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  hasPrevious={false}
                  hasNext={true}
                />
              }
            />
            <BentoCard
              {...steps[1]}
              className={cn("h-full", steps[1].className)}
              open={openSheetIndex === 1}
              onOpenChange={handleSheetOpenChange(1)}
              sheetContent={
                <PrototypeRoadmapSheet
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  hasPrevious={true}
                  hasNext={true}
                />
              }
            />
            <BentoCard
              {...steps[2]}
              className={cn("h-full", steps[2].className)}
              open={openSheetIndex === 2}
              onOpenChange={handleSheetOpenChange(2)}
              sheetContent={
                <ConsultBuildSheet
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  hasPrevious={true}
                  hasNext={false}
                />
              }
            />
          </div>
        )}
      </div>
    </section>
  );
};