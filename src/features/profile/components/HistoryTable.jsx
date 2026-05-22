const HistoryTable = ({ results, page, totalPages, onPageChange }) => {
  if (!results || results.length === 0) {
    return (
      <div style={s.empty}>
        <p style={s.emptyText}>🎯 No tests yet</p>
        <p style={s.emptySubText}>Complete a test to see your history here</p>
      </div>
    );
  }

  const accuracyColor = (acc) =>
    acc >= 95 ? '#16a34a' :
    acc >= 85 ? '#ca8a04' :
    '#dc2626';

  const accuracyBg = (acc) =>
    acc >= 95 ? '#dcfce7' :
    acc >= 85 ? '#fef9c3' :
    '#fee2e2';

  return (
    <div style={s.wrapper}>

      {/* ── Table ── */}
      <div style={s.tableWrap}>

        {/* Header */}
        <div style={s.header}>
          <span style={{ ...s.headerCell, flex: 1   }}>Date</span>
          <span style={{ ...s.headerCell, width: '90px',  textAlign: 'center' }}>WPM</span>
          <span style={{ ...s.headerCell, width: '90px',  textAlign: 'center' }}>Accuracy</span>
          <span style={{ ...s.headerCell, width: '80px',  textAlign: 'center' }}>Duration</span>
          <span style={{ ...s.headerCell, width: '70px',  textAlign: 'center' }}>Errors</span>
        </div>

        {/* Rows */}
        {results.map((result, index) => (
          <div
            key={result._id || index}
            style={{
              ...s.row,
              background: index % 2 === 0
                ? 'var(--card-bg)'
                : 'var(--bg-secondary)',
            }}
          >
            {/* Date */}
            <div style={{ flex: 1 }}>
              <span style={s.date}>
                {new Date(result.createdAt).toLocaleDateString('en-IN', {
                  day  : '2-digit',
                  month: 'short',
                  year : 'numeric',
                })}
              </span>
              <span style={s.time}>
                {' '}
                {new Date(result.createdAt).toLocaleTimeString('en-IN', {
                  hour  : '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {/* WPM */}
            <div style={{ width: '90px', textAlign: 'center' }}>
              <span style={s.wpm}>{result.wpm}</span>
              <span style={s.wpmLabel}> wpm</span>
            </div>

            {/* Accuracy */}
            <div style={{ width: '90px', textAlign: 'center' }}>
              <span style={{
                ...s.badge,
                background: accuracyBg(result.accuracy),
                color     : accuracyColor(result.accuracy),
              }}>
                {result.accuracy}%
              </span>
            </div>

            {/* Duration */}
            <div style={{ width: '80px', textAlign: 'center' }}>
              <span style={s.duration}>
                {result.duration / 60} min
              </span>
            </div>

            {/* Errors */}
            <div style={{ width: '70px', textAlign: 'center' }}>
              <span style={{
                ...s.errors,
                color: result.errors === 0 ? '#16a34a' : '#dc2626',
              }}>
                {result.errors}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={s.pagination}>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            style={{
              ...s.pageBtn,
              opacity: page === 1 ? 0.4 : 1,
              cursor : page === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            ← Prev
          </button>

          <div style={s.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => onPageChange(num)}
                style={{
                  ...s.pageNum,
                  background : num === page ? 'var(--accent)' : 'transparent',
                  color      : num === page ? '#fff'          : 'var(--text-secondary)',
                  border     : num === page ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                }}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            style={{
              ...s.pageBtn,
              opacity: page === totalPages ? 0.4 : 1,
              cursor : page === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            Next →
          </button>
        </div>
      )}

    </div>
  );
};

const s = {
  wrapper: {
    display      : 'flex',
    flexDirection: 'column',
    gap          : '1rem',
  },
  tableWrap: {
    border      : '1px solid var(--border-color)',
    borderRadius: '12px',
    overflow    : 'hidden',
    background  : 'var(--card-bg)',
  },
  header: {
    display      : 'flex',
    alignItems   : 'center',
    padding      : '12px 20px',
    background   : 'var(--bg-secondary)',
    borderBottom : '1px solid var(--border-color)',
  },
  headerCell: {
    fontSize     : '12px',
    fontWeight   : 600,
    color        : 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  row: {
    display     : 'flex',
    alignItems  : 'center',
    padding     : '12px 20px',
    borderBottom: '1px solid var(--border-color)',
    transition  : 'background 0.15s',
  },
  date: {
    fontSize  : '13px',
    fontWeight: 500,
    color     : 'var(--text-primary)',
  },
  time: {
    fontSize: '12px',
    color   : 'var(--text-muted)',
  },
  wpm: {
    fontSize  : '14px',
    fontWeight: 700,
    color     : 'var(--accent)',
  },
  wpmLabel: {
    fontSize: '11px',
    color   : 'var(--text-muted)',
  },
  badge: {
    display      : 'inline-block',
    padding      : '2px 8px',
    borderRadius : '999px',
    fontSize     : '12px',
    fontWeight   : 600,
  },
  duration: {
    fontSize: '13px',
    color   : 'var(--text-secondary)',
  },
  errors: {
    fontSize  : '13px',
    fontWeight: 600,
  },
  empty: {
    display        : 'flex',
    flexDirection  : 'column',
    alignItems     : 'center',
    justifyContent : 'center',
    padding        : '4rem 0',
    gap            : '8px',
    border         : '1px solid var(--border-color)',
    borderRadius   : '12px',
    background     : 'var(--card-bg)',
  },
  emptyText: {
    fontSize  : '16px',
    fontWeight: 500,
    color     : 'var(--text-primary)',
  },
  emptySubText: {
    fontSize: '13px',
    color   : 'var(--text-secondary)',
  },
  pagination: {
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    gap            : '12px',
  },
  pageBtn: {
    padding      : '6px 14px',
    borderRadius : '8px',
    border       : '1px solid var(--border-color)',
    background   : 'transparent',
    color        : 'var(--text-secondary)',
    fontSize     : '13px',
    fontWeight   : 500,
    transition   : 'all 0.2s',
  },
  pageNumbers: {
    display : 'flex',
    gap     : '6px',
  },
  pageNum: {
    width        : '32px',
    height       : '32px',
    borderRadius : '6px',
    fontSize     : '13px',
    fontWeight   : 500,
    cursor       : 'pointer',
    transition   : 'all 0.2s',
    display      : 'flex',
    alignItems   : 'center',
    justifyContent: 'center',
  },
};

export default HistoryTable;