import { useState, useEffect }  from 'react';
import { useAuth }              from '../../../shared/context/AuthContext.jsx';
import { fetchUserStats }       from '../api/Profile.api.jsx';
import { fetchUserHistory }     from '../api/Profile.api.jsx';
import StatsCard                from '../components/StatsCard.jsx';
import HistoryTable             from '../components/HistoryTable.jsx';
import WpmChart                 from '../components/WpmChart.jsx';

const Profile = () => {
  const { user }                      = useAuth();
  const [stats,       setStats]       = useState(null);
  const [history,     setHistory]     = useState([]);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [totalTests,  setTotalTests]  = useState(0);
  const [activeTab,   setActiveTab]   = useState('overview');
  const [statsLoading, setStatsLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [statsError,  setStatsError]  = useState('');
  const [historyError, setHistoryError] = useState('');


  // Fetch stats on mount

  useEffect(() => {
    loadStats();
  }, []);

  
  // Fetch history when page changes
  
  useEffect(() => {
    loadHistory();
  }, [page]);

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError('');
      const res = await fetchUserStats();
      setStats(res.stats);
    } catch (err) {
      setStatsError('Failed to load stats');
    } finally {
      setStatsLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      setHistoryError('');
      const res = await fetchUserHistory({ page, limit: 10 });
      setHistory(res.results );
      setTotalPages(res.totalPages);
      setTotalTests(res.totalTests);
    } catch (err) {
      setHistoryError('Failed to load history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const TABS = [
    { key: 'overview', label: ' Overview' },
    { key: 'history',  label: ' History'  },
  ];

  return (
    <div style={s.page}>

      {/* ── Profile Header ── */}
      <div style={s.profileHeader}>
        <div style={s.avatarWrap}>
          <div style={s.avatar}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div style={s.onlineDot} />
        </div>
        <div style={s.userInfo}>
          <h1 style={s.username}>{user?.username}</h1>
          <p style={s.email}>{user?.email}</p>
          <div style={s.badgeRow}>
            <span style={s.memberBadge}>
              ⌨ TypSwift Member
            </span>
            {stats?.totalTests >= 10 && (
              <span style={s.activeBadge}>
                🔥 Active Typer
              </span>
            )}
            {stats?.bestWpm >= 100 && (
              <span style={s.proBadge}>
                 Speed Pro
              </span>
            )}
          </div>
        </div>

        {/* Quick stats strip */}
        <div style={s.quickStats}>
          <div style={s.quickStat}>
            <span style={s.quickValue}>{stats?.bestWpm ?? '—'}</span>
            <span style={s.quickLabel}>Best WPM</span>
          </div>
          <div style={s.quickDivider} />
          <div style={s.quickStat}>
            <span style={s.quickValue}>{stats?.totalTests ?? '—'}</span>
            <span style={s.quickLabel}>Tests</span>
          </div>
          <div style={s.quickDivider} />
          <div style={s.quickStat}>
            <span style={s.quickValue}>{stats?.averageAccuracy ?? '—'}%</span>
            <span style={s.quickLabel}>Avg Acc</span>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={s.tabRow}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              ...s.tabBtn,
              color      : activeTab === tab.key ? 'var(--accent)'   : 'var(--text-secondary)',
              borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
              fontWeight  : activeTab === tab.key ? 600 : 400,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={s.divider} />

      {/* ── Overview Tab ── */}
      {activeTab === 'overview' && (
        <div>
          {statsLoading ? (
            <div style={s.centerBox}>
              <div style={s.spinner} />
              <p style={s.loadingText}>Loading stats...</p>
            </div>
          ) : statsError ? (
            <div style={s.errorBox}>
              ⚠️ {statsError}
              <button onClick={loadStats} style={s.retryBtn}>
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <StatsCard stats={stats} />

              {/* WPM Progress Chart */}
              {history.length > 0 && (
                <WpmChart results={history} />
              )}
            </>
          )}
        </div>
      )}

      {/* ── History Tab ── */}
      {activeTab === 'history' && (
        <div>
          {/* History header */}
          <div style={s.historyHeader}>
            <h2 style={s.sectionTitle}>Test History</h2>
            {totalTests > 0 && (
              <span style={s.totalBadge}>
                {totalTests} total tests
              </span>
            )}
          </div>

          {historyLoading ? (
            <div style={s.centerBox}>
              <div style={s.spinner} />
              <p style={s.loadingText}>Loading history...</p>
            </div>
          ) : historyError ? (
            <div style={s.errorBox}>
              ⚠️ {historyError}
              <button onClick={loadHistory} style={s.retryBtn}>
                Retry
              </button>
            </div>
          ) : (
            <HistoryTable
              results={history}
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}

    </div>
  );
};

const s = {
  page: {
    maxWidth : '900px',
    margin   : '0 auto',
    padding  : '2rem 1rem',
  },

  // ── Profile Header ──
  profileHeader: {
    display      : 'flex',
    alignItems   : 'flex-start',
    gap          : '1.5rem',
    background   : 'var(--card-bg)',
    border       : '1px solid var(--border-color)',
    borderRadius : '16px',
    padding      : '1.5rem',
    marginBottom : '2rem',
    flexWrap     : 'wrap',
    boxShadow    : 'var(--shadow)',
  },
  avatarWrap: {
    position    : 'relative',
    flexShrink  : 0,
  },
  avatar: {
    width          : '72px',
    height         : '72px',
    borderRadius   : '50%',
    background     : 'var(--accent)',
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    color          : '#fff',
    fontSize       : '28px',
    fontWeight     : 700,
    border         : '3px solid var(--accent-border)',
  },
  onlineDot: {
    position    : 'absolute',
    bottom      : '4px',
    right       : '4px',
    width       : '14px',
    height      : '14px',
    borderRadius: '50%',
    background  : '#22c55e',
    border      : '2px solid var(--card-bg)',
  },
  userInfo: {
    flex         : 1,
    display      : 'flex',
    flexDirection: 'column',
    gap          : '6px',
  },
  username: {
    fontSize  : '22px',
    fontWeight: 700,
    color     : 'var(--text-primary)',
  },
  email: {
    fontSize: '13px',
    color   : 'var(--text-secondary)',
  },
  badgeRow: {
    display : 'flex',
    flexWrap: 'wrap',
    gap     : '6px',
    marginTop: '4px',
  },
  memberBadge: {
    padding      : '3px 10px',
    borderRadius : '999px',
    fontSize     : '11px',
    fontWeight   : 600,
    background   : 'var(--accent-light)',
    color        : 'var(--accent-text)',
    border       : '1px solid var(--accent-border)',
  },
  activeBadge: {
    padding      : '3px 10px',
    borderRadius : '999px',
    fontSize     : '11px',
    fontWeight   : 600,
    background   : '#fff7ed',
    color        : '#c2410c',
    border       : '1px solid #fed7aa',
  },
  proBadge: {
    padding      : '3px 10px',
    borderRadius : '999px',
    fontSize     : '11px',
    fontWeight   : 600,
    background   : '#ede9fe',
    color        : '#7c3aed',
    border       : '1px solid #c4b5fd',
  },

  // ── Quick Stats ──
  quickStats: {
    display        : 'flex',
    alignItems     : 'center',
    gap            : '1rem',
    background     : 'var(--bg-secondary)',
    border         : '1px solid var(--border-color)',
    borderRadius   : '12px',
    padding        : '1rem 1.5rem',
    flexShrink     : 0,
  },
  quickStat: {
    display      : 'flex',
    flexDirection: 'column',
    alignItems   : 'center',
    gap          : '2px',
  },
  quickValue: {
    fontSize  : '20px',
    fontWeight: 700,
    color     : 'var(--accent)',
  },
  quickLabel: {
    fontSize: '11px',
    color   : 'var(--text-muted)',
    fontWeight: 500,
  },
  quickDivider: {
    width     : '1px',
    height    : '32px',
    background: 'var(--border-color)',
  },

  // ── Tabs ──
  tabRow: {
    display : 'flex',
    gap     : '2rem',
  },
  tabBtn: {
    padding         : '8px 0',
    background      : 'transparent',
    border          : 'none',
    borderBottom    : '2px solid transparent',
    fontSize        : '14px',
    cursor          : 'pointer',
    transition      : 'all 0.2s',
  },
  divider: {
    height     : '1px',
    background : 'var(--border-color)',
    margin     : '0 0 1.5rem',
  },

  // ── History header ──
  historyHeader: {
    display      : 'flex',
    alignItems   : 'center',
    justifyContent: 'space-between',
    marginBottom : '1rem',
  },
  sectionTitle: {
    fontSize  : '16px',
    fontWeight: 600,
    color     : 'var(--text-primary)',
  },
  totalBadge: {
    padding      : '3px 10px',
    borderRadius : '999px',
    fontSize     : '12px',
    fontWeight   : 500,
    background   : 'var(--bg-secondary)',
    color        : 'var(--text-secondary)',
    border       : '1px solid var(--border-color)',
  },

  // ── Loading / Error ──
  centerBox: {
    display        : 'flex',
    flexDirection  : 'column',
    alignItems     : 'center',
    justifyContent : 'center',
    padding        : '4rem 0',
    gap            : '12px',
  },
  spinner: {
    width       : '32px',
    height      : '32px',
    border      : '3px solid var(--border-color)',
    borderTop   : '3px solid var(--accent)',
    borderRadius: '50%',
    animation   : 'spin 0.8s linear infinite',
  },
  loadingText: {
    fontSize: '14px',
    color   : 'var(--text-secondary)',
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
};

export default Profile;