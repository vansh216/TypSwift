import { useState } from 'react';
import { Link }     from 'react-router-dom';

const RegisterForm = ({ onSubmit, loading, error }) => {
  const [form, setForm] = useState({
    username: '',
    email   : '',
    password: '',
    confirm : '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const s = styles;

  return (
    <div style={s.card}>

      {/* ── Header ── */}
      <div style={s.header}>
        <div style={s.iconWrap}><img className='rounded-2xl' src="favicon.png" alt="logo.." /></div>
        <h1 style={s.title}>Create account</h1>
        <p style={s.subtitle}>
          Join TypSwift and track your typing progress
        </p>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={s.errorBox}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} style={s.form}>

        <div style={s.formGroup}>
          <label style={s.label}>Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="vansh216"
            style={s.input}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e  => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="vkp@example.com"
            style={s.input}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e  => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            style={s.input}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e  => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Confirm Password</label>
          <input
            type="password"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            placeholder="••••••••"
            style={s.input}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e  => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...s.submitBtn,
            opacity: loading ? 0.7 : 1,
            cursor : loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

      </form>

      {/* ── Divider ── */}
      <div style={s.dividerRow}>
        <div style={s.dividerLine} />
        <span style={s.dividerText}>or</span>
        <div style={s.dividerLine} />
      </div>

      {/* ── Guest button ── */}
      <Link to="/" style={s.guestBtn}>
        Continue as Guest
      </Link>

      {/* ── Footer ── */}
      <p style={s.footer}>
        Already have an account?{' '}
        <Link to="/login" style={s.footerLink}>
          Login here
        </Link>
      </p>

    </div>
  );
};

const styles = {
  card: {
    width        : '100%',
    maxWidth     : '420px',
    background   : 'var(--card-bg)',
    border       : '1px solid var(--border-color)',
    borderRadius : '16px',
    padding      : '2rem',
    boxShadow    : 'var(--shadow)',
  },
  header: {
    textAlign    : 'center',
    marginBottom : '1.5rem',
  },
  iconWrap: {
    width          : '52px',
    height         : '52px',
    background     : 'var(--accent-light)',
    border         : '1px solid var(--accent-border)',
    borderRadius   : '14px',
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    fontSize       : '24px',
    margin         : '0 auto 1rem',
  },
  title: {
    fontSize     : '22px',
    fontWeight   : 700,
    color        : 'var(--text-primary)',
    marginBottom : '6px',
  },
  subtitle: {
    fontSize  : '13px',
    color     : 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  errorBox: {
    background   : '#fef2f2',
    border       : '1px solid #fecaca',
    borderRadius : '8px',
    padding      : '10px 14px',
    fontSize     : '13px',
    color        : '#dc2626',
    marginBottom : '1rem',
  },
  form: {
    display      : 'flex',
    flexDirection: 'column',
    gap          : '1rem',
  },
  formGroup: {
    display      : 'flex',
    flexDirection: 'column',
    gap          : '6px',
  },
  label: {
    fontSize  : '13px',
    fontWeight: 500,
    color     : 'var(--text-secondary)',
  },
  input: {
    width        : '100%',
    padding      : '10px 14px',
    fontSize     : '14px',
    borderRadius : '8px',
    border       : '1px solid var(--border-color)',
    background   : 'var(--bg-secondary)',
    color        : 'var(--text-primary)',
    outline      : 'none',
    transition   : 'border-color 0.2s',
  },
  submitBtn: {
    width        : '100%',
    padding      : '11px',
    borderRadius : '8px',
    border       : 'none',
    background   : 'var(--accent)',
    color        : '#fff',
    fontSize     : '14px',
    fontWeight   : 600,
    marginTop    : '4px',
    transition   : 'background 0.2s',
  },
  dividerRow: {
    display    : 'flex',
    alignItems : 'center',
    gap        : '10px',
    margin     : '1.25rem 0',
  },
  dividerLine: {
    flex      : 1,
    height    : '1px',
    background: 'var(--border-color)',
  },
  dividerText: {
    fontSize: '12px',
    color   : 'var(--text-muted)',
  },
  guestBtn: {
    display       : 'block',
    width         : '100%',
    padding       : '10px',
    borderRadius  : '8px',
    border        : '1px solid var(--border-color)',
    background    : 'transparent',
    color         : 'var(--text-secondary)',
    fontSize      : '14px',
    fontWeight    : 500,
    cursor        : 'pointer',
    textAlign     : 'center',
    textDecoration: 'none',
    marginBottom  : '1.25rem',
    transition    : 'border-color 0.2s, color 0.2s',
    boxSizing     : 'border-box',
  },
  footer: {
    textAlign: 'center',
    fontSize : '13px',
    color    : 'var(--text-secondary)',
  },
  footerLink: {
    color         : 'var(--accent)',
    fontWeight    : 500,
    textDecoration: 'none',
  },
};

export default RegisterForm;