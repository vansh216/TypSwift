import { useNavigate } from 'react-router-dom';

const MEDALS = {
  1: { emoji: '🥇', color: '#F59E0B', bg: 'linear-gradient(135deg, #fff7ed, #fed7aa)' },
  2: { emoji: '🥈', color: '#94A3B8', bg: 'var(--bg-secondary)'                       },
  3: { emoji: '🥉', color: '#B45309', bg: 'var(--bg-secondary)'                       },
};

const BattleResult = ({ results, roomCode, onPlayAgain }) => {
  const navigate = useNavigate();

  return (
    <div style={s.overlay}>
      <div style={s.modal}>

        {/* ── Header ── */}
        <div style={s.header}>
          <span style={s.trophy}>🏆</span>
          <h2 style={s.title}>Battle Results</h2>
          <p style={s.subtitle}>Final rankings</p>
        </div>

        {/* ── Results list ── */}
        <div style={s.list}>
          {results.map((player) => {
            const medal   = MEDALS[player.rank];
            const isFirst = player.rank === 1;

            return (
              <div
                key={player.userId}
                style={{
                  ...s.row,
                  background : medal?.bg || 'var(--bg-secondary)',
                  border     : isFirst
                    ? '1px solid #fed7aa'
                    : '1px solid var(--border-color)',
                  transform  : isFirst ? 'scale(1.02)' : 'scale(1)',
                  boxShadow  : isFirst
                    ? '0 4px 20px rgba(249,115,22,0.2)'
                    : 'none',
                }}
              >
                {/* ── Left — Medal + Avatar + Name ── */}
                <div style={s.left}>
                  <span style={s.medal}>
                    {medal?.emoji || player.rank}
                  </span>
                  <div style={{
                    ...s.avatar,
                    background: isFirst ? '#f97316' : 'var(--bg-tertiary)',
                    color     : isFirst ? '#fff'     : 'var(--text-secondary)',
                    border    : isFirst ? '2px solid #ea580c' : '2px solid var(--border-color)',
                  }}>
                    {player.avatar}
                  </div>
                  <div style={s.nameWrap}>
                    <p style={{
                      ...s.username,
                      color: isFirst ? '#c2410c' : 'var(--text-primary)',
                    }}>
                      {player.username}
                    </p>
                    {isFirst && player.finished && (
                      <span style={s.winnerBadge}>🎉 Winner!</span>
                    )}
                    {!player.finished && (
                      <span style={s.dnfBadge}>Did not finish</span>
                    )}
                  </div>
                </div>

                {/* ── Right — Stats ── */}
                <div style={s.statsRow}>
                  <div style={s.statBox}>
                    <span style={{
                      ...s.statValue,
                      color: isFirst ? '#c2410c' : 'var(--accent)',
                    }}>
                      {player.wpm}
                    </span>
                    <span style={s.statLabel}>WPM</span>
                  </div>
                  <div style={s.statDivider} />
                  <div style={s.statBox}>
                    <span style={{
                      ...s.statValue,
                      color: player.accuracy >= 95 ? '#16a34a'
                           : player.accuracy >= 85 ? '#ca8a04'
                           : '#dc2626',
                    }}>
                      {player.accuracy}%
                    </span>
                    <span style={s.statLabel}>ACC</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* ── Actions ── */}
        <div style={s.actions}>
          <button
            onClick={onPlayAgain}
            style={s.playAgainBtn}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
          >
            🔄 Play Again
          </button>
          <button
            onClick={() => navigate('/multiplayer')}
            style={s.leaveBtn}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color       = 'var(--accent)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color       = 'var(--text-secondary)';
            }}
          >
            Leave Room
          </button>
        </div>

      </div>
    </div>
  );
};

const s = {
  overlay: {
    position       : 'fixed',
    top            : 0,
    left           : 0,
    right          : 0,
    bottom         : 0,
    background     : 'rgba(0,0,0,0.85)',
    backdropFilter : 'blur(4px)',
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    zIndex         : 99,
    padding        : '1rem',
    overflowY      : 'auto',
  },
  modal: {
    background   : 'var(--card-bg)',
    border       : '1px solid var(--border-color)',
    borderRadius : '20px',
    padding      : '2rem',
    width        : '100%',
    maxWidth     : '680px',
    boxShadow    : '0 20px 60px rgba(0,0,0,0.3)',
    display      : 'flex',
    flexDirection: 'column',
    gap          : '1.5rem',
  },
  header: {
    textAlign    : 'center',
    display      : 'flex',
    flexDirection: 'column',
    alignItems   : 'center',
    gap          : '4px',
  },
  trophy: {
    fontSize     : '40px',
    marginBottom : '4px',
  },
  title: {
    fontSize     : '24px',
    fontWeight   : 800,
    color        : 'var(--text-primary)',
    margin       : 0,
  },
  subtitle: {
    fontSize     : '13px',
    color        : 'var(--text-muted)',
    margin       : 0,
  },
  list: {
    display      : 'flex',
    flexDirection: 'column',
    gap          : '10px',
  },
  row: {
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'space-between',
    gap            : '16px',
    padding        : '16px 20px',
    borderRadius   : '14px',
    transition     : 'all 0.2s',
  },
  left: {
    display      : 'flex',
    alignItems   : 'center',
    gap          : '12px',
    flex         : 1,
  },
  medal: {
    fontSize     : '28px',
    flexShrink   : 0,
    width        : '36px',
    textAlign    : 'center',
  },
  avatar: {
    width          : '44px',
    height         : '44px',
    borderRadius   : '50%',
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    fontSize       : '18px',
    fontWeight     : 700,
    flexShrink     : 0,
  },
  nameWrap: {
    display      : 'flex',
    flexDirection: 'column',
    gap          : '3px',
  },
  username: {
    fontSize     : '16px',
    fontWeight   : 700,
    margin       : 0,
  },
  winnerBadge: {
    fontSize     : '11px',
    fontWeight   : 600,
    color        : '#c2410c',
    background   : '#fff7ed',
    border       : '1px solid #fed7aa',
    borderRadius : '999px',
    padding      : '1px 8px',
    width        : 'fit-content',
  },
  dnfBadge: {
    fontSize     : '11px',
    color        : 'var(--text-muted)',
  },
  statsRow: {
    display      : 'flex',
    alignItems   : 'center',
    gap          : '16px',
    flexShrink   : 0,
  },
  statBox: {
    display      : 'flex',
    flexDirection: 'column',
    alignItems   : 'center',
    gap          : '2px',
    minWidth     : '60px',
  },
  statValue: {
    fontSize     : '26px',
    fontWeight   : 800,
    lineHeight   : 1,
  },
  statLabel: {
    fontSize     : '10px',
    color        : 'var(--text-muted)',
    fontWeight   : 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  statDivider: {
    width        : '1px',
    height       : '36px',
    background   : 'var(--border-color)',
  },
  actions: {
    display        : 'flex',
    justifyContent : 'center',
    gap            : '12px',
    flexWrap       : 'wrap',
  },
  playAgainBtn: {
    padding      : '12px 32px',
    borderRadius : '10px',
    border       : 'none',
    background   : 'var(--accent)',
    color        : '#fff',
    fontSize     : '15px',
    fontWeight   : 700,
    cursor       : 'pointer',
    transition   : 'background 0.2s',
    boxShadow    : '0 4px 14px rgba(249,115,22,0.3)',
  },
  leaveBtn: {
    padding      : '12px 32px',
    borderRadius : '10px',
    border       : '1px solid var(--border-color)',
    background   : 'transparent',
    color        : 'var(--text-secondary)',
    fontSize     : '15px',
    fontWeight   : 500,
    cursor       : 'pointer',
    transition   : 'all 0.2s',
  },
};

export default BattleResult;