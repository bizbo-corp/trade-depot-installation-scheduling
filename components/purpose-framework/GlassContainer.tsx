"use client";

import { cn } from "@/lib/utils";

export type ThemeMode = "light" | "olive-light" | "olive" | "neutral-olive" | "dark";

interface GlassContainerProps {
  children: React.ReactNode;
  theme: ThemeMode;
  className?: string;
}

export function GlassContainer({ children, theme, className }: GlassContainerProps) {
  const themeClasses = {
    light: "",
    "olive-light": "olive-light",
    olive: "olive",
    "neutral-olive": "neutral-olive",
    dark: "dark",
  };

  return (
    <div
      className={cn(
        "glass-container rounded-lg p-8 transition-colors duration-300",
        themeClasses[theme],
        className
      )}
    >
      <div className={cn("transition-colors duration-300", themeClasses[theme])}>
        {children}
      </div>
    </div>
  );
}

