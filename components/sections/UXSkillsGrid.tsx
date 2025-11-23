import React from "react";

import { FaIcon } from "../ui/fa-icon";

const skills = [
  {
    category: "Discovery",
    items: [
      { name: "SEO and performance optimisation", icon: "magnifying-glass" },
      { name: "Journey mapping", icon: "map" },
      { name: "Research", icon: "flask" },
      { name: "User interviews", icon: "users" },
    ],
  },
  {
    category: "Design",
    items: [
      { name: "Effective copywriting", icon: "bullhorn" },
      { name: "Wireframing", icon: "bezier-curve" },
      { name: "Figma prototyping", icon: "pen-nib" },
      { name: "Design systems", icon: "swatchbook" },
    ],
  },
  {
    category: "Test and Grow",
    items: [
      { name: "User testing", icon: "user-check" },
      { name: "A/B testing", icon: "scale-balanced" },
      { name: "Monitoring", icon: "chart-line" },
      { name: "Analytics", icon: "chart-simple" },
    ],
  },
];

export function UXSkillsGrid() {
  return (
    <section className="py-20 w-full">
      <div className="flex max-w-xl flex-col items-center gap-4 text-center mx-auto mb-12">
        <h2 className="text-4xl font-bold tracking-tight text-foreground">
          Let Bizbo expertise help you grow your business in these areas.
        </h2>
        {/* <p className="text-base text-foreground">
          Let Bizbo expertise help you grow your business in these areas.
        </p> */}
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {skills.map((section, index) => (
            <div key={index} className="flex flex-col gap-6">
              {/* <h3 className="text-2xl font-bold text-foreground pb-2 inline-block self-start">
                {section.category}
              </h3> */}
              <div className="grid grid-cols-1 gap-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-4 p-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full text-foreground shrink-0">
                      <FaIcon icon={item.icon} style="duotone" size={2} />
                    </div>
                    <span className="text-lg font-medium text-foreground/60">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
