import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('caregiver');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) {
      setError('Please acknowledge the safeguarding guidelines before continuing.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await register({
        name,
        email,
        password,
        role
      });
      if (user.role === 'caregiver') {
        navigate('/caregiver');
      } else {
        navigate('/learner');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ maxWidth: '560px', padding: '2rem 1rem' }}>
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
            Create an Account
          </h1>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Join NeuroVR-2.0 to support personal safety education
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
              htmlFor="reg-name"
              style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}
            >
              Full Name
            </label>
            <input
              id="reg-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Elena Vance"
              required
            />
          </div>

          <div>
            <label
              htmlFor="reg-email"
              style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}
            >
              Email Address
            </label>
            <input
              id="reg-email"
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
              htmlFor="reg-password"
              style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}
            >
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label
              htmlFor="reg-role"
              style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}
            >
              I am registering as a:
            </label>
            <select
              id="reg-role"
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="caregiver">Caregiver, Special Educator, or Parent</option>
              <option value="learner">Learner (Personal Account)</option>
            </select>
          </div>

          {/* Safeguarding Consent Checkbox */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--border-radius-sm)',
              border: '1px solid var(--border-color)',
              fontSize: '0.85rem'
            }}
          >
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                style={{ marginTop: '0.2rem', width: '18px', height: '18px' }}
                required
              />
              <span style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>
                I agree to use NeuroVR-2.0 as a supportive educational supplement with respectful, trauma-informed guidance. I understand that this tool does not replace real-world supervision or emergency professional services.
              </span>
            </label>
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
            <UserPlus size={20} />
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
