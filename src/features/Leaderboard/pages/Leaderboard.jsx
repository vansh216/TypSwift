import { useState, useEffect } from 'react';
import { fetchLeaderboard }    from '../api/Leaderboard.api.jsx';
import LeaderboardTable        from '../components/LeaderboardTable.jsx';

const TIME_MODES = [
  { label: 'All',    value: null },
  { label: '1 min',  value: 1    },
  { label: '2 min',  value: 2    },
  { label: '3 min',  value: 3    },
  { label: '5 min',  value: 5    },
  { label: '10 min', value: 10   },
];

const Leaderboard = () => {
  const [data,     setData]     = useState([]);
  const [duration, setDuration] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, [duration]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchLeaderboard({ duration });
      setData(res.leaderboard);
    } catch (err) {
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>

      {/* ── Page Header ── */}
      <div style={s.header}>
        <h1 style={s.title}>🏆 Leaderboard</h1>
        <p style={s.subtitle}>
          Top typists ranked by their best WPM score
        </p>
      </div>

      {/* ── Time Mode Filter ── */}
      <div style={s.filterRow}>
        {TIME_MODES.map((mode) => (
          <button
            key={mode.label}
            onClick={() => setDuration(mode.value)}
            style={{
              ...s.filterBtn,
              background  : duration === mode.value ? 'var(--accent)'        : 'var(--bg-secondary)',
              color       : duration === mode.value ? '#fff'                  : 'var(--text-secondary)',
              border      : duration === mode.value ? '1px solid var(--accent)' : '1px solid var(--border-color)',
              fontWeight  : duration === mode.value ? 600                     : 400,
            }}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div style={s.centerBox}>
          <div style={s.spinner} />
          <p style={s.loadingText}>Loading leaderboard...</p>
        </div>
      ) : error ? (
        <div style={s.errorBox}>
          ⚠️ {error}
          <button onClick={loadLeaderboard} style={s.retryBtn}>
            Retry
          </button>
        </div>
      ) : data.length === 0 ? (
        <div style={s.centerBox}>
          <p style={s.emptyText}>🎯 No scores yet for this time mode.</p>
          <p style={s.emptySubText}>Be the first to set a record!</p>
        </div>
      ) : (
        <LeaderboardTable data={data} />
      )}

    </div>
  );
};

const s = {
  page: {
    maxWidth  : '800px',
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
  filterRow: {
    display        : 'flex',
    alignItems     : 'center',
    gap            : '8px',
    flexWrap       : 'wrap',
    justifyContent : 'center',
    marginBottom   : '1.5rem',
  },
  filterBtn: {
    padding      : '6px 16px',
    borderRadius : '999px',
    fontSize     : '13px',
    cursor       : 'pointer',
    transition   : 'all 0.2s',
    border       : '1px solid var(--border-color)',
  },
  centerBox: {
    display        : 'flex',
    flexDirection  : 'column',
    alignItems     : 'center',
    justifyContent : 'center',
    padding        : '4rem 0',
    gap            : '12px',
  },
  spinner: {
    width       : '36px',
    height      : '36px',
    border      : '3px solid var(--border-color)',
    borderTop   : '3px solid var(--accent)',
    borderRadius: '50%',
    animation   : 'spin 0.8s linear infinite',
  },
  loadingText: {
    fontSize : '14px',
    color    : 'var(--text-secondary)',
  },
  errorBox: {
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    gap            : '12px',
    background     : '#fef2f2',
    border         : '1px solid #fecaca',
    borderRadius   : '10px',
    padding        : '1rem 1.5rem',
    fontSize       : '14px',
    color          : '#dc2626',
  },
  retryBtn: {
    padding      : '5px 12px',
    borderRadius : '6px',
    border       : '1px solid #dc2626',
    background   : 'transparent',
    color        : '#dc2626',
    fontSize     : '13px',
    cursor       : 'pointer',
  },
  emptyText: {
    fontSize   : '16px',
    fontWeight : 500,
    color      : 'var(--text-primary)',
  },
  emptySubText: {
    fontSize : '13px',
    color    : 'var(--text-secondary)',
  },
};

export default Leaderboard;