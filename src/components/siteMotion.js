import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Handy for checking the motion in the browser console while developing
if (import.meta.env.DEV) window.__motion = { gsap, ScrollTrigger };

// Calm, site-wide motion built with GSAP (see PageEffects.jsx):
// - the page hero's headline rises in line by line, then its text and buttons
// - as the hero scrolls away, its content drifts up and fades a little
// - section headings rise in line by line; handwritten words get their
//   marker stroke drawn in
// - text blocks fade up, cards and list items arrive one after another
// - large photos unveil from a soft inset while settling from a slight zoom
//
// Nothing is hidden by CSS, only by these tweens, and every tween is
// undone when the page changes. Visitors who ask for less motion get none.

const EASE = 'power3.out';
const START = 'top 88%';

// Groups whose children should arrive one after another
const STAGGER_GROUP = /(grid|list|cards|row|steps|items|people|filters)/i;

// Never animate these (overlays, things with their own motion)
const SKIP = '.gallery-lightbox, .home-hero-slides, .mc-hero-slideshow, [data-own-motion], iframe, video';

// Some elements have their own CSS transitions (for hover effects), which
// would drag behind GSAP. They are switched off while GSAP animates and
// handed back afterwards.
function pauseTransitions(targets) {
  gsap.set(targets, { transition: 'none' });
  return () => gsap.set(targets, { clearProps: 'transition' });
}

function splitHeading(heading, { delay = 0, trigger = true } = {}) {
  SplitText.create(heading, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'motion-line',
    autoSplit: true,
    onSplit(self) {
      const timeline = gsap.timeline({
        delay,
        scrollTrigger: trigger ? { trigger: heading, start: START, once: true } : undefined,
      });

      timeline.from(self.lines, {
        yPercent: 105,
        duration: 1,
        stagger: 0.09,
        ease: EASE,
      });

      // Draw the cyan marker stroke behind handwritten words
      const markers = heading.querySelectorAll('.hand-accent:not(.hand-accent--on-dark)');
      if (markers.length) {
        timeline.from(
          markers,
          { backgroundSize: '0% 100%', duration: 0.8, ease: 'power2.inOut' },
          '-=0.45'
        );
      }

      return timeline;
    },
  });
}

function fadeUp(element) {
  gsap.from(element, {
    y: 36,
    autoAlpha: 0,
    duration: 0.9,
    ease: EASE,
    onComplete: pauseTransitions(element),
    scrollTrigger: { trigger: element, start: START, once: true },
  });
}

// Cards in a grid or list arrive one after another as each row scrolls in
function staggerItems(items, start = START) {
  pauseTransitions(items);
  gsap.set(items, { y: 44, autoAlpha: 0 });
  ScrollTrigger.batch(items, {
    start,
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        stagger: 0.1,
        ease: EASE,
        overwrite: true,
        onComplete: () => gsap.set(batch, { clearProps: 'transition' }),
      }),
  });
}

// Large photos unveil from a soft inset while settling from a slight zoom
function unveilImage(image) {
  const radius = getComputedStyle(image).borderTopLeftRadius || '0px';
  gsap.fromTo(
    image,
    { clipPath: `inset(9% 7% 9% 7% round ${radius})`, scale: 1.12 },
    {
      clipPath: `inset(0% 0% 0% 0% round ${radius})`,
      scale: 1,
      duration: 1.4,
      ease: 'power2.out',
      clearProps: 'clipPath,scale',
      scrollTrigger: { trigger: image, start: 'top 90%', once: true },
    }
  );
}

// Listeners added by effects on the current page, removed when it changes
const pageCleanups = [];

// Signature photo effect (figure with data-motion="showcase"):
// a colour curtain sweeps across and pulls away to uncover the photo as it
// settles from a zoom; the photo then drifts inside its frame while
// scrolling; on computers the card tilts toward the cursor with a soft light.
function showcase(figure) {
  const image = figure.querySelector('img');
  const curtain = figure.querySelector('.motion-curtain');
  if (!image) return;

  // Rest slightly enlarged so the scroll drift never shows an edge
  const REST_SCALE = 1.12;

  gsap.set(image, { autoAlpha: 0, scale: 1.4 });
  const reveal = gsap.timeline({
    scrollTrigger: { trigger: figure, start: 'top 82%', once: true },
  });

  if (curtain) {
    reveal
      .fromTo(
        curtain,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.75, ease: 'power3.inOut' }
      )
      .set(image, { autoAlpha: 1 })
      .to(curtain, { scaleX: 0, transformOrigin: 'right center', duration: 0.85, ease: 'power3.inOut' })
      .to(image, { scale: REST_SCALE, duration: 1.8, ease: 'power2.out' }, '<');
  } else {
    reveal.to(image, { autoAlpha: 1, scale: REST_SCALE, duration: 1.6, ease: 'power2.out' });
  }

  gsap.fromTo(
    image,
    { yPercent: -4.5 },
    {
      yPercent: 4.5,
      ease: 'none',
      scrollTrigger: { trigger: figure, start: 'top bottom', end: 'bottom top', scrub: true },
    }
  );

  // Tilt and light follow the cursor (mouse and trackpad only)
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  gsap.set(figure, { transformPerspective: 1100 });
  const tiltX = gsap.quickTo(figure, 'rotationX', { duration: 0.7, ease: 'power3.out' });
  const tiltY = gsap.quickTo(figure, 'rotationY', { duration: 0.7, ease: 'power3.out' });

  const move = (event) => {
    const box = figure.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    tiltY(x * 5);
    tiltX(-y * 5);
    figure.style.setProperty('--light-x', `${(x + 0.5) * 100}%`);
    figure.style.setProperty('--light-y', `${(y + 0.5) * 100}%`);
    figure.classList.add('is-lit');
  };
  const leave = () => {
    tiltX(0);
    tiltY(0);
    figure.classList.remove('is-lit');
  };

  figure.addEventListener('pointermove', move);
  figure.addEventListener('pointerleave', leave);
  pageCleanups.push(() => {
    figure.removeEventListener('pointermove', move);
    figure.removeEventListener('pointerleave', leave);
    figure.classList.remove('is-lit');
  });
}

