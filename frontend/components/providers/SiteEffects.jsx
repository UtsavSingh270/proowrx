'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function SmoothScroll() {
  const pathname = usePathname();
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    let frameId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [pathname]);
  return null;
}

function GlobalReveal() {
  const pathname = usePathname();
  useEffect(() => {
    const selector = '.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible), .reveal-scale:not(.visible), .site-reveal:not(.visible)';
    const automaticTargets = '.section > .container, section[class*="-section"] > .container, .cta-banner-inner, .contact-strip > .container, .ds-trust-band > .container';
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: '0px 0px -30px 0px' }
    );

    function observeReveals(root = document) {
      const targets = [];
      if (root instanceof Element && root.matches(automaticTargets)) targets.push(root);
      root.querySelectorAll?.(automaticTargets).forEach(element => targets.push(element));
      targets.forEach(element => {
        if (element.matches('.post-layout')) return;
        if (!element.matches('[class*="reveal"]') && !element.querySelector('.reveal, .reveal-left, .reveal-right, .reveal-scale')) {
          element.classList.add('site-reveal');
        }
      });
      if (root instanceof Element && root.matches(selector)) obs.observe(root);
      root.querySelectorAll?.(selector).forEach(element => obs.observe(element));
    }

    // Wait until the routed server segment has hydrated before adding classes.
    // Observing streamed mutations here can alter SSR markup before React claims it.
    const timerId = window.setTimeout(observeReveals, 700);

    return () => {
      window.clearTimeout(timerId);
      obs.disconnect();
    };
  }, [pathname]);
  return null;
}

/* Mounted once in the (marketing) layout — Lenis smooth scroll, scroll-to-top
   on route change, and the IntersectionObserver-driven .reveal animations
   used throughout every page. Not mounted on /dashboard. */
export default function SiteEffects() {
  return (
    <>
      <SmoothScroll />
      <ScrollToTop />
      <GlobalReveal />
    </>
  );
}
