import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect }                from 'react';
import ResultCard                   from '../components/ResultCard';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result   = location.state?.result;

  // If no result data — redirect to home
  useEffect(() => {
    if (!result) navigate('/');
  }, [result, navigate]);

  if (!result) return null;

  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <div style={s.header}>
        <h1 style={s.title}>Test Complete! 🎉</h1>
        <p style={s.subtitle}>Here is how you performed</p>
      </div>

      {/* ── Result Card ── */}
      <ResultCard result={result} />

      {/* ── Actions ── */}
      <div style={s.actions}>
        <button
          onClick={() => navigate('/test')}
          style={s.outlineBtn}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.color       = 'var(--accent)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.color       = 'var(--text-secondary)';
          }}
        >
          Try Again
        </button>
        <button
          onClick={() => navigate('/profile')}
          style={s.accentBtn}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
        >
          View Profile
        </button>
      </div>

    </div>
  );
};

const s = {
  page: {
    maxWidth  : '700px',
    margin    : '0 auto',
    padding   : '2rem 1rem',
  },
  header: {
    textAlign    : 'center',
    marginBottom : '2rem',
  },
  title: {
    fontSize     : '28px',
    fontWeight   : 700,
    color        : 'var(--text-primary)',
    marginBottom : '8px',
  },
  subtitle: {
    fontSize : '14px',
    color    : 'var(--text-secondary)',
  },
  actions: {
    display        : 'flex',
    justifyContent : 'center',
    gap            : '12px',
    marginTop      : '2rem',
    flexWrap       : 'wrap',
  },
  outlineBtn: {
    padding      : '10px 28px',
    borderRadius : '8px',
    border       : '1px solid var(--border-color)',
    background   : 'transparent',
    color        : 'var(--text-secondary)',
    fontSize     : '14px',
    fontWeight   : 500,
    cursor       : 'pointer',
    transition   : 'all 0.2s',
  },
  accentBtn: {
    padding      : '10px 28px',
    borderRadius : '8px',
    border       : 'none',
    background   : 'var(--accent)',
    color        : '#fff',
    fontSize     : '14px',
    fontWeight   : 600,
    cursor       : 'pointer',
    transition   : 'background 0.2s',
  },
};

export default Results;