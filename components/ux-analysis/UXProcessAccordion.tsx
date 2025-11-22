"use client";

import * as React from "react";
import { 
  Target, 
  Search, 
  Lightbulb, 
  Map, 
  Signpost, 
  MousePointer2, 
  Sparkles, 
  FlaskConical, 
  Ruler,
  ChevronDown
} from "lucide-react";
import { FaIcon } from "@/components/ui/fa-icon";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  number: string;
  title: string;
  description: string;
  mainIcon: string;
  details: {
    icon: React.ElementType;
    text: string;
  }[];
}

const steps: Step[] = [
  {
    id: "discovery",
    number: "01",
    title: "Discovery",
    description: "Understand exactly what your customers need and where the biggest opportunities lie",
    mainIcon: "magnifying-glass",
    details: [
      { icon: Target, text: "Identify the most important goals for your business and where to focus efforts for maximum impact" },
      { icon: Search, text: "Get clear insights from data about how well your checkout or lead capture is performing, and see what competitors are doing" },
      { icon: Lightbulb, text: "Understand the complete customer journey and find where people are getting stuck or frustrated" },
    ],
  },
  {
    id: "design",
    number: "02",
    title: "Design",
    description: "Create a clear, streamlined experience that guides customers smoothly towards action",
    mainIcon: "ruler-triangle",
    details: [
      { icon: Map, text: "Simplify your messaging and make it easier for customers to find what they need and complete their purchase or enquiry" },
      { icon: Signpost, text: "Design layouts that remove obstacles and naturally guide people towards buying or getting in touch" },
      { icon: MousePointer2, text: "Build working prototypes to test ideas before investing in full development" },
    ],
  },
  {
    id: "test-grow",
    number: "03",
    title: "Test and grow",
    description: "Continuously improve your results through testing and measurement",
    mainIcon: "display-chart-up",
    details: [
      { icon: Sparkles, text: "Make quick improvements that boost conversions straight away" },
      { icon: FlaskConical, text: "Test different versions to ensure every change actually improves results" },
      { icon: Ruler, text: "Track how improvements directly increase revenue and customer value" },
    ],
  },
];

export function UXProcessAccordion({ className }: { className?: string }) {
  const [openItem, setOpenItem] = React.useState<string | null>("discovery");

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className={cn("container mx-auto flex flex-col lg:flex-row gap-4 px-4 md:px-6 ", className)}>
      {steps.map((step) => {
        const isOpen = openItem === step.id;
        
        return (
          <div 
            key={step.id}
            onClick={() => !isOpen && toggleItem(step.id)}
            className={cn(
              "group relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-500 ease-in-out cursor-pointer",
              // Mobile styles
              "flex flex-col",
              // Desktop styles: flex-grow based on open state
              "lg:h-[600px]", 
              isOpen ? "lg:flex-[3] ring-2 ring-primary/20 shadow-lg bg-card/80" : "lg:flex-1 hover:bg-card/80 hover:border-primary/30 hover:shadow-md"
            )}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleItem(step.id);
              }}
              className={cn(
                "w-full flex flex-col items-start text-left p-6 gap-4 focus:outline-none transition-all",
                "justify-start cursor-pointer"
              )}
            >
              <div className="flex items-center justify-between w-full">
                 <span className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold border transition-colors duration-300 shrink-0",
                  isOpen 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-muted text-muted-foreground border-border group-hover:border-primary/50 group-hover:text-foreground"
                )}>
                  {step.number}
                </span>
                
                <ChevronDown className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 lg:hidden",
                  isOpen && "rotate-180 text-primary"
                )} />
              </div>

              <div className="flex-1 pt-1 w-full lg:pt-4">
                 <div className="mb-4 hidden lg:block">
                    <FaIcon 
                        icon={step.mainIcon} 
                        style="duotone" 
                        duotoneBaseStyle="thin"
                        size={8} 
                        className={cn(
                            "text-primary transition-all duration-300",
                            isOpen ? "opacity-100 scale-100" : "opacity-70 scale-90 group-hover:scale-100 group-hover:opacity-100"
                        )}
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

                <h3 className={cn(
                  "text-xl font-bold transition-colors duration-300 mb-2",
                  isOpen ? "text-primary" : "text-foreground group-hover:text-primary/80"
                )}>
                  {step.title}
                </h3>
                <p className={cn(
                    "text-muted-foreground font-medium leading-relaxed transition-all duration-300"
                )}>
                  {step.description}
                </p>
              </div>
            </button>

             <div className={cn(
                "overflow-hidden transition-all duration-500",
                // Mobile: Height transition
                isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0",
                // Desktop: 
                "lg:max-h-none" 
             )}>
                <div className={cn(
                    "px-6 pb-8 pt-2 lg:pt-4",
                    // Desktop: fade in/out
                    "lg:transition-opacity lg:duration-500 lg:delay-100",
                    isOpen ? "lg:opacity-100 lg:visible" : "lg:opacity-0 lg:invisible lg:h-0"
                )}>
                  
                  <ul className="space-y-8 min-w-[300px] max-w-3xl mx-auto pl-4 md:pr-32">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-4 group/item">
                        <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0 group-hover/item:bg-primary/20 transition-colors">
                          <detail.icon className="w-5 h-5" />
                        </div>
                        <span className="text-foreground/90 leading-relaxed text-base mt-1">
                          {detail.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
             </div>
          </div>
        );
      })}
    </div>
  );
}
