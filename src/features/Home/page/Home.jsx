import { useState, useEffect, useRef } from 'react';
import { useNavigate }                 from 'react-router-dom';
import { useAuth }                     from '../../../shared/context/AuthContext.jsx';
import { fetchLeaderboard }            from '../../Leaderboard/api/Leaderboard.api.jsx';
import { fetchUserHistory }            from '../../profile/api/Profile.api.jsx';

// ─────────────────────────────────────────
// Constants
// ─────────────────────────────────────────
const TIME_MODES = [
  { label: '1 min',  value: 1  },
  { label: '2 min',  value: 2  },
  { label: '3 min',  value: 3  },
  { label: '5 min',  value: 5  },
  { label: '10 min', value: 10 },
  { label: 'Custom', value: 0  },
];

const FEATURES = [
  {
    icon  : '📊',
    title : 'Real Time WPM',
    desc  : 'Live words per minute counter updates on every single keystroke as you type.',
    bg    : '#fff7ed',
    border: '#fed7aa',
    color : '#c2410c',
  },
  {
    icon  : '🎯',
    title : 'Accuracy Tracking',
    desc  : 'Every mistake is highlighted in red instantly. Your accuracy is calculated at the end.',
    bg    : '#dcfce7',
    border: '#86efac',
    color : '#15803d',
  },
  {
    icon  : '🏆',
    title : 'Global Leaderboard',
    desc  : 'Compete with typists worldwide. Filter by time mode to find your rank.',
    bg    : '#dbeafe',
    border: '#93c5fd',
    color : '#1d4ed8',
  },
  {
    icon  : '📊',
    title : 'Progress Charts',
    desc  : 'Visual WPM graphs show your improvement over time across all your test sessions.',
    bg    : '#ede9fe',
    border: '#c4b5fd',
    color : '#7c3aed',
  },
  {
    icon  : '⏱️',
    title : 'Multiple Time Modes',
    desc  : 'Choose from 1, 2, 3, 5, 10 minutes or set a custom duration that fits you.',
    bg    : '#fef9c3',
    border: '#fde047',
    color : '#854d0e',
  },
  {
    icon  : '🌙',
    title : 'Dark & Light Mode',
    desc  : 'Easy on the eyes whether you prefer a bright workspace or dark environment.',
    bg    : '#f0fdf4',
    border: '#bbf7d0',
    color : '#166534',
  },
];

const HOW_IT_WORKS = [
  {
    step : '01',
    icon : '⏱️',
    title: 'Choose your time',
    desc : 'Pick from 1, 2, 3, 5, or 10 minutes — or set a custom duration. Every mode has unique paragraphs.',
  },
  {
    step : '02',
    icon : '⌨️',
    title: 'Start typing',
    desc : 'A paragraph appears on screen. Start typing and watch your WPM update live with every keystroke.',
  },
  {
    step : '03',
    icon : '📈',
    title: 'Track your progress',
    desc : 'See your WPM, accuracy, and error count. Login to save results and climb the leaderboard.',
  },
];

const TYPING_WORDS = [
  'faster.',
  'smarter.',
  'accurately.',
  'confidently.',
  'every day.',
];

// ─────────────────────────────────────────
// Typing Animation Hook
// ─────────────────────────────────────────
const useTypingAnimation = (words) => {
  const [displayed,   setDisplayed]   = useState('');
  const [wordIndex,   setWordIndex]   = useState(0);
  const [isDeleting,  setIsDeleting]  = useState(false);
  const [isPaused,    setIsPaused]    = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];

    if (isPaused) {
      const pause = setTimeout(() => setIsPaused(false), 1200);
      return () => clearTimeout(pause);
    }

    const speed = isDeleting ? 60 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayed(current.slice(0, displayed.length + 1));
        if (displayed.length + 1 === current.length) {
          setIsPaused(true);
          setIsDeleting(true);
        }
      } else {
        setDisplayed(current.slice(0, displayed.length - 1));
        if (displayed.length - 1 === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayed, isDeleting, isPaused, wordIndex, words]);

  return displayed;
};

