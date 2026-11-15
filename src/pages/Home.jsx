
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  ArrowRight,
  Stethoscope,
  Users,
  HandHeart,
  CalendarDays,
  MoveUpRight,
  MapPin,
  Clock,
  Apple,
  Ribbon,
  Droplet,
  Camera,
} from 'lucide-react';

import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { getUpcomingEvents } from '../data/events.js';
import './Home.css';

// The three health issues named in the hero, shown in "Who we are".
const healthPriorities = [
  {
    icon: Apple,
    title: 'Malnutrition',
    description: 'Awareness, early detection and nutrition guidance for families.',
  },
  {
    icon: Ribbon,
    title: 'HIV',
    description: 'Awareness, testing referrals and stigma-free support.',
  },
  {
    icon: Droplet,
    title: 'Sickle cell disease',
    description: 'Awareness, early diagnosis and support for affected families.',
  },
];

const focusAreas = [
  {
    icon: Stethoscope,
    image: '/images/camps/thumbs/lab-blood-sample.jpg',
    imageAlt: 'A team member preparing a blood sample for testing',
    title: 'Medical Services',
    description:
      'Accessible healthcare services shaped around the needs of individuals and communities.',
    link: '/medical-services',
    action: 'Explore services',
  },
  {
    icon: CalendarDays,
    image: '/images/outdoor-consultation.jpg',
    imageAlt: 'A health worker consulting with patients at an outdoor medical camp',
    // Small photo pinned to the corner of the main photo
    noteImage: '/images/outreach-team.jpg',
    noteImageAlt: 'Two members of the medical team smiling together at the camp',
    title: 'Medical Camps',
    description:
      'Community outreach initiatives that bring healthcare closer to the people who need it.',
    link: '/medical-camps',
    action: 'Discover our camps',
  },
  {
    icon: Users,
    image: '/images/medical-team.jpg',
    imageAlt: 'Members of our team smiling together outdoors',
    title: 'Our Team',
    description:
      'Meet the people working together to advance our community healthcare mission.',
    link: '/our-team',
    action: 'Meet our people',
  },
  {
    icon: HandHeart,
    image: '/images/donate-hero.jpg',
    imageAlt: 'A smiling man crouching with two young children outside a brick home',
    // Centres the group in the card; keeps the boy's feet clear of the icon
    imagePosition: '45% center',
    title: 'Make a Difference',
    description:
      'Partner with us and help create meaningful, lasting change in our communities.',
    link: '/donate',
    action: 'Make a Donation',
  },
];

