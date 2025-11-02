<!-- bcbc6b15-cc6c-40fc-989c-9fdaca7e09a7 faddd08d-d220-4bad-ace1-cd20ff911006 -->
# Add Olive Mode Support to ValuePropositionSection

## Overview

Enable the `ValuePropositionSection` component to support an "Olive" mode that applies a dark olive-green colour palette. The Olive mode works independently and can be applied alongside light and dark themes.

## Implementation Plan

### 1. Add Olive Mode CSS Variables ✅

- Added `.olive` class in `app/globals.css` that defines Olive-specific CSS variables
- Values sourced from Figma design tokens:
  - `--background: #797e73` (tailwind neutral-olive/600)
  - `--muted: #62675c` (tailwind neutral-olive/700)
  - `--foreground: #f9f9f8` (light off-white)
  - `--muted-foreground: #ededea` (muted light)
  - `--accent: #ededea` (accent)
  - `--accent-foreground: #62675c` (accent text)
  - `--card-foreground: #f9f9f8` (card text)
  - All other design tokens mapped accordingly
- `.olive` works independently and can be combined with `.dark`
- Scoped to apply only within elements with the `.olive` class

### 2. Update ValuePropositionSection Component ✅

- Added optional `mode?: "default" | "olive"` prop to `ValuePropositionSectionProps` interface
- Applied `olive` class conditionally to the section element when `mode="olive"`
- Default to `mode="default"` if not specified to maintain backward compatibility

### 3. Update Usage in app/page.tsx ✅

- Added `mode="olive"` prop to `<ValuePropositionSection />` to demonstrate the mode
- Existing props remain unchanged

## Files Modified

1. ✅ `app/globals.css` - Added `.olive` CSS class with colour variables
2. ✅ `components/sections/ValuePropositionSection.tsx` - Added mode prop and conditional class
3. ✅ `app/page.tsx` - Added mode prop to demonstrate usage

## Colour Mapping from Figma Variables

- `tailwind colors/neutral-olive/600` (#797e73) → `--background`
- `tailwind colors/neutral-olive/700` (#62675c) → `--muted`, `--card`, `--secondary`
- `colors/foreground-dark` (#f9f9f8) → `--foreground`
- `colors/muted-light` (#ededea) → `--muted-foreground`
- `colors/accent-dark` (#ededea) → `--accent`
- `colors/accent-foreground-dark` (#62675c) → `--accent-foreground`
- `colors/card-foreground-dark` (#f9f9f8) → `--card-foreground`
- All other design tokens mapped from Figma Olive mode variables

## Implementation Summary

### Key Differences from Original Plan

- **Concept**: Changed from "theme" to "mode"
- **Class name**: Changed from `.olive-theme` to `.olive`
- **Prop name**: Changed from `theme` to `mode`
- **Independence**: `.olive` works independently and can be combined with `.dark`

### Design Token Integration

- Used ShadCN CLI to import Figma design tokens
- Extended the imported tokens with Olive mode specific values
- Maintained consistency with existing OKLCH colour space where applicable
- Used hex values for Olive mode to match Figma design tokens exactly

## Usage

```tsx
// Default mode (unchanged behaviour)
<ValuePropositionSection {...data} />

// Olive mode
<ValuePropositionSection {...data} mode="olive" />
```

