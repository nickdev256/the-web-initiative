
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  Search,
  Heart,
  MapPin,
  Mail,
  CalendarDays,
  ArrowRight,
  Info,
  Target,
  History,
  Flag,
  Tent,
  Images,
} from 'lucide-react';
import { CONTACT_EMAIL } from '../config.js';
import './Navbar.css';

const navLinks = [
  { label: 'Home', path: '/' },
  {
    id: 'about',
    label: 'About Us',
    path: '/about',
    matches: ['/about'],
    dropdown: [
      {
        label: 'Overview',
        path: '/about',
        icon: Info,
        description: 'Who we are and what we do',
      },
      {
        label: 'Our Mission & Vision',
        path: '/about#mission-vision',
        icon: Target,
        description: 'The purpose that guides us',
      },
      {
        label: 'Our History',
        path: '/about#our-history',
        icon: History,
        description: 'How our journey began',
      },
      {
        label: 'Our Objectives',
        path: '/about#objectives',
        icon: Flag,
        description: 'What we are working towards',
      },
    ],
  },
  { label: 'Medical Services', path: '/medical-services' },
  {
    id: 'camps',
    label: 'Medical Camps',
    path: '/medical-camps',
    matches: ['/medical-camps', '/gallery'],
    dropdown: [
      {
        label: 'All Medical Camps',
        path: '/medical-camps',
        icon: Tent,
        description: 'Our community outreach camps',
      },
      {
        label: 'Gallery',
        path: '/gallery',
        icon: Images,
        description: 'Photos from our camps and outreach',
      },
    ],
  },
  { label: 'Our Team', path: '/our-team' },
  { label: 'Our Impact', path: '/impact' },
  { label: 'Contact', path: '/contact' },
];

// Every page reachable from the menu, including dropdown items, for search.
const searchablePages = navLinks.flatMap((link) =>
  link.dropdown ? [link, ...link.dropdown] : [link]
);

const DESKTOP_MIN_WIDTH = 1100;

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
    setSearchOpen(false);
  };

  const isDesktop = () => window.innerWidth > DESKTOP_MIN_WIDTH;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    const handleOutsideClick = (event) => {
      if (!event.target.closest('.navbar-dropdown')) {
        setOpenDropdown(null);
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
    const handleScroll = () => setScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
    setSearchTerm('');
  }, [location.pathname, location.hash]);

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchTerm.trim().toLowerCase();
    if (!query) return;

    const match = searchablePages.find((page) =>
      page.label.toLowerCase().includes(query)
    );

    if (match) {
      navigate(match.path);
      closeMenu();
      setSearchTerm('');
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdown((current) => (current === id ? null : id));
  };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar-topbar" aria-hidden={scrolled}>
        <div className="navbar-topbar-inner">
          <div className="navbar-topbar-info">
            <span>
              <MapPin size={14} aria-hidden="true" />
              Jinja, Uganda
            </span>

            <a href={`mailto:${CONTACT_EMAIL}`} tabIndex={scrolled ? -1 : 0}>
              <Mail size={14} aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
          </div>

          <Link
            to="/contact"
            className="navbar-topbar-cta"
            tabIndex={scrolled ? -1 : 0}
          >
            <CalendarDays size={14} aria-hidden="true" />
            Ask about upcoming medical camps
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="navbar-main">
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
          </Link>

          <nav
            className={`navbar-navigation ${menuOpen ? 'is-open' : ''}`}
            id="primary-navigation"
            aria-label="Main navigation"
          >
            <div className="mobile-menu-heading">
              <img
                src="/images/logo.jpeg"
                alt=""
                className="mobile-heading-logo"
              />

              <button
                type="button"
                className="mobile-close-button"
                aria-label="Close navigation"
                onClick={closeMenu}
              >
                <X size={24} />
              </button>
            </div>

            <div className="navbar-links">
              {navLinks.map((link) => {
                if (link.dropdown) {
                  const isOpen = openDropdown === link.id;
                  const isActive = link.matches.some((path) =>
                    location.pathname.startsWith(path)
                  );
                  const submenuId = `${link.id}-submenu`;

                  return (
                    <div
                      key={link.id}
                      className={`navbar-dropdown ${
                        isOpen ? 'dropdown-open' : ''
                      }`}
                      onMouseEnter={() => {
                        if (isDesktop()) setOpenDropdown(link.id);
                      }}
                      onMouseLeave={() => {
                        if (isDesktop()) setOpenDropdown(null);
                      }}
                    >
                      <div
                        className={`navbar-dropdown-trigger ${
                          isActive ? 'active' : ''
                        }`}
                      >
                        <NavLink
                          to={link.path}
                          className={`navbar-link ${isActive ? 'active' : ''}`}
                          onClick={closeMenu}
                        >
                          <span>{link.label}</span>
                        </NavLink>

                        <button
                          type="button"
                          className="dropdown-toggle"
                          aria-label={`Toggle ${link.label} submenu`}
                          aria-expanded={isOpen}
                          aria-controls={submenuId}
                          onClick={() => toggleDropdown(link.id)}
                        >
                          <ChevronDown size={15} className="nav-chevron" />
                        </button>
                      </div>

                      <div
                        id={submenuId}
                        className="navbar-submenu"
                        aria-hidden={!isOpen}
                      >
                        {link.dropdown.map((item) => {
                          const Icon = item.icon;

                          return (
                            <Link
                              key={item.label}
                              to={item.path}
                              tabIndex={isOpen ? 0 : -1}
                              className="navbar-submenu-link"
                              onClick={closeMenu}
                            >
                              <span className="submenu-icon">
                                <Icon size={18} aria-hidden="true" />
                              </span>
                              <span className="submenu-text">
                                <strong>{item.label}</strong>
                                <small>{item.description}</small>
                              </span>
                            </Link>
                          );
                        })}
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
              <form className="mobile-search-form" onSubmit={handleSearch}>
                <Search size={19} />

                <input
                  type="search"
                  placeholder="Search pages..."
                  aria-label="Search website pages"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />

                <button type="submit">Search</button>
              </form>

              <p>Search for Home, Medical Services, Gallery and more.</p>
            </div>

            <Link
              to="/donate"
              className="navbar-donate mobile-donate btn-support"
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
                {searchOpen ? <X size={20} /> : <Search size={20} />}
              </button>

              {searchOpen && (
                <form className="desktop-search-form" onSubmit={handleSearch}>
                  <input
                    type="search"
                    placeholder="Search pages..."
                    aria-label="Search website pages"
                    autoFocus
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />

                  <button type="submit" aria-label="Submit search">
                    <Search size={18} />
                  </button>
                </form>
              )}
            </div>

            <Link
              to="/donate"
              className="navbar-donate desktop-donate btn-support"
              aria-label="Support Our Work"
              onClick={closeMenu}
            >
              <Heart size={16} fill="currentColor" className="donate-heart" />
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
              {menuOpen ? <X size={25} /> : <Menu size={25} />}
            </button>
          </div>
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
