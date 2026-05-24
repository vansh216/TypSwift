const WpmCounter = ({ wpm, accuracy }) => {
  return (
    <div style={s.wrapper}>
      <div style={s.stat}>
        <span style={s.value}>{wpm}</span>
        <span style={s.label}>wpm</span>
      </div>
      <div style={s.divider} />
      <div style={s.stat}>
        <span style={{
          ...s.value,
          color: accuracy >= 95 ? '#16a34a'
               : accuracy >= 85 ? '#ca8a04'
               : '#dc2626',
          fontSize: '20px',
        }}>
          {accuracy}%
        </span>
        <span style={s.label}>acc</span>
      </div>
    </div>
  );
};

const s = {
  wrapper: {
    display   : 'flex',
    alignItems: 'center',
    gap       : '16px',
  },
  stat: {
    display      : 'flex',
    alignItems   : 'baseline',
    gap          : '4px',
  },
  value: {
    fontSize  : '28px',
    fontWeight: 700,
    color     : 'var(--accent)',
    lineHeight: 1,
  },
  label: {
    fontSize : '13px',
    color    : 'var(--text-muted)',
    fontWeight: 500,
  },
  divider: {
    width     : '1px',
    height    : '28px',
    background: 'var(--border-color)',
  },
};

export default WpmCounter;