"use client";

import { FaIcon } from "@/components/ui/fa-icon";
import { cn } from "@/lib/utils";

// Icon selections for each style
const ICON_SETS = {
  light: ["house", "star", "heart", "user", "bell"],
  solid: ["rocket", "camera", "fire", "trophy", "gem"],
  duotone: ["lightbulb", "brain", "paintbrush", "seedling", "coffee"],
  brands: ["github", "twitter", "facebook", "linkedin", "instagram"],
} as const;

const SIZES: Array<1 | 1.5 | 2 | 3 | 4 | 8> = [1, 1.5, 2, 3, 4, 8];

export default function IconShowcasePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="">
        <h1 className="text-4xl font-bold mb-2">Font Awesome Icon Showcase</h1>
        <p className="text-muted-foreground mb-8">
          Comprehensive visual reference for all icon styles and sizes
        </p>

        {/* Light Style */}
        <IconStyleSection
          title="Classic Light"
          style="light"
          icons={ICON_SETS.light}
        />

        {/* Solid Style */}
        <IconStyleSection
          title="Classic Solid"
          style="solid"
          icons={ICON_SETS.solid}
        />

        {/* Duotone Style */}
        <IconStyleSection
          title="Duotone"
          style="duotone"
          icons={ICON_SETS.duotone}
        />

        {/* Duotone Variations */}
        <DuotoneVariationsSection icons={ICON_SETS.duotone} />

        {/* Brands Style */}
        <IconStyleSection
          title="Brands"
          style="brand"
          icons={ICON_SETS.brands}
        />
      </div>
    </div>
  );
}

interface IconStyleSectionProps {
  title: string;
  style: "light" | "solid" | "duotone" | "brand";
  icons: readonly string[];
}

function IconStyleSection({ title, style, icons }: IconStyleSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-medium">Icon</th>
              <th className="text-center p-3 font-medium">1x</th>
              <th className="text-center p-3 font-medium">1.5x</th>
              <th className="text-center p-3 font-medium">2x</th>
              <th className="text-center p-3 font-medium">3x</th>
              <th className="text-center p-3 font-medium">4x</th>
              <th className="text-center p-3 font-medium">8x</th>
            </tr>
          </thead>
          <tbody>
            {icons.map((icon) => (
              <tr key={icon} className="border-b hover:bg-muted/50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {icon}
                    </code>
                  </div>
                </td>
                {SIZES.map((size) => (
                  <td key={size} className="p-3 text-center">
                    <div className="flex items-center justify-center">
                      <FaIcon
                        icon={icon}
                        style={style}
                        size={size}
                        className="text-foreground"
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DuotoneVariationsSection({ icons }: { icons: readonly string[] }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">Duotone Variations</h2>
      
      <div className="border rounded-lg p-6 bg-muted/30">
        <div className="space-y-8">
        {/* Default Duotone */}
        <div>
          <h3 className="text-lg font-medium mb-3">Default (Solid Base)</h3>
          <div className="grid grid-cols-5 gap-4">
            {icons.map((icon) => (
              <div
                key={icon}
                className="flex flex-col items-center gap-2 p-4 border rounded-lg"
              >
                <FaIcon icon={icon} style="duotone" size={4} />
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {icon}
                </code>
                <pre className="text-xs bg-background border rounded p-2 w-full overflow-x-auto mt-2">
                  <code>{`<FaIcon icon="${icon}" style="duotone" size={4} />`}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Light Base Duotone */}
        <div>
          <h3 className="text-lg font-medium mb-3">Light Base</h3>
          <div className="grid grid-cols-5 gap-4">
            {icons.map((icon) => (
              <div
                key={icon}
                className="flex flex-col items-center gap-2 p-4 border rounded-lg"
              >
                <FaIcon
                  icon={icon}
                  style="duotone"
                  duotoneBaseStyle="light"
                  size={4}
                />
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {icon}
                </code>
                <pre className="text-xs bg-background border rounded p-2 w-full overflow-x-auto mt-2">
                  <code>{`<FaIcon icon="${icon}" style="duotone" duotoneBaseStyle="light" size={4} />`}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Swapped Opacity */}
        <div>
          <h3 className="text-lg font-medium mb-3">Swapped Opacity</h3>
          <div className="grid grid-cols-5 gap-4">
            {icons.map((icon) => (
              <div
                key={icon}
                className="flex flex-col items-center gap-2 p-4 border rounded-lg"
              >
                <FaIcon
                  icon={icon}
                  style="duotone"
                  swapOpacity
                  size={4}
                />
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {icon}
                </code>
                <pre className="text-xs bg-background border rounded p-2 w-full overflow-x-auto mt-2">
                  <code>{`<FaIcon icon="${icon}" style="duotone" swapOpacity size={4} />`}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div>
          <h3 className="text-lg font-medium mb-3">Custom Colors</h3>
          <div className="grid grid-cols-5 gap-4">
            {icons.map((icon, index) => {
              const colorPairs = [
                { primary: "dodgerblue", secondary: "gold" },
                { primary: "sienna", secondary: "red" },
                { primary: "pink", secondary: "palevioletred" },
                { primary: "sandybrown", secondary: "bisque" },
                { primary: "mediumseagreen", secondary: "gold" },
              ];
              const colors = colorPairs[index % colorPairs.length];
              return (
                <div
                  key={icon}
                  className="flex flex-col items-center gap-2 p-4 border rounded-lg"
                >
                  <FaIcon
                    icon={icon}
                    style="duotone"
                    size={4}
                    primaryColor={colors.primary}
                    secondaryColor={colors.secondary}
                    secondaryOpacity={1.0}
                  />
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {icon}
                  </code>
                  <pre className="text-xs bg-background border rounded p-2 w-full overflow-x-auto mt-2">
                    <code>{`<FaIcon icon="${icon}" style="duotone" size={4} primaryColor="${colors.primary}" secondaryColor="${colors.secondary}" secondaryOpacity={1.0} />`}</code>
                  </pre>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Opacity */}
        <div>
          <h3 className="text-lg font-medium mb-3">Custom Opacity</h3>
          <div className="grid grid-cols-5 gap-4">
            {icons.map((icon, index) => {
              const opacities = [0.2, 0.4, 0.6, 0.8, 1.0];
              const opacity = opacities[index % opacities.length];
              return (
                <div
                  key={icon}
                  className="flex flex-col items-center gap-2 p-4 border rounded-lg"
                >
                  <FaIcon
                    icon={icon}
                    style="duotone"
                    size={4}
                    secondaryOpacity={opacity}
                  />
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {icon} ({opacity})
                  </code>
                  <pre className="text-xs bg-background border rounded p-2 w-full overflow-x-auto mt-2">
                    <code>{`<FaIcon icon="${icon}" style="duotone" size={4} secondaryOpacity={${opacity}} />`}</code>
                  </pre>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

