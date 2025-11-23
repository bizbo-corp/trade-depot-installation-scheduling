import React from "react";

import { FaIcon } from "../ui/fa-icon";

const services = [
  { name: "Washing machine", icon: "washing-machine" },
  { name: "Refrigerator", icon: "snowflake" },
  { name: "Air conditioner / Heat Pump", icon: "air-conditioner" },
  { name: "Cooktops", icon: "fire-burner" },
  { name: "Dryer", icon: "dryer" },
  { name: "Water dispenser", icon: "glass-water" },
  { name: "Dishwasher", icon: "plate-utensils" },
  { name: "Waste disposer", icon: "trash-can" },
];

export function InstallationServices() {
  return (
    <section className="py-20 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-card/50 rounded-lg border border-border/50"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full text-primary shrink-0">
                <FaIcon icon={item.icon} style="duotone" size={2} />
              </div>
              <span className="text-lg font-medium text-foreground/80">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
