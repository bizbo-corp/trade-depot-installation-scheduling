import type { PropsWithChildren } from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { FaIcon, type FaIconStyle } from "@/components/ui/fa-icon"
import { cn } from "@/lib/utils"

const featureCardVariants = cva(
  "flex w-full flex-col gap-6 items-start overflow-hidden rounded-xl h-full transition-colors duration-200 ease-out group-hover:bg-background-2",
  {
    variants: {
      device: {
        desktop: "p-12",
        mobile: "p-4",
      },
    },
    defaultVariants: {
      device: "desktop",
    },
  }
)

const iconWrapperVariants = cva(
  "flex size-40 shrink-0 items-center justify-center text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground",
  {
    variants: {
      device: {
        desktop: "",
        mobile: "",
      },
    },
    defaultVariants: {
      device: "desktop",
    },
  }
)

export interface FeatureCardProps
  extends VariantProps<typeof featureCardVariants>,
    PropsWithChildren {
  title: string
  description: string
  icon: string
  iconStyle?: FaIconStyle
  className?: string
  headingClassName?: string
  descriptionClassName?: string
}

export function FeatureCard({
  device,
  title,
  description,
  icon,
  iconStyle = "duotone",
  className,
  headingClassName,
  descriptionClassName,
  children,
}: FeatureCardProps) {
  return (
    <article className={cn("group flex w-full flex-col gap-2 items-start rounded-3xl", className)}>
      <div className={cn(featureCardVariants({ device }))}>
        <div className="flex w-full flex-col gap-2 px-6">
          <div className="flex w-full items-start">
            <div className={cn(iconWrapperVariants({ device }))}>
              <FaIcon
                icon={icon}
                style={iconStyle}
                size={8}
                className="text-current"
                duotoneBaseStyle="thin"
                secondaryOpacity={0.4}
              />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 px-6">
          <h3
            className={cn(
              "text-2xl font-semibold text-foreground transition-colors duration-200 ease-out group-hover:text-card-foreground",
              headingClassName
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "text-xl leading-7 text-muted-foreground",
              descriptionClassName
            )}
          >
            {description}
          </p>
        </div>

        {children ? <div className="flex w-full flex-col gap-2 px-6">{children}</div> : null}
      </div>
    </article>
  )
}

