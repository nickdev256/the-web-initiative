
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  HeartPulse,
  Users,
  HandHeart,
  Target,
  Eye,
  CheckCircle2,
  Stethoscope,
  Handshake,
  Lightbulb,
  ShieldCheck,
  MapPin,
} from 'lucide-react';

import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './About.css';

// Facts taken from what the organisation already states on the site.
const glance = [
  {
    icon: MapPin,
    label: 'Where we work',
    text: 'Based in Jinja, Uganda, reaching nearby communities.',
  },
  {
    icon: Users,
    label: 'Who we serve',
    text: 'Children and families affected by malnutrition, sickle cell disease and HIV.',
  },
  {
    icon: Stethoscope,
    label: 'How we help',
    text: 'Medical camps, health education and community outreach.',
  },
];

const values = [
  {
    icon: HeartPulse,
    title: 'Compassion',
    description:
      'We put people first and approach community wellbeing with care, dignity and respect.',
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'We believe meaningful progress grows through listening, collaboration and participation.',
  },
  {
    icon: HandHeart,
    title: 'Service',
    description:
      'We support initiatives that respond to community needs and contribute to wellbeing.',
  },
  {
    icon: Target,
    title: 'Commitment',
    description:
      'We aim to build purposeful initiatives that create lasting, positive change.',
  },
];

const objectives = [
  {
    icon: Stethoscope,
    title: 'Promote Healthcare',
    description:
      'Support access to healthcare services, health awareness and community medical outreach.',
  },
  {
    icon: Users,
    title: 'Engage Communities',
    description:
      'Listen to community needs and encourage participation in solutions that affect people’s lives.',
  },
  {
    icon: Handshake,
    title: 'Build Partnerships',
    description:
      'Work with people and organisations towards shared community goals.',
  },
  {
    icon: Lightbulb,
    title: 'Support Lasting Change',
    description:
      'Promote initiatives that strengthen community wellbeing and create opportunities for progress.',
  },
];

