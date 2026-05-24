const TIME_MODES = [
  { label: '1 min',  value: 1  },
  { label: '2 min',  value: 2  },
  { label: '3 min',  value: 3  },
  { label: '5 min',  value: 5  },
  { label: '10 min', value: 10 },
  { label: 'Custom', value: 0  },
];

const ModeSelector = ({ selected, onChange, customMinutes, onCustomChange, customError }) => {
  return (
    <div style={s.wrapper}>

      {/* Mode Pills */}
      <div style={s.pillsRow}>
        {TIME_MODES.map((mode) => (
          <button
            key={mode.value}
            onClick={() => onChange(mode.value)}
            style={{
              ...s.pill,
              background : selected === mode.value ? 'var(--accent)'          : 'var(--bg-secondary)',
              color      : selected === mode.value ? '#fff'                    : 'var(--text-secondary)',
              border     : selected === mode.value ? '1px solid var(--accent)' : '1px solid var(--border-color)',
              fontWeight : selected === mode.value ? 600                       : 400,
              boxShadow  : selected === mode.value ? '0 4px 12px rgba(249,115,22,0.25)' : 'none',
              transform  : selected === mode.value ? 'scale(1.05)'             : 'scale(1)',
            }}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Custom input */}
      {selected === 0 && (
        <div style={s.customWrap}>
          <div style={s.customRow}>
            <input
              type="number"
              min="1"
              max="120"
              value={customMinutes}
              onChange={(e) => onCustomChange(e.target.value)}
              placeholder="Enter minutes"
              style={{
                ...s.customInput,
                borderColor: customError ? '#dc2626' : 'var(--border-color)',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e  => e.target.style.borderColor = customError ? '#dc2626' : 'var(--border-color)'}
            />
            <span style={s.customSuffix}>min</span>
          </div>
          {customError && (
            <p style={s.customError}>⚠️ {customError}</p>
          )}
        </div>
      )}

    </div>
  );
};

const s = {
  wrapper: {
    display      : 'flex',
    flexDirection: 'column',
    alignItems   : 'center',
    gap          : '12px',
  },
  pillsRow: {
    display       : 'flex',
    flexWrap      : 'wrap',
    gap           : '8px',
    justifyContent: 'center',
  },
  pill: {
    padding      : '7px 18px',
    borderRadius : '999px',
    fontSize     : '13px',
    cursor       : 'pointer',
    transition   : 'all 0.2s',
    whiteSpace   : 'nowrap',
  },
  customWrap: {
    display      : 'flex',
    flexDirection: 'column',
    alignItems   : 'center',
    gap          : '6px',
  },
  customRow: {
    display   : 'flex',
    alignItems: 'center',
    gap       : '8px',
  },
  customInput: {
    width       : '160px',
    padding     : '8px 12px',
    borderRadius: '8px',
    border      : '1px solid var(--border-color)',
    background  : 'var(--bg-secondary)',
    color       : 'var(--text-primary)',
    fontSize    : '14px',
    outline     : 'none',
    transition  : 'border-color 0.2s',
  },
  customSuffix: {
    fontSize : '13px',
    color    : 'var(--text-muted)',
  },
  customError: {
    fontSize: '12px',
    color   : '#dc2626',
  },
};

export default ModeSelector;