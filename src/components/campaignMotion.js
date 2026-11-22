import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Motion for the fundraising campaign (Campaign.jsx), on Home and Donate.
// The site-wide motion leaves it alone (data-own-motion on the section;
// the Donate page has its own motion and skips it too).
//
// - the card rises in, the photo unveils and the "Live campaign" badge pops
// - the headline and text rise in (the big figure counts up on its own,
//   see AnimatedAmount in Campaign.jsx, so it can follow the live total)
// - the progress bar fills and its milestone ticks appear
// - the stats, amount buttons and Donate button arrive one by one
// - the seven costs flip up in turn, their icons spin in
// - buttons give a springy press
//
// Visitors who ask for less motion get none of the movement.

const EASE = 'power3.out';
const CLEAR = 'transform,opacity,visibility,transition,transformOrigin,clipPath';

export function startCampaignMotion(root) {
  if (!root) return () => {};
  const media = gsap.matchMedia();

  media.add('(prefers-reduced-motion: no-preference)', () => {
    const q = gsap.utils.selector(root);
    const compact = root.classList.contains('campaign-compact');

    const card = compact ? [root] : q('.campaign-card');
    const photo = q('.campaign-media > img');
    const badge = q('.campaign-live');
    const caption = q('.campaign-media-caption > *');
    const text = q('.campaign-kicker, .campaign-body h2, .campaign-lead, .campaign-compact h2');
    const figureBits = q('.campaign-figure-label, .campaign-percent, .campaign-first');
    const fill = q('.campaign-bar-fill');
    const ticks = q('.campaign-bar-tick');
    const stats = q('.campaign-stats li');
    const amounts = q('.campaign-amount');
    const actions = q('.campaign-actions > *, .campaign-secure, .campaign-compact > .campaign-btn');
    const chips = q('.campaign-compact-uses li');

    const targets = [...card, ...photo, ...badge, ...caption, ...text, ...figureBits, ...fill, ...ticks, ...stats, ...amounts, ...actions, ...chips];
    gsap.set(targets, { transition: 'none' });

    const timeline = gsap.timeline({
      defaults: { ease: EASE },
      scrollTrigger: { trigger: card[0] || root, start: 'top 82%', once: true },
      onComplete: () => gsap.set(targets, { clearProps: CLEAR }),
    });

    timeline.from(card, { y: 70, autoAlpha: 0, duration: 1.1, ease: 'expo.out' }, 0);

    if (photo.length) {
      timeline.fromTo(
        photo,
        { clipPath: 'inset(12% 10% 12% 10%)', scale: 1.25 },
        { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.5, ease: 'expo.out' },
        0.1,
      );
    }

    timeline
      .from(badge, { scale: 0.4, autoAlpha: 0, duration: 0.6, ease: 'back.out(2.4)' }, 0.5)
      .from(caption, { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, 0.7)
      .from(text, { y: 28, autoAlpha: 0, duration: 0.8, stagger: 0.1 }, 0.25);


    timeline
      .from(figureBits, { y: 12, autoAlpha: 0, duration: 0.6, stagger: 0.1 }, 0.8)
      .from(fill, { scaleX: 0, transformOrigin: '0% 50%', duration: 1.6, ease: 'power3.inOut' }, 0.8)
      .from(ticks, { scaleY: 0, autoAlpha: 0, duration: 0.4, stagger: 0.12, ease: 'back.out(3)' }, 1.1)
      .from(stats, { y: 22, autoAlpha: 0, duration: 0.6, stagger: 0.09 }, 1)
      .from(
        amounts,
        { y: 18, scale: 0.8, autoAlpha: 0, duration: 0.5, stagger: 0.06, ease: 'back.out(2.2)' },
        1.15,
      )
      .from(chips, { y: 12, scale: 0.85, autoAlpha: 0, duration: 0.45, stagger: 0.05, ease: 'back.out(2)' }, 0.7)
      .from(actions, { y: 18, autoAlpha: 0, duration: 0.6, stagger: 0.1 }, compact ? 0.9 : 1.4);

    // The seven costs
    const usesHeading = q('.campaign-uses-heading > *');
    if (usesHeading.length) {
      gsap.from(usesHeading, {
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: EASE,
        clearProps: CLEAR,
        scrollTrigger: { trigger: usesHeading[0], start: 'top 88%', once: true },
      });
    }

    const uses = q('.campaign-use, .campaign-use-cta');
    if (uses.length) {
      const icons = q('.campaign-use-icon, .campaign-use-cta-icon');
      const numbers = q('.campaign-use-number');
      gsap.set([...uses, ...icons], { transition: 'none' });
      gsap
        .timeline({
          scrollTrigger: { trigger: uses[0], start: 'top 88%', once: true },
          onComplete: () => gsap.set([...uses, ...icons, ...numbers], { clearProps: CLEAR }),
        })
        .from(uses, {
          y: 60,
          rotationX: -45,
          transformPerspective: 900,
          transformOrigin: '50% 100%',
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'expo.out',
        })
        .from(icons, { scale: 0, rotation: -140, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, 0.2)
        .from(numbers, { x: 14, autoAlpha: 0, duration: 0.5, stagger: 0.08 }, 0.3);
    }

    // Springy press on the buttons
    const onPress = (event) => {
      const target = event.target.closest('.campaign-amount, .campaign-btn');
      if (!target) return;
      gsap.fromTo(target, { scale: 0.92 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.45)', clearProps: 'scale' });
    };
    root.addEventListener('pointerdown', onPress);

    return () => root.removeEventListener('pointerdown', onPress);
  });

  ScrollTrigger.refresh();
  return () => media.revert();
}
