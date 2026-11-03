import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './Gallery.css';

// Real photos from our camps: a light thumbnail for the grid and a
// Full HD version for the full-screen viewer.
const campPhoto = (name) => ({
  image: `/images/camps/${name}.jpg`,
  thumb: `/images/camps/thumbs/${name}.jpg`,
});

const galleryItems = [
  {
    ...campPhoto('arm-measurement-check'),
    title: 'Malnutrition screening',
    category: 'Medical Camps',
    description: 'Checking upper-arm measurements to spot early signs of malnutrition.',
  },
  {
    ...campPhoto('nutrition-education'),
    title: 'Nutrition education',
    category: 'Health Education',
    description: 'Sharing practical nutrition advice with mothers and young children.',
  },
  {
    ...campPhoto('child-height-check'),
    title: 'Child growth check',
    category: 'Medical Camps',
    description: "Measuring a child's height to track healthy growth.",
  },
  {
    ...campPhoto('blood-pressure-check'),
    title: 'Blood pressure check',
    category: 'Medical Camps',
    description: 'Routine blood pressure checks during a community camp.',
  },
  {
    ...campPhoto('elder-consultation'),
    title: 'Caring for elders',
    category: 'Community',
    description: "Listening to an elderly patient's health concerns.",
  },
  {
    ...campPhoto('lab-blood-sample'),
    title: 'Laboratory testing',
    category: 'Medical Camps',
    description: 'Preparing blood samples for testing.',
  },
  {
    ...campPhoto('nurse-with-baby'),
    title: 'Caring for the youngest',
    category: 'Community',
    description: 'Comforting a baby during a medical camp.',
  },
  {
    ...campPhoto('team-clinician'),
    title: 'Our team on the ground',
    category: 'Community',
    description: 'One of our clinicians at an outreach site.',
  },
  {
    ...campPhoto('prayer-support'),
    title: 'Prayer and encouragement',
    category: 'Community',
    description: 'Offering prayer and encouragement alongside care.',
  },
  {
    image: '/images/medical-camp-tents.jpg',
    title: 'Camp day',
    category: 'Medical Camps',
    description: 'Families gathering under our medical camp tents.',
  },
  {
    image: '/images/health-screening.jpg',
    title: 'Finger-prick testing',
    category: 'Medical Camps',
    description: 'A quick blood test as part of a health check.',
  },
  {
    image: '/images/camp-village-tents.jpg',
    title: 'Reaching the village',
    category: 'Community',
    description: 'Our camp set up in the heart of a village community.',
  },
  {
    image: '/images/outdoor-consultation.jpg',
    title: 'Outdoor consultations',
    category: 'Medical Camps',
    description: 'Health workers seeing patients in the open air.',
  },
  {
    image: '/images/outreach-wheelchair.jpg',
    title: 'Care for everyone',
    category: 'Community',
    description: 'Helping patients with limited mobility reach care.',
  },
  {
    image: '/images/healthcare-team.jpg',
    title: 'Talking with families',
    category: 'Health Education',
    description: 'Explaining health information to a mother and her child.',
  },
  {
    image: '/images/medical-team.jpg',
    title: 'Working as one team',
    category: 'Health Education',
    description: 'Clinicians and volunteers sharing what they know.',
  },
];

const categories = ['All', 'Medical Camps', 'Community', 'Health Education'];

