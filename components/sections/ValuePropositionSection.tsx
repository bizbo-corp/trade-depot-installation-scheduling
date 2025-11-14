"use client"

import { useState } from "react"
import { BentoCard } from "@/components/sections/cards/BentoCard";
import { DesignThinkerWorkshopSheet } from "@/components/sections/cards/DesignThinkerWorkshopSheet";
import { PrototypeRoadmapSheet } from "@/components/sections/cards/PrototypeRoadmapSheet";
import { ConsultBuildSheet } from "@/components/sections/cards/ConsultBuildSheet";
import { bitmapImages } from "@/lib/images";
import { cn } from "@/lib/utils";

export interface ValuePropositionSectionProps {
  heading?: string;
  subheading?: string;
  description?: string;
  sectionTheme?: "light" | "light-olive" | "olive-light" | "olive" | "neutral-olive" | "dark";
}

export const ValuePropositionSection = ({
  sectionTheme,
}: ValuePropositionSectionProps) => {
  const [openSheetIndex, setOpenSheetIndex] = useState<number | null>(null)
  const totalSteps = 3;
  
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
    if (openSheetIndex !== null && openSheetIndex < totalSteps - 1) {
      setOpenSheetIndex(openSheetIndex + 1)
    }
  }




  return (
    <section className="py-12 mt-24 md:py-24 ">
      <div className="container mx-auto flex flex-col items-center gap-12 px-4 md:px-6">
        <div className="flex max-w-xl flex-col items-center gap-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">3 simple steps</p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground">Idea to app launch </h2>
         <p className="text-base text-muted-foreground">Clarity, validation, and quality-first execution on your idea. We replace "vibe code" with a clear path forward and solid foundations to ensure your market success.</p>
        </div>
        <div className="grid w-full grid-cols-1 gap-8 items-stretch lg:grid-cols-3">
          <BentoCard
            number="1"
            title="Design-thinking workshop"
            subtitle="Get clarity on your idea, fast"
            description="Whether you have a complex business challenge or a rough app idea, this workshop cuts through the noise. Stop risking capital on assumptions. In this one-day intensive workshop, you'll gain expert clarity to ensure your design solves a real customer need and achieves undeniable product-market fit."
            icon="lightbulb-on"
            imageUrl={bitmapImages.workshopSession.path}
            imageAlt={bitmapImages.workshopSession.alt}
            points={[
              {
                highlight: "Validate your idea",
                description: "Cut through the noise and get validation on your concept in one intensive day.",
              },
              {
                highlight: "Zero in and clarify",
                description: "Pinpoint the exact customer need or business problem so you build what matters.",
              },
              {
                highlight: "De-risk investment",
                description: "Secure the evidence needed to establish undeniable product-market fit before you build.",
              },
            ]}
            className={cn("h-full", "md:col-span-1")}
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
            number="2"
            title="Prototype & roadmap"
            subtitle="Validate your idea and secure buy-in"
            description="Transform your concept into a precise, actionable strategy. Within two weeks of the workshop, you'll receive high-fidelity prototypes. Use these clickable designs to validate with users, secure investor buy-in, test affordably, and ensure your roadmap builds the right features in the right order for maximum market impact."
            icon="arrow-pointer"
            imageUrl={bitmapImages.mobilePrototype.path}
            imageAlt={bitmapImages.mobilePrototype.alt}
            points={[
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
            ]}
            className={cn("h-full", "md:col-span-1")}
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
            number="3"
            title="Plan & build"
            subtitle="Expert guidance on technology and development"
            description="Work with a dedicated industry expert who guides you through strategy, design, and development. You'll choose the optimal tech stack and gain immediate access to my vetted network of platform specialists - from mobile and web app developers to systems integration experts."
            icon="mobile-alt"
            imageUrl={bitmapImages.techStrategy.path}
            imageAlt={bitmapImages.techStrategy.alt}
            points={[
              {
                highlight: "Get expert guidance",
                description: "Get a dedicated industry guru and immediate expert consultancy to guide every stage.",
              },
              {
                highlight: "Optimise your tech",
                description: "Choose the best strategy, design, and development path, including the optimal technical stack.",
              },
              {
                highlight: "Seamless delivery",
                description: "Access a vetted network of developers and gurus for mobile, web, and systems integration.",
              },
            ]}
            className={cn("h-full", "md:col-span-1")}
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
      </div>
    </section>
  );
};