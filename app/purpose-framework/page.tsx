"use client";

import { useState } from "react";
import { ThemeSwitcher } from "@/components/purpose-framework/ThemeSwitcher";
import type { ThemeMode } from "@/components/purpose-framework/GlassContainer";
import { PurposeWheel } from "@/components/purpose-framework/PurposeWheel";
import { IconLabel } from "@/components/purpose-framework/IconLabel";
import { FaIcon } from "@/components/ui/fa-icon";
import { cn } from "@/lib/utils";

// Passion Card Component for Tall and Skinny layouts
function PassionCard({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex-1">
      <IconLabel icon={icon} label={label} iconSize="md" labelSize="md" />



    </div>
  );
}

// Purpose Quadrant Component
function PurposeQuadrant({
  position,
}: {
  position: "learn" | "give" | "create" | "nurture";
}) {
  const quadrants = {
    learn: {
      gridArea: "1/1",
      icon: "lightbulb",
      title: "Learn",
      description:
        "Master skills and take control of my own path to achieve independence",
      height: "h-[180px]",
    },
    give: {
      gridArea: "2/1",
      icon: "brain",
      title: "Give",
      description:
        "Share knowledge and opportunities. Use my expertise to empower others to thrive.",
      height: "h-[180px]",
    },
    create: {
      gridArea: "2/2",
      icon: "paintbrush",
      title: "Create",
      description:
        "Be creative, enjoy the process, & build a legacy of passion-driven products to generate wealth.",
      height: "h-[180px]",
    },
    nurture: {
      gridArea: "1/2",
      icon: "seedling",
      title: "Nurture",
      description:
        "Look after myself and others. Prioritise health, relationships, and well-being",
      height: "h-[152px]",
    },
  };

  const quadrant = quadrants[position];

  return (
    <div
      className={`[grid-area:${quadrant.gridArea}] flex flex-col ${
        quadrant.height
      } items-center p-4 ${
        position === "nurture" ? "self-start" : ""
      } w-[228px] `}
    >
      <div className="flex flex-col grow items-start px-0 pt-4 w-full">
        <div className="flex items-start">
          <div className="flex not-italic px-1 relative size-[60px] text-muted-foreground">
            <FaIcon
              icon={quadrant.icon}
              style="duotone"
              duotoneBaseStyle="light"
              size={3}
            />
          </div>
        </div>
        <div className="flex flex-col grow items-start w-full">
          <div className="flex flex-col items-start w-full">
            <div className="flex gap-2 items-center w-[233px]">
              <p className="font-semibold text-[30px] leading-[36px] text-accent-foreground">
                {quadrant.title}
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-start w-full">
            <p className="font-normal text-sm leading-5 text-muted-foreground whitespace-normal">
              {quadrant.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PurposeFrameworkPage() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  const themeClasses = {
    light: "",
    "olive-light": "olive-light",
    olive: "olive",
    "neutral-olive": "neutral-olive",
    dark: "dark",
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Popover positioned absolutely at top left */}
      <div className="absolute top-0 left-0 z-50">
        <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
      </div>

      <div
        className={cn(
          "flex flex-col 2xl:flex-row w-full min-h-screen h-full bg-background-3",
          themeClasses[theme]
        )}
        id="purpose-framework"
      >
        {/* Left Column - A */}
        <div
          className="w-full 2xl:w-auto 2xl:min-w-0 bg-background flex flex-col gap-2 2xl:flex-[618_1_0] h-full"
          id="purpose-framework-main"
          style={{ padding: "clamp(24px, 4vw, 56px)" }}
        >
          <div className="flex flex-col gap-[0px] w-full min-w-0">
            {/* Goals Section */}
            <div className="flex items-center justify-between w-full">
              {/* Professional Goal */}
              <div className="flex flex-col gap-[10px] items-start justify-end flex-1 min-w-0 max-w-[40%]">
                <div className="flex items-start">
                  <div className="flex items-center justify-center size-[40px]">
                    <FaIcon
                      icon="mountain"
                      style="duotone"
                      duotoneBaseStyle="light"
                      size={2}
                      className="text-muted-foreground "
                    />
                  </div>
                </div>
                <div className="flex gap-2 items-center w-full">
                  <p className="font-bold text-sm leading-[20px] text-muted-foreground">
                    Goal
                  </p>
                </div>
                <div className="flex flex-col items-start w-full">
                  <div className="flex gap-2 items-center pb-2 pt-0 px-0 w-full">
                    <p className="font-semibold text-[30px] leading-[36px] text-accent-foreground">
                      Professional
                    </p>
                  </div>
                  <div className="flex gap-2 items-center w-full">
                    <p className="font-light text-lg leading-[28px] text-accent-foreground">
                      Build a digital consultancy business to be the master of
                      my own domain
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Goal */}
              <div className="flex flex-col gap-[10px] items-end justify-end flex-1 min-w-0 max-w-[40%]">
                <div className="flex items-start justify-end">
                  <div className="flex items-center justify-center size-[40px]">
                  <FaIcon
                      icon="mountain"
                      style="duotone"
                      duotoneBaseStyle="light"
                      size={2}
                      className="text-muted-foreground "
                    />
                  </div>
                </div>
                <div className="flex gap-2 items-center justify-end w-full">
                  <p className="font-bold text-sm leading-[20px] text-muted-foreground text-right">
                    Goal
                  </p>
                </div>
                <div className="flex flex-col items-end w-full">
                  <div className="flex gap-2 items-center justify-end pb-2 pt-0 px-0 w-full">
                    <p className="font-semibold text-[30px] leading-[36px] text-accent-foreground text-right">
                      Personal
                    </p>
                  </div>
                  <div className="flex gap-2 items-center justify-end w-full">
                    <p className="font-light text-lg leading-[28px] text-accent-foreground text-right">
                      Be in shape, eat well and move so I can look good, feel
                      good and be active with my family.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Purpose Wheel Section - Responsive Layout */}
            {/* Wide Layout (2xl+) - Horizontal with passions on sides */}
            <div className="hidden 2xl:flex items-center justify-center w-full min-w-0">
              <div
                className="flex items-center justify-center min-w-0"
                style={{
                  gap: "clamp(24px, 5vw, 80px)",
                  padding: "clamp(16px, 2vw, 32px)",
                }}
              >
                {/* Professional Icons - Left Side */}
                <div
                  className="flex flex-col items-center min-w-0"
                  style={{ gap: "clamp(48px, 7vw, 111px)" }}
                >
                  <IconLabel
                    icon="fa-book-sparkles"
                    label="Storytelling"
                    iconSize="lg"
                    labelSize="lg"
                  />
                  <IconLabel
                    icon="fa-project-diagram"
                    label="Connecting systems"
                    iconSize="lg"
                    labelSize="lg"
                  />
                  <IconLabel
                    icon="fa-percent"
                    label="Automations"
                    iconSize="lg"
                    labelSize="lg"
                  />
                </div>

                {/* Purpose Wheel - Center */}
                <div className="relative inline-grid grid-cols-[max-content] grid-rows-[max-content] leading-0 place-items-start">
                  <PurposeWheel className="[grid-area:1/1] ml-0 mt-0 relative size-[768px]" />
                  <div
                    className="[grid-area:1/1] grid grid-cols-2 grid-rows-2 ml-0 mt-0 relative size-[768px]"
                    style={{
                      gap: "clamp(48px, 7vw, 148px)",
                      padding: "clamp(32px, 5vw, 48px) clamp(48px, 9vw, 136px)",
                      minWidth: "clamp(400px, 50vw, 768px)",
                    }}
                  >
                    <PurposeQuadrant position="learn" />
                    <PurposeQuadrant position="nurture" />
                    <PurposeQuadrant position="give" />
                    <PurposeQuadrant position="create" />
                  </div>
                  {/* Purpose text - positioned absolutely in center */}
                  <p className="[grid-area:1/1] font-semibold text-[30px] leading-[36px] text-accent-foreground text-center whitespace-nowrap absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[174px]">
                    Purpose
                  </p>
                </div>

                {/* Personal Icons - Right Side */}
                <div
                  className="flex flex-col items-center min-w-0"
                  style={{ gap: "clamp(60px, 8vw, 123px)" }}
                >
                  <IconLabel
                    icon="fa-microchip"
                    label="Vibe coding"
                    iconSize="lg"
                    labelSize="lg"
                  />
                  <IconLabel
                    icon="fa-users"
                    label="Workshops"
                    iconSize="lg"
                    labelSize="lg"
                  />
                  <IconLabel
                    icon="fa-bezier-curve"
                    label="Animation & Illustration"
                    iconSize="lg"
                    labelSize="lg"
                  />
                </div>
              </div>
            </div>

            {/* Tall Layout (lg-xl) - Grid with passions above and below */}
            <div
              className="hidden lg:grid 2xl:hidden grid-cols-1 grid-rows-[auto_768px_auto] w-full"
              style={{ gap: "clamp(32px, 4vw, 48px)" }}
            >
              {/* Professional Passions - Top Row */}
              <div
                className="flex items-center justify-center w-full"
                style={{
                  gap: "clamp(16px, 2vw, 32px)",
                  padding: "clamp(8px, 1vw, 16px)",
                }}
              >
                <PassionCard icon="fa-book-sparkles" label="Storytelling" />
                <PassionCard
                  icon="fa-project-diagram"
                  label="Connecting systems"
                />
                <PassionCard icon="fa-percent" label="Automations" />
              </div>

              {/* Purpose Wheel - Center Row */}
              <div className="relative inline-grid grid-cols-[max-content] grid-rows-[max-content] leading-0 place-items-center justify-self-center shrink-0">
                <PurposeWheel className="[grid-area:1/1] ml-0 mt-0 relative size-[768px]" />
                <div className="[grid-area:1/1] grid grid-cols-2 grid-rows-2 gap-[148px] ml-0 mt-0 px-[136px] py-[64px] relative size-[768px]">
                  <PurposeQuadrant position="learn" />
                  <PurposeQuadrant position="nurture" />
                  <PurposeQuadrant position="give" />
                  <PurposeQuadrant position="create" />
                </div>
                <p className="[grid-area:1/1] font-semibold text-[30px] leading-[36px] text-accent-foreground text-center whitespace-nowrap absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  Purpose
                </p>
              </div>

              {/* Personal Passions - Bottom Row */}
              <div
                className="flex items-center justify-center w-full"
                style={{
                  gap: "clamp(16px, 2vw, 32px)",
                  padding: "clamp(8px, 1vw, 16px)",
                }}
              >
                <PassionCard icon="fa-microchip" label="Vibe coding" />
                <PassionCard icon="fa-users" label="Workshops" />
                <PassionCard
                  icon="fa-bezier-curve"
                  label="Animation & Illustration"
                />
              </div>
            </div>

            {/* Skinny Layout (md and below) - Single column stack */}
            <div
              className="grid lg:hidden grid-cols-1 grid-rows-[auto_768px_auto] w-full"
              style={{ gap: "clamp(16px, 3vw, 32px)" }}
            >
              {/* Professional Passions - Top Row */}
              <div
                className="flex items-center justify-center w-full"
                style={{
                  gap: "clamp(8px, 1.5vw, 16px)",
                  padding: "clamp(4px, 0.5vw, 8px)",
                }}
              >
                <PassionCard icon="fa-book-sparkles" label="Storytelling" />
                <PassionCard
                  icon="fa-project-diagram"
                  label="Connecting systems"
                />
                <PassionCard icon="fa-percent" label="Automations" />
              </div>

              {/* Purpose Wheel - Center Row */}
              <div className="relative inline-grid grid-cols-[max-content] grid-rows-[max-content] leading-0 place-items-center justify-self-center shrink-0">
                <PurposeWheel className="[grid-area:1/1] ml-0 mt-0 relative size-[768px]" />
                <div className="[grid-area:1/1] grid grid-cols-2 grid-rows-2 gap-[148px] ml-0 mt-0 px-[136px] py-[64px] relative size-[768px]">
                  <PurposeQuadrant position="learn" />
                  <PurposeQuadrant position="nurture" />
                  <PurposeQuadrant position="give" />
                  <PurposeQuadrant position="create" />
                </div>
                <p className="[grid-area:1/1] font-semibold text-[30px] leading-[36px] text-accent-foreground text-center whitespace-nowrap absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  Purpose
                </p>
              </div>

              {/* Personal Passions - Bottom Row */}
              <div
                className="flex items-center justify-center w-full"
                style={{
                  gap: "clamp(8px, 1.5vw, 16px)",
                  padding: "clamp(4px, 0.5vw, 8px)",
                }}
              >
                <PassionCard icon="fa-microchip" label="Vibe coding" />
                <PassionCard icon="fa-users" label="Workshops" />
                <PassionCard
                  icon="fa-bezier-curve"
                  label="Animation & Illustration"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - B */}

        <div
          className="flex flex-col lg:flex-row 2xl:flex-col items-stretch w-full lg:h-full lg:flex-1 2xl:w-auto 2xl:min-w-0 2xl:flex-[382_1_0] h-full min-h-0"
          id="purpose-framework-secondary"
        >



          
          {/* How to get there - C */}
          <div
            className="flex flex-col gap-2 flex-1 flex-grow items-start bg-background-2 overflow-clip w-full 2xl:w-full h-full min-h-0"
            style={{ padding: "clamp(24px, 4vw, 56px)" }}
          >
            <div className="flex flex-col gap-[56px] items-start w-full shrink-0">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-[10px] items-start justify-end w-[256px]">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center size-[40px]">
                      <FaIcon
                        icon="gear"
                        style="duotone"
                        duotoneBaseStyle="light"
                        size={2}
                        className="text-muted-foreground "
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-start w-full">
                    <div className="flex gap-2 items-center pb-2 pt-0 px-0 w-full">
                      <p className="font-semibold text-[30px] leading-[36px] text-accent-foreground">
                        How to get there
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="gap-[10px] grid grid-cols-3 [grid-template-rows:repeat(2,minmax(0,1fr))] content-between flex-1 overflow-clip w-full min-h-0"
              style={{ gap: "clamp(8px, 1.5vw, 10px)" }}
            >
              <div className="[grid-area:1/1] self-start">
                <IconLabel
                  icon="fa-ellipsis"
                  label="Consistency"
                  iconSize="lg"
                  labelSize="lg"
                />
              </div>
              <div className="[grid-area:1/2] self-start">
                <IconLabel
                  icon="fa-chart-line"
                  label="Kaizen (small steps)"
                  iconSize="lg"
                  labelSize="lg"
                />
              </div>
              <div className="[grid-area:1/3] self-start">
                <IconLabel
                  icon="fa-list-check"
                  label="Planning & Task breakdown"
                  iconSize="lg"
                  labelSize="lg"
                />
              </div>
              <div className="[grid-area:2/1] self-start">
                <IconLabel
                  icon="fa-bullseye"
                  label="Habits"
                  iconSize="lg"
                  labelSize="lg"
                />
              </div>
              <div className="[grid-area:2/2] self-start">
                <IconLabel
                  icon="fa-ruler"
                  label="Measure & monitor"
                  iconSize="lg"
                  labelSize="lg"
                />
              </div>
              <div className="[grid-area:2/3] self-start">
                <IconLabel
                  icon="fa-sliders"
                  label="Productivity & Prioritisation"
                  iconSize="lg"
                  labelSize="lg"
                />
              </div>
            </div>
          </div>

          {/* Foundations - D */}
          <div
            className="flex flex-col gap-2 flex-grow items-start bg-background-3 overflow-clip w-full 2xl:w-full h-full min-h-0"
            style={{ padding: "clamp(24px, 4vw, 56px)" }}
          >
            <div className="flex flex-col gap-[56px] items-start w-full shrink-0">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-[10px] items-start justify-end w-[256px]">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center size-[40px]">
                      <FaIcon
                        icon="layer-group"
                        style="duotone"
                        duotoneBaseStyle="light"
                        size={2}
                        className="text-muted-foreground "
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-start w-full">
                    <div className="flex gap-2 items-center pb-2 pt-0 px-0 w-full">
                      <p className="font-semibold text-[30px] leading-[36px] text-accent-foreground">
                        Foundations
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="gap-[10px] grid grid-cols-3 [grid-template-rows:repeat(2,minmax(0,1fr))] content-between flex-1 overflow-clip w-full min-h-0"
              style={{ gap: "clamp(8px, 1.5vw, 10px)" }}
            >
              <div className="[grid-area:1/1] self-start">
                <IconLabel
                  icon="fa-seedling"
                  label="Growth mindset"
                  iconSize="lg"
                  labelSize="lg"
                />
              </div>
              <div className="[grid-area:1/2] self-start">
                <IconLabel
                  icon="fa-hand-holding-heart"
                  label="Cultivate gratitude"
                  iconSize="lg"
                  labelSize="lg"
                />
              </div>
              <div className="[grid-area:1/3] self-start">
                <IconLabel
                  icon="fa-book"
                  label="Learning time"
                  iconSize="lg"
                  labelSize="lg"
                />
              </div>
              <div className="[grid-area:2/1] self-start">
                <IconLabel
                  icon="fa-pencil"
                  label="Keep it simple"
                  iconSize="lg"
                  labelSize="lg"
                />
              </div>
              <div className="[grid-area:2/2] self-start">
                <IconLabel
                  icon="fa-triangle-exclamation"
                  label="Embrace imperfection"
                  iconSize="lg"
                  labelSize="lg"
                />
              </div>
              <div className="[grid-area:2/3] self-start">
                <IconLabel
                  icon="fa-bug"
                  label="Beginners mind"
                  iconSize="lg"
                  labelSize="lg"
                />
              </div>
            </div>
          </div>
        </div>


        
      </div>
    </div>
  );
}
