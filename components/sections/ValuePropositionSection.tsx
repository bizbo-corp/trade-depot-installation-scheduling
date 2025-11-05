import { BentoCard, BentoCardProps } from "@/components/sections/cards/BentoCard"
import { ImageCard, ImageCardProps } from "@/components/sections/cards/ImageCard"
import { Button } from "@/components/ui/button"
import { svgGraphics, bitmapImages } from "@/lib/images"

export interface ValuePropositionStep extends Omit<BentoCardProps, "className"> {
  className?: string
}

export interface ValuePropositionSectionProps {
  heading?: string
  subheading?: string
  description?: string
  steps?: ValuePropositionStep[]
  imageCards?: Array<Pick<ImageCardProps, "imageUrl" | "alt">>
  mode?: "default" | "olive"
}

export const ValuePropositionSection = ({
  heading = "Idea to action, in 3 simple steps",
  subheading = "What you'll get",
  description = "Clarity, Validation, and Quality-First Execution. We replace \"vibe code\" with a clear path forward, securing long-term success.",
  steps = [
    {
      number: "1",
      title: "DesignThinker 1-day workshop",
      subtitle: "Get clarity on your idea, fast",
      description: "Whether you have a complex challenge or a rough idea, this workshop cuts through the noise and will ensure diverse perspectives and customer pain points get solved. Stop risking capital on assumptions. In one-day intensive workshop, you'll gain expert validation to ensure a strong, undeniable product-market fit.",
      imageUrl: svgGraphics.designThinkerWorkshop.path,
      className: "md:col-span-1"
    },
    {
      number: "2",
      title: "Prototype and actionable roadmap",
      subtitle: "Validate your idea & get buy-in",
      description: "Move from concept to a precise, actionable strategy with high-fidelity prototypes delivered just 2 weeks after the workshop. Use these clickable prototypes to secure investor buy-in, test inexpensively, and ensure your product roadmap builds the right features in the right sequence for maximum market success.",
      imageUrl: svgGraphics.prototypeActionableRoadmap.path,
      className: "md:col-span-1"
    },
    {
      number: "3",
      title: "Technology kick-off",
      subtitle: "Get expert consultancy and build right",
      description: "Partner with a dedicated industry expert who guides you through every stage: strategy, design, and development. You'll not only choose the optimal tech stack, but gain immediate access to my vetted network of platform gurus when you need it - from mobile and web app developers to systems integration specialists.",
      imageUrl: svgGraphics.buildStrategyPartner.path,
      className: "md:col-span-1"
    }
  ],
  imageCards = [
    {
      imageUrl: bitmapImages.mobilePrototype.path,
      alt: bitmapImages.techStrategy.alt
    },
    {
      imageUrl: bitmapImages.workshopSession.path,
      alt: bitmapImages.workshopSession.alt
    },
    {
      imageUrl: bitmapImages.techStrategy.path,
      alt: svgGraphics.buildStrategyPartner.alt
    }
  ],
  mode = "olive"
}: ValuePropositionSectionProps) => {
  return (
    <section className={`py-12 md:py-24 bg-background ${mode === "olive" ? "olive" : ""}`}>
      <div className="container mx-auto flex flex-col items-center gap-12 px-4 md:px-6">
        <div className="flex max-w-xl flex-col items-center gap-4 text-center">
          {subheading && <p className="text-sm text-muted-foreground">{subheading}</p>}
          <h2 className="text-3xl font-bold tracking-tight">{heading}</h2>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        <div className="flex w-full flex-col gap-3">
          {steps.length > 0 && (
            <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {steps.map((step, index) => (
                <BentoCard key={index} {...step} />
              ))}
            </div>
          )}
          {imageCards.length > 0 && (
            <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {imageCards.map((card, index) => (
                <ImageCard key={index} {...card} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

