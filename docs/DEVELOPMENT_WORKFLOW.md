# Development Workflow

## Overview

This document outlines the development workflow, local setup procedures, and development best practices for the Trade Depot Installation Scheduling project. Follow these guidelines to ensure a smooth development experience and maintain code quality.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Development Server](#development-server)
4. [Common Tasks](#common-tasks)
5. [Code Quality](#code-quality)
6. [Debugging](#debugging)
7. [Troubleshooting](#troubleshooting)
8. [Development Best Practices](#development-best-practices)

## Prerequisites

### Required Software

- **Node.js:** Version 20.x or higher
- **npm:** Version 10.x or higher (comes with Node.js)
- **Git:** For version control
- **Code Editor:** VSCode recommended (optional but recommended)

### Recommended VSCode Extensions

- ES7+ React/Redux/React-Native snippets
- ESLint
- Prettier (configure if used)
- Tailwind CSS IntelliSense
- TypeScript Importer
- Error Lens

### Browser Requirements

- Modern browser (Chrome, Firefox, Safari, Edge)
- Developer tools enabled
- JavaScript enabled

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/bizbo-corp/trade-depot-installation-scheduling.git
cd trade-depot-installation-scheduling
```

### 2. Install Dependencies

```bash
npm install
```

This will install all dependencies listed in `package.json`:
- React 19.2.0
- Next.js 16.0.1
- TypeScript 5.x
- Tailwind CSS 4.x
- ESLint and configuration

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy example if available
cp .env.example .env.local

# Or create new one
touch .env.local
```

Add any required environment variables:

```env
# Example (add as needed)
NEXT_PUBLIC_API_URL=https://api.example.com

# Never commit secrets or API keys
API_SECRET_KEY=your-secret-key
```

### 4. Verify Installation

Run the development server to verify everything works:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the Next.js welcome page.

## Development Server

### Starting the Server

```bash
npm run dev
```

The server will:
- Start on `http://localhost:3000` by default
- Enable Hot Module Replacement (HMR) for instant updates
- Show compilation errors in the browser
- Automatically reload on file changes

### Server Options

```bash
# Start on custom port
npm run dev -- -p 3001

# Start with turbo mode (if available)
npm run dev -- --turbo
```

### Stopping the Server

Press `Ctrl+C` in the terminal to stop the development server.

### Development Server Features

- **Fast Refresh:** React components update without losing state
- **Error Overlay:** Errors appear in browser with stack traces
- **Type Checking:** TypeScript errors shown in terminal and browser
- **Source Maps:** Original source code in browser dev tools

## Common Tasks

### Running the Build

Test production build locally:

```bash
npm run build
```

This will:
- Build the application for production
- Run TypeScript type checking
- Optimise assets
- Create `.next` directory with production files
- Show bundle analysis

### Starting Production Server

After building, start the production server:

```bash
npm start
```

Useful for testing production optimisations and server-side rendering.

### Linting Code

Check for linting errors:

```bash
npm run lint
```

This runs ESLint with Next.js configuration. Fix errors before committing.

### Type Checking

TypeScript type checking is integrated into the build process. To check types without building:

```bash
npx tsc --noEmit
```

### Viewing Bundle Size

After building, Next.js shows bundle sizes:

```bash
npm run build
```

Look for output like:

```
Route (app)                              Size     First Load JS
┌ ○ /                                    5 kB     [Bundle info]
```

## Code Quality

### Pre-Commit Checks

Before committing code:

1. **Run linting:**
   ```bash
   npm run lint
   ```

2. **Check types:**
   ```bash
   npx tsc --noEmit
   ```

3. **Fix auto-fixable issues:**
   ```bash
   npm run lint -- --fix
   ```

### Editor Configuration

#### VSCode Settings

Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

#### ESLint Integration

ESLint automatically runs in VSCode if the extension is installed. Errors appear as red underlines and in the Problems panel.

### Code Formatting

While Prettier is not configured by default, you can add it:

```bash
npm install -D prettier eslint-config-prettier
```

Create `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

## Debugging

### Browser DevTools

Use browser developer tools for debugging:

1. **Chrome DevTools:**
   - Right-click → Inspect
   - Sources tab for breakpoints
   - React DevTools extension recommended

2. **React DevTools:**
   - Install browser extension
   - Inspect component tree
   - View props and state

### Debugging in VSCode

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Console Logging

Use console for debugging:

```typescript
// Development only
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}

// Always show
console.error('Error occurred:', error);
```

Remove or comment out console.logs before committing.

### Network Inspection

Use browser Network tab to:
- Inspect API calls
- Check response times
- View request/response data
- Debug fetch errors

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use different port
npm run dev -- -p 3001
```

#### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

#### TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf .next

# Rebuild
npm run dev
```

#### Styling Not Updating

Tailwind classes might not be picked up:

1. Check `tailwind.config.ts` content paths
2. Restart dev server
3. Clear `.next` directory

```bash
rm -rf .next
npm run dev
```

#### Build Errors

```bash
# Clean build
rm -rf .next node_modules
npm install
npm run build
```

### Getting Help

1. Check console for error messages
2. Review browser error overlay
3. Check terminal output
4. Search project documentation
5. Search Next.js documentation
6. Check GitHub issues (Next.js, React, etc.)

## Development Best Practices

### Daily Workflow

1. **Start:** Pull latest changes and create feature branch
   ```bash
   git pull origin main
   git checkout -b feature/my-feature
   ```

2. **Develop:** Write code, test in browser
   ```bash
   npm run dev
   ```

3. **Check:** Lint and type check before committing
   ```bash
   npm run lint
   npx tsc --noEmit
   ```

4. **Commit:** Write meaningful commit messages
   ```bash
   git add .
   git commit -m "feat: add contact form component"
   ```

5. **Push:** Push to remote for review
   ```bash
   git push origin feature/my-feature
   ```

### Working on Features

1. Create a new branch from `main`
2. Implement feature following coding standards
3. Test thoroughly in development
4. Write or update relevant tests
5. Update documentation if needed
6. Create pull request

### Code Review Checklist

Before requesting review:

- [ ] Code follows project coding standards
- [ ] Linting passes without errors
- [ ] TypeScript checks pass
- [ ] No console.log statements left
- [ ] Comments are meaningful and up-to-date
- [ ] Responsive design works on mobile and desktop
- [ ] Accessibility requirements met
- [ ] No commented-out code
- [ ] Performance optimisations applied where needed

### Hot Reload Tips

Next.js fast refresh updates:
- Component props and state changes (maintains state)
- Component additions/removals
- CSS updates

Requires page refresh:
- `_document` or `_app` changes (App Router doesn't have these)
- Environment variable changes
- Next.js config changes

### Performance Testing

Test performance during development:

```bash
# Build and analyse
npm run build

# Check bundle sizes
# View detailed output in terminal

# Use Lighthouse in Chrome DevTools
# View: DevTools → Lighthouse tab
```

### Accessibility Testing

During development:

1. **Keyboard Navigation:** Tab through all interactive elements
2. **Screen Reader:** Test with VoiceOver (Mac) or NVDA (Windows)
3. **Colour Contrast:** Use browser extensions
4. **Lighthouse:** Run accessibility audit

### Browser Testing

Test in multiple browsers:

- Chrome (primary)
- Firefox
- Safari
- Edge

Use browser developer tools to:
- Simulate mobile devices
- Test different screen sizes
- Debug responsive issues

## Development Tools

### Recommended Tools

- **VSCode:** Editor with excellent TypeScript support
- **React DevTools:** Browser extension for React debugging
- **Lighthouse:** Built into Chrome DevTools
- **Postman/Insomnia:** API testing if needed

### NPM Scripts Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type check without building |

### Useful NPM Commands

```bash
# Check outdated packages
npm outdated

# Security audit
npm audit

# Fix security issues
npm audit fix

# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Environment Management

### Environment Files

- `.env.local` - Local development (never commit)
- `.env.development` - Development defaults (optional)
- `.env.production` - Production defaults (optional)
- `.env` - Fallback values (commit-safe, no secrets)

### Accessing Environment Variables

```typescript
// Server-side (secure)
const apiKey = process.env.API_SECRET_KEY;

// Client-side (must prefix with NEXT_PUBLIC_)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### Best Practices

- Never commit `.env.local` (already in .gitignore)
- Never commit secrets or API keys
- Use different values for different environments
- Document required variables in README

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [VSCode Documentation](https://code.visualstudio.com/docs)

## Next Steps

After setting up development environment:

1. Read [CODING_STANDARDS.md](./CODING_STANDARDS.md)
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Check [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
4. Understand [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) (when implemented)

## Questions

If you encounter issues not covered here:

1. Check the troubleshooting section
2. Review project documentation
3. Check Next.js documentation
4. Ask the team

