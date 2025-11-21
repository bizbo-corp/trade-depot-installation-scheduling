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

        // 1. Identify the Target Element (the tight bounding box from Gemini)
        const targetX = coordinates.x;
        const targetY = coordinates.y;
        const targetWidth = coordinates.width;
        const targetHeight = coordinates.height;
        
        // 2. Determine Zoom/Context Level
        // If zoom is specified, use it; otherwise calculate optimal zoom
        let zoom: number;
        if (coordinates.zoom && coordinates.zoom > 0 && coordinates.zoom <= 2.0) {
          zoom = coordinates.zoom;
        } else {
          zoom = calculateOptimalZoom(coordinates);
        }
        
        // Clamp zoom between 1.0 and 2.0
        zoom = Math.max(1.0, Math.min(2.0, zoom));

        // 3. Calculate Context Multiplier
        // Zoom 2.0 (High) -> Less context (tighter crop)
        // Zoom 1.0 (Low) -> More context (wider crop)
        // Formula: Multiplier ranges from ~1.5x (at zoom 2.0) to ~3.0x (at zoom 1.0)
        // This ensures we ALWAYS show some context around the element
        const contextMultiplier = 1.5 + (2.0 - zoom) * 1.5;
        
        // 4. Calculate the Expanded Crop Area (centered on the target)
        const cropWidth = Math.round(targetWidth * contextMultiplier);
        const cropHeight = Math.round(targetHeight * contextMultiplier);
        
        const centerX = targetX + targetWidth / 2;
        const centerY = targetY + targetHeight / 2;
        
        let cropX = Math.round(centerX - cropWidth / 2);
        let cropY = Math.round(centerY - cropHeight / 2);
        
        // 5. Clamp the Crop Area to Image Bounds
        // We try to keep the size but shift if possible, otherwise shrink
        
        // Shift to fit horizontally
        if (cropX < 0) cropX = 0;
        if (cropX + cropWidth > img.width) cropX = Math.max(0, img.width - cropWidth);
        
        // Shift to fit vertically
        if (cropY < 0) cropY = 0;
        if (cropY + cropHeight > img.height) cropY = Math.max(0, img.height - cropHeight);
        
        // Shrink if still too big (image is smaller than desired crop)
        const finalCropWidth = Math.min(cropWidth, img.width);
        const finalCropHeight = Math.min(cropHeight, img.height);
        
        // 6. Determine Output Size (Resolution)
        // We want a high-res output. If the crop is small, we upscale.
        // Target a minimum dimension of 800px for crisp display
        const minOutputDimension = 800;
        const scaleFactor = Math.max(1, minOutputDimension / Math.min(finalCropWidth, finalCropHeight));
        
        // Limit max scale to avoid extreme blurriness (e.g. 4x max)
        const finalScale = Math.min(scaleFactor, 4.0);
        
        const outputWidth = Math.round(finalCropWidth * finalScale);
        const outputHeight = Math.round(finalCropHeight * finalScale);
        
        // Limit maximum output size (max 2000px)
        const maxOutputSize = 2000;
        let renderWidth = outputWidth;
        let renderHeight = outputHeight;
        
        if (outputWidth > maxOutputSize || outputHeight > maxOutputSize) {
          const reduction = Math.min(maxOutputSize / outputWidth, maxOutputSize / outputHeight);
          renderWidth = Math.round(outputWidth * reduction);
          renderHeight = Math.round(outputHeight * reduction);
        }

        // Set canvas size
        canvas.width = renderWidth;
        canvas.height = renderHeight;
        
        // 7. Draw the Crop
        ctx.drawImage(
          img,
          cropX,           // Source X
          cropY,           // Source Y
          finalCropWidth,  // Source Width
          finalCropHeight, // Source Height
          0,               // Dest X
          0,               // Dest Y
          renderWidth,     // Dest Width
          renderHeight     // Dest Height
        );
        
        // 8. Add Focus Indicator
        // We need to map the target center to the new canvas coordinates
        // Relative position of target center in the crop area
        const relativeCenterX = centerX - cropX;
        const relativeCenterY = centerY - cropY;
        
        // Scale to render size
        const renderScaleX = renderWidth / finalCropWidth;
        const renderScaleY = renderHeight / finalCropHeight;
        
        const indicatorX = relativeCenterX * renderScaleX;
        const indicatorY = relativeCenterY * renderScaleY;
        
        addFocusIndicator(canvas, ctx, indicatorX, indicatorY);
        
        // Convert to base64
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
 * @returns Optimal zoom level (1.0 to 2.0)
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
    // Small elements: moderate zoom (reduced to 1.8)
    zoom = 1.8;
  } else if (avgSize < 500) {
    // Medium elements: lower zoom (reduced to 1.5)
    zoom = 1.5;
  } else {
    // Large elements: context zoom
    zoom = 1.0;
  }
  
  // Category-specific adjustments
  if (category) {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('button') || categoryLower.includes('cta') || categoryLower.includes('call to action')) {
      // Buttons: Moderate zoom for visibility (capped at 1.8)
      zoom = Math.max(zoom, 1.5);
      zoom = Math.min(zoom, 1.8);
    } else if (categoryLower.includes('text') || categoryLower.includes('readability') || categoryLower.includes('content')) {
      // Text blocks: Low-Moderate zoom
      zoom = Math.max(zoom, 1.2);
      zoom = Math.min(zoom, 1.5);
    } else if (categoryLower.includes('section') || categoryLower.includes('design') || categoryLower.includes('aesthetic')) {
      // Sections: Context zoom
      zoom = 1.0;
    }
  }
  
  // Clamp zoom between 1.0 and 2.0 (reduced from 3.0)
  return Math.max(1.0, Math.min(2.0, zoom));
}


/**
 * Adds a focus indicator (dark dot with white stroke) to a cropped image
 * @param canvas - The canvas element
 * @param ctx - The canvas 2D context
 * @param x - The X coordinate of the focus point on the canvas
 * @param y - The Y coordinate of the focus point on the canvas
 */
function addFocusIndicator(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
): void {
  // Ensure focus point is within canvas bounds (with padding)
  const safeX = Math.max(8, Math.min(canvas.width - 8, x));
  const safeY = Math.max(8, Math.min(canvas.height - 8, y));
  
  // Calculate dot size (proportional to image size, but with min/max)
  const dotSize = Math.max(12, Math.min(20, Math.round(canvas.width * 0.025)));
  const radius = dotSize / 2;
  const strokeWidth = 3;
  
  // Draw white stroke (outer circle) with shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;
  
  ctx.beginPath();
  ctx.arc(safeX, safeY, radius + strokeWidth, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  ctx.fill();
  ctx.restore();
  
  // Draw primary color dot (inner circle) with shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;
  
  ctx.beginPath();
  ctx.arc(safeX, safeY, radius, 0, 2 * Math.PI);
  // Use primary button color: #bef264
  ctx.fillStyle = '#bef264';
  ctx.fill();
  ctx.restore();
}

