import { useState }      from 'react';
import { useNavigate }   from 'react-router-dom';
import { useAuth }       from '../../../shared/context/AuthContext';
import { registerApi }   from '../api/auth.api';
import RegisterForm      from '../components/RegisterForm';

const Register = () => {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const validate = ({ username, email, password, confirm }) => {
    if (!username || !email || !password || !confirm) {
      return 'All fields are required';
    }
    if (username.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (password !== confirm) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (form) => {
    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      setLoading(true);
      setError('');
      const data = await registerApi(form.username, form.email, form.password);
      register(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <RegisterForm
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

export default Register;