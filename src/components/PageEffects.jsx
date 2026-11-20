
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { startPageMotion } from './siteMotion.js';
import { scrollToElement, scrollToY, startSmoothScroll } from './smoothScroll.js';

// Site-wide motion and navigation behaviour, run on every route change:
// - start each new page at the top (or glide to the #section in the link)
// - glide back to the top when a link points to the page already open
// - smooth scrolling with Lenis (see smoothScroll.js)
// - start the page's GSAP motion (see siteMotion.js)

function scrollToTarget(hash) {
  if (!hash) {
    scrollToY(0, { immediate: true });
    return;
  }

  // Pages that load on their own (like Donate) may not have drawn the
  // section yet, so look for it a few times. A short wait also lets photos
  // above it take their size, so the scroll doesn't stop short.
  const id = decodeURIComponent(hash.slice(1));
  let tries = 0;
  const attempt = () => {
    const target = document.getElementById(id);
    if (target) {
      scrollToElement(target);
    } else if (tries++ < 20) {
      window.setTimeout(attempt, 100);
    }
  };
  window.setTimeout(attempt, 120);
}

// A link to the page that is already open would otherwise do nothing,
// so glide back to the top instead.
function handleSamePageClick(event) {
  // React Router's links mark the click as handled, so that is not checked here
  if (event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const link = event.target.closest('a[href]');
  if (!link || link.target === '_blank') return;

  const url = new URL(link.href, window.location.href);
  const samePage =
    url.origin === window.location.origin &&
    url.pathname === window.location.pathname &&
    !url.hash;

  if (samePage && window.scrollY > 0) {
    scrollToY(0);
  }
}

function PageEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    scrollToTarget(hash);
  }, [pathname, hash]);

  // Smooth, weighted scrolling for the whole site (Lenis)
  useEffect(() => startSmoothScroll(), []);

  useEffect(() => {
    document.addEventListener('click', handleSamePageClick);
    return () => document.removeEventListener('click', handleSamePageClick);
  }, []);

  // Pages that load on their own (like Donate) may draw a moment later,
  // so wait for the page's <main> before starting its motion.
  useEffect(() => {
    let stop = () => {};
    let tries = 0;
    let timer;
    const start = () => {
      const main = document.querySelector('main');
      // A page with data-own-motion runs its own (e.g. donateMotion.js)
      if (main && main.hasAttribute('data-own-motion')) return;
      if (main && main.querySelector('h1')) {
        stop = startPageMotion(main);
      } else if (tries++ < 60) {
        timer = window.setTimeout(start, 50);
      }
    };
    timer = window.setTimeout(start, 0);

    return () => {
      window.clearTimeout(timer);
      stop();
    };
  }, [pathname]);

  return null;
}

export default PageEffects;
