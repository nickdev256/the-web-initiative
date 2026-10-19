
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  Search,
  Heart
} from 'lucide-react';
import './Navbar.css';

const navLinks = [
  { label: 'Home', path: '/' },
  {
    label: 'About Us',
    path: '/about',
    dropdown: [
      { label: 'Overview', path: '/about' },
      { label: 'Our Mission & Vision', path: '/about#mission-vision' },
      { label: 'Our History', path: '/about#our-history' },
      { label: 'Our Objectives', path: '/about#objectives' }
    ]
  },
  { label: 'Medical Services', path: '/medical-services' },
  { label: 'Medical Camps', path: '/medical-camps' },
  { label: 'Our Team', path: '/our-team' },
  { label: 'Our Impact', path: '/impact' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' }
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const aboutRef = useRef(null);

  const closeMenu = () => {
    setMenuOpen(false);
    setAboutOpen(false);
    setSearchOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    const handleOutsideClick = (event) => {
      if (
        aboutRef.current &&
        !aboutRef.current.contains(event.target)
      ) {
        setAboutOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [menuOpen]);

  useEffect(() => {
    closeMenu();
    setSearchTerm('');
  }, [location.pathname, location.hash]);

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchTerm.trim().toLowerCase();
    if (!query) return;

    const match = navLinks.find((link) =>
      link.label.toLowerCase().includes(query)
    );

    if (match) {
      navigate(match.path);
      closeMenu();
      setSearchTerm('');
    }
  };

  return (
    <header className="site-header">
      <div className="navbar-container">
        <Link
          to="/"
          className="navbar-brand"
          aria-label="The Web Initiative Ltd home"
          onClick={closeMenu}
        >
          <img
            src="/images/logo.jpeg"
            alt="The Web Initiative logo"
            className="navbar-logo"
          />

          <span className="navbar-brand-text">
            <strong>THE WEB INITIATIVE</strong>
            <small>LIMITED</small>
          </span>
        </Link>

        <nav
          className={`navbar-navigation ${menuOpen ? 'is-open' : ''}`}
          id="primary-navigation"
          aria-label="Main navigation"
        >
          <div className="mobile-menu-heading">
            <div className="mobile-heading-brand">
              <span className="mobile-heading-title">
                THE WEB INITIATIVE
              </span>
              <span className="mobile-heading-subtitle">
                Explore our website
              </span>
            </div>

            <button
              type="button"
              className="mobile-close-button"
              aria-label="Close navigation"
              onClick={closeMenu}
            >
              <X size={25} />
            </button>
          </div>

          <div className="navbar-links">
            {navLinks.map((link) => {
              const isAbout = link.label === 'About Us';
              const isActive = isAbout
                ? location.pathname.startsWith('/about')
                : location.pathname === link.path;

              if (isAbout) {
                return (
                  <div
                    key={link.path}
                    className={`navbar-dropdown ${
                      aboutOpen ? 'dropdown-open' : ''
                    }`}
                    ref={aboutRef}
                    onMouseEnter={() => {
                      if (window.innerWidth > 1100) {
                        setAboutOpen(true);
                      }
                    }}
                    onMouseLeave={() => {
                      if (window.innerWidth > 1100) {
                        setAboutOpen(false);
                      }
                    }}
                  >
                    <div className="navbar-dropdown-trigger">
                      <NavLink
                        to={link.path}
                        className={`navbar-link ${
                          isActive ? 'active' : ''
                        }`}
                        onClick={closeMenu}
                      >
                        <span>{link.label}</span>
                      </NavLink>

                      <button
                        type="button"
                        className="dropdown-toggle"
                        aria-label="Toggle About Us submenu"
                        aria-expanded={aboutOpen}
                        aria-controls="about-submenu"
                        onClick={() =>
                          setAboutOpen((open) => !open)
                        }
                      >
                        <ChevronDown
                          size={14}
                          className="nav-chevron"
                        />
                      </button>
                    </div>

                    <div
                      id="about-submenu"
                      className="navbar-submenu"
                      aria-hidden={!aboutOpen}
                    >
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          to={item.path}
                          tabIndex={aboutOpen ? 0 : -1}
                          className="navbar-submenu-link"
                          onClick={closeMenu}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `navbar-link${isActive ? ' active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="mobile-search-area">
            <form
              className="mobile-search-form"
              onSubmit={handleSearch}
            >
              <Search size={19} />

              <input
                type="search"
                placeholder="Search pages..."
                aria-label="Search website pages"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />

              <button type="submit">Search</button>
            </form>

            <p>
              Search for Home, Medical Services, Gallery and more.
            </p>
          </div>

          <Link
            to="/donate"
            className="navbar-donate mobile-donate"
            onClick={closeMenu}
          >
            <Heart size={16} fill="currentColor" />
            <span>Support Our Work</span>
          </Link>
        </nav>

        <div className="navbar-actions">
          <div className="desktop-search-wrap">
            <button
              type="button"
              className="navbar-search-button"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((open) => !open)}
            >
              {searchOpen ? <X size={22} /> : <Search size={22} />}
            </button>

            {searchOpen && (
              <form
                className="desktop-search-form"
                onSubmit={handleSearch}
              >
                <input
                  type="search"
                  placeholder="Search pages..."
                  aria-label="Search website pages"
                  autoFocus
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                />

                <button type="submit" aria-label="Submit search">
                  <Search size={18} />
                </button>
              </form>
            )}
          </div>

          <Link
            to="/donate"
            className="navbar-donate desktop-donate"
            onClick={closeMenu}
          >
            <Heart size={16} fill="currentColor" />
            <span>Support Our Work</span>
          </Link>

          <button
            type="button"
            className={`mobile-menu-toggle ${
              menuOpen ? 'toggle-active' : ''
            }`}
            aria-label={
              menuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={27} /> : <Menu size={27} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="navbar-backdrop"
          aria-label="Close navigation menu"
          onClick={closeMenu}
        />
      )}
    </header>
  );
}

export default Navbar;
