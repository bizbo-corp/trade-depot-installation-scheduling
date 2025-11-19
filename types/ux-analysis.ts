/**
 * TypeScript type definitions for UX Analysis API
 */

export interface AnalyzeUXRequest {
  url: string;
}

export interface AnalyzeUXResponse {
  success: true;
  report: string;
  screenshot: string; // Base64 data URL of the screenshot
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

/**
 * Submit analysis request interface
 */
export interface SubmitAnalysisRequest {
  url: string;
  report: string;
  screenshot: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  areaOfInterest?: string[]; // Defaults to ["UX optimisation"] for UX form
}

/**
 * Submit analysis response interface
 */
export interface SubmitAnalysisResponse {
  success: true;
  message: string;
}

export interface SubmitAnalysisErrorResponse {
  error: string;
  details?: string;
}

/**
 * Verify email request interface
 */
export interface VerifyEmailRequest {
  token: string;
}

/**
 * Verify email response interface
 */
export interface VerifyEmailResponse {
  success: true;
  report: string;
  screenshot: string;
  url: string;
}

export interface VerifyEmailErrorResponse {
  error: string;
  details?: string;
}

/**
 * Image coordinates for cropping screenshots to highlight Quick Win areas
 */
export interface ImageCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
  zoom?: number;
}

