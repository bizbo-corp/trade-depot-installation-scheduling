/**
 * Client-side image cropping utility for Quick Win screenshots
 * Uses Canvas API to crop and zoom images based on coordinates
 */

import type { ImageCoordinates } from '@/types/ux-analysis';

/**
 * Crops an image based on coordinates and optional zoom level
 * @param base64Image - Base64 data URL of the source image
 * @param coordinates - Image coordinates with optional zoom level
 * @returns Promise resolving to a base64 data URL of the cropped image
 */
export async function cropImage(
  base64Image: string,
  coordinates: ImageCoordinates
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Validate input coordinates first and clamp if needed
        let cropX = Math.max(0, coordinates.x);
        let cropY = Math.max(0, coordinates.y);
        let cropWidth = coordinates.width;
        let cropHeight = coordinates.height;
        
        // Validate coordinates are within image bounds before clamping
        if (cropX >= img.width || cropY >= img.height) {
          reject(new Error(`Coordinates out of bounds: (${cropX}, ${cropY}) exceeds image size (${img.width}, ${img.height})`));
          return;
        }
        
        // Clamp to image bounds
        cropX = Math.min(cropX, img.width - 1);
        cropY = Math.min(cropY, img.height - 1);
        cropWidth = Math.min(cropWidth, img.width - cropX);
        cropHeight = Math.min(cropHeight, img.height - cropY);
        
        // Validate final crop area
        if (cropWidth <= 0 || cropHeight <= 0) {
          reject(new Error(`Invalid crop coordinates: area too small (${cropWidth}x${cropHeight})`));
          return;
        }
        
        if (cropX + cropWidth > img.width || cropY + cropHeight > img.height) {
          reject(new Error(`Invalid crop coordinates: area extends beyond image bounds`));
          return;
        }
        
        // Ensure minimum crop size (at least 10px)
        if (cropWidth < 10 || cropHeight < 10) {
          reject(new Error(`Invalid crop coordinates: area too small (minimum 10x10px required)`));
          return;
        }
        
        // Calculate or use zoom level
        // If zoom is specified and valid, use it; otherwise calculate optimal zoom
        let zoom: number;
        if (coordinates.zoom && coordinates.zoom > 0 && coordinates.zoom <= 5) {
          zoom = coordinates.zoom;
        } else {
          // Calculate optimal zoom based on element size
          // We'll use a simple category detection from coordinates size
          zoom = calculateOptimalZoom(coordinates);
        }
        
        // Calculate output canvas size (apply zoom by scaling the output)
        const outputWidth = Math.round(cropWidth * zoom);
        const outputHeight = Math.round(cropHeight * zoom);
        
        // Limit maximum output size to prevent memory issues (max 2000px)
        const maxOutputSize = 2000;
        let finalZoom = zoom;
        let finalWidth = outputWidth;
        let finalHeight = outputHeight;
        
        if (outputWidth > maxOutputSize || outputHeight > maxOutputSize) {
          const scale = Math.min(maxOutputSize / outputWidth, maxOutputSize / outputHeight);
          finalZoom = zoom * scale;
          finalWidth = Math.round(cropWidth * finalZoom);
          finalHeight = Math.round(cropHeight * finalZoom);
        }
        
        // Set canvas size to final dimensions
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        
        // Draw the exact coordinate area, scaled to output size (zoom applied here)
        ctx.drawImage(
          img,
          cropX,           // Source X (exact coordinate)
          cropY,           // Source Y (exact coordinate)
          cropWidth,       // Source width (exact coordinate)
          cropHeight,      // Source height (exact coordinate)
          0,               // Destination X
          0,               // Destination Y
          finalWidth,      // Destination width (with zoom)
          finalHeight      // Destination height (with zoom)
        );
        
        // Add focus indicator
        addFocusIndicator(canvas, ctx, coordinates, finalZoom, cropX, cropY);
        
        // Convert to base64 data URL
        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(croppedDataUrl);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Unknown error during cropping'));
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = base64Image;
  });
}

/**
 * Validates image coordinates against image dimensions
 * @param coordinates - Image coordinates to validate
 * @param imageWidth - Width of the source image
 * @param imageHeight - Height of the source image
 * @returns true if coordinates are valid, false otherwise
 */
export function validateCoordinates(
  coordinates: ImageCoordinates,
  imageWidth: number,
  imageHeight: number
): boolean {
  const { x, y, width, height } = coordinates;
  
  // Check for negative values
  if (x < 0 || y < 0 || width <= 0 || height <= 0) {
    return false;
  }
  
  // Check if coordinates are within image bounds
  if (x + width > imageWidth || y + height > imageHeight) {
    return false;
  }
  
  return true;
}

