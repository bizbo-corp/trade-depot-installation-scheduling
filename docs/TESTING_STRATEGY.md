# Testing Strategy

## Overview

This document outlines the testing strategy, tools, and best practices for the Bizbo Brochure project. A comprehensive testing approach ensures reliability, maintainability, and confidence in deployments.

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Testing Pyramid](#testing-pyramid)
3. [Recommended Tools](#recommended-tools)
4. [Unit Testing](#unit-testing)
5. [Component Testing](#component-testing)
6. [Integration Testing](#integration-testing)
7. [End-to-End Testing](#end-to-end-testing)
8. [Testing Best Practices](#testing-best-practices)
9. [Running Tests](#running-tests)
10. [Test Coverage](#test-coverage)

## Testing Philosophy

### Core Principles

1. **Test User Behaviour:** Focus on what users see and do
2. **Test Confidence:** Tests should catch real bugs
3. **Maintainability:** Tests should be easy to update when code changes
4. **Fast Feedback:** Quick tests enable rapid development
5. **Comprehensive Coverage:** Balance between coverage and time investment

### Testing Priorities

For a brochure website:

1. **Critical User Flows:** Contact forms, navigation, key interactions
2. **Cross-Browser Compatibility:** Ensure works in all supported browsers
3. **Responsive Design:** Verify mobile and desktop layouts
4. **Accessibility:** Ensure WCAG compliance
5. **Performance:** Verify core web vitals

## Testing Pyramid

```
      /\
     /  \    E2E Tests (Few, Slow, Expensive)
    /----\
   /      \   Integration Tests (Moderate, Medium Speed)
  /--------\
 /          \ Unit/Component Tests (Many, Fast, Cheap)
/------------\
```

### Distribution

- **70%** Unit and Component Tests (fast, isolated)
- **20%** Integration Tests (moderate, focused)
- **10%** E2E Tests (slow, comprehensive)

## Recommended Tools

### Vitest (Unit & Component Testing)

**Why Vitest?**

- Faster than Jest (uses Vite)
- Better ESM support
- Native TypeScript support
- Compatible with Jest API
- Excellent DX with watch mode

**Installation:**

```bash
npm install -D vitest @vitest/ui
```

### React Testing Library (Component Testing)

**Why React Testing Library?**

- Encourages testing user behaviour
- Accessible queries by default
- Minimal implementation details
- Excellent documentation
- Industry standard for React testing

**Installation:**

```bash
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Playwright (E2E Testing)

**Why Playwright?**

- Recommended by Next.js team
- Multi-browser support (Chromium, Firefox, WebKit)
- Great debugging tools
- Reliable auto-waiting
- Network interception
- Mobile device emulation

**Installation:**

```bash
npm install -D @playwright/test
```

### Additional Tools

- **TypeScript:** First line of defence via type checking
- **ESLint:** Code quality checks
- **Lighthouse CI:** Automated performance audits
- **axe-core:** Automated accessibility testing

## Unit Testing

### Purpose

Test individual functions, utilities, and pure logic in isolation.

### Example: Testing Utilities

```typescript
// utils/formatDate.ts
export function formatDateUK(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

// __tests__/utils/formatDate.test.ts
import { describe, it, expect } from 'vitest';
import { formatDateUK } from '../formatDate';

describe('formatDateUK', () => {
  it('formats date correctly', () => {
    const result = formatDateUK('2024-12-25T00:00:00Z');
    expect(result).toBe('25 December 2024');
  });

  it('handles invalid date', () => {
    expect(() => formatDateUK('invalid')).toThrow();
  });
});
```

### Best Practices

- Test edge cases
- Test error handling
- Keep tests isolated (no shared state)
- One concept per test
- Clear test names

## Component Testing

### Purpose

Test React components in isolation with rendered output and user interactions.

### Setup: vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

### Setup: tests/setup.ts

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

### Example: Testing Components

```typescript
// components/ui/Button.tsx
'use client';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export default function Button({ children, onClick, disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

// __tests__/components/ui/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/components/ui/Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button onClick={vi.fn()}>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button onClick={vi.fn()} disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### Testing Server Components

For Server Components, test the rendered output:

```typescript
// Test Server Component rendering
describe('Page', () => {
  it('renders heading', async () => {
    const Page = await import('@/app/page');
    const { default: PageComponent } = Page;
    
    const { container } = render(PageComponent());
    expect(container.querySelector('h1')).toBeInTheDocument();
  });
});
```

### Best Practices

- Query by accessible roles (`getByRole`)
- Use semantic queries (avoid test IDs when possible)
- Test user interactions, not implementation
- Test accessibility features
- Keep tests focused and fast

## Integration Testing

### Purpose

Test how multiple components, modules, or features work together.

### Example: Form Submission Flow

```typescript
// __tests__/integration/contactForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '@/components/sections/ContactForm';

describe('ContactForm Integration', () => {
  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<ContactForm onSubmit={onSubmit} />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
      });
    });
  });

  it('shows validation errors', async () => {
    const user = userEvent.setup();
    
    render(<ContactForm onSubmit={vi.fn()} />);
    
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });
});
```

### Best Practices

- Test user workflows, not implementation
- Mock external dependencies (APIs, etc.)
- Use real data structures
- Test error states and edge cases

## End-to-End Testing

### Purpose

Test complete user flows in real browser environments.

### Setup: playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Example: E2E Tests

```typescript
// e2e/contact.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('should submit contact form successfully', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill form
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('textarea[name="message"]', 'Test message');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify success message
    await expect(page.locator('.success-message')).toBeVisible();
    await expect(page.locator('.success-message')).toContainText('Thank you');
  });

  test('should show validation errors', async ({ page }) => {
    await page.goto('/contact');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Verify error messages
    await expect(page.locator('text=/name is required/i')).toBeVisible();
    await expect(page.locator('text=/email is required/i')).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');
    
    // Click navigation link
    await page.click('a[href="/about"]');
    
    // Verify URL
    await expect(page).toHaveURL('http://localhost:3000/about');
    
    // Verify content
    await expect(page.locator('h1')).toContainText('About');
  });
});
```

### E2E Best Practices

- Test critical user journeys
- Keep tests independent and isolated
- Use data-testid sparingly (prefer accessible queries)
- Run in multiple browsers
- Use page object model for complex pages

### Page Object Model Example

```typescript
// e2e/pages/ContactPage.ts
import { Page, Locator } from '@playwright/test';

export class ContactPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Name');
    this.emailInput = page.getByLabel('Email');
    this.messageInput = page.getByLabel('Message');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async goto() {
    await this.page.goto('/contact');
  }

  async submitForm(data: { name: string; email: string; message: string }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.messageInput.fill(data.message);
    await this.submitButton.click();
  }
}
```

## Testing Best Practices

### General Guidelines

1. **Arrange-Act-Assert (AAA):**
   ```typescript
   test('does something', () => {
     // Arrange: Set up
     const input = 'test';
     
     // Act: Execute
     const result = functionUnderTest(input);
     
     // Assert: Verify
     expect(result).toBe('expected');
   });
   ```

2. **Test Descriptions:** Use descriptive test names
   ```typescript
   // Good
   it('displays error message when email is invalid', () => {});
   
   // Bad
   it('works', () => {});
   ```

3. **Keep Tests Simple:** One assertion per test when possible
4. **Isolation:** Tests should not depend on each other
5. **Deterministic:** Same input should always produce same output

### Accessibility Testing

```typescript
import { axe } from 'vitest-axe';
import { render } from '@testing-library/react';

test('has no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Performance Testing

```typescript
// Test that expensive operations don't block rendering
test('renders quickly', async () => {
  const start = performance.now();
  render(<ExpensiveComponent />);
  const end = performance.now();
  
  expect(end - start).toBeLessThan(100); // 100ms
});
```

## Running Tests

### Unit and Component Tests

```bash
# Run all tests
npm run test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test Button.test.tsx

# Run with UI
npm run test:ui
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific test
npm run test:e2e contact.spec.ts

# Debug tests
npm run test:e2e -- --debug
```

### Update package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## Test Coverage

### Coverage Goals

- **Overall:** 70-80% coverage
- **Critical Paths:** 100% coverage
- **Complex Logic:** 95%+ coverage
- **UI Components:** 60-70% coverage

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View in browser
open coverage/index.html
```

### What to Test

**High Priority:**
- Business logic and utilities
- Critical user flows
- Form validation
- API integrations
- Error handling

**Medium Priority:**
- UI components
- Navigation
- Responsive behaviour
- Accessibility

**Lower Priority:**
- Static content
- Simple presentational components
- Third-party library integration

### What NOT to Test

- Third-party library internals
- Next.js framework code
- Obvious implementation details
- Code that's impossible to break

## Test Maintenance

### Keeping Tests Up-to-Date

- Update tests when changing functionality
- Remove obsolete tests
- Refactor tests along with code
- Keep test descriptions current

### Handling Flaky Tests

- Investigate root cause
- Add proper waits/synchronisation
- Stabilise test environment
- Remove or quarantine if unfixable

## References

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)

## Next Steps

1. Install testing dependencies
2. Set up test configuration
3. Write first tests
4. Add to CI/CD pipeline
5. Establish coverage goals
6. Create test templates
















