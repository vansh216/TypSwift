import { useEffect, useState } from 'react';

const CountDown = ({ count }) => {
  const isGo = count === 'Go!' || count === 0;

  return (
    <div style={s.overlay}>
      <div style={{
        ...s.countBox,
        background: isGo ? 'var(--accent)' : 'var(--card-bg)',
        transform : 'scale(1)',
        animation : 'countPop 0.3s ease-out',
      }}>
        <span style={{
          ...s.count,
          color: isGo ? '#fff' : 'var(--accent)',
        }}>
          {count === 0 ? 'Go!' : count}
        </span>
      </div>
    </div>
  );
};

const s = {
  overlay: {
    position       : 'fixed',
    top            : 0,
    left           : 0,
    right          : 0,
    bottom         : 0,
    background     : 'rgba(0,0,0,0.7)',
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    zIndex         : 100,
  },
  countBox: {
    width          : '160px',
    height         : '160px',
    borderRadius   : '50%',
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    border         : '4px solid var(--accent)',
    boxShadow      : '0 0 40px rgba(249,115,22,0.4)',
  },
  count: {
    fontSize       : '72px',
    fontWeight     : 800,
    lineHeight     : 1,
  },
};

export default CountDown;