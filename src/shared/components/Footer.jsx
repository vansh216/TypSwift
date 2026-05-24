import { Link } from 'react-router-dom';

const FOOTER_LINKS = [
  {
    title: 'Product',
    links: [
      { label: 'Start Typing',  to: '/test'        },
      { label: 'Leaderboard',   to: '/leaderboard' },
      { label: 'My Profile',    to: '/profile'     },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Login',    to: '/login'    },
      { label: 'Register', to: '/register' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'How it works', to: '/test'    },
      { label: 'Top Scores',   to: '/leaderboard'  },
    ],
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer  style={s.footer}>
      <div className='' style={s.inner}>

        
        <div style={s.topRow}>

          {/* Brand */}
          <div style={s.brand}>
            <Link to="/" style={s.logoLink}>
              <div style={s.logoIcon}><img src="favicon.png" alt="logo.." /></div>
              <span style={s.logoText}>
                Typ<span style={s.logoAccent}>Swift</span>
              </span>
            </Link>
            <p style={s.tagline}>
              The modern typing speed test. Track your progress,
              compete on the leaderboard, and type faster every day.
            </p>
            {/* Stats strip */}
            <div style={s.statsStrip}>
              <div style={s.stripStat}>
                <span style={s.stripValue}>6</span>
                <span style={s.stripLabel}>Time Modes</span>
              </div>
              <div style={s.stripDivider} />
              <div style={s.stripStat}>
                <span style={s.stripValue}>∞</span>
                <span style={s.stripLabel}>Paragraphs</span>
              </div>
              <div style={s.stripDivider} />
              <div style={s.stripStat}>
                <span style={s.stripValue}>100%</span>
                <span style={s.stripLabel}>Free</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div style={s.linksRow}>
            {FOOTER_LINKS.map((section) => (
              <div key={section.title} style={s.linkSection}>
                <h4 style={s.linkTitle}>{section.title}</h4>
                <div style={s.linkList}>
                  {section.links.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      style={s.footerLink}
                      onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                      onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={s.divider} />

        {/* ── Bottom Row ── */}
        <div style={s.bottomRow}>
          <p style={s.copyright}>
            © {year} TypSwift. Built with ❤️ for typists everywhere.
          </p>
          <div style={s.bottomLinks}>
            <Link
              to="/test"
              style={s.bottomLink}
              onMouseEnter={e => e.target.style.color = 'var(--accent)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >
              Start Typing
            </Link>
            <span style={s.dot}>·</span>
            <Link
              to="/leaderboard"
              style={s.bottomLink}
              onMouseEnter={e => e.target.style.color = 'var(--accent)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >
              Leaderboard
            </Link>
            <span style={s.dot}>·</span>
            <Link
              to="/register"
              style={s.bottomLink}
              onMouseEnter={e => e.target.style.color = 'var(--accent)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >
              Register Free
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

const s = {
  footer: {
    background: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border-color)',
    marginTop: '5rem',
    transition: 'background 0.3s',
    width: '100%',
  },

  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 1.2rem 1.5rem',
  },

  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '3rem',
    flexWrap: 'wrap',
    marginBottom: '2.5rem',
  },

  // ── Brand ──
  brand: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    flex: '1 1 280px',
    minWidth: '260px',
  },

  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    flexWrap: 'wrap',
  },

  logoIcon: {
    width: '34px',
    height: '34px',
    background: 'var(--accent)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '18px',
    flexShrink: 0,
    overflow: 'hidden',
  },

  logoText: {
    fontWeight: 700,
    fontSize: '18px',
    color: 'var(--text-primary)',
  },

  logoAccent: {
    color: 'var(--accent)',
  },

  tagline: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
  },

  statsStrip: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '10px 14px',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    width: 'fit-content',
    flexWrap: 'wrap',
  },

  stripStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },

  stripValue: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--accent)',
  },

  stripLabel: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    fontWeight: 500,
    textAlign: 'center',
  },

  stripDivider: {
    width: '1px',
    height: '28px',
    background: 'var(--border-color)',
  },

  // ── Links ──
  linksRow: {
    display: 'flex',
    gap: '3rem',
    flexWrap: 'wrap',
    flex: '1 1 300px',
    justifyContent: 'space-between',
  },

  linkSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: '120px',
  },

  linkTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },

  linkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  footerLink: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'color 0.2s',
    width: 'fit-content',
  },

  // ── Bottom ──
  divider: {
    height: '1px',
    background: 'var(--border-color)',
    marginBottom: '1.5rem',
  },

  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },

  copyright: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    lineHeight: 1.6,
  },

  bottomLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },

  bottomLink: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },

  dot: {
    color: 'var(--border-color)',
    fontSize: '12px',
  },
};

export default Footer;