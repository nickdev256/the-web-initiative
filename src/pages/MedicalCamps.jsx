import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MapPin,
  CalendarDays,
  Users,
  Stethoscope,
  Ruler,
  HeartPulse,
  Microscope,
  Apple,
  MessageCircle,
  HandHeart,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './MedicalCamps.css';

// What a visit to one of our camps looks like, shown with real camp photos.
const activities = [
  {
    icon: HeartPulse,
    title: 'Health checks',
    text: 'Blood pressure and general checks with our volunteer clinicians.',
    image: '/images/camps/thumbs/blood-pressure-check.jpg',
    alt: 'A volunteer checking a woman’s blood pressure at a camp',
  },
  {
    icon: Ruler,
    title: 'Growth monitoring',
    text: 'Measuring children’s height and growth to spot malnutrition early.',
    image: '/images/camps/thumbs/child-height-check.jpg',
    alt: 'A clinician measuring a child’s height',
    position: 'center 18%',
  },
  {
    icon: Microscope,
    title: 'Laboratory screening',
    text: 'Blood tests that help guide each child’s care.',
    image: '/images/camps/thumbs/lab-blood-sample.jpg',
    alt: 'A team member preparing a blood sample for testing',
  },
  {
    icon: Apple,
    title: 'Nutrition education',
    text: 'Practical advice for families on healthy eating.',
    image: '/images/camps/thumbs/nutrition-education.jpg',
    alt: 'Our team leading a nutrition session with mothers and children',
  },
];

const camps = [
  {
    id: 'community-health',
    category: 'Community Healthcare',
    title: 'Community Health Outreach',
    description:
      'Community-focused outreach promoting health awareness and access to appropriate healthcare support.',
    image: '/images/medical-camp-tents.jpg',
  },
  {
    id: 'health-awareness',
    category: 'Health Education',
    title: 'Health Awareness Campaign',
    description:
      'Health education and awareness activities that encourage informed choices and healthier communities.',
    image: '/images/health-screening.jpg',
  },
  {
    id: 'medical-outreach',
    category: 'Medical Outreach',
    title: 'Community Medical Outreach',
    description:
      'Outreach that brings communities together around health information, engagement and support.',
    image: '/images/outdoor-consultation.jpg',
  },
];

const steps = [
  {
    icon: MessageCircle,
    title: 'Find out',
    text: 'Contact us to ask about upcoming camps and confirmed locations.',
  },
  {
    icon: Users,
    title: 'Connect',
    text: 'Tell us about your community’s needs, or how you would like to take part.',
  },
  {
    icon: HandHeart,
    title: 'Get involved',
    text: 'Volunteer, partner with us or support a camp so it can reach more families.',
  },
];

