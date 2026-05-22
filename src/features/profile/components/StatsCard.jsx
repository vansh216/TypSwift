const STATS = (stats) => [
  {
    label  : 'Best WPM',
    value  : stats.bestWpm,
    suffix : 'wpm',
    color  : 'var(--accent)',
    icon   : '🚀',
    bg     : 'var(--accent-light)',
    border : 'var(--accent-border)',
  },
  {
    label  : 'Average WPM',
    value  : stats.averageWpm,
    suffix : 'wpm',
    color  : 'var(--text-primary)',
    icon   : '📊',
    bg     : 'var(--bg-secondary)',
    border : 'var(--border-color)',
  },
  {
    label  : 'Avg Accuracy',
    value  : stats.averageAccuracy,
    suffix : '%',
    color  : '#16a34a',
    icon   : '🎯',
    bg     : '#dcfce7',
    border : '#86efac',
  },
  {
    label  : 'Total Tests',
    value  : stats.totalTests,
    suffix : '',
    color  : '#1d4ed8',
    icon   : '⌨️',
    bg     : '#dbeafe',
    border : '#93c5fd',
  },
  {
    label  : 'Time Typed',
    value  : stats.totalTimeMinutes,
    suffix : 'min',
    color  : '#7c3aed',
    icon   : '⏱️',
    bg     : '#ede9fe',
    border : '#c4b5fd',
  },
];

const StatsCard = ({ stats }) => {
  if (!stats) return null;

  return (
    <div style={s.grid}>
      {STATS(stats).map((stat, i) => (
        <div
          key={i}
          style={{
            ...s.card,
            background  : stat.bg,
            borderColor : stat.border,
          }}
        >
          <div style={s.iconRow}>
            <span style={s.icon}>{stat.icon}</span>
            <span style={s.label}>{stat.label}</span>
          </div>
          <div style={s.valueRow}>
            <span style={{ ...s.value, color: stat.color }}>
              {stat.value ?? 0}
            </span>
            {stat.suffix && (
              <span style={s.suffix}>{stat.suffix}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const s = {
  grid: {
    display             : 'grid',
    gridTemplateColumns : 'repeat(auto-fit, minmax(140px, 1fr))',
    gap                 : '1rem',
    marginBottom        : '2rem',
  },
  card: {
    padding      : '1.25rem 1rem',
    borderRadius : '12px',
    border       : '1px solid',
    display      : 'flex',
    flexDirection: 'column',
    gap          : '10px',
    transition   : 'transform 0.2s',
    cursor       : 'default',
  },
  iconRow: {
    display    : 'flex',
    alignItems : 'center',
    gap        : '8px',
  },
  icon: {
    fontSize: '18px',
  },
  label: {
    fontSize     : '12px',
    fontWeight   : 500,
    color        : 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  valueRow: {
    display    : 'flex',
    alignItems : 'baseline',
    gap        : '4px',
  },
  value: {
    fontSize  : '28px',
    fontWeight: 700,
    lineHeight: 1,
  },
  suffix: {
    fontSize : '13px',
    color    : 'var(--text-muted)',
    fontWeight: 500,
  },
};

export default StatsCard;