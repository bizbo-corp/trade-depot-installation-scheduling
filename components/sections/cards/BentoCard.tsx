import Image from "next/image"
import { cn } from "@/lib/utils"

export interface BentoCardProps {
  title: string
  number: string
  subtitle: string
  description: string
  imageUrl: string
  className?: string
}

export const BentoCard = ({ title, number, subtitle, description, imageUrl, className }: BentoCardProps) => {
  return (
    <div className={cn("flex flex-col overflow-hidden rounded-xl border bg-muted", className)}>
      <Image
        src={imageUrl}
        alt={title}
        width={400}
        height={236}
        className="h-auto w-full object-cover"
      />
      <div className="flex flex-col gap-2 p-6">
        <div className="flex items-start gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
            {number}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-accent-foreground">{subtitle}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

