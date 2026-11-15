import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Smooth, weighted scrolling with Lenis, driven by GSAP's clock so the
// scroll animations (siteMotion.js) stay perfectly in step with it.
// Touch screens keep their own native scrolling, and visitors who ask
// for less motion get normal scrolling. Every scroll the site makes in
// code goes through the helpers below.

let lenis = null;

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return () => {};

  lenis = new Lenis({
    autoRaf: false,
    lerp: 0.1,
    // Let lists inside the page (country picker, mobile menu) scroll themselves
    allowNestedScroll: true,
  });

  lenis.on('scroll', ScrollTrigger.update);
  if (import.meta.env.DEV) window.__lenis = lenis;

  // Measure the page again whenever GSAP does (new page, photos or fonts loaded)
  const remeasure = () => lenis?.resize();
  ScrollTrigger.addEventListener('refreshInit', remeasure);
  const tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  // The mobile menu and the photo viewer lock the page while open
  const syncLock = () => {
    if (document.body.style.overflow === 'hidden') lenis.stop();
    else lenis.start();
  };
  const observer = new MutationObserver(syncLock);
  observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });

  return () => {
    observer.disconnect();
    ScrollTrigger.removeEventListener('refreshInit', remeasure);
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
  };
}

// Scroll the page to a position (in pixels from the top)
export function scrollToY(top, { immediate = false } = {}) {
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(top, { immediate, force: true });
  } else {
    window.scrollTo({ top, behavior: immediate || prefersReducedMotion() ? 'instant' : 'smooth' });
  }
}

// Glide to an element, below the navbar ('start') or in the middle ('center')
export function scrollToElement(element, { block = 'start' } = {}) {
  if (!element) return;

  if (lenis) {
    // Photos may have changed the page height since Lenis last measured it
    lenis.resize();
    // Lenis leaves room for the navbar using the page's scroll-padding
    // (index.css) and any scroll-margin, as the browser itself would.
    // Centring takes that room back so the element sits mid-screen.
    let offset = 0;
    if (block === 'center') {
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const margin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
      offset = padding + margin - (window.innerHeight - element.getBoundingClientRect().height) / 2;
    }
    lenis.scrollTo(element, { offset, force: true });
  } else {
    element.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block });
  }
}
