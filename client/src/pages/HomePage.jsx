import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Play,
  Heart,
  Eye,
  Sparkles,
  Users,
  Award,
  CheckCircle2,
  ChevronRight,
  Headphones,
  Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function HomePage() {
  const { isAuthenticated, isCaregiver, isLearner } = useAuth();

  return (
    <div className="main-content" style={{ maxWidth: '1240px', padding: '1rem 1.5rem 4rem 1.5rem' }}>
      {/* Hero Section */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
          padding: '3rem 0',
          marginBottom: '2rem'
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(2, 132, 199, 0.15)',
              border: '1px solid var(--primary)',
              color: 'var(--primary)',
              fontSize: '0.85rem',
              fontWeight: '700',
              marginBottom: '1.25rem'
            }}
          >
            <Sparkles size={16} />
            <span>Interactive 3D Safety Awareness Model</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: '800',
              lineHeight: '1.15',
              margin: '0 0 1.25rem 0',
              color: 'var(--text-main)',
              letterSpacing: '-0.03em'
            }}
          >
            Empowering Personal Boundaries Through{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #14b8a6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Interactive 3D VR
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              lineHeight: '1.6',
              margin: '0 0 2rem 0',
              maxWidth: '560px'
            }}
          >
            Designed specifically for individuals with intellectual disabilities and visual learners to practice recognizing safe versus unsafe touch, keeping their personal space bubble secure, and speaking up with confidence.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <Link
              to="/modules"
              className="btn btn-primary"
              style={{
                fontSize: '1.1rem',
                padding: '0.9rem 1.8rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                textDecoration: 'none',
                boxShadow: '0 8px 24px var(--primary-glow)',
                fontWeight: '700'
              }}
            >
              <Play size={20} fill="currentColor" />
              <span>Explore Safety Modules</span>
            </Link>

            <Link
              to={isAuthenticated ? (isCaregiver ? '/caregiver' : '/learner') : '/login'}
              className="btn btn-secondary"
              style={{
                fontSize: '1.1rem',
                padding: '0.9rem 1.8rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              <Users size={20} />
              <span>{isAuthenticated ? 'My Dashboard' : 'Caregiver & Learner Hub'}</span>
            </Link>
          </div>
        </div>

        {/* 3D Personal Space Bubble Interactive Showcase Card */}
        <div
          className="card"
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '2px solid var(--border-color)',
            padding: '2rem',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              margin: '0 auto 1.5rem auto',
              background: 'radial-gradient(circle, rgba(20, 184, 166, 0.35) 0%, rgba(2, 132, 199, 0.15) 70%, transparent 100%)',
              border: '3px dashed var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 35px rgba(20, 184, 166, 0.3)',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <Shield size={36} />
            </div>
            <span
              style={{
                position: 'absolute',
                bottom: '10px',
                backgroundColor: 'var(--bg-main)',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                color: 'var(--accent)',
                fontWeight: '700',
                border: '1px solid var(--accent)'
              }}
            >
              Space Bubble
            </span>
          </div>

          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', color: 'var(--text-main)' }}>
            The 3D Virtual Space Bubble
          </h3>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Visualizes comfortable arm-length boundaries. Learners see the bubble glow green when boundaries are respected, and turn amber when an avatar steps too close.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.8rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: 'var(--success)',
                fontWeight: '600'
              }}
            >
              ✓ Safe Touch
            </span>
            <span
              style={{
                fontSize: '0.8rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--danger)',
                fontWeight: '600'
              }}
            >
              ✕ Unsafe Touch
            </span>
            <span
              style={{
                fontSize: '0.8rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                backgroundColor: 'rgba(2, 132, 199, 0.15)',
                color: 'var(--primary)',
                fontWeight: '600'
              }}
            >
              🗣 Say NO Loud & Clear
            </span>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Section */}
      <section style={{ marginTop: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.9rem', margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontWeight: '800' }}>
            Built for Understanding & Safety
          </h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem' }}>
            Comprehensive features tailored for learners, families, and special educators
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div
            className="card"
            style={{
              padding: '1.75rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(2, 132, 199, 0.15)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <Eye size={24} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: 'var(--text-main)' }}>
              Interactive 3D Simulation
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Works natively in any modern browser without VR hardware, with WebXR spatial readiness for VR headsets when available.
            </p>
          </div>

          <div
            className="card"
            style={{
              padding: '1.75rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(20, 184, 166, 0.15)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <Headphones size={24} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: 'var(--text-main)' }}>
              Audio Narration & TTS
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Web Speech API provides synchronized audio read-aloud for scenarios, choices, and positive feedback at personalized speeds.
            </p>
          </div>

          <div
            className="card"
            style={{
              padding: '1.75rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <Heart size={24} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: 'var(--text-main)' }}>
              Trauma-Informed & Safe
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Non-threatening scenarios with breathing exercises, calming guidance, and zero shaming. Reassures learners that boundaries are their right.
            </p>
          </div>

          <div
            className="card"
            style={{
              padding: '1.75rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <Sliders size={24} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: 'var(--text-main)' }}>
              Caregiver Progress Tracking
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Assign modules with custom repetition counts, review accuracy analytics, identify topics needing revision, and export CSV reports.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