const countFor = (category) =>
  category === 'All'
    ? galleryItems.length
    : galleryItems.filter((item) => item.category === category).length;

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState(null);
  const lightboxRef = useRef(null);
  const lastTriggerRef = useRef(null);
  const touchStartRef = useRef(null);

  const filteredItems =
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  const selected = openIndex === null ? null : filteredItems[openIndex];
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (direction) =>
      setOpenIndex((index) =>
        index === null ? index : (index + direction + filteredItems.length) % filteredItems.length
      ),
    [filteredItems.length]
  );

  // While the viewer is open: keyboard controls, no page scrolling behind
  // it, and focus returns to the photo that opened it afterwards.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKey = (event) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') step(-1);
      if (event.key === 'ArrowRight') step(1);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    lightboxRef.current?.focus();

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
      lastTriggerRef.current?.focus();
    };
  }, [isOpen, close, step]);

  // Preload the neighbouring photos so arrows feel instant
  useEffect(() => {
    if (openIndex === null) return;
    [1, -1].forEach((direction) => {
      const neighbour =
        filteredItems[(openIndex + direction + filteredItems.length) % filteredItems.length];
      new Image().src = neighbour.image;
    });
  }, [openIndex, filteredItems]);

  const handleTouchStart = (event) => {
    touchStartRef.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartRef.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartRef.current;
    if (Math.abs(distance) > 50) step(distance < 0 ? 1 : -1);
    touchStartRef.current = null;
  };

  return (
    <>
      <Navbar />

      <main className="gallery-page">
        {/* HERO */}
        <section className="gallery-hero">
          <div className="gallery-hero-shade" />

          <div className="gallery-container gallery-hero-content">
            <span className="gallery-kicker gallery-kicker-light">
              <span className="gallery-kicker-dot" />
              OUR GALLERY
            </span>

            <h1>
              Moments that{' '}
              <span className="hand-accent hand-accent--on-dark">
                make a difference.
              </span>
            </h1>

            <p>
              Moments from our medical camps, health education sessions and
              community outreach across Uganda.
            </p>

            <a href="#gallery-photos" className="gallery-btn">
              Explore the photos
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* PHOTOS */}
        <section className="gallery-main" id="gallery-photos" aria-labelledby="gallery-title">
          <div className="gallery-container">
            <div className="gallery-heading">
              <div>
                <span className="gallery-kicker">
                  <span className="gallery-kicker-dot" />
                  OUR WORK IN PICTURES
                </span>
                <h2 id="gallery-title">
                  Every picture{' '}
                  <span className="hand-accent">tells a story.</span>
                </h2>
              </div>

              <div className="gallery-filters" role="group" aria-label="Filter photos">
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    className="gallery-filter"
                    aria-pressed={activeCategory === category}
                    onClick={() => {
                      setActiveCategory(category);
                      setOpenIndex(null);
                    }}
                  >
                    {category}
                    <span>{countFor(category)}</span>
                  </button>
                ))}
              </div>
            </div>

            <ul className="gallery-grid">
              {filteredItems.map((item, index) => (
                <li key={item.image}>
                  <button
                    type="button"
                    className="gallery-photo"
                    aria-label={`View photo: ${item.title}`}
                    onClick={(event) => {
                      lastTriggerRef.current = event.currentTarget;
                      setOpenIndex(index);
                    }}
                  >
                    <img
                      src={item.thumb || item.image}
                      alt={item.description}
                      loading="lazy"
                    />
                    <span className="gallery-photo-caption">
                      <span>{item.category}</span>
                      <strong>{item.title}</strong>
                    </span>
                    <span className="gallery-photo-expand" aria-hidden="true">
                      <Expand size={18} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FULL-SCREEN VIEWER */}
        {selected && (
          <div
            className="gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.title}, photo ${openIndex + 1} of ${filteredItems.length}`}
            ref={lightboxRef}
            tabIndex={-1}
            onClick={(event) => {
              if (event.target === event.currentTarget) close();
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="gallery-lightbox-top">
              <span className="gallery-lightbox-count">
                {openIndex + 1} / {filteredItems.length}
              </span>
              <button
                type="button"
                className="gallery-lightbox-button"
                onClick={close}
                aria-label="Close photo"
              >
                <X size={22} />
              </button>
            </div>

            <button
              type="button"
              className="gallery-lightbox-button gallery-lightbox-prev"
              onClick={() => step(-1)}
              aria-label="Previous photo"
            >
              <ChevronLeft size={26} />
            </button>

            <figure className="gallery-lightbox-figure">
              <img key={selected.image} src={selected.image} alt={selected.description} />
              <figcaption>
                <span>{selected.category}</span>
                <strong>{selected.title}</strong>
                <p>{selected.description}</p>
              </figcaption>
            </figure>

            <button
              type="button"
              className="gallery-lightbox-button gallery-lightbox-next"
              onClick={() => step(1)}
              aria-label="Next photo"
            >
              <ChevronRight size={26} />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