function Home() {
  const upcomingEvents = getUpcomingEvents();

  return (
    <>
      <Navbar /> 

      <main className="home-page">
        {/* HERO */}
        <div className="home-hero-stage"> 
          <section className="home-hero">
            {/* Four camp photos that crossfade and slowly zoom out */}
            <div
              className="home-hero-slides"
              role="img"
              aria-label="Photos from our medical camps: a volunteer nurse holding a baby, a volunteer listening to an elderly woman, a clinician checking a woman's arm, and a lab worker preparing a blood sample"
            >
              <div className="home-hero-slide home-hero-slide-nurse" />
              <div className="home-hero-slide home-hero-slide-elder" />
              <div className="home-hero-slide home-hero-slide-screening" />
              <div className="home-hero-slide home-hero-slide-lab" />
            </div>
            <div className="home-hero-shade" />

            <div className="home-container home-hero-inner">
              <div className="home-hero-copy">
                <h1>
                  Healthier communities{' '}
                  <span>start with care.</span>
                </h1>

                <p className="home-hero-description">
                  Building a healthier future through focused health care and meaningful partnerships 
                  against malnutrition, HIV and sickle cell disease.
                </p>

                <div className="home-hero-actions">
                  <Link
                    to="/about"
                    className="home-btn home-btn-primary"
                  >
                    Discover our work
                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    to="/medical-camps"
                    className="home-btn home-btn-ghost"
                  >
                    Explore medical camps
                  </Link>
                </div>

                <div className="home-hero-trust">
                  <span className="home-trust-icon">
                    <MapPin size={19} aria-hidden="true" />
                  </span>
                  <span>
                    Medical camps and health care across{' '}
                    <strong>Uganda.</strong>
                  </span>
                </div>
              </div>

              <div className="home-hero-side">
                

                
              </div>
            </div>
          </section>
        </div>

        {/* INTRO */}
        <section className="home-intro home-section-layer">
          <div className="home-container home-intro-grid">
            <figure className="home-intro-visual home-reveal">
              <div className="home-intro-photo-main">
                <img
                  src="/images/who-we-are-main.jpg"
                  alt="A clinician measuring a woman's upper arm during malnutrition screening"
                  loading="lazy"
                />
              </div>

              <div className="home-intro-photo-inset">
                <img
                  src="/images/who-we-are-inset.jpg"
                  alt="Our team leading a nutrition education session with mothers and young children"
                  loading="lazy"
                />
              </div>

             
            </figure>

            <div className="home-intro-copy home-reveal">
              <h2>
                Care that meets people{' '}
                <span>where they are.</span>
              </h2>

              <p className="home-intro-lead">
                The Web Initiative is a community-based organisation
                working to reduce, and where possible eliminate,
                malnutrition in children living with sickle cell disease
                and HIV in marginalised communities of Northern Uganda.
              </p>

              <p>
                We empower affected families and individuals towards
                self-sufficiency and good health, and build sustainable,
                healthy communities by promoting healthy habits,
                restoring hope, and sharing knowledge and God’s love.
              </p>

              <ul className="home-intro-priorities">
                {healthPriorities.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.title}>
                      <span className="home-priority-icon">
                        <Icon size={20} aria-hidden="true" />
                      </span>
                      <span>
                        <strong>{item.title}</strong>
                        <span>{item.description}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="home-intro-actions">
                <Link to="/about" className="home-btn home-btn-dark">
                  Get to know us
                  <ArrowRight size={18} />
                </Link>

                <Link to="/our-team" className="home-editorial-link">
                  Meet our team
                  <span>
                    <ArrowRight size={18} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FOCUS AREAS */}
        <section
          className="home-wwd home-section-layer"
          aria-labelledby="home-wwd-title"
        >
          <div className="home-container">
            <div className="home-wwd-header home-reveal">
              <h2 id="home-wwd-title">
                Small actions. <span>Lasting impact.</span>
              </h2>

              <p>
                Explore the ways we work alongside communities to
                support health, encourage collaboration, and create
                opportunities for positive change.
              </p>
            </div>

            <div className="home-wwd-grid">
              {focusAreas.map((area) => {
                const Icon = area.icon;

                return (
                  <Link
                    to={area.link}
                    className="home-wwd-card home-reveal"
                    key={area.title}
                  >
                    <div className="home-wwd-visual">
                      <div className="home-wwd-media">
                        <img
                          src={area.image}
                          alt={area.imageAlt}
                          loading="lazy"
                          style={
                            area.imagePosition
                              ? { objectPosition: area.imagePosition }
                              : undefined
                          }
                        />
                      </div>

                      {area.noteImage && (
                        <span className="home-wwd-note">
                          <img src={area.noteImage} alt={area.noteImageAlt} loading="lazy" />
                        </span>
                      )}
                    </div>

                    <span className="home-wwd-icon" aria-hidden="true">
                      <Icon size={24} strokeWidth={1.8} />
                    </span>

                    <div className="home-wwd-body">
                      <h3>{area.title}</h3>
                      <p>{area.description}</p>

                      <span className="home-wwd-link">
                        {area.action}
                        <ArrowRight size={18} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="home-wwd-footer home-reveal">
              <Link to="/about" className="home-editorial-link">
                Read about our mission
                <span>
                  <ArrowRight size={18} />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* UPCOMING EVENTS */}
        <section
          className="home-events home-section-layer"
          aria-labelledby="home-events-title"
        >
          <div className="home-container">
            <div className="home-events-heading home-reveal">
              <div>
                <h2 id="home-events-title">
                  Upcoming <span>events.</span>
                </h2>
              </div>

              <Link to="/medical-camps" className="home-editorial-link">
                All medical camps
                <span>
                  <ArrowRight size={18} />
                </span>
              </Link>
            </div>

            <figure className="home-events-photo" data-motion="showcase">
              <span className="motion-curtain" aria-hidden="true" />
              <span className="motion-light" aria-hidden="true" />
              <img
                src="/images/how-can-i-serve-you.jpg"
                alt="A smiling man holding a red sign that reads “How can I serve you?”"
                loading="lazy"
              />
            </figure>

            {upcomingEvents.length > 0 ? (
              <ol className="home-events-list">
                {upcomingEvents.map((event) => (
                  <li className="home-event-card home-reveal" key={event.id}>
                    <time
                      className="home-event-date"
                      dateTime={event.date}
                    >
                      <span className="home-event-day">
                        {event.dateValue.getDate()}
                      </span>
                      <span className="home-event-month">
                        {event.dateValue.toLocaleDateString('en-GB', {
                          month: 'short',
                        })}
                      </span>
                      <span className="home-event-year">
                        {event.dateValue.getFullYear()}
                      </span>
                    </time>

                    <div className="home-event-body">
                      {event.category && (
                        <span className="home-event-category">
                          {event.category}
                        </span>
                      )}

                      <h3>{event.title}</h3>

                      {event.description && <p>{event.description}</p>}

                      <div className="home-event-meta">
                        <span>
                          <MapPin size={15} aria-hidden="true" />
                          {event.location}
                        </span>

                        {event.time && (
                          <span>
                            <Clock size={15} aria-hidden="true" />
                            {event.time}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      to={event.link || '/contact'}
                      className="home-event-link"
                      aria-label={`Find out more about ${event.title}`}
                    >
                      <MoveUpRight size={20} />
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="home-events-empty home-reveal">
                <span className="home-card-icon">
                  <CalendarDays size={25} strokeWidth={1.7} />
                </span>

                <div>
                  <h3>New dates are on the way.</h3>
                  <p>
                    We are planning our next community outreach
                    activities. Get in touch to hear about upcoming
                    medical camps or to bring one to your community.
                  </p>
                </div>

                <Link to="/contact" className="home-btn home-btn-dark">
                  Ask about upcoming camps
                  <ArrowRight size={18} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* FEATURE */}
        <section className="home-feature home-section-layer">
          <div className="home-container home-feature-grid">
            <div className="home-feature-copy home-reveal">
              <h2>
                Better health
                <br />
                begins <span> With Us.</span>
              </h2>

              <p>
                Meaningful healthcare goes beyond treatment. It
                starts with listening, building trust, and working
                with communities to understand what matters most.
              </p>

              <Link to="/medical-camps" className="home-btn home-btn-white">
                Explore our outreach
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="home-feature-visual home-reveal">
              <div className="home-feature-photo">
                <img
                  src="/images/camps/blood-pressure-check.jpg"
                  alt="A volunteer checking a woman's blood pressure at a community camp"
                  loading="lazy"
                />
              </div>

              <div className="home-feature-caption">
                <span>AT OUR MEDICAL CAMPS</span>
                <strong>Checking blood pressure, one person at a time.</strong>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;
