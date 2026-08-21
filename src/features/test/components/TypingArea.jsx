import { useCallback, useEffect, useRef, useState } from 'react';

const TypingArea = ({
  paragraph,
  onProgress,
  onComplete,
  isActive,
  isFinished,
}) => {
  const [charStates, setCharStates] = useState([]);
  const [cursorPos,  setCursorPos]  = useState(0);
  const charRefs  = useRef([]);
  const typedRef  = useRef('');
  const scrollRef = useRef(null);
  const inputRef  = useRef(null);

  // ── Detect mobile ──
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  // Reset typing state whenever a new paragraph arrives
  const [prevParagraph, setPrevParagraph] = useState(paragraph);
  if (paragraph !== prevParagraph) {
    setPrevParagraph(paragraph);
    setCharStates((paragraph || '').split('').map(() => 'untyped'));
    setCursorPos(0);
  }

  // Reset refs on paragraph change
  useEffect(() => {
    typedRef.current = '';
    charRefs.current = [];
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    if (inputRef.current)  inputRef.current.value      = '';
  }, [paragraph]);

  // Core processing function
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

    const correctChars = newStates.filter(s => s === 'correct').length;
    const wrongChars   = newStates.filter(s => s === 'wrong').length;
    const totalTyped   = newTyped.length;
    const accuracy     = totalTyped > 0
      ? Math.round((correctChars / totalTyped) * 100)
      : 100;

    onProgress({ correctChars, wrongChars, accuracy, totalTyped, charErrors });

    if (newTyped.length >= paragraph.length) {
      onComplete({ typed: newTyped, charStates: newStates, charErrors });
    }
  }, [paragraph, isActive, isFinished, onProgress, onComplete]);

  // ── Desktop keyboard listener ──
  useEffect(() => {
    if (!isActive || isFinished || !paragraph) return;
    if (isMobile) return; // skip on mobile

    const handleKeyDown = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'Tab' || e.key === 'Escape') return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        processInput(typedRef.current.slice(0, -1));
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        processInput(typedRef.current + e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, isFinished, paragraph, processInput, isMobile]);

  // ── Mobile input handler ──
  const handleMobileInput = useCallback((e) => {
    if (!isActive || isFinished || !paragraph) return;
    processInput(e.target.value);
  }, [isActive, isFinished, paragraph, processInput]);

  // ── Auto focus hidden input on mobile when active ──
  useEffect(() => {
    if (isMobile && isActive && !isFinished && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobile, isActive, isFinished]);

  // ── Auto scroll cursor into view ──
  useEffect(() => {
    const box = scrollRef.current;
    if (!box || !isActive || isFinished || !paragraph) return;
    const chars = paragraph.split('');

    if (cursorPos >= chars.length) {
      box.scrollTop = box.scrollHeight;
      return;
    }

    const charEl = charRefs.current[cursorPos];
    if (!charEl) return;

    const boxTop    = box.getBoundingClientRect().top;
    const charTop   = charEl.getBoundingClientRect().top;
    const boxHeight = box.clientHeight;

    if (charTop < boxTop) {
      box.scrollTop -= (boxTop - charTop) - boxHeight * 0.35;
    } else if (charTop > boxTop + boxHeight - charEl.offsetHeight) {
      box.scrollTop += (charTop - (boxTop + boxHeight)) + charEl.offsetHeight + boxHeight * 0.35;
    }
  }, [cursorPos, isActive, isFinished, paragraph]);

  if (!paragraph) return null;

  const chars = paragraph.split('');

  return (
    <div style={s.wrapper}>

      {/* ── Hidden input for mobile keyboard ── */}
      {isMobile && (
        <input
          ref={inputRef}
          onChange={handleMobileInput}
          style={s.hiddenInput}
          disabled={!isActive || isFinished}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          aria-label="Typing input"
        />
      )}

      <div style={s.paragraphWrap}>
        <div ref={scrollRef} style={s.scrollBox}>
          <div
            style={s.paragraph}
            id="paragraph-container"
            onClick={() => {
              if (isMobile && inputRef.current) {
                inputRef.current.focus();
              }
            }}
          >
            {chars.map((char, i) => {
              const state    = charStates[i] || 'untyped';
              const isCursor = i === cursorPos;

              return (
                <span
                  key={i}
                  ref={el => charRefs.current[i] = el}
                  style={{
                    ...s.char,
                    color       : state === 'correct' ? 'var(--text-primary)'
                                : state === 'wrong'   ? '#dc2626'
                                : 'var(--char-untyped)',
                    background  : state === 'wrong'   ? 'rgba(220,38,38,0.12)' : 'transparent',
                    borderBottom: state === 'wrong'   ? '2px solid #dc2626'    : 'none',
                    borderLeft  : isCursor && isActive && !isFinished
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
        </div>

        {/* Hint text */}
        {!isFinished && cursorPos === 0 && isActive && (
          <div style={s.focusHint}>
            {isMobile ? '👆 Tap here to start typing' : 'Press any key to start'}
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
    position     : 'absolute',
    opacity      : 0,
    width        : '1px',
    height       : '1px',
    top          : 0,
    left         : 0,
    border       : 'none',
    padding      : 0,
    margin       : 0,
    overflow     : 'hidden',
    pointerEvents: 'none',
  },
  paragraphWrap: {
    position  : 'relative',
    cursor    : 'text',
    userSelect: 'none',
  },
  scrollBox: {
    maxHeight         : 'clamp(150px, 30vh, 280px)',
    overflowY         : 'auto',
    overscrollBehavior: 'contain',
    scrollbarWidth    : 'thin',
    scrollbarColor    : 'var(--border-color) transparent',
  },
  paragraph: {
    fontFamily   : "'Courier New', Courier, monospace",
    fontSize     : 'clamp(16px, 2.4vw, 20px)',
    lineHeight   : '1.9',
    letterSpacing: '0.03em',
    color        : 'var(--text-muted)',
    wordBreak    : 'break-word',
    minHeight    : '120px',
  },
  char: {
    display     : 'inline',
    transition  : 'color 0.1s',
    borderRadius: '2px',
    padding     : '0 1px',
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