import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Motion for the Our Team page (GSAP). It plays every time the page opens,
// including on refresh; the site-wide motion leaves this page alone (its
// <main> has data-own-motion).
//
// Entrance
// - the hero photo slowly pans into place while its shade lifts
// - the headline rises in word by word, then the intro line follows
//
// On scroll
// - the team photo unveils from a soft inset, its "Working as a team"
//   badge pops up, the text beside it rises in turn
// - "Leadership and Board" is underlined from left to right, the
//   statement rises in word by word
// - each portrait is uncovered from the bottom up while it settles from a
//   zoom, then the name, role and country follow and the flag pops in
// - "Want to work with us?" rises in, the two ways to help slide in from
//   the right, their icons spin in
// - the footer comes in as on the other pages
//
// Interactive (computers with a mouse)
// - portraits tilt toward the cursor and lift a little
// - a soft light follows the cursor across the blue team section
// - the team photo tilts gently, buttons give a springy press
// - the hero photo drifts as the page scrolls
//
// Visitors who ask for less motion get none of the movement.

const EASE = 'power3.out';
const CLEAR = 'transform,opacity,visibility,transition,transformOrigin,clipPath';

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

// A heading rises in word by word as it scrolls into view, then goes back
// to plain text
function wordsIn(heading, splits, start = 'top 86%') {
  if (!heading) return;
  const split = SplitText.create(heading, { type: 'words', mask: 'words' });
  splits.push(split);
  const timeline = gsap.timeline({
    scrollTrigger: { trigger: heading, start, once: true },
    onComplete: () => split.revert(),
  });
  timeline.from(split.words, { yPercent: 110, duration: 0.85, stagger: 0.06, ease: 'expo.out' });

  const marker = heading.querySelector('.hand-accent:not(.hand-accent--on-dark)');
  if (marker) timeline.from(marker, { backgroundSize: '0% 100%', duration: 0.7, ease: 'power2.inOut' }, '-=0.3');
}

