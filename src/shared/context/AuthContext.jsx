import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios.jsx';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,      setUser]      = useState(null);
  const [token,     setToken]     = useState(localStorage.getItem('token') || null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading,   setLoading]   = useState(true);

  // ─────────────────────────────────────────
  // On app startup — check if token exists
  // fetch current user from /api/auth/me
  // ─────────────────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (!savedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
        setToken(savedToken);
        setIsLoggedIn(true);
      } catch (error) {
        // token invalid or expired
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // ─────────────────────────────────────────
  // Login — save token and user
  // ─────────────────────────────────────────
  const login = (userData, tokenValue) => {
    localStorage.setItem('token', tokenValue);
    setUser(userData);
    setToken(tokenValue);
    setIsLoggedIn(true);
  };

  // ─────────────────────────────────────────
  // Register — same as login after success
  // ─────────────────────────────────────────
  const register = (userData, tokenValue) => {
    localStorage.setItem('token', tokenValue);
    setUser(userData);
    setToken(tokenValue);
    setIsLoggedIn(true);
  };

  // ─────────────────────────────────────────
  // Logout — clear everything
  // ─────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoggedIn,
      loading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook for easy access
export const useAuth = () => useContext(AuthContext);

export default AuthContext;