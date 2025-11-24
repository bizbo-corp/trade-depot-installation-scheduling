"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getIconDefinitionForReact,
  ICON_PREFIXES,
  BASE_STYLE_PREFIXES,
} from "@/lib/fontawesome";
import { cn } from "@/lib/utils";
import type { IconProp, SizeProp } from "@fortawesome/fontawesome-svg-core";
import type { CSSProperties } from "react";

type DuotoneCSSVariables = CSSProperties & {
  ["--fa-primary-color"]?: string;
  ["--fa-secondary-color"]?: string;
  ["--fa-primary-opacity"]?: number;
  ["--fa-secondary-opacity"]?: number;
};

export type FaIconStyle = keyof typeof ICON_PREFIXES;
export type FaIconSize = 1 | 1.5 | 2 | 3 | 4 | 8;

export interface FaIconProps {
  /**
   * Icon name (e.g., "house", "users", "github")
   * Can include or exclude the "fa-" prefix
   */
  icon: string;

  /**
   * Icon style variant
   * - "light": Classic Light (default)
   * - "solid": Classic Solid (for selected state)
   * - "duotone": Duotone (requires both fa-duotone and base style)
   * - "brand": Brands (for special logos)
   * @default "light"
   */
  style?: FaIconStyle;

  /**
   * Icon size multiplier
   * @default 1
   */
  size?: FaIconSize;

  /**
   * Toggle to solid style when selected (overrides style prop)
   * @default false
   */
  selected?: boolean;

  /**
   * Additional CSS classes applied to the icon wrapper
   * Wrapper defaults to inline-flex with full width/height to reserve layout space
   * Icons inherit colour from parent via currentColor; when you need icon-only
   * utilities, use iconClassName
   */
  className?: string;

  /**
   * Additional CSS classes for the rendered icon element
   * Use when you need icon-specific utilities (e.g. fa-rotate)
   */
  iconClassName?: string;

  /**
   * Duotone-specific: Base style to use with duotone (light or solid)
   * Only applies when style="duotone"
   * @default "solid"
   */
  duotoneBaseStyle?: "light" | "solid" | "thin";

  /**
   * Duotone-specific: Swap the opacity of primary and secondary layers
   * Adds fa-swap-opacity class
   * @default false
   */
  swapOpacity?: boolean;

  /**
   * Duotone-specific: Primary layer color (CSS custom property --fa-primary-color)
   */
  primaryColor?: string;

  /**
   * Duotone-specific: Secondary layer color (CSS custom property --fa-secondary-color)
   */
  secondaryColor?: string;

  /**
   * Duotone-specific: Primary layer opacity (0-1, CSS custom property --fa-primary-opacity)
   */
  primaryOpacity?: number;

  /**
   * Duotone-specific: Secondary layer opacity (0-1, CSS custom property --fa-secondary-opacity)
   * Default is 0.4 if not specified
   */
  secondaryOpacity?: number;

  /**
   * Additional props to pass to the icon element
   */
  [key: string]: unknown;
}

/**
 * Reusable Font Awesome icon component for the design system
 *
 * Supports multiple icon styles (Light, Solid, Duotone, Brands),
 * size variants (1x-8x), color inheritance, and toggle functionality.
 * Icons render inside an inline-flex wrapper that defaults to full width/height
 * so surrounding layouts get the expected vertical and horizontal space.
 *
 * @example
 * // Default (Classic Light, 1x)
 * <FaIcon icon="house" />
 *
 * @example
 * // Solid style, 8x size
 * <FaIcon icon="house" style="solid" size={8} />
 *
 * @example
 * // Duotone, 4x size
 * <FaIcon icon="rocket" style="duotone" size={4} />
 *
 * @example
 * // Brand icon
 * <FaIcon icon="github" style="brand" size={2} />
 *
 * @example
 * // Toggle to solid when selected
 * <FaIcon icon="star" selected={isSelected} />
 *
 * @example
 * // With custom classes for color
 * <FaIcon icon="heart" className="text-red-500" />
 *
 * @example
 * // Icon-specific utility while keeping wrapper styling separate
 * <FaIcon icon="arrows-rotate" className="bg-muted" iconClassName="fa-rotate-90" />
 */
