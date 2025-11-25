# Architecture

## Overview

This document outlines the architectural decisions, patterns, and structure of the Bizbo Brochure project. It serves as a reference for understanding how the application is organised and how different parts interact.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Next.js App Router](#nextjs-app-router)
3. [Component Architecture](#component-architecture)
4. [Data Flow](#data-flow)
5. [Routing Strategy](#routing-strategy)
6. [State Management](#state-management)
7. [Styling Architecture](#styling-architecture)
8. [Icon Architecture](#icon-architecture)
9. [Performance Optimisations](#performance-optimisations)
10. [Security Considerations](#security-considerations)
11. [Design Patterns](#design-patterns)

## Architecture Overview

### Tech Stack Summary

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript (strict mode)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4
- **Code Quality:** ESLint with Next.js config
- **Development:** Modern tooling with fast refresh

### Core Principles

1. **Server-First Approach:** Maximise use of React Server Components
2. **Performance:** Optimise for Core Web Vitals
3. **Type Safety:** TypeScript strict mode throughout
4. **Accessibility:** WCAG AA compliance
5. **SEO:** Server-side rendering and metadata optimisation
6. **Maintainability:** Clear structure and separation of concerns

## Next.js App Router

### Directory Structure

```
app/
├── layout.tsx           # Root layout (Server Component)
├── page.tsx             # Home page (Server Component)
├── globals.css          # Global styles
├── [slug]/              # Dynamic routes
│   └── page.tsx
└── api/                 # API routes (if needed)
    └── [route]/
        └── route.ts
```

### Server vs Client Components

#### Server Components (Default)

- **Purpose:** Render on the server, send HTML to client
- **Use for:** Static content, data fetching, SEO-critical content
- **Benefits:** Smaller bundle size, faster initial load, better SEO
- **Limitations:** No interactivity, no browser APIs, no hooks

#### Client Components

- **Purpose:** Interactive UI that requires client-side JavaScript
- **Use for:** User interactions, browser APIs, third-party widgets
- **Marking:** Add `"use client"` at top of file
- **Consider:** Keep to minimum for performance

### Layout Hierarchy

```typescript
// app/layout.tsx - Root layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

// Nested layouts possible for sections
// app/docs/layout.tsx
```

### Metadata API

Use the Metadata API for SEO and social sharing:

```typescript
export const metadata = {
  title: 'Page Title',
  description: 'Page description',
  openGraph: {
    title: 'OG Title',
    description: 'OG Description',
    images: ['/og-image.jpg'],
  },
};
```

## Component Architecture

### Component Hierarchy

```
Page Components (app/*)
  └── Section Components (components/sections/)
      └── UI Components (components/ui/)
          └── Base/Utility Components
```

### Component Categories

#### 1. Page Components (`app/*/page.tsx`)

- **Purpose:** Top-level page routes
- **Nature:** Primarily Server Components
- **Responsibilities:**
  - Define page metadata
  - Fetch initial data
  - Compose sections
  - Handle routing logic

```typescript
// app/about/page.tsx
export const metadata = { title: 'About Us' };

export default async function AboutPage() {
  const data = await fetchAboutData();
  
  return (
    <main>
      <HeroSection data={data.hero} />
      <TeamSection data={data.team} />
    </main>
  );
}
```

#### 2. Section Components (`components/sections/`)

- **Purpose:** Major page sections (Hero, Features, CTA, etc.)
- **Nature:** Can be Server or Client Components
- **Responsibilities:**
  - Render large, independent sections
  - Manage section-specific logic
  - Compose UI components

```typescript
// components/sections/HeroSection.tsx
export default function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className="hero">
      <Heading level={1}>{data.title}</Heading>
      <p>{data.description}</p>
      <Button href={data.ctaLink}>{data.ctaText}</Button>
    </section>
  );
}
```

#### 3. UI Components (`components/ui/`)

- **Purpose:** Reusable, generic UI elements
- **Nature:** Often Client Components
- **Responsibilities:**
  - Encapsulate reusable patterns
  - Handle common interactions
  - Provide consistent styling

```typescript
// components/ui/Button.tsx
'use client';

export default function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}
```

### Component Patterns

#### Composition Pattern

Favour composition over props drilling:

```typescript
// Good: Composition
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>

// Instead of many props
<Card header="Title" body="Content" footer="Actions" />
```

#### Container/Presentational Pattern

- **Containers:** Handle data and logic
- **Presentational:** Focus on rendering

```typescript
// Container: handles data
async function BlogListContainer() {
  const posts = await fetchPosts();
  return <BlogList posts={posts} />;
}

// Presentational: renders UI
function BlogList({ posts }: BlogListProps) {
  return (
    <ul>
      {posts.map(post => <BlogPost key={post.id} post={post} />)}
    </ul>
  );
}
```

## Data Flow

### Server-Side Data Fetching

```typescript
// Server Component fetching data
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'force-cache', // or 'no-store'
  });
  
  return <div>{data.content}</div>;
}
```

### Caching Strategy

- **force-cache:** Cache indefinitely (default for fetch)
- **no-store:** No caching
- **revalidate:** ISR with revalidation time
- **tags:** On-demand revalidation

### Data Fetching Best Practices

1. Fetch data as close to where it's needed
2. Use Server Components when possible
3. Implement proper error handling
4. Consider loading states for async operations
5. Cache appropriately for performance

## Routing Strategy

### File-Based Routing

Next.js uses file-based routing in the `app` directory:

```
app/
├── page.tsx              → /
├── about/
│   └── page.tsx          → /about
├── products/
│   ├── page.tsx          → /products
│   └── [slug]/
│       └── page.tsx      → /products/[slug]
└── api/
    └── contact/
        └── route.ts      → /api/contact
```

### Dynamic Routes

Use brackets `[param]` for dynamic segments:

```typescript
// app/products/[slug]/page.tsx
export default function ProductPage({ params }: { params: { slug: string } }) {
  return <div>Product: {params.slug}</div>;
}
```

### Route Groups

Use parentheses for organisation without affecting URL:

```
app/
├── (marketing)/
│   ├── about/page.tsx
│   └── contact/page.tsx
└── (shop)/
    └── products/page.tsx
```

### Navigation

Use Next.js Link component for client-side navigation:

```typescript
import Link from 'next/link';

<Link href="/about">About</Link>
```

## State Management

### Server State

- Handled by Server Components
- Data fetching on server
- No client-side state needed

### Client State

For interactive features:

#### Local State (useState)

```typescript
'use client';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

#### Form State

```typescript
'use client';

function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle submission
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### When to Use External State Management

- Complex state shared across many components
- Consider: React Context, Zustand, or Jotai
- For brochure sites: typically not needed
- Keep it simple with props and local state

## Styling Architecture

### Tailwind CSS Strategy

- **Utility-First:** Use Tailwind classes directly
- **CSS Variables:** For theming and dark mode
- **Component Classes:** Extract repeated patterns to component-level classes

### Theming

Define theme variables in `globals.css`:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

### Responsive Design

Mobile-first approach with Tailwind breakpoints:

```typescript
<div className="
  text-sm p-4          // Mobile
  sm:text-base         // ≥640px
  md:p-6 lg:text-lg    // ≥768px, ≥1024px
">
```

## Icon Architecture

### Overview

This project uses a dual icon system approach, combining two icon libraries to serve different purposes throughout the application. This strategy allows us to leverage the strengths of each system while maintaining visual consistency and appropriate use cases.

### Primary: Lucide Icons

**When to Use:** Use Lucide icons for interactive UI elements and everyday interface components.

**Why Lucide:**
- **Stroke-based design:** Clean, modern stroke-based icons that scale well
- **ShadCN integration:** Already embedded within ShadCN components
- **UI-optimised:** Perfect for buttons, form controls, navigation, and interactive elements
- **Lightweight:** Tree-shakeable, allowing for optimal bundle size
- **Consistent style:** Uniform stroke width and visual weight

**Use Cases:**
- Buttons and action buttons
- Form inputs (checkboxes, radio buttons, input icons)
- Navigation menus and breadcrumbs
- Status indicators and badges
- Inline icons within text content
- Toggle switches and controls
- Small decorative elements in UI components

**Example Usage:**
```typescript
import { Search, Menu, ChevronRight, Check } from 'lucide-react';

<button>
  <Search className="w-4 h-4" />
  Search
</button>
```

### Secondary: Font Awesome Duotone Icons

**When to Use:** Use Font Awesome duotone icons for larger visual elements and prominent design features.

**Why Font Awesome Duotone:**
- **Visual impact:** Duotone style provides more visual weight and depth
- **Design flexibility:** Two-colour system allows for brand colour integration
- **Larger scale:** Best suited for hero sections, feature highlights, and prominent displays
- **Decorative purpose:** Ideal for non-interactive visual elements that enhance the design

**Use Cases:**
- Hero section illustrations
- Large feature icons in section headers
- Decorative elements in page layouts
- Prominent call-to-action visual elements
- Background or accent graphics
- Large informational displays
- Marketing and promotional sections

**Example Usage:**
```typescript
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/pro-duotone-svg-icons';

<FontAwesomeIcon icon={faRocket} className="w-24 h-24" />
```

### Decision Guidelines

Choose the appropriate icon system based on these criteria:

1. **Size and prominence:**
   - Small to medium icons (< 32px) → Lucide
   - Large icons (> 48px) → Font Awesome duotone

2. **Interaction:**
   - Interactive elements (clickable, focusable) → Lucide
   - Decorative/non-interactive → Font Awesome duotone

3. **Context:**
   - Within UI components (buttons, inputs, navigation) → Lucide
   - Standalone visual elements (hero sections, feature highlights) → Font Awesome duotone

4. **Visual style:**
   - Clean, minimal, functional → Lucide
   - Bold, colourful, decorative → Font Awesome duotone

### Implementation Notes

- **Lucide icons:** Import individual icons from `lucide-react` to enable tree-shaking
- **Font Awesome:** Ensure Font Awesome Pro with duotone support is properly configured
- **Consistency:** Maintain consistent sizing within each system; Lucide typically 16-24px for UI, Font Awesome typically 48px+ for visual elements
- **Accessibility:** Both systems support ARIA attributes; ensure proper `aria-label` or `aria-hidden` as appropriate
- **Performance:** Import only needed icons to minimise bundle size

### Best Practices

- Don't mix both systems in the same visual component
- Use Lucide as the default choice for most UI needs
- Reserve Font Awesome duotone for special visual moments
- Maintain consistent sizing within icon families
- Ensure proper accessibility attributes for all icons

## Performance Optimisations

### Image Optimisation

Always use `next/image`:

```typescript
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // For above-fold images
/>
```

### Font Optimisation

Next.js automatic font optimisation:

```typescript
import { Geist } from 'next/font/google';

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
});
```

### Code Splitting

Automatic with Next.js:

- Page-based splitting
- Dynamic imports for heavy components
- Route-based code splitting

### Caching

Implement appropriate caching:

- Static generation for static content
- ISR for semi-static content
- SSR for dynamic content
- Client-side caching for API data

## Security Considerations

### Server Actions (Future Use)

If implementing forms or mutations:

```typescript
// Secure server action
'use server';

export async function submitForm(formData: FormData) {
  // Server-side validation
  // Process data securely
}
```

### Environment Variables

- Store secrets in `.env.local`
- Never commit `.env` files
- Use `process.env` on server only
- Prefix with `NEXT_PUBLIC_` for client access

### Content Security

- Sanitise user input
- Use parameterised queries for databases
- Implement CSRF protection for forms
- Validate data on both client and server

## Design Patterns

### Progressive Enhancement

Start with Server Components, enhance with Client Components only when needed.

### Separation of Concerns

- **Presentation:** UI Components
- **Logic:** Server Components / Hooks
- **Data:** Server-side fetching
- **Styling:** Tailwind utilities

### DRY Principle

- Extract repeated code to utilities
- Create reusable components
- Use configuration over duplication

### Error Handling

- Graceful degradation
- Error boundaries for unexpected errors
- User-friendly error messages
- Proper logging

## File Organisation

### Current Structure

```
trade-depot-installation-scheduling/
├── app/                 # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/          # React Components
│   ├── ui/             # UI components
│   └── sections/       # Page sections
├── public/             # Static assets
├── docs/               # Documentation
└── [config files]      # Configuration files
```

### Recommended Growth

As project expands:

```
├── components/
│   ├── ui/
│   ├── sections/
│   └── layout/
├── lib/                # Utilities and helpers
│   ├── api.ts
│   └── utils.ts
├── types/              # TypeScript types
│   └── index.ts
├── hooks/              # Custom React hooks
├── constants/          # Constants and config
└── styles/             # Additional styles if needed
```

## Future Considerations

### Potential Additions

- CMS integration (Headless CMS)
- E-commerce functionality
- Blog system
- Multi-language support (i18n)
- Authentication (if needed)
- Analytics integration

### Scalability

Architecture supports growth:

- Easy to add new pages/sections
- Component composition allows reuse
- Server Components keep bundle size manageable
- TypeScript ensures maintainability

## References

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [TypeScript Patterns](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

## Questions or Changes

If architectural decisions need to be reconsidered or new patterns emerge, document the reasoning and update this guide.