export function startOurTeamMotion(root) {
  if (!root) return () => {};
  const media = gsap.matchMedia();

  media.add('(prefers-reduced-motion: no-preference)', () => {
    const q = gsap.utils.selector(root);
    const cleanups = [];
    const splits = [];
    const mouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // ---------- ENTRANCE ----------
    const hero = q('.ot-hero')[0];
    const heroHeading = q('.ot-hero h1')[0];
    const heroText = q('.ot-hero-content > p');
    gsap.set(heroText, { transition: 'none' });

    const intro = gsap.timeline({
      defaults: { ease: EASE },
      onComplete: () => {
        gsap.set(heroText, { clearProps: CLEAR });
        gsap.set(q('.ot-hero-shade'), { clearProps: 'opacity' });
        splits.forEach((split) => split.revert());
      },
    });

    if (hero) {
      intro
        .fromTo(hero, { backgroundPosition: 'center 10%' }, { backgroundPosition: 'center 35%', duration: 2.4, ease: 'power2.out' }, 0)
        .from(q('.ot-hero-shade'), { opacity: 0.5, duration: 1.2, ease: 'power1.out' }, 0);
    }

    if (heroHeading) {
      const split = SplitText.create(heroHeading, { type: 'words', mask: 'words' });
      splits.push(split);
      intro.from(split.words, { yPercent: 115, rotation: 3, duration: 0.95, stagger: 0.08, ease: 'expo.out' }, 0.15);
    }

    intro.from(heroText, { y: 26, autoAlpha: 0, duration: 0.8 }, 0.7);

    // The hero photo drifts a little as the page scrolls
    if (hero) {
      gsap.fromTo(
        hero,
        { backgroundPosition: 'center 35%' },
        {
          backgroundPosition: 'center 65%',
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        },
      );
    }

    // ---------- INTRO: photo, badge and text ----------
    const introPhoto = q('.ot-intro-photo')[0];
    if (introPhoto) {
      const image = introPhoto.querySelector('img');
      const badge = q('.ot-intro-badge');
      const badgeIcon = q('.ot-intro-badge .ot-icon-box');
      gsap
        .timeline({
          scrollTrigger: { trigger: introPhoto, start: 'top 85%', once: true },
          onComplete: () => gsap.set([introPhoto, image, ...badge, ...badgeIcon], { clearProps: CLEAR }),
        })
        .fromTo(
          introPhoto,
          { clipPath: 'inset(10% 8% 10% 8% round 24px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.3, ease: 'expo.out' },
        )
        .from(image, { scale: 1.25, duration: 1.6, ease: 'power2.out' }, 0)
        .from(badge, { y: 40, scale: 0.9, autoAlpha: 0, duration: 0.8, ease: 'back.out(1.8)' }, 0.6)
        .from(badgeIcon, { scale: 0, rotation: -140, duration: 0.6, ease: 'back.out(2.2)' }, 0.85);
    }

    wordsIn(q('.ot-intro-copy h2')[0], splits);
    reveal(q('.ot-intro-copy > p, .ot-intro-copy > .ot-text-link'), { y: 28, autoAlpha: 0, duration: 0.8, stagger: 0.12 }, q('.ot-intro-copy')[0]);

    // ---------- LEADERSHIP AND BOARD ----------
    const groupTitle = q('.ot-group-title')[0];
    if (groupTitle) {
      gsap
        .timeline({
          scrollTrigger: { trigger: groupTitle, start: 'top 88%', once: true },
          onComplete: () => gsap.set(groupTitle, { clearProps: CLEAR }),
        })
        .from(groupTitle, { x: -30, autoAlpha: 0, duration: 0.7, ease: EASE })
        .fromTo(
          groupTitle,
          { clipPath: 'inset(0% 100% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.inOut' },
          0,
        );
    }

    wordsIn(q('.ot-teams-statement h2')[0], splits);
    reveal(q('.ot-teams-statement p'), { y: 26, autoAlpha: 0, duration: 0.9 });

    // Portraits: uncovered from the bottom up, then the details follow
    const people = q('.ot-person');
    if (people.length) {
      people.forEach((person) => {
        const photo = person.querySelector('.ot-person-photo');
        const image = photo?.querySelector('img, .ot-person-placeholder');
        const details = person.querySelectorAll('h3, .ot-person-role, .ot-person-location');
        const flag = person.querySelector('.ot-person-flag');
        gsap.set([photo, image, ...details], { transition: 'none' });
        if (photo) gsap.set(photo, { clipPath: 'inset(100% 0% 0% 0% round 22px)' });
        if (image) gsap.set(image, { scale: 1.35 });
        gsap.set(details, { y: 20, autoAlpha: 0 });
        if (flag) gsap.set(flag, { scale: 0 });
      });

      ScrollTrigger.batch(people, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => {
          batch.forEach((person, index) => {
            const photo = person.querySelector('.ot-person-photo');
            const image = photo?.querySelector('img, .ot-person-placeholder');
            const details = person.querySelectorAll('h3, .ot-person-role, .ot-person-location');
            const flag = person.querySelector('.ot-person-flag');
            gsap
              .timeline({
                delay: index * 0.14,
                onComplete: () => gsap.set([photo, image, ...details, flag].filter(Boolean), { clearProps: CLEAR }),
              })
              .to(photo, { clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: 1.1, ease: 'expo.inOut' })
              .to(image, { scale: 1, duration: 1.5, ease: 'power3.out' }, 0.15)
              .to(details, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08, ease: EASE }, 0.7)
              .to(flag, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, 1);
          });
        },
      });
    }

    // ---------- JOIN US ----------
    wordsIn(q('.ot-join-copy h2')[0], splits);
    reveal(q('.ot-join-copy > p, .ot-join-copy > .ot-btn'), { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.1 }, q('.ot-join-copy')[0]);

    const ways = q('.ot-join-list > li');
    if (ways.length) {
      const icons = q('.ot-join-list .ot-icon-box');
      gsap.set([...ways, ...icons], { transition: 'none' });
      gsap
        .timeline({
          scrollTrigger: { trigger: ways[0], start: 'top 88%', once: true },
          onComplete: () => gsap.set([...ways, ...icons], { clearProps: CLEAR }),
        })
        .from(ways, { x: 70, autoAlpha: 0, duration: 0.9, stagger: 0.14, ease: 'expo.out' })
        .from(icons, { scale: 0, rotation: -140, duration: 0.6, stagger: 0.14, ease: 'back.out(2.2)' }, 0.25);
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
      const target = event.target.closest('.ot-btn, .ot-text-link');
      if (!target) return;
      gsap.fromTo(target, { scale: 0.93 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.45)', clearProps: 'scale' });
    };
    root.addEventListener('pointerdown', onPress);
    cleanups.push(() => root.removeEventListener('pointerdown', onPress));

    if (mouse) {
      // Portraits tilt toward the cursor and lift a little
      people.forEach((person) => {
        const photo = person.querySelector('.ot-person-photo');
        if (!photo) return;
        gsap.set(photo, { transformPerspective: 900 });
        const tiltX = gsap.quickTo(photo, 'rotationX', { duration: 0.5, ease: EASE });
        const tiltY = gsap.quickTo(photo, 'rotationY', { duration: 0.5, ease: EASE });
        const lift = gsap.quickTo(photo, 'y', { duration: 0.45, ease: EASE });
        const move = (event) => {
          const box = photo.getBoundingClientRect();
          tiltY(((event.clientX - box.left) / box.width - 0.5) * 12);
          tiltX(-((event.clientY - box.top) / box.height - 0.5) * 12);
          lift(-8);
        };
        const leave = () => {
          tiltX(0);
          tiltY(0);
          lift(0);
        };
        person.addEventListener('pointermove', move);
        person.addEventListener('pointerleave', leave);
        cleanups.push(() => {
          person.removeEventListener('pointermove', move);
          person.removeEventListener('pointerleave', leave);
        });
      });

      // Soft light follows the cursor across the blue team section
      const teams = q('.ot-teams')[0];
      if (teams) {
        const move = (event) => {
          const box = teams.getBoundingClientRect();
          teams.style.setProperty('--spot-x', `${event.clientX - box.left}px`);
          teams.style.setProperty('--spot-y', `${event.clientY - box.top}px`);
          teams.classList.add('is-lit');
        };
        const leave = () => teams.classList.remove('is-lit');
        teams.addEventListener('pointermove', move);
        teams.addEventListener('pointerleave', leave);
        cleanups.push(() => {
          teams.removeEventListener('pointermove', move);
          teams.removeEventListener('pointerleave', leave);
          teams.classList.remove('is-lit');
        });
      }

      // The team photo tilts gently
      const visual = q('.ot-intro-visual')[0];
      if (visual) {
        gsap.set(visual, { transformPerspective: 1200 });
        const tiltX = gsap.quickTo(visual, 'rotationX', { duration: 0.7, ease: EASE });
        const tiltY = gsap.quickTo(visual, 'rotationY', { duration: 0.7, ease: EASE });
        const move = (event) => {
          const box = visual.getBoundingClientRect();
          tiltY(((event.clientX - box.left) / box.width - 0.5) * 6);
          tiltX(-((event.clientY - box.top) / box.height - 0.5) * 6);
        };
        const leave = () => {
          tiltX(0);
          tiltY(0);
        };
        visual.addEventListener('pointermove', move);
        visual.addEventListener('pointerleave', leave);
        cleanups.push(() => {
          visual.removeEventListener('pointermove', move);
          visual.removeEventListener('pointerleave', leave);
        });
      }
    }

    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      splits.forEach((split) => split.revert());
      if (hero) {
        hero.style.removeProperty('background-position');
      }
    };
  });

  ScrollTrigger.refresh();
  return () => media.revert();
}