/**
 * Checks if coordinates represent an overly large area (likely not specific enough)
 * @param coordinates - Image coordinates to check
 * @param imageWidth - Width of the source image
 * @param imageHeight - Height of the source image
 * @param threshold - Percentage threshold (default 0.8 = 80%)
 * @returns true if coordinates cover more than threshold of the image
 */
export function isCoordinateAreaTooLarge(
  coordinates: ImageCoordinates,
  imageWidth: number,
  imageHeight: number,
  threshold: number = 0.8
): boolean {
  const { width, height } = coordinates;
  const imageArea = imageWidth * imageHeight;
  const coordinateArea = width * height;
  const percentage = coordinateArea / imageArea;
  return percentage > threshold;
}

/**
 * Checks if coordinates represent an overly small area (likely invalid)
 * @param coordinates - Image coordinates to check
 * @param minSize - Minimum size in pixels (default 50)
 * @returns true if coordinates are smaller than minimum size
 */
export function isCoordinateAreaTooSmall(
  coordinates: ImageCoordinates,
  minSize: number = 50
): boolean {
  const { width, height } = coordinates;
  return width < minSize || height < minSize;
}

/**
 * Calculates optimal zoom level based on element size and category
 * @param coordinates - Image coordinates
 * @param category - Optional category name for category-specific adjustments
 * @returns Optimal zoom level (1.0 to 3.0)
 */
export function calculateOptimalZoom(
  coordinates: ImageCoordinates,
  category?: string
): number {
  const { width, height } = coordinates;
  const avgSize = (width + height) / 2;
  
  // Base zoom calculation based on element size
  let zoom: number;
  
  if (avgSize < 200) {
    // Small elements: higher zoom
    zoom = 2.5;
  } else if (avgSize < 500) {
    // Medium elements: moderate zoom
    zoom = 1.75;
  } else {
    // Large elements: lower zoom
    zoom = 1.25;
  }
  
  // Category-specific adjustments
  if (category) {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('button') || categoryLower.includes('cta') || categoryLower.includes('call to action')) {
      // Buttons: Higher zoom for better visibility
      zoom = Math.max(zoom, 2.0);
      zoom = Math.min(zoom, 3.0);
    } else if (categoryLower.includes('text') || categoryLower.includes('readability') || categoryLower.includes('content')) {
      // Text blocks: Moderate zoom
      zoom = Math.max(zoom, 1.5);
      zoom = Math.min(zoom, 2.0);
    } else if (categoryLower.includes('section') || categoryLower.includes('design') || categoryLower.includes('aesthetic')) {
      // Sections: Lower zoom to show context
      zoom = Math.max(zoom, 1.0);
      zoom = Math.min(zoom, 1.5);
    }
  }
  
  // Clamp zoom between 1.0 and 3.0
  return Math.max(1.0, Math.min(3.0, zoom));
}

/**
 * Adds a focus indicator (dark dot with white stroke) to a cropped image
 * @param canvas - The canvas element with the cropped image already drawn
 * @param ctx - The canvas 2D context
 * @param coordinates - Image coordinates with optional focusPoint
 * @param zoom - The zoom level applied to the crop
 * @param cropX - The X coordinate of the crop area in the source image
 * @param cropY - The Y coordinate of the crop area in the source image
 */
function addFocusIndicator(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  coordinates: ImageCoordinates,
  zoom: number,
  cropX: number,
  cropY: number
): void {
  // Calculate focus point position
  let focusX: number;
  let focusY: number;
  
  if (coordinates.focusPoint) {
    // Use provided focus point, but adjust relative to crop area
    focusX = (coordinates.focusPoint.x - cropX) * zoom;
    focusY = (coordinates.focusPoint.y - cropY) * zoom;
  } else {
    // Default to center of coordinate area
    focusX = (coordinates.width / 2) * zoom;
    focusY = (coordinates.height / 2) * zoom;
  }
  
  // Ensure focus point is within canvas bounds
  focusX = Math.max(8, Math.min(canvas.width - 8, focusX));
  focusY = Math.max(8, Math.min(canvas.height - 8, focusY));
  
  // Calculate dot size (proportional to image size, but with min/max)
  const dotSize = Math.max(12, Math.min(16, Math.round(canvas.width * 0.02)));
  const radius = dotSize / 2;
  const strokeWidth = 2;
  
  // Draw white stroke (outer circle)
  ctx.beginPath();
  ctx.arc(focusX, focusY, radius + strokeWidth, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  ctx.fill();
  
  // Draw dark dot (inner circle)
  ctx.beginPath();
  ctx.arc(focusX, focusY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fill();
}

