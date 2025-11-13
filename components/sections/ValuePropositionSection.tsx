import { BentoCard, BentoCardProps } from "@/components/sections/cards/BentoCard";
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
  heading = "Idea to action, in 3 simple steps",
  subheading = "What you'll get",
  description = "Clarity, Validation, and Quality-First Execution. We replace \"vibe code\" with a clear path forward, securing long-term success.",
  steps = [
    {
      number: "1",
      title: "DesignThinker workshop",
      icon: "lightbulb-on",
      subtitle: "Get clarity on your idea, fast",
      imageUrl: bitmapImages.workshopSession.path,
      imageAlt: bitmapImages.workshopSession.alt,
      points: [
        {
          highlight: "Validate your idea",
          description: ": Cut through the noise and get validation on your concept in one intensive day.",
        },
        {
          highlight: "Zero in and clarify",
          description: "on the exact customer need or business problem to ensure you're making what matters.",
        },
        {
          highlight: "De-risk investment",
          description: ": Secure the evidence needed to establish an undeniable product-market fit before you build.",
        },
      ],
      className: "md:col-span-1"
    },
    {
      number: "2",
      title: "Prototype & roadmap",
      icon: "arrow-pointer",
      subtitle: "Validate your idea & get buy-in",
      imageUrl: bitmapImages.mobilePrototype.path,
      imageAlt: bitmapImages.mobilePrototype.alt,
      points: [
        {
          highlight: "Prototype & secure buy-in",
          description: ": Turn your concept into a precise, actionable strategy using high-fidelity clickable prototypes.",
        },
        {
          highlight: "Test affordably",
          description: ": Use the prototypes (delivered in two weeks) to gain investor confidence and test your product.",
        },
        {
          highlight: "Maximise success",
          description: ": Get a roadmap that ensures you build the right features in the right sequence for maximum market impact.",
        },
      ],
      className: "md:col-span-1"
    },
    {
      number: "3",
      title: "Consult and build",
      icon: "mobile-alt",
      subtitle: "Get expert consultancy and build right",
      imageUrl: bitmapImages.techStrategy.path,
      imageAlt: bitmapImages.techStrategy.alt,
      points: [
        {
          highlight: "Get expert guidance",
          description: ": Get a dedicated industry guru and immediate expert consultancy to guide every stage.",
        },
        {
          highlight: "Optimise Your Tech",
          description: ": Choose the best strategy, design, and development path, including the optimal technical stack.",
        },
        {
          highlight: "Seamless Delivery",
          description: ": Access a vetted network of developers and gurus for mobile, web, and systems integration.",
        },
      ],
      className: "md:col-span-1"
    }
  ],
  sectionTheme,
}: ValuePropositionSectionProps) => {
  const themeClass =
    sectionTheme === "light-olive" ? "olive-light" : sectionTheme === "olive-light" ? "olive-light" : sectionTheme;

  return (
    <section className="py-12 mt-24 md:py-24 ">
      <div className="container mx-auto flex flex-col items-center gap-12 px-4 md:px-6">
        <div className="flex max-w-xl flex-col items-center gap-4 text-center">
          {subheading && <p className="text-sm font-medium text-muted-foreground">{subheading}</p>}
          <h2 className="text-4xl font-bold tracking-tight text-foreground">{heading}</h2>
          {description && <p className="text-base text-muted-foreground">{description}</p>}
        </div>
        {steps.length > 0 && (
          <div className="grid w-full grid-cols-1 gap-8 items-stretch lg:grid-cols-3">
            {steps.map((step, index) => (
              <BentoCard key={index} {...step} className={cn("h-full", step.className)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};