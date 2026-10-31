import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Stethoscope,
  HandHeart,
  Handshake,
  UserRound,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './OurTeam.css';

// Team profiles, shown in this order. Put each photo in public/images/team/
// (head and shoulders; it is shown square). Leave `photo` empty for a placeholder.
const people = [
  {
    name: 'Mukisa George William',
    role: 'Executive Director & Founder',
    location: 'Uganda',
    photo: '/images/team/mukisa-george-william.jpg',
  },
  {
    name: 'Vicky Woods',
    role: 'Director of Operations',
    location: 'USA',
    photo: '/images/team/vicky-woods.jpg',
  },
  {
    name: 'Joakim & Julia',
    role: 'Directors of Operations',
    location: 'Denmark',
    photo: '/images/team/joakim-julia.jpg',
  },
  {
    name: 'Joakim & Birgit',
    role: 'Board Advisory, Finance',
    location: 'Germany',
    photo: '/images/team/joakim-birgit.jpg',
  },
  {
    name: 'Dave',
    role: '',
    location: 'Kenya',
    photo: '/images/team/dave.jpg',
  },
  {
    name: 'Kwagala',
    role: '',
    location: 'Tanzania',
    photo: '/images/team/kwagala.jpg',
  },
];

const ways = [
  {
    icon: Stethoscope,
    title: 'Volunteer at a camp',
    text: 'Health workers and community volunteers help us run our medical camps.',
  },
  {
    icon: Handshake,
    title: 'Partner with us',
    text: 'Organisations can work with us to reach more children and families.',
  },
];

function OurTeam() {
  return (
    <>
      <Navbar />

      <main className="our-team-page">
        {/* HERO */}
        <section className="ot-hero">
          <div className="ot-hero-shade" />

          <div className="ot-container ot-hero-content">
            <span className="ot-kicker ot-kicker-light">
              <span className="ot-kicker-dot" />
              THE PEOPLE BEHIND OUR WORK
            </span>

            <h1>
              Meet the people{' '}
              <span className="hand-accent hand-accent--on-dark">
                behind our care.
              </span>
            </h1>

            <p>
              Clinicians, volunteers and community members working together
              to support children and families in Northern Uganda.
            </p>
          </div>
        </section>

        {/* INTRO */}
        <section className="ot-intro">
          <div className="ot-container ot-intro-grid">
            <figure className="ot-intro-visual">
              <div className="ot-intro-photo">
                <img
                  src="/images/medical-team.jpg"
                  alt="A group of health workers in scrubs talking together outdoors"
                  loading="lazy"
                />
              </div>

              <figcaption className="ot-intro-badge">
                <span className="ot-icon-box">
                  <HandHeart size={22} aria-hidden="true" />
                </span>
                <span>
                  <strong>Working as one team</strong>
                  <span>Clinicians and volunteers sharing what they know.</span>
                </span>
              </figcaption>
            </figure>

            <div className="ot-intro-copy">
              <span className="ot-kicker">
                <span className="ot-kicker-dot" />
                WORKING TOGETHER
              </span>

              <h2>
                Driven by people.{' '}
                <span className="hand-accent">United by purpose.</span>
              </h2>

              <p className="ot-lead">
                Meaningful community work depends on people who share
                knowledge, listen to different perspectives and work
                together towards common goals.
              </p>

              <p>
                At The Web Initiative Ltd, our approach values teamwork,
                community engagement and collaboration with the people
                and partners we serve.
              </p>

              <Link to="/about" className="ot-text-link">
                Learn about our organisation
                <span>
                  <ArrowRight size={18} aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* OUR TEAMS (deep blue) */}
        <section className="ot-teams" aria-labelledby="ot-teams-title">
          <div className="ot-container">
            <div className="ot-teams-intro">
              <p className="ot-group-title">Leadership and Board</p>

              <div className="ot-teams-statement">
                <h2 id="ot-teams-title">
                  Rooted in community, united across borders.
                </h2>
                <p>
                  A team led from Jinja, Uganda, with partners in the United
                  States, Denmark, and Germany. Together they set our
                  direction, keep the mission accountable, care for our
                  relationships with donors and partners, and make sure
                  every resource entrusted to us reaches the children and
                  families we serve in Eastern Uganda. 
                </p>
              </div>
            </div>

            <ul className="ot-people-grid">
              {people.map((person) => (
                <li className="ot-person" key={person.name}>
                  <div className="ot-person-photo">
                    {person.photo ? (
                      <img
                        src={person.photo}
                        alt={`Portrait of ${person.name}`}
                        loading="lazy"
                      />
                    ) : (
                      <span className="ot-person-placeholder" aria-hidden="true">
                        <UserRound size={56} strokeWidth={1.4} />
                      </span>
                    )}
                  </div>
                  <h3>{person.name}</h3>
                  {person.role && <p className="ot-person-role">{person.role}</p>}
                  <p className="ot-person-location">{person.location}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* JOIN US */}
        <section className="ot-join" aria-labelledby="ot-join-title">
          <div className="ot-container ot-join-grid">
            <div className="ot-join-copy">
              <span className="ot-kicker">
                <span className="ot-kicker-dot" />
                JOIN OUR TEAM
              </span>
              <h2 id="ot-join-title">
                Want to work{' '}
                <span className="hand-accent">with us?</span>
              </h2>
              <p>
                We welcome conversations about volunteering, partnerships
                and other ways to contribute to our work.
              </p>
              <Link to="/contact" className="ot-btn">
                Contact our team
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>

            <ul className="ot-join-list">
              {ways.map((way) => {
                const Icon = way.icon;

                return (
                  <li key={way.title}>
                    <span className="ot-icon-box">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <span>
                      <strong>{way.title}</strong>
                      <span>{way.text}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default OurTeam;
