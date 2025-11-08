"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ThemeMode } from "./GlassContainer";

interface ThemeSwitcherProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  className?: string;
}

const themes: { value: ThemeMode; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "olive-light", label: "Light olive" },
  { value: "olive", label: "Olive" },
  { value: "neutral-olive", label: "Neutral Olve" },
  { value: "dark", label: "Dark" },
];

export function ThemeSwitcher({ currentTheme, onThemeChange, className }: ThemeSwitcherProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        className={className}
      >
        <button
          className={cn(
            "flex items-center gap-2 px-1.5 py-2 rounded-md text-sm font-semibold leading-5 text-sidebar-foreground hover:bg-accent/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <span>Theme</span>
          <ChevronDown className="size-4 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[316px] p-1 rounded-md border border-border bg-popover"
        align="start"
        sideOffset={8}
      >
        <div className="flex flex-col items-start p-1 w-full">
          <div className="flex items-center justify-center px-2 py-1.5 w-full">
            <p className="flex-1 font-medium text-xs leading-4 text-muted-foreground">Theme</p>
          </div>
          {themes.map((theme) => (
            <button
              key={theme.value}
              onClick={() => {
                onThemeChange(theme.value);
                setOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 h-10 px-2 py-2 w-full rounded-[2px] text-sm font-normal leading-5 text-popover-foreground hover:bg-accent/50 transition-colors outline-none focus-visible:bg-accent/50",
                currentTheme === theme.value && "bg-accent/30"
              )}
            >
              <span className="flex-1 text-left">{theme.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}




