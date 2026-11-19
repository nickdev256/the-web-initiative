// Photos that also have a 1080px-wide copy in /images/sm/ (about 40% of
// the weight). Browsers pick the copy on phones and for small slots, and
// the full photo where it is shown large. When adding a new large photo,
// make its copy (1080px wide) in public/images/sm/ and list it here.
const SMALL_COPIES = new Set([
  'about-hero.jpg',
  'about-history.jpg',
  'about-story-inset.jpg',
  'camps/arm-measurement-check.jpg',
  'camps/blood-pressure-check.jpg',
  'camps/elder-consultation.jpg',
  'camps/lab-blood-sample.jpg',
  'camps/nurse-with-baby.jpg',
  'camps/nutrition-education.jpg',
  'camps/prayer-support.jpg',
  'donate-hero.jpg',
  'donation-hero.jpg',
  'health-screening.jpg',
  'hero-poster.jpg',
  'how-can-i-serve-you.jpg',
  'medical-camp-tents.jpg',
  'medical-team.jpg',
  'outdoor-consultation.jpg',
  'outreach-wheelchair.jpg',
  'services-hero.jpg',
  'who-we-are-inset.jpg',
  'who-we-are-main.jpg',
]);

// The 1080px copy of a photo, or null when it has none
export function smallVersion(src) {
  const path = src.replace(/^\/images\//, '');
  return SMALL_COPIES.has(path) ? `/images/sm/${path}` : null;
}

// Props for an <img>: the photo plus its copy and how wide it is shown
// (`sizes`), so each device downloads only what it needs.
export function responsiveImage(src, sizes = '(max-width: 760px) 100vw, 50vw') {
  const small = smallVersion(src);
  // srcSet and sizes come before src so the browser chooses before it
  // starts downloading
  return small ? { srcSet: `${small} 1080w, ${src} 1600w`, sizes, src } : { src };
}
