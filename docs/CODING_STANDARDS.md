# Coding Standards

## Overview

This document defines coding standards, conventions, and best practices for the Bizbo Brochure project. Adherence to these standards ensures consistency, maintainability, and code quality across the entire codebase.

## Table of Contents

1. [General Principles](#general-principles)
2. [TypeScript Standards](#typescript-standards)
3. [React Conventions](#react-conventions)
4. [Tailwind CSS Guidelines](#tailwind-css-guidelines)
5. [File and Folder Naming](#file-and-folder-naming)
6. [Code Organisation](#code-organisation)
7. [Comments and Documentation](#comments-and-documentation)
8. [Error Handling](#error-handling)
9. [Performance Guidelines](#performance-guidelines)
10. [Accessibility Requirements](#accessibility-requirements)

## General Principles

### Code Style

- **Indentation:** 2 spaces (not tabs)
- **Line length:** Prefer lines under 100 characters for readability
- **Quotes:** Use double quotes (`"`) for strings in TypeScript/TSX
- **Semicolons:** Use semicolons to terminate statements
- **Trailing commas:** Yes, in multi-line arrays, objects, and function parameters
- **Consistency:** Follow existing patterns in the codebase

### ES6+ Features

- Use modern JavaScript features (arrow functions, destructuring, template literals, etc.)
- Prefer `const` over `let`, avoid `var` entirely
- Use optional chaining (`?.`) and nullish coalescing (`??`) when appropriate

## TypeScript Standards

### Type Safety

- **Strict Mode:** Always enabled - never disable TypeScript strict checking
- **Any Types:** Avoid `any` - use `unknown` if type is truly unknown, then narrow it
- **Type Definitions:** Define types and interfaces for all props, functions, and data structures
- **Inference:** Let TypeScript infer types when obvious; explicitly type when adding clarity

### Type Definitions

```typescript
// Good: Explicit types for props
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// Good: Inferred return type
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Bad: Using any
function processData(data: any) {
  return data.map((item: any) => item.name);
}
```

### Type Organisation

- Define types/interfaces near their usage for local use
- Extract shared types to separate files if used across multiple components
- Use `type` for unions and intersections, `interface` for object shapes (be consistent)
- Prefer interfaces for extensible object types

### Imports

```typescript
// Order: External -> Internal -> Relative
import { type NextPage } from 'next';
import Image from 'next/image';

import { Button } from '@/components/Button';
import { formatDate } from '@/utils/date';

import './styles.css';
```

## React Conventions

### Component Structure

- **Default Export:** Use default exports for components
- **Named Exports:** Use for utilities, helpers, and types
- **File per Component:** One component per file (with related hooks/types in same file)
- **Component Names:** PascalCase for component files and function names

### Server vs Client Components

- **Default:** Use Server Components (no 'use client')
- **Client Components:** Only add `"use client"` when needed for:
  - Interactivity (onClick, onChange, etc.)
  - Browser APIs (localStorage, window, etc.)
  - useState, useEffect, and other React hooks
  - Event listeners

```typescript
// Good: Server Component (default)
export default function Page() {
  return <div>Static content</div>;
}

// Good: Client Component when needed
'use client';

import { useState } from 'react';

export default function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Component Props

- Always type props with TypeScript interfaces
- Use destructuring for props
- Order props: required props first, then optional props
- Use descriptive prop names

```typescript
// Good
interface CardProps {
  title: string; // Required props first
  children: React.ReactNode;
  variant?: 'default' | 'outlined'; // Optional props after
  className?: string;
}

export default function Card({ title, children, variant = 'default', className }: CardProps) {
  return (
    <div className={`card card-${variant} ${className}`}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

### Hooks Guidelines

- Only use hooks in Client Components
- Custom hooks should start with `use`
- Follow Rules of Hooks: only call at top level, not in loops/conditions
- Extract complex logic to custom hooks

```typescript
// Good: Custom hook
function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  return { count, increment, decrement };
}
```

### JSX Conventions

- **Self-closing tags:** Use self-closing syntax when possible (`<Image />` not `<Image></Image>`)
- **Conditional rendering:** Use logical AND (`&&`) and ternary operators appropriately
- **Keys:** Always provide unique `key` props in lists
- **Boolean props:** Omit `={true}` (just write `disabled` not `disabled={true}`)

```typescript
// Good
{items.map(item => <Item key={item.id} data={item} />)}

// Good
<Button disabled>Submit</Button>

// Bad
<Button disabled={true}>Submit</Button>
```

### Performance

- **Next/Image:** Always use `next/image` instead of `<img>` tags
- **Dynamic imports:** Use dynamic imports for heavy components
- **Memoisation:** Use `React.memo`, `useMemo`, `useCallback` sparingly and only when needed
- **Avoid premature optimisation:** Profile first

```typescript
// Good: Dynamic import for heavy component
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});
```

## Tailwind CSS Guidelines

### Class Organisation

- Order classes logically: layout -> styling -> interactions
- Group related utilities together
- Use arbitrary values sparingly, prefer theme configuration when repeated
- Be consistent with responsive prefixes

### Class Ordering

```typescript
// Suggested order
className="
  /* Layout */
  flex items-center justify-between
  /* Spacing */
  p-4 mb-6
  /* Sizing */
  w-full h-auto
  /* Typography */
  text-lg font-semibold text-zinc-900
  /* Colours */
  bg-white dark:bg-zinc-900
  /* Borders */
  border border-solid border-zinc-200 rounded-lg
  /* Effects */
  shadow-md hover:shadow-lg
  /* Transitions */
  transition-all duration-200
  /* Responsive */
  sm:flex-col md:flex-row lg:text-xl
"
```

### Using CSS Variables

- Use CSS variables defined in `globals.css` for theming
- Prefer Tailwind's theme config over arbitrary values when repeated

```typescript
// Good: Using theme variable
<div className="bg-background text-foreground">

// Good: Dark mode with Tailwind
<div className="bg-white dark:bg-zinc-900">
```

### Responsive Design

- Mobile-first approach
- Breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Use responsive classes consistently

### Customisation

- Add custom colours/utilities to `tailwind.config.ts` theme.extend if reused
- Don't create one-off arbitrary values for repeated patterns

## File and Folder Naming

### Files

- **Components:** PascalCase - `Button.tsx`, `UserProfile.tsx`
- **Utilities:** camelCase - `formatDate.ts`, `apiClient.ts`
- **Types:** PascalCase - `types.ts`, `User.ts`
- **Config:** camelCase with extension - `next.config.ts`, `tailwind.config.ts`

### Folders

- Use lowercase with hyphens for multi-word folders
- Keep folder names short and descriptive
- Examples: `components/`, `utils/`, `app/`, `components/ui-elements/`

### Path Aliases

- Use `@/` prefix for imports from root directory
- Example: `import { Button } from '@/components/Button';`

## Code Organisation

### Folder Structure

```
app/
  layout.tsx          # Root layout
  page.tsx            # Page components
  [slug]/
    page.tsx          # Dynamic routes
components/
  ui/                 # Reusable UI components
  layout/             # Layout components
  sections/           # Page sections
utils/
  api.ts              # API utilities
  formatters.ts       # Formatting functions
types/
  index.ts            # Type exports
public/
  images/             # Images
  icons/              # Icons
```

### Import Ordering

1. External packages (Next.js, React, etc.)
2. Internal absolute imports (`@/`)
3. Relative imports (same directory)
4. Styles and type-only imports

## Comments and Documentation

### Code Comments

- Write self-documenting code; comments should explain 'why', not 'what'
- Use JSDoc for function documentation
- Remove commented-out code before committing
- Comments should be clear and concise

```typescript
// Good: Explains why
// Debounce to prevent excessive API calls during typing
const debouncedSearch = debounce(handleSearch, 300);

// Bad: States the obvious
// Increment counter
setCount(count + 1);
```

### JSDoc for Functions

```typescript
/**
 * Formats a date string to UK format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "25 December 2024")
 */
function formatDateUK(dateString: string): string {
  // Implementation
}
```

### README Files

- Include README in complex directories
- Document purpose, usage, and examples

## Error Handling

### Error Boundaries

- Use Error Boundaries for unexpected errors in production
- Provide fallback UI for better user experience

### Async Operations

- Always handle errors in async functions
- Use try-catch for async/await
- Provide meaningful error messages

```typescript
// Good
async function fetchUserData(id: string) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}
```

### Form Validation

- Validate on both client and server side
- Provide clear, actionable error messages
- Show validation errors inline

## Performance Guidelines

### Images

- Always use `next/image` with appropriate sizing
- Use `priority` for above-the-fold images
- Provide `alt` text for accessibility
- Use appropriate `width` and `height` or `fill`

```typescript
// Good
<Image
  src="/hero.jpg"
  alt="Product hero image"
  width={1200}
  height={600}
  priority
/>
```

### Fonts

- Use Next.js font optimisation
- Load only necessary font weights
- Configure fonts in `layout.tsx`

### Code Splitting

- Use dynamic imports for heavy components
- Lazy load below-the-fold content
- Split large utility files

### Bundle Size

- Monitor bundle size with `npm run build`
- Remove unused dependencies
- Use tree-shaking friendly imports

## Accessibility Requirements

### Semantic HTML

- Use proper HTML elements (`<nav>`, `<main>`, `<article>`, etc.)
- Use heading hierarchy correctly (h1 → h2 → h3)
- Don't skip heading levels

### ARIA Labels

- Use ARIA attributes when semantic HTML isn't sufficient
- Don't overuse ARIA - prefer semantic HTML
- Ensure all interactive elements are keyboard accessible

### Colour Contrast

- Meet WCAG AA standards (4.5:1 for normal text)
- Don't rely solely on colour to convey information
- Test with colour blindness simulators

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Provide visible focus indicators
- Logical tab order

### Alt Text

- Always provide meaningful `alt` text for images
- Empty `alt=""` for decorative images only
- Be descriptive but concise

## Linting and Formatting

### ESLint

- Run `npm run lint` before committing
- Fix all linting errors
- Don't disable rules without justification

### Pre-commit Checks

- Consider using pre-commit hooks
- Ensure code passes linting
- Run type checking

## Version Control

See [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) for commit message conventions and branching strategy.

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Documentation](https://react.dev)
- [Next.js Style Guide](https://nextjs.org/docs/app/building-your-application/configuring/eslint)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/reusing-styles)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)

## Questions or Concerns

If you encounter situations not covered by these standards, discuss with the team before implementing. Standards should evolve with the project needs.

