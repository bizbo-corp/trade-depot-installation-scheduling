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
        
        // Clamp to image bounds
        cropX = Math.min(cropX, img.width - 1);
        cropY = Math.min(cropY, img.height - 1);
        cropWidth = Math.min(cropWidth, img.width - cropX);
        cropHeight = Math.min(cropHeight, img.height - cropY);
        
        // Validate final crop area
        if (cropWidth <= 0 || cropHeight <= 0 || cropX + cropWidth > img.width || cropY + cropHeight > img.height) {
          reject(new Error('Invalid crop coordinates: area too small or out of bounds'));
          return;
        }
        
        // Get zoom level (default to 1.0 for no zoom, or use specified zoom)
        const zoom = coordinates.zoom && coordinates.zoom > 0 ? coordinates.zoom : 1.0;
        
        // Calculate output canvas size (apply zoom by scaling the output)
        const outputWidth = Math.round(cropWidth * zoom);
        const outputHeight = Math.round(cropHeight * zoom);
        
        // Set canvas size to output dimensions
        canvas.width = outputWidth;
        canvas.height = outputHeight;
        
        // Draw the exact coordinate area, scaled to output size (zoom applied here)
        ctx.drawImage(
          img,
          cropX,           // Source X (exact coordinate)
          cropY,           // Source Y (exact coordinate)
          cropWidth,       // Source width (exact coordinate)
          cropHeight,      // Source height (exact coordinate)
          0,               // Destination X
          0,               // Destination Y
          outputWidth,     // Destination width (with zoom)
          outputHeight     // Destination height (with zoom)
        );
        
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

