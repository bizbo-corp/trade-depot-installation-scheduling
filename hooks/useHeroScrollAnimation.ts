"use client";

import { useEffect } from "react";
import { ensureGsap } from "@/lib/gsap";

export function useHeroScrollAnimation() {
  useEffect(() => {
    const { gsap, ScrollTrigger } = ensureGsap();
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const heroAccent0 = document.getElementById("hero-accent0");
      const heroAccent1 = document.getElementById("hero-accent1");
      const heroAccent2 = document.getElementById("hero-accent2");
      const heroAccent3 = document.getElementById("hero-accent3");

      if (!heroAccent0 || !heroAccent1 || !heroAccent2 || !heroAccent3) return;

      const heroScrollSection = document.getElementById("hero-scroll-section");
      if (!heroScrollSection) return;

      const container = heroAccent1.parentElement;
      if (!container) return;

      // Get actual computed sizes from elements
      const heroAccent0Rect = heroAccent0.getBoundingClientRect();
      const heroAccent1Rect = heroAccent1.getBoundingClientRect();
      const heroAccent2Rect = heroAccent2.getBoundingClientRect();
      const heroAccent3Rect = heroAccent3.getBoundingClientRect();

      const heroScrollSectionRect = heroScrollSection.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Get actual starting sizes from computed dimensions
      const actualSizes = {
        accent0: heroAccent0Rect.width, // hero-accent0
        top: heroAccent1Rect.width, // hero-accent1
        middle: heroAccent2Rect.width, // hero-accent2
        bottom: heroAccent3Rect.width, // hero-accent3
      };

      // Scale factor for final size (proportional to starting size)
      const scaleFactor = 3.2;

      // Calculate starting position: center at 50% down hero-scroll-section, 0% from right
      const heroScrollSection50Percent =
        heroScrollSectionRect.top + heroScrollSectionRect.height / 2;
      // Convert 50% of hero-scroll-section to position relative to container top
      const yPositionFromTop = heroScrollSection50Percent - containerRect.top;

      // Calculate final position: center horizontally (50% X), same Y position (50% down hero-scroll-section)
      const calculateFinalTransform = (finalSize: number) => {
        return {
          x: containerRect.width / 2 - finalSize / 2, // Center horizontally
          y: yPositionFromTop - finalSize / 2, // Same Y position as start (50% down hero-scroll-section)
        };
      };

      // Set initial positions immediately, overriding CSS bottom-0 right-0
      const elements = [
        { element: heroAccent1, size: actualSizes.top },
        { element: heroAccent2, size: actualSizes.middle },
        { element: heroAccent3, size: actualSizes.bottom },
      ];

      // hero-accent0 will be animated separately with a delay
      const heroAccent0Element = {
        element: heroAccent0,
        size: actualSizes.accent0,
      };

      elements.forEach(({ element, size }) => {
        // Override CSS positioning and set initial position
        // Position center at right edge (x = container width - half circle size)
        // Position center at 50% height of hero-scroll-section (y = yPositionFromTop - half circle size)
        gsap.set(element, {
          bottom: "auto",
          right: "auto",
          left: "auto",
          top: "auto",
          x: containerRect.width - size / 2, // Center at right edge
          y: yPositionFromTop - size / 2, // Center at 50% of hero-scroll-section height
          width: `${size}px`,
          height: `${size}px`,
          opacity: 1, // Start invisible, will fade in during final quarter
        });
      });

      // Set initial position for hero-accent0
      gsap.set(heroAccent0Element.element, {
        bottom: "auto",
        right: "auto",
        left: "auto",
        top: "auto",
        x: containerRect.width - heroAccent0Element.size / 2, // Center at right edge
        y: yPositionFromTop - heroAccent0Element.size / 2, // Center at 50% of hero-scroll-section height
        width: `${heroAccent0Element.size}px`,
        height: `${heroAccent0Element.size}px`,
      });

      // Calculate scroll end point: 50% of hero-scroll-section height
      const scrollEndDistance = heroScrollSectionRect.height * 0.5;

      // Create timeline with ScrollTrigger
      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: heroScrollSection,
          start: "top+=250 top", // When top of hero-scroll-section hits top of viewport + 150px delay
          end: `+=${scrollEndDistance}`, // End after scrolling 50% of hero-scroll-section height
          scrub: true, // Tie animation progress to scroll position
        },
      });

      // Animate all three circles (no stagger, all animate together)
      elements.forEach(({ element, size }) => {
        const finalSize = size * scaleFactor;
        const finalPos = calculateFinalTransform(finalSize);

        timeline.fromTo(
          element,
          {
            // Start: right edge, 50% down hero-scroll-section (already set with gsap.set)
            x: containerRect.width - size / 2,
            y: yPositionFromTop - size / 2,
            width: `${size}px`,
            height: `${size}px`,
          },
          {
            // End: center horizontally (50% X), same Y position (50% down hero-scroll-section), scaled proportionally
            x: finalPos.x,
            y: finalPos.y,
            width: `${finalSize}px`,
            height: `${finalSize}px`,
            ease: "power2.out",
          },
          0 // All animations start at the same time
        );
      });

      // Animate hero-accent0 with a staggered delay after the other circles start
      const scaleFactor0 = scaleFactor * 8; // 4x the scale factor of other circles
      const finalSize0 = heroAccent0Element.size * scaleFactor0;
      const finalPos0 = calculateFinalTransform(finalSize0);
      const staggerDelay = 0.02; // Delay in timeline (20% of scroll distance)

      timeline.fromTo(
        heroAccent0Element.element,
        {
          // Start: right edge, 50% down hero-scroll-section (already set with gsap.set)
          x: containerRect.width - heroAccent0Element.size / 2,
          y: yPositionFromTop - heroAccent0Element.size / 2,
          width: `${heroAccent0Element.size}px`,
          height: `${heroAccent0Element.size}px`,
        },
        {
          // End: center horizontally (50% X), same Y position (50% down hero-scroll-section), scaled proportionally
          x: finalPos0.x,
          y: finalPos0.y,
          width: `${finalSize0}px`,
          height: `${finalSize0}px`,
          ease: "power2.out",
        },
        staggerDelay // Start after other circles have begun moving
      );

      // Animate all hero accent circles to scale down, move to 0,0, and fade out
      // Starting at 25% of timeline (last three-quarters)
      const allHeroAccents = [
        {
          element: heroAccent0,
          originalWidth: heroAccent0Rect.width,
          originalHeight: heroAccent0Rect.height,
        },
        {
          element: heroAccent1,
          originalWidth: heroAccent1Rect.width,
          originalHeight: heroAccent1Rect.height,
        },
        {
          element: heroAccent2,
          originalWidth: heroAccent2Rect.width,
          originalHeight: heroAccent2Rect.height,
        },
        {
          element: heroAccent3,
          originalWidth: heroAccent3Rect.width,
          originalHeight: heroAccent3Rect.height,
        },
      ];

      allHeroAccents.forEach(({ element, originalWidth, originalHeight }) => {
        // Scale down, move to 0,0 (top-left of browser), and fade out from 25% to 100% of timeline
        // Since GSAP x/y are relative to element center, we need to offset by half the size
        // to position the top-left corner at 0,0
        timeline.to(
          element,
          {
            x: originalWidth / 2, // Move center to left edge + half width (so left edge is at 0)
            y: originalHeight / 2, // Move center to top edge + half height (so top edge is at 0)
            width: `${originalWidth}px`, // Scale back to original width
            height: `${originalHeight}px`, // Scale back to original height
            opacity: 0, // Fade out
            ease: "power2.in",
          },
          0.25 // Start at 25% of timeline (last three-quarters)
        );
      });

      // Animate desktop and mobile app images off screen
      // Create a separate ScrollTrigger that starts earlier and keeps them pinned to bottom
      const desktopAppImage = document.getElementById("desktop-app-image");
      const mobileAppImage = document.getElementById("mobile-app-image");

      if (desktopAppImage && mobileAppImage) {
        // Ensure they're fixed to bottom of viewport
        gsap.set([desktopAppImage, mobileAppImage], {
          position: "fixed",
          bottom: 0,
          x: 0,
          opacity: 1,
        });

        // Get the bounding rects to calculate how far to move them off screen
        const desktopRect = desktopAppImage.getBoundingClientRect();
        const mobileRect = mobileAppImage.getBoundingClientRect();

        // Calculate the distance needed to move them completely off screen to the right
        const desktopOffScreenDistance = desktopRect.width + 100; // Extra padding to ensure it's off screen
        const mobileOffScreenDistance = mobileRect.width + 100;

        // Create a separate timeline with earlier start point
        const imageTimeline = gsap.timeline({
          defaults: { ease: "power2.in" },
          scrollTrigger: {
            trigger: heroScrollSection,
            start: "top top", // Start immediately when hero section enters viewport (earlier than main timeline)
            end: `+=${heroScrollSectionRect.height * 0.2}`, // End after 40% of hero section height
            scrub: true, // Tie animation progress to scroll position
          },
        });

        // Animate both images to slide off screen to the right while staying pinned to bottom
        imageTimeline.to(
          desktopAppImage,
          {
            x: desktopOffScreenDistance, // Move to the right off screen
            opacity: 0, // Fade out as they move
            ease: "power2.in",
          },
          0
        );

        imageTimeline.to(
          mobileAppImage,
          {
            x: mobileOffScreenDistance, // Move to the right off screen
            opacity: 0, // Fade out as they move
            ease: "power2.in",
          },
          0 // Start at same time as desktop
        );
      }

      // Animate ValuePropositionSection fade-in, pause, and fade-out
      const valuePropSection = document.getElementById("value-prop-section");
      if (valuePropSection) {
        // Set initial state: invisible and fixed
        gsap.set(valuePropSection, {
          opacity: 0,
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1,
        });

        // Fade in from 30% to 40% of timeline (10% scroll distance)
        timeline.fromTo(
          valuePropSection,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            ease: "power2.out",
            duration: 0.1, // 10% of timeline duration
          },
          0.15 // Start fade-in at 30% of timeline
        );

        // Hold at full opacity (pause) from 25% to 85% of timeline
        // This happens automatically as there's no animation between fade-in and fade-out

        // Fade out from 85% to 95% of timeline (10% scroll distance)
        timeline.to(
          valuePropSection,
          {
            opacity: 0,
            ease: "power2.in",
            duration: 0.1, // 10% of timeline duration
          },
          0.75 // Start fade-out at 85% of timeline
        );

        // Animate z-index from 1 at 5% to 2010 at 25% of timeline
        timeline.fromTo(
          valuePropSection,
          {
            zIndex: 1,
          },
          {
            zIndex: 2010,
            ease: "linear",
            duration: 0.2, // Duration of 20% (from 5% to 25%)
            visibility: "show",
          },
          0.05 // Start at 5% of the timeline
        );

        // Return z-index back to -1 when fade-out starts (at 85% of timeline)
        timeline.to(
          valuePropSection,
          {
            zIndex: -1,
            ease: "linear",
            duration: 0.1, // Same duration as fade-out
            visibility: "hidden",
          },
          0.85 // Start when fade-out begins
        );
      }
    });

    return () => {
      context.revert();
    };
  }, []);
}
