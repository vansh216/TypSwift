import { useState, useEffect }       from 'react';
import { useNavigate, useLocation }  from 'react-router-dom';
import { useSocket }                 from '../context/SocketContext';
import { useAuth }                   from '../../../shared/context/AuthContext';
import PlayerList                    from '../components/PlayerList';

const WaitingRoom = () => {
  const navigate              = useNavigate();
  const location              = useLocation();
  const { socket, connected } = useSocket();
  const { user }              = useAuth();

  const {
    roomCode,
    timeLimit: initialTimeLimit,
    players  : initialPlayers,
    isHost   : initialIsHost,
  } = location.state || {};

  const [players,   setPlayers]   = useState(initialPlayers || []);
  const [isHost,    setIsHost]    = useState(initialIsHost  || false);
  const [timeLimit, setTimeLimit] = useState(initialTimeLimit || 1);
  const [error,     setError]     = useState('');
  const [starting,  setStarting]  = useState(false);
  const [copied,    setCopied]    = useState(false);

  // Redirect if no room code
  useEffect(() => {
    if (!roomCode) navigate('/multiplayer');
  }, [roomCode, navigate]);

  // Re-sync with the room on mount (e.g. after "Play Again" or a page refresh).
  // Without this the server never sends us the current player list, so the room
  // looks empty. The server replies with a fresh 'room-update'.
  useEffect(() => {
    if (!socket || !roomCode) return;
    socket.emit('join-room', { roomCode });
  }, [socket, roomCode]);

  useEffect(() => {
    if (!socket) return;

    // ── Room update — player joined or left ──
    socket.on('room-update', (data) => {
      setPlayers(data.players);
      setTimeLimit(data.timeLimit);
      // Check if current user is host
      const currentPlayer = data.players.find(p => p.userId === user?.id);
      if (currentPlayer) {
        setIsHost(data.hostId === user?.id);
      }
    });

    // ── Host changed ──
    socket.on('host-changed', (data) => {
      if (data.newHostId === user?.id) {
        setIsHost(true);
      }
    });

    // ── Player left ──
    socket.on('player-left', (data) => {
      setPlayers(data.players);
    });

    // ── Game started — navigate to battle ──
    socket.on('game-started', (data) => {
      navigate('/multiplayer/battle', {
        state: {
          roomCode,
          timeLimit: data.timeLimit,
          paragraph: data.paragraph,
          players  : data.players,
        },
      });
    });

    // ── Errors ──
    socket.on('room-error', (data) => {
      setError(data.message);
      setStarting(false);
    });

    return () => {
      socket.off('room-update');
      socket.off('host-changed');
      socket.off('player-left');
      socket.off('game-started');
      socket.off('room-error');
    };
  }, [socket, navigate, roomCode, user]);

  const handleStartGame = () => {
    if (!socket) return;
    setStarting(true);
    setError('');
    socket.emit('start-game', { roomCode });
  };

  const handleLeaveRoom = () => {
    if (socket) socket.emit('leave-room', { roomCode });
    navigate('/multiplayer');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <div style={s.header}>
        <h1 style={s.title}>⚔️ Battle Lobby</h1>
        <p style={s.subtitle}>
          Share the room code with friends to invite them
        </p>
      </div>

      {/* ── Room code ── */}
      <div style={s.codeCard}>
        <p style={s.codeLabel}>Room Code</p>
        <div style={s.codeRow}>
          <span style={s.code}>{roomCode}</span>
          <button onClick={handleCopyCode} style={s.copyBtn}>
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>
        <p style={s.codeHint}>
          {timeLimit} minute battle
        </p>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={s.errorBox}>⚠️ {error}</div>
      )}

      {/* ── Player list ── */}
      <PlayerList
        players={players}
        currentUserId={user?.id}
        isHost={isHost}
      />

      {/* ── Actions ── */}
      <div style={s.actions}>
        {isHost ? (
          <button
            onClick={handleStartGame}
            disabled={players.length < 2 || starting}
            style={{
              ...s.startBtn,
              opacity: players.length < 2 || starting ? 0.6 : 1,
              cursor : players.length < 2 || starting ? 'not-allowed' : 'pointer',
            }}
          >
            {starting ? 'Starting...' : '🚀 Start Battle'}
          </button>
        ) : (
          <div style={s.waitingMsg}>
            ⏳ Waiting for host to start the battle...
          </div>
        )}

        {players.length < 2 && isHost && (
          <p style={s.minPlayers}>
            Need at least 2 players to start
          </p>
        )}

        <button onClick={handleLeaveRoom} style={s.leaveBtn}>
          Leave Room
        </button>
      </div>

    </div>
  );
};

const s = {
  page: {
    maxWidth     : '600px',
    margin       : '0 auto',
    padding      : '2rem 1rem',
    display      : 'flex',
    flexDirection: 'column',
    gap          : '1.5rem',
  },
  header: {
    textAlign    : 'center',
  },
  title: {
    fontSize     : '24px',
    fontWeight   : 700,
    color        : 'var(--text-primary)',
    marginBottom : '6px',
  },
  subtitle: {
    fontSize     : '13px',
    color        : 'var(--text-secondary)',
  },
  codeCard: {
    background   : 'var(--card-bg)',
    border       : '1px solid var(--border-color)',
    borderRadius : '14px',
    padding      : '1.5rem',
    textAlign    : 'center',
    boxShadow    : 'var(--shadow)',
  },
  codeLabel: {
    fontSize     : '12px',
    fontWeight   : 500,
    color        : 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom : '8px',
  },
  codeRow: {
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    gap            : '12px',
    marginBottom   : '8px',
  },
  code: {
    fontSize     : '32px',
    fontWeight   : 800,
    color        : 'var(--accent)',
    letterSpacing: '0.2em',
    fontFamily   : 'monospace',
  },
  copyBtn: {
    padding      : '6px 14px',
    borderRadius : '8px',
    border       : '1px solid var(--border-color)',
    background   : 'var(--bg-secondary)',
    color        : 'var(--text-secondary)',
    fontSize     : '12px',
    cursor       : 'pointer',
    transition   : 'all 0.2s',
  },
  codeHint: {
    fontSize     : '13px',
    color        : 'var(--text-muted)',
  },
  errorBox: {
    background   : '#fef2f2',
    border       : '1px solid #fecaca',
    borderRadius : '10px',
    padding      : '12px 20px',
    fontSize     : '14px',
    color        : '#dc2626',
    textAlign    : 'center',
  },
  actions: {
    display      : 'flex',
    flexDirection: 'column',
    alignItems   : 'center',
    gap          : '12px',
  },
  startBtn: {
    padding      : '12px 48px',
    borderRadius : '10px',
    border       : 'none',
    background   : 'var(--accent)',
    color        : '#fff',
    fontSize     : '15px',
    fontWeight   : 700,
    transition   : 'all 0.2s',
    boxShadow    : '0 4px 14px rgba(249,115,22,0.3)',
  },
  waitingMsg: {
    fontSize     : '14px',
    color        : 'var(--text-secondary)',
    padding      : '12px 24px',
    background   : 'var(--bg-secondary)',
    borderRadius : '10px',
    border       : '1px solid var(--border-color)',
  },
  minPlayers: {
    fontSize     : '12px',
    color        : 'var(--text-muted)',
  },
  leaveBtn: {
    padding      : '8px 24px',
    borderRadius : '8px',
    border       : '1px solid var(--border-color)',
    background   : 'transparent',
    color        : 'var(--text-secondary)',
    fontSize     : '13px',
    cursor       : 'pointer',
    transition   : 'all 0.2s',
  },
};

export default WaitingRoom;