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
  scaleToFit?: boolean;
}

export function LottieAnimation({ 
  src, 
  className = "", 
  loop = true,
  autoplay = true,
  scaleToFit = false 
}: LottieAnimationProps) {
  // Load the JSON file dynamically
  const [animationData, setAnimationData] = useState<any>(null);
  const [scale, setScale] = useState(1);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch(src)
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => {
        console.error('Error loading Lottie animation:', error);
      });
  }, [src]);

  // Handle scaling when scaleToFit is enabled
  useEffect(() => {
    if (!scaleToFit || !ref) return;

    const calculateScale = () => {
      const section = ref.closest('section');
      if (!section) return;

      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      if (sectionHeight > viewportHeight) {
        const scaleFactor = viewportHeight / sectionHeight;
        setScale(scaleFactor);
      } else {
        setScale(1);
      }
    };

    // Calculate on mount and resize
    calculateScale();
    window.addEventListener('resize', calculateScale);

    return () => window.removeEventListener('resize', calculateScale);
  }, [scaleToFit, ref, animationData]);

  if (!animationData) {
    return null; // or a loading spinner
  }

  return (
    <div 
      ref={setRef}
      className={className}
      style={scaleToFit && scale !== 1 ? { transform: `scale(${scale})`, transformOrigin: 'top left' } : undefined}
    >
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

