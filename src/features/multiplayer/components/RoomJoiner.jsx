import { useState } from 'react';

const RoomJoiner = ({ onJoinRoom, loading, disabled }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onJoinRoom(code);
  };

  return (
    <div style={s.card}>
      <div style={s.iconWrap}>🔗</div>
      <h2 style={s.title}>Join Room</h2>
      <p style={s.subtitle}>Enter a room code to join an existing battle</p>

      <form onSubmit={handleSubmit} style={s.form}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter room code"
          maxLength={6}
          style={s.input}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e  => e.target.style.borderColor = 'var(--border-color)'}
        />
        <button
          type="submit"
          disabled={loading || disabled || !code.trim()}
          style={{
            ...s.btn,
            opacity: loading || disabled || !code.trim() ? 0.6 : 1,
            cursor : loading || disabled || !code.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Joining...' : '⚔️ Join Battle'}
        </button>
      </form>
    </div>
  );
};

const s = {
  card: {
    flex         : 1,
    minWidth     : '240px',
    background   : 'var(--card-bg)',
    border       : '1px solid var(--border-color)',
    borderRadius : '16px',
    padding      : '1.5rem',
    display      : 'flex',
    flexDirection: 'column',
    gap          : '1rem',
    boxShadow    : 'var(--shadow)',
  },
  iconWrap: {
    fontSize     : '32px',
    textAlign    : 'center',
  },
  title: {
    fontSize     : '18px',
    fontWeight   : 700,
    color        : 'var(--text-primary)',
    textAlign    : 'center',
  },
  subtitle: {
    fontSize     : '13px',
    color        : 'var(--text-secondary)',
    textAlign    : 'center',
  },
  form: {
    display      : 'flex',
    flexDirection: 'column',
    gap          : '12px',
    marginTop    : 'auto',
  },
  input: {
    width        : '100%',
    padding      : '10px 14px',
    fontSize     : '18px',
    fontWeight   : 700,
    letterSpacing: '0.2em',
    textAlign    : 'center',
    borderRadius : '10px',
    border       : '1px solid var(--border-color)',
    background   : 'var(--bg-secondary)',
    color        : 'var(--text-primary)',
    outline      : 'none',
    transition   : 'border-color 0.2s',
    boxSizing    : 'border-box',
  },
  btn: {
    width        : '100%',
    padding      : '11px',
    borderRadius : '10px',
    border       : 'none',
    background   : 'var(--accent)',
    color        : '#fff',
    fontSize     : '14px',
    fontWeight   : 600,
    transition   : 'all 0.2s',
  },
};

export default RoomJoiner;