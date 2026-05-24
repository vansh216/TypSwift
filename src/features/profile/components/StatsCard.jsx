const STATS = (stats) => [
  {
    label     : 'Best WPM',
    value     : stats.bestWpm,
    suffix    : 'wpm',
    icon      : '🚀',
    valueColor: 'var(--accent)',
    labelColor: 'var(--text-secondary)',
    bg        : 'var(--bg-secondary)',
    border    : 'var(--border-color)',
  },
  {
    label     : 'Average WPM',
    value     : stats.averageWpm,
    suffix    : 'wpm',
    icon      : '📊',
    valueColor: 'var(--text-primary)',
    labelColor: 'var(--text-secondary)',
    bg        : 'var(--bg-secondary)',
    border    : 'var(--border-color)',
  },
  {
    label     : 'Avg Accuracy',
    value     : stats.averageAccuracy,
    suffix    : '%',
    icon      : '🎯',
    valueColor: '#ffffff',
    labelColor: 'rgba(255,255,255,0.8)',
    bg        : '#16a34a',
    border    : '#15803d',
  },
  {
    label     : 'Total Tests',
    value     : stats.totalTests,
    suffix    : '',
    icon      : '⌨️',
    valueColor: '#ffffff',
    labelColor: 'rgba(255,255,255,0.8)',
    bg        : '#2563eb',
    border    : '#1d4ed8',
  },
  {
    label     : 'Time Typed',
    value     : stats.totalTimeMinutes,
    suffix    : 'min',
    icon      : '⏱️',
    valueColor: '#ffffff',
    labelColor: 'rgba(255,255,255,0.8)',
    bg        : '#7c3aed',
    border    : '#6d28d9',
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
            <span style={{...s.label ,color:stat.labelColor}}>{stat.label}</span>
          </div>
          <div style={s.valueRow}>
            <span style={{ ...s.value, color: stat.valueColor }}>
              {stat.value ?? 0}
            </span>
            {stat.suffix && (
              <span style={{...s.suffix ,color: stat.labelColor}}>{stat.suffix}</span>
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