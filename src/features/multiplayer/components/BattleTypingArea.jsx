import { useEffect, useRef, useState } from 'react';

const BattleTypingArea = ({ paragraph, onProgress, onComplete, isActive }) => {
  const [typed,      setTyped]      = useState('');
  const [charStates, setCharStates] = useState([]);
  const [cursorPos,  setCursorPos]  = useState(0);
  const inputRef                    = useRef(null);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  useEffect(() => {
    if (!paragraph) return;
    setCharStates(paragraph.split('').map(() => 'untyped'));
    setTyped('');
    setCursorPos(0);
  }, [paragraph]);

  const handleInput = (e) => {
    if (!isActive || !paragraph) return;

    const value     = e.target.value;
    const newStates = paragraph.split('').map((char, i) => {
      if (i >= value.length) return 'untyped';
      return value[i] === char ? 'correct' : 'wrong';
    });

    setTyped(value);
    setCharStates(newStates);
    setCursorPos(value.length);

    const correctChars = newStates.filter(s => s === 'correct').length;
    const totalTyped   = value.length;
    const accuracy     = totalTyped > 0
      ? Math.round((correctChars / totalTyped) * 100)
      : 100;
    const progress     = Math.round((totalTyped / paragraph.length) * 100);

    onProgress({ correctChars, accuracy, progress, totalTyped });

    if (value.length >= paragraph.length) {
      onComplete({ accuracy, correctChars });
    }
  };

  if (!paragraph) return null;

  const chars = paragraph.split('');

  return (
    <div style={s.wrapper}>
      <input
        ref={inputRef}
        value={typed}
        onChange={handleInput}
        style={s.hiddenInput}
        disabled={!isActive}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      <div
        style={s.paragraphWrap}
        onClick={() => inputRef.current?.focus()}
      >
        <div style={s.paragraph}>
          {chars.map((char, i) => {
            const state    = charStates[i] || 'untyped';
            const isCursor = i === cursorPos;

            return (
              <span
                key={i}
                style={{
                  ...s.char,
                  color      : state === 'correct' ? 'var(--text-primary)'
                             : state === 'wrong'   ? '#dc2626'
                             : 'var(--char-untyped)',
                  background : state === 'wrong'   ? 'rgba(220,38,38,0.12)' : 'transparent',
                  borderBottom: state === 'wrong'  ? '2px solid #dc2626' : 'none',
                  borderLeft  : isCursor && isActive ? '2px solid var(--accent)' : 'none',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const s = {
  wrapper: {
    position: 'relative',
    width   : '100%',
  },
  hiddenInput: {
    position     : 'absolute',
    opacity      : 0,
    width        : '1px',
    height       : '1px',
    overflow     : 'hidden',
    pointerEvents: 'none',
  },
  paragraphWrap: {
    cursor    : 'text',
    userSelect: 'none',
  },
  paragraph: {
    fontFamily   : "'Courier New', Courier, monospace",
    fontSize     : '18px',
    lineHeight   : '2',
    letterSpacing: '0.03em',
    color        : 'var(--text-muted)',
    wordBreak    : 'break-word',
  },
  char: {
    display     : 'inline',
    transition  : 'color 0.1s',
    borderRadius: '2px',
    padding     : '0 1px',
  },
};

export default BattleTypingArea;