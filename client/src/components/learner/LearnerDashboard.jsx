import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Shield,
  Award,
  Play,
  Volume2,
  Heart,
  Smile,
  Star,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAccessibility } from '../../context/AccessibilityContext.jsx';

export default function LearnerDashboard() {
  const { user } = useAuth();
  const { speak } = useAccessibility();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const learnerName = user?.name || user?.email?.split('@')[0] || 'Friend';

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const learnerId = user?.learnerProfile?.id;
        const res = await api.getModules(learnerId);
        if (res.success && res.data) {
          setModules(res.data);
        }
      } catch (err) {
        console.error('Failed to load learner modules:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const welcomeMessage = `Hello, ${learnerName}! Welcome to your safety learning adventure. Pick a module to practice keeping your personal space safe!`;

  const readWelcome = () => {
    speak(welcomeMessage);
  };

  const currentModule = modules[0] || {
    id: '1',
    title: 'Understanding My Personal Space Bubble',
    description: 'Explore your protective space bubble in 3D and practice setting your boundaries.'
  };

  return (
    <div className="main-content" style={{ maxWidth: '1000px' }}>
      {/* Friendly Hero Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.25) 0%, rgba(2, 132, 199, 0.2) 100%)',
          borderColor: 'var(--accent)',
          padding: '2.5rem 2rem',
          marginBottom: '2rem',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.4)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(20, 184, 166, 0.5)'
              }}
            >
              <Smile size={44} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  My Safety Zone
                </span>
                <Sparkles size={18} style={{ color: 'var(--warning)' }} />
              </div>
              <h1 style={{ margin: 0, fontSize: '2.2rem', color: 'var(--text-main)', fontWeight: '800' }}>
                Hi, {learnerName}!
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                You are doing a fantastic job learning about safe boundaries.
              </p>
            </div>
          </div>

          <button
            onClick={readWelcome}
            className="btn btn-secondary"
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '9999px',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            aria-label="Read welcome greeting aloud"
          >
            <Volume2 size={22} style={{ color: 'var(--accent)' }} />
            <span style={{ fontWeight: '600' }}>Read to Me</span>
          </button>
        </div>
      </div>

      {/* Primary Spotlight: Next Adventure Card */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Star size={24} style={{ color: 'var(--warning)', fill: 'var(--warning)' }} />
          <span>My Next Safety Adventure</span>
        </h2>

        <div
          className="card"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '3px solid var(--primary)',
            padding: '2rem',
            borderRadius: 'var(--border-radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            boxShadow: '0 10px 25px rgba(2, 132, 199, 0.2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span
                style={{
                  fontSize: '0.85rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(2, 132, 199, 0.2)',
                  color: 'var(--primary)',
                  fontWeight: '700',
                  display: 'inline-block',
                  marginBottom: '0.75rem'
                }}
              >
                Recommended Practice
              </span>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.6rem', color: 'var(--text-main)' }}>
                {currentModule.title}
              </h3>
              <p style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '650px', lineHeight: '1.5' }}>
                {currentModule.description}
              </p>
            </div>

            <Link
              to={`/modules/${currentModule.id}`}
              className="btn btn-primary"
              style={{
                fontSize: '1.25rem',
                padding: '1.1rem 2.25rem',
                borderRadius: 'var(--border-radius-md)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(2, 132, 199, 0.5)',
                fontWeight: '700'
              }}
            >
              <Play size={26} fill="currentColor" />
              <span>Start Learning!</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Safety Badges & Star Ribbons */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={22} style={{ color: 'var(--accent)' }} />
          <span>My Safety Badges</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div
            className="card"
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-surface)',
              border: '2px solid rgba(2, 132, 199, 0.4)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(2, 132, 199, 0.2)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem auto'
              }}
            >
              <Shield size={30} />
            </div>
            <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--text-main)' }}>
              Space Bubble Explorer
            </strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Understands personal distance
            </span>
          </div>

          <div
            className="card"
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-surface)',
              border: '2px solid rgba(34, 197, 94, 0.4)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem auto'
              }}
            >
              <CheckCircle2 size={30} />
            </div>
            <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--text-main)' }}>
              Safe Touch Hero
            </strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Recognizes respectful greetings
            </span>
          </div>

          <div
            className="card"
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-surface)',
              border: '2px solid rgba(245, 158, 11, 0.4)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                color: 'var(--warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem auto'
              }}
            >
              <Sparkles size={30} />
            </div>
            <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--text-main)' }}>
              Strong Voice Champion
            </strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Confident saying "NO"
            </span>
          </div>
        </div>
      </div>

      {/* Explore All Modules Link */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link
          to="/modules"
          className="btn btn-secondary"
          style={{
            padding: '0.85rem 1.75rem',
            fontSize: '1.1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none'
          }}
        >
          <span>Explore All 3D Safety Modules</span>
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
