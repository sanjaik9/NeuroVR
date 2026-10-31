import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, LogIn, UserCheck, Key, AlertCircle, Sparkles, Smile } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAccessibility } from '../../context/AccessibilityContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login, switchDemoUser, demoAccounts } = useAuth();
  const { speak } = useAccessibility();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login(email, password);
      if (user.role === 'caregiver') {
        navigate('/caregiver');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/learner');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (key) => {
    setLoading(true);
    setError(null);
    try {
      const user = await switchDemoUser(key);
      if (user.role === 'caregiver') {
        navigate('/caregiver');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/learner');
      }
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ maxWidth: '520px', padding: '2rem 1rem' }}>
      <div
        className="card"
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '2px solid var(--border-color)',
          padding: '2.25rem',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: '0 16px 36px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0284c7 0%, #14b8a6 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 8px 20px rgba(2, 132, 199, 0.4)'
            }}
          >
            <Shield size={32} color="#ffffff" />
          </div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', color: 'var(--text-main)', fontWeight: '800' }}>
            Sign In to NeuroVR-2.0
          </h1>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Safe, accessible learning space for personal boundaries
          </p>
        </div>

        {error && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1rem',
              backgroundColor: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--border-radius-sm)',
              color: 'var(--danger)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}
          >
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label
              htmlFor="login-email"
              style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              padding: '0.85rem',
              fontSize: '1.05rem',
              fontWeight: '700',
              marginTop: '0.5rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <LogIn size={20} />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Logins Section */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', justifyContent: 'center' }}>
            <Sparkles size={16} style={{ color: 'var(--warning)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              One-Click Demo Accounts
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('caregiver')}
              className="btn btn-secondary"
              style={{ padding: '0.65rem 0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <UserCheck size={16} style={{ color: 'var(--primary)' }} />
              <span>Caregiver (Elena)</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('learner_alex')}
              className="btn btn-secondary"
              style={{ padding: '0.65rem 0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <Smile size={16} style={{ color: 'var(--accent)' }} />
              <span>Learner (Alex)</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('learner_sammy')}
              className="btn btn-secondary"
              style={{ padding: '0.65rem 0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <Smile size={16} style={{ color: 'var(--success)' }} />
              <span>Learner (Sammy)</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="btn btn-secondary"
              style={{ padding: '0.65rem 0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <Key size={16} style={{ color: 'var(--warning)' }} />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
