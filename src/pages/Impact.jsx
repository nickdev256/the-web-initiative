
import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  Users,
  Stethoscope,
  MapPin,
  ArrowRight,
  HandHeart,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx'; 
import './Impact.css';

const impactAreas = [
  {
    icon: HeartPulse,
    title: 'Access to Healthcare',
    text: 'Bringing essential health services closer to communities that face barriers to accessing care.',
  },
  {
    icon: Users,
    title: 'Community Engagement',
    text: 'Working alongside local communities to understand needs and encourage participation in health initiatives.',
  },
  {
    icon: ShieldCheck,
    title: 'Health Awareness',
    text: 'Promoting health education, prevention, and informed decisions through community outreach.',
  },
  {
    icon: HandHeart,
    title: 'Partnerships and Support',
    text: 'Building partnerships that help extend the reach and sustainability of community health programmes.',
  },
];

const activities = [
  {
    number: '01',
    title: 'Medical Outreach',
    text: 'Supporting outreach activities that help connect people with essential healthcare services.',
    image: '/images/outdoor-consultation.jpg',
  },
  {
    number: '02',
    title: 'Health Education',
    text: 'Encouraging practical health knowledge and awareness within the communities we serve.',
    image: '/images/blood-pressure-check.jpg',
  },
  {
    number: '03',
    title: 'Community Partnerships',
    text: 'Collaborating with local stakeholders to identify needs and strengthen community support.',
    image: '/images/community-outreach.jpg',
  },
];

export default function Impact() {
  return (
    <>
      <Navbar />

      <main className="impact-page">
        <section className="impact-hero">
          <div className="impact-hero-overlay" />
          <div className="impact-container impact-hero-content">
            <span className="impact-eyebrow">
              <HeartPulse size={17} /> OUR IMPACT
            </span>

            <h1>
              Creating a Healthier
              <span className="hand-accent hand-accent--on-dark"> Tomorrow, Together.</span>
            </h1>

            <p>
              We work to strengthen communities through healthcare outreach,
              health education, and partnerships that put people first.
            </p>

            <div className="impact-hero-buttons">
              <Link to="/medical-camps" className="impact-btn impact-btn-white">
                Explore Our Medical Camps <ArrowRight size={18} />
              </Link>
              <Link to="/donate" className="impact-btn impact-btn-outline">
                Support Our Work
              </Link>
            </div>
          </div>
        </section>

        <section className="impact-intro section-space">
          <div className="impact-container impact-intro-grid">
            <div className="impact-intro-copy">
              <span className="impact-section-label">WHY OUR WORK MATTERS</span>
              <h2>
                Making healthcare more accessible, one community at a time.
              </h2>
              <p>
                Access to healthcare and reliable health information can make
                a meaningful difference in people's lives. Our work focuses on
                community-centred initiatives designed to help bridge gaps in
                access, awareness, and support.
              </p>
              <p>
                We believe lasting impact grows through listening, collaboration,
                and a commitment to treating every person with dignity.
              </p>
              <Link to="/about" className="impact-text-link">
                Learn about our organisation <ArrowRight size={17} />
              </Link>
            </div>

            <div className="impact-intro-visual">
              <img
                src="/images/camp-village-tents.jpg"
                alt="Community health outreach activity"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
              <div className="impact-image-note">
                <HeartPulse size={25} />
                <div>
                  <strong>People first. Community always.</strong>
                  <span>Working together for better health.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="impact-areas section-space">
          <div className="impact-container">
            <div className="impact-section-heading">
              <span className="impact-section-label">OUR AREAS OF IMPACT</span>
              <h2>Where we focus our efforts</h2>
              <p>
                Our initiatives are guided by the needs of the communities
                we work with.
              </p>
            </div>

            <div className="impact-area-grid">
              {impactAreas.map((area) => {
                const Icon = area.icon;

                return (
                  <article className="impact-area-card" key={area.title}>
                    <div className="impact-area-icon">
                      <Icon size={27} />
                    </div>
                    <h3>{area.title}</h3>
                    <p>{area.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="impact-activities section-space">
          <div className="impact-container">
            <div className="impact-section-heading impact-heading-row">
              <div>
                <span className="impact-section-label">OUR WORK IN ACTION</span>
                <h2>Turning commitment into action</h2>
              </div>
              <Link to="/medical-camps" className="impact-text-link">
                View medical camps <ArrowRight size={17} />
              </Link>
            </div>

            <div className="impact-activity-grid">
              {activities.map((activity) => (
                <article className="impact-activity-card" key={activity.number}>
                  <div className="impact-activity-image">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                    <span>{activity.number}</span>
                  </div>
                  <div className="impact-activity-copy">
                    <h3>{activity.title}</h3>
                    <p>{activity.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="impact-commitment">
          <div className="impact-container impact-commitment-inner">
            <div className="impact-commitment-icon">
              <Activity size={31} />
            </div>
            <div className="impact-commitment-copy">
              <span className="impact-section-label">OUR COMMITMENT</span>
              <h2>Impact that starts with people.</h2>
              <p>
                We aim to build meaningful, responsible, and community-led
                programmes. As our work grows, we remain committed to learning
                from the people and partners we serve.
              </p>
            </div>
            <Link to="/contact" className="impact-btn impact-btn-white">
              Partner With Us <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        <section className="impact-cta section-space">
          <div className="impact-container impact-cta-inner">
            <div>
              <span className="impact-section-label">BE PART OF THE CHANGE</span>
              <h2>Help us reach more communities.</h2>
              <p>
                Your time, partnership, or contribution can help support
                community-focused health initiatives.
              </p>
            </div>
            <div className="impact-cta-buttons">
              <Link to="/donate" className="impact-btn impact-btn-primary btn-support">
                <HandHeart size={18} /> Support Our Work
              </Link>
              <Link to="/contact" className="impact-btn impact-btn-light">
                Get in Touch <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <div className="impact-location-strip">
          <div className="impact-container">
            <MapPin size={18} />
            <span>THE WEB INITIATIVE LTD</span>
            <span className="impact-location-divider">|</span>
            <span>Jinja, Uganda</span>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
