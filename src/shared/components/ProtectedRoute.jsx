import { Navigate } from 'react-router-dom';
import { useAuth }  from '../context/AuthContext';
import Loader       from './Loader';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <Loader />;

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;