import Image from "next/image"

export interface LogoSectionProps {
  logos?: string[]
  className?: string
}

export const LogoSection = ({ logos = [], className }: LogoSectionProps) => {
  const defaultLogos = logos.length > 0 ? logos : Array(6).fill("https://ui.shadcn.com/placeholder.svg")
  
  return (
    <section className={`py-12 md:py-24 bg-background ${className || ""}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 items-center justify-center gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {defaultLogos.map((src, index) => (
            <div key={index} className="flex justify-center p-6 bg-muted">
              <Image src={src} alt={`Logo ${index + 1}`} width={140} height={40} className="grayscale" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}





