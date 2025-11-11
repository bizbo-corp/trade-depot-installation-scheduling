'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';
import { ensureGsap } from '@/lib/gsap';

const CIRCLE_ART = '/svg/circles.svg';

export function HeroScrollSection() {
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

    const createAnimation = () => {
      const timelineRef = { current: undefined as gsap.core.Timeline | undefined };

      const setInitialTransform = () => {
        const rect = placeholder.getBoundingClientRect();
        const scaleX = rect.width / window.innerWidth;
        const scaleY = rect.height / window.innerHeight;

        gsap.set(floatingPanel, {
          position: 'fixed',
          inset: 0,
          transformOrigin: 'top left',
          x: rect.left,
          y: rect.top,
          scaleX,
          scaleY,
          borderRadius: 48,
          opacity: 0,
        });

        gsap.set(art, { scale: 1, xPercent: 0, yPercent: 12 });
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

      mm.add('(min-width: 1024px)', () => {
        setInitialTransform();

        const timeline = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            id: 'hero-floating-panel',
            trigger: section,
            start: 'top top',
            end: '+=220%',
            scrub: true,
          },
        });

        timelineRef.current = timeline;

        timeline
          .to(
            floatingPanel,
            {
              opacity: 1,
              duration: 0.25,
            },
            0,
          )
          .to(
            floatingPanel,
            {
              x: 0,
              y: 0,
              scaleX: 1.025,
              scaleY: 1.025,
              borderRadius: 0,
              duration: 1.1,
            },
            0,
          )
          .to(
            art,
            {
              scale: 1.55,
              xPercent: -26,
              yPercent: -18,
              duration: 1.1,
            },
            0,
          )
          .to(
            floatingPanel,
            {
              opacity: 0,
              duration: 0.4,
            },
            0.95,
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
        };
      });

      return () => {
        mm.revert();
      };
    };

    const cleanup = createAnimation();

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-visible bg-background text-foreground"
      aria-label="Bizbo venture studio hero"
    >
      <div className="container relative mx-auto px-4 pb-36 pt-32 md:px-6 lg:pb-48">
        <div className="relative grid gap-16 lg:grid-cols-[minmax(0,520px)_1fr] lg:items-end">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
              <span className="w-fit rounded-full border border-foreground/15 px-5 py-2 text-xs font-medium uppercase tracking-[0.32em] text-muted-foreground">
                Product venture studio
              </span>
              <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-[3.5rem]">
                Building digital ventures that move from idea to traction faster.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Bizbo partners with founders and product leaders to chart strategy, design distinctive brands,
                and engineer resilient products. Every sprint blends insight, aesthetics, and technology to
                accelerate what your customers feel next.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-[999px] bg-foreground px-8 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
                >
                  Start a venture project
                </a>
                <a
                  href="#case-studies"
                  className="inline-flex items-center justify-center rounded-[999px] border border-foreground/20 px-8 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/40 hover:text-foreground"
                >
                  Explore recent wins
                </a>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-lime-500" />
                  Product-market validation
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Brand & experience systems
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                  Full-stack engineering pods
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-foreground/10 bg-card/60 p-6 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Acceleration
                </p>
                <p className="mt-3 text-2xl font-semibold text-foreground">12-week launch playbook</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Turn concepts into live pilots with joined-up strategy, brand, and product squads.
                </p>
              </div>
              <div className="rounded-3xl border border-foreground/10 bg-card/60 p-6 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Venture impact
                </p>
                <p className="mt-3 text-2xl font-semibold text-foreground">4.6× faster validation</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Align leadership around clear evidence, prioritised roadmaps, and measurable next moves.
                </p>
              </div>
            </div>
          </div>

          <div className="relative -mx-4 flex justify-center lg:mx-0 lg:block">
          <div className="relative mx-auto aspect-4/5 w-full max-w-[420px] overflow-hidden rounded-[44px] bg-[#d4f27a] shadow-[0_30px_80px_-40px_rgba(50,100,12,0.4)] lg:hidden">
              <Image src={CIRCLE_ART} alt="Concentric circles" fill priority className="object-cover object-bottom" />
              <div className="absolute inset-x-8 bottom-8 rounded-[32px] bg-white/70 p-5 text-sm font-medium text-neutral-700 backdrop-blur">
                Venture snapshots — Impact layered by experimentation, design, and code.
              </div>
            </div>

            <div className="relative hidden w-full lg:block">
              <div
                ref={placeholderRef}
                className="pointer-events-none absolute bottom-0 right-[clamp(1.5rem,5vw,5.5rem)] aspect-4/5 w-[min(42vw,520px)] overflow-hidden rounded-[48px] bg-linear-to-br from-[#d1f07a] via-[#c2ed6b] to-[#9fcf4d] shadow-[0_40px_120px_-48px_rgba(65,119,8,0.45)]"
                aria-hidden="true"
              >
                <div className="absolute inset-0">
                  <Image src={CIRCLE_ART} alt="Concentric circles" fill priority className="object-cover object-bottom" />
                </div>
                <div className="absolute left-8 top-8 rounded-full border border-black/10 bg-black/8 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-black/70">
                  Venture lab
                </div>
                <div className="absolute inset-x-8 bottom-8 rounded-[34px] bg-white/75 p-6 text-sm text-neutral-700 backdrop-blur">
                  <p className="font-semibold text-neutral-900">Immersive delivery</p>
                  <p className="mt-2 leading-relaxed">
                    Strategy, brand, product, and engineering flying in formation to unlock momentum.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={floatingPanelRef}
        className="pointer-events-none fixed inset-0 z-30 hidden select-none items-center justify-end lg:flex"
      >
        <div className="relative aspect-4/5 max-w-[760px] flex-1 overflow-hidden rounded-[48px] bg-linear-to-br from-[#d1f07a] via-[#c2ed6b] to-[#9fcf4d] shadow-[0_48px_200px_-60px_rgba(65,119,8,0.52)]">
          <div ref={artRef} className="absolute inset-0">
            <Image src={CIRCLE_ART} alt="Expanding concentric circles" fill priority className="object-cover object-bottom" />
          </div>
        </div>
      </div>
    </section>
  );
}

