import { useState, useEffect } from 'react';
import { analyzeTestResult }   from '../api/ai.api';

// ─────────────────────────────────────────
// Skeleton Loader
// ─────────────────────────────────────────
const Skeleton = () => (
  <div style={s.skeletonWrap}>
    <div style={s.skeletonRow}>
      <div style={{ ...s.bone, width: '200px', height: '14px' }} />
      <div style={{ ...s.bone, width: '90px',  height: '14px' }} />
    </div>
    <div style={{ ...s.bone, width: '75%', height: '13px', margin: '16px auto 4px' }} />
    <div style={{ ...s.bone, width: '55%', height: '13px', margin: '0 auto 20px'  }} />
    <div style={s.skeletonGrid}>
      {[1, 2, 3].map(i => (
        <div key={i} style={s.skeletonCard}>
          <div style={{ ...s.bone, width: '90px',  height: '13px', marginBottom: '12px' }} />
          <div style={{ ...s.bone, width: '100%', height: '11px', marginBottom: '8px'  }} />
          <div style={{ ...s.bone, width: '85%',  height: '11px', marginBottom: '8px'  }} />
          <div style={{ ...s.bone, width: '65%',  height: '11px'                        }} />
        </div>
      ))}
    </div>
    <div style={{ ...s.bone, width: '50%', height: '13px', margin: '16px auto 0' }} />
  </div>
);

