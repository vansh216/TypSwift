const PlayerList = ({ players, currentUserId, isHost }) => {
  return (
    <div style={s.wrapper}>
      <div style={s.header}>
        <h3 style={s.title}>Players</h3>
        <span style={s.count}>{players.length} / 10</span>
      </div>

      <div style={s.list}>
        {players.map((player, index) => {
          const isCurrentUser = player.userId === currentUserId;
          const isPlayerHost  = index === 0;

          return (
            <div
              key={player.socketId || player.userId}
              style={{
                ...s.playerRow,
                background: isCurrentUser
                  ? 'var(--accent-light)'
                  : 'var(--bg-secondary)',
                border: isCurrentUser
                  ? '1px solid var(--accent-border)'
                  : '1px solid var(--border-color)',
              }}
            >
              {/* Avatar */}
              <div style={{
                ...s.avatar,
                background: isCurrentUser ? 'var(--accent)' : 'var(--bg-tertiary)',
                color     : isCurrentUser ? '#fff' : 'var(--text-secondary)',
              }}>
                {player.avatar || player.username?.charAt(0).toUpperCase()}
              </div>

              {/* Name */}
              <span style={{
                ...s.username,
                color: isCurrentUser ? 'var(--accent-text)' : 'var(--text-primary)',
              }}>
                {player.username}
                {isCurrentUser && ' (You)'}
              </span>

              {/* Badges */}
              <div style={s.badges}>
                {isPlayerHost && (
                  <span style={s.hostBadge}>👑 Host</span>
                )}
                <span style={s.readyBadge}>✅ Ready</span>
              </div>
            </div>
          );
        })}

        {/* Empty slots */}
        {players.length < 10 && (
          <div style={s.emptySlot}>
            <span style={s.emptyText}>
              Waiting for players... share the room code!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  wrapper: {
    background   : 'var(--card-bg)',
    border       : '1px solid var(--border-color)',
    borderRadius : '14px',
    overflow     : 'hidden',
    boxShadow    : 'var(--shadow)',
  },
  header: {
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'space-between',
    padding        : '1rem 1.25rem',
    borderBottom   : '1px solid var(--border-color)',
    background     : 'var(--bg-secondary)',
  },
  title: {
    fontSize     : '14px',
    fontWeight   : 600,
    color        : 'var(--text-primary)',
  },
  count: {
    fontSize     : '12px',
    color        : 'var(--text-muted)',
    background   : 'var(--bg-tertiary)',
    padding      : '2px 8px',
    borderRadius : '999px',
    border       : '1px solid var(--border-color)',
  },
  list: {
    display      : 'flex',
    flexDirection: 'column',
    gap          : '8px',
    padding      : '1rem',
  },
  playerRow: {
    display      : 'flex',
    alignItems   : 'center',
    gap          : '12px',
    padding      : '10px 14px',
    borderRadius : '10px',
    transition   : 'all 0.2s',
  },
  avatar: {
    width          : '36px',
    height         : '36px',
    borderRadius   : '50%',
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    fontSize       : '14px',
    fontWeight     : 700,
    flexShrink     : 0,
  },
  username: {
    fontSize     : '14px',
    fontWeight   : 500,
    flex         : 1,
  },
  badges: {
    display      : 'flex',
    alignItems   : 'center',
    gap          : '6px',
  },
  hostBadge: {
    fontSize     : '11px',
    fontWeight   : 600,
    padding      : '2px 8px',
    borderRadius : '999px',
    background   : '#fef9c3',
    color        : '#854d0e',
    border       : '1px solid #fde047',
  },
  readyBadge: {
    fontSize     : '11px',
    fontWeight   : 600,
    padding      : '2px 8px',
    borderRadius : '999px',
    background   : '#dcfce7',
    color        : '#15803d',
    border       : '1px solid #86efac',
  },
  emptySlot: {
    padding      : '12px',
    textAlign    : 'center',
    borderRadius : '10px',
    border       : '1px dashed var(--border-color)',
  },
  emptyText: {
    fontSize     : '13px',
    color        : 'var(--text-muted)',
  },
};

export default PlayerList;