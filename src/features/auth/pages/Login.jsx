import { useState }      from 'react';
import { useNavigate }   from 'react-router-dom';
import { useAuth }       from '../../../shared/context/AuthContext.jsx';
import { loginApi }      from '../api/auth.api.jsx';
import LoginForm         from '../components/LoginForm.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ email, password }) => {
    if (!email || !password) {
      setError('All fields are required');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const data = await loginApi(email, password);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <LoginForm
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </div>
  );
};

const pageStyle = {
  minHeight     : 'calc(100vh - 56px)',
  display       : 'flex',
  alignItems    : 'center',
  justifyContent: 'center',
  padding       : '2rem 1rem',
  background    : 'var(--bg-primary)',
};

export default Login;