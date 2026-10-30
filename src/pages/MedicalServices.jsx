
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  HeartPulse,
  Stethoscope,
  Activity,
  ShieldCheck,
  Users,
  ClipboardCheck,
  HandHeart,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx'; 
import './MedicalServices.css';

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
      'Initiatives that promote prevention, early attention to health concerns, and awareness of health risks.',
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

function MedicalServices() {
  return (
    <>
      <Navbar />

      <main className="medical-services-page">
        <section className="ms-hero">
          <div className="ms-hero-overlay" />

          <div className="ms-container ms-hero-content">
            <span className="ms-eyebrow">OUR HEALTHCARE WORK</span>

            <h1>Medical Services</h1>

            <p>
              Supporting healthier communities through healthcare
              awareness, outreach, and community-focused initiatives.
            </p>

            
          </div>
        </section>

        <section className="ms-intro ms-section">
          <div className="ms-container ms-intro-grid">
            <div className="ms-intro-image-wrap">
              <img
                src="/images/outdoor-consultation.jpg"
                alt="Healthcare professionals supporting community wellbeing"
                className="ms-intro-image"
              />
            </div>

            <div className="ms-intro-content">
              <span className="ms-eyebrow">HEALTH AND WELLBEING</span>

              <h2>Healthcare that puts people first.</h2>

              <p>
                Access to appropriate health information and support
                can make a meaningful difference to individuals,
                families, and communities.
              </p>

              <p>
                The Web Initiative Ltd aims to support community
                wellbeing through outreach, awareness, and initiatives
                developed around local needs.
              </p>

              <div className="ms-promise">
                <ClipboardCheck size={23} />
                <div>
                  <strong>Community-focused approach</strong>
                  <span>
                    Listening, collaboration, and responsible support.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ms-services ms-section">
          <div className="ms-container">
            <div className="ms-section-heading">
              <span className="ms-eyebrow">HOW WE HELP</span>
              <h2>Our Areas of Focus</h2>
              <p>
                Explore the areas our healthcare and outreach initiatives
                may cover. Contact us to confirm currently available services.
              </p>
            </div>

            <div className="ms-service-grid">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <article className="ms-service-card" key={service.title}>
                    <div className="ms-service-icon">
                      <Icon size={28} strokeWidth={1.8} />
                    </div>

                    <h3>{service.title}</h3>

                    <p>{service.description}</p>

                    <Link to="/contact" className="ms-service-link">
                      Ask us about this <ArrowRight size={17} />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="ms-process ms-section">
          <div className="ms-container ms-process-grid">
            <div className="ms-process-content">
              <span className="ms-eyebrow">OUR APPROACH</span>

              <h2>Working with communities at every step.</h2>

              <p>
                Effective community initiatives begin by understanding
                people's needs and building relationships with the
                communities they are intended to serve.
              </p>

              <ul className="ms-process-list">
                <li>
                  <span>01</span>
                  <div>
                    <strong>Listen and understand</strong>
                    <p>Learn about community priorities and concerns.</p>
                  </div>
                </li>

                <li>
                  <span>02</span>
                  <div>
                    <strong>Plan and collaborate</strong>
                    <p>Work with relevant people and partners.</p>
                  </div>
                </li>

                <li>
                  <span>03</span>
                  <div>
                    <strong>Support and learn</strong>
                    <p>Review activities and identify opportunities to improve.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="ms-process-visual">
              <img
                src="/images/health-screening.jpg"
                alt="Community health outreach"
                loading="lazy"
              />

              <div className="ms-process-caption">
                <HeartPulse size={25} />
                <div>
                  <strong>Care through collaboration</strong>
                  <span>Supporting community wellbeing</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ms-cta">
          <div className="ms-container ms-cta-content">
            <div>
              <span className="ms-eyebrow">LET'S CONNECT</span>
              <h2>Want to learn more about our services?</h2>
              <p>
                Contact our team to ask about our activities, current
                services, or opportunities to work together.
              </p>
            </div>

            <div className="ms-cta-actions">
              <Link to="/contact" className="ms-button ms-button-white">
                Contact Us <ArrowRight size={18} />
              </Link>

              <Link to="/medical-camps" className="ms-button ms-button-outline">
                Explore Medical Camps
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default MedicalServices;
