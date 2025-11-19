# Image Configuration Quick Reference

## Available Assets

### SVG Icons (`svgIcons`)
Located in `/public/`

| Key | Path | Alt Text |
|-----|------|----------|
| `file` | `/file.svg` | File icon |
| `globe` | `/globe.svg` | Globe icon |
| `next` | `/next.svg` | Next.js logo |
| `vercel` | `/vercel.svg` | Vercel logo |
| `window` | `/window.svg` | Window icon |

### SVG Graphics (`svgGraphics`)
Located in `/public/svg/`

| Key | Path | Description |
|-----|------|-------------|
| `buildStrategyPartner` | `/svg/BuildStrategyPartner.svg` | Strategic partnership illustration |
| `designThinkerWorkshop` | `/svg/DesignThinkerWorkshop.svg` | Design thinking workshop graphic |
| `prototypeActionableRoadmap` | `/svg/PrototypeActionableRoadmap.svg` | Prototyping roadmap graphic |

### Bitmap Images (`bitmapImages`)
Located in `/public/bitmap/`

| Key | Path | Description |
|-----|------|-------------|
| `mobilePrototype` | `/bitmap/mobile-prototype.png` | Mobile prototype demonstration |
| `techStrategy` | `/bitmap/tech-strategy.png` | Technology strategy visual |
| `workshopSession` | `/bitmap/workshop-session.png` | Workshop session photograph |

### Animations (`animations`)
Located in `/public/animations/`

| Key | Path | Description |
|-----|------|-------------|
| `hero` | `/animations/hero-animation.json` | Hero section Lottie animation |

## Import Examples

```typescript
// Import all assets from a category
import { svgGraphics, bitmapImages, animations } from '@/lib/images';

// Import specific helper functions
import { getImage, getAnimation } from '@/lib/images';

// Import everything
import * as images from '@/lib/images';
```

## Common Usage Patterns

### Pattern 1: Direct Access
```typescript
<Image
  src={svgGraphics.buildStrategyPartner.path}
  alt={svgGraphics.buildStrategyPartner.alt}
  width={600}
  height={400}
/>
```

### Pattern 2: Helper Function
```typescript
const image = getImage('svgGraphics', 'designThinkerWorkshop');
<Image src={image.path} alt={image.alt} />
```

### Pattern 3: Lottie Animation
```typescript
<LottieAnimation
  src={animations.hero.path}
  loop={false}
  autoplay={true}
/>
```

## Type Definitions

```typescript
interface ImageAsset {
  path: string;           // Full path from public folder
  alt: string;            // Alternative text for accessibility
  width?: number;         // Optional width hint
  height?: number;        // Optional height hint
  description?: string;   // Optional longer description
}

interface AnimationAsset {
  path: string;           // Full path from public folder
  description?: string;   // Optional description
}
```

## Benefits

✅ **Type Safety**: Autocomplete and compile-time checking  
✅ **Consistency**: Single source of truth for all asset paths  
✅ **Maintainability**: Easy to rename or reorganise assets  
✅ **Documentation**: Clear descriptions of each asset  
✅ **Accessibility**: Pre-configured alt text  
✅ **Refactoring**: Safe to rename with TypeScript support













