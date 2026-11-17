import { gsap } from 'gsap';

// Entrance for the navbar (GSAP), played once per visit: the navbar is part
// of every page, so it would otherwise replay on each page change.
//
// 1. the top strip slides in, then the countdown's time boxes drop in
// 2. the main bar settles down, the logo glides in from the left
// 3. on desktop the menu pill opens out and its links arrive one by one
// 4. search, Donate and the menu button pop in
//
// Visitors who ask for less motion get none.

let played = false;

const EASE = 'power3.out';

export function playNavbarIntro(header) {
  if (played || !header) return () => {};
  played = true;
  let finished = false;

  const media = gsap.matchMedia();

  // Less motion requested: nothing to play, count it as done
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) finished = true;

  media.add('(prefers-reduced-motion: no-preference)', () => {
    const q = gsap.utils.selector(header);
    const desktop = window.innerWidth > 1100;

    const strip = q('.navbar-topbar-info > *, .outreach-countdown');
    const timeBoxes = q('.outreach-countdown-time > span');
    const main = q('.navbar-main');
    const brand = q('.navbar-brand');
    const pill = desktop ? q('.navbar-links') : [];
    const links = desktop ? q('.navbar-links > *') : [];
    const actions = q('.navbar-actions > *, .mobile-donate');

    const targets = [...strip, ...timeBoxes, ...main, ...brand, ...pill, ...links, ...actions];

    // CSS hover transitions would drag behind the tweens, so pause them
    gsap.set(targets, { transition: 'none' });

    const timeline = gsap.timeline({
      defaults: { ease: EASE },
      onComplete: () => {
        finished = true;
        gsap.set(targets, { clearProps: 'transform,transformOrigin,opacity,transition,visibility' });
      },
    });

    timeline
      .from(main, { yPercent: -35, autoAlpha: 0, duration: 0.7 }, 0)
      .from(brand, { x: -18, autoAlpha: 0, duration: 0.6 }, 0.15)
      .from(strip, { y: -14, autoAlpha: 0, duration: 0.5, stagger: 0.07 }, 0.1)
      .from(
        timeBoxes,
        { y: 10, autoAlpha: 0, scale: 0.8, duration: 0.45, stagger: 0.07, ease: 'back.out(2.2)' },
        0.35,
      );

    if (pill.length) {
      timeline
        .from(pill, { scaleX: 0.82, autoAlpha: 0, duration: 0.65, transformOrigin: '50% 50%' }, 0.25)
        .from(links, { y: -10, autoAlpha: 0, duration: 0.45, stagger: 0.06 }, 0.4);
    }

    timeline.from(
      actions,
      { scale: 0.6, autoAlpha: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(2)' },
      desktop ? 0.6 : 0.3,
    );

    return () => {
      timeline.kill();
      gsap.set(targets, { clearProps: 'transform,transformOrigin,opacity,transition,visibility' });
    };
  });

  return () => {
    media.revert();
    // Stopped part-way (e.g. React's development double-run): play next time
    if (!finished) played = false;
  };
}
