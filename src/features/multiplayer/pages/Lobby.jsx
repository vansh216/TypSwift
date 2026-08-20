    import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { useSocket }           from '../context/SocketContext';
import RoomCreator             from '../components/RoomCreator';
import RoomJoiner              from '../components/RoomJoiner';

const Lobby = () => {
  const navigate        = useNavigate();
  const { socket, connected } = useSocket();
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // ── Listen for room created ──
    socket.on('room-created', (data) => {
      setLoading(false);
      navigate('/multiplayer/waiting', {
        state: {
          roomCode : data.roomCode,
          timeLimit: data.timeLimit,
          players  : data.players,
          isHost   : true,
        },
      });
    });

    // ── Listen for errors ──
    socket.on('room-error', (data) => {
      setLoading(false);
      setError(data.message);
    });

    return () => {
      socket.off('room-created');
      socket.off('room-error');
    };
  }, [socket, navigate]);

  const handleCreateRoom = (timeLimit) => {
    if (!socket || !connected) {
      setError('Not connected to server. Please refresh.');
      return;
    }
    setLoading(true);
    setError('');
    socket.emit('create-room', { timeLimit });
  };

  const handleJoinRoom = (roomCode) => {
    if (!socket || !connected) {
      setError('Not connected to server. Please refresh.');
      return;
    }
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }
    setLoading(true);
    setError('');

    // Listen for join confirmation
    socket.once('room-update', (data) => {
      setLoading(false);
      navigate('/multiplayer/waiting', {
        state: {
          roomCode : data.roomCode,
          timeLimit: data.timeLimit,
          players  : data.players,
          isHost   : false,
        },
      });
    });

    socket.emit('join-room', { roomCode: roomCode.toUpperCase().trim() });
  };

  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <div style={s.header}>
        <h1 style={s.title}>⚔️ Typing Battle</h1>
        <p style={s.subtitle}>
          Create a room and invite friends or join an existing battle
        </p>
        <div style={{
          ...s.statusDot,
          background: connected ? '#22c55e' : '#ef4444',
        }}>
          <span style={s.statusDotInner} />
          <span style={s.statusText}>
            {connected ? 'Connected' : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={s.errorBox}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Cards ── */}
      <div style={s.cards}>
        <RoomCreator
          onCreateRoom={handleCreateRoom}
          loading={loading}
          disabled={!connected}
        />
        <div style={s.dividerCol}>
          <div style={s.dividerLine} />
          <span style={s.dividerText}>OR</span>
          <div style={s.dividerLine} />
        </div>
        <RoomJoiner
          onJoinRoom={handleJoinRoom}
          loading={loading}
          disabled={!connected}
        />
      </div>

    </div>
  );
};

const s = {
  page: {
    maxWidth     : '800px',
    margin       : '0 auto',
    padding      : '2rem 1rem',
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
    fontSize     : '14px',
    color        : 'var(--text-secondary)',
    marginBottom : '1rem',
  },
  statusDot: {
    display        : 'inline-flex',
    alignItems     : 'center',
    gap            : '6px',
    padding        : '4px 12px',
    borderRadius   : '999px',
    margin         : '0 auto',
  },
  statusDotInner: {
    width        : '8px',
    height       : '8px',
    borderRadius : '50%',
    background   : '#fff',
    display      : 'inline-block',
  },
  statusText: {
    fontSize     : '12px',
    color        : '#fff',
    fontWeight   : 500,
  },
  errorBox: {
    background   : '#fef2f2',
    border       : '1px solid #fecaca',
    borderRadius : '10px',
    padding      : '12px 20px',
    fontSize     : '14px',
    color        : '#dc2626',
    marginBottom : '1.5rem',
    textAlign    : 'center',
  },
  cards: {
    display      : 'flex',
    alignItems   : 'stretch',
    gap          : '1.5rem',
    flexWrap     : 'wrap',
  },
  dividerCol: {
    display        : 'flex',
    flexDirection  : 'column',
    alignItems     : 'center',
    gap            : '8px',
    padding        : '1rem 0',
  },
  dividerLine: {
    flex         : 1,
    width        : '1px',
    background   : 'var(--border-color)',
    minHeight    : '40px',
  },
  dividerText: {
    fontSize     : '12px',
    color        : 'var(--text-muted)',
    fontWeight   : 600,
  },
};

export default Lobby;