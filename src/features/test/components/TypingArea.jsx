import { useCallback, useEffect, useRef, useState } from 'react';

const TypingArea = ({
  paragraph,
  onProgress,
  onComplete,
  isActive,
  isFinished,
}) => {
  const [charStates, setCharStates] = useState([]);
  const [cursorPos, setCursorPos] = useState(0);
  const charRefs = useRef([]);
  const typedRef = useRef('');

  // Reset typing state whenever a new paragraph arrives (render-time reset)
  const [prevParagraph, setPrevParagraph] = useState(paragraph);
  if (paragraph !== prevParagraph) {
    setPrevParagraph(paragraph);
    setCharStates((paragraph || '').split('').map(() => 'untyped'));
    setCursorPos(0);
  }

  // Reset refs (allowed in effects only)
  useEffect(() => {
    typedRef.current = '';
    charRefs.current = [];
  }, [paragraph]);

  // Shared logic: apply the next typed value, update stats + completion.
  // Called by both keystroke capture and backspace handling.
  const processInput = useCallback((newTyped) => {
    if (!isActive || isFinished || !paragraph) return;

    const newStates = paragraph.split('').map((char, i) => {
      if (i >= newTyped.length) return 'untyped';
      return newTyped[i] === char ? 'correct' : 'wrong';
    });

    const charErrors = [];
    paragraph.split('').forEach((char, i) => {
      if (i < newTyped.length && newTyped[i] !== char) {
        charErrors.push({
          expected: char,
          typed   : newTyped[i],
          position: i,
        });
      }
    });

    typedRef.current = newTyped;
    setCharStates(newStates);
    setCursorPos(newTyped.length);

    // Calculate stats
    const correctChars = newStates.filter(s => s === 'correct').length;
    const wrongChars   = newStates.filter(s => s === 'wrong').length;
    const totalTyped   = newTyped.length;
    const accuracy     = totalTyped > 0
      ? Math.round((correctChars / totalTyped) * 100)
      : 100;

    onProgress({ correctChars, wrongChars, accuracy, totalTyped, charErrors });

    // Check if paragraph complete
    if (newTyped.length >= paragraph.length) {
      onComplete({ typed: newTyped, charStates: newStates, charErrors });
    }
  }, [paragraph, isActive, isFinished, onProgress, onComplete]);

  // Capture keystrokes from the window — no focused <input> means the OS
  // never shows its text-suggestion bar (that's how Monkeytype/keybr work).
  useEffect(() => {
    if (!isActive || isFinished || !paragraph) return;

    const handleKeyDown = (e) => {
      // Ignore typing happening inside real form fields
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      // Tab / Escape are handled by the parent (Test.jsx)
      if (e.key === 'Tab' || e.key === 'Escape') return;

      // Ignore shortcuts (Ctrl/Cmd/Alt combos)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        processInput(typedRef.current.slice(0, -1));
        return;
      }

      // Only printable single characters (letters, digits, punct, space)
      if (e.key.length === 1) {
        e.preventDefault();
        processInput(typedRef.current + e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, isFinished, paragraph, processInput]);

  if (!paragraph) return null;

  const chars = paragraph.split('');

  return (
    <div style={s.wrapper}>
      <div style={s.paragraphWrap}>
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
                  color: state === 'correct' ? 'var(--text-primary)'
                    : state === 'wrong' ? '#dc2626'
                      : 'var(--char-untyped)',

                  background: state === 'wrong' ? 'rgba(220,38,38,0.12)' : 'transparent',

                  borderBottom: state === 'wrong' ? '2px solid #dc2626' : 'none',

                  borderLeft: isCursor && isActive && !isFinished
                    ? '2px solid var(--accent)'
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

        {/* Press-any-key hint shown before the test starts */}
        {!isFinished && cursorPos === 0 && isActive && (
          <div style={s.focusHint}>
            Press any key to start
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
  paragraphWrap: {
    position : 'relative',
    cursor   : 'text',
    userSelect: 'none',
  },
  paragraph: {
    fontFamily: "'Courier New', Courier, monospace",
    fontSize  : 'clamp(16px, 2.4vw, 20px)',
    lineHeight: '1.9',
    letterSpacing: '0.03em',
    color    : 'var(--text-muted)',
    wordBreak: 'break-word',
    minHeight: '120px',
  },
  char: {
    display   : 'inline',
    transition: 'color 0.1s',
    borderRadius: '2px',
    padding   : '0 1px',
  },
  endCursor: {
    display   : 'inline',
    color     : 'var(--accent)',
    fontWeight: 300,
    animation : 'blink 1s step-end infinite',
  },
  focusHint: {
    position     : 'absolute',
    top          : '50%',
    left         : '50%',
    transform    : 'translate(-50%, -50%)',
    background   : 'var(--card-bg)',
    border       : '1px solid var(--border-color)',
    borderRadius : '8px',
    padding      : '8px 16px',
    fontSize     : 'clamp(12px, 2vw, 14px)',
    color        : 'var(--text-secondary)',
    pointerEvents: 'none',
    whiteSpace   : 'nowrap',
    boxShadow    : 'var(--shadow)',
  },
};

export default TypingArea;