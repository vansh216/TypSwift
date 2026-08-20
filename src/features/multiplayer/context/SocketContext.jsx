import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io }       from 'socket.io-client';
import { useAuth }  from '../../../shared/context/AuthContext.jsx';

const SocketContext = createContext(null);

// Socket Provider
// Creates ONE socket connection for entire app
// Cleans up on logout or unmount
export const SocketProvider = ({ children }) => {
  const { token, isLoggedIn }   = useAuth();
  const [connected, setConnected] = useState(false);
  const socketRef               = useRef(null);

  useEffect(() => {
    // Only connect if logged in
    if (!isLoggedIn || !token) {
      // Disconnect if user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
      return;
    }

    // Already connected — skip
    if (socketRef.current?.connected) return;

    // ── Create socket connection ──
    const socket = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace('/api', ''), {
      auth             : { token },
      transports       : ['websocket', 'polling'],
      reconnection     : true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // ── Event listeners ──
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
      setConnected(false);
    });

    socket.on('reconnect', (attempt) => {
      console.log('Socket reconnected after', attempt, 'attempts');
      setConnected(true);
    });

    socketRef.current = socket;

    // ── Cleanup on unmount ──
    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [isLoggedIn, token]);

  return (
    <SocketContext.Provider value={{
      socket   : socketRef.current,
      connected,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket anywhere
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used inside SocketProvider');
  }
  return context;
};

export default SocketContext;