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
      coordinates.height <= 0
    ) {
      setError("Invalid coordinates: missing or invalid values");
      setIsLoading(false);
      return;
    }

    // Get image dimensions to validate coordinate size
    const img = new Image();
    img.onload = () => {
      // Check if coordinates are too large (likely not specific enough)
      if (isCoordinateAreaTooLarge(coordinates, img.width, img.height)) {
        console.warn(`Quick Win ${index + 1}: Coordinates cover >80% of image, may not be specific enough`);
        // Still try to crop, but log warning
      }
      
      // Check if coordinates are too small
      if (isCoordinateAreaTooSmall(coordinates)) {
        console.warn(`Quick Win ${index + 1}: Coordinates are very small (<50px), may be invalid`);
      }

      setIsLoading(true);
      setError(null);

      cropImage(screenshot, coordinates)
        .then((cropped) => {
          // Check if cropped image is mostly blank/white
          checkImageQuality(cropped)
            .then((isBlank) => {
              if (isBlank) {
                console.warn(`Quick Win ${index + 1}: Cropped image appears to be mostly blank`);
                setError("Cropped area appears to be blank or invalid");
                setCroppedImage(null);
              } else {
                setCroppedImage(cropped);
              }
              setIsLoading(false);
            })
            .catch(() => {
              // If quality check fails, still show the image
              setCroppedImage(cropped);
              setIsLoading(false);
            });
        })
        .catch((err) => {
          console.error(`Failed to crop image for Quick Win ${index + 1}:`, err);
          setError(err instanceof Error ? err.message : "Failed to crop image");
          setIsLoading(false);
          setCroppedImage(null);
        });
    };
    
    img.onerror = () => {
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
          let whitePixels = 0;
          const sampleSize = Math.min(1000, pixels.length / 4); // Sample up to 1000 pixels
          const step = Math.floor((pixels.length / 4) / sampleSize);
          
          for (let i = 0; i < pixels.length; i += step * 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            // Check if pixel is white or very light (RGB > 240)
            if (r > 240 && g > 240 && b > 240) {
              whitePixels++;
            }
          }
          
          const whitePercentage = whitePixels / sampleSize;
          // If more than 80% of sampled pixels are white, consider it blank
          resolve(whitePercentage > 0.8);
        } catch {
          resolve(false);
        }
      };
      
      img.onerror = () => resolve(false);
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

