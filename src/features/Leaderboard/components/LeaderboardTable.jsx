const MEDALS = {
  1: { emoji: '🥇', color: '#F59E0B' },
  2: { emoji: '🥈', color: '#94A3B8' },
  3: { emoji: '🥉', color: '#B45309' },
};

const LeaderboardTable = ({ data }) => {
  return (
    <div style={s.wrapper}>

      {/* ── Table Header ── */}
      <div style={s.tableHeader}>
        <span style={{ ...s.headerCell, width: '60px' }}>Rank</span>
        <span style={{ ...s.headerCell, flex: 1 }}>Player</span>
        <span style={{ ...s.headerCell, width: '100px', textAlign: 'center' }}>Best WPM</span>
        <span style={{ ...s.headerCell, width: '90px',  textAlign: 'center' }}>Accuracy</span>
        <span style={{ ...s.headerCell, width: '90px',  textAlign: 'center' }}>Duration</span>
        <span style={{ ...s.headerCell, width: '110px', textAlign: 'right'  }}>Date</span>
      </div>

      {/* ── Table Rows ── */}
      {data.map((entry, index) => (
        <div
          key={index}
          style={{
            ...s.row,
            background: index % 2 === 0
              ? 'var(--card-bg)'
              : 'var(--bg-secondary)',
            borderLeft: entry.rank <= 3
              ? `3px solid ${MEDALS[entry.rank].color}`
              : '3px solid transparent',
          }}
        >
          {/* Rank */}
          <div style={{ width: '60px', display: 'flex', alignItems: 'center' }}>
            {entry.rank <= 3 ? (
              <span style={{ fontSize: '20px' }}>
                {MEDALS[entry.rank].emoji}
              </span>
            ) : (
              <span style={s.rankNum}>
                {entry.rank}
              </span>
            )}
          </div>

          {/* Player */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              ...s.avatar,
              background: entry.rank <= 3
                ? MEDALS[entry.rank].color
                : 'var(--accent)',
            }}>
              {entry.username?.charAt(0).toUpperCase()}
            </div>
            <span style={s.username}>{entry.username}</span>
          </div>

          {/* Best WPM */}
          <div style={{ width: '100px', textAlign: 'center' }}>
            <span style={s.wpm}>{entry.bestWpm}</span>
            <span style={s.wpmLabel}> wpm</span>
          </div>

          {/* Accuracy */}
          <div style={{ width: '90px', textAlign: 'center' }}>
            <span style={{
              ...s.accuracyBadge,
              background: entry.accuracy >= 95
                ? '#dcfce7'
                : entry.accuracy >= 85
                ? '#fef9c3'
                : '#fee2e2',
              color: entry.accuracy >= 95
                ? '#16a34a'
                : entry.accuracy >= 85
                ? '#ca8a04'
                : '#dc2626',
            }}>
              {entry.accuracy}%
            </span>
          </div>

          {/* Duration */}
          <div style={{ width: '90px', textAlign: 'center' }}>
            <span style={s.duration}>
              {entry.duration / 60} min
            </span>
          </div>

          {/* Date */}
          <div style={{ width: '110px', textAlign: 'right' }}>
            <span style={s.date}>
              {new Date(entry.createdAt).toLocaleDateString('en-IN', {
                day  : '2-digit',
                month: 'short',
                year : 'numeric',
              })}
            </span>
          </div>
        </div>
      ))}

    </div>
  );
};

const s = {
  wrapper: {
    border      : '1px solid var(--border-color)',
    borderRadius: '12px',
    overflow    : 'hidden',
    background  : 'var(--card-bg)',
  },
  tableHeader: {
    display        : 'flex',
    alignItems     : 'center',
    padding        : '12px 20px',
    background     : 'var(--bg-secondary)',
    borderBottom   : '1px solid var(--border-color)',
  },
  headerCell: {
    fontSize   : '12px',
    fontWeight : 600,
    color      : 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  row: {
    display    : 'flex',
    alignItems : 'center',
    padding    : '14px 20px',
    borderBottom: '1px solid var(--border-color)',
    transition : 'background 0.15s',
  },
  rankNum: {
    fontSize  : '14px',
    fontWeight: 600,
    color     : 'var(--text-muted)',
  },
  avatar: {
    width          : '32px',
    height         : '32px',
    borderRadius   : '50%',
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    color          : '#fff',
    fontSize       : '13px',
    fontWeight     : 700,
    flexShrink     : 0,
  },
  username: {
    fontSize  : '14px',
    fontWeight: 500,
    color     : 'var(--text-primary)',
  },
  wpm: {
    fontSize  : '15px',
    fontWeight: 700,
    color     : 'var(--accent)',
  },
  wpmLabel: {
    fontSize: '11px',
    color   : 'var(--text-muted)',
  },
  accuracyBadge: {
    display      : 'inline-block',
    padding      : '2px 8px',
    borderRadius : '999px',
    fontSize     : '12px',
    fontWeight   : 600,
  },
  duration: {
    fontSize : '13px',
    color    : 'var(--text-secondary)',
  },
  date: {
    fontSize : '12px',
    color    : 'var(--text-muted)',
  },
};

export default LeaderboardTable;