function MedicalCamps() {
  return (
    <>
      <Navbar />

      <main className="medical-camps-page">
        {/* HERO */}
        <section className="mc-hero">
          <div className="mc-hero-slideshow" aria-hidden="true">
            <div className="mc-hero-slide mc-hero-slide-one" />
            <div className="mc-hero-slide mc-hero-slide-two" />
          </div>
          <div className="mc-hero-shade" />

          <div className="mc-container mc-hero-content">
            <span className="mc-kicker mc-kicker-light">
              <span className="mc-kicker-dot" />
              COMMUNITY OUTREACH
            </span>

            <h1>
              Medical camps that bring care{' '}
              <span className="hand-accent hand-accent--on-dark">
                closer to home.
              </span>
            </h1>

            <p>
              We take health checks, screening and education directly to
              children and families in marginalised communities of
              Northern Uganda.
            </p>

            <div className="mc-hero-actions">
              <Link to="/contact" className="mc-btn mc-btn-light">
                Ask about upcoming camps
                <ArrowRight size={18} />
              </Link>
              <Link to="/donate" className="mc-btn btn-support">
                Make a Donation
              </Link>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="mc-intro">
          <div className="mc-container mc-intro-grid">
            <div className="mc-intro-copy">
              <span className="mc-kicker">
                <span className="mc-kicker-dot" />
                REACHING COMMUNITIES
              </span>

              <h2>
                Bringing health care{' '}
                <span className="hand-accent">closer to people.</span>
              </h2>

              <p className="mc-lead">
                For many families, the nearest clinic is a long and costly
                journey away. Our medical camps go to them.
              </p>

              <p>
                Each camp is a chance to check on children’s health, look
                out for signs of malnutrition, and help families affected
                by sickle cell disease and HIV understand where to seek
                further care.
              </p>

              <Link to="/medical-services" className="mc-text-link">
                See our medical services
                <span>
                  <ArrowRight size={18} />
                </span>
              </Link>
            </div>

            <figure className="mc-intro-visual">
              <div className="mc-intro-photo">
                <img
                  src="/images/camps/thumbs/arm-measurement-check.jpg"
                  alt="A clinician measuring a woman’s arm during a health check at a camp"
                  loading="lazy"
                />
              </div>

              <figcaption className="mc-intro-badge">
                <span className="mc-icon-box">
                  <Stethoscope size={22} aria-hidden="true" />
                </span>
                <span>
                  <strong>Health checks on the day</strong>
                  <span>Our team checks and advises visitors.</span>
                </span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* WHAT HAPPENS AT A CAMP (deep blue) */}
        <section className="mc-activities" aria-labelledby="mc-activities-title">
          <div className="mc-container">
            <div className="mc-heading mc-heading-center">
              <span className="mc-kicker mc-kicker-light">
                <span className="mc-kicker-dot" />
                AT A CAMP
              </span>
              <h2 id="mc-activities-title">
                What happens at{' '}
                <span className="hand-accent hand-accent--on-dark">
                  our camps.
                </span>
              </h2>
              <p>
                Photos from our camps, showing the care families
                receive on the day.
              </p>
            </div>

            <div className="mc-activity-grid">
              {activities.map((item) => {
                const Icon = item.icon;

                return (
                  <article className="mc-activity-card" key={item.title}>
                    <div className="mc-activity-photo">
                      <img
                        src={item.image}
                        alt={item.alt}
                        loading="lazy"
                        style={item.position ? { objectPosition: item.position } : undefined}
                      />
                    </div>
                    <div className="mc-activity-body">
                      <span className="mc-icon-box">
                        <Icon size={22} aria-hidden="true" />
                      </span>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* TYPES OF CAMP */}
        <section className="mc-listing" aria-labelledby="mc-listing-title">
          <div className="mc-container">
            <div className="mc-heading mc-heading-split">
              <div>
                <span className="mc-kicker">
                  <span className="mc-kicker-dot" />
                  OUR OUTREACH
                </span>
                <h2 id="mc-listing-title">
                  Explore our{' '}
                  <span className="hand-accent">medical camps.</span>
                </h2>
              </div>
              <p>
                The kinds of outreach we run. Dates and locations are
                shared once each camp is confirmed.
              </p>
            </div>

            <div className="mc-camp-grid">
              {camps.map((camp) => (
                <article className="mc-camp-card" key={camp.id}>
                  <Link
                    to={`/medical-camps/${camp.id}`}
                    className="mc-camp-photo"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <img src={camp.image} alt="" loading="lazy" />
                    <span className="mc-camp-category">{camp.category}</span>
                  </Link>

                  <div className="mc-camp-body">
                    <h3>
                      <Link to={`/medical-camps/${camp.id}`}>{camp.title}</Link>
                    </h3>
                    <p>{camp.description}</p>

                    <ul className="mc-camp-meta">
                      <li>
                        <MapPin size={17} aria-hidden="true" />
                        Location to be announced
                      </li>
                      <li>
                        <CalendarDays size={17} aria-hidden="true" />
                        Date to be announced
                      </li>
                    </ul>

                    <Link
                      to={`/medical-camps/${camp.id}`}
                      className="mc-camp-link"
                      aria-label={`View details: ${camp.title}`}
                    >
                      View details
                      <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* GET INVOLVED */}
        <section className="mc-involve" aria-labelledby="mc-involve-title">
          <div className="mc-container mc-involve-grid">
            <div className="mc-involve-copy">
              <span className="mc-kicker">
                <span className="mc-kicker-dot" />
                GET INVOLVED
              </span>
              <h2 id="mc-involve-title">
                Help a camp{' '}
                <span className="hand-accent">reach more families.</span>
              </h2>
              <p>
                Whether you are a community leader, a health worker or a
                supporter, there is a place for you at our next camp.
              </p>
              <Link to="/contact" className="mc-btn mc-btn-dark">
                Contact our team
                <ArrowRight size={18} />
              </Link>
            </div>

            <ol className="mc-steps">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <li key={step.title}>
                    <span className="mc-icon-box">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <div>
                      <span className="mc-step-number">
                        Step {String(index + 1).padStart(2, '0')}
                      </span>
                      <strong>{step.title}</strong>
                      <p>{step.text}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default MedicalCamps;
