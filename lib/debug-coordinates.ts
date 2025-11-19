/**
 * Debug utilities for coordinate extraction and validation
 */

import type { ImageCoordinates } from '@/types/ux-analysis';

/**
 * Logs coordinate extraction pipeline for debugging
 */
export function logCoordinateExtraction(
  quickWinIndex: number,
  markdown: string,
  extractedCoordinates: ImageCoordinates | null
): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.group(`[Debug] Quick Win ${quickWinIndex + 1} - Coordinate Extraction`);
  
  // Check for JSON blocks
  const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/gi;
  const jsonBlocks = Array.from(markdown.matchAll(jsonBlockRegex));
  
  console.log('JSON blocks found:', jsonBlocks.length);
  jsonBlocks.forEach((block, idx) => {
    console.log(`\nJSON Block ${idx + 1}:`, block[1].trim().substring(0, 200));
  });
  
  // Check for coordinate-like patterns
  const coordinatePatterns = [
    /"x"\s*:\s*\d+/gi,
    /"y"\s*:\s*\d+/gi,
    /"width"\s*:\s*\d+/gi,
    /"height"\s*:\s*\d+/gi,
  ];
  
  const hasCoordinatePatterns = coordinatePatterns.every(pattern => 
    pattern.test(markdown)
  );
  
  console.log('Has coordinate-like patterns:', hasCoordinatePatterns);
  console.log('Extracted coordinates:', extractedCoordinates);
  
  if (!extractedCoordinates && hasCoordinatePatterns) {
    console.warn('⚠️ Coordinate patterns found but extraction failed!');
  }
  
  console.groupEnd();
}

/**
 * Validates coordinates against screenshot dimensions
 */
export function validateCoordinatesAgainstScreenshot(
  coordinates: ImageCoordinates,
  screenshotWidth: number,
  screenshotHeight: number
): {
  valid: boolean;
  issues: string[];
  adjusted?: ImageCoordinates;
} {
  const issues: string[] = [];
  let adjusted: ImageCoordinates | undefined;
  
  // Check bounds
  if (coordinates.x < 0) {
    issues.push(`x is negative: ${coordinates.x}`);
  }
  if (coordinates.y < 0) {
    issues.push(`y is negative: ${coordinates.y}`);
  }
  if (coordinates.x >= screenshotWidth) {
    issues.push(`x (${coordinates.x}) exceeds screenshot width (${screenshotWidth})`);
  }
  if (coordinates.y >= screenshotHeight) {
    issues.push(`y (${coordinates.y}) exceeds screenshot height (${screenshotHeight})`);
  }
  if (coordinates.x + coordinates.width > screenshotWidth) {
    issues.push(`x + width (${coordinates.x + coordinates.width}) exceeds screenshot width (${screenshotWidth})`);
  }
  if (coordinates.y + coordinates.height > screenshotHeight) {
    issues.push(`y + height (${coordinates.y + coordinates.height}) exceeds screenshot height (${screenshotHeight})`);
  }
  
  // Check size
  if (coordinates.width < 30) {
    issues.push(`width (${coordinates.width}) is too small (minimum 30px)`);
  }
  if (coordinates.height < 30) {
    issues.push(`height (${coordinates.height}) is too small (minimum 30px)`);
  }
  
  // Create adjusted coordinates if needed
  if (issues.length > 0) {
    adjusted = {
      ...coordinates,
      x: Math.max(0, Math.min(coordinates.x, screenshotWidth - 1)),
      y: Math.max(0, Math.min(coordinates.y, screenshotHeight - 1)),
      width: Math.min(coordinates.width, screenshotWidth - Math.max(0, coordinates.x)),
      height: Math.min(coordinates.height, screenshotHeight - Math.max(0, coordinates.y)),
    };
  }
  
  return {
    valid: issues.length === 0,
    issues,
    adjusted: issues.length > 0 ? adjusted : undefined,
  };
}

/**
 * Visualizes coordinate extraction issues
 */
export function visualizeCoordinateIssues(
  quickWinIndex: number,
  coordinates: ImageCoordinates | null,
  screenshotWidth: number,
  screenshotHeight: number
): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  if (!coordinates) {
    console.warn(`[Quick Win ${quickWinIndex + 1}] No coordinates extracted`);
    return;
  }

  const validation = validateCoordinatesAgainstScreenshot(
    coordinates,
    screenshotWidth,
    screenshotHeight
  );

  if (!validation.valid) {
    console.group(`[Quick Win ${quickWinIndex + 1}] Coordinate Validation Issues`);
    console.log('Issues found:', validation.issues);
    if (validation.adjusted) {
      console.log('Adjusted coordinates:', validation.adjusted);
    }
    console.groupEnd();
  }
}

/**
 * Debug mode toggle (can be extended for UI toggle)
 */
export const DEBUG_COORDINATES = process.env.NODE_ENV === 'development';

