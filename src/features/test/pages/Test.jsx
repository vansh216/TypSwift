import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth }                  from '../../../shared/context/AuthContext.jsx';
import { fetchParagraph, submitTest } from '../api/test.api.jsx';
import ModeSelector                 from '../components/ModeSelector.jsx';
import Timer                        from '../components/Timer.jsx';
import WpmCounter                   from '../components/WpmCounter.jsx';
import TypingArea                   from '../components/TypingArea.jsx';




// Inline Result (guest users)
const InlineResult = ({ result, onRestart, onLogin }) => {
  const accuracyColor =
    result.accuracy >= 95 ? '#16a34a' :
    result.accuracy >= 85 ? '#ca8a04' :
    '#dc2626';

  return (
    <div style={r.wrapper}>

      {/* Stats */}
      <div style={r.statsGrid}>
        {[
          { label: 'WPM',      value: result.wpm,             color: 'var(--accent)'       },
          { label: 'Accuracy', value: `${result.accuracy}%`,  color: accuracyColor          },
          { label: 'Time',     value: `${result.duration / 60}m`, color: 'var(--text-primary)' },
          { label: 'Errors',   value: result.errors,          color: result.errors > 0 ? '#dc2626' : '#16a34a' },
        ].map((stat, i) => (
          <div key={i} style={r.statBox}>
            <span style={{ ...r.statValue, color: stat.color }}>
              {stat.value}
            </span>
            <span style={r.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Performance tag */}
      <div style={r.tagRow}>
        {result.wpm >= 100 && <span style={{ ...r.tag, background: '#dcfce7', color: '#15803d' }}>🚀 Speed Demon</span>}
        {result.accuracy >= 98 && <span style={{ ...r.tag, background: '#dbeafe', color: '#1d4ed8' }}>🎯 Sharpshooter</span>}
        {result.errors === 0 && <span style={{ ...r.tag, background: '#fef9c3', color: '#854d0e' }}>✨ Perfect Run</span>}
        {result.wpm >= 60 && result.wpm < 100 && <span style={{ ...r.tag, background: '#fff7ed', color: '#c2410c' }}>🔥 Getting Faster</span>}
        {result.wpm < 60 && <span style={{ ...r.tag, background: '#f3f4f6', color: '#6b7280' }}>💪 Keep Practicing</span>}
      </div>

      {/* Guest login banner */}
      <div style={r.loginBanner}>
        <div style={r.bannerLeft}>
          <span style={r.bannerIcon}>🔒</span>
          <div>
            <p style={r.bannerTitle}>Your score was not saved</p>
            <p style={r.bannerSubtitle}>Login to save scores and track your progress</p>
          </div>
        </div>
        <button onClick={onLogin} style={r.loginBtn}>
          Login / Register
        </button>
      </div>

      {/* Actions */}
      <div style={r.actions}>
        <button onClick={onRestart} style={r.restartBtn}>
          Try Again ↺
        </button>
      </div>

    </div>
  );
};

const r = {
  wrapper: {
    display      : 'flex',
    flexDirection: 'column',
    gap          : '1.5rem',
    padding      : '1.5rem',
    background   : 'var(--card-bg)',
    border       : '1px solid var(--border-color)',
    borderRadius : '16px',
    boxShadow    : 'var(--shadow)',
  },
  statsGrid: {
    display            : 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap                : '1rem',
  },
  statBox: {
    display       : 'flex',
    flexDirection : 'column',
    alignItems    : 'center',
    gap           : '6px',
    padding       : '1rem',
    background    : 'var(--bg-secondary)',
    borderRadius  : '12px',
    border        : '1px solid var(--border-color)',
  },
  statValue: {
    fontSize  : '28px',
    fontWeight: 700,
    lineHeight: 1,
  },
  statLabel: {
    fontSize     : '11px',
    color        : 'var(--text-muted)',
    fontWeight   : 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tagRow: {
    display : 'flex',
    flexWrap: 'wrap',
    gap     : '8px',
  },
  tag: {
    padding      : '4px 12px',
    borderRadius : '999px',
    fontSize     : '12px',
    fontWeight   : 600,
  },
  loginBanner: {
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'space-between',
    flexWrap       : 'wrap',
    gap            : '12px',
    padding        : '1rem 1.25rem',
    background     : 'var(--accent-light)',
    border         : '1px solid var(--accent-border)',
    borderRadius   : '10px',
  },
  bannerLeft: {
    display   : 'flex',
    alignItems: 'center',
    gap       : '12px',
  },
  bannerIcon: {
    fontSize: '24px',
  },
  bannerTitle: {
    fontSize  : '14px',
    fontWeight: 600,
    color     : 'var(--text-primary)',
  },
  bannerSubtitle: {
    fontSize: '12px',
    color   : 'var(--text-secondary)',
  },
  loginBtn: {
    padding      : '8px 20px',
    borderRadius : '8px',
    border       : 'none',
    background   : 'var(--accent)',
    color        : '#fff',
    fontSize     : '13px',
    fontWeight   : 600,
    cursor       : 'pointer',
    whiteSpace   : 'nowrap',
    transition   : 'background 0.2s',
  },
  actions: {
    display       : 'flex',
    justifyContent: 'center',
  },
  restartBtn: {
    padding      : '10px 32px',
    borderRadius : '8px',
    border       : '1px solid var(--border-color)',
    background   : 'transparent',
    color        : 'var(--text-secondary)',
    fontSize     : '14px',
    fontWeight   : 500,
    cursor       : 'pointer',
    transition   : 'all 0.2s',
  },
};


// Main Test Component
const Test = () => {
  const { isLoggedIn }  = useAuth();
  const navigate        = useNavigate();
  const location        = useLocation();

  // ── Duration from home page navigation ──
  const initialDuration = location.state?.duration || 1;

  // ── State ──
  const [selectedMode,    setSelectedMode]    = useState(initialDuration);
  const [customMinutes,   setCustomMinutes]   = useState('');
  const [customError,     setCustomError]     = useState('');
  const [paragraph,       setParagraph]       = useState(null);
  const [paragraphId,     setParagraphId]     = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState('');

  // ── Test state ──
  const [testState,   setTestState]   = useState('idle');
  // idle | running | finished

  const [seconds,     setSeconds]     = useState(initialDuration * 60);
  const [totalSeconds, setTotalSeconds] = useState(initialDuration * 60);
  const [wpm,         setWpm]         = useState(0);
  const [accuracy,    setAccuracy]    = useState(100);
  const [errors,      setErrors]      = useState(0);
  const [wpmHistory,  setWpmHistory]  = useState([]);
  const [inlineResult, setInlineResult] = useState(null);

  // ── Refs ──
  const timerRef        = useRef(null);
  const wpmIntervalRef  = useRef(null);
  const startTimeRef    = useRef(null);
  const correctCharsRef = useRef(0);
  const errorsRef       = useRef(0);
  const wpmHistoryRef   = useRef([]);
  const charErrorsRef   = useRef([]);

  // Load paragraph on mount and mode change
 const [difficulty, setDifficulty] = useState('medium');
 
  useEffect(() => {
    loadParagraph(difficulty);
  }, [selectedMode,difficulty]);

  // Keyboard shortcuts

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        handleRestart();
      }
      if (e.key === 'Escape') {
        handleStop();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [testState]);

  // Cleanup on unmount

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(wpmIntervalRef.current);
    };
  }, []);

  const loadParagraph = async (diff=difficulty) => {
    try {
      setLoading(true);
      setError('');
      const duration = selectedMode === 0
        ? parseInt(customMinutes) || 1
        : selectedMode;
        console.log(difficulty)

      const res = await fetchParagraph({difficulty:diff ,duration });
      setParagraph(res.paragraph.content);
      setParagraphId(res.paragraph._id);
      resetTestState(duration * 60);
    } catch (err) {
      setError('Failed to load paragraph. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetTestState = (durationInSeconds) => {
    clearInterval(timerRef.current);
    clearInterval(wpmIntervalRef.current);
    setTestState('idle');
    setSeconds(durationInSeconds);
    setTotalSeconds(durationInSeconds);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setWpmHistory([]);
    setInlineResult(null);
    correctCharsRef.current = 0;
    errorsRef.current       = 0;
    wpmHistoryRef.current   = [];
    startTimeRef.current    = null;
  };

  // Start test — called on first keystroke

  const startTest = useCallback(() => {
    if (testState !== 'idle') return;
    setTestState('running');
    startTimeRef.current = Date.now();

    // ── Countdown timer ──
    timerRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // ── WPM history recorder every second ──
    wpmIntervalRef.current = setInterval(() => {
      const elapsed  = (Date.now() - startTimeRef.current) / 1000 / 60;
      const liveWpm  = elapsed > 0
        ? Math.round((correctCharsRef.current / 5) / elapsed)
        : 0;
      wpmHistoryRef.current.push(liveWpm);
      setWpmHistory([...wpmHistoryRef.current]);
      setWpm(liveWpm);
    }, 1000);
  }, [testState]);


  // AFTER — add charErrors parameter and one line
const handleProgress = useCallback(({ correctChars, wrongChars, accuracy, totalTyped, charErrors }) => {
    if (testState === 'idle') startTest();

    correctCharsRef.current = correctChars;
    errorsRef.current       = wrongChars;
    charErrorsRef.current   = charErrors || [];  // ← ADD THIS LINE

    if (startTimeRef.current) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
      const liveWpm = elapsed > 0.05
        ? Math.round((correctChars / 5) / elapsed)
        : 0;
      setWpm(liveWpm);
    }

    setAccuracy(accuracy);
    setErrors(wrongChars);
  }, [testState, startTest]);
  // When paragraph is fully typed

  const handleComplete = useCallback(async ({ typed, charStates }) => {
    clearInterval(timerRef.current);
    clearInterval(wpmIntervalRef.current);
    setTestState('finished');

    const elapsed    = (Date.now() - startTimeRef.current) / 1000;
    const minutes    = elapsed / 60;
    const finalWpm   = Math.round((correctCharsRef.current / 5) / minutes);
    const finalAcc   = accuracy;
    const finalErrors = errorsRef.current;
    const finalHistory = [...wpmHistoryRef.current, finalWpm];

    const resultData = {
      wpm        : finalWpm,
      accuracy   : finalAcc,
      duration   : Math.round(elapsed),
      errors     : finalErrors,
      wpmHistory : finalHistory,
      paragraphId,
    };

    if (isLoggedIn) {
      try {
        await submitTest(resultData);
        navigate('/results', { state: { result: resultData ,
            charErrors: charErrorsRef.current,
          }
         });
      } catch (err) {
        // If submit fails still show results
        navigate('/results', { state: { result: resultData,
            charErrors: charErrorsRef.current, 
          } 
        });
      }
    } else {
      setInlineResult(resultData);
    }
  }, [accuracy, paragraphId, isLoggedIn, navigate]);

  // Timer hits zero
  const handleTimeUp = useCallback(async () => {
    clearInterval(timerRef.current);
    clearInterval(wpmIntervalRef.current);
    setTestState('finished');

    const elapsed    = totalSeconds;
    const minutes    = elapsed / 60;
    const finalWpm   = Math.round((correctCharsRef.current / 5) / minutes);
    const finalAcc   = accuracy;
    const finalErrors = errorsRef.current;
    const finalHistory = [...wpmHistoryRef.current];

    const resultData = {
      wpm        : finalWpm,
      accuracy   : finalAcc,
      duration   : elapsed,
      errors     : finalErrors,
      wpmHistory : finalHistory,
      paragraphId,
    };

    if (isLoggedIn) {
      try {
        await submitTest(resultData);
        navigate('/results', { state: { result: resultData,charErrors: charErrorsRef.current, } });
      } catch (err) {
        navigate('/results', { state: { result: resultData, charErrors: charErrorsRef.current, } });
      }
    } else {
      setInlineResult(resultData);
    }
  }, [accuracy, totalSeconds, paragraphId, isLoggedIn, navigate]);
  // Restart

  const handleRestart = useCallback(() => {
    loadParagraph(difficulty);
  }, [selectedMode, customMinutes]);

  // Stop
  
  const handleStop = useCallback(() => {
    if (testState !== 'running') return;
    clearInterval(timerRef.current);
    clearInterval(wpmIntervalRef.current);
    setTestState('idle');
    resetTestState(totalSeconds);
    loadParagraph();
  }, [testState, totalSeconds]);

  
  // Mode change

  const handleModeChange = (value) => {
    setSelectedMode(value);
    setCustomError('');
    if (value !== 0) {
      resetTestState(value * 60);
    }
  };

  const handleCustomChange = (value) => {
    setCustomMinutes(value);
    const val = parseInt(value);
    if (val && val >= 1) {
      setCustomError('');
      resetTestState(val * 60);
    }
  };

  
  // Difficulty selector
  
 

  const DIFFICULTIES = [
    { label: 'Easy',   value: 'easy'   },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard',   value: 'hard'   },
  ];

  return (
    <div style={s.page}>

      {/* ── Page Title ── */}
      <div style={s.pageHeader}>
        <h1 style={s.pageTitle}>⌨ Typing Test</h1>
        <p style={s.pageSubtitle}>
          Select your time mode and start typing
        </p>
      </div>

      {/* ── Main Card ── */}
      <div style={s.card}>

        {/* ── Top Controls ── */}
        <div style={s.topControls}>

          {/* Mode Selector */}
          <ModeSelector
            selected={selectedMode}
            onChange={handleModeChange}
            customMinutes={customMinutes}
            onCustomChange={handleCustomChange}
            customError={customError}
          />

          {/* Difficulty selector */}
          <div className='flex gap-10' style={s.diffRow}>
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                onClick={() => {
                  setDifficulty(d.value);
                  handleRestart();
                }}
                disabled={testState === 'running'}
                style={{
                  ...s.diffBtn,
                  background : difficulty === d.value ? 'var(--bg-tertiary)' : 'transparent',
                  color      : difficulty === d.value ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight : difficulty === d.value ? 600 : 400,
                  opacity    : testState === 'running' ? 0.5 : 1,
                  cursor     : testState === 'running' ? 'not-allowed' : 'pointer',
                }}
              >
                {d.label}
              </button>
            ))}
          </div>

        </div>

        {/* ── Divider ── */}
        <div style={s.divider} />

        {/* ── Stats Row ── */}
        <div style={s.statsRow}>
          <WpmCounter wpm={wpm} accuracy={accuracy} />
          <Timer
            seconds={seconds}
            isRunning={testState === 'running'}
            onTimeUp={handleTimeUp}
          />
          <div style={s.errorsBox}>
            <span style={{
              ...s.errorsValue,
              color: errors > 0 ? '#dc2626' : 'var(--text-muted)',
            }}>
              {errors}
            </span>
            <span style={s.errorsLabel}>errors</span>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={s.divider} />


        {loading ? (
          <div style={s.centerBox}>
            <div style={s.spinner} />
            <p style={s.loadingText}>Loading paragraph...</p>
          </div>
        ) : error ? (
          <div style={s.errorBox}>
            <p style={s.errorText}>⚠️ {error}</p>
            <button onClick={loadParagraph} style={s.retryBtn}>
              Retry
            </button>
          </div>
        ) : inlineResult ? (

          <InlineResult
            result={inlineResult}
            onRestart={handleRestart}
            onLogin={() => navigate('/login')}
          />
        ) : (
          /* Typing area */
          <TypingArea
            paragraph={paragraph}
            onProgress={handleProgress}
            onComplete={handleComplete}
            isActive={testState === 'running' || testState === 'idle'}
            isFinished={testState === 'finished'}
          />
        )}


        {!inlineResult && <div style={s.divider} />}


        {!inlineResult && (
          <div style={s.shortcuts}>
            <span style={s.shortcut}>
              <kbd style={s.kbd}>Tab</kbd> restart
            </span>
            <span style={s.shortcut}>
              <kbd style={s.kbd}>Esc</kbd> stop
            </span>
            {testState === 'idle' && (
              <span style={s.shortcutHint}>
                Start typing to begin the timer
              </span>
            )}
            {testState === 'running' && (
              <span style={{
                ...s.shortcutHint,
                color: 'var(--accent)',
              }}>
                ● Timer running
              </span>
            )}
          </div>
        )}

      </div>


      {testState === 'idle' && !loading && (
        <div style={s.newParaRow}>
          <button
            onClick={loadParagraph}
            style={s.newParaBtn}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color       = 'var(--accent)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color       = 'var(--text-secondary)';
            }}
          >
            ↻ New Paragraph
          </button>
          <p style={s.newParaHint}>
            Don't like this paragraph? Get a new one.
          </p>
        </div>
      )}

    </div>
  );
};