function About() {
  return (
    <>
      <Navbar />

      <main className="about-page">
        {/* HERO */}
        <section className="about-hero" id="about-overview">
          <div className="about-hero-shade" />

          <div className="about-container about-hero-content">
            

            <span className="about-kicker about-kicker-light">
              <span className="about-kicker-dot" />
              ABOUT US
            </span>

            <h1>
              Healthier children.{' '}
              <span className="hand-accent hand-accent--on-dark">
                Stronger communities.
              </span>
            </h1>

            <p>
              We are a community-based health organisation working to
              reduce malnutrition among children living with sickle
              cell disease and HIV.
            </p>
          </div>
        </section>

        {/* WHO WE ARE */}
        <section className="about-story" id="who-we-are">
          <div className="about-container about-story-grid">
            <div className="about-story-copy">
              <span className="about-kicker">
                <span className="about-kicker-dot" />
                WHO WE ARE
              </span>

              <h2>
                People. Community.{' '}
                <span className="hand-accent">Lasting impact.</span>
              </h2>

              <p className="about-lead">
                The Web Initiative is a community-based organisation 
                working to reduce, and where possible eliminate, 
                malnutrition in children living with sickle cell 
                disease and HIV in marginalised communities of northern 
                Uganda.
              </p>

              <p>
                We empower affected families and individuals towards 
                self-sufficiency and good health, and build sustainable, 
                healthy communities by promoting healthy habits, restoring 
                hope, and sharing knowledge and God’s love so that everyone 
                can live a fulfilled life.
              </p>

              <div className="about-actions">
                <Link to="/medical-services" className="about-btn">
                  Explore our services
                  <ArrowRight size={18} />
                </Link>

                <Link to="/our-team" className="about-text-link">
                  Meet our team
                  <span>
                    <ArrowRight size={18} />
                  </span>
                </Link>
              </div>
            </div>

            <figure className="about-story-visual">
              <div className="about-photo-main">
                <img
                  src="/images/about-story-main.jpg"
                  alt="A clinician measuring a child's height during a growth check"
                  loading="lazy"
                />
              </div>

              <div className="about-photo-inset">
                <img
                  src="/images/about-story-inset.jpg"
                  alt="A volunteer listening to an elderly patient at a medical camp"
                  loading="lazy"
                />
              </div>
            </figure>
          </div>
        </section>

        {/* AT A GLANCE */}
        <section className="about-glance" aria-label="At a glance">
          <div className="about-container">
            <ul className="about-glance-list">
              {glance.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.label}>
                    <span className="about-icon-box">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <span>
                      <strong>{item.label}</strong>
                      <span>{item.text}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* MISSION AND VISION */}
        <section className="about-purpose" id="mission-vision">
          <div className="about-container">
            <div className="about-heading">
              <span className="about-kicker">
                <span className="about-kicker-dot" />
                OUR PURPOSE
              </span>
              <h2>Mission &amp; Vision</h2>
            </div>

            <div className="about-purpose-grid">
              <article className="about-purpose-card">
                <span className="about-icon-box">
                  <Target size={24} aria-hidden="true" />
                </span>
                <h3>Our Mission</h3>
                <p>
                  To support community wellbeing through healthcare,
                  outreach, collaboration and initiatives that respond to
                  people’s needs.
                </p>
                <div className="about-card-note">
                  <CheckCircle2 size={17} aria-hidden="true" />
                  <span>People first, always.</span>
                </div>
              </article>

              <article className="about-purpose-card">
                <span className="about-icon-box">
                  <Eye size={24} aria-hidden="true" />
                </span>
                <h3>Our Vision</h3>
                <p>
                  Healthier, stronger communities where people are
                  supported and have opportunities to thrive.
                </p>
                <div className="about-card-note">
                  <CheckCircle2 size={17} aria-hidden="true" />
                  <span>Progress with purpose.</span>
                </div>
              </article>

              <div className="about-purpose-statement">
                <p>
                  <span>
                    Healthier People.
                    <br />
                    Stronger Communities.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* OUR STORY */}
        <section className="about-history" id="our-history">
          <div className="about-container about-history-grid">
            <figure className="about-history-visual">
              <div className="about-history-photo">
                <img
                  src="/images/about-history.jpg"
                  alt="One of our clinicians at an outreach site"
                  loading="lazy"
                />
              </div>

              <ul className="about-history-points">
                <li>
                  <Users size={20} aria-hidden="true" />
                  Community focused from the start
                </li>
                <li>
                  <HeartPulse size={20} aria-hidden="true" />
                  Growing impact through partnerships
                </li>
                <li>
                  <ShieldCheck size={20} aria-hidden="true" />
                  Building healthier futures
                </li>
              </ul>
            </figure>

            <div className="about-history-copy">
              <span className="about-kicker">
                <span className="about-kicker-dot" />
                OUR STORY
              </span>

              <h2>
                A journey of service and{' '}
                <span className="hand-accent">community impact.</span>
              </h2>

              <p>
                The Web Initiative Ltd is built on the belief that
                healthier communities create brighter futures.
              </p>

              <p>
                Our work centres on healthcare support, reaching
                communities, and working with partners who share a
                vision for healthier and stronger communities.
              </p>

              <p>
                Through collaboration and a commitment to service, we
                aim to contribute to a future where community wellbeing
                remains a priority.
              </p>

              <Link to="/medical-camps" className="about-text-link">
                See our medical camps
                <span>
                  <ArrowRight size={18} />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* OBJECTIVES */}
        <section className="about-objectives" id="objectives">
          <div className="about-container">
            <div className="about-heading about-heading-center">
              <span className="about-kicker">
                <span className="about-kicker-dot" />
                OUR OBJECTIVES
              </span>
              <h2>
                Turning our purpose{' '}
                <span className="hand-accent">into action.</span>
              </h2>
              <p>
                Our focus areas guide how we engage communities and
                support meaningful progress.
              </p>
            </div>

            <div className="about-objectives-grid">
              {objectives.map((objective) => {
                const Icon = objective.icon;

                return (
                  <article className="about-objective-card" key={objective.title}>
                    <span className="about-icon-box">
                      <Icon size={24} aria-hidden="true" />
                    </span>
                    <h3>{objective.title}</h3>
                    <p>{objective.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="about-values" id="core-values">
          <div className="about-container">
            <div className="about-heading about-heading-center">
              <span className="about-kicker about-kicker-light">
                <span className="about-kicker-dot" />
                WHAT MATTERS TO US
              </span>
              <h2>
                Our{' '}
                <span className="hand-accent hand-accent--on-dark">
                  core values.
                </span>
              </h2>
              <p>
                The principles that guide our decisions, relationships
                and service to communities.
              </p>
            </div>

            <div className="about-values-grid">
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <article className="about-value-card" key={value.title}>
                    <span className="about-value-icon">
                      <Icon size={26} aria-hidden="true" />
                    </span>
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default About;
