
import { Link } from 'react-router-dom';
import {
  ArrowRight,
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
  Menu,
} from 'lucide-react';

import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './About.css';

const values = [
  {
    icon: HeartPulse,
    title: 'Compassion',
    description:
      'We put people first and approach community wellbeing with care, dignity, and respect.',
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'We believe meaningful progress grows through listening, collaboration, and participation.',
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
      'We aim to build purposeful initiatives that create lasting positive change.',
  },
];

const objectives = [
  {
    icon: Stethoscope,
    number: '01',
    title: 'Promote Healthcare',
    description:
      'Support access to healthcare services, health awareness, and community medical outreach.',
  },
  {
    icon: Users,
    number: '02',
    title: 'Engage Communities',
    description:
      'Listen to community needs and encourage participation in solutions that affect people’s lives.',
  },
  {
    icon: Handshake,
    number: '03',
    title: 'Build Partnerships',
    description:
      'Work with people and organisations towards shared community goals.',
  },
  {
    icon: Lightbulb,
    number: '04',
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
          <div className="about-hero-overlay" />

          <div className="about-container about-hero-content">
            <span className="about-eyebrow">
              GET TO KNOW US
            </span>

            <h1>
              About The Web
              <br />
              Initiative Ltd
            </h1>

            <p>
              Our commitment to healthcare, community wellbeing,
              and initiatives that put people first.
            </p>

            <nav
              className="about-breadcrumb"
              aria-label="Breadcrumb"
            >
              <Link to="/">⌂ Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">About Us</span>
            </nav>
          </div>
        </section>

        {/* ORGANISATION OVERVIEW */}
        <section className="about-story-section" id="who-we-are">
          <div className="about-container about-story-grid">
            <div className="about-story-content">
              <span className="about-eyebrow">
                WHO WE ARE
              </span>

              <h2>
                People. Community.
                <br />
                Lasting Impact.
              </h2>

              <p>
                The Web Initiative Ltd is focused on community
                wellbeing through healthcare services, medical
                outreach, and initiatives designed around people’s
                needs.
              </p>

              <p>
                We believe that stronger communities are built when
                individuals have access to support, knowledge, and
                opportunities to thrive.
              </p>

              <p>
                Through compassion, collaboration, and meaningful
                engagement, we work to create positive change in
                the communities we serve.
              </p>

              <Link
                to="/medical-services"
                className="about-primary-link"
              >
                Explore Our Services
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="about-story-visual">
              <div className="about-image-backdrop" />

              <img
                src="/images/community-outreach.jpg"
                alt="Healthcare professionals engaging with the community"
                className="about-story-image"
                loading="lazy"
              />

              <div className="about-image-label">
                <span className="about-label-icon">
                  <HeartPulse size={27} />
                </span>

                <span>
                  <strong>Quality healthcare</strong>
                  <small>For stronger communities</small>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION AND VISION */}
        <section
          className="about-purpose-section"
          id="mission-vision"
        >
          <div className="about-container">
            <div className="about-section-heading">
              <span className="about-eyebrow">
                OUR PURPOSE
              </span>

              <h2>Mission &amp; Vision</h2>
            </div>

            <div className="about-purpose-layout">
              <article className="about-purpose-card">
                <div className="about-purpose-icon">
                  <Target size={28} />
                </div>

                <h3>Our Mission</h3>

                <p>
                  To support community wellbeing through healthcare,
                  outreach, collaboration, and initiatives that
                  respond to people’s needs.
                </p>

                <div className="about-card-bottom">
                  <CheckCircle2 size={16} />
                  <span>People first, always.</span>
                </div>
              </article>

              <article className="about-purpose-card">
                <div className="about-purpose-icon">
                  <Eye size={28} />
                </div>

                <h3>Our Vision</h3>

                <p>
                  To contribute to healthier, stronger communities
                  where people are supported and have opportunities
                  to thrive.
                </p>

                <div className="about-card-bottom">
                  <CheckCircle2 size={16} />
                  <span>Progress with purpose.</span>
                </div>
              </article>

              <div className="about-purpose-statement">
                <span>
                  Healthier
                  <br />
                  People.
                  <br />
                  Stronger
                  <br />
                  Communities.
                </span>

                <div />
              </div>
            </div>
          </div>
        </section>

        {/* HISTORY */}
        <section
          className="about-history-section"
          id="our-history"
        >
          <div className="about-container about-history-grid">
            <div className="about-history-content">
              <span className="about-eyebrow">
                OUR HISTORY
              </span>

              <h2>
                A journey of service
                <br />
                and community impact.
              </h2>

              <p>
                The Web Initiative Ltd is focused on the belief
                that healthier communities create brighter futures.
              </p>

              <p>
                Our work centres on healthcare support, reaching
                communities, and working with partners who share
                a vision for healthier and stronger communities.
              </p>

              <p>
                Through collaboration and a commitment to service,
                we aim to contribute to a future where community
                wellbeing remains a priority.
              </p>

              <Link
                to="/contact"
                className="about-primary-link"
              >
                Learn More About Our Work
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="about-history-visual">
              <div className="about-history-image-wrap">
                <img
                  src="/images/healthcare-team.jpg"
                  alt="Healthcare team supporting community members"
                  loading="lazy"
                />
              </div>

              <div className="about-history-panel">
                <div>
                  <Users size={24} />
                  <span>
                    Community focused from the start
                  </span>
                </div>

                <div>
                  <HeartPulse size={24} />
                  <span>
                    Growing impact through partnerships
                  </span>
                </div>

                <div>
                  <ShieldCheck size={24} />
                  <span>
                    Building healthier futures
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OBJECTIVES */}
        <section
          className="about-objectives-section"
          id="objectives"
        >
          <div className="about-container">
            <div className="about-section-heading">
              <span className="about-eyebrow">
                OUR OBJECTIVES
              </span>

              <h2>Turning our purpose into action.</h2>

              <p>
                Our focus areas guide how we engage communities
                and support meaningful progress.
              </p>
            </div>

            <div className="about-objectives-grid">
              {objectives.map((objective) => {
                const Icon = objective.icon;

                return (
                  <article
                    className="about-objective-card"
                    key={objective.number}
                  >
                    <div className="about-objective-icon">
                      <Icon size={27} />
                    </div>

                    <span className="about-objective-number">
                      {objective.number}
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
        <section
          className="about-values-section"
          id="core-values"
        >
          <div className="about-container about-values-layout">
            <div className="about-values-intro">
              <span className="about-eyebrow">
                WHAT MATTERS TO US
              </span>

              <h2>Our Core Values</h2>

              <p>
                The principles that guide our decisions,
                relationships, and service to communities.
              </p>

              <Link
                to="/medical-services"
                className="about-primary-link"
              >
                Our Approach
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="about-values-grid">
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <article
                    className="about-value-card"
                    key={value.title}
                  >
                    <div className="about-value-icon">
                      <Icon size={27} />
                    </div>

                    <h3>{value.title}</h3>

                    <p>{value.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="about-cta-section">
          <div className="about-container about-cta-content">
            <div className="about-cta-copy">
              <span className="about-eyebrow">
                LET’S WORK TOGETHER
              </span>

              <h2>Be part of our journey.</h2>

              <p>
                Contact our team to learn more about our work,
                discuss collaboration, or explore ways to get involved.
              </p>
            </div>

            <div className="about-cta-actions">
              <Link
                to="/contact"
                className="about-cta-button"
              >
                Contact Us
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/donate"
                className="about-cta-secondary"
              >
                <HeartPulse size={17} />
                Support Our Work
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default About;
