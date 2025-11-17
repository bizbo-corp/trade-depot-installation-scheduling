'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';
import { ensureGsap } from '@/lib/gsap';

const CIRCLE_ART = '/svg/circles.svg';

export function HeroCircleScrollSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const floatingPanelRef = useRef<HTMLDivElement | null>(null);
  const artRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const placeholder = placeholderRef.current;
    const floatingPanel = floatingPanelRef.current;
    const art = artRef.current;

    if (!section || !placeholder || !floatingPanel || !art) {
      return;
    }

    const { gsap, ScrollTrigger } = ensureGsap();
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const timelineRef = { current: undefined as gsap.core.Timeline | undefined };

      const setInitialTransform = () => {
        const rect = placeholder.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        gsap.set(floatingPanel, {
          position: 'fixed',
          inset: 0,
          transformOrigin: 'top left',
          x: rect.left,
          y: rect.top,
          scaleX: rect.width / vw,
          scaleY: rect.height / vh,
          borderRadius: 48,
          opacity: 0,
          filter: 'none',
        });

        gsap.set(art, { scale: 1, xPercent: 0, yPercent: 15 });
      };

      const handleResize = () => {
        const trigger = timelineRef.current?.scrollTrigger;
        const progress = trigger?.progress ?? 0;

        setInitialTransform();
        trigger?.refresh();

        if (timelineRef.current) {
          timelineRef.current.progress(progress);
        }
      };

      setInitialTransform();

      const timeline = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          id: 'hero-circle-scroll',
          trigger: section,
          start: 'top top',
          end: '+=230%',
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      timelineRef.current = timeline;

      timeline
        .to(
          placeholder,
          {
            opacity: 0,
            duration: 0.2,
          },
          0,
        )
        .to(
          floatingPanel,
          {
            opacity: 1,
            duration: 0.3,
          },
          0,
        )
        .to(
          floatingPanel,
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            borderRadius: 0,
            duration: 1.2,
          },
          0,
        )
        .to(
          art,
          {
            scale: 1.35,
            xPercent: -24,
            yPercent: -12,
            duration: 1.2,
          },
          0,
        )
        .to(
          art,
          {
            scale: 2.8,
            xPercent: -34,
            yPercent: -32,
            duration: 1.2,
          },
          0.95,
        )
        .to(
          floatingPanel,
          {
            filter: 'brightness(0.92)',
            duration: 1.05,
          },
          0.95,
        )
        .to(
          floatingPanel,
          {
            opacity: 0,
            duration: 0.4,
          },
          2.05,
        );

      window.addEventListener('resize', handleResize);
      ScrollTrigger.addEventListener('refreshInit', setInitialTransform);

      return () => {
        window.removeEventListener('resize', handleResize);
        ScrollTrigger.removeEventListener('refreshInit', setInitialTransform);
        timeline.scrollTrigger?.kill();
        timeline.kill();
        timelineRef.current = undefined;
        gsap.set(floatingPanel, { clearProps: 'all' });
        gsap.set(art, { clearProps: 'all' });
        gsap.set(placeholder, { clearProps: 'opacity' });
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-visible bg-background text-foreground"
      aria-label="Bizbo hero"
    >
      <div className="container relative mx-auto flex min-h-screen flex-col justify-center gap-16 px-4 py-24 md:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,520px)_1fr]">
          <div className="relative z-20 max-w-xl lg:max-w-none">
          </div>

          <div className="relative hidden justify-end lg:flex">

          </div>
        </div>

        <div className="relative mt-6 flex justify-center lg:hidden">
          <div className="relative aspect-[4/5] w-full max-w-1/2 rounded-[40px] border border-foreground/10 bg-red-500/50">
          <Image src={CIRCLE_ART} alt="Expanding concentric circles" fill priority className="object-cover object-left" />
          </div>
        </div>
      </div>

      <div
        ref={floatingPanelRef}
        className="pointer-events-none fixed inset-0 z-0 hidden select-none items-center justify-end lg:flex"
        aria-hidden="true"
      >
        <div className="relative flex aspect-[4/5] w-full right-0 flex-1 rounded-[64px] bg-amber-500/50">
          <div ref={artRef} className="absolute inset-0">
            <Image src={CIRCLE_ART} alt="Expanding concentric circles" fill priority className="object-cover object-left" />
          </div>
        </div>
      </div>
    </section>
  );
}


