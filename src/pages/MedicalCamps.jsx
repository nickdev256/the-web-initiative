
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MapPin,
  CalendarDays,
  HeartPulse,
  Users,
  Stethoscope,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './MedicalCamps.css';

const camps = [
  {
    id: 'community-health',
    category: 'Community Healthcare',
    title: 'Community Health Outreach',
    description:
      'Community-focused outreach promoting health awareness and access to appropriate healthcare support.',
    image: '/images/medical-camp-1.jpg',
    location: 'Community location to be announced',
    date: 'Date to be announced',
  },
  {
    id: 'health-awareness',
    category: 'Health Education',
    title: 'Health Awareness Campaign',
    description:
      'Health education and awareness activities designed to encourage informed choices and healthier communities.',
    image: '/images/medical-camp-2.jpg',
    location: 'Community location to be announced',
    date: 'Date to be announced',
  },
  {
    id: 'medical-outreach',
    category: 'Medical Outreach',
    title: 'Community Medical Outreach',
    description:
      'Outreach initiatives that bring communities together around health information, engagement, and support.',
    image: '/images/medical-camp-3.jpg',
    location: 'Community location to be announced',
    date: 'Date to be announced',
  },
];

function MedicalCamps() {
  return (
    <>
      <Navbar />

      <main className="medical-camps-page">
        <section className="mc-hero">
          <div className="mc-hero-overlay" />

          <div className="mc-container mc-hero-content">
            <span className="mc-eyebrow">COMMUNITY OUTREACH</span>

            <h1>Medical Camps</h1>

            <p>
              Promoting healthier communities through medical outreach,
              health education, and community engagement.
            </p>

            <nav className="mc-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <span>Medical Camps</span>
            </nav>
          </div>
        </section>

        <section className="mc-intro mc-section">
          <div className="mc-container mc-intro-grid">
            <div className="mc-intro-content">
              <span className="mc-eyebrow">REACHING COMMUNITIES</span>

              <h2>Bringing health awareness closer to people.</h2>

              <p>
                Medical outreach can help communities learn about health,
                discover available support, and understand where to seek
                appropriate care.
              </p>

              <p>
                The Web Initiative Ltd aims to support community-focused
                initiatives through collaboration, engagement, and
                responsible health awareness activities.
              </p>

              <Link to="/contact" className="mc-primary-link">
                Ask about upcoming camps <ArrowRight size={18} />
              </Link>
            </div>

            <div className="mc-intro-image-wrap">
              <img
                src="/images/medical-camp-1.jpg"
                alt="Community medical outreach"
                className="mc-intro-image"
              />
              <div className="mc-image-badge">
                <HeartPulse size={23} />
                <span>Community wellbeing matters</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mc-listing mc-section">
          <div className="mc-container">
            <div className="mc-section-heading">
              <span className="mc-eyebrow">OUR OUTREACH</span>
              <h2>Explore Medical Camps</h2>
              <p>
                Learn about the kinds of community outreach initiatives
                we focus on. Contact us for confirmed events, locations,
                and schedules.
              </p>
            </div>

            <div className="mc-camp-grid">
              {camps.map((camp) => (
                <article className="mc-camp-card" key={camp.id}>
                  <Link
                    to={`/medical-camps/${camp.id}`}
                    className="mc-camp-image-link"
                    aria-label={`View ${camp.title}`}
                  >
                    <img
                      src={camp.image}
                      alt={camp.title}
                      className="mc-camp-image"
                      loading="lazy"
                    />
                    <span className="mc-camp-category">
                      {camp.category}
                    </span>
                  </Link>

                  <div className="mc-camp-body">
                    <h3>
                      <Link to={`/medical-camps/${camp.id}`}>
                        {camp.title}
                      </Link>
                    </h3>

                    <p>{camp.description}</p>

                    <div className="mc-camp-meta">
                      <span>
                        <MapPin size={16} />
                        {camp.location}
                      </span>

                      <span>
                        <CalendarDays size={16} />
                        {camp.date}
                      </span>
                    </div>

                    <Link
                      to={`/medical-camps/${camp.id}`}
                      className="mc-camp-link"
                    >
                      View details <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <p className="mc-disclaimer">
              The camps shown are illustrative categories, not confirmed
              scheduled events. Please contact the organization for current
              activities and official dates.
            </p>
          </div>
        </section>

        <section className="mc-steps mc-section">
          <div className="mc-container">
            <div className="mc-section-heading">
              <span className="mc-eyebrow">GET INVOLVED</span>
              <h2>How You Can Participate</h2>
              <p>
                Connect with us to learn about outreach activities
                and possible ways to contribute.
              </p>
            </div>

            <div className="mc-steps-grid">
              <article className="mc-step-card">
                <div className="mc-step-icon">
                  <MapPin size={27} />
                </div>
                <span className="mc-step-number">01</span>
                <h3>Find Out</h3>
                <p>
                  Contact us to ask about upcoming outreach activities
                  and confirmed locations.
                </p>
              </article>

              <article className="mc-step-card">
                <div className="mc-step-icon">
                  <Users size={27} />
                </div>
                <span className="mc-step-number">02</span>
                <h3>Connect</h3>
                <p>
                  Discuss community needs, participation, and
                  opportunities to collaborate.
                </p>
              </article>

              <article className="mc-step-card">
                <div className="mc-step-icon">
                  <Stethoscope size={27} />
                </div>
                <span className="mc-step-number">03</span>
                <h3>Get Involved</h3>
                <p>
                  Learn how to support suitable community health
                  initiatives and outreach activities.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="mc-cta">
          <div className="mc-container mc-cta-content">
            <div>
              <span className="mc-eyebrow">STAY CONNECTED</span>
              <h2>Interested in our medical outreach?</h2>
              <p>
                Contact our team for information about our activities,
                partnerships, and upcoming community initiatives.
              </p>
            </div>

            <div className="mc-cta-actions">
              <Link to="/contact" className="mc-button mc-button-white">
                Contact Us <ArrowRight size={18} />
              </Link>

              <Link
                to="/medical-services"
                className="mc-button mc-button-outline"
              >
                Medical Services
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default MedicalCamps;