// ─────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────
const AIAnalysis = ({ result, charErrors }) => {
  const [feedback, setFeedback] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    if (!result) return;
    loadAnalysis();
  }, []);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      setError('');
      setFeedback(null);
      const data = await analyzeTestResult({
        wpm       : result.wpm,
        accuracy  : result.accuracy,
        duration  : result.duration,
        errors    : result.errors,
        wpmHistory: result.wpmHistory || [],
        charErrors: charErrors        || [],
      });
      setFeedback(data.feedback);
    } catch (err) {
      setError('Could not load AI analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const CARDS = feedback ? [
    {
      icon    : '✅',
      title   : 'Strengths',
      items   : feedback.strengths  || [],
      dotColor: 'var(--border-success)',
      bg      : 'var(--bg-success)',
      border  : 'var(--border-success)',
      color   : 'var(--text-success)',
    },
    {
      icon    : '⚠️',
      title   : 'Weaknesses',
      items   : feedback.weaknesses || [],
      dotColor: 'var(--border-danger)',
      bg      : 'var(--bg-danger)',
      border  : 'var(--border-danger)',
      color   : 'var(--text-danger)',
    },
    {
      icon    : '💡',
      title   : 'Tips to improve',
      items   : feedback.tips       || [],
      dotColor: 'var(--border-accent)',
      bg      : 'var(--bg-accent)',
      border  : 'var(--border-accent)',
      color   : 'var(--text-accent)',
    },
  ] : [];

  return (
    <div style={s.wrapper}>

      {/* ── Header ── */}
      <div style={s.header}>
        <div style={s.titleRow}>
          <span style={s.robotIcon}>🤖</span>
          <span style={s.title}>AI analysis</span>
          {loading && (
            <span style={s.badge}>analyzing...</span>
          )}
        </div>
        {!loading && !error && (
          <button
            onClick={loadAnalysis}
            style={s.refreshBtn}
            onMouseEnter={e => {
              e.currentTarget.style.color       = 'var(--text-primary)';
              e.currentTarget.style.borderColor = 'var(--border-strong)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color       = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            ↻ Refresh
          </button>
        )}
      </div>

      {/* ── Divider ── */}
      <div style={s.divider} />

      {/* ── Loading ── */}
      {loading && <Skeleton />}

      {/* ── Error ── */}
      {!loading && error && (
        <div style={s.errorWrap}>
          <span style={s.errorText}>⚠️ {error}</span>
          <button onClick={loadAnalysis} style={s.retryBtn}>
            Retry
          </button>
        </div>
      )}

      {/* ── Feedback ── */}
      {!loading && !error && feedback && (
        <div style={s.feedbackWrap}>

          {/* Summary */}
          <p style={s.summary}>"{feedback.summary}"</p>

          {/* Cards grid */}
          <div style={s.grid}>
            {CARDS.map((card, i) => (
              <div
                key={i}
                style={{
                  ...s.card,
                  background  : card.bg,
                  borderColor : card.border,
                }}
              >
                <div style={s.cardHeader}>
                  <span style={s.cardIcon}>{card.icon}</span>
                  <span style={{ ...s.cardTitle, color: card.color }}>
                    {card.title}
                  </span>
                </div>
                <ul style={s.list}>
                  {card.items.map((item, j) => (
                    <li key={j} style={s.listItem}>
                      <span style={{
                        ...s.dot,
                        background: card.dotColor,
                      }} />
                      <span style={s.itemText}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Encouragement */}
          <div style={s.encouragement}>
            <span style={s.encourageIcon}>💪</span>
            <p style={s.encourageText}>{feedback.encouragement}</p>
          </div>

        </div>
      )}

    </div>
  );
};

// ─────────────────────────────────────────
// Styles
// ─────────────────────────────────────────
const s = {
  wrapper: {
    background   : 'var(--surface-1)',
    border       : '0.5px solid var(--border)',
    borderRadius : '12px',
    padding      : '1.25rem',
    marginBottom : '1.5rem',
  },

  // ── Header ──
  header: {
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'space-between',
  },
  titleRow: {
    display   : 'flex',
    alignItems: 'center',
    gap       : '8px',
  },
  robotIcon: {
    fontSize: '18px',
  },
  title: {
    fontSize  : '15px',
    fontWeight: 500,
    color     : 'var(--text-primary)',
  },
  badge: {
    fontSize    : '11px',
    fontWeight  : 500,
    color       : 'var(--text-accent)',
    background  : 'var(--bg-accent)',
    border      : '0.5px solid var(--border-accent)',
    borderRadius: '999px',
    padding     : '2px 10px',
    animation   : 'pulse 1.5s ease-in-out infinite',
  },
  refreshBtn: {
    fontSize    : '12px',
    padding     : '4px 10px',
    borderRadius: 'var(--radius)',
    border      : '0.5px solid var(--border)',
    background  : 'transparent',
    color       : 'var(--text-muted)',
    cursor      : 'pointer',
    transition  : 'all 0.15s',
  },
  divider: {
    height    : '0.5px',
    background: 'var(--border)',
    margin    : '1rem 0',
  },

  // ── Skeleton ──
  skeletonWrap: {
    display      : 'flex',
    flexDirection: 'column',
  },
  skeletonRow: {
    display        : 'flex',
    justifyContent : 'space-between',
    marginBottom   : '4px',
  },
  bone: {
    background  : 'var(--surface-0)',
    borderRadius: 'var(--radius)',
    animation   : 'skeleton 1.5s ease-in-out infinite',
  },
  skeletonGrid: {
    display            : 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap                : '10px',
  },
  skeletonCard: {
    background  : 'var(--surface-0)',
    borderRadius: '12px',
    padding     : '1rem',
    border      : '0.5px solid var(--border)',
  },

  // ── Error ──
  errorWrap: {
    display       : 'flex',
    alignItems    : 'center',
    justifyContent: 'center',
    gap           : '12px',
    padding       : '1.5rem',
    background    : 'var(--bg-danger)',
    border        : '0.5px solid var(--border-danger)',
    borderRadius  : '10px',
  },
  errorText: {
    fontSize: '13px',
    color   : 'var(--text-danger)',
  },
  retryBtn: {
    fontSize    : '12px',
    padding     : '5px 14px',
    borderRadius: 'var(--radius)',
    border      : '0.5px solid var(--border-danger)',
    background  : 'transparent',
    color       : 'var(--text-danger)',
    cursor      : 'pointer',
  },

  // ── Feedback ──
  feedbackWrap: {
    display      : 'flex',
    flexDirection: 'column',
    gap          : '1rem',
  },
  summary: {
    fontSize  : '14px',
    fontStyle : 'italic',
    color     : 'var(--text-secondary)',
    lineHeight: 1.6,
    textAlign : 'center',
    margin    : '0 0 4px',
  },
  grid: {
    display            : 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap                : '10px',
  },
  card: {
    border      : '0.5px solid',
    borderRadius: '12px',
    padding     : '1rem',
  },
  cardHeader: {
    display      : 'flex',
    alignItems   : 'center',
    gap          : '6px',
    marginBottom : '10px',
  },
  cardIcon: {
    fontSize: '14px',
  },
  cardTitle: {
    fontSize  : '13px',
    fontWeight: 500,
  },
  list: {
    listStyle    : 'none',
    padding      : 0,
    margin       : 0,
    display      : 'flex',
    flexDirection: 'column',
    gap          : '8px',
  },
  listItem: {
    display   : 'flex',
    alignItems: 'flex-start',
    gap       : '8px',
  },
  dot: {
    width       : '5px',
    height      : '5px',
    borderRadius: '50%',
    flexShrink  : 0,
    marginTop   : '5px',
  },
  itemText: {
    fontSize  : '12px',
    color     : 'var(--text-secondary)',
    lineHeight: 1.55,
  },

  // ── Encouragement ──
  encouragement: {
    display    : 'flex',
    alignItems : 'center',
    gap        : '8px',
    padding    : '10px 14px',
    background : 'var(--surface-0)',
    border     : '0.5px solid var(--border)',
    borderRadius: 'var(--radius)',
  },
  encourageIcon: {
    fontSize : '16px',
    flexShrink: 0,
  },
  encourageText: {
    fontSize  : '13px',
    fontWeight: 500,
    color     : 'var(--text-primary)',
    margin    : 0,
    lineHeight: 1.5,
  },
};

export default AIAnalysis;