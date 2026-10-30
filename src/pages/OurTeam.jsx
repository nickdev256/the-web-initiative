
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Users,
  HeartHandshake,
  Target,
  Mail,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './OurTeam.css';

const teamMembers = [
  {
    name: 'Leadership Team',
    role: 'Organizational Leadership',
    image: '/images/healthcare-team.jpg',
    description: 
      'Guiding the organization’s direction, priorities, and community-focused initiatives.',
  },
  {
    name: 'Medical Team',
    role: 'Healthcare Professionals',
    image: '/images/medical-team.jpg',
    description:
      'Supporting appropriate healthcare activities, health education, and community outreach.',
  },
  {
    name: 'Outreach Team',
    role: 'Community Engagement',
    image: '/images/outdoor-consultation.jpg',
    description:
      'Building community relationships and helping coordinate outreach activities.',
  },
  {
    name: 'Support Team',
    role: 'Operations and Partnerships',
    image: '/images/health-screening.jpg',
    description:
      'Supporting coordination, collaboration, and the delivery of organizational initiatives.',
  },
];

function OurTeam() {
  return (
    <>
      <Navbar />

      <main className="our-team-page">
        <section className="ot-hero">
          <div className="ot-hero-overlay" /> 

          <div className="ot-container ot-hero-content">
            <span className="ot-eyebrow">THE PEOPLE BEHIND OUR WORK</span>
            <h1>Meet Our Team</h1>

            <p>
              People working together to support communities, encourage
              collaboration, and advance meaningful initiatives.
            </p>

           
          </div>
        </section>

        <section className="ot-intro ot-section">
          <div className="ot-container ot-intro-grid">
            <div className="ot-intro-image-wrap">
              <img
                src="/images/blood-pressure-check.jpg"
                alt="Team members working together"
                className="ot-intro-image"
              />
            </div>

            <div className="ot-intro-content">
              <span className="ot-eyebrow">WORKING TOGETHER</span>

              <h2>Driven by people. United by purpose.</h2>

              <p>
                Meaningful community work depends on people who share
                knowledge, listen to different perspectives, and work
                together towards common goals.
              </p>

              <p>
                At The Web Initiative Ltd, our approach values teamwork,
                community engagement, and collaboration with relevant
                stakeholders.
              </p>

              <Link to="/about" className="ot-text-link">
                Learn about our organization <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="ot-values ot-section">
          <div className="ot-container">
            <div className="ot-section-heading">
              <span className="ot-eyebrow">OUR SHARED VALUES</span>
              <h2>What Brings Us Together</h2>
              <p>
                The principles that guide how we work with communities
                and with one another.
              </p>
            </div>

            <div className="ot-values-grid">
              <article className="ot-value-card">
                <div className="ot-value-icon">
                  <Users size={28} />
                </div>
                <h3>Teamwork</h3>
                <p>
                  Working collaboratively and valuing the contribution
                  of every team member.
                </p>
              </article>

              <article className="ot-value-card">
                <div className="ot-value-icon">
                  <HeartHandshake size={28} />
                </div>
                <h3>Community</h3>
                <p>
                  Listening to communities and building respectful,
                  meaningful relationships.
                </p>
              </article>

              <article className="ot-value-card">
                <div className="ot-value-icon">
                  <Target size={28} />
                </div>
                <h3>Purpose</h3>
                <p>
                  Keeping our efforts focused on responsible action
                  and meaningful outcomes.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="ot-team ot-section">
          <div className="ot-container">
            <div className="ot-section-heading">
              <span className="ot-eyebrow">OUR PEOPLE</span>
              <h2>Meet the People Behind Our Initiatives</h2>
              <p>
                Different responsibilities and shared commitment help
                bring community-focused work together.
              </p>
            </div>

            <div className="ot-team-grid">
              {teamMembers.map((member) => (
                <article className="ot-member-card" key={member.name}>
                  <div className="ot-member-image-wrap">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="ot-member-image"
                      loading="lazy"
                    />
                  </div>

                  <div className="ot-member-content">
                    <span className="ot-member-role">{member.role}</span>
                    <h3>{member.name}</h3>
                    <p>{member.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ot-cta">
          <div className="ot-container ot-cta-content">
            <div>
              <span className="ot-eyebrow">CONNECT WITH US</span>
              <h2>Interested in working together?</h2>
              <p>
                We welcome conversations about partnerships, community
                initiatives, and ways to contribute to our work.
              </p>
            </div>

            <Link to="/contact" className="ot-button ot-button-white">
              <Mail size={18} /> Contact Our Team
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default OurTeam;
