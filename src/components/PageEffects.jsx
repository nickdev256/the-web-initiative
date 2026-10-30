
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Site-wide motion and navigation behaviour, run on every route change:
// - start each new page at the top (or at the #section in the link)
// - slide page content into view as it scrolls on screen
//
// Elements are only hidden once JavaScript has tagged them, and any
// element React re-renders simply loses the tag and shows normally, so
// content can never get stuck invisible.

const REVEAL = 'reveal';
const REVEALED = 'is-revealed';

// Groups whose children should arrive one after another
const STAGGER_GROUP = /(grid|list|cards|row|steps|items)/i;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function scrollToTarget(hash) {
  if (hash) {
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

// Pick the blocks to animate: the content blocks inside each section,
// with grids and lists split into their individual cards.
function collectRevealTargets(main) {
  const targets = [];
  const sections = [...main.querySelectorAll(':scope > section, :scope > div > section')];

  sections.forEach((section, sectionIndex) => {
    // The first section is the page hero; the page transition covers it.
    if (sectionIndex === 0) return;

    const container = section.firstElementChild;
    if (!container) return;

    const blocks = container.children.length > 0 ? [...container.children] : [container];

    blocks.forEach((block) => {
      // Home page sections manage their own reveal animation
      if (block.matches('.home-reveal') || block.querySelector('.home-reveal')) return;

      const className = typeof block.className === 'string' ? block.className : '';
      const groupItems = STAGGER_GROUP.test(className) ? [...block.children] : [];

      if (groupItems.length > 1) {
        groupItems.forEach((item, index) => targets.push({ element: item, delay: (index % 4) * 90 }));
      } else {
        targets.push({ element: block, delay: 0 });
      }
    });
  });

  return targets;
}

function PageEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    scrollToTarget(hash);
  }, [pathname, hash]);

  useEffect(() => {
    const main = document.querySelector('main');
    if (!main || prefersReducedMotion() || !('IntersectionObserver' in window)) {
      return undefined;
    }

    const targets = collectRevealTargets(main);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(REVEALED);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach(({ element, delay }) => {
      element.classList.add(REVEAL);
      if (delay) element.style.animationDelay = `${delay}ms`;
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      targets.forEach(({ element }) => {
        element.classList.remove(REVEAL, REVEALED);
        element.style.animationDelay = '';
      });
    };
  }, [pathname]);

  return null;
}

export default PageEffects;
