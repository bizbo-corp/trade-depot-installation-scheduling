"use client"

import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ReactNode } from "react";
import { LottieAnimation } from "@/components/LottieAnimation";
import { BookingDialog } from "@/components/booking/BookingDialog";
import { animations } from "@/lib/images";
import { cn } from "@/lib/utils";

export interface HeroFeature {
  text: string;
}

export interface HeroCta {
  text: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
  showArrow?: boolean;
}

export interface HeroSectionProps {
  title?: string | ReactNode;
  description?: string;
  features?: HeroFeature[];
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  image?: {
    src: string;
    alt: string;
  };
  imageOrder?: "first" | "last";
  lottieSrc?: string;
  sectionTheme?: "light" | "olive-light" | "olive" | "neutral-olive" | "dark";
}

export const HeroSection = ({
  title,
  description = "Simplify the process of building a market-defining digital web app - one your customers can't live without and your rivals will desperately want to copy.",
  features = [
    { text: "Build the right product with real customer value" },
    { text: "Test, gain buy-in, and secure funding fast" },
    { text: "Beat your competition to market" }
  ],
  primaryCta = {
    text: "Schedule a discovery call",
    variant: "default" as const
  },
  secondaryCta = {
    text: "Get a website analysis",
    variant: "ghost" as const,
    showArrow: true
  },
  image,
  imageOrder = "last",
  lottieSrc = animations.hero.path,
  sectionTheme,
}: HeroSectionProps) => {
  return (
    <section
      className={cn(
        "bg-background pt-16 md:pt-24 pb-16 md:pb-32 md:min-h-screen relative overflow-hidden flex flex-col",
        sectionTheme
      )}
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10 w-full flex-1 flex flex-col md:justify-center">
        <div className="grid items-center md:items-start gap-8 md:grid-cols-[40%_60%] md:gap-16">
          {/* Text Content Column */}
          <div className="flex flex-col gap-8 w-full md:max-w-2xl relative z-20 order-2 md:order-1">
            <div className="flex flex-col gap-6">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1]">
                <span className="mb-2 block">From idea to app.</span>
                <span className="text-accent-foreground dark:text-accent-foreground">
                  We build it.
                </span>
              </h1>

              <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed max-w-xl">{description}</p>
            </div>

            {features.length > 0 && (
              <ul className="flex flex-col gap-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 md:h-6 md:w-6 shrink-0 text-foreground mt-0.5" />
                    <span className="text-lg md:text-xl text-foreground/60">{feature.text}</span>
                  </li>
                ))}
              </ul>
            )}
            {(primaryCta || secondaryCta) && (
              <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    {primaryCta &&
                      (primaryCta.href ? (
                        <Button
                          size="lg"
                          className="w-full sm:w-auto px-8"
                          variant={primaryCta.variant}
                          asChild
                        >
                          <a href={primaryCta.href}>
                            {primaryCta.text}
                            {primaryCta.showArrow && (
                              <ArrowRight className="ml-2 h-4 w-4" />
                            )}
                          </a>
                        </Button>
                      ) : (
                        <BookingDialog>
                          <Button
                            size="lg"
                            className="w-full sm:w-auto px-8"
                            variant={primaryCta.variant}
                          >
                            {primaryCta.text}
                            {primaryCta.showArrow && (
                              <ArrowRight className="ml-2 h-4 w-4" />
                            )}
                          </Button>
                        </BookingDialog>
                      ))}
                    {secondaryCta &&
                      (secondaryCta.href ? (
                        <Button
                          size="lg"
                          variant={secondaryCta.variant || "ghost"}
                          className="w-full sm:w-auto px-8"
                          asChild
                        >
                          <a href={secondaryCta.href}>
                            {secondaryCta.text}
                            {secondaryCta.showArrow && (
                              <ArrowRight className="ml-2 h-4 w-4" />
                            )}
                          </a>
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          variant={secondaryCta.variant || "ghost"}
                          className="w-full sm:w-auto px-8"
                        >
                          {secondaryCta.text}
                          {secondaryCta.showArrow && (
                            <ArrowRight className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      ))}
                </div>
              </div>
            )}
          </div>

          {/* Animation/Image Column */}
          <div className="relative z-10 order-1 md:order-2">
            {lottieSrc && (
              <div className="relative md:pt-0 md:-mt-4 lg:-mt-8 xl:-mt-10 pointer-events-none opacity-60 md:opacity-70 max-h-[700px] md:max-h-[900px] lg:max-h-[1000px] overflow-hidden">
                <div className="relative w-full h-full">
                  <LottieAnimation
                    src={lottieSrc}
                    className="w-full h-full"
                    loop={false}
                    autoplay={true}
                    scaleToFit={true}
                  />
                </div>
              </div>
            )}
            {image && (
              <div
                className={
                  imageOrder === "first"
                    ? "order-first lg:order-first"
                    : lottieSrc ? "hidden" : "hidden lg:block"
                }
              >
                <AspectRatio ratio={1 / 1}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="rounded-xl object-cover"
                  />
                </AspectRatio>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