export function FaIcon({
  icon,
  style = "light",
  size = 1,
  selected = false,
  className,
  iconClassName,
  duotoneBaseStyle = "solid",
  swapOpacity = false,
  primaryColor,
  secondaryColor,
  primaryOpacity,
  secondaryOpacity,
  ...props
}: FaIconProps) {
  // Guard against missing icon prop
  if (!icon) {
    console.warn("FaIcon: icon prop is required but was not provided");
    return null;
  }

  // Determine the actual style to use
  // If selected is true, override to solid regardless of style prop
  const actualStyle: FaIconStyle = selected ? "solid" : style;

  // Clean icon name (remove fa- prefix if present)
  const cleanIconName = icon.replace(/^fa-/, "");

  // Map size to Font Awesome SizeProp for FontAwesomeIcon
  const sizeMap: Record<FaIconSize, SizeProp> = {
    1: "1x",
    1.5: "lg", // Font Awesome uses "lg" for 1.5x
    2: "2x",
    3: "3x",
    4: "4x",
    8: "8x",
  };

  const faSize = sizeMap[size];

  // Map size to Font Awesome size classes for <i> tag approach
  const sizeClassMap: Record<FaIconSize, string> = {
    1: "",
    1.5: "fa-lg",
    2: "fa-2x",
    3: "fa-3x",
    4: "fa-4x",
    8: "fa-8x",
  };

  const sizeClass = sizeClassMap[size];

  const wrapperClassName = cn(
    "inline-flex items-center justify-center align-middle leading-none shrink-0",
    className
  );

  const iconUtilityClassName = iconClassName;

  // Handle duotone icons with SVG/JS approach (FontAwesomeIcon)
  if (actualStyle === "duotone") {
    // Try to get icon definition from kit
    const iconDef = getIconDefinitionForReact(cleanIconName, "duotone");

    // If icon definition is found AND we are using the default solid base style, use FontAwesomeIcon (SVG approach)
    // For other base styles (thin, light), we fall back to CSS/Kit approach as standard 'fad' prefix is solid
    // If icon definition is found AND we are using the default solid base style, use FontAwesomeIcon (SVG approach)
    // For other base styles (thin, light), we fall back to CSS/Kit approach as standard 'fad' prefix is solid
    /* 
    // DISABLED TO PREVENT HYDRATION ERRORS:
    // The server doesn't have icon definitions (loaded via Kit script), so it renders the fallback <i> tag.
    // The client has definitions, so it renders <FontAwesomeIcon> (SVG).
    // This causes a hydration mismatch. We force the CSS approach everywhere for consistency.
    
    if (iconDef && duotoneBaseStyle === "solid") {
      // Build style object for CSS custom properties
      // Always set opacities: primary to 1.0, secondary to 0.4 by default
      const duotoneStyle: DuotoneCSSVariables = {
        ...(primaryColor && { "--fa-primary-color": primaryColor }),
        ...(secondaryColor && { "--fa-secondary-color": secondaryColor }),
        "--fa-primary-opacity":
          primaryOpacity !== undefined ? primaryOpacity : 1.0,
        "--fa-secondary-opacity":
          secondaryOpacity !== undefined ? secondaryOpacity : 0.4,
      };

      // Build className for swap-opacity and custom classes
      const duotoneClassName = cn(
        swapOpacity && "fa-swap-opacity",
        iconUtilityClassName
      );

      return (
        <span className={wrapperClassName}>
          <FontAwesomeIcon
            icon={iconDef}
            size={faSize}
            className={duotoneClassName}
            style={
              Object.keys(duotoneStyle).length > 0 ? duotoneStyle : undefined
            }
            {...(props as any)}
          />
        </span>
      );
    }
    */

    // Fallback: Use CSS approach with proper stacking CSS for duotone
    // This ensures icons work even if FontAwesomeIcon can't find them
    const classes: string[] = [];
    classes.push("fa-duotone");
    classes.push(BASE_STYLE_PREFIXES[duotoneBaseStyle]);

    // Add specific class for Duotone Thin to help Kit resolution
    if (duotoneBaseStyle === "thin") {
      classes.push("fa-duotone-thin");
    }

    classes.push(`fa-${cleanIconName}`);

    if (sizeClass) {
      classes.push(sizeClass);
    }

    if (swapOpacity) {
      classes.push("fa-swap-opacity");
    }

    classes.push("text-current");
    classes.push("fa-duotone-stacked"); // Custom class for stacking CSS

    // Add class when custom colors are provided to allow CSS override
    if (primaryColor || secondaryColor) {
      classes.push("fa-duotone-custom-colors");
    }

    if (iconUtilityClassName) {
      classes.push(iconUtilityClassName);
    }

    // Build inline styles for duotone custom properties
    // Always set opacities: primary to 1.0, secondary to 0.4 by default
    const duotoneStyle: DuotoneCSSVariables = {
      position: "relative", // Required for pseudo-element stacking
      ...(primaryColor && { "--fa-primary-color": primaryColor }),
      ...(secondaryColor && { "--fa-secondary-color": secondaryColor }),
      "--fa-primary-opacity":
        primaryOpacity !== undefined ? primaryOpacity : 1.0,
      "--fa-secondary-opacity":
        secondaryOpacity !== undefined ? secondaryOpacity : 0.4,
    };

    return (
      <span className={wrapperClassName}>
        <i className={cn(classes)} style={duotoneStyle} {...(props as any)} />
      </span>
    );
  }

  // For non-duotone icons, use <i> tag approach (works fine for light, solid, brands)
  const classes: string[] = [];
  classes.push(ICON_PREFIXES[actualStyle]);
  classes.push(`fa-${cleanIconName}`);

  if (sizeClass) {
    classes.push(sizeClass);
  }

  classes.push("text-current");

  if (iconUtilityClassName) {
    classes.push(iconUtilityClassName);
  }

  return (
    <span className={wrapperClassName}>
      <i className={cn(classes)} {...(props as any)} />
    </span>
  );
}
