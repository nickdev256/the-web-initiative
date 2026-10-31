
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  HeartPulse,
  Stethoscope,
  Activity,
  ShieldCheck,
  Users,
  Microscope,
  HandHeart,
  Apple,
  Ribbon,
  Droplet,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './MedicalServices.css';

// The three conditions named in the organisation's constitution.
const focusConditions = [
  { icon: Apple, label: 'Malnutrition' },
  { icon: Droplet, label: 'Sickle cell disease' },
  { icon: Ribbon, label: 'HIV' },
];

const services = [
  {
    icon: Stethoscope,
    title: 'General Healthcare',
    description:
      'Community-focused healthcare support that encourages people to seek appropriate medical attention.',
  },
  {
    icon: HeartPulse,
    title: 'Community Health Outreach',
    description:
      'Outreach initiatives that help connect communities with health information and available support.',
  },
  {
    icon: Activity,
    title: 'Health Education',
    description:
      'Health awareness activities that encourage informed decisions and healthier everyday practices.',
  },
  {
    icon: ShieldCheck,
    title: 'Preventive Health Awareness',
    description:
      'Initiatives that promote prevention, early attention to health concerns and awareness of health risks.',
  },
  {
    icon: Users,
    title: 'Community Engagement',
    description:
      'Working with communities to understand their needs and encourage participation in health initiatives.',
  },
  {
    icon: HandHeart,
    title: 'Medical Outreach Support',
    description:
      'Supporting outreach activities that aim to make health information and services more accessible.',
  },
];

const steps = [
  {
    title: 'Listen and understand',
    text: 'Learn about community priorities and concerns.',
  },
  {
    title: 'Plan and collaborate',
    text: 'Work with relevant people and partners.',
  },
  {
    title: 'Support and learn',
    text: 'Review activities and identify opportunities to improve.',
  },
];

function MedicalServices() {
  return (
    <>
      <Navbar />

      <main className="medical-services-page">
        {/* HERO */}
        <section className="ms-hero">
          <div className="ms-hero-shade" />

          <div className="ms-container ms-hero-content">
          

            <span className="ms-kicker ms-kicker-light">
              <span className="ms-kicker-dot" />
              OUR HEALTHCARE WORK
            </span>

            <h1>
              Medical services for{' '}
              <span className="hand-accent hand-accent--on-dark">
                healthier communities.
              </span>
            </h1>

            <p>
              Health awareness, outreach and community-focused care for
              children and families affected by malnutrition, sickle cell
              disease and HIV in Northern Uganda.
            </p>
          </div>
        </section>

        {/* INTRO */}
        <section className="ms-intro">
          <div className="ms-container ms-intro-grid">
            <figure className="ms-intro-visual">
              <div className="ms-intro-photo">
                <img
                  src="/images/services-intro.jpg"
                  alt="A team member preparing a blood sample for testing"
                  loading="lazy"
                />
              </div>

              <div className="ms-intro-badge">
                <span className="ms-icon-box">
                  <Microscope size={22} aria-hidden="true" />
                </span>
                <span>
                  <strong>Laboratory screening</strong>
                  <span>Blood tests that help guide each child’s care.</span>
                </span>
              </div>
            </figure>

            <div className="ms-intro-copy">
              <span className="ms-kicker">
                <span className="ms-kicker-dot" />
                HEALTH AND WELLBEING
              </span>

              <h2>
                Healthcare that puts{' '}
                <span className="hand-accent">people first.</span>
              </h2>

              <p className="ms-lead">
                Access to appropriate health information and support can
                make a meaningful difference to individuals, families and
                communities.
              </p>

              <p>
                The Web Initiative Ltd aims to support community wellbeing
                through outreach, awareness and initiatives developed
                around local needs.
              </p>

              <div className="ms-focus">
                <span className="ms-focus-label">Our focus</span>
                <ul className="ms-focus-list">
                  {focusConditions.map((item) => {
                    const Icon = item.icon;

                    return (
                      <li key={item.label}>
                        <Icon size={17} aria-hidden="true" />
                        {item.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* AREAS OF FOCUS (deep blue) */}
        <section className="ms-services" aria-labelledby="ms-services-title">
          <div className="ms-container">
            <div className="ms-heading ms-heading-center">
              <span className="ms-kicker ms-kicker-light">
                <span className="ms-kicker-dot" />
                HOW WE HELP
              </span>
              <h2 id="ms-services-title">
                Our{' '}
                <span className="hand-accent hand-accent--on-dark">
                  areas of focus.
                </span>
              </h2>
              <p>
                Explore the areas our healthcare and outreach initiatives
                may cover. Contact us to confirm currently available
                services.
              </p>
            </div>

            <div className="ms-service-grid">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <article className="ms-service-card" key={service.title}>
                    <span className="ms-icon-box">
                      <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
                    </span>

                    <h3>{service.title}</h3>
                    <p>{service.description}</p>

                    <Link to="/contact" className="ms-service-link">
                      Ask us about this
                      <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* OUR APPROACH */}
        <section className="ms-approach">
          <div className="ms-container ms-approach-grid">
            <div className="ms-approach-copy">
              <span className="ms-kicker">
                <span className="ms-kicker-dot" />
                OUR APPROACH
              </span>

              <h2>
                Working with communities{' '}
                <span className="hand-accent">at every step.</span>
              </h2>

              <p>
                Effective community initiatives begin by understanding
                people’s needs and building relationships with the
                communities they are intended to serve.
              </p>

              <ol className="ms-steps">
                {steps.map((step, index) => (
                  <li key={step.title}>
                    <span className="ms-step-number" aria-hidden="true">
                      {index + 1}
                    </span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <Link to="/medical-camps" className="ms-text-link">
                Explore our medical camps
                <span>
                  <ArrowRight size={18} />
                </span>
              </Link>
            </div>

            <figure className="ms-approach-visual">
              <div className="ms-approach-photo">
                <img
                  src="/images/services-approach.jpg"
                  alt="Our team leading a nutrition education session with mothers and children"
                  loading="lazy"
                />
              </div>

              <figcaption className="ms-approach-caption">
                <Apple size={22} aria-hidden="true" />
                <span>
                  <strong>Nutrition education for families</strong>
                  <span>Sharing healthy food choices with mothers</span>
                </span>
              </figcaption>
            </figure>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default MedicalServices;
