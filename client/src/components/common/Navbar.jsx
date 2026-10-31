import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  BookOpen,
  LayoutDashboard,
  HeartHandshake,
  LogOut,
  LogIn,
  UserPlus,
  HelpCircle,
  Menu,
  X,
  User,
  Sliders
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import EmergencyHelpModal from './EmergencyHelpModal.jsx';

export default function Navbar() {
  const { user, isAuthenticated, isCaregiver, isAdmin, isLearner, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 8000,
          backgroundColor: 'var(--bg-glass)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-color)',
          transition: 'background-color 0.3s ease'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Logo & Brand */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              color: 'var(--text-main)',
              fontWeight: '800',
              fontSize: '1.25rem',
              letterSpacing: '-0.02em'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #14b8a6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)'
              }}
            >
              <Shield size={24} color="#ffffff" />
            </div>
            <span>
              NeuroVR<span style={{ color: 'var(--accent)' }}>-2.0</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
            className="desktop-nav"
          >
            <Link
              to="/modules"
              className={`nav-link ${isActive('/modules') ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                textDecoration: 'none',
                color: isActive('/modules') ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: '500',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--border-radius-sm)',
                transition: 'all 0.2s ease'
              }}
            >
              <BookOpen size={18} />
              <span>Safety Modules</span>
            </Link>

            {isAuthenticated && (
              <Link
                to={isCaregiver ? '/caregiver' : isLearner ? '/learner' : '/dashboard'}
                className={`nav-link ${isActive('/dashboard') || isActive('/caregiver') || isActive('/learner') ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  textDecoration: 'none',
                  color: isActive('/dashboard') || isActive('/caregiver') || isActive('/learner')
                    ? 'var(--primary)'
                    : 'var(--text-main)',
                  fontWeight: '500',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--border-radius-sm)',
                  transition: 'all 0.2s ease'
                }}
              >
                <LayoutDashboard size={18} />
                <span>{isCaregiver ? 'Caregiver Dashboard' : isLearner ? 'Learner Hub' : 'Dashboard'}</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  textDecoration: 'none',
                  color: isActive('/admin') ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: '500',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--border-radius-sm)'
                }}
              >
                <Sliders size={18} />
                <span>Admin</span>
              </Link>
            )}

            {/* Emergency & Support Button */}
            <button
              onClick={() => setHelpModalOpen(true)}
              className="btn btn-warning"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                fontSize: '0.85rem',
                borderRadius: '9999px',
                border: '2px solid var(--warning)'
              }}
              title="Calming support, trusted adult contacts, and emotional safety"
            >
              <HeartHandshake size={16} />
              <span>I Need Help</span>
            </button>
          </nav>

          {/* User Controls & Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.35rem 0.75rem',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderRadius: '9999px',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem'
                  }}
                  className="user-badge"
                >
                  <User size={15} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                    {user?.name || user?.email?.split('@')[0]}
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      backgroundColor: isCaregiver ? 'var(--primary)' : isLearner ? 'var(--accent)' : 'var(--warning)',
                      color: '#ffffff',
                      textTransform: 'uppercase',
                      fontWeight: '700'
                    }}
                  >
                    {user?.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                  title="Sign out of NeuroVR"
                  aria-label="Sign out"
                >
                  <LogOut size={16} />
                  <span className="hide-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link
                  to="/login"
                  className="btn btn-secondary"
                  style={{
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    textDecoration: 'none'
                  }}
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  style={{
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    textDecoration: 'none'
                  }}
                >
                  <UserPlus size={16} />
                  <span>Register</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-secondary mobile-menu-toggle"
              style={{
                display: 'none',
                padding: '0.5rem',
                border: '1px solid var(--border-color)'
              }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1rem 1.5rem',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <Link
              to="/modules"
              onClick={() => setMobileMenuOpen(false)}
              style={{ textDecoration: 'none', color: 'var(--text-main)', padding: '0.5rem 0' }}
            >
              Safety Modules
            </Link>
            {isAuthenticated && (
              <Link
                to={isCaregiver ? '/caregiver' : isLearner ? '/learner' : '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                style={{ textDecoration: 'none', color: 'var(--text-main)', padding: '0.5rem 0' }}
              >
                {isCaregiver ? 'Caregiver Dashboard' : isLearner ? 'Learner Hub' : 'Dashboard'}
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                style={{ textDecoration: 'none', color: 'var(--text-main)', padding: '0.5rem 0' }}
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={() => {
                setHelpModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="btn btn-warning"
              style={{ justifyContent: 'center', marginTop: '0.5rem' }}
            >
              <HeartHandshake size={16} />
              <span>I Need Help / Emotional Safety</span>
            </button>
          </div>
        )}
      </header>

      {/* Global Emergency Help Modal */}
      <EmergencyHelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />
    </>
  );
}
