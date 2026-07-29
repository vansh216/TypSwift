import AIAnalysis from './AIAnalysis';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ResultCard = ({ result, charErrors }) => {
  const {
    wpm,
    accuracy,
    duration,
    errors,
    wpmHistory = [],
  } = result;

  const num = duration/60;
const minute= num.toFixed(2);

  // Build chart data from wpmHistory array
  const chartData = wpmHistory.map((w, i) => ({
    second: i + 1,
    wpm   : w,
  }));

  // Accuracy color
  const accuracyColor =
    accuracy >= 95 ? '#16a34a' :
    accuracy >= 85 ? '#ca8a04' :
    '#dc2626';

  const s = styles;

  return (
    <div style={s.card}>

        {/* AI Analysis  */}
    

    {/* ── Divider ── */}
    <div style={s.divider} />
    

      {/* ── Stats Grid ── */}
      <div style={s.statsGrid}>
        

        {/* WPM */}
        <div style={s.statBox}>
          <span style={s.statValue(true)}>{wpm}</span>
          <span style={s.statLabel}>WPM</span>
        </div>
        

        {/* Accuracy */}
        <div style={s.statBox}>
          <span style={{ ...s.statValue(false), color: accuracyColor }}>
            {accuracy}%
          </span>
          <span style={s.statLabel}>Accuracy</span>
        </div>

        {/* Duration */}
        <div style={s.statBox}>
          <span style={s.statValue(false)}>
           { minute}
          </span>
          <span style={s.statLabel}>Minutes</span>
        </div>

        {/* Errors */}
        <div style={s.statBox}>
          <span style={{ ...s.statValue(false), color: errors > 0 ? '#dc2626' : '#16a34a' }}>
            {errors}
          </span>
          <span style={s.statLabel}>Errors</span>
        </div>

      </div>

      {/* ── Divider ── */}
      <div style={s.divider} />

      {/* ── Performance Tags ── */}
      <div style={s.tagsRow}>
        {wpm >= 100 && (
          <span style={{ ...s.tag, background: '#dcfce7', color: '#16a34a' }}>
            🚀 Speed Demon
          </span>
        )}
        {accuracy >= 98 && (
          <span style={{ ...s.tag, background: '#dbeafe', color: '#1d4ed8' }}>
            🎯 Sharpshooter
          </span>
        )}
        {errors === 0 && (
          <span style={{ ...s.tag, background: '#fef9c3', color: '#854d0e' }}>
            ✨ Perfect Run
          </span>
        )}
        {wpm >= 60 && wpm < 100 && (
          <span style={{ ...s.tag, background: '#fff7ed', color: '#c2410c' }}>
            🔥 Getting Faster
          </span>
        )}
        {wpm < 60 && (
          <span style={{ ...s.tag, background: '#f3f4f6', color: '#6b7280' }}>
            💪 Keep Practicing
          </span>
        )}
      </div>
      <AIAnalysis
      result={result}
      charErrors={charErrors}
    />

      {/* ── WPM Chart ── */}
      {chartData.length > 0 && (
        <>
          <div style={s.divider} />
          <div style={s.chartSection}>
            <h3 style={s.chartTitle}>WPM over time</h3>
            <div style={s.chartWrap}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-color)"
                  />
                  <XAxis
                    dataKey="second"
                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                    label={{
                      value   : 'Seconds',
                      position: 'insideBottom',
                      offset  : -2,
                      style   : { fontSize: 11, fill: 'var(--text-muted)' },
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                    label={{
                      value   : 'WPM',
                      angle   : -90,
                      position: 'insideLeft',
                      style   : { fontSize: 11, fill: 'var(--text-muted)' },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      background  : 'var(--card-bg)',
                      border      : '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize    : '13px',
                      color       : 'var(--text-primary)',
                    }}
                    formatter={(value) => [`${value} wpm`, 'Speed']}
                    labelFormatter={(label) => `Second ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="wpm"
                    stroke="var(--accent)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: 'var(--accent)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

const styles = {
  card: {
    background   : 'var(--card-bg)',
    border       : '1px solid var(--border-color)',
    borderRadius : '16px',
    padding      : '2rem',
    boxShadow    : 'var(--shadow)',
  },
  statsGrid: {
    display              : 'grid',
    gridTemplateColumns  : 'repeat(4, 1fr)',
    gap                  : '1rem',
    marginBottom         : '1.5rem',
  },
  statBox: {
    display        : 'flex',
    flexDirection  : 'column',
    alignItems     : 'center',
    justifyContent : 'center',
    padding        : '1.25rem 1rem',
    background     : 'var(--bg-secondary)',
    borderRadius   : '12px',
    border         : '1px solid var(--border-color)',
    gap            : '6px',
  },
  statValue: (isAccent) => ({
    fontSize  : '32px',
    fontWeight: 700,
    color     : isAccent ? 'var(--accent)' : 'var(--text-primary)',
    lineHeight: 1,
  }),
  statLabel: {
    fontSize : '12px',
    color    : 'var(--text-muted)',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  divider: {
    height     : '1px',
    background : 'var(--border-color)',
    margin     : '1.5rem 0',
  },
  tagsRow: {
    display  : 'flex',
    flexWrap : 'wrap',
    gap      : '8px',
  },
  tag: {
    padding      : '4px 12px',
    borderRadius : '999px',
    fontSize     : '12px',
    fontWeight   : 600,
  },
  chartSection: {
    display       : 'flex',
    flexDirection : 'column',
    gap           : '1rem',
  },
  chartTitle: {
    fontSize  : '14px',
    fontWeight: 600,
    color     : 'var(--text-primary)',
  },
  chartWrap: {
    width : '100%',
  },
};

export default ResultCard;