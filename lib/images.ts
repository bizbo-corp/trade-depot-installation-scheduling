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

export const bizLogos = {
  bizboLogo: {
    path: "/BizboLogo.png",
    alt: "Bizbo Logo",
  },
  nzaa: {
    path: "/svg/biz-logos/NZAA.svg",
    alt: "NZAA logo",
  },
  betterAotearoa: {
    path: "/svg/biz-logos/Better-Aotearoa.svg",
    alt: "Better Aotearoa logo",
  },
  aaInsurance: {
    path: "/svg/biz-logos/aa-insurance.svg",
    alt: "AA Insurance logo",
  },
  iHateIroning: {
    path: "/svg/biz-logos/i-hate-ironing.svg",
    alt: "I Hate Ironing logo",
  },
  tradeDepot: {
    path: "/svg/biz-logos/trade-depot.svg",
    alt: "Trade Depot logo",
  },
  woolworths: {
    path: "/svg/biz-logos/woolworths.svg",
    alt: "Woolworths logo",
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
  techStack: {
    path: "/bitmap/tech-stack.png",
    alt: "Technology stack logos",
    description: "Technology platform and tool logos including Webflow, Google, Apple, HubSpot, and others",
  },
  workshopSession: {
    path: "/bitmap/workshop-session.png",
    alt: "Workshop session photograph",
    description: "Collaborative workshop session in progress",
  },
  desktopApp: {
    path: "/bitmap/desktop-app.png",
    alt: "Desktop application dashboard",
    description: "Desktop application interface showing orders dashboard and analytics",
  },
  mobileApp: {
    path: "/bitmap/mobile-app.png",
    alt: "Mobile application dashboard",
    description: "Mobile application interface showing orders dashboard and analytics",
  },
  dotVoting: {
    path: "/bitmap/dot-voting.png",
    alt: "Dot voting workshop board",
    description: "Facilitators reviewing dot-voted concepts during a workshop session",
  },
  doubleDiamond: {
    path: "/bitmap/double-diamond.png",
    alt: "Double Diamond framework slide",
    description: "Team presenting the Discover, Define, Develop, Deliver double diamond model",
  },
  ideationSession: {
    path: "/bitmap/ideation.jpg",
    alt: "Ideation sketches on table",
    description: "Sketches, notes, and storyboards from an ideation sprint",
  },
  workshopSessionPhoto: {
    path: "/bitmap/workshop-session.jpg",
    alt: "Workshop session photograph",
    description: "Team aligning around storyboards and empathy maps",
  },
  workshopSessionWide: {
    path: "/bitmap/workshop-session.png",
    alt: "Workshop session panorama",
    description: "Wide shot of a design thinking workshop with multiple boards",
  },
  workshopWall: {
    path: "/bitmap/workshop.jpg",
    alt: "Workshop inspiration wall",
    description: "Sticky notes and sketches covering a wall of workshop insights",
  },
  onboardingJourney: {
    path: "/bitmap/Onboarding-Journey.png",
    alt: "Onboarding journey visualisation",
    description: "User onboarding journey and flow diagram",
  },
} as const;

// People Portraits
export const peoplePortraits = {
  michaelChristie: {
    path: "/bitmap/people/michael-christie.jpg",
    alt: "Portrait of Michael Christie",
    description: "Michael Christie, founder of Bizbo",
  },
  ireneChapple: {
    path: "/bitmap/people/irene-chapple.jpg",
    alt: "Portrait of Irene Chapple",
    description: "Irene Chapple, Bizbo collaborator",
  },
  vincentHeeringa: {
    path: "/bitmap/people/vincent-heeringa.jpg",
    alt: "Portrait of Vincent Heeringa",
    description: "Vincent Heeringa, Bizbo collaborator",
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
  bizLogos: typeof bizLogos;
  bitmapImages: typeof bitmapImages;
  peoplePortraits: typeof peoplePortraits;
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
  category: "bizLogos",
  key: keyof typeof bizLogos,
): ImageAsset;
export function getImage(
  category: "bitmapImages",
  key: keyof typeof bitmapImages,
): ImageAsset;
export function getImage(
  category: "peoplePortraits",
  key: keyof typeof peoplePortraits,
): ImageAsset;
export function getImage(category: string, key: string): ImageAsset | null {
  const categories = {
    svgIcons,
    svgGraphics,
    bizLogos,
    bitmapImages,
    peoplePortraits,
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
  ...bizLogos,
  ...bitmapImages,
  ...peoplePortraits,
} as const;
