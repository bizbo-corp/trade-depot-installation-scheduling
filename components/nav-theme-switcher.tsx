"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type ThemeOption = {
  value: string;
  label: string;
};

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", label: "Light" },
  { value: "olive-light", label: "Light olive" },
  { value: "olive", label: "Olive" },
  { value: "neutral-olive", label: "Neutral olive" },
  { value: "dark", label: "Dark" },
];

interface NavThemeSwitcherProps {
  className?: string;
}

export function NavThemeSwitcher({ className }: NavThemeSwitcherProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = React.useMemo(() => {
    if (!mounted) {
      return undefined;
    }

    const current = theme === "system" ? resolvedTheme : theme;
    return THEME_OPTIONS.find((option) => option.value === current);
  }, [mounted, resolvedTheme, theme]);

  if (!mounted) {
    return (
      <button
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground",
          className
        )}
        disabled
        type="button"
      >
        Theme
        <ChevronDown className="size-4 opacity-40" />
      </button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className
          )}
        >
          <span>{activeTheme?.label ?? "Theme"}</span>
          <ChevronDown className="size-4 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-48 p-1 rounded-md border border-border bg-popover"
        align="end"
        sideOffset={8}
      >
        <div className="flex flex-col gap-0.5">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setTheme(option.value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-sm px-2 py-2 text-sm transition-colors hover:bg-accent/60 focus-visible:bg-accent/60",
                activeTheme?.value === option.value && "bg-accent/30 text-accent-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}










