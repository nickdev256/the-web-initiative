import { Link } from 'react-router-dom';
import {
  HeartPulse,
  Users,
  ArrowRight,
  HandHeart,
  ShieldCheck,
  Tent,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './Impact.css';

const impactAreas = [
  {
    icon: HeartPulse,
    title: 'Access to healthcare',
    text: 'Bringing essential health services closer to communities that face barriers to accessing care.',
  },
  {
    icon: Users,
    title: 'Community engagement',
    text: 'Working alongside local communities to understand needs and encourage participation in health initiatives.',
  },
  {
    icon: ShieldCheck,
    title: 'Health awareness',
    text: 'Promoting health education, prevention and informed decisions through community outreach.',
  },
  {
    icon: HandHeart,
    title: 'Partnerships and support',
    text: 'Building partnerships that help extend the reach and sustainability of community health programmes.',
  },
];

const activities = [
  {
    number: '01',
    title: 'Medical outreach',
    text: 'Supporting outreach activities that help connect people with essential healthcare services.',
    image: '/images/outdoor-consultation.jpg',
    alt: 'Health workers consulting with patients at an outdoor medical camp',
  },
  {
    number: '02',
    title: 'Health education',
    text: 'Encouraging practical health knowledge and awareness within the communities we serve.',
    image: '/images/camps/thumbs/nutrition-education.jpg',
    alt: 'Our team leading a nutrition session with mothers and children',
  },
  {
    number: '03',
    title: 'Community partnerships',
    text: 'Collaborating with local stakeholders to identify needs and strengthen community support.',
    image: '/images/camps/thumbs/elder-consultation.jpg',
    alt: 'A volunteer talking with an elderly woman at a community camp',
  },
];

export default function Impact() {
  return (
    <>
      <Navbar />

      <main className="impact-page">
        {/* HERO */}
        <section className="impact-hero">
          <div className="impact-hero-shade" />

          <div className="impact-container impact-hero-content">
            <span className="impact-kicker impact-kicker-light">
              <span className="impact-kicker-dot" />
              OUR IMPACT
            </span>

            <h1>
              Creating a healthier{' '}
              <span className="hand-accent hand-accent--on-dark">
                tomorrow, together.
              </span>
            </h1>

            <p>
              We work to strengthen communities through healthcare
              outreach, health education and partnerships that put
              people first.
            </p>

            <div className="impact-hero-actions">
              <Link to="/medical-camps" className="impact-btn impact-btn-light">
                Explore our medical camps
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link to="/donate" className="impact-btn btn-support">
                Make a Donation
              </Link>
            </div>
          </div>
        </section>

        {/* WHY IT MATTERS */}
        <section className="impact-intro">
          <div className="impact-container impact-intro-grid">
            <div className="impact-intro-copy">
              <span className="impact-kicker">
                <span className="impact-kicker-dot" />
                WHY OUR WORK MATTERS
              </span>

              <h2>
                Making healthcare more accessible,{' '}
                <span className="hand-accent">one community at a time.</span>
              </h2>

              <p className="impact-lead">
                Access to healthcare and reliable health information can
                make a meaningful difference in people’s lives.
              </p>

              <p>
                Our work focuses on community-centred initiatives that help
                bridge gaps in access, awareness and support. We believe
                lasting impact grows through listening, collaboration and a
                commitment to treating every person with dignity.
              </p>

              <Link to="/about" className="impact-text-link">
                Learn about our organisation
                <span>
                  <ArrowRight size={18} aria-hidden="true" />
                </span>
              </Link>
            </div>

            <figure className="impact-intro-visual">
              <div className="impact-intro-photo">
                <img
                  src="/images/camp-village-tents.jpg"
                  alt="Our medical camp tents set up in a village, with a large crowd gathered"
                  loading="lazy"
                />
              </div>

              <figcaption className="impact-intro-badge">
                <span className="impact-icon-box">
                  <Tent size={22} aria-hidden="true" />
                </span>
                <span>
                  <strong>Camps that reach whole villages</strong>
                  <span>Bringing care to where families live.</span>
                </span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* AREAS OF IMPACT (deep blue) */}
        <section className="impact-areas" aria-labelledby="impact-areas-title">
          <div className="impact-container">
            <div className="impact-heading impact-heading-center">
              <span className="impact-kicker impact-kicker-light">
                <span className="impact-kicker-dot" />
                OUR AREAS OF IMPACT
              </span>
              <h2 id="impact-areas-title">
                Where we focus{' '}
                <span className="hand-accent hand-accent--on-dark">
                  our efforts.
                </span>
              </h2>
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
                    <span className="impact-icon-box">
                      <Icon size={24} aria-hidden="true" />
                    </span>
                    <h3>{area.title}</h3>
                    <p>{area.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* WORK IN ACTION */}
        <section className="impact-action" aria-labelledby="impact-action-title">
          <div className="impact-container">
            <div className="impact-heading impact-heading-split">
              <div>
                <span className="impact-kicker">
                  <span className="impact-kicker-dot" />
                  OUR WORK IN ACTION
                </span>
                <h2 id="impact-action-title">
                  Turning commitment{' '}
                  <span className="hand-accent">into action.</span>
                </h2>
              </div>
              <Link to="/medical-camps" className="impact-text-link">
                View medical camps
                <span>
                  <ArrowRight size={18} aria-hidden="true" />
                </span>
              </Link>
            </div>

            <div className="impact-action-grid">
              {activities.map((activity) => (
                <article className="impact-action-card" key={activity.number}>
                  <div className="impact-action-photo">
                    <img src={activity.image} alt={activity.alt} loading="lazy" />
                    <span className="impact-action-number">{activity.number}</span>
                  </div>
                  <div className="impact-action-body">
                    <h3>{activity.title}</h3>
                    <p>{activity.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
