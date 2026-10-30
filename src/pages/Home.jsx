
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  ArrowRight,
  HeartPulse,
  Stethoscope,
  Users,
  HandHeart,
  CalendarDays,
  MoveUpRight,
  Plus,
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

// Hero background video in public/videos/: a 540p file for laptops and a
// sharper 720p file for large or high-resolution screens. If neither
// loads, the poster photo is shown instead.
const HERO_VIDEO = '/videos/hero.mp4';
const HERO_VIDEO_HD = '/videos/hero-720.mp4';
const HERO_POSTER = '/images/healthcare-team.jpg';

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
    title: 'Medical Camps',
    description:
      'Community outreach initiatives that bring healthcare closer to the people who need it.',
    link: '/medical-camps',
    action: 'Discover our camps',
  },
  {
    icon: Users,
    image: '/images/medical-team.jpg',
    imageAlt: 'Members of our healthcare team talking together',
    title: 'Our Team',
    description:
      'Meet the people working together to advance our community healthcare mission.',
    link: '/our-team',
    action: 'Meet our people',
  },
  {
    icon: HandHeart,
    image: '/images/donate-hero.jpg',
    imageAlt: 'A health worker caring for a smiling child at sunset',
    imagePosition: '80% center',
    title: 'Make a Difference',
    description:
      'Partner with us and help create meaningful, lasting change in our communities.',
    link: '/donate',
    action: 'Make a Donation',
  },
];

function Home() {
  const upcomingEvents = getUpcomingEvents();
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Skip the video for visitors who asked for less motion, phones (to
    // save mobile data) and data-saver mode; they see the poster photo.
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const smallScreen = window.matchMedia('(max-width: 760px)').matches;
    const saveData = navigator.connection?.saveData === true;

    if (reduceMotion || smallScreen || saveData) return;

    const renderedWidth = window.innerWidth * (window.devicePixelRatio || 1);
    video.src = renderedWidth > 1920 ? HERO_VIDEO_HD : HERO_VIDEO;
    video.play().catch(() => setVideoPlaying(false));
  }, []);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  useEffect(() => {
    const elements = document.querySelectorAll('.home-reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -35px 0px',
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />

      <main className="home-page">
        {/* HERO */}
        <div className="home-hero-stage"> 
          <section className="home-hero">
            <div className="home-hero-image" />
            <video
              ref={videoRef}
              className={`home-hero-video ${videoReady ? 'is-ready' : ''}`}
              poster={HERO_POSTER}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              onPlaying={() => setVideoReady(true)}
              onPlay={() => setVideoPlaying(true)}
              onPause={() => setVideoPlaying(false)}
              onError={() => setVideoReady(false)}
            />
            <div className="home-hero-shade" />

            <div className="home-container home-hero-inner">
              <div className="home-hero-copy">
                <div className="home-kicker home-kicker-light">
                  <span className="home-kicker-dot" />
                  THE WEB INITIATIVE · COMMUNITY HEALTH
                </div>

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
                    Medical camps and health education across{' '}
                    <strong>Jinja, Uganda.</strong>
                  </span>
                </div>
              </div>

              <div className="home-hero-side">
                

                
              </div>
            </div>

            <div className="home-scroll-indicator">
              
             
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
              <div className="home-kicker">
                <span className="home-kicker-dot" />
                WHO WE ARE
              </div>

              <h2>
                Care that meets people{' '}
                <span>where they are.</span>
              </h2>

              <p className="home-intro-lead">
               The web is a community-based organization that intends to lower or possibly eliminate 
               malnutrition in children battling with sickle cell and HIV in the marginalized parts of 
               northern Uganda. 
              </p>

              <p>
                We intend to empower the afflicted families and individuals towards 
               self-sufficiency and optimal health, have a sustainable healthy community through promotion 
               of health habits, restoring hope, sharing knowledge and God’s love to enable a fulfilled life.
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
              <div className="home-kicker">
                <span className="home-kicker-dot" />
                WHAT WE DO
              </div>

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
                <div className="home-kicker">
                  <span className="home-kicker-dot" />
                  WHAT'S COMING UP
                </div>

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
              <div className="home-kicker home-kicker-light">
                <span className="home-kicker-dot" />
                COMMUNITY AT THE HEART
              </div>

              <h2>
                Better health
                <br />
                begins <span>together.</span>
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
                  src="/images/community-outreach.jpg"
                  alt="Community health outreach and patient support"
                  loading="lazy"
                />
              </div>

              <div className="home-feature-stamp">
                <HeartPulse size={31} />
                <span>Care</span>
                <span>Connect</span>
                <span>Change</span>
              </div>

              <div className="home-feature-caption">
                <span>01 / OUR APPROACH</span>
                <strong>Putting people at the centre of care.</strong>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="home-cta home-section-layer">
          <div className="home-container home-cta-inner home-reveal">
            <div className="home-cta-symbol">
              <HandHeart size={38} strokeWidth={1.5} />
            </div>

            <div className="home-cta-copy">
              <div className="home-kicker home-kicker-light">
                BE PART OF THE CHANGE
              </div>

              <h2>
                A healthier future
                <br />
                is something we build <span>together.</span>
              </h2>

              <p>
                Join us in supporting community wellbeing.
                Let's connect, collaborate, and make a difference.
              </p>
            </div>

            <div className="home-cta-actions">
              <Link to="/contact" className="home-btn home-btn-white">
                Talk to our team
                <ArrowRight size={18} />
              </Link>

              <Link to="/donate" className="home-cta-secondary">
                Make a Donation
              </Link>
            </div>

            <div className="home-cta-decoration">
              <Plus size={32} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;
