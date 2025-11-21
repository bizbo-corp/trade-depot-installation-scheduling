import { NextRequest, NextResponse } from 'next/server';

// Conditionally import based on environment
let puppeteer: any;
let chromium: any;

// Detect if we're in a Vercel serverless environment
const isServerless = !!process.env.VERCEL;

if (isServerless) {
  // Use puppeteer-core + chromium for serverless
  puppeteer = require('puppeteer-core');
  chromium = require('@sparticuz/chromium');
} else {
  // Use full puppeteer for local development
  puppeteer = require('puppeteer');
}

import type { AnalyzeUXRequest, AnalyzeUXErrorResponse } from '@/types/ux-analysis';

/**
 * Helper function to convert binary data (screenshot) to Base64
 */
function bufferToBase64(buffer: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

export async function POST(request: NextRequest) {
  let body: AnalyzeUXRequest;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json<AnalyzeUXErrorResponse>(
      { error: 'Invalid JSON in request body.' },
      { status: 400 }
    );
  }

  const { url } = body;

  if (!url) {
    return NextResponse.json<AnalyzeUXErrorResponse>(
      { error: 'URL is required in the request body.' },
      { status: 400 }
    );
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return NextResponse.json<AnalyzeUXErrorResponse>(
      { error: 'Invalid URL format.' },
      { status: 400 }
    );
  }

  console.log(`Starting capture for URL: ${url}`);
  let browser;
  let htmlContent = '';
  let screenshotBase64 = '';
  let screenshotWidth = 0;
  let screenshotHeight = 0;
  let viewportWidth = 0;
  let viewportHeight = 0;

  // Realistic User-Agent string (Chrome on Windows)
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

  // --- Phase 1: Scraping Layer (Puppeteer) ---
  // Retry logic with fallback strategies
  const maxCaptureRetries = 2;
  let captureError: Error | null = null;

  for (let attempt = 0; attempt <= maxCaptureRetries; attempt++) {
    try {
      // Configure launch options based on environment
      const launchOptions: any = {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled',
        ],
        ignoreDefaultArgs: ['--enable-automation'],
      };

      // Add serverless-specific configuration for Vercel
      if (isServerless && chromium) {
        launchOptions.args = [...chromium.args, '--disable-blink-features=AutomationControlled'];
        launchOptions.defaultViewport = chromium.defaultViewport;
        launchOptions.executablePath = await chromium.executablePath();
        launchOptions.headless = chromium.headless;
        launchOptions.ignoreDefaultArgs = ['--enable-automation'];
      }

      // Use puppeteer-extra for stealth capabilities (local only)
      // For serverless, we apply stealth techniques manually via launch options
      if (isServerless) {
        // For serverless with puppeteer-core, launch directly
        browser = await puppeteer.launch(launchOptions);
      } else {
        // For local development, use puppeteer-extra with stealth plugin
        const puppeteerExtra = require('puppeteer-extra');
        const StealthPlugin = require('puppeteer-extra-plugin-stealth');
        puppeteerExtra.use(StealthPlugin());
        browser = await puppeteerExtra.launch(launchOptions);
      }
      const page = await browser.newPage();

      // Set realistic User-Agent
      await page.setUserAgent(userAgent);

      // Emulate a standard desktop screen size for consistency
      // Try different viewport sizes on retry
      const viewports = [
        { width: 1920, height: 1080 },
        { width: 1280, height: 1024 },
        { width: 1366, height: 768 },
      ];
      const viewport = viewports[attempt] || viewports[0];
      await page.setViewport(viewport);
      viewportWidth = viewport.width;
      viewportHeight = viewport.height;

      // Go to the URL with improved wait strategy
      await page.goto(url, { 
        waitUntil: 'networkidle2', 
        timeout: 60000 
      });

      // Handle lazy loading by scrolling the page
      await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              // Scroll back to top
              window.scrollTo(0, 0);
              resolve();
            }
          }, 100);
        });
      });

      // Wait a bit after scrolling to allow lazy-loaded content to render
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get page dimensions before screenshot
      const pageDimensions = await page.evaluate(() => ({
        width: Math.max(
          document.body.scrollWidth,
          document.body.offsetWidth,
          document.documentElement.clientWidth,
          document.documentElement.scrollWidth,
          document.documentElement.offsetWidth
        ),
        height: Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        )
      }));

      // Capture full page screenshot
      const screenshotBuffer = await page.screenshot({
        fullPage: true,
        type: 'jpeg',
        quality: 80,
      }) as Buffer;
      screenshotBase64 = bufferToBase64(screenshotBuffer, 'image/jpeg');

      // Use actual page dimensions for screenshot dimensions
      screenshotWidth = pageDimensions.width;
      screenshotHeight = pageDimensions.height;
      
      // Log dimensions for debugging
      console.log('Screenshot dimensions captured:', {
        width: screenshotWidth,
        height: screenshotHeight,
        viewport: { width: viewportWidth, height: viewportHeight }
      });
      
      // Validate dimensions are reasonable
      if (screenshotWidth < 100 || screenshotHeight < 100 || screenshotWidth > 10000 || screenshotHeight > 50000) {
        console.warn('Screenshot dimensions seem unusual:', { width: screenshotWidth, height: screenshotHeight });
      }

      // Capture the full rendered HTML content
      htmlContent = await page.content();

      console.log('Scraping and screenshot capture complete.');
      captureError = null;
      break; // Success, exit retry loop
    } catch (error) {
      captureError = error instanceof Error ? error : new Error('Unknown error during capture');
      console.error(`Capture attempt ${attempt + 1} failed:`, captureError);
      
      // Clean up browser on error
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.error('Error closing browser:', closeError);
        }
        browser = null;
      }

      // If this was the last attempt, throw the error
      if (attempt === maxCaptureRetries) {
        break;
      }

      // Wait before retry (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    } finally {
      if (browser && captureError === null) {
        // Only close if we succeeded
        await browser.close();
      }
    }
  }

  // If all retries failed, return error
  if (captureError) {
    console.error('Scraping or screenshot failed after all retries:', captureError);
    const errorMessage = captureError.message || 'Unknown error';
    return NextResponse.json<AnalyzeUXErrorResponse>(
      { 
        error: 'Failed to scrape the provided URL. It might be inaccessible or blocked.',
        details: errorMessage,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    screenshot: screenshotBase64,
    htmlContent,
    screenshotWidth,
    screenshotHeight,
    viewportWidth,
    viewportHeight,
  });
}
