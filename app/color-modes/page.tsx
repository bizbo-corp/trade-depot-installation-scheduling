'use client'

import { ArrowRight, Check } from "lucide-react"

import { PurposeWheel } from "@/components/purpose-framework/PurposeWheel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SECTIONS = [
  { id: "light", label: "Light", wrapperClass: "" },
  { id: "olive-light", label: "Olive Light", wrapperClass: "olive-light" },
  { id: "olive", label: "Olive", wrapperClass: "olive" },
  { id: "neutral-olive", label: "Neutral Olive", wrapperClass: "neutral-olive" },
  { id: "dark", label: "Dark", wrapperClass: "dark" },
] as const

export default function ColorModesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="container mx-auto flex flex-col gap-4 px-6 py-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Design tokens</span>
            <h1 className="heading-xl uppercase leading-tight">
              Colour modes
              <br />
              <span className="text-muted-foreground">palette overview</span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              A side-by-side look at how the Bizbo brand palette behaves across each supported mode. The wheel
              illustrates progressive background layers while the call to action block demonstrates core surface,
              foreground, and interactive tokens.
            </p>
          </div>
        </div>
      </header>

      <main>
        {SECTIONS.map((section) => (
          <section
            key={section.id}
            className={cn(
              "bg-background text-foreground transition-colors",
              section.wrapperClass,
              section.wrapperClass ? "isolate" : "",
            )}
          >
            <div className="container mx-auto flex flex-col items-start gap-12 px-6 py-24 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1 space-y-10">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-muted-foreground">
                    <span>{section.label}</span>
                  </div>
                  <h2 className="heading-xl leading-tight">
                    foreground
                    <br />
                    <span className="text-muted-foreground">muted-foreground</span>
                  </h2>
                  <p className="max-w-xl text-lg text-muted-foreground">
                    Each mode carries the same typographic hierarchy while swapping surface and interactive tokens to
                    keep contrast ratios accessible in every environment.
                  </p>
                </div>

                <div className="space-y-8">
                  <ul className="space-y-3 text-base">
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-none text-foreground" />
                      <span>Foreground</span>
                    </li>
                    <li className="pl-8 text-muted-foreground">muted-foreground</li>
                    <li className="pl-8">Primary-foreground</li>
                  </ul>

                  <div className="flex flex-wrap gap-3">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Primary-foreground
                    </Button>
                    <Button
                      variant="ghost"
                      className="border border-transparent bg-transparent px-6 text-foreground hover:bg-foreground/10"
                    >
                      Get a website analysis
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex w-full justify-center lg:w-auto">
                <PurposeWheel className="max-w-[480px]" />
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}


