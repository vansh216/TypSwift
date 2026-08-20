import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // On startup — read saved theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  // Toggle dark / light
  // adds or removes 'dark' class on <html>
  // all CSS variables in index.css switch automatically
  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/multiplayer', label: '⚔️ Battle'   },
    { path: '/leaderboard', label: 'Leaderboard' },
    ...(isLoggedIn ? [{ path: '/profile', label: 'Profile' }] : []),
  ];

  // Styles using CSS variables from index.css
  const styles = {
    nav: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-color)',
      transition: 'background 0.3s, border-color 0.3s',
    },
    inner: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      textDecoration: 'none',
    },
    logoIcon: {
      width: '34px',
      height: '34px',
      background: 'var(--accent)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '18px',
      flexShrink: 0,
    },
    logoText: {
      fontWeight: 600,
      fontSize: '17px',
      color: 'var(--text-primary)',
    },
    logoAccent: {
      color: 'var(--accent)',
    },
    desktopLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
    },
    link: (active) => ({
      fontSize: '14px',
      fontWeight: active ? 600 : 400,
      color: active ? 'var(--accent)' : 'var(--text-secondary)',
      textDecoration: 'none',
      borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
      paddingBottom: '2px',
      transition: 'color 0.2s, border-color 0.2s',
    }),
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    iconBtn: {
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      background: 'var(--bg-secondary)',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'border-color 0.2s',
    },
    badge: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '5px 12px',
      borderRadius: '8px',
      background: 'var(--accent-light)',
      border: '1px solid var(--accent-border)',
    },
    badgeAvatar: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: 'var(--accent)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '11px',
      fontWeight: 700,
      flexShrink: 0,
    },
    badgeText: {
      fontSize: '13px',
      fontWeight: 500,
      color: 'var(--accent-text)',
    },
    outlineBtn: {
      fontSize: '13px',
      padding: '6px 14px',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      background: 'transparent',
      color: 'var(--text-secondary)',
      cursor: 'pointer',
      transition: 'border-color 0.2s, color 0.2s',
    },
    loginLink: {
      fontSize: '13px',
      padding: '6px 14px',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      background: 'transparent',
      color: 'var(--text-secondary)',
      textDecoration: 'none',
      transition: 'border-color 0.2s, color 0.2s',
    },
    registerLink: {
      fontSize: '13px',
      padding: '6px 16px',
      borderRadius: '8px',
      border: 'none',
      background: 'var(--accent)',
      color: '#fff',
      fontWeight: 500,
      textDecoration: 'none',
      transition: 'background 0.2s',
    },
    mobileMenu: {
      borderTop: '1px solid var(--border-color)',
      background: 'var(--bg-primary)',
      padding: '1rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      transition: 'background 0.3s',
    },
    mobileDivider: {
      height: '1px',
      background: 'var(--border-color)',
    },
    mobileLink: (active) => ({
      fontSize: '14px',
      fontWeight: active ? 600 : 400,
      color: active ? 'var(--accent)' : 'var(--text-secondary)',
      textDecoration: 'none',
    }),
    mobileLogout: {
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: 500,
      color: 'var(--danger)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
    },
    mobileAuthRow: {
      display: 'flex',
      gap: '8px',
    },
    mobileLoginLink: {
      flex: 1,
      textAlign: 'center',
      fontSize: '14px',
      padding: '8px',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      color: 'var(--text-secondary)',
      textDecoration: 'none',
    },
    mobileRegisterLink: {
      flex: 1,
      textAlign: 'center',
      fontSize: '14px',
      padding: '8px',
      borderRadius: '8px',
      background: 'var(--accent)',
      color: '#fff',
      fontWeight: 500,
      textDecoration: 'none',
      border: 'none',
    },
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>

        {/* ── Logo ── */}
        <Link to="/" style={styles.logo}>
          <div style={styles.logoIcon}><img className='rounded-2xl' src="favicon.png" alt="" /></div>
          <span style={styles.logoText}>
            Typ<span style={styles.logoAccent}>Swift</span>
          </span>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <div style={{...styles.desktopLinks,display: isMobile ? 'none' : 'flex',}}>
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              style={styles.link(isActive(path))}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ── Right Side Actions ── */}
        <div style={styles.actions}>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={styles.iconBtn}
            aria-label="Toggle theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Logged in */}
          {isLoggedIn ? (
            <div style={{ display: isMobile ?'none' : 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={styles.badge}>
                <div style={styles.badgeAvatar}>
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span style={styles.badgeText}>
                  {user?.username}
                </span>
              </div>
              <button
                onClick={handleLogout}
                style={styles.outlineBtn}
                onMouseEnter={e => {
                  e.target.style.borderColor = 'var(--danger)';
                  e.target.style.color = 'var(--danger)';
                }}
                onMouseLeave={e => {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.color = 'var(--text-secondary)';
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: isMobile ? 'none': 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                to="/login"
                style={styles.loginLink}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={styles.registerLink}
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              ...styles.iconBtn,
              display: isMobile ? 'flex' : 'none', // shows only on mobile
            }}
            id="hamburger"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              style={styles.mobileLink(isActive(path))}
            >
              {label}
            </Link>
          ))}

          <div style={styles.mobileDivider} />

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              style={styles.mobileLogout}
            >
              Logout
            </button>
          ) : (
            <div style={styles.mobileAuthRow}>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                style={styles.mobileLoginLink}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                style={styles.mobileRegisterLink}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;