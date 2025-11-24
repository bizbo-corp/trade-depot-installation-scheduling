"use client";

import * as React from "react";
import { FaIcon } from "@/components/ui/fa-icon";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  number: string;
  title: string;
  description: string;
  mainIcon: string;
}

const steps: Step[] = [
  {
    id: "step-1",
    number: "01",
    title: "Receive Goods",
    description: "Confirm delivery using the button above",
    mainIcon: "box-open",
  },
  {
    id: "step-2",
    number: "02",
    title: "Book Installation",
    description: "Find the day and time that suits you",
    mainIcon: "calendar-day",
  },
  {
    id: "step-3",
    number: "03",
    title: "Installation",
    description: "Make sure someone is present who can provide access",
    mainIcon: "screwdriver-wrench",
  },
];

export function UXProcessAccordion({ className }: { className?: string }) {
  return (
    <div className={cn("container mx-auto px-4 md:px-6", className)}>
      <div className="flex max-w-xl flex-col items-center gap-4 text-center mx-auto my-24">
        <h2 className="text-4xl font-bold tracking-tight text-foreground">
          How it works
        </h2>
        <p className="text-base text-foreground">
          Your new product is just a few steps away
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {steps.map((step) => (
          <div
            key={step.id}
            className="group relative rounded-xl border border-border/50 bg-foreground/5 backdrop-blur-sm overflow-hidden transition-all duration-300 flex flex-col lg:flex-1 w-full"
          >
            <div className="w-full flex flex-col items-start text-left p-6 gap-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold bg-foreground text-background border-border transition-colors duration-300 shrink-0">
                {step.number}
              </span>

              <div className="flex-1 pt-1 w-full lg:pt-4">
                <div className="mb-4 hidden lg:block">
                  <FaIcon
                    icon={step.mainIcon}
                    style="duotone"
                    duotoneBaseStyle="thin"
                    size={8}
                    className="text-primary opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                {/* Mobile Icon */}
                <div className="mb-4 lg:hidden">
                  <FaIcon
                    icon={step.mainIcon}
                    style="duotone"
                    duotoneBaseStyle="thin"
                    size={3}
                    className="text-primary"
                  />
                </div>

                <h3 className="text-xl font-bold transition-colors duration-300 mb-2 text-foreground group-hover:text-primary/80">
                  {step.title}
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
