# Deployment

## Overview

This document outlines the deployment process, build procedures, and environment management for the Bizbo Brochure project. Following these guidelines ensures reliable, consistent deployments.

## Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Build Process](#build-process)
4. [Environment Configuration](#environment-configuration)
5. [Deployment Platforms](#deployment-platforms)
6. [CI/CD](#cicd)
7. [Monitoring](#monitoring)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)

## Deployment Overview

### Deployment Strategy

- **Primary Platform:** Vercel (recommended for Next.js)
- **Build Type:** Static and Server-Side Rendering hybrid
- **Deployment Frequency:** On every merge to main branch
- **Environments:** Production, Preview (optional), Development

### Deployment Principles

1. **Automation:** Deploy automatically from main branch
2. **Zero Downtime:** Deploy without service interruption
3. **Rollback Ready:** Ability to quickly revert if issues arise
4. **Monitoring:** Track deployment health and performance
5. **Security:** Secure secrets and API keys

## Pre-Deployment Checklist

### Code Quality Checks

- [ ] All tests passing
- [ ] Linting passes without errors
- [ ] TypeScript checks pass
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] No TODO comments in critical paths

### Performance Checks

- [ ] Build succeeds locally
- [ ] Bundle size within limits
- [ ] Lighthouse score ≥ 90
- [ ] Core Web Vitals pass
- [ ] Images optimised
- [ ] No large dependencies

### Security Checks

- [ ] No secrets in code
- [ ] Environment variables configured
- [ ] Dependencies up to date
- [ ] No vulnerable packages (run `npm audit`)
- [ ] HTTPS enforced
- [ ] CORS configured correctly

### Content Checks

- [ ] All copy reviewed and correct
- [ ] Links work correctly
- [ ] Images load properly
- [ ] Contact forms functional
- [ ] Metadata and SEO tags present

### Browser Testing

- [ ] Chrome tested
- [ ] Firefox tested
- [ ] Safari tested
- [ ] Edge tested
- [ ] Mobile responsive verified

### Documentation

- [ ] README updated if needed
- [ ] Changelog updated
- [ ] Breaking changes documented
- [ ] Migration guide if applicable

## Build Process

### Local Build Testing

Always test the build locally before deploying:

```bash
# Install dependencies (clean)
npm ci

# Build for production
npm run build

# Start production server
npm start

# Test at http://localhost:3000
```

### Build Output

The build process creates:

```
.next/
├── server/          # Server-side code
├── static/          # Static assets
└── standalone/      # Standalone build (if configured)
```

### Build Optimisations

Next.js automatically optimises:

- **Image Optimisation:** WebP/AVIF conversion
- **Code Splitting:** Route-based splitting
- **Tree Shaking:** Remove unused code
- **Minification:** JavaScript and CSS
- **Bundle Analysis:** Show bundle sizes

### Build Commands

```bash
# Production build
npm run build

# Build output includes:
# - Static pages (pre-rendered)
# - Server components
# - API routes
# - Optimised assets

# Check build output
# Look for:
# - Route sizes
# - First Load JS sizes
# - Warnings or errors
```

### Build Troubleshooting

```bash
# If build fails:

# 1. Clear cache
rm -rf .next node_modules

# 2. Reinstall dependencies
npm ci

# 3. Try build again
npm run build

# 4. Check for errors in terminal
# Look for specific file/line errors
```

## Environment Configuration

### Environment Variables

#### Development (.env.local)

```env
# Never commit this file
NEXT_PUBLIC_API_URL=http://localhost:3000
API_SECRET_KEY=dev-secret-key
DATABASE_URL=postgresql://localhost:5432/bizbo_dev
```

#### Production (.env.production)

```env
# Commit-safe, defaults only
NEXT_PUBLIC_API_URL=https://api.bizbo.com
# Secrets configured in deployment platform
```

### Environment Variable Setup

#### Vercel

1. Go to Project Settings → Environment Variables
2. Add variables for each environment:
   - Production
   - Preview
   - Development
3. Secrets are encrypted and secure
4. Changes require redeployment

#### Other Platforms

- **Netlify:** Site Settings → Environment Variables
- **Railway:** Project Settings → Variables
- **Self-hosted:** Set in hosting environment

### Required Environment Variables

Document all required variables:

```env
# Public (sent to browser)
NEXT_PUBLIC_SITE_URL=https://www.bizbo.com
NEXT_PUBLIC_API_URL=https://api.bizbo.com

# Private (server-side only)
DATABASE_URL=<database-connection-string>
API_SECRET_KEY=<secret-key>
STRIPE_SECRET_KEY=<stripe-key>  # If using payments
SMTP_HOST=<email-host>          # If sending emails
```

### Security Best Practices

1. **Never commit secrets:** Use `.gitignore`
2. **Use different keys:** Separate dev/staging/prod
3. **Rotate regularly:** Change secrets periodically
4. **Minimal access:** Only necessary variables
5. **Audit variables:** Review regularly

## Deployment Platforms

### Vercel (Recommended)

**Why Vercel?**

- Built by Next.js creators
- Zero-config Next.js deployment
- Automatic HTTPS
- Edge Functions support
- Preview deployments
- Analytics included

**Setup:**

1. Import repository from GitHub
2. Configure environment variables
3. Deploy automatically on push
4. Done!

**Deployment Process:**

```bash
# Automatic deployment on push to main
git push origin main

# Vercel automatically:
# - Runs npm run build
# - Deploys to production
# - Provides unique URL
```

**Manual Deployment:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Alternative Platforms

#### Netlify

- Good Next.js support
- Custom build commands
- Environment variables support
- Continuous deployment

#### Self-Hosted

If deploying to own infrastructure:

1. **Build locally or in CI:**
   ```bash
   npm run build
   ```

2. **Deploy build output:**
   - Upload `.next` folder
   - Set up Node.js server
   - Configure reverse proxy (Nginx)

3. **Run production server:**
   ```bash
   npm start
   ```

### Docker Deployment (Optional)

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t bizbo-brochure .
docker run -p 3000:3000 bizbo-brochure
```

## CI/CD

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm run test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Deployment Pipeline

```mermaid
graph LR
    A[Code Push] --> B[Run Tests]
    B --> C[Lint Check]
    C --> D[Build]
    D --> E[Deploy Staging]
    E --> F[E2E Tests]
    F --> G[Deploy Production]
    G --> H[Monitor]
```

### Automated Checks

Every deployment should:

1. Run test suite
2. Check linting
3. Verify build success
4. Test in staging
5. Run E2E tests
6. Deploy to production
7. Monitor health

## Monitoring

### Health Checks

Set up monitoring for:

- **Uptime:** Service availability
- **Response Time:** Server performance
- **Error Rate:** Failed requests
- **Build Status:** Deployment success
- **Metrics:** Core Web Vitals

### Vercel Analytics

Built-in monitoring:

- Performance metrics
- Web Vitals
- Real User Monitoring (RUM)
- Custom analytics

### External Monitoring

Consider:

- **Sentry:** Error tracking
- **LogRocket:** Session replay
- **Google Analytics:** User analytics
- **Uptime Robot:** Uptime monitoring

### Logging

```typescript
// Log important events
console.log('User registered:', userId);
console.error('Payment failed:', error);

// Use structured logging
console.log({
  event: 'page_view',
  path: '/contact',
  timestamp: new Date().toISOString(),
});
```

## Rollback Procedures

### Quick Rollback

#### Vercel

1. Go to Deployments
2. Find last working deployment
3. Click "..." → Promote to Production

#### Git Rollback

```bash
# Revert last commit
git revert HEAD

# Push revert
git push origin main

# Automatic deployment triggers
```

### Database Rollback

⚠️ **Warning:** Database rollbacks are dangerous!

See [Database Management Rules](../../docs/database-management.md) for details.

**Never run without review:**
- `prisma migrate reset --force`
- `prisma migrate reset`
- `prisma migrate deploy`
- `prisma db push`

### Rollback Checklist

- [ ] Identify working deployment/commit
- [ ] Document reason for rollback
- [ ] Check for data migration needs
- [ ] Notify team
- [ ] Execute rollback
- [ ] Verify site functional
- [ ] Create issue to fix root cause

## Troubleshooting

### Build Fails

```bash
# Check error message
# Common causes:

# 1. Missing environment variables
# Solution: Add to deployment platform

# 2. TypeScript errors
# Solution: Fix type errors locally first

# 3. Dependency issues
# Solution: Update package-lock.json

# 4. Out of memory
# Solution: Increase build memory
```

### Site Not Updating

```bash
# Hard refresh in browser
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# Or disable cache in dev tools
```

### Environment Variables Not Working

1. Check variable names match exactly
2. Ensure they're set for correct environment
3. Verify `NEXT_PUBLIC_` prefix for client vars
4. Redeploy after adding variables

### Performance Issues

1. Check bundle sizes
2. Review Core Web Vitals
3. Optimise images
4. Check third-party scripts
5. Review database queries
6. Check server resources

### Common Issues

#### 404 Errors

- Check file paths
- Verify routing
- Check .htaccess if self-hosted

#### CORS Errors

- Configure allowed origins
- Check API settings
- Review header settings

#### Build Timeout

- Optimise build process
- Reduce bundle size
- Check external dependencies
- Increase build timeout in platform

## Post-Deployment

### Verification Checklist

- [ ] Home page loads correctly
- [ ] All pages accessible
- [ ] Forms submit successfully
- [ ] Images load properly
- [ ] Links work correctly
- [ ] Mobile layout correct
- [ ] Performance metrics good
- [ ] No console errors

### Documentation

Update project documentation:

- Changelog
- Deployment notes
- Known issues
- Next steps

### Team Communication

Notify team of:

- Deployment completion
- Changes made
- Testing conducted
- Known issues
- Rollback if needed

## References

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

## Summary

1. **Test locally first:** Always build and test before deploying
2. **Automate:** Set up CI/CD for consistent deployments
3. **Monitor:** Track health and performance
4. **Secure:** Protect environment variables and secrets
5. **Document:** Keep deployment notes and changelogs
6. **Be ready:** Have rollback plan prepared

