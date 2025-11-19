"use client";

import React, { useEffect, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ImageCoordinates } from "@/types/ux-analysis";
import { cropImage, isCoordinateAreaTooLarge, isCoordinateAreaTooSmall } from "@/lib/image-crop";
import { createMarkdownComponents } from "@/lib/markdown-components";

interface QuickWinCardProps {
  content: string;
  coordinates: ImageCoordinates | null;
  screenshot: string;
  proseClasses: string;
  index: number;
}

export function QuickWinCard({
  content,
  coordinates,
  screenshot,
  proseClasses,
  index,
}: QuickWinCardProps) {
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Create markdown components instance
  const markdownComponents = useMemo(() => createMarkdownComponents(), []);

  // Check if image should be shown
  const shouldShowImage = coordinates && coordinates.relevant !== false;

  useEffect(() => {
    if (!coordinates || !screenshot || coordinates.relevant === false) {
      setCroppedImage(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    // Validate coordinates have required fields
    if (
      typeof coordinates.x !== 'number' ||
      typeof coordinates.y !== 'number' ||
      typeof coordinates.width !== 'number' ||
      typeof coordinates.height !== 'number' ||
      coordinates.width <= 0 ||
      coordinates.height <= 0 ||
      coordinates.x < 0 ||
      coordinates.y < 0
    ) {
      console.warn(`Quick Win ${index + 1}: Invalid coordinates structure:`, coordinates);
      setError("Invalid coordinates: missing or invalid values");
      setIsLoading(false);
      return;
    }

    // Get image dimensions to validate coordinate size
    const img = new Image();
    img.onload = () => {
      // Validate coordinates are within image bounds
      if (coordinates.x >= img.width || coordinates.y >= img.height) {
        console.warn(`Quick Win ${index + 1}: Coordinates (${coordinates.x}, ${coordinates.y}) exceed image bounds (${img.width}, ${img.height})`);
        setError("Coordinates are outside image bounds");
        setIsLoading(false);
        return;
      }
      
      // Check if coordinates extend beyond image bounds
      if (coordinates.x + coordinates.width > img.width || coordinates.y + coordinates.height > img.height) {
        console.warn(`Quick Win ${index + 1}: Coordinates extend beyond image bounds. Clamping will be applied.`);
      }
      
      // Check if coordinates are too large (likely not specific enough)
      if (isCoordinateAreaTooLarge(coordinates, img.width, img.height)) {
        console.warn(`Quick Win ${index + 1}: Coordinates cover >80% of image (${Math.round((coordinates.width * coordinates.height) / (img.width * img.height) * 100)}%), may not be specific enough`);
        // Still try to crop, but log warning
      }
      
      // Check if coordinates are too small
      if (isCoordinateAreaTooSmall(coordinates)) {
        console.warn(`Quick Win ${index + 1}: Coordinates are very small (${coordinates.width}x${coordinates.height}px), may be invalid`);
        // Still try to crop, but log warning
      }

      setIsLoading(true);
      setError(null);

      cropImage(screenshot, coordinates)
        .then((cropped) => {
          // Check if cropped image is mostly blank/white
          checkImageQuality(cropped)
            .then((isBlank) => {
              if (isBlank) {
                console.warn(`Quick Win ${index + 1}: Cropped image appears to be mostly blank/white`);
                setError("Cropped area appears to be blank or invalid");
                setCroppedImage(null);
              } else {
                setCroppedImage(cropped);
              }
              setIsLoading(false);
            })
            .catch((qualityError) => {
              // If quality check fails, still show the image but log the error
              console.warn(`Quick Win ${index + 1}: Image quality check failed:`, qualityError);
              setCroppedImage(cropped);
              setIsLoading(false);
            });
        })
        .catch((err) => {
          console.error(`Failed to crop image for Quick Win ${index + 1}:`, err);
          const errorMessage = err instanceof Error ? err.message : "Failed to crop image";
          setError(errorMessage);
          setIsLoading(false);
          setCroppedImage(null);
        });
    };
    
    img.onerror = () => {
      console.error(`Quick Win ${index + 1}: Failed to load source image for validation`);
      setError("Failed to load source image for validation");
      setIsLoading(false);
    };
    
    img.src = screenshot;
  }, [coordinates, screenshot, index]);

  // Helper function to check if image is mostly blank/white
  const checkImageQuality = async (imageDataUrl: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(false);
            return;
          }
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // Sample pixels to check if image is mostly white/blank
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          
          // Sample more pixels for better accuracy (up to 5000 pixels or all pixels if image is small)
          const totalPixels = pixels.length / 4;
          const sampleSize = Math.min(5000, totalPixels);
          const step = Math.max(1, Math.floor(totalPixels / sampleSize));
          
          let whitePixels = 0;
          let veryLightPixels = 0;
          let darkPixels = 0;
          let sampledCount = 0;
          
          // Sample pixels in a grid pattern for better coverage
          for (let i = 0; i < pixels.length && sampledCount < sampleSize; i += step * 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            
            // Skip transparent pixels
            if (a < 128) {
              continue;
            }
            
            sampledCount++;
            
            // Check if pixel is pure white (RGB > 250)
            if (r > 250 && g > 250 && b > 250) {
              whitePixels++;
            }
            // Check if pixel is very light (RGB > 240)
            else if (r > 240 && g > 240 && b > 240) {
              veryLightPixels++;
            }
            // Check if pixel has significant content (RGB < 200)
            else if (r < 200 || g < 200 || b < 200) {
              darkPixels++;
            }
          }
          
          if (sampledCount === 0) {
            // If we couldn't sample any pixels, assume it's blank
            resolve(true);
            return;
          }
          
          const whitePercentage = whitePixels / sampledCount;
          const veryLightPercentage = (whitePixels + veryLightPixels) / sampledCount;
          const darkPercentage = darkPixels / sampledCount;
          
          // Consider it blank if:
          // 1. More than 85% pure white pixels, OR
          // 2. More than 90% very light pixels AND less than 5% dark pixels (indicating mostly blank with minimal content)
          const isBlank = whitePercentage > 0.85 || (veryLightPercentage > 0.9 && darkPercentage < 0.05);
          
          if (isBlank) {
            console.warn(`Quick Win ${index + 1}: Image quality check - White: ${Math.round(whitePercentage * 100)}%, Very Light: ${Math.round(veryLightPercentage * 100)}%, Dark: ${Math.round(darkPercentage * 100)}%`);
          }
          
          resolve(isBlank);
        } catch (error) {
          console.warn(`Quick Win ${index + 1}: Error during image quality check:`, error);
          resolve(false);
        }
      };
      
      img.onerror = () => {
        console.warn(`Quick Win ${index + 1}: Failed to load image for quality check`);
        resolve(false);
      };
      img.src = imageDataUrl;
    });
  };

  return (
    <Card className={cn("w-full bg-foreground/10 py-6 shadow-none border-0")}>
      <CardContent className="p-0">
        <div className={cn(proseClasses, "w-full bg-foreground/0 py-6 shadow-none border-0 mx-auto text-foreground")}>
          {/* Display cropped image only if coordinates are available and relevant */}
          {shouldShowImage && (
            <div className="mb-6 rounded-lg overflow-hidden border border-foreground/20 bg-muted/30">
              {isLoading && (
                <div className="w-full h-64 bg-muted animate-pulse flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Loading cropped image...</span>
                </div>
              )}
              {error && !isLoading && (
                <div className="w-full h-48 bg-muted/50 flex items-center justify-center p-4">
                  <span className="text-muted-foreground text-sm text-center">
                    Image unavailable: {error}
                  </span>
                </div>
              )}
              {croppedImage && !isLoading && !error && (
                <div className="relative w-full">
                  <img
                    src={croppedImage}
                    alt={`Quick Win ${index + 1} focus area`}
                    className="w-full h-auto object-contain"
                    onError={() => {
                      setError("Failed to load cropped image");
                      setCroppedImage(null);
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Render markdown content */}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}

