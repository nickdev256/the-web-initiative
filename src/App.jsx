
import { lazy, Suspense, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import MedicalServices from './pages/MedicalServices.jsx';
import MedicalCamps from './pages/MedicalCamps.jsx';
import CampDetails from './pages/CampDetails.jsx';
import OurTeam from './pages/OurTeam.jsx';
import Gallery from './pages/Gallery.jsx';
import Contact from './pages/Contact.jsx';

import PageEffects from './components/PageEffects.jsx';
import './App.css';

// Donate loads separately to keep the other pages lightweight.
const Donate = lazy(() => import('./pages/Donate.jsx'));

const SITE_URL = 'https://www.thewebinitiativeltd.org';

const DEFAULT_DESCRIPTION =
  'The Web Initiative Ltd advances healthier communities in Uganda through healthcare services, medical outreach, medical camps and community health initiatives.';

// SEO information for individual website pages.
const seoPages = {
  '/': {
    title:
      'The Web Initiative Ltd | Building Healthier Communities Together',
    description:
      'Discover The Web Initiative Ltd, advancing healthier communities in Uganda through healthcare services, medical outreach, medical camps and community initiatives.',
  },

  '/about': {
    title: 'About Us | The Web Initiative Ltd',
    description:
      'Learn about The Web Initiative Ltd, our mission, vision and commitment to improving community wellbeing through healthcare and medical outreach in Uganda.',
  },

  '/medical-services': {
    title: 'Medical Services | The Web Initiative Ltd',
    description:
      'Explore the healthcare services offered by The Web Initiative Ltd to improve access to quality healthcare and support healthier communities in Uganda.',
  },

  '/medical-camps': {
    title: 'Medical Camps in Uganda | The Web Initiative Ltd',
    description:
      'Discover medical camps organised by The Web Initiative Ltd, bringing healthcare services and medical outreach closer to communities in Uganda.',
  },

  '/our-team': {
    title: 'Our Team | The Web Initiative Ltd',
    description:
      'Meet the people behind The Web Initiative Ltd and discover the team working to advance healthcare and strengthen communities.',
  },

  '/gallery': {
    title: 'Gallery | The Web Initiative Ltd',
    description:
      'Explore photos and moments from The Web Initiative Ltd medical camps, healthcare programmes and community outreach activities.',
  },

  '/contact': {
    title: 'Contact Us | The Web Initiative Ltd',
    description:
      'Get in touch with The Web Initiative Ltd for healthcare partnerships, medical outreach, community initiatives and general enquiries.',
  },

  '/donate': {
    title: 'Donate | Support Healthier Communities | The Web Initiative Ltd',
    description:
      'Support The Web Initiative Ltd through donations that help provide healthcare, medicine and treatment for children and communities in need.',
  },
};

// Updates metadata whenever the visitor navigates to another page.
function SEOManager() {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname.replace(/\/+$/, '') || '/';

    const page = seoPages[pathname];

    const isNotFound = !page && !pathname.startsWith('/medical-camps/');

    const title = page?.title ||
      (pathname.startsWith('/medical-camps/')
        ? 'Medical Camp Details | The Web Initiative Ltd'
        : 'Page Not Found | The Web Initiative Ltd');

    const description = page?.description ||
      (pathname.startsWith('/medical-camps/')
        ? 'Learn more about medical outreach and healthcare activities organised by The Web Initiative Ltd in Uganda.'
        : DEFAULT_DESCRIPTION);

    const canonicalUrl = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;

    // Page title
    document.title = title;

    // Helper for creating or updating meta tags.
    const setMeta = (attribute, key, content) => {
      let element = document.head.querySelector(
        `meta[${attribute}="${key}"]`
      );

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    // Standard SEO metadata
    setMeta('name', 'description', description);
    setMeta(
      'name',
      'robots',
      isNotFound ? 'noindex, follow' : 'index, follow'
    );

    // Open Graph metadata
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', 'The Web Initiative Ltd');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:locale', 'en_UG');

    // Twitter metadata
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    // Canonical URL
    let canonical = document.head.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }

    canonical.setAttribute('href', canonicalUrl);

    // Organisation structured data.
    // This helps search engines understand the organisation.
    const organisationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'The Web Initiative Ltd',
      url: SITE_URL,
      description: DEFAULT_DESCRIPTION,
    };

    let schemaScript = document.getElementById(
      'organisation-schema'
    );

    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'organisation-schema';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    schemaScript.textContent = JSON.stringify(organisationSchema);
  }, [location.pathname]);

  return null;
}

function App() {
  const location = useLocation();

  return (
    <div className="app">
      <SEOManager />

      <PageEffects />

      {/* Keyed by path so each new page plays the entrance transition */}
      <div className="page-transition" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />

          <Route path="/about" element={<About />} />

          <Route
            path="/medical-services"
            element={<MedicalServices />}
          />

          <Route
            path="/medical-camps"
            element={<MedicalCamps />}
          />

          <Route
            path="/medical-camps/:id"
            element={<CampDetails />}
          />

          <Route path="/our-team" element={<OurTeam />} />

          {/* The Our Impact page was removed; old links go to Home */}
          <Route
            path="/impact"
            element={<Navigate to="/" replace />}
          />

          <Route
            path="/donate"
            element={
              <Suspense fallback={null}>
                <Donate />
              </Suspense>
            }
          />

          <Route path="/gallery" element={<Gallery />} />

          <Route path="/contact" element={<Contact />} />

          <Route
            path="*"
            element={
              <main className="placeholder-page">
                <div className="placeholder-content">
                  <span className="placeholder-label">
                    THE WEB INITIATIVE LTD
                  </span>

                  <h1>
                    Page <span className="hand-accent">Not Found</span>
                  </h1>

                  <p>
                    The page you are looking for does not exist.
                  </p>

                  <a href="/">Return to Home</a>
                </div>
              </main>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
