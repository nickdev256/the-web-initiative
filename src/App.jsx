
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import MedicalServices from './pages/MedicalServices.jsx';
import MedicalCamps from './pages/MedicalCamps.jsx';
import CampDetails from './pages/CampDetails.jsx';
import OurTeam from './pages/OurTeam.jsx';
import Impact from './pages/Impact.jsx';
import Donate from './pages/Donate.jsx';
import Gallery from './pages/Gallery.jsx';
import Contact from './pages/Contact.jsx';
import './App.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/medical-services"
          element={<MedicalServices />}
        />
        <Route path="/medical-camps" element={<MedicalCamps />} />
        <Route
          path="/medical-camps/:id"
          element={<CampDetails />}
        />
        <Route path="/our-team" element={<OurTeam />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/donate" element={<Donate />} />
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
                <h1>Page Not Found</h1>
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
  );
}

export default App;
