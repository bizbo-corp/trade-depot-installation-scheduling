"use client";

import React, { useEffect, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ImageCoordinates } from "@/types/ux-analysis";
import { cropImage } from "@/lib/image-crop";
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

  useEffect(() => {
    if (!coordinates || !screenshot) {
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

    setIsLoading(true);
    setError(null);

    cropImage(screenshot, coordinates)
      .then((cropped) => {
        setCroppedImage(cropped);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(`Failed to crop image for Quick Win ${index + 1}:`, err);
        setError(err instanceof Error ? err.message : "Failed to crop image");
        setIsLoading(false);
        setCroppedImage(null);
      });
  }, [coordinates, screenshot, index]);

  return (
    <Card className={cn("w-full bg-foreground/10 py-6 shadow-none border-0")}>
      <CardContent className="p-0">
        <div className={cn(proseClasses, "w-full bg-foreground/0 py-6 shadow-none border-0 mx-auto text-foreground")}>
          {/* Display cropped image if coordinates are available */}
          {coordinates && (
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

