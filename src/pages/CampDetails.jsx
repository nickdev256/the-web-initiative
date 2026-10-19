
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
  HeartPulse,
  Users,
  HandHeart,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './CampDetails.css';

const camps = {
  'community-health': {
    category: 'Community Healthcare',
    title: 'Community Health Outreach',
    description:
      'Community-focused outreach that promotes health awareness and helps people learn about available healthcare support.',
    image: '/images/medical-camp-1.jpg',
    location: 'Location to be confirmed',
    date: 'Date to be announced',
    overview:
      'Community health outreach creates opportunities to share health information, listen to local concerns, and connect people with appropriate support.',
    activities: [
      'Community health education and awareness',
      'Sharing information about available healthcare services',
      'Engaging community members and local partners',
      'Providing guidance on where to seek appropriate care',
    ],
  },
  'health-awareness': {
    category: 'Health Education',
    title: 'Health Awareness Campaign',
    description:
      'Health education activities designed to encourage informed decisions and healthier everyday practices.',
    image: '/images/medical-camp-2.jpg',
    location: 'Location to be confirmed',
    date: 'Date to be announced',
    overview:
      'Health awareness initiatives help communities access useful information and understand practices that can support their wellbeing.',
    activities: [
      'Sharing practical health information',
      'Encouraging preventive health awareness',
      'Community discussions and engagement',
      'Connecting people with relevant health resources',
    ],
  },
  'medical-outreach': {
    category: 'Medical Outreach',
    title: 'Community Medical Outreach',
    description:
      'Community outreach initiatives centred on health information, collaboration, and access to appropriate support.',
    image: '/images/medical-camp-3.jpg',
    location: 'Location to be confirmed',
    date: 'Date to be announced',
    overview:
      'Medical outreach initiatives can bring community members and relevant partners together to identify needs and explore suitable healthcare support.',
    activities: [
      'Community engagement and needs assessment',
      'Health information and awareness activities',
      'Coordination with relevant healthcare partners',
      'Sharing information about available services',
    ],
  },
};

function CampDetails() {
  const { id } = useParams();
  const camp = camps[id];

  if (!camp) {
    return (
      <>
        <Navbar />

        <main className="cd-not-found">
          <div className="cd-container">
            <HeartPulse size={48} />
            <h1>Camp information unavailable</h1>
            <p>
              We could not find the camp you are looking for.
              Please return to the medical camps page.
            </p>
            <Link to="/medical-camps" className="cd-button cd-button-primary">
              <ArrowLeft size={18} /> Back to Medical Camps
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="camp-details-page">
        <section className="cd-hero">
          <div className="cd-hero-overlay" />

          <div className="cd-container cd-hero-content">
            <Link to="/medical-camps" className="cd-back-link">
              <ArrowLeft size={17} /> All Medical Camps
            </Link>

            <span className="cd-eyebrow">{camp.category}</span>

            <h1>{camp.title}</h1>

            <p>{camp.description}</p>

            <nav className="cd-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/medical-camps">Medical Camps</Link>
              <span>/</span>
              <span>{camp.title}</span>
            </nav>
          </div>
        </section>

        <section className="cd-section">
          <div className="cd-container cd-main-grid">
            <article className="cd-main-content">
              <div className="cd-image-wrap">
                <img src={camp.image} alt={camp.title} />
              </div>

              <span className="cd-eyebrow">ABOUT THIS INITIATIVE</span>

              <h2>Supporting community health and wellbeing</h2>

              <p>{camp.overview}</p>

              <p>
                The Web Initiative Ltd aims to support community-focused
                initiatives through engagement, awareness, and collaboration.
                Please contact the organization to confirm the status and
                availability of any specific activity.
              </p>

              <div className="cd-activities">
                <h3>Areas of focus</h3>

                <ul>
                  {camp.activities.map((activity) => (
                    <li key={activity}>
                      <CheckCircle2 size={20} />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cd-note">
                <HeartPulse size={24} />
                <p>
                  Activities depend on available resources and confirmed
                  partnerships. Medical assessment and treatment should be
                  provided by appropriately qualified healthcare professionals.
                </p>
              </div>
            </article>

            <aside className="cd-sidebar">
              <div className="cd-info-card">
                <span className="cd-eyebrow">CAMP INFORMATION</span>

                <h3>Event details</h3>

                <div className="cd-info-item">
                  <span className="cd-info-icon">
                    <CalendarDays size={21} />
                  </span>
                  <div>
                    <strong>Date</strong>
                    <p>{camp.date}</p>
                  </div>
                </div>

                <div className="cd-info-item">
                  <span className="cd-info-icon">
                    <MapPin size={21} />
                  </span>
                  <div>
                    <strong>Location</strong>
                    <p>{camp.location}</p>
                  </div>
                </div>

                <div className="cd-info-item">
                  <span className="cd-info-icon">
                    <Users size={21} />
                  </span>
                  <div>
                    <strong>Participation</strong>
                    <p>Contact us for current arrangements.</p>
                  </div>
                </div>

                <Link
                  to="/contact"
                  className="cd-button cd-button-primary cd-full-button"
                >
                  Enquire About This Camp <ArrowRight size={18} />
                </Link>

                <p className="cd-small-note">
                  Date, venue, and participation details must be confirmed
                  with the organization.
                </p>
              </div>

              <div className="cd-help-card">
                <HandHeart size={30} />
                <h3>Want to support our work?</h3>
                <p>
                  Contact our team to discuss potential partnerships,
                  volunteering, or support for community initiatives.
                </p>
                <Link to="/donate" className="cd-text-link">
                  Ways to support us <ArrowRight size={17} />
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <section className="cd-bottom-cta">
          <div className="cd-container cd-bottom-content">
            <div>
              <span className="cd-eyebrow">GET IN TOUCH</span>
              <h2>Let's work together for healthier communities.</h2>
              <p>
                Contact The Web Initiative Ltd to learn more about our
                community initiatives and opportunities to collaborate.
              </p>
            </div>

            <Link to="/contact" className="cd-button cd-button-white">
              Contact Our Team <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default CampDetails;