// ─────────────────────────────────────────
// Leaderboard Preview Component
// ─────────────────────────────────────────
const LeaderboardPreview = () => {
  const navigate              = useNavigate();
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);

  const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchLeaderboard({ limit: 5 });
        setData(res.leaderboard);
      } catch (err) {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div style={s.previewSection}>
      <div style={s.sectionHeader}>
        <div>
          <h2 style={s.sectionTitle}>🏆 Top Typists</h2>
          <p style={s.sectionSubtitle}>Can you make it to the top?</p>
        </div>
        <button
          onClick={() => navigate('/leaderboard')}
          style={s.viewAllBtn}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.color       = 'var(--accent)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.color       = 'var(--text-secondary)';
          }}
        >
          View All →
        </button>
      </div>

      <div style={s.previewCard}>
        {loading ? (
          <div style={s.centerBox}>
            <div style={s.spinner} />
          </div>
        ) : data.length === 0 ? (
          <div style={s.centerBox}>
            <p style={s.emptyText}>No scores yet — be the first!</p>
          </div>
        ) : (
          data.map((entry, index) => (
            <div
              key={index}
              style={{
                ...s.previewRow,
                background: index % 2 === 0
                  ? 'var(--card-bg)'
                  : 'var(--bg-secondary)',
                borderLeft: entry.rank <= 3
                  ? `3px solid ${
                      entry.rank === 1 ? '#F59E0B'
                    : entry.rank === 2 ? '#94A3B8'
                    : '#B45309'
                    }`
                  : '3px solid transparent',
              }}
            >
              <span style={s.previewRank}>
                {entry.rank <= 3 ? MEDALS[entry.rank] : entry.rank}
              </span>
              <div style={s.previewAvatar}>
                {entry.username?.charAt(0).toUpperCase()}
              </div>
              <span style={s.previewName}>{entry.username}</span>
              <span style={s.previewWpm}>{entry.bestWpm} wpm</span>
              <span style={s.previewAcc}>{entry.accuracy}%</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// Last Result Component
// ─────────────────────────────────────────
const LastResult = () => {
  const navigate              = useNavigate();
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchUserHistory({ page: 1, limit: 1 });
        if (res.results?.length > 0) setResult(res.results[0]);
      } catch (err) {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !result) return null;

  const accuracyColor =
    result.accuracy >= 95 ? '#16a34a' :
    result.accuracy >= 85 ? '#ca8a04' :
    '#dc2626';

  return (
    <div style={s.lastResultSection}>
      <div style={s.sectionHeader}>
        <div>
          <h2 style={s.sectionTitle}>📈 Your Last Test</h2>
          <p style={s.sectionSubtitle}>
            {new Date(result.createdAt).toLocaleDateString('en-IN', {
              day  : '2-digit',
              month: 'short',
              year : 'numeric',
            })}
          </p>
        </div>
        <button
          onClick={() => navigate('/profile')}
          style={s.viewAllBtn}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.color       = 'var(--accent)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.color       = 'var(--text-secondary)';
          }}
        >
          View Profile →
        </button>
      </div>
      <div style={s.lastResultCard}>
        <div style={s.lastResultGrid}>
          {[
            { label: 'WPM',      value: result.wpm,                  color: 'var(--accent)'                           },
            { label: 'Accuracy', value: `${result.accuracy}%`,       color: accuracyColor                             },
            { label: 'Minutes',  value: result.duration / 60,        color: 'var(--text-primary)'                     },
            { label: 'Errors',   value: result.errors,               color: result.errors > 0 ? '#dc2626' : '#16a34a' },
          ].map((stat, i, arr) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={s.lastStat}>
                <span style={{ ...s.lastValue, color: stat.color }}>{stat.value}</span>
                <span style={s.lastLabel}>{stat.label}</span>
              </div>
              {i < arr.length - 1 && <div style={s.lastDivider} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// Main Home Component
// ─────────────────────────────────────────
const Home = () => {
  const { isLoggedIn, user }          = useAuth();
  const navigate                      = useNavigate();
  const [selectedMode,  setSelectedMode]  = useState(1);
  const [customMinutes, setCustomMinutes] = useState('');
  const [customError,   setCustomError]   = useState('');
  const typingText                    = useTypingAnimation(TYPING_WORDS);

  const handleStart = () => {
    let duration = selectedMode;
    if (selectedMode === 0) {
      const val = parseInt(customMinutes);
      if (!val || val < 1) {
        setCustomError('Please enter a valid number of minutes');
        return;
      }
      duration = val;
    }
    navigate('/test', { state: { duration } });
  };

  return (
    <div style={s.page}>

      {/* ═══════════════════════════════
          HERO SECTION
      ═══════════════════════════════ */}
      <div style={s.hero}>
        <div style={s.heroInner}>

          {/* Tag */}
          <div style={s.tag}>
            ⌨ The Modern Typing Speed Test
          </div>

          {/* Heading with typing animation */}
          <h1 style={s.heroTitle}>
            Type{' '}
            <span style={s.heroAccent}>
              {typingText}
              <span style={s.cursor}>|</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p style={s.heroSubtitle}>
            Test your typing speed and accuracy with real paragraphs.
            Track your progress, compete on the leaderboard, and improve every day.
          </p>

          {/* Mode Selector */}
          <div style={s.modeSection}>
            <p style={s.modeLabel}>Select time mode</p>
            <div style={s.modeRow}>
              {TIME_MODES.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => {
                    setSelectedMode(mode.value);
                    setCustomError('');
                  }}
                  style={{
                    ...s.modeBtn,
                    background : selectedMode === mode.value ? 'var(--accent)'    : 'var(--bg-secondary)',
                    color      : selectedMode === mode.value ? '#fff'              : 'var(--text-secondary)',
                    border     : selectedMode === mode.value ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                    fontWeight : selectedMode === mode.value ? 600                 : 400,
                    transform  : selectedMode === mode.value ? 'scale(1.05)'       : 'scale(1)',
                    boxShadow  : selectedMode === mode.value ? '0 4px 12px rgba(249,115,22,0.3)' : 'none',
                  }}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Custom input */}
            {selectedMode === 0 && (
              <div style={s.customWrap}>
                <div style={s.customInputRow}>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={customMinutes}
                    onChange={(e) => {
                      setCustomMinutes(e.target.value);
                      setCustomError('');
                    }}
                    placeholder="Enter minutes (e.g. 15)"
                    style={{
                      ...s.customInput,
                      borderColor: customError ? '#dc2626' : 'var(--border-color)',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e  => e.target.style.borderColor = customError ? '#dc2626' : 'var(--border-color)'}
                  />
                  <span style={s.customSuffix}>minutes</span>
                </div>
                {customError && (
                  <p style={s.customError}>⚠️ {customError}</p>
                )}
              </div>
            )}
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            style={s.startBtn}
            onMouseEnter={e => {
              e.currentTarget.style.background  = 'var(--accent-hover)';
              e.currentTarget.style.transform   = 'translateY(-2px)';
              e.currentTarget.style.boxShadow   = '0 8px 24px rgba(249,115,22,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background  = 'var(--accent)';
              e.currentTarget.style.transform   = 'translateY(0)';
              e.currentTarget.style.boxShadow   = '0 4px 14px rgba(249,115,22,0.3)';
            }}
          >
            Start Typing
          </button>

          {/* Guest / logged in notice */}
          {!isLoggedIn ? (
            <p style={s.guestNotice}>
              Playing as guest — scores won't be saved.{' '}
              <span
                onClick={() => navigate('/register')}
                style={s.guestLink}
              >
                Register free
              </span>{' '}
              to track progress.
            </p>
          ) : (
            <p style={s.welcomeBack}>
              Welcome back, <strong style={{ color: 'var(--accent)' }}>{user?.username}</strong>! Your scores will be saved automatically. ✅
            </p>
          )}

        </div>
      </div>

      {/* ═══════════════════════════════
          STATS STRIP
      ═══════════════════════════════ */}
      <div style={s.statsStrip}>
        {[
          { value: '6',    label: 'Time Modes'     },
          { value: '100+', label: 'Paragraphs'     },
          { value: '3',    label: 'Difficulty Levels' },
          { value: '100%', label: 'Free Forever'   },
        ].map((stat, i, arr) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={s.stripStat}>
              <span style={s.stripValue}>{stat.value}</span>
              <span style={s.stripLabel}>{stat.label}</span>
            </div>
            {i < arr.length - 1 && <div style={s.stripDivider} />}
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════ */}
      <div style={s.section}>
        <div style={s.sectionHeaderCenter}>
          <h2 style={s.sectionTitle}>How it works</h2>
          <p style={s.sectionSubtitle}>
            Three simple steps to start improving your typing speed today.
          </p>
        </div>

        <div style={s.stepsGrid}>
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} style={s.stepCard}>
              {/* Step number */}
              <div style={s.stepNumberWrap}>
                <span style={s.stepNumber}>{step.step}</span>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div style={s.stepConnector} />
                )}
              </div>
              {/* Icon */}
              <div style={s.stepIconWrap}>
                <span style={s.stepIcon}>{step.icon}</span>
              </div>
              <h3 style={s.stepTitle}>{step.title}</h3>
              <p style={s.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════
          FEATURES SECTION
      ═══════════════════════════════ */}
      <div style={s.section} id="features">
        <div style={s.sectionHeaderCenter}>
          <h2 style={s.sectionTitle}>Everything you need to improve</h2>
          <p style={s.sectionSubtitle}>
            TypSwift gives you all the tools to track, improve, and compete.
          </p>
        </div>

        <div style={s.featuresGrid}>
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              style={{
                ...s.featureCard,
                borderColor: feature.border,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform  = 'translateY(-4px)';
                e.currentTarget.style.boxShadow  = '0 8px 24px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform  = 'translateY(0)';
                e.currentTarget.style.boxShadow  = 'none';
              }}
            >
              <div style={{
                ...s.featureIcon,
                background: feature.bg,
                border    : `1px solid ${feature.border}`,
              }}>
                {feature.icon}
              </div>
              <h3 style={{ ...s.featureTitle, color: feature.color }}>
                {feature.title}
              </h3>
              <p style={s.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════
          LEADERBOARD PREVIEW
      ═══════════════════════════════ */}
      <LeaderboardPreview />

      {/* ═══════════════════════════════
          LAST RESULT (logged in only)
      ═══════════════════════════════ */}
      {isLoggedIn && <LastResult />}

      {/* ═══════════════════════════════
          CTA SECTION
      ═══════════════════════════════ */}
      <div style={s.ctaSection}>
        <div style={s.ctaInner}>
          <span style={s.ctaTag}>🏆 Ready to improve?</span>
          <h2 style={s.ctaTitle}>
            Start your typing journey today
          </h2>
          <p style={s.ctaSubtitle}>
            Join TypSwift and discover how fast you can really type.
            Track every test, beat your personal best, and climb the leaderboard.
          </p>
          <div style={s.ctaBtns}>
            <button
              onClick={handleStart}
              style={s.ctaAccentBtn}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color      = 'var(--accent)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color      = '#fff';
              }}
            >
               Start Typing Now
            </button>
            {!isLoggedIn && (
              <button
                onClick={() => navigate('/register')}
                style={s.ctaOutlineBtn}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Register Free →
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

// ─────────────────────────────────────────
// Styles
// ─────────────────────────────────────────
const s = {
  page: {
    maxWidth: '960px',
    margin  : '0 auto',
    padding : '0 1rem 4rem',
  },

  // ── Hero ──
  hero: {
    padding        : '5rem 0 3rem',
    display        : 'flex',
    justifyContent : 'center',
  },
  heroInner: {
    display       : 'flex',
    flexDirection : 'column',
    alignItems    : 'center',
    textAlign     : 'center',
    maxWidth      : '700px',
    gap           : '1.5rem',
  },
  tag: {
    display      : 'inline-block',
    padding      : '5px 14px',
    borderRadius : '999px',
    fontSize     : '12px',
    fontWeight   : 600,
    background   : 'var(--accent-light)',
    color        : 'var(--accent-text)',
    border       : '1px solid var(--accent-border)',
  },
  heroTitle: {
    fontSize  : '48px',
    fontWeight: 800,
    color     : 'var(--text-primary)',
    lineHeight: 1.2,
    minHeight : '120px',
  },
  heroAccent: {
    color: 'var(--accent)',
  },
  cursor: {
    display   : 'inline-block',
    color     : 'var(--accent)',
    fontWeight: 300,
    animation : 'blink 1s step-end infinite',
    marginLeft: '2px',
  },
  heroSubtitle: {
    fontSize  : '16px',
    color     : 'var(--text-secondary)',
    lineHeight: 1.7,
    maxWidth  : '540px',
  },
  modeSection: {
    display      : 'flex',
    flexDirection: 'column',
    alignItems   : 'center',
    gap          : '12px',
    width        : '100%',
  },
  modeLabel: {
    fontSize : '13px',
    fontWeight: 500,
    color    : 'var(--text-muted)',
  },
  modeRow: {
    display       : 'flex',
    flexWrap      : 'wrap',
    gap           : '8px',
    justifyContent: 'center',
  },
  modeBtn: {
    padding     : '8px 20px',
    borderRadius: '999px',
    fontSize    : '13px',
    cursor      : 'pointer',
    transition  : 'all 0.2s',
  },
  customWrap: {
    display      : 'flex',
    flexDirection: 'column',
    alignItems   : 'center',
    gap          : '6px',
    width        : '100%',
    maxWidth     : '300px',
  },
  customInputRow: {
    display   : 'flex',
    alignItems: 'center',
    gap       : '8px',
    width     : '100%',
  },
  customInput: {
    flex        : 1,
    padding     : '8px 14px',
    borderRadius: '8px',
    border      : '1px solid var(--border-color)',
    background  : 'var(--bg-secondary)',
    color       : 'var(--text-primary)',
    fontSize    : '14px',
    outline     : 'none',
    transition  : 'border-color 0.2s',
  },
  customSuffix: {
    fontSize : '13px',
    color    : 'var(--text-muted)',
    flexShrink: 0,
  },
  customError: {
    fontSize: '12px',
    color   : '#dc2626',
  },
  startBtn: {
    padding      : '14px 52px',
    borderRadius : '12px',
    border       : 'none',
    background   : 'var(--accent)',
    color        : '#fff',
    fontSize     : '16px',
    fontWeight   : 700,
    cursor       : 'pointer',
    transition   : 'all 0.2s',
    boxShadow    : '0 4px 14px rgba(249,115,22,0.3)',
    letterSpacing: '0.02em',
  },
  guestNotice: {
    fontSize: '13px',
    color   : 'var(--text-muted)',
  },
  guestLink: {
    color         : 'var(--accent)',
    fontWeight    : 600,
    cursor        : 'pointer',
    textDecoration: 'underline',
  },
  welcomeBack: {
    fontSize: '13px',
    color   : 'var(--text-secondary)',
  },

  // ── Stats Strip ──
  statsStrip: {
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    flexWrap       : 'wrap',
    gap            : '2rem',
    padding        : '1.5rem 2rem',
    background     : 'var(--bg-secondary)',
    border         : '1px solid var(--border-color)',
    borderRadius   : '14px',
    marginBottom   : '4rem',
  },
  stripStat: {
    display      : 'flex',
    flexDirection: 'column',
    alignItems   : 'center',
    gap          : '4px',
  },
  stripValue: {
    fontSize  : '24px',
    fontWeight: 800,
    color     : 'var(--accent)',
  },
  stripLabel: {
    fontSize : '12px',
    color    : 'var(--text-muted)',
    fontWeight: 500,
  },
  stripDivider: {
    width     : '1px',
    height    : '36px',
    background: 'var(--border-color)',
  },

  // ── Section ──
  section: {
    marginBottom: '4rem',
  },
  sectionHeader: {
    display        : 'flex',
    alignItems     : 'flex-start',
    justifyContent : 'space-between',
    marginBottom   : '1.5rem',
  },
  sectionHeaderCenter: {
    textAlign    : 'center',
    marginBottom : '2rem',
  },
  sectionTitle: {
    fontSize     : '24px',
    fontWeight   : 700,
    color        : 'var(--text-primary)',
    marginBottom : '8px',
  },
  sectionSubtitle: {
    fontSize: '14px',
    color   : 'var(--text-secondary)',
  },

  // ── How it works ──
  stepsGrid: {
    display             : 'grid',
    gridTemplateColumns : 'repeat(auto-fit, minmax(220px, 1fr))',
    gap                 : '1.5rem',
  },
  stepCard: {
    background   : 'var(--card-bg)',
    border       : '1px solid var(--border-color)',
    borderRadius : '14px',
    padding      : '1.5rem',
    display      : 'flex',
    flexDirection: 'column',
    gap          : '10px',
    position     : 'relative',
    transition   : 'transform 0.2s',
  },
  stepNumberWrap: {
    display   : 'flex',
    alignItems: 'center',
    gap       : '8px',
  },
  stepNumber: {
    fontSize    : '13px',
    fontWeight  : 700,
    color       : 'var(--accent)',
    background  : 'var(--accent-light)',
    border      : '1px solid var(--accent-border)',
    borderRadius: '6px',
    padding     : '2px 8px',
  },
  stepConnector: {
    flex      : 1,
    height    : '1px',
    background: 'var(--border-color)',
  },
  stepIconWrap: {
    width          : '48px',
    height         : '48px',
    background     : 'var(--bg-secondary)',
    border         : '1px solid var(--border-color)',
    borderRadius   : '12px',
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    fontSize       : '24px',
  },
  stepTitle: {
    fontSize  : '15px',
    fontWeight: 600,
    color     : 'var(--text-primary)',
  },
  stepDesc: {
    fontSize  : '13px',
    color     : 'var(--text-secondary)',
    lineHeight: 1.6,
  },

  // ── Features ──
  featuresGrid: {
    display             : 'grid',
    gridTemplateColumns : 'repeat(auto-fit, minmax(240px, 1fr))',
    gap                 : '1rem',
  },
  featureCard: {
    background   : 'var(--card-bg)',
    border       : '1px solid',
    borderRadius : '12px',
    padding      : '1.5rem',
    display      : 'flex',
    flexDirection: 'column',
    gap          : '10px',
    transition   : 'transform 0.2s, box-shadow 0.2s',
    cursor       : 'default',
  },
  featureIcon: {
    width          : '44px',
    height         : '44px',
    borderRadius   : '10px',
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    fontSize       : '22px',
  },
  featureTitle: {
    fontSize  : '15px',
    fontWeight: 600,
  },
  featureDesc: {
    fontSize  : '13px',
    color     : 'var(--text-secondary)',
    lineHeight: 1.6,
  },

  // ── Leaderboard Preview ──
  previewSection: {
    marginBottom: '4rem',
  },
  viewAllBtn: {
    padding      : '7px 16px',
    borderRadius : '8px',
    border       : '1px solid var(--border-color)',
    background   : 'transparent',
    color        : 'var(--text-secondary)',
    fontSize     : '13px',
    fontWeight   : 500,
    cursor       : 'pointer',
    transition   : 'all 0.2s',
    flexShrink   : 0,
  },
  previewCard: {
    border      : '1px solid var(--border-color)',
    borderRadius: '12px',
    overflow    : 'hidden',
    background  : 'var(--card-bg)',
  },
  previewRow: {
    display    : 'flex',
    alignItems : 'center',
    padding    : '12px 20px',
    gap        : '12px',
    borderBottom: '1px solid var(--border-color)',
    transition : 'background 0.15s',
  },
  previewRank: {
    width     : '28px',
    fontSize  : '16px',
    fontWeight: 600,
    color     : 'var(--text-muted)',
    flexShrink: 0,
  },
  previewAvatar: {
    width          : '32px',
    height         : '32px',
    borderRadius   : '50%',
    background     : 'var(--accent)',
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    color          : '#fff',
    fontSize       : '13px',
    fontWeight     : 700,
    flexShrink     : 0,
  },
  previewName: {
    flex      : 1,
    fontSize  : '14px',
    fontWeight: 500,
    color     : 'var(--text-primary)',
  },
  previewWpm: {
    fontSize  : '14px',
    fontWeight: 700,
    color     : 'var(--accent)',
    width     : '80px',
    textAlign : 'right',
  },
  previewAcc: {
    fontSize : '12px',
    color    : 'var(--text-muted)',
    width    : '48px',
    textAlign: 'right',
  },
  centerBox: {
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    padding        : '2rem',
  },
  spinner: {
    width       : '28px',
    height      : '28px',
    border      : '3px solid var(--border-color)',
    borderTop   : '3px solid var(--accent)',
    borderRadius: '50%',
    animation   : 'spin 0.8s linear infinite',
  },
  emptyText: {
    fontSize: '14px',
    color   : 'var(--text-secondary)',
  },

  // ── Last Result ──
  lastResultSection: {
    marginBottom: '4rem',
  },
  lastResultCard: {
    background   : 'var(--card-bg)',
    border       : '1px solid var(--border-color)',
    borderRadius : '12px',
    padding      : '1.5rem',
    boxShadow    : 'var(--shadow)',
  },
  lastResultGrid: {
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    flexWrap       : 'wrap',
    gap            : '2rem',
  },
  lastStat: {
    display      : 'flex',
    flexDirection: 'column',
    alignItems   : 'center',
    gap          : '4px',
  },
  lastValue: {
    fontSize  : '36px',
    fontWeight: 700,
    lineHeight: 1,
  },
  lastLabel: {
    fontSize     : '12px',
    color        : 'var(--text-muted)',
    fontWeight   : 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  lastDivider: {
    width     : '1px',
    height    : '48px',
    background: 'var(--border-color)',
  },

  // ── CTA Section ──
  ctaSection: {
    marginTop   : '2rem',
    borderRadius: '20px',
    background  : 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)',
    padding     : '4rem 2rem',
    textAlign   : 'center',
    overflow    : 'hidden',
    position    : 'relative',
  },
  ctaInner: {
    display      : 'flex',
    flexDirection: 'column',
    alignItems   : 'center',
    gap          : '1.25rem',
    position     : 'relative',
    zIndex       : 1,
  },
  ctaTag: {
    display      : 'inline-block',
    padding      : '4px 14px',
    borderRadius : '999px',
    fontSize     : '12px',
    fontWeight   : 600,
    background   : 'rgba(255,255,255,0.2)',
    color        : '#fff',
    border       : '1px solid rgba(255,255,255,0.3)',
  },
  ctaTitle: {
    fontSize  : '32px',
    fontWeight: 800,
    color     : '#fff',
    lineHeight: 1.2,
    maxWidth  : '500px',
  },
  ctaSubtitle: {
    fontSize  : '15px',
    color     : 'rgba(255,255,255,0.85)',
    lineHeight: 1.7,
    maxWidth  : '480px',
  },
  ctaBtns: {
    display : 'flex',
    gap     : '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '8px',
  },
  ctaAccentBtn: {
    padding      : '12px 32px',
    borderRadius : '10px',
    border       : '2px solid #fff',
    background   : 'transparent',
    color        : '#fff',
    fontSize     : '15px',
    fontWeight   : 700,
    cursor       : 'pointer',
    transition   : 'all 0.2s',
  },
  ctaOutlineBtn: {
    padding      : '12px 32px',
    borderRadius : '10px',
    border       : '2px solid rgba(255,255,255,0.4)',
    background   : 'transparent',
    color        : '#fff',
    fontSize     : '15px',
    fontWeight   : 600,
    cursor       : 'pointer',
    transition   : 'all 0.2s',
  },
};

export default Home;