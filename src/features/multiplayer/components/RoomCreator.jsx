import { useState } from 'react';

const TIME_MODES = [
  { label: '1 min', value: 1 },
  { label: '2 min', value: 2 },
  { label: '3 min', value: 3 },
  { label: '5 min', value: 5 },
];

const RoomCreator = ({ onCreateRoom, loading, disabled }) => {
  const [selectedTime, setSelectedTime] = useState(1);

  return (
    <div style={s.card}>
      <div style={s.iconWrap}>🏠</div>
      <h2 style={s.title}>Create Room</h2>
      <p style={s.subtitle}>Start a new battle and invite friends</p>

      <div style={s.section}>
        <p style={s.label}>Select time limit</p>
        <div style={s.pills}>
          {TIME_MODES.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setSelectedTime(mode.value)}
              style={{
                ...s.pill,
                background : selectedTime === mode.value ? 'var(--accent)' : 'var(--bg-secondary)',
                color      : selectedTime === mode.value ? '#fff'           : 'var(--text-secondary)',
                border     : selectedTime === mode.value ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                fontWeight : selectedTime === mode.value ? 600 : 400,
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onCreateRoom(selectedTime)}
        disabled={loading || disabled}
        style={{
          ...s.btn,
          opacity: loading || disabled ? 0.6 : 1,
          cursor : loading || disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Creating...' : '🚀 Create Room'}
      </button>
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
  section: {
    display      : 'flex',
    flexDirection: 'column',
    gap          : '8px',
  },
  label: {
    fontSize     : '12px',
    fontWeight   : 500,
    color        : 'var(--text-muted)',
    textAlign    : 'center',
  },
  pills: {
    display        : 'flex',
    flexWrap       : 'wrap',
    gap            : '8px',
    justifyContent : 'center',
  },
  pill: {
    padding      : '6px 16px',
    borderRadius : '999px',
    fontSize     : '13px',
    cursor       : 'pointer',
    transition   : 'all 0.2s',
    border       : '1px solid var(--border-color)',
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
    marginTop    : 'auto',
  },
};

export default RoomCreator;