'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let isRegistered = false;

export function ensureGsap() {
  if (!isRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    isRegistered = true;
  }

  return { gsap, ScrollTrigger };
}

export type GsapBundle = ReturnType<typeof ensureGsap>;



