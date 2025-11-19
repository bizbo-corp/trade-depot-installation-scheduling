"use client";

import { useEffect, useState } from "react";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export function BreakpointDebug() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>("");
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    // Only show in development or when explicitly enabled
    const isEnabled = process.env.NEXT_PUBLIC_DEBUG_BREAKPOINT === "true";
    if (!isEnabled) return;

    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      let breakpoint = "xs";
      if (width >= BREAKPOINTS["2xl"]) {
        breakpoint = "2xl";
      } else if (width >= BREAKPOINTS.xl) {
        breakpoint = "xl";
      } else if (width >= BREAKPOINTS.lg) {
        breakpoint = "lg";
      } else if (width >= BREAKPOINTS.md) {
        breakpoint = "md";
      } else if (width >= BREAKPOINTS.sm) {
        breakpoint = "sm";
      }

      setCurrentBreakpoint(breakpoint);
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);

    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  // Only render if enabled
  const isEnabled = process.env.NEXT_PUBLIC_DEBUG_BREAKPOINT === "true";
  if (!isEnabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-black/90 text-white px-4 py-2 rounded-lg shadow-lg font-mono text-sm pointer-events-none">
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">Breakpoint:</span>
        <span className="font-bold text-green-400">{currentBreakpoint}</span>
        <span className="text-xs text-gray-500">({windowWidth}px)</span>
      </div>
    </div>
  );
}














