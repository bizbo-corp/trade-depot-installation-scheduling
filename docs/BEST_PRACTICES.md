# Best Practices

## Overview

This document outlines best practices for the Bizbo Brochure project across multiple domains: performance, accessibility, security, SEO, and code quality. Following these guidelines ensures a high-quality, maintainable, and user-friendly application.

## Table of Contents

1. [Performance Best Practices](#performance-best-practices)
2. [Accessibility Standards](#accessibility-standards)
3. [Security Guidelines](#security-guidelines)
4. [SEO Best Practices](#seo-best-practices)
5. [Code Quality](#code-quality)
6. [User Experience](#user-experience)
7. [Browser Compatibility](#browser-compatibility)
8. [Error Handling](#error-handling)
9. [Documentation](#documentation)
10. [Continuous Improvement](#continuous-improvement)

## Performance Best Practices

### Core Web Vitals

Aim for excellent scores on:

- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Image Optimisation

Always use `next/image`:

```typescript
// Good
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority  // For above-fold images
/>

// Bad
<img src="/hero.jpg" alt="Hero image" />
```

Image best practices:

- Provide explicit `width` and `height`
- Use `priority` for LCP images
- Use appropriate image formats (WebP, AVIF)
- Optimise image quality/size
- Use `loading="lazy"` for below-fold images
- Provide meaningful `alt` text

### Font Optimisation

Use Next.js font optimisation:

```typescript
import { Geist } from 'next/font/google';

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});
```

Font best practices:

- Load only necessary weights and styles
- Use `display: 'swap'` for performance
- Preload critical fonts
- Limit number of font families

### Code Splitting

Next.js automatically splits code, but optimise:

```typescript
// Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});
```

### Caching Strategy

```typescript
// Cache static data
export async function getStaticProps() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  
  return { props: { data } };
}
```

Caching best practices:

- Use `force-cache` for static content
- Use `revalidate` for ISR
- Cache API responses appropriately
- Set correct cache headers

### Bundle Size Optimisation

```bash
# Analyse bundle size
npm run build

# Review output for large bundles
```

Optimisation techniques:

- Remove unused dependencies
- Use dynamic imports
- Prefer smaller alternatives
- Monitor bundle sizes
- Code split appropriately

### Performance Monitoring

Regularly check:

- Lighthouse scores
- Bundle sizes
- Network requests
- Third-party scripts
- Runtime performance

## Accessibility Standards

### WCAG Compliance

Target WCAG 2.1 Level AA compliance.

### Semantic HTML

Use semantic elements:

```typescript
// Good
<main>
  <article>
    <header>
      <h1>Article Title</h1>
    </header>
    <section>
      <p>Content...</p>
    </section>
  </article>
</main>

// Bad
<div className="main">
  <div className="article">
    <div className="header">
      <div className="h1">Article Title</div>
    </div>
  </div>
</div>
```

### Keyboard Navigation

Ensure all interactive elements are keyboard accessible:

```typescript
// Good: Focusable and has visible focus
<button onClick={handleClick}>Click me</button>

// Bad: Not keyboard accessible
<div onClick={handleClick}>Click me</div>
```

Keyboard best practices:

- Logical tab order
- Visible focus indicators
- Skip navigation links
- Keyboard shortcuts where appropriate
- Focus trap in modals

### ARIA Labels

Use ARIA appropriately:

```typescript
// Good: When semantic HTML isn't enough
<button aria-label="Close modal">
  <span aria-hidden="true">&times;</span>
</button>

// Good: Use semantic HTML instead
<nav aria-label="Main navigation">...</nav>
```

ARIA best practices:

- Prefer semantic HTML over ARIA
- Don't overuse ARIA
- Ensure ARIA labels are descriptive
- Keep ARIA attributes updated
- Test with screen readers

### Colour Contrast

Maintain sufficient contrast:

- **Normal text:** 4.5:1 minimum
- **Large text:** 3:1 minimum
- **UI components:** 3:1 minimum

Test tools:

- Chrome DevTools Accessibility panel
- axe DevTools
- Colour Contrast Analyser

Don't rely solely on colour to convey information:

```typescript
// Bad
<span className="text-red-500">Required field</span>

// Good
<span className="text-red-500" aria-label="Required">
  Required field <span aria-hidden="true">*</span>
</span>
```

### Alt Text

Provide meaningful alt text:

```typescript
// Good: Descriptive
<Image src="/product.jpg" alt="Red bicycle with basket" />

// Good: Decorative
<Image src="/pattern.jpg" alt="" />

// Bad: Generic
<Image src="/product.jpg" alt="image" />
```

### Screen Reader Testing

Test with:

- VoiceOver (macOS/iOS)
- NVDA (Windows)
- JAWS (Windows)
- ChromeVox (Chrome)

## Security Guidelines

### Environment Variables

Never commit secrets:

```bash
# Good: .env.local (not committed)
API_SECRET_KEY=secret-123

# Bad: In code
const apiKey = "secret-123";
```

Security practices:

- Use `.env.local` for development
- Set secrets in deployment platform
- Use different keys for each environment
- Rotate secrets regularly
- Never expose secrets in client code
- Use `NEXT_PUBLIC_` prefix sparingly

### Input Validation

Validate and sanitise all input:

```typescript
// Server-side validation
export async function POST(request: Request) {
  const data = await request.json();
  
  // Validate
  if (!isValidEmail(data.email)) {
    return new Response('Invalid email', { status: 400 });
  }
  
  // Sanitise
  const sanitised = sanitiseInput(data);
  
  // Process...
}
```

### SQL Injection Prevention

If using database:

```typescript
// Good: Parameterised queries
await prisma.user.findUnique({
  where: { email: userEmail }
});

// Bad: String concatenation
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userEmail}`;
```

### XSS Prevention

React automatically escapes, but be careful:

```typescript
// Safe: React escapes automatically
<p>{userInput}</p>

// Dangerous: Use only if trusted
<div dangerouslySetInnerHTML={{ __html: trustedHtml }} />

// Better: Use sanitising library
import sanitizeHtml from 'sanitize-html';

<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userHtml) }} />
```

### CSRF Protection

For forms and mutations:

```typescript
// Use CSRF tokens
const token = await getCSRFToken();

<form method="POST">
  <input type="hidden" name="csrf_token" value={token} />
  {/* form fields */}
</form>
```

### HTTPS

Always use HTTPS in production:

- Configure SSL certificates
- Redirect HTTP to HTTPS
- Use HSTS headers
- Enable secure cookies

### Content Security Policy

Configure CSP headers:

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'",
          },
        ],
      },
    ];
  },
};
```

## SEO Best Practices

### Metadata

Use Next.js Metadata API:

```typescript
export const metadata = {
  title: 'Page Title | Bizbo',
  description: 'Page description up to 160 characters',
  keywords: ['keyword1', 'keyword2'],
  openGraph: {
    title: 'OG Title',
    description: 'OG Description',
    images: ['/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Twitter Title',
    description: 'Twitter Description',
    images: ['/twitter-image.jpg'],
  },
};
```

### Semantic HTML

Use proper heading hierarchy:

```typescript
<main>
  <h1>Main Heading (only one per page)</h1>
  <section>
    <h2>Section Heading</h2>
    <article>
      <h3>Article Heading</h3>
    </article>
  </section>
</main>
```

### URL Structure

Keep URLs clean and descriptive:

```
✅ /about
✅ /products/red-bicycle
✅ /blog/how-to-cycle

❌ /page?id=123
❌ /products?product=red-bicycle
```

### Sitemap

Generate sitemap:

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://bizbo.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://bizbo.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
```

### Robots.txt

Configure robots.txt:

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://bizbo.com/sitemap.xml',
  };
}
```

### Structured Data

Add structured data for rich results:

```typescript
// app/layout.tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Bizbo',
      url: 'https://bizbo.com',
    }),
  }}
/>
```

## Code Quality

### DRY Principle

Don't Repeat Yourself:

```typescript
// Bad
const button1 = <button className="btn btn-primary">Submit</button>;
const button2 = <button className="btn btn-primary">Cancel</button>;

// Good
const Button = ({ children }) => (
  <button className="btn btn-primary">{children}</button>
);
```

### SOLID Principles

Apply SOLID principles:

- **Single Responsibility:** One class, one job
- **Open/Closed:** Open for extension, closed for modification
- **Liskov Substitution:** Subtypes must be substitutable
- **Interface Segregation:** Many specific interfaces
- **Dependency Inversion:** Depend on abstractions

### Clean Code

Write readable code:

```typescript
// Good: Clear and descriptive
function calculateTotalPrice(items: CartItem[]): number {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(items);
  return subtotal + tax + shipping;
}

// Bad: Unclear
function calc(data: any) {
  let x = 0;
  data.forEach(i => x += i.p);
  return x * 1.2 + 5;
}
```

### Comments

Write meaningful comments:

```typescript
// Good: Explains why
// Debounce to prevent excessive API calls during typing
const debouncedSearch = debounce(handleSearch, 300);

// Bad: States the obvious
// Increment counter
count += 1;
```

### Naming Conventions

Use descriptive names:

```typescript
// Good
const userEmailAddress = 'user@example.com';
const isLoggedIn = true;
const handleButtonClick = () => {};

// Bad
const uea = 'user@example.com';
const flag = true;
const hbc = () => {};
```

## User Experience

### Loading States

Show loading indicators:

```typescript
if (isLoading) {
  return <Spinner />;
}
```

### Error States

Handle errors gracefully:

```typescript
if (error) {
  return (
    <ErrorMessage
      message="Something went wrong. Please try again."
      onRetry={handleRetry}
    />
  );
}
```

### Form Validation

Provide clear validation feedback:

```typescript
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-invalid={errors.email ? 'true' : 'false'}
  aria-describedby="email-error"
/>
{errors.email && (
  <span id="email-error" className="error">
    {errors.email.message}
  </span>
)}
```

### Progressive Enhancement

Build for lowest common denominator, enhance for capable devices:

1. Core functionality works everywhere
2. Enhanced experience for modern browsers
3. Graceful degradation for older browsers

### Mobile First

Design for mobile first:

```typescript
// Mobile-first responsive classes
<div className="
  p-4          // Mobile padding
  sm:p-6       // Larger padding on small+ screens
  md:p-8       // Even larger on medium+ screens
">
```

## Browser Compatibility

### Supported Browsers

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Testing

Test regularly in:

- Multiple browsers
- Different screen sizes
- Different devices
- Different OS versions

### Progressive Enhancement

Use feature detection:

```typescript
// Check if feature exists
if ('serviceWorker' in navigator) {
  registerServiceWorker();
}
```

## Error Handling

### Try-Catch Blocks

Always handle errors:

```typescript
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('Failed to complete operation');
}
```

### Error Boundaries

Catch React errors:

```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Logging

Log appropriately:

```typescript
// Development: Detailed logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}

// Production: Error logging only
console.error('Error occurred:', error);

// User actions: Log analytics
analytics.track('Button clicked', { buttonId });
```

## Documentation

### Code Comments

Document complex logic:

```typescript
/**
 * Calculates the total price including tax and shipping
 * @param items - Array of cart items
 * @returns Total price in pence
 */
function calculateTotal(items: CartItem[]): number {
  // Complex calculation...
}
```

### README Files

Keep README files updated:

- Project description
- Setup instructions
- Usage examples
- Contributing guidelines
- License information

### Code Documentation

Use JSDoc for functions:

```typescript
/**
 * Formats a date to UK format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
function formatDateUK(dateString: string): string {
  // Implementation
}
```

## Continuous Improvement

### Regular Reviews

- Code reviews
- Performance audits
- Accessibility audits
- Security audits
- Dependency updates

### Stay Updated

- Follow Next.js releases
- Update dependencies regularly
- Read React documentation
- Attend conferences/talks
- Follow best practices

### Measure and Iterate

- Track metrics
- Gather user feedback
- A/B test improvements
- Iterate based on data

## References

- [Next.js Best Practices](https://nextjs.org/docs/app/building-your-application/optimizing)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web.dev](https://web.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [React Best Practices](https://react.dev/learn)

## Summary

Key takeaways:

1. **Performance:** Optimise images, fonts, bundle size
2. **Accessibility:** WCAG AA compliance, keyboard navigation
3. **Security:** Never commit secrets, validate input
4. **SEO:** Proper metadata, semantic HTML, sitemaps
5. **Code Quality:** DRY, SOLID, clean code
6. **UX:** Loading states, error handling, validation
7. **Testing:** Test in multiple browsers and devices
8. **Documentation:** Keep code and docs up-to-date

Following these practices ensures a high-quality, maintainable, and user-friendly application.

