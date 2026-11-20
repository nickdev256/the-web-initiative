import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Motion for the Contact page (GSAP). It plays every time the page opens,
// including on refresh; the site-wide motion leaves this page alone (its
// <main> has data-own-motion).
//
// Entrance
// - the hero photo slowly pans into place while its shade lifts
// - the headline rises in word by word, then the marker stroke is drawn
// - the WhatsApp, Call and Email cards flip up one by one, icons spin in
//
// On scroll
// - "We are here to help" rises in
// - the contact details panel slides in from the left, its rows and
//   topic chips follow one by one
// - the form slides in from the right, its colour strip draws across and
//   the fields rise in turn
// - the map unveils from the centre and its place tag drops in with a
//   bounce (the pin then bobs gently, in Contact.css)
// - the footer comes in as on the other pages
//
// Interactive
// - the quick cards tilt toward the cursor (computers with a mouse)
// - a soft light follows the cursor over the contact details panel
// - topic chips and the send button give a springy press
// - the hero photo drifts gently as the page scrolls
//
// Visitors who ask for less motion get none of the movement.

const EASE = 'power3.out';
const CLEAR = 'transform,opacity,visibility,transition,transformOrigin';

function reveal(targets, vars, trigger, start = 'top 86%') {
  const list = gsap.utils.toArray(targets);
  if (!list.length) return null;
  gsap.set(list, { transition: 'none' });
  return gsap.from(list, {
    ease: EASE,
    clearProps: CLEAR,
    ...vars,
    scrollTrigger: { trigger: trigger || list[0], start, once: true },
  });
}

