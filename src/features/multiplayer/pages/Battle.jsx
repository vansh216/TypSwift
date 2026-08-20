import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation }                 from 'react-router-dom';
import { useSocket }                                from '../context/SocketContext';
import { useAuth }                                  from '../../../shared/context/AuthContext';
import CountDown                                    from '../components/CountDown';
import ProgressBars                                 from '../components/ProgressBars';
import TypingArea                             from '../../test/components/TypingArea';
import BattleResult                                 from '../components/BattleResult';

const Battle = () => {
  const navigate              = useNavigate();
  const location              = useLocation();
  const { socket }            = useSocket();
  const { user }              = useAuth();

  const {
    roomCode,
    timeLimit,
    paragraph : initialParagraph,
    players   : initialPlayers,
  } = location.state || {};

  // ── State ──
  const [phase,      setPhase]      = useState('countdown'); // countdown | playing | finished
  const [countdown,  setCountdown]  = useState(3);
  const [players,    setPlayers]    = useState(initialPlayers || []);
  const [timeLeft,   setTimeLeft]   = useState(timeLimit || 60);
  const [wpm,        setWpm]        = useState(0);
  const [accuracy,   setAccuracy]   = useState(100);
  const [results,    setResults]    = useState(null);
  const [paragraph,  setParagraph]  = useState(initialParagraph?.content || '');

  // ── Refs ──
  const startTimeRef    = useRef(null);
  const correctCharsRef = useRef(0);
  const progressInterval = useRef(null);

  // Redirect if no room
  useEffect(() => {
    if (!roomCode) navigate('/multiplayer');
  }, [roomCode, navigate]);

  useEffect(() => {
    if (!socket) return;

    // ── Countdown ──
    socket.on('game-countdown', (data) => {
      setCountdown(data.count);
      if (data.count === 0 || data.count === 'Go!') {
        setTimeout(() => setPhase('playing'), 500);
      }
    });

    // ── Time update ──
    socket.on('time-update', (data) => {
      setTimeLeft(data.timeLeft);
    });

    // ── All players progress ──
    socket.on('all-progress', (data) => {
      setPlayers(data.players);
    });

    // ── Game over ──
    socket.on('game-over', (data) => {
      clearInterval(progressInterval.current);
      setPhase('finished');
      setResults(data.results);
    });

    return () => {
      socket.off('game-countdown');
      socket.off('time-update');
      socket.off('all-progress');
      socket.off('game-over');
      clearInterval(progressInterval.current);
    };
  }, [socket]);

  // ── Start sending progress when playing ──
  useEffect(() => {
    if (phase === 'playing') {
      startTimeRef.current = Date.now();
    }
  }, [phase]);

  const handleProgress = useCallback(({ correctChars, accuracy, progress }) => {
    correctCharsRef.current = correctChars;
    setAccuracy(accuracy);

    // Calculate WPM
    if (startTimeRef.current) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
      const liveWpm = elapsed > 0.05
        ? Math.round((correctChars / 5) / elapsed)
        : 0;
      setWpm(liveWpm);

      // Send progress to server every 500ms via interval
      if (socket && roomCode) {
        socket.emit('progress-update', {
          roomCode,
          progress,
          wpm     : liveWpm,
          accuracy,
        });
      }
    }
  }, [socket, roomCode]);

  const handleComplete = useCallback(({ accuracy }) => {
    if (!socket || !roomCode) return;
    clearInterval(progressInterval.current);

    const elapsed  = (Date.now() - startTimeRef.current) / 1000 / 60;
    const finalWpm = elapsed > 0
      ? Math.round((correctCharsRef.current / 5) / elapsed)
      : 0;

    socket.emit('player-finished', {
      roomCode,
      wpm     : finalWpm,
      accuracy,
    });
  }, [socket, roomCode]);

  const handlePlayAgain = () => {
    navigate('/multiplayer/waiting', {
      state: {
        roomCode,
        isHost: false,
      },
    });
  };

  // Format time
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div style={s.page}>

      {/* ── Countdown overlay ── */}
      {phase === 'countdown' && (
        <CountDown count={countdown} />
      )}

      {/* ── Results overlay ── */}
      {phase === 'finished' && results && (
        <div style={s.resultsWrap}>
          <BattleResult
            results={results}
            roomCode={roomCode}
            onPlayAgain={handlePlayAgain}
          />
        </div>
      )}

      {/* ── Battle UI ── */}
      <div style={s.card}>

        {/* ── Top bar ── */}
        <div style={s.topBar}>
          <div style={s.wpmBox}>
            <span style={s.wpmValue}>{wpm}</span>
            <span style={s.wpmLabel}>wpm</span>
          </div>

          <div style={{
            ...s.timer,
            color: timeLeft <= 10 ? '#dc2626' : 'var(--text-primary)',
          }}>
            {timeDisplay}
          </div>

          <div style={s.accBox}>
            <span style={s.accValue}>{accuracy}%</span>
            <span style={s.accLabel}>acc</span>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={s.divider} />

        {/* ── Progress bars ── */}
        <ProgressBars
          players={players}
          currentUserId={user?.id}
        />

        {/* ── Divider ── */}
        <div style={s.divider} />

        {/* ── Typing area ── */}
       <TypingArea
  paragraph={paragraph}
  onProgress={handleProgress}
  onComplete={handleComplete}
  isActive={phase === 'playing'}
  isFinished={phase === 'finished'}
