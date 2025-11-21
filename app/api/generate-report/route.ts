import { NextRequest, NextResponse } from 'next/server';
import { CUSTOM_UX_PROMPT } from '@/lib/ux-prompt';
import type { AnalyzeUXErrorResponse, GeminiResponse } from '@/types/ux-analysis';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.5-flash-preview-09-2025';

if (!GEMINI_API_KEY) {
  console.error('FATAL: GEMINI_API_KEY environment variable is not set.');
}

export const maxDuration = 60; // Allow up to 60 seconds for analysis

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

  let body: any;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json<AnalyzeUXErrorResponse>(
      { error: 'Invalid JSON in request body.' },
      { status: 400 }
    );
  }

  const { 
    screenshot, 
    htmlContent, 
    screenshotWidth, 
    screenshotHeight, 
    viewportWidth, 
    viewportHeight 
  } = body;

  if (!screenshot || !htmlContent) {
    return NextResponse.json<AnalyzeUXErrorResponse>(
      { error: 'Missing screenshot or HTML content.' },
      { status: 400 }
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
              data: screenshot.split(',')[1] // Remove data:image/jpeg;base64, prefix if present
            } 
          },
          // Textual Input (HTML content for structure and text extraction)
          { 
            text: `The HTML content of the page is provided below. Use it to confirm the presence and structure of elements seen in the image, and to extract text content, alt-text, and metadata. \n\nHTML Content:\n---\n${htmlContent}` 
          },
          // Screenshot dimension information for accurate coordinate generation
          { 
            text: `**SCREENSHOT DIMENSIONS (CRITICAL FOR COORDINATE ACCURACY - READ THIS FIRST):**

═══════════════════════════════════════════════════════════════
THE SCREENSHOT YOU ARE ANALYZING HAS THESE EXACT DIMENSIONS:
═══════════════════════════════════════════════════════════════

📐 Screenshot Width: ${screenshotWidth} pixels
📐 Screenshot Height: ${screenshotHeight} pixels
🖥️ Viewport Width: ${viewportWidth} pixels  
🖥️ Viewport Height: ${viewportHeight} pixels

═══════════════════════════════════════════════════════════════

**CRITICAL COORDINATE RULES:**

1. All coordinates MUST be relative to the full screenshot (${screenshotWidth}x${screenshotHeight}px)
2. Coordinate system: (0,0) = top-left corner, X increases right, Y increases downward
3. Maximum valid coordinates:
   - x can be 0 to ${screenshotWidth - 1}
   - y can be 0 to ${screenshotHeight - 1}
   - x + width must not exceed ${screenshotWidth}
   - y + height must not exceed ${screenshotHeight}
4. Coordinates must be positive integers (whole numbers)
5. The screenshot is a FULL-PAGE capture, so elements can be anywhere from y=0 to y=${screenshotHeight}

**BEFORE INCLUDING COORDINATES, VERIFY:**
✓ x is between 0 and ${screenshotWidth - 1}
✓ y is between 0 and ${screenshotHeight - 1}
✓ x + width ≤ ${screenshotWidth}
✓ y + height ≤ ${screenshotHeight}
✓ All values are positive integers

` 
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

    return NextResponse.json({
      success: true,
      report: generatedText,
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
