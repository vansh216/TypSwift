import { useEffect, useRef } from 'react';

const Timer = ({ seconds, isRunning, onTimeUp }) => {
  const prevSeconds = useRef(seconds);

  useEffect(() => {
    if (isRunning && seconds === 0) {
      onTimeUp();
    }
  }, [seconds, isRunning, onTimeUp]);

  const minutes    = Math.floor(seconds / 60);
  const secs       = seconds % 60;
  const display    = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const isWarning  = seconds <= 10 && seconds > 0;
  const isCritical = seconds <= 5  && seconds > 0;

  return (
    <div style={{
      ...s.timer,
      color    : isCritical ? '#dc2626' : isWarning ? '#f97316' : 'var(--text-primary)',
      animation: isCritical ? 'pulse 0.5s ease-in-out infinite' : 'none',
    }}>
      {display}
    </div>
  );
};

const s = {
  timer: {
    fontSize        : '32px',
    fontWeight      : 700,
    fontVariantNumeric: 'tabular-nums',
    letterSpacing   : '0.02em',
    transition      : 'color 0.3s',
    minWidth        : '80px',
    textAlign       : 'center',
  },
};

export default Timer;