/>

        {/* ── Footer ── */}
        <div style={s.footer}>
          <span style={s.footerHint}>
            {phase === 'countdown' && '⏳ Get ready...'}
            {phase === 'playing'   && '⌨️ Type the paragraph above'}
            {phase === 'finished'  && '🏁 Battle complete!'}
          </span>
        </div>

      </div>

    </div>
  );
};

const s = {
  page: {
    maxWidth     : '900px',
    margin       : '0 auto',
    padding      : '2rem 1rem',
  },
  resultsWrap: {
    position     : 'fixed',
    top          : 0,
    left         : 0,
    right        : 0,
    bottom       : 0,
    background   : 'rgba(0,0,0,0.8)',
    display      : 'flex',
    alignItems   : 'center',
    justifyContent: 'center',
    zIndex       : 99,
    padding      : '1rem',
    overflowY    : 'auto',
  },
  card: {
    background   : 'var(--card-bg)',
    border       : '1px solid var(--border-color)',
    borderRadius : '16px',
    padding      : 'clamp(1rem, 4vw, 2rem)',
    boxShadow    : 'var(--shadow)',
    display      : 'flex',
    flexDirection: 'column',
    gap          : '1rem',
  },
  topBar: {
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'space-between',
  },
  wpmBox: {
    display      : 'flex',
    alignItems   : 'baseline',
    gap          : '4px',
  },
  wpmValue: {
    fontSize     : '28px',
    fontWeight   : 700,
    color        : 'var(--accent)',
  },
  wpmLabel: {
    fontSize     : '13px',
    color        : 'var(--text-muted)',
  },
  timer: {
    fontSize     : '32px',
    fontWeight   : 700,
    fontVariantNumeric: 'tabular-nums',
    transition   : 'color 0.3s',
  },
  accBox: {
    display      : 'flex',
    alignItems   : 'baseline',
    gap          : '4px',
  },
  accValue: {
    fontSize     : '28px',
    fontWeight   : 700,
    color        : 'var(--text-primary)',
  },
  accLabel: {
    fontSize     : '13px',
    color        : 'var(--text-muted)',
  },
  divider: {
    height       : '1px',
    background   : 'var(--border-color)',
  },
  footer: {
    textAlign    : 'center',
  },
  footerHint: {
    fontSize     : '13px',
    color        : 'var(--text-muted)',
  },
};

export default Battle;