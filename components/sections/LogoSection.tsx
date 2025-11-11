import { bizLogos } from "@/lib/images";
import { cn } from "@/lib/utils";

export interface LogoSectionLogo {
  src: string;
  alt?: string;
}

export interface LogoSectionProps {
  logos?: Array<LogoSectionLogo | string>;
  className?: string;
}

export const LogoSection = ({ logos = [], className }: LogoSectionProps) => {
  const defaultLogos =
    logos.length > 0
      ? logos
      : Object.values(bizLogos).map((logo) => ({ src: logo.path, alt: logo.alt }));

  const normalizedLogos = defaultLogos.map((logo, index) =>
    typeof logo === "string"
      ? { src: logo, alt: `Logo ${index + 1}` }
      : { src: logo.src, alt: logo.alt ?? `Logo ${index + 1}` },
  );

  return (
    <section className={cn("bg-background/80 py-12 md:py-24", className)}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 items-center justify-center gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {normalizedLogos.map(({ src, alt }, index) => (
            <div
              key={`${src}-${index}`}
              className="flex items-center justify-center p-4 text-foreground"
            >
              <span
                role="img"
                aria-label={alt}
                className="block h-12 w-full max-w-[240px]"
                style={{
                  backgroundColor: "currentColor",
                  maskImage: `url(${src})`,
                  WebkitMaskImage: `url(${src})`,
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};






