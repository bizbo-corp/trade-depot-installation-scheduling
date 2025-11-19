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
        let validCoordinates = { ...coordinates };
        
        if (
          coordinates.x < 0 ||
          coordinates.y < 0 ||
          coordinates.width <= 0 ||
          coordinates.height <= 0 ||
          coordinates.x + coordinates.width > img.width ||
          coordinates.y + coordinates.height > img.height
        ) {
          // If coordinates are out of bounds, clamp them to image bounds
          const clampedX = Math.max(0, Math.min(coordinates.x, img.width - 1));
          const clampedY = Math.max(0, Math.min(coordinates.y, img.height - 1));
          const clampedWidth = Math.min(coordinates.width, img.width - clampedX);
          const clampedHeight = Math.min(coordinates.height, img.height - clampedY);
          
          if (clampedWidth <= 0 || clampedHeight <= 0) {
            reject(new Error('Invalid crop coordinates: area too small or out of bounds'));
            return;
          }
          
          // Use clamped coordinates
          validCoordinates = {
            ...coordinates,
            x: clampedX,
            y: clampedY,
            width: clampedWidth,
            height: clampedHeight,
          };
        }
        
        // Calculate actual crop dimensions based on zoom
        const zoom = validCoordinates.zoom && validCoordinates.zoom > 0 ? validCoordinates.zoom : 1.5;
        const cropWidth = validCoordinates.width / zoom;
        const cropHeight = validCoordinates.height / zoom;
        
        // Calculate center point of the crop area
        const centerX = validCoordinates.x + validCoordinates.width / 2;
        const centerY = validCoordinates.y + validCoordinates.height / 2;
        
        // Calculate new crop coordinates (centered on the original area)
        const cropX = Math.max(0, centerX - cropWidth / 2);
        const cropY = Math.max(0, centerY - cropHeight / 2);
        
        // Ensure crop area doesn't exceed image bounds
        const finalCropX = Math.min(cropX, img.width - cropWidth);
        const finalCropY = Math.min(cropY, img.height - cropHeight);
        const finalCropWidth = Math.min(cropWidth, img.width - finalCropX);
        const finalCropHeight = Math.min(cropHeight, img.height - finalCropY);
        
        // Final validation
        if (
          finalCropX < 0 ||
          finalCropY < 0 ||
          finalCropWidth <= 0 ||
          finalCropHeight <= 0 ||
          finalCropX + finalCropWidth > img.width ||
          finalCropY + finalCropHeight > img.height
        ) {
          reject(new Error('Invalid crop coordinates: calculated area out of bounds'));
          return;
        }
        
        // Set canvas size to the desired output size (with zoom applied)
        canvas.width = validCoordinates.width;
        canvas.height = validCoordinates.height;
        
        // Draw the cropped and zoomed portion of the image
        ctx.drawImage(
          img,
          finalCropX,
          finalCropY,
          finalCropWidth,
          finalCropHeight,
          0,
          0,
          canvas.width,
          canvas.height
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

