
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Images,
  HeartPulse,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './Gallery.css';

const galleryItems = [
  {
    image: '/images/medical-camp-tents.jpg',
    title: 'Medical Outreach',
    category: 'Medical Camps',
    description: 'Community-focused medical outreach activities.',
  },
  {
    image: '/images/health-screening.jpg',
    title: 'Health Screening',
    category: 'Medical Camps',
    description: 'Supporting access to health screening services.',
  },
  {
    image: '/images/community-outreach.jpg', 
    title: 'Community Engagement',
    category: 'Community',
    description: 'Working together with local communities.',
  },
  {
    image: '/images/blood-pressure-check.jpg',
    title: 'Health Education',
    category: 'Health Education',
    description: 'Sharing useful health information and awareness.',
  },
  {
    image: '/images/medical-team.jpg',
    title: 'Healthcare Team',
    category: 'Medical Camps',
    description: 'People working together to support community health.',
  },
  {
    image: '/images/outreach-wheelchair.jpg',
    title: 'Community Outreach',
    category: 'Community',
    description: 'Connecting with communities through outreach.',
  },
  {
    image: '/images/camp-village-tents.jpg',
    title: 'Volunteers in Action',
    category: 'Community',
    description: 'Contributing time and effort to community initiatives.',
  },
  {
    image: '/images/outdoor-consultation.jpg',
    title: 'Health Awareness',
    category: 'Health Education',
    description: 'Promoting awareness and informed health decisions.',
  },
  {
    image: '/images/healthcare-team.jpg',
    title: 'Serving Together',
    category: 'Medical Camps',
    description: 'Working towards better access to healthcare.',
  },
];

const categories = ['All Photos', 'Medical Camps', 'Community', 'Health Education'];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All Photos');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredItems =
    activeCategory === 'All Photos'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  function showPrevious() {
    const currentIndex = filteredItems.findIndex(
      (item) => item.image === selectedImage?.image
    );
    const previousIndex =
      (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedImage(filteredItems[previousIndex]);
  }

  function showNext() {
    const currentIndex = filteredItems.findIndex(
      (item) => item.image === selectedImage?.image
    );
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedImage(filteredItems[nextIndex]);
  }

  return (
    <>
      <Navbar />

      <main className="gallery-page">
        <section className="gallery-hero">
          <div className="gallery-hero-shade" />
          <div className="gallery-container gallery-hero-content">
            <span className="gallery-eyebrow">
              <Images size={17} /> OUR GALLERY
            </span>
            <h1>
              Moments That
              <span className="hand-accent"> Make a Difference.</span>
            </h1>
            <p>
              Explore moments from our community initiatives, health education
              activities, and medical outreach programmes.
            </p>
            <a href="#gallery-photos" className="gallery-btn gallery-btn-white">
              Explore Photos <ArrowRight size={18} />
            </a>
          </div>
        </section>

        <section className="gallery-intro gallery-section">
          <div className="gallery-container">
            <div className="gallery-section-heading">
              <span className="gallery-label">OUR WORK IN PICTURES</span>
              <h2>Every picture tells a story.</h2>
              <p>
                A glimpse into the people, activities, and partnerships that
                help bring community-focused initiatives to life.
              </p>
            </div>

            <div className="gallery-filter-list" aria-label="Filter gallery">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={`gallery-filter ${
                    activeCategory === category ? 'active' : ''
                  }`}
                  aria-pressed={activeCategory === category}
                  onClick={() => {
                    setActiveCategory(category);
                    setSelectedImage(null);
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="gallery-photo-grid" id="gallery-photos">
              {filteredItems.map((item, index) => (
                <button
                  type="button"
                  className={`gallery-photo-card gallery-photo-card-${index % 6}`}
                  key={item.image}
                  onClick={() => setSelectedImage(item)}
                  aria-label={`View ${item.title}`}
                >
                  <div className="gallery-photo-image">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="gallery-photo-placeholder">
                      <HeartPulse size={32} />
                      <span>Gallery photo</span>
                    </div>
                    <div className="gallery-photo-overlay">
                      <span>{item.category}</span>
                      <h3>{item.title}</h3>
                      <span className="gallery-view-label">
                        View photo <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <p className="gallery-empty">No photos found in this category.</p>
            )}
          </div>
        </section>

        <section className="gallery-cta">
          <div className="gallery-container gallery-cta-inner">
            <div className="gallery-cta-icon">
              <HeartPulse size={29} />
            </div>
            <div className="gallery-cta-copy">
              <span className="gallery-label">BE PART OF OUR STORY</span>
              <h2>Help us make more moments possible.</h2>
              <p>
                Partner with us or support initiatives focused on community
                wellbeing and access to healthcare.
              </p>
            </div>
            <div className="gallery-cta-actions">
              <Link to="/donate" className="gallery-btn gallery-btn-primary">
                Support Our Work <ArrowRight size={17} />
              </Link>
              <Link to="/contact" className="gallery-text-link">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        <div className="gallery-location">
          <MapPin size={17} />
          <span>THE WEB INITIATIVE LTD · Jinja, Uganda</span>
        </div>

        {selectedImage && (
          <div
            className="gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={selectedImage.title}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedImage(null);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setSelectedImage(null);
              if (event.key === 'ArrowLeft') showPrevious();
              if (event.key === 'ArrowRight') showNext();
            }}
            tabIndex={-1}
          >
            <button
              type="button"
              className="gallery-lightbox-close"
              onClick={() => setSelectedImage(null)}
              aria-label="Close photo"
            >
              <X size={24} />
            </button>

            <button
              type="button"
              className="gallery-lightbox-arrow gallery-lightbox-prev"
              onClick={showPrevious}
              aria-label="Previous photo"
            >
              <ChevronLeft size={28} />
            </button>

            <div className="gallery-lightbox-content">
              <img src={selectedImage.image} alt={selectedImage.title} />
              <div className="gallery-lightbox-caption">
                <span>{selectedImage.category}</span>
                <h2>{selectedImage.title}</h2>
                <p>{selectedImage.description}</p>
              </div>
            </div>

            <button
              type="button"
              className="gallery-lightbox-arrow gallery-lightbox-next"
              onClick={showNext}
              aria-label="Next photo"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
