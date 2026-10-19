
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  HeartPulse,
  Stethoscope,
  Users,
  HandHeart,
  CalendarDays,
  ShieldCheck,
  Activity,
  MoveUpRight,
  Plus,
} from 'lucide-react';

import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './Home.css';

const focusAreas = [
  {
    number: '01',
    icon: Stethoscope,
    title: 'Medical Services',
    description:
      'Accessible healthcare services shaped around the needs of individuals and communities.',
    link: '/medical-services',
    action: 'Explore services',
  },
  {
    number: '02',
    icon: CalendarDays,
    title: 'Medical Camps',
    description:
      'Community outreach initiatives that bring healthcare closer to the people who need it.',
    link: '/medical-camps',
    action: 'Discover our camps',
  },
  {
    number: '03',
    icon: Users,
    title: 'Our Team',
    description:
      'Meet the people working together to advance our community healthcare mission.',
    link: '/our-team',
    action: 'Meet our people',
  },
  {
    number: '04',
    icon: HandHeart,
    title: 'Make a Difference',
    description:
      'Partner with us and help create meaningful, lasting change in our communities.',
    link: '/donate',
    action: 'Support our work',
  },
];

function Home() {
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
        {/* HERO: stays pinned as the page begins to scroll */}
        <div className="home-hero-stage">
          <section className="home-hero">
            <div className="home-hero-image" />
            <div className="home-hero-shade" />

            <div className="home-container home-hero-inner">
              <div className="home-hero-copy">
                <div className="home-kicker home-kicker-light">
                  <span className="home-kicker-dot" />
                  COMMUNITY HEALTH · COMPASSION · ACTION
                </div>

                <h1>
                  Healthier
                  <br />
                  communities
                  <br />
                  <span>start with care.</span>
                </h1>

                <p className="home-hero-description">
                  Building a healthier future through community-focused
                  healthcare, medical outreach, and meaningful
                  partnerships that put people first.
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
                    <HeartPulse size={19} />
                  </span>
                  <span>
                    People-first care.
                    <strong> Community-led impact.</strong>
                  </span>
                </div>
              </div>

              <div className="home-hero-side">
                <div className="home-hero-vertical-label">
                  CARE THAT CONNECTS US
                </div>

                <div className="home-hero-photo-caption">
                  <span className="home-photo-caption-icon">
                    <Plus size={20} />
                  </span>
                  <div>
                    <strong>Care beyond boundaries</strong>
                    <span>For every community</span>
                  </div>
                  <HeartPulse size={24} />
                </div>
              </div>
            </div>

            <div className="home-scroll-indicator">
              <span>SCROLL TO EXPLORE</span>
              <span className="home-scroll-line" />
            </div>

            <div className="home-hero-index">
              <span>01</span>
              <span className="home-index-divider" />
              <span>04</span>
            </div>
          </section>
        </div>

        {/* INTRO: slides over the pinned hero */}
        <section className="home-intro home-section-layer">
          <div className="home-container home-intro-grid">
            <div className="home-intro-visual home-reveal">
              <div className="home-intro-image-wrap">
                <img
                  src="/images/healthcare-team.jpg"
                  alt="Healthcare professionals supporting community wellbeing"
                  className="home-intro-image"
                />

                <div className="home-image-tag">
                  <span className="home-tag-pulse" />
                  PEOPLE FIRST, ALWAYS
                </div>
              </div>

              <div className="home-floating-note">
                <div className="home-floating-icon">
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <strong>Care with purpose</strong>
                  <span>Every person matters.</span>
                </div>
                <HeartPulse
                  className="home-floating-heart"
                  size={27}
                />
              </div>

              <div className="home-image-decoration">
                <Plus size={25} />
                <Plus size={25} />
                <Plus size={25} />
                <Plus size={25} />
              </div>
            </div>

            <div className="home-intro-copy home-reveal">
              <div className="home-kicker">
                <span className="home-kicker-dot" />
                WHO WE ARE
              </div>

              <h2>
                Care that meets people
                <span> where they are.</span>
              </h2>

              <p>
                The Web Initiative Ltd is committed to advancing
                community wellbeing through healthcare services,
                medical outreach, and initiatives that respond to
                people's needs.
              </p>

              <p>
                We believe lasting change begins when people,
                communities, and partners work together towards
                a healthier future.
              </p>

              <Link to="/about" className="home-editorial-link">
                Get to know us
                <span>
                  <ArrowRight size={18} />
                </span>
              </Link>

              <div className="home-intro-values">
                <div>
                  <HeartPulse size={21} />
                  <span>Compassion</span>
                </div>
                <div>
                  <Users size={21} />
                  <span>Community</span>
                </div>
                <div>
                  <Activity size={21} />
                  <span>Wellbeing</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOCUS: left heading stays pinned while cards scroll */}
        <section className="home-focus home-section-layer">
          <div className="home-container home-focus-layout">
            <div className="home-focus-intro">
              <div className="home-focus-sticky">
                <div className="home-kicker">
                  <span className="home-kicker-dot" />
                  WHAT WE DO
                </div>

                <h2>
                  Small actions.
                  <br />
                  <span>Lasting impact.</span>
                </h2>

                <p>
                  Explore the ways we work alongside communities
                  to support health, encourage collaboration,
                  and create opportunities for positive change.
                </p>

                <Link to="/about" className="home-editorial-link">
                  Our mission
                  <span>
                    <ArrowRight size={18} />
                  </span>
                </Link>

                <div className="home-focus-progress">
                  <div className="home-progress-mark">
                    <HeartPulse size={21} />
                  </div>
                  <span>Healthier communities, together.</span>
                </div>
              </div>
            </div>

            <div className="home-focus-list">
              {focusAreas.map((area, index) => {
                const Icon = area.icon;

                return (
                  <article
                    className={`home-focus-card home-reveal home-focus-card-${index + 1}`}
                    key={area.title}
                  >
                    <div className="home-focus-card-top">
                      <span className="home-card-number">
                        {area.number}
                      </span>

                      <span className="home-card-icon">
                        <Icon size={25} strokeWidth={1.7} />
                      </span>
                    </div>

                    <div className="home-focus-card-content">
                      <h3>{area.title}</h3>
                      <p>{area.description}</p>

                      <Link to={area.link} className="home-focus-link">
                        {area.action}
                        <MoveUpRight size={18} />
                      </Link>
                    </div>

                    <div className="home-card-watermark">
                      <Icon size={115} strokeWidth={0.7} />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* FEATURE: layered image and text composition */}
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
                Support our work
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
