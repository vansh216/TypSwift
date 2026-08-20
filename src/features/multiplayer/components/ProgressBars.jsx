const ProgressBars = ({ players, currentUserId }) => {
  const sorted = [...players].sort((a, b) => b.progress - a.progress);

  return (
    <div style={s.wrapper}>
      <h3 style={s.title}>Live Progress</h3>
      <div style={s.list}>
        {sorted.map((player, index) => {
          const isMe = player.userId === currentUserId;
          return (
            <div key={player.userId || index} style={s.playerRow}>

              {/* Rank + Avatar + Name */}
              <div style={s.playerInfo}>
                <span style={s.rank}>{index + 1}</span>
                <div style={{
                  ...s.avatar,
                  background: isMe ? 'var(--accent)' : 'var(--bg-tertiary)',
                  color     : isMe ? '#fff' : 'var(--text-secondary)',
                }}>
                  {player.avatar}
                </div>
                <span style={{
                  ...s.username,
                  color     : isMe ? 'var(--accent)' : 'var(--text-primary)',
                  fontWeight: isMe ? 700 : 500,
                }}>
                  {player.username}{isMe && ' (You)'}
                </span>
              </div>

              {/* Progress bar */}
              <div style={s.barWrap}>
                <div style={s.barTrack}>
                  <div style={{
                    ...s.barFill,
                    width     : `${player.progress}%`,
                    background: isMe
                      ? 'var(--accent)'
                      : player.finished
                      ? '#22c55e'
                      : 'var(--text-muted)',
                  }} />
                </div>
                <span style={s.percent}>{Math.round(player.progress)}%</span>
              </div>

              {/* WPM */}
              <div style={s.wpmBox}>
                <span style={s.wpm}>{player.wpm}</span>
                <span style={s.wpmLabel}>wpm</span>
              </div>

              {/* Finished badge */}
              {player.finished && (
                <span style={s.finishedBadge}>
                  🏁 #{player.rank}
                </span>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
};

const s = {
  wrapper: {
    background   : 'var(--card-bg)',
    border       : '1px solid var(--border-color)',
    borderRadius : '14px',
    padding      : '1.25rem',
    boxShadow    : 'var(--shadow)',
  },
  title: {
    fontSize     : '14px',
    fontWeight   : 600,
    color        : 'var(--text-primary)',
    marginBottom : '1rem',
  },
  list: {
    display      : 'flex',
    flexDirection: 'column',
    gap          : '10px',
  },
  playerRow: {
    display      : 'flex',
    alignItems   : 'center',
    gap          : '10px',
  },
  playerInfo: {
    display      : 'flex',
    alignItems   : 'center',
    gap          : '8px',
    width        : '160px',
    flexShrink   : 0,
  },
  rank: {
    fontSize     : '12px',
    fontWeight   : 700,
    color        : 'var(--text-muted)',
    width        : '16px',
  },
  avatar: {
    width          : '28px',
    height         : '28px',
    borderRadius   : '50%',
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    fontSize       : '11px',
    fontWeight     : 700,
    flexShrink     : 0,
  },
  username: {
    fontSize     : '13px',
    overflow     : 'hidden',
    textOverflow : 'ellipsis',
    whiteSpace   : 'nowrap',
  },
  barWrap: {
    flex         : 1,
    display      : 'flex',
    alignItems   : 'center',
    gap          : '8px',
  },
  barTrack: {
    flex         : 1,
    height       : '8px',
    background   : 'var(--bg-tertiary)',
    borderRadius : '999px',
    overflow     : 'hidden',
  },
  barFill: {
    height       : '100%',
    borderRadius : '999px',
    transition   : 'width 0.3s ease',
    minWidth     : '4px',
  },
  percent: {
    fontSize     : '11px',
    color        : 'var(--text-muted)',
    width        : '32px',
    textAlign    : 'right',
    flexShrink   : 0,
  },
  wpmBox: {
    display      : 'flex',
    alignItems   : 'baseline',
    gap          : '2px',
    width        : '56px',
    flexShrink   : 0,
  },
  wpm: {
    fontSize     : '14px',
    fontWeight   : 700,
    color        : 'var(--accent)',
  },
  wpmLabel: {
    fontSize     : '10px',
    color        : 'var(--text-muted)',
  },
  finishedBadge: {
    fontSize     : '11px',
    fontWeight   : 600,
    padding      : '2px 8px',
    borderRadius : '999px',
    background   : '#dcfce7',
    color        : '#15803d',
    flexShrink   : 0,
  },
};

export default ProgressBars;