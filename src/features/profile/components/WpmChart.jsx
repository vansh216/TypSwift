const WpmChart = ({ results }) => {
  if (!results || results.length === 0) return null;

  // Last 10 results reversed so oldest is on left
  const data = [...results]
    .slice(0, 10)
    .reverse()
    .map((r, i) => ({
      index   : i + 1,
      wpm     : r.wpm,
      accuracy: r.accuracy,
      date    : new Date(r.createdAt).toLocaleDateString('en-IN', {
        day  : '2-digit',
        month: 'short',
      }),
    }));

  const width  = 600;
  const height = 220;
  const padL   = 45;
  const padR   = 20;
  const padT   = 20;
  const padB   = 50;

  const maxWpm = Math.max(...data.map(d => d.wpm), 1);
  const minWpm = Math.min(...data.map(d => d.wpm), 0);
  const range  = maxWpm - minWpm || 1;

  const points = data.map((d, i) => {
    const x = padL + (i / Math.max(data.length - 1, 1)) * (width - padL - padR);
    const y = padT + ((maxWpm - d.wpm) / range) * (height - padT - padB);
    return { ...d, x, y };
  });

  const linePath = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  const areaPath = [
    ...points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`),
    `L ${points[points.length - 1].x} ${height - padB}`,
    `L ${points[0].x} ${height - padB}`,
    'Z',
  ].join(' ');

  const yLabels = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    value: Math.round(minWpm + t * range),
    y    : padT + (1 - t) * (height - padT - padB),
  }));

  return (
    <div style={s.card}>
      <h3 style={s.title}>WPM Progress — Last 10 Tests</h3>
      <div style={{ overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', minWidth: '300px', height: 'auto' }}
        >
          {/* ── Grid lines ── */}
          {yLabels.map((label, i) => (
            <line
              key={i}
              x1={padL}
              y1={label.y}
              x2={width - padR}
              y2={label.y}
              stroke="var(--border-color)"
              strokeDasharray="4 4"
              strokeWidth={0.8}
            />
          ))}

          {/* ── Y axis labels ── */}
          {yLabels.map((label, i) => (
            <text
              key={i}
              x={padL - 8}
              y={label.y + 4}
              textAnchor="end"
              fontSize={10}
              fill="var(--text-muted)"
            >
              {label.value}
            </text>
          ))}

          {/* ── X axis labels ── */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={height - padB + 16}
              textAnchor="middle"
              fontSize={9}
              fill="var(--text-muted)"
            >
              {p.date}
            </text>
          ))}

          {/* ── Axis titles ── */}
          <text
            x={12}
            y={height / 2}
            textAnchor="middle"
            fontSize={10}
            fill="var(--text-muted)"
            transform={`rotate(-90, 12, ${height / 2})`}
          >
            WPM
          </text>

          {/* ── Area fill ── */}
          <path
            d={areaPath}
            fill="var(--accent)"
            opacity={0.1}
          />

          {/* ── Line ── */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* ── Data points ── */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={5}
                fill="var(--accent)"
                stroke="var(--card-bg)"
                strokeWidth={2}
              />
              {/* WPM label above dot */}
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                fontSize={10}
                fontWeight={600}
                fill="var(--accent)"
              >
                {p.wpm}
              </text>
              <title>{`${p.date}: ${p.wpm} WPM — ${p.accuracy}% accuracy`}</title>
            </g>
          ))}

        </svg>
      </div>
    </div>
  );
};

const s = {
  card: {
    background   : 'var(--card-bg)',
    border       : '1px solid var(--border-color)',
    borderRadius : '12px',
    padding      : '1.5rem',
    marginBottom : '2rem',
  },
  title: {
    fontSize     : '15px',
    fontWeight   : 600,
    color        : 'var(--text-primary)',
    marginBottom : '1rem',
  },
};

export default WpmChart;