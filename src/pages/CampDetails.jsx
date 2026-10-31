
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
  Info,
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
    image: '/images/medical-camp-tents.jpg',
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
    image: '/images/health-screening.jpg',
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
    image: '/images/outdoor-consultation.jpg',
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

        <main className="camp-details-page">
          <section className="cd-not-found">
            <div className="cd-container">
              <span className="cd-icon-box cd-icon-box-lg">
                <HeartPulse size={30} aria-hidden="true" />
              </span>
              <h1>Camp information unavailable</h1>
              <p>
                We could not find the camp you are looking for. Please
                return to the medical camps page.
              </p>
              <Link to="/medical-camps" className="cd-btn cd-btn-dark">
                <ArrowLeft size={18} aria-hidden="true" />
                Back to Medical Camps
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  const otherCamps = Object.entries(camps).filter(([key]) => key !== id);

  return (
    <>
      <Navbar />

      <main className="camp-details-page">
        {/* HERO */}
        <section
          className="cd-hero"
          style={{ '--cd-hero-image': `url(${camp.image})` }}
        >
          <div className="cd-hero-shade" />

          <div className="cd-container cd-hero-content">
            <Link to="/medical-camps" className="cd-back-link">
              <ArrowLeft size={17} aria-hidden="true" />
              All medical camps
            </Link>

            <span className="cd-kicker cd-kicker-light">
              <span className="cd-kicker-dot" />
              {camp.category}
            </span>

            <h1>{camp.title}</h1>

            <p>{camp.description}</p>

            <ul className="cd-hero-meta">
              <li>
                <CalendarDays size={18} aria-hidden="true" />
                {camp.date}
              </li>
              <li>
                <MapPin size={18} aria-hidden="true" />
                {camp.location}
              </li>
            </ul>
          </div>
        </section>

        {/* DETAILS */}
        <section className="cd-details">
          <div className="cd-container cd-details-grid">
            <article className="cd-main">
              <figure className="cd-photo">
                <img src={camp.image} alt={camp.title} />
              </figure>

              <span className="cd-kicker">
                <span className="cd-kicker-dot" />
                ABOUT THIS CAMP
              </span>

              <h2>
                Supporting community health{' '}
                <span className="hand-accent">and wellbeing.</span>
              </h2>

              <p className="cd-lead">{camp.overview}</p>

              <p>
                The Web Initiative Ltd aims to support community-focused
                initiatives through engagement, awareness and
                collaboration. Please contact us to confirm the status of
                any specific activity.
              </p>

              <div className="cd-expect">
                <h3>What to expect</h3>

                <ul className="cd-expect-list">
                  {camp.activities.map((activity) => (
                    <li key={activity}>
                      <CheckCircle2 size={20} aria-hidden="true" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cd-note">
                <Info size={22} aria-hidden="true" />
                <p>
                  Activities depend on available resources and confirmed
                  partnerships. Medical assessment and treatment are
                  provided by qualified healthcare professionals.
                </p>
              </div>
            </article>

            <aside className="cd-sidebar">
              <div className="cd-info-card">
                <span className="cd-kicker">
                  <span className="cd-kicker-dot" />
                  CAMP INFORMATION
                </span>

                <h3>Event details</h3>

                <ul className="cd-info-list">
                  <li>
                    <span className="cd-icon-box">
                      <CalendarDays size={21} aria-hidden="true" />
                    </span>
                    <span>
                      <strong>Date</strong>
                      <span>{camp.date}</span>
                    </span>
                  </li>
                  <li>
                    <span className="cd-icon-box">
                      <MapPin size={21} aria-hidden="true" />
                    </span>
                    <span>
                      <strong>Location</strong>
                      <span>{camp.location}</span>
                    </span>
                  </li>
                  <li>
                    <span className="cd-icon-box">
                      <Users size={21} aria-hidden="true" />
                    </span>
                    <span>
                      <strong>Participation</strong>
                      <span>Contact us for current arrangements.</span>
                    </span>
                  </li>
                </ul>

                <Link to="/contact" className="cd-btn cd-btn-dark cd-btn-full">
                  Enquire about this camp
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>

                <p className="cd-small-note">
                  Dates, venues and participation details are confirmed
                  by our team.
                </p>
              </div>

              <div className="cd-support-card">
                <HandHeart size={30} aria-hidden="true" />
                <h3>Help this camp reach more families.</h3>
                <p>
                  Your support helps us bring health checks, screening and
                  education to children and families who need them.
                </p>
                <Link to="/donate" className="cd-btn btn-support cd-btn-full">
                  Make a Donation
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {/* OTHER CAMPS */}
        <section className="cd-more" aria-labelledby="cd-more-title">
          <div className="cd-container">
            <div className="cd-heading">
              <div>
                <span className="cd-kicker">
                  <span className="cd-kicker-dot" />
                  MORE OUTREACH
                </span>
                <h2 id="cd-more-title">
                  Explore other{' '}
                  <span className="hand-accent">medical camps.</span>
                </h2>
              </div>
              <Link to="/medical-camps" className="cd-text-link">
                View all camps
                <span>
                  <ArrowRight size={18} aria-hidden="true" />
                </span>
              </Link>
            </div>

            <div className="cd-more-grid">
              {otherCamps.map(([key, other]) => (
                <Link to={`/medical-camps/${key}`} className="cd-more-card" key={key}>
                  <div className="cd-more-photo">
                    <img src={other.image} alt="" loading="lazy" />
                  </div>
                  <div className="cd-more-body">
                    <span className="cd-more-category">{other.category}</span>
                    <h3>{other.title}</h3>
                    <p>{other.description}</p>
                    <span className="cd-more-link">
                      View details
                      <ArrowRight size={17} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default CampDetails;
