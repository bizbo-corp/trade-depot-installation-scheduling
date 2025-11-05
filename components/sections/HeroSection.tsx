"use client"

import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ReactNode } from "react";
import { LottieAnimation } from "@/components/LottieAnimation";
import { BookingDialog } from "@/components/booking/BookingDialog";

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
  description: string;
  features?: HeroFeature[];
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  image?: {
    src: string;
    alt: string;
  };
  imageOrder?: "first" | "last";
  lottieSrc?: string;
}

export const HeroSection = ({
  title,
  description,
  features = [],
  primaryCta,
  secondaryCta,
  image,
  imageOrder = "last",
  lottieSrc,
}: HeroSectionProps) => {
  return (
    <section className="bg-background pt-0 pb-12 md:pb-24 md:min-h-screen relative overflow-hidden flex flex-col">
      {/* Lottie Animation - relative on mobile, absolute on desktop */}
      {lottieSrc && (
        <div className="relative md:absolute -order-1 md:order-0 pt-56 md:pt-18 pl-12 left-1/2 -translate-x-1/2 w-screen pointer-events-none lg:max-w-[2000px]">
          <div className="w-full h-full">
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

      <div className="container mx-auto px-4 md:px-6 relative z-10 w-full flex-1 flex flex-col md:justify-end">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16 md:pb-12 lg:pb-12 xl:pb-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl lg:text-6xl font-extrabold text-neutral-olive-200 text-primary">
                From idea to app. <br />
                <span className="text-olive-500 dark:text-olive-600">
                  We build it.
                </span>
              </h1>

              <p className="text-xl text-foreground">{description}</p>
            </div>

            {features.length > 0 && (
              <ul className="flex flex-col gap-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                    <span className="text-lg text-accent-foreground">{feature.text}</span>
                  </li>
                ))}
              </ul>
            )}
            {(primaryCta || secondaryCta) && (
              <div className="flex flex-col gap-3 sm:flex-row">
                {primaryCta &&
                  (primaryCta.href ? (
                    <Button
                      size="lg"
                      className="w-full sm:w-auto"
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
                        className="w-full sm:w-auto"
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
                      className="w-full sm:w-auto"
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
                      className="w-full sm:w-auto"
                    >
                      {secondaryCta.text}
                      {secondaryCta.showArrow && (
                        <ArrowRight className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  ))}
              </div>
            )}
          </div>
          {image && (
            <div
              className={
                imageOrder === "first"
                  ? "order-first lg:order-first"
                  : "hidden lg:block"
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
    </section>
  );
};
