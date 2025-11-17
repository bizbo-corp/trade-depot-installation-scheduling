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

import { CUSTOM_UX_PROMPT } from '@/lib/ux-prompt';
import type { AnalyzeUXRequest, AnalyzeUXErrorResponse, GeminiResponse } from '@/types/ux-analysis';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.5-flash-preview-09-2025';

if (!GEMINI_API_KEY) {
  console.error('FATAL: GEMINI_API_KEY environment variable is not set.');
}

/**
 * Helper function to convert binary data (screenshot) to Base64
 */
function bufferToBase64(buffer: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

/**
 * POST handler for UX analysis
 * Orchestrates scraping, analysis, and reporting
 */
export async function POST(request: NextRequest) {
  // Check for API key
  if (!GEMINI_API_KEY) {
    return NextResponse.json<AnalyzeUXErrorResponse>(
      { 
        error: 'GEMINI_API_KEY environment variable is not set. Please configure it in your .env.local file.',
      },
      { status: 500 }
    );
  }

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

  console.log(`Starting analysis for URL: ${url}`);
  let browser;
  let htmlContent = '';
  let screenshotBase64 = '';

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
        // Stealth techniques are applied via launch options (User-Agent, automation flags)
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
      await page.waitForTimeout(1000);

      // Capture full page screenshot
      const screenshotBuffer = await page.screenshot({
        fullPage: true,
        type: 'jpeg',
        quality: 80,
      }) as Buffer;
      screenshotBase64 = bufferToBase64(screenshotBuffer, 'image/jpeg');

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

  // --- Phase 2: Analysis Layer (Gemini API Call) ---
  try {
    // Construct the parts for the multimodal request
    const contents = [
      {
        role: 'user',
        parts: [
          // Visual Input (Screenshot)
          { 
            inlineData: { 
              mimeType: 'image/jpeg', 
              data: screenshotBase64.split(',')[1] 
            } 
          },
          // Textual Input (HTML content for structure and text extraction)
          { 
            text: `The HTML content of the page is provided below. Use it to confirm the presence and structure of elements seen in the image, and to extract text content, alt-text, and metadata. \n\nHTML Content:\n---\n${htmlContent}` 
          },
          // The main prompt for the AI to execute the analysis
          { text: CUSTOM_UX_PROMPT },
        ],
      },
    ];

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    // Exponential backoff retry logic for API call
    const maxRetries = 3;
    let response: Response | null = null;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents }),
        });

        if (response.ok) {
          break; // Success, exit retry loop
        } else if (attempt === maxRetries) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `Gemini API failed after ${maxRetries} attempts. Status: ${response.status}`
          );
        } else {
          // If not OK and not last attempt, wait and retry
          const errorData = await response.json().catch(() => ({}));
          lastError = new Error(
            `Gemini API returned status ${response.status}: ${JSON.stringify(errorData)}`
          );
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      } catch (e) {
        lastError = e instanceof Error ? e : new Error('Unknown error during API call');
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        } else {
          throw lastError;
        }
      }
    }

    if (!response || !response.ok) {
      throw lastError || new Error('Failed to get response from Gemini API');
    }

    const result: GeminiResponse = await response.json();

    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      console.error('Gemini API returned no text content or error:', result);
      return NextResponse.json<AnalyzeUXErrorResponse>(
        { 
          error: 'AI analysis failed to generate a report.',
          details: result.error?.message || 'Unknown API error.',
        },
        { status: 500 }
      );
    }

    // --- Phase 3: Reporting Layer (Return the raw AI output) ---
    // The frontend (Next.js) will handle the final formatting/display of this Markdown report.
    return NextResponse.json({
      success: true,
      report: generatedText,
      screenshot: screenshotBase64,
    });
  } catch (error) {
    console.error('Gemini API call failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json<AnalyzeUXErrorResponse>(
      { 
        error: 'Internal server error during AI analysis.',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

