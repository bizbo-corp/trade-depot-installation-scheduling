/**
 * TypeScript type definitions for UX Analysis API
 */

export interface AnalyzeUXRequest {
  url: string;
}

export interface AnalyzeUXResponse {
  success: true;
  report: string;
}

export interface AnalyzeUXErrorResponse {
  error: string;
  details?: string;
}

/**
 * Gemini API response structure
 */
export interface GeminiContentPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface GeminiContent {
  role: string;
  parts: GeminiContentPart[];
}

export interface GeminiRequest {
  contents: GeminiContent[];
}

export interface GeminiCandidate {
  content: {
    parts: Array<{
      text: string;
    }>;
  };
}

export interface GeminiResponse {
  candidates?: GeminiCandidate[];
  error?: {
    message: string;
    code?: number;
  };
}

