import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
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

  // --- Phase 1: Scraping Layer (Puppeteer) ---
  try {
    browser = await puppeteer.launch({
      headless: true, // Use new headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
    });
    const page = await browser.newPage();

    // Emulate a standard desktop screen size for consistency
    await page.setViewport({ width: 1280, height: 1024 });

    // Go to the URL and wait until all network connections are idle
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

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
  } catch (error) {
    console.error('Scraping or screenshot failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json<AnalyzeUXErrorResponse>(
      { 
        error: 'Failed to scrape the provided URL. It might be inaccessible or blocked.',
        details: errorMessage,
      },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
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

