import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Motion for the Donate page (GSAP). It plays every time the page opens,
// including on refresh, and the site-wide motion leaves this page alone
// (its <main> has data-own-motion).
//
// Entrance
// - "Partner with us" slides in, the giving card rises and settles
// - the programme tabs pop in, the title types itself in letter by letter
// - the medicines arrive one by one, their ticks spin in
// - the gift box swings in from the side and the amounts drop in like tiles
//
// On scroll
// - "How to give" steps flip up into place, their numbers spin in
// - the questions slide in from the side
//
// Interactive (computers with a mouse)
// - a soft light follows the cursor across the giving card
// - the step cards tilt toward the cursor
// - tabs, amounts and payment choices give a springy press
// - questions open and close smoothly
//
// Visitors who ask for less motion get none of the movement.

const EASE = 'power3.out';

// Clear what the tweens set, so CSS (hover effects) takes over again
const CLEAR = 'transform,opacity,visibility,transition,transformOrigin,transformPerspective';

export function startDonateMotion(root) {
  if (!root) return () => {};
  const media = gsap.matchMedia();

  media.add('(prefers-reduced-motion: no-preference)', () => {
    const q = gsap.utils.selector(root);
    const cleanups = [];
    const splits = [];

    // ---------- ENTRANCE (every load) ----------
    const card = q('.donate-card');
    const widget = q('.donate-widget');
    const entranceTargets = [
      ...q('.donate-give-heading > *'),
      ...card,
      ...q('.donate-tab'),
      ...q('.donate-price, .donate-summary'),
      ...q('.donate-items li'),
      ...q('.donate-items li svg'),
      ...widget,
      ...q('.donate-amounts button, .donate-other, .donate-continue, .donate-frequency, .donate-recurring'),
    ];
    // CSS hover transitions would drag behind the tweens
    gsap.set(entranceTargets, { transition: 'none' });

    const intro = gsap.timeline({
      defaults: { ease: EASE },
      delay: 0.1,
      onComplete: () => gsap.set(entranceTargets, { clearProps: CLEAR }),
    });

    intro
      .from(q('.donate-give-heading > *'), { x: -40, autoAlpha: 0, duration: 0.7, stagger: 0.08 })
      .from(card, { y: 80, scale: 0.95, autoAlpha: 0, duration: 1.1, ease: 'expo.out' }, 0.1)
      .from(
        q('.donate-tab'),
        { y: 18, scale: 0.7, autoAlpha: 0, duration: 0.55, stagger: 0.08, ease: 'back.out(2.4)' },
        0.45,
      );

    // Programme title types in letter by letter
    const label = q('.donate-card-label')[0];
    if (label) {
      const split = SplitText.create(label, { type: 'chars' });
      splits.push(split);
      intro.from(
        split.chars,
        {
          autoAlpha: 0,
          y: 8,
          duration: 0.02,
          stagger: 0.022,
          ease: 'none',
          onComplete: () => split.revert(),
        },
        0.6,
      );
    }

    intro
      .from(q('.donate-price'), { y: 30, autoAlpha: 0, duration: 0.7 }, 0.7)
      .from(q('.donate-summary'), { y: 20, autoAlpha: 0, duration: 0.7 }, 0.8)
      .from(q('.donate-items li'), { x: -28, autoAlpha: 0, duration: 0.55, stagger: 0.09 }, 0.9)
      .from(
        q('.donate-items li svg'),
        { scale: 0, rotation: -120, duration: 0.6, stagger: 0.09, ease: 'back.out(2.5)' },
        0.95,
      )
      .from(
        widget,
        {
          x: 70,
          rotationY: -14,
          transformPerspective: 1200,
          transformOrigin: '100% 50%',
          autoAlpha: 0,
          duration: 1.1,
          ease: 'expo.out',
        },
        0.35,
      )
      .from(q('.donate-frequency, .donate-recurring'), { y: 16, autoAlpha: 0, duration: 0.5, stagger: 0.08 }, 0.75)
      .from(
        q('.donate-amounts button'),
        {
          y: -26,
          rotationX: 70,
          transformPerspective: 600,
          transformOrigin: '50% 0%',
          autoAlpha: 0,
          duration: 0.6,
          stagger: { each: 0.07, grid: 'auto', from: 'start' },
          ease: 'back.out(1.8)',
        },
        0.95,
      )
      .from(q('.donate-other, .donate-continue'), { y: 18, autoAlpha: 0, duration: 0.55, stagger: 0.1 }, 1.25);

    // ---------- ON SCROLL ----------
    const stepsHeading = q('.donate-steps .donate-heading > *');
    if (stepsHeading.length) {
      gsap.from(stepsHeading, {
        y: 34,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: EASE,
        scrollTrigger: { trigger: stepsHeading[0], start: 'top 88%', once: true },
      });
    }

    const steps = q('.donate-step');
    if (steps.length) {
      gsap.set(steps, { transition: 'none' });
      const stepNumbers = q('.donate-step-number');
      const stepIcons = q('.donate-step .donate-icon-box');
      gsap
        .timeline({
          scrollTrigger: { trigger: steps[0], start: 'top 85%', once: true },
          onComplete: () => gsap.set([...steps, ...stepNumbers, ...stepIcons], { clearProps: CLEAR }),
        })
        .from(steps, {
          y: 70,
          rotationX: -60,
          transformOrigin: '50% 100%',
          autoAlpha: 0,
          duration: 1,
          stagger: 0.14,
          ease: 'expo.out',
        })
        .from(
          stepNumbers,
          { scale: 0, rotation: -180, duration: 0.7, stagger: 0.14, ease: 'back.out(2)' },
          0.3,
        )
        .from(stepIcons, { scale: 0.4, autoAlpha: 0, duration: 0.6, stagger: 0.14, ease: 'back.out(2.2)' }, 0.4);
    }

    const faqIntro = q('.donate-faq-intro > *');
    if (faqIntro.length) {
      gsap.from(faqIntro, {
        x: -40,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: EASE,
        scrollTrigger: { trigger: faqIntro[0], start: 'top 88%', once: true },
      });
    }

    const faqs = q('.donate-faq-item');
    if (faqs.length) {
      gsap.set(faqs, { transition: 'none' });
      gsap.from(faqs, {
        x: 60,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.09,
        ease: EASE,
        clearProps: CLEAR,
        scrollTrigger: { trigger: faqs[0], start: 'top 90%', once: true },
      });
    }

    // The footer comes in as it does on the other pages
    const footerBlocks = document.querySelectorAll(
      '.site-footer .footer-cta-inner > *, .site-footer .footer-grid > *, .site-footer .footer-bottom-inner',
    );
    if (footerBlocks.length) {
      gsap.from(footerBlocks, {
        y: 44,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: EASE,
        clearProps: CLEAR,
        scrollTrigger: { trigger: footerBlocks[0], start: 'top bottom', once: true },
      });
    }

    // ---------- INTERACTIVE ----------

    // Springy press on tabs, amounts and payment choices (works for the
    // second step too, since it listens on the whole page)
    const onPress = (event) => {
      const target = event.target.closest(
        '.donate-tab, .donate-amounts button, .donate-method, .donate-frequency button, .donate-continue',
      );
      if (!target || target.disabled) return;
      gsap.fromTo(
        target,
        { scale: 0.92 },
        { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.45)', clearProps: 'scale' },
      );
    };
    root.addEventListener('pointerdown', onPress);
    cleanups.push(() => root.removeEventListener('pointerdown', onPress));

    // Questions open and close smoothly instead of jumping
    const onSummaryClick = (event) => {
      const summary = event.target.closest('.donate-faq-item summary');
      if (!summary) return;
      const item = summary.parentElement;
      const answer = item.querySelector(':scope > p');
      if (!answer) return;
      event.preventDefault();

      if (item.open) {
        gsap.to(answer, {
          height: 0,
          autoAlpha: 0,
          duration: 0.35,
          ease: 'power2.in',
          onComplete: () => {
            item.open = false;
            gsap.set(answer, { clearProps: 'height,opacity,visibility' });
          },
        });
      } else {
        item.open = true;
        gsap.from(answer, {
          height: 0,
          autoAlpha: 0,
          y: -6,
          duration: 0.45,
          ease: EASE,
          clearProps: 'height,opacity,visibility,transform',
        });
      }
    };
    root.addEventListener('click', onSummaryClick);
    cleanups.push(() => root.removeEventListener('click', onSummaryClick));

    // Computers with a mouse: cursor light on the giving card, tilting steps
    // (the steps grid sets the perspective in Donate.css)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      card.forEach((element) => {
        const move = (event) => {
          const box = element.getBoundingClientRect();
          element.style.setProperty('--spot-x', `${event.clientX - box.left}px`);
          element.style.setProperty('--spot-y', `${event.clientY - box.top}px`);
        };
        element.addEventListener('pointermove', move);
        cleanups.push(() => element.removeEventListener('pointermove', move));
      });

      steps.forEach((step) => {
        const tiltX = gsap.quickTo(step, 'rotationX', { duration: 0.5, ease: 'power3.out' });
        const tiltY = gsap.quickTo(step, 'rotationY', { duration: 0.5, ease: 'power3.out' });
        const move = (event) => {
          const box = step.getBoundingClientRect();
          const x = (event.clientX - box.left) / box.width - 0.5;
          const y = (event.clientY - box.top) / box.height - 0.5;
          tiltY(x * 12);
          tiltX(-y * 12);
        };
        const leave = () => {
          tiltX(0);
          tiltY(0);
        };
        step.addEventListener('pointermove', move);
        step.addEventListener('pointerleave', leave);
        cleanups.push(() => {
          step.removeEventListener('pointermove', move);
          step.removeEventListener('pointerleave', leave);
        });
      });
    }

    // Fonts can shift the layout a little once loaded
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      splits.forEach((split) => split.revert());
    };
  });

  ScrollTrigger.refresh();
  return () => media.revert();
}
