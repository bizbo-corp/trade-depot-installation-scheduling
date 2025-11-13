import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const HERO_CHECKLIST = [
  "Launch a user-ready prototype in weeks, not months.",
  "Validate with real customers before you invest heavily.",
  "Optimise every build sprint with embedded AI co-pilots.",
]

export function TempCTA() {
  return (
    <div className="flex flex-col gap-8 md:max-w-2xl">
      <div className="flex flex-col gap-6 ">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl lg:text-6xl">
          <span className="mb-2 block">From idea to app.</span>
          <span className="text-accent-foreground dark:text-accent-foreground">We build it.</span>
        </h1>
        <p className="max-w-xl text-lg font-medium leading-relaxed text-foreground md:text-xl">
          Partner with Bizbo to design, prototype, and launch the next generation of digital
          products. We combine user-centred design, automation, and AI-assisted development to
          remove the bottlenecks that hold brilliant ideas back.
        </p>
      </div>
      <ul className="flex flex-col gap-4">
        {HERO_CHECKLIST.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-foreground md:h-6 md:w-6" />
            <span className="text-lg text-foreground/70 md:text-xl">{item}</span>
          </li>
        ))}
      </ul>
      <Button variant="default" size="lg" className="w-full px-8 sm:w-auto">
        Start your build
      </Button>
    </div>
  )
}

