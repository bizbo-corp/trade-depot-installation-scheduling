# Image Configuration Usage Examples

This document demonstrates how to use the centralised image configuration in `lib/images.ts`.

## Overview

The image configuration provides type-safe access to all assets in your `public` folder, organised by category:
- **SVG Icons**: Simple icons like file, globe, next, etc.
- **SVG Graphics**: Custom illustrations with business context
- **Bitmap Images**: PNG/JPG images for photos and complex graphics
- **Animations**: Lottie animation files

## Basic Usage

### 1. Using SVG Icons

For simple icons that should be rendered as `<img>` tags or inline SVG:

```typescript
import { svgIcons } from '@/lib/images';
import Image from 'next/image';

// In your component
<Image
  src={svgIcons.globe.path}
  alt={svgIcons.globe.alt}
  width={24}
  height={24}
/>
```

### 2. Using SVG Graphics

For custom SVG illustrations:

```typescript
import { svgGraphics } from '@/lib/images';
import Image from 'next/image';

// Example: Design Thinker Workshop graphic
<Image
  src={svgGraphics.designThinkerWorkshop.path}
  alt={svgGraphics.designThinkerWorkshop.alt}
  width={600}
  height={400}
  className="rounded-lg"
/>
```

### 3. Using Bitmap Images

For PNG/JPG images, especially for the Value Proposition section:

```typescript
import { bitmapImages } from '@/lib/images';
import Image from 'next/image';

// Example: Mobile Prototype image
<Image
  src={bitmapImages.mobilePrototype.path}
  alt={bitmapImages.mobilePrototype.alt}
  width={800}
  height={600}
  className="object-cover rounded-xl"
/>

// Fill container approach
<div className="relative w-full h-96">
  <Image
    src={bitmapImages.techStrategy.path}
    alt={bitmapImages.techStrategy.alt}
    fill
    className="object-cover rounded-lg"
  />
</div>
```

### 4. Using Lottie Animations

For animations (already in use in HeroSection):

```typescript
import { animations } from '@/lib/images';
import { LottieAnimation } from '@/components/LottieAnimation';

<LottieAnimation
  src={animations.hero.path}
  className="w-full h-full"
  loop={false}
  autoplay={true}
/>
```

## Real-World Examples

### Example 1: Update Value Proposition Section

Replace the placeholder images in `app/page.tsx`:

```typescript
import { svgGraphics, bitmapImages } from '@/lib/images';

const valuePropositionData = {
  steps: [
    {
      // ... other properties
      imageUrl: svgGraphics.designThinkerWorkshop.path,
    },
    {
      // ... other properties
      imageUrl: bitmapImages.mobilePrototype.path,
    },
    {
      // ... other properties
      imageUrl: svgGraphics.prototypeActionableRoadmap.path,
    }
  ],
  imageCards: [
    {
      imageUrl: bitmapImages.techStrategy.path,
      alt: bitmapImages.techStrategy.alt
    },
    {
      imageUrl: bitmapImages.workshopSession.path,
      alt: bitmapImages.workshopSession.alt
    },
    {
      imageUrl: svgGraphics.buildStrategyPartner.path,
      alt: svgGraphics.buildStrategyPartner.alt
    }
  ]
};
```

### Example 2: Update About Section

```typescript
import { bitmapImages } from '@/lib/images';

const aboutData = {
  // ... other properties
  image: {
    src: bitmapImages.workshopSession.path, // or your actual portrait photo
    alt: "Michael Christie - Founder of Bizbo"
  }
};
```

### Example 3: Update CTA Section

```typescript
import { svgGraphics } from '@/lib/images';

const ctaData = {
  // ... other properties
  image: {
    src: svgGraphics.buildStrategyPartner.path,
    alt: svgGraphics.buildStrategyPartner.alt
  }
};
```

### Example 4: Direct Import in Component

```typescript
import Image from 'next/image';
import { bitmapImages } from '@/lib/images';

export const WorkshopImage = () => {
  return (
    <div className="relative w-full h-[400px]">
      <Image
        src={bitmapImages.workshopSession.path}
        alt={bitmapImages.workshopSession.alt}
        fill
        className="object-cover rounded-2xl"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};
```

## Helper Functions

### Using `getImage()` Helper

For dynamic access:

```typescript
import { getImage } from '@/lib/images';

const icon = getImage('svgIcons', 'globe');
if (icon) {
  return <Image src={icon.path} alt={icon.alt} />;
}
```

### Using `getAnimation()` Helper

For dynamic animation access:

```typescript
import { getAnimation } from '@/lib/images';

const animation = getAnimation('hero');
if (animation) {
  return <LottieAnimation src={animation.path} />;
}
```

## TypeScript Benefits

The configuration is fully typed, providing:
- **Autocomplete**: TypeScript will suggest available image keys
- **Type Safety**: Catch typos at compile time
- **Documentation**: Hover over properties to see descriptions
- **Refactoring Safety**: Renaming images is easier with TypeScript

## Best Practices

1. **Always use the centralised config**: Don't hardcode paths
2. **Provide meaningful alt text**: Already included in config
3. **Use Next.js Image component**: Better performance and optimisation
4. **Add sizes prop**: For responsive images
5. **Use fill carefully**: Only when you have a positioned parent container

## Adding New Images

When you add new images, update `lib/images.ts`:

```typescript
// In lib/images.ts
export const bitmapImages = {
  mobilePrototype: {
    path: '/bitmap/mobile-prototype.png',
    alt: 'Mobile prototype example',
    description: 'Mobile application prototype demonstration',
  },
  // Add your new image here
  newImage: {
    path: '/bitmap/new-image.png',
    alt: 'Description of new image',
    description: 'Optional longer description',
  },
} as const;
```

## Migration Checklist

- [ ] Review all `imageUrl` in `app/page.tsx`
- [ ] Replace placeholder URLs with actual asset paths
- [ ] Update HeroSection to use `animations.hero.path` (already done)
- [ ] Update ValuePropositionSection images
- [ ] Update AboutSection image
- [ ] Update CtaSection image
- [ ] Update TestimonialsSection avatars (requires new images)
- [ ] Update LogoSection logos (requires new images)