export function startContactMotion(root) {
  if (!root) return () => {};
  const media = gsap.matchMedia();

  media.add('(prefers-reduced-motion: no-preference)', () => {
    const q = gsap.utils.selector(root);
    const cleanups = [];
    const splits = [];

    // ---------- ENTRANCE ----------
    const hero = q('.contact-hero')[0];
    const heading = q('.contact-hero h1')[0];
    const heroFollowers = q('.contact-hero-content > :not(h1)');
    const quickCards = q('.contact-quick-card');
    const quickIcons = q('.contact-quick-icon');
    gsap.set([...heroFollowers, ...quickCards], { transition: 'none' });

    const intro = gsap.timeline({
      defaults: { ease: EASE },
      onComplete: () => {
        gsap.set([...heroFollowers, ...quickCards, ...quickIcons], { clearProps: CLEAR });
        gsap.set(q('.contact-hero-shade'), { clearProps: 'opacity' });
        // Put the headline back to plain text once its words have landed
        splits.forEach((split) => split.revert());
      },
    });

    if (hero) {
      intro
        .fromTo(hero, { backgroundPosition: 'center 30%' }, { backgroundPosition: 'center 60%', duration: 2.4, ease: 'power2.out' }, 0)
        .from(q('.contact-hero-shade'), { opacity: 0.4, duration: 1.2, ease: 'power1.out' }, 0);
    }

    if (heading) {
      const split = SplitText.create(heading, { type: 'words', mask: 'words' });
      splits.push(split);
      intro.from(
        split.words,
        { yPercent: 110, rotation: 4, duration: 0.9, stagger: 0.07, ease: 'expo.out' },
        0.15,
      );

      const marker = heading.querySelector('.hand-accent');
      if (marker) {
        intro.from(marker, { backgroundSize: '0% 100%', duration: 0.8, ease: 'power2.inOut' }, '-=0.35');
      }
    }

    intro
      .from(heroFollowers, { y: 26, autoAlpha: 0, duration: 0.8, stagger: 0.12 }, 0.55)
      .from(
        quickCards,
        {
          y: 90,
          rotationX: -50,
          transformPerspective: 900,
          transformOrigin: '50% 100%',
          autoAlpha: 0,
          duration: 1,
          stagger: 0.13,
          ease: 'expo.out',
        },
        0.6,
      )
      .from(
        quickIcons,
        { scale: 0, rotation: -160, duration: 0.7, stagger: 0.13, ease: 'back.out(2.2)' },
        0.9,
      );

    // The hero photo drifts a little as the page scrolls
    if (hero) {
      gsap.fromTo(
        hero,
        { backgroundPosition: 'center 60%' },
        {
          backgroundPosition: 'center 85%',
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        },
      );
    }

    // ---------- ON SCROLL ----------
    reveal(q('.contact-heading > *'), { y: 34, autoAlpha: 0, duration: 0.8, stagger: 0.1 });

    // Contact details panel from the left, then its contents in turn
    const infoPanel = q('.contact-info-panel')[0];
    if (infoPanel) {
      const rows = q('.contact-info-panel > h3, .contact-info-intro, .contact-info-list li');
      const iconBoxes = q('.contact-info-list .contact-icon-box');
      const chips = q('.contact-topics li');
      const note = q('.contact-info-note');
      const all = [infoPanel, ...rows, ...iconBoxes, ...chips, ...note];
      gsap.set(all, { transition: 'none' });
      gsap
        .timeline({
          defaults: { ease: EASE },
          scrollTrigger: { trigger: infoPanel, start: 'top 85%', once: true },
          onComplete: () => gsap.set(all, { clearProps: CLEAR }),
        })
        .from(infoPanel, { x: -80, autoAlpha: 0, duration: 1, ease: 'expo.out' })
        .from(rows, { x: -24, autoAlpha: 0, duration: 0.55, stagger: 0.07 }, 0.3)
        .from(iconBoxes, { scale: 0, rotation: -90, duration: 0.55, stagger: 0.08, ease: 'back.out(2.4)' }, 0.45)
        .from(chips, { scale: 0.5, autoAlpha: 0, duration: 0.45, stagger: 0.06, ease: 'back.out(2.6)' }, 0.8)
        .from(note, { y: 18, autoAlpha: 0, duration: 0.6 }, 1);
    }

    // Form from the right: colour strip draws across, fields rise in turn
    const formPanel = q('.contact-form-panel')[0];
    if (formPanel) {
      const formBits = q(
        '.contact-form-heading > *, .contact-form > .contact-form-row > *, .contact-form > .contact-field, .contact-submit, .contact-form-disclaimer',
      );
      const all = [formPanel, ...formBits];
      gsap.set(all, { transition: 'none' });
      gsap
        .timeline({
          defaults: { ease: EASE },
          scrollTrigger: { trigger: formPanel, start: 'top 85%', once: true },
          onComplete: () => {
            gsap.set(all, { clearProps: CLEAR });
            formPanel.style.removeProperty('--strip');
          },
        })
        .from(formPanel, { x: 80, autoAlpha: 0, duration: 1, ease: 'expo.out' })
        .fromTo(formPanel, { '--strip': 0 }, { '--strip': 1, duration: 1.1, ease: 'power2.inOut' }, 0.3)
        .from(formBits, { y: 22, autoAlpha: 0, duration: 0.6, stagger: 0.07 }, 0.35);
    }

    // Location: words from the left, map unveils, pin drops in
    reveal(q('.contact-location-copy > *'), { x: -40, autoAlpha: 0, duration: 0.8, stagger: 0.1 });

    const map = q('.contact-map')[0];
    if (map) {
      const tag = q('.contact-map-tag');
      gsap
        .timeline({
          scrollTrigger: { trigger: map, start: 'top 85%', once: true },
          onComplete: () => gsap.set([map, ...tag], { clearProps: 'clipPath,transform,opacity,visibility' }),
        })
        .fromTo(
          map,
          { clipPath: 'inset(18% 18% 18% 18% round 24px)', autoAlpha: 0 },
          { clipPath: 'inset(0% 0% 0% 0% round 24px)', autoAlpha: 1, duration: 1.2, ease: 'expo.out' },
        )
        .from(tag, { y: -40, autoAlpha: 0, duration: 0.8, ease: 'bounce.out' }, 0.6);
    }

    // Footer, as on the other pages
    reveal(
      document.querySelectorAll(
        '.site-footer .footer-cta-inner > *, .site-footer .footer-grid > *, .site-footer .footer-bottom-inner',
      ),
      { y: 44, autoAlpha: 0, duration: 0.9, stagger: 0.1 },
      null,
      'top bottom',
    );

    // ---------- INTERACTIVE ----------
    const onPress = (event) => {
      const target = event.target.closest('.contact-topics button, .contact-submit, .contact-btn');
      if (!target) return;
      gsap.fromTo(
        target,
        { scale: 0.92 },
        { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.45)', clearProps: 'scale' },
      );
    };
    root.addEventListener('pointerdown', onPress);
    cleanups.push(() => root.removeEventListener('pointerdown', onPress));

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      // Quick cards tilt toward the cursor
      quickCards.forEach((card) => {
        const tiltX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
        const tiltY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });
        const lift = gsap.quickTo(card, 'y', { duration: 0.4, ease: 'power3.out' });
        gsap.set(card, { transformPerspective: 900 });
        const move = (event) => {
          const box = card.getBoundingClientRect();
          tiltY(((event.clientX - box.left) / box.width - 0.5) * 14);
          tiltX(-((event.clientY - box.top) / box.height - 0.5) * 14);
          lift(-6);
        };
        const leave = () => {
          tiltX(0);
          tiltY(0);
          lift(0);
        };
        card.addEventListener('pointermove', move);
        card.addEventListener('pointerleave', leave);
        cleanups.push(() => {
          card.removeEventListener('pointermove', move);
          card.removeEventListener('pointerleave', leave);
        });
      });

      // Soft light follows the cursor over the contact details panel
      if (infoPanel) {
        const move = (event) => {
          const box = infoPanel.getBoundingClientRect();
          infoPanel.style.setProperty('--spot-x', `${event.clientX - box.left}px`);
          infoPanel.style.setProperty('--spot-y', `${event.clientY - box.top}px`);
        };
        infoPanel.addEventListener('pointermove', move);
        cleanups.push(() => infoPanel.removeEventListener('pointermove', move));
      }
    }

    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      splits.forEach((split) => split.revert());
      if (hero) hero.style.removeProperty('background-position');
    };
  });

  ScrollTrigger.refresh();
  return () => media.revert();
}
