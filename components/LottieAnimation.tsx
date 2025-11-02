"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(
  () => import('lottie-react'),
  { ssr: false }
);

interface LottieAnimationProps {
  src: string; // Path to the Lottie JSON file
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export function LottieAnimation({ 
  src, 
  className = "", 
  loop = true,
  autoplay = true 
}: LottieAnimationProps) {
  // Load the JSON file dynamically
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch(src)
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => {
        console.error('Error loading Lottie animation:', error);
      });
  }, [src]);

  if (!animationData) {
    return null; // or a loading spinner
  }

  return (
    <div className={className}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