function isLargeImage(image) {
  return image.getBoundingClientRect().width >= 260 && !image.closest('a, button');
}

// Animate a block: headings split into lines, groups stagger their items,
// anything else fades up. Blocks that hold a heading are opened up so the
// heading and its neighbours each get their own motion.
function revealTree(element) {
  if (element.matches(SKIP) || element.closest(SKIP)) return;

  if (element.matches('[data-motion="showcase"]')) {
    showcase(element);
    return;
  }

  if (element.matches('h2')) {
    splitHeading(element);
    return;
  }

  const className = typeof element.className === 'string' ? element.className : '';
  const children = [...element.children];

  if (element.querySelector('h2') && children.length) {
    children.forEach(revealTree);
    return;
  }

  if (STAGGER_GROUP.test(className) && children.length > 1) {
    staggerItems(children);
    return;
  }

  if (element.matches('figure, img, picture') || (children.length === 1 && element.querySelector(':scope > img'))) {
    const image = element.matches('img') ? element : element.querySelector('img');
    if (image && isLargeImage(image)) {
      unveilImage(image);
      return;
    }
  }

  fadeUp(element);
}

// The hero: headline lines rise in, then its text and buttons follow.
// As the hero scrolls away its content drifts up and fades slightly.
function heroIntro(hero) {
  const heading = hero.querySelector('h1');
  if (!heading) return;

  splitHeading(heading, { delay: 0.15, trigger: false });

  const content = heading.parentElement;
  const followers = [...content.children].filter((child) => child !== heading);
  if (followers.length) {
    gsap.from(followers, {
      y: 26,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.1,
      delay: 0.55,
      ease: EASE,
      onComplete: pauseTransitions(followers),
    });
  }

  gsap.to(content, {
    yPercent: -12,
    opacity: 0.55,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
}

function footerMotion(footer) {
  const blocks = [
    ...footer.querySelectorAll('.footer-cta-inner > *, .footer-grid > *, .footer-bottom-inner'),
  ];
  // The footer ends the page, so it starts as soon as it appears
  if (blocks.length) staggerItems(blocks, 'top bottom');
}

function pageSections(main) {
  return [...main.querySelectorAll(':scope > section, :scope > div > section')];
}

// Photos above a section change its position once they load, so the
// scroll positions are measured again (once things settle).
function watchLayout(main) {
  let timer;
  const refresh = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
  };
  const images = [...main.querySelectorAll('img')].filter((image) => !image.complete);
  images.forEach((image) => image.addEventListener('load', refresh, { once: true }));
  window.addEventListener('load', refresh, { once: true });
  document.fonts?.ready.then(refresh);

  return () => {
    window.clearTimeout(timer);
    images.forEach((image) => image.removeEventListener('load', refresh));
    window.removeEventListener('load', refresh);
  };
}

// Starts the motion for the page now on screen; returns a function that
// undoes all of it.
export function startPageMotion(main) {
  const media = gsap.matchMedia();
  let stopWatching = () => {};

  media.add('(prefers-reduced-motion: no-preference)', () => {
    const [hero, ...sections] = pageSections(main);
    if (hero) heroIntro(hero);

    sections.forEach((section) => {
      const container = section.firstElementChild;
      if (!container) return;
      const blocks = container.children.length ? [...container.children] : [container];
      blocks.forEach(revealTree);
    });

    const footer = document.querySelector('.site-footer');
    if (footer) footerMotion(footer);

    stopWatching = watchLayout(main);

    return () => pageCleanups.splice(0).forEach((cleanup) => cleanup());
  });

  // Measure scroll positions for the new page (Lenis re-measures too)
  ScrollTrigger.refresh();

  return () => {
    stopWatching();
    media.revert();
  };
}
