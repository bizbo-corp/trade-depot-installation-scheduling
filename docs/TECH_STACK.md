# Technology Stack

## Overview

This document outlines all technologies, frameworks, and tools used in the Bizbo Brochure project, including versions and key configurations.

## Core Framework

### Next.js

- **Version:** 16.0.1
- **Documentation:** [Next.js Documentation](https://nextjs.org/docs)
- **Features in use:**
  - App Router (app directory)
  - Server Components by default
  - Image optimisation with `next/image`
  - Font optimisation with `next/font/google`
  - Metadata API for SEO
- **Configuration:** See `next.config.ts`
  - No custom configurations currently applied

## React

- **Version:** 19.2.0
- **Documentation:** [React Documentation](https://react.dev)
- **Features:**
  - React Server Components
  - Client Components with `"use client"` directive
  - Modern React features (hooks, concurrent rendering)

### React DOM

- **Version:** 19.2.0
- **Usage:** Client-side rendering and hydration

## TypeScript

- **Version:** ^5 (minimum 5.0.0)
- **Documentation:** [TypeScript Documentation](https://www.typescriptlang.org/docs)
- **Configuration:** See `tsconfig.json`
  - **Target:** ES2017
  - **Mode:** Strict mode enabled
  - **Module resolution:** Bundler
  - **JSX:** React JSX
  - **Path aliases:** `@/*` maps to root directory
  - **Type checking plugins:** Next.js plugin

### Type Definitions

- **@types/node:** ^20 (Node.js type definitions)
- **@types/react:** ^19 (React type definitions)
- **@types/react-dom:** ^19 (React DOM type definitions)

## Styling

### Tailwind CSS

- **Version:** ^4 (minimum 4.0.0)
- **Documentation:** [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- **Configuration:** See `tailwind.config.ts`
  - Content paths configured for `app/`, `components/`, and `pages/` directories
  - Theme customisation available via `extend`
- **PostCSS Integration:** See `postcss.config.mjs`
  - Uses `@tailwindcss/postcss` plugin

### Fonts

- **Google Fonts:** Geist (Sans) and Geist Mono
- **Optimisation:** Next.js font optimisation
- **Implementation:** Configured in `app/layout.tsx`
  - CSS variables: `--font-geist-sans` and `--font-geist-mono`
  - Applied via Tailwind theme configuration

## Code Quality

### ESLint

- **Version:** ^9
- **Documentation:** [ESLint Documentation](https://eslint.org/docs/latest)
- **Configuration:** See `eslint.config.mjs`
- **Presets:**
  - `eslint-config-next/core-web-vitals`
  - `eslint-config-next/typescript`
- **Global ignores:**
  - `.next/**`
  - `out/**`
  - `build/**`
  - `next-env.d.ts`

## Runtime & Build Tools

### Node.js

- **Recommended Version:** 20.x
- **Documentation:** [Node.js Documentation](https://nodejs.org/docs)
- **Type definitions:** @types/node ^20

### Package Management

- **Manager:** npm (via package-lock.json)
- **Registry:** Default npm registry

## Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| TypeScript | ^5 | Type checking and compilation |
| @types/node | ^20 | Node.js type definitions |
| @types/react | ^19 | React type definitions |
| @types/react-dom | ^19 | React DOM type definitions |
| @tailwindcss/postcss | ^4 | Tailwind PostCSS plugin |
| tailwindcss | ^4 | Utility-first CSS framework |
| eslint | ^9 | Code linting |
| eslint-config-next | 16.0.1 | Next.js ESLint configuration |

## Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.2.0 | UI library |
| react-dom | 19.2.0 | React DOM renderer |
| next | 16.0.1 | React framework |

## File Structure

```
trade-depot-installation-scheduling/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout with fonts
│   └── page.tsx           # Home page
├── components/            # React components
├── public/                # Static assets
├── docs/                  # Project documentation
├── eslint.config.mjs      # ESLint configuration
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies
├── postcss.config.mjs     # PostCSS configuration
├── tailwind.config.ts     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## Browser Support

- Modern browsers with ES2017 support
- JavaScript enabled
- CSS Grid and Flexbox support (for Tailwind)
- Next.js optimises for all modern browsers automatically

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ESLint Documentation](https://eslint.org/docs/latest)

## Version Update Policy

When updating dependencies:

1. Check for breaking changes in official changelogs
2. Test thoroughly in development environment
3. Update this document with new versions
4. Consider security implications (run `npm audit`)

## Notes

- This is a brochure/marketing site, optimised for performance and SEO
- All styling handled through Tailwind CSS utility classes
- TypeScript strict mode ensures type safety across the project
- Next.js App Router provides modern React Server Components architecture