// Styles — fully responsive
const s = {
  page: {
    maxWidth : '860px',
    margin   : '0 auto',
    padding  : '2rem 1rem',
  },
  pageHeader: {
    textAlign    : 'center',
    marginBottom : '1.5rem',
  },
  pageTitle: {
    fontSize     : '24px',
    fontWeight   : 700,
    color        : 'var(--text-primary)',
    marginBottom : '4px',
  },
  pageSubtitle: {
    fontSize : '13px',
    color    : 'var(--text-secondary)',
  },
  card: {
    background   : 'var(--card-bg)',
    border       : '1px solid var(--border-color)',
    borderRadius : '16px',
    padding      : 'clamp(1rem, 4vw, 2rem)',
    boxShadow    : 'var(--shadow)',
  },
  topControls: {
    display       : 'flex',
    flexDirection : 'column',
    alignItems    : 'center',
    gap           : '1rem',
    marginBottom  : '1rem',
  },
  diffRow: {
    display      : 'flex',
    alignItems   : 'center',
    gap          : '4px',
    background   : 'var(--bg-secondary)',
    border       : '1px solid var(--border-color)',
    borderRadius : '8px',
    padding      : '3px',
  },
  diffBtn: {
    padding      : '5px 14px',
    borderRadius : '6px',
    border       : 'none',
    fontSize     : '12px',
    transition   : 'all 0.2s',
  },
  divider: {
    height    : '1px',
    background: 'var(--border-color)',
    margin    : '1rem 0',
  },
  statsRow: {
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'space-between',
    flexWrap       : 'wrap',
    gap            : '1rem',
  },
  errorsBox: {
    display    : 'flex',
    alignItems : 'baseline',
    gap        : '4px',
  },
  errorsValue: {
    fontSize  : '28px',
    fontWeight: 700,
    lineHeight: 1,
    transition: 'color 0.3s',
  },
  errorsLabel: {
    fontSize : '13px',
    color    : 'var(--text-muted)',
    fontWeight: 500,
  },
  centerBox: {
    display        : 'flex',
    flexDirection  : 'column',
    alignItems     : 'center',
    justifyContent : 'center',
    padding        : '3rem 0',
    gap            : '12px',
  },
  spinner: {
    width       : '32px',
    height      : '32px',
    border      : '3px solid var(--border-color)',
    borderTop   : '3px solid var(--accent)',
    borderRadius: '50%',
    animation   : 'spin 0.8s linear infinite',
  },
  loadingText: {
    fontSize: '14px',
    color   : 'var(--text-secondary)',
  },
  errorBox: {
    display        : 'flex',
    flexDirection  : 'column',
    alignItems     : 'center',
    gap            : '12px',
    padding        : '2rem',
    background     : '#fef2f2',
    border         : '1px solid #fecaca',
    borderRadius   : '10px',
  },
  errorText: {
    fontSize: '14px',
    color   : '#dc2626',
  },
  retryBtn: {
    padding      : '7px 20px',
    borderRadius : '7px',
    border       : '1px solid #dc2626',
    background   : 'transparent',
    color        : '#dc2626',
    fontSize     : '13px',
    cursor       : 'pointer',
  },
  shortcuts: {
    display    : 'flex',
    alignItems : 'center',
    flexWrap   : 'wrap',
    gap        : '1rem',
  },
  shortcut: {
    display   : 'flex',
    alignItems: 'center',
    gap       : '6px',
    fontSize  : '12px',
    color     : 'var(--text-muted)',
  },
  kbd: {
    display      : 'inline-block',
    padding      : '2px 6px',
    borderRadius : '4px',
    border       : '1px solid var(--border-color)',
    background   : 'var(--bg-secondary)',
    fontSize     : '11px',
    fontFamily   : 'monospace',
    color        : 'var(--text-secondary)',
  },
  shortcutHint: {
    fontSize  : '12px',
    color     : 'var(--text-muted)',
    marginLeft: 'auto',
  },
  newParaRow: {
    display       : 'flex',
    alignItems    : 'center',
    justifyContent: 'center',
    flexDirection : 'column',
    gap           : '6px',
    marginTop     : '1rem',
  },
  newParaBtn: {
    padding      : '8px 24px',
    borderRadius : '8px',
    border       : '1px solid var(--border-color)',
    background   : 'transparent',
    color        : 'var(--text-secondary)',
    fontSize     : '13px',
    fontWeight   : 500,
    cursor       : 'pointer',
    transition   : 'all 0.2s',
  },
  newParaHint: {
    fontSize: '12px',
    color   : 'var(--text-muted)',
  },
};

export default Test;