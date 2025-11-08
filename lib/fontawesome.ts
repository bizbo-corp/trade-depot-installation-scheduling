import { config, findIconDefinition } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { IconDefinition, IconLookup } from '@fortawesome/fontawesome-svg-core';

// Tell Font Awesome to skip adding the CSS automatically since it's already imported above
config.autoAddCss = false;

// Configure to work with kit-loaded icons
// Kits loaded via script register icons globally
config.familyPrefix = 'fa';

// Short prefixes for FontAwesomeIcon component (SVG with JS approach)
export const SHORT_PREFIXES = {
  light: 'fal', // Classic Light
  solid: 'fas', // Classic Solid
  duotone: 'fad', // Duotone
  brand: 'fab', // Brands
} as const;

// Base style prefixes (used for regular icons and as base for duotone - CSS approach)
export const BASE_STYLE_PREFIXES = {
  light: 'fa-light', // Classic Light (default)
  solid: 'fa-solid', // Classic Solid (selected state)
  brand: 'fa-brands', // Brands (special logos)
} as const;

// Icon prefix mapping for different styles (CSS approach)
// Note: Duotone requires BOTH 'fa-duotone' AND a base style (e.g., 'fa-solid')
export const ICON_PREFIXES = {
  light: 'fa-light', // Classic Light (default)
  solid: 'fa-solid', // Classic Solid (selected state)
  duotone: 'fa-duotone', // Duotone modifier (must be combined with base style)
  brand: 'fa-brands', // Brands (special logos)
} as const;

/**
 * Helper function to find an icon definition by name and style
 * Works with Font Awesome Kit that's loaded via script
 */
export function getIconDefinition(
  iconName: string,
  style: keyof typeof ICON_PREFIXES = 'light'
): IconDefinition | null {
  const prefix = ICON_PREFIXES[style];
  return findIconDefinition({
    prefix: prefix.replace('fa-', '') as any, // Convert to short prefix
    iconName: iconName.replace(/^fa-/, ''), // Remove fa- prefix if present
  });
}

/**
 * Get icon definition for React FontAwesomeIcon component
 * Uses short prefixes and works with kit-loaded icons
 */
export function getIconDefinitionForReact(
  iconName: string,
  style: 'light' | 'solid' | 'duotone' | 'brand' = 'light'
): IconDefinition | null {
  const shortPrefix = SHORT_PREFIXES[style];
  const cleanIconName = iconName.replace(/^fa-/, '');
  
  return findIconDefinition({
    prefix: shortPrefix as any,
    iconName: cleanIconName,
  });
}




