import { BentoCard, BentoCardProps } from "@/components/sections/cards/BentoCard"
import { ImageCard, ImageCardProps } from "@/components/sections/cards/ImageCard"
import { Button } from "@/components/ui/button"

export interface ValuePropositionStep extends Omit<BentoCardProps, "className"> {
  className?: string
}

export interface ValuePropositionSectionProps {
  heading?: string
  subheading?: string
  description?: string
  steps: ValuePropositionStep[]
  imageCards?: Array<Pick<ImageCardProps, "imageUrl" | "alt">>
  mode?: "default" | "olive"
}

export const ValuePropositionSection = ({
  heading = "Idea to action, in 3 simple steps",
  subheading = "What you'll get",
  description = "Clarity, Validation, and Quality-First Execution. We replace \"vibe code\" with a clear path forward, securing long-term success.",
  steps,
  imageCards = [],
  mode = "default"
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

