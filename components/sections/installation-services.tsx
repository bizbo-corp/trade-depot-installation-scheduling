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
  // Duplicate services for seamless marquee loop
  const duplicatedServices = [...services, ...services];

  return (
    <section className="py-20 w-full overflow-hidden lg:bottom-0 lg:left-0 lg:right-0 lg:backdrop-blur-sm">
      <div className="relative">
        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .marquee-container {
            animation: marquee 30s linear infinite;
          }
          .marquee-container:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="flex marquee-container">
          {duplicatedServices.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-card/20 rounded-lg mx-3 whitespace-nowrap flex-shrink-0"
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
