/**
 * Centralised image and asset configuration
 * Provides type-safe paths and metadata for all public assets
 */

export interface ImageAsset {
  path: string;
  alt: string;
  width?: number;
  height?: number;
  description?: string;
}

export interface AnimationAsset {
  path: string;
  description?: string;
}

// SVG Icons
export const svgIcons = {
  file: {
    path: "/file.svg",
    alt: "File icon",
  },
  globe: {
    path: "/globe.svg",
    alt: "Globe icon",
  },
  next: {
    path: "/next.svg",
    alt: "Next.js logo",
  },
  vercel: {
    path: "/vercel.svg",
    alt: "Vercel logo",
  },
  window: {
    path: "/window.svg",
    alt: "Window icon",
  },
} as const;

// Custom SVG Graphics
export const svgGraphics = {
  buildStrategyPartner: {
    path: "/svg/BuildStrategyPartner.svg",
    alt: "Build Strategy Partner illustration",
    description: "Strategic partnership and collaboration graphic",
  },
  designThinkerWorkshop: {
    path: "/svg/DesignThinkerWorkshop.svg",
    alt: "Design Thinker Workshop illustration",
    description: "Workshop and design thinking process graphic",
  },
  prototypeActionableRoadmap: {
    path: "/svg/PrototypeActionableRoadmap.svg",
    alt: "Prototype Actionable Roadmap illustration",
    description: "Prototyping and roadmap planning graphic",
  },
} as const;

// Bitmap Images
export const bitmapImages = {
  mobilePrototype: {
    path: "/bitmap/mobile-prototype.png",
    alt: "Mobile prototype example",
    description: "Mobile application prototype demonstration",
  },
  techStrategy: {
    path: "/bitmap/tech-strategy.png",
    alt: "Technology strategy visual",
    description: "Strategic technology planning and roadmapping",
  },
  workshopSession: {
    path: "/bitmap/workshop-session.png",
    alt: "Workshop session photograph",
    description: "Collaborative workshop session in progress",
  },
} as const;

// Lottie Animations
export const animations = {
  hero: {
    path: "/animations/hero-animation.json",
    description: "Hero section animation",
  },
  ctaGlobe: {
    path: "/animations/globe-animation.lottie",
    description: "CTA globe animation",
  },
} as const;

/**
 * Type helper for all image categories
 */
export type ImageCategory = {
  svgIcons: typeof svgIcons;
  svgGraphics: typeof svgGraphics;
  bitmapImages: typeof bitmapImages;
  animations: typeof animations;
};

/**
 * Get image by category and key
 */
export function getImage(
  category: "svgIcons",
  key: keyof typeof svgIcons,
): ImageAsset;
export function getImage(
  category: "svgGraphics",
  key: keyof typeof svgGraphics,
): ImageAsset;
export function getImage(
  category: "bitmapImages",
  key: keyof typeof bitmapImages,
): ImageAsset;
export function getImage(category: string, key: string): ImageAsset | null {
  const categories = {
    svgIcons,
    svgGraphics,
    bitmapImages,
  } as const;

  const categoryData = categories[category as keyof typeof categories];
  if (!categoryData) return null;

  return categoryData[key as keyof typeof categoryData] || null;
}

/**
 * Get animation path by key
 */
export function getAnimation(
  key: keyof typeof animations,
): AnimationAsset | null {
  return animations[key] || null;
}

/**
 * Helper to combine all image paths for Next.js Image component
 */
export const imagePaths = {
  ...svgIcons,
  ...svgGraphics,
  ...bitmapImages,
} as const;
