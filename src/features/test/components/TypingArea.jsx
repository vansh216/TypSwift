import { useEffect, useRef, useState } from 'react';

const TypingArea = ({
  paragraph,
  onProgress,
  onComplete,
  isActive,
  isFinished,
}) => {
  const [typed,       setTyped]       = useState('');
  const [charStates,  setCharStates]  = useState([]);
  const [cursorPos,   setCursorPos]   = useState(0);
  const inputRef                      = useRef(null);
  const charRefs                      = useRef([]);

  // Focus input when test becomes active
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  // Build char states whenever paragraph changes
  useEffect(() => {
    if (!paragraph) return;
    setCharStates(paragraph.split('').map(() => 'untyped'));
    setTyped('');
    setCursorPos(0);
    charRefs.current = [];
  }, [paragraph]);

  const handleKeyDown = (e) => {
    if (!isActive || isFinished) return;

    // Tab = restart (handled in parent)
    if (e.key === 'Tab') {
      e.preventDefault();
      return;
    }
  };

  const handleInput = (e) => {
    if (!isActive || isFinished || !paragraph) return;

    const value      = e.target.value;
    const newTyped   = value;
    const newStates  = paragraph.split('').map((char, i) => {
      if (i >= newTyped.length) return 'untyped';
      return newTyped[i] === char ? 'correct' : 'wrong';
    });

    setTyped(newTyped);
    setCharStates(newStates);
    setCursorPos(newTyped.length);

    // Calculate stats
    const correctChars = newStates.filter(s => s === 'correct').length;
    const wrongChars   = newStates.filter(s => s === 'wrong').length;
    const totalTyped   = newTyped.length;
    const accuracy     = totalTyped > 0
      ? Math.round((correctChars / totalTyped) * 100)
      : 100;

    onProgress({ correctChars, wrongChars, accuracy, totalTyped });

    // Check if paragraph complete
    if (newTyped.length >= paragraph.length) {
      onComplete({ typed: newTyped, charStates: newStates });
    }
  };

  if (!paragraph) return null;

  const chars = paragraph.split('');

  // Get cursor position on screen
  const getCursorStyle = () => {
    const ref = charRefs.current[cursorPos];
    if (!ref) return {};
    const rect      = ref.getBoundingClientRect();
    const parentRect = ref.parentElement?.getBoundingClientRect();
    return {
      left: ref.offsetLeft,
      top : ref.offsetTop,
    };
  };

  return (
    <div style={s.wrapper}>

      {/* Hidden input captures all keystrokes */}
      <input
        ref={inputRef}
        value={typed}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        style={s.hiddenInput}
        disabled={!isActive || isFinished}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        aria-label="Typing input"
      />

      {/* Paragraph display */}
      <div
        style={s.paragraphWrap}
        onClick={() => inputRef.current?.focus()}
      >
        <div style={s.paragraph} id="paragraph-container">
          {chars.map((char, i) => {
            const state = charStates[i] || 'untyped';
            const isCursor = i === cursorPos;

            return (
              <span
                key={i}
                ref={el => charRefs.current[i] = el}
                style={{
                  ...s.char,
                  color     : state === 'correct' ? 'var(--text-primary)'
                            : state === 'wrong'   ? '#dc2626'
                            : 'var(--text-muted)',
                  background: state === 'wrong'   ? '#fee2e2'   : 'transparent',
                  borderBottom: state === 'wrong' ? '2px solid #dc2626' : 'none',
                  borderLeft  : isCursor && isActive && !isFinished
                    ? '2px solid var(--accent)'
                    : 'none',
                  animation: isCursor && isActive && !isFinished
                    ? 'none'
                    : 'none',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}

          {/* Cursor at end of paragraph */}
          {cursorPos >= chars.length && isActive && !isFinished && (
            <span style={s.endCursor}>|</span>
          )}
        </div>

        {/* Click to focus hint */}
        {!isActive && !isFinished && (
          <div style={s.focusHint}>
            Click here or press any key to start
          </div>
        )}
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
    position  : 'absolute',
    opacity   : 0,
    width     : '1px',
    height    : '1px',
    overflow  : 'hidden',
    pointerEvents: 'none',
  },
  paragraphWrap: {
    position    : 'relative',
    cursor      : 'text',
    userSelect  : 'none',
  },
  paragraph: {
    fontFamily  : "'Courier New', Courier, monospace",
    fontSize    : '20px',
    lineHeight  : '2',
    letterSpacing: '0.03em',
    color       : 'var(--text-muted)',
    wordBreak   : 'break-word',
    minHeight   : '120px',
  },
  char: {
    display    : 'inline',
    transition : 'color 0.1s',
    borderRadius: '2px',
    padding    : '0 1px',
  },
  endCursor: {
    display   : 'inline',
    color     : 'var(--accent)',
    fontWeight: 300,
    animation : 'blink 1s step-end infinite',
  },
  focusHint: {
    position      : 'absolute',
    top           : '50%',
    left          : '50%',
    transform     : 'translate(-50%, -50%)',
    background    : 'var(--card-bg)',
    border        : '1px solid var(--border-color)',
    borderRadius  : '8px',
    padding       : '8px 16px',
    fontSize      : '13px',
    color         : 'var(--text-muted)',
    pointerEvents : 'none',
    whiteSpace    : 'nowrap',
    boxShadow     : 'var(--shadow)',
  },
};

export default TypingArea;