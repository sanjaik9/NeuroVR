import React, { useState, useEffect } from 'react';
import { X, Heart, Shield, Phone, Volume2, Sparkles, Smile } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext.jsx';

export default function EmergencyHelpModal({ isOpen, onClose }) {
  const { speak } = useAccessibility();
  const [breathingPhase, setBreathingPhase] = useState('Inhale');

  useEffect(() => {
    if (!isOpen) return;

    // Gentle 12-second cycle: 4s Inhale, 4s Hold, 4s Exhale
    const interval = setInterval(() => {
      setBreathingPhase((prev) => {
        if (prev === 'Inhale') return 'Hold';
        if (prev === 'Hold') return 'Exhale';
        return 'Inhale';
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const helpScript =
    "You are safe here. Take a slow, calm breath. Remember: Your body belongs to you. If anyone ever makes you feel uncomfortable, confused, or scared, you can always tell a trusted adult. It is never your fault.";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 10000
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '650px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '2px solid var(--accent)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          borderRadius: 'var(--border-radius-lg)',
          padding: '2rem'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(20, 184, 166, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)'
              }}
            >
              <Heart size={26} />
            </div>
            <div>
              <h2 id="emergency-modal-title" style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)' }}>
                You Are Safe & Supported
              </h2>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Take a moment to pause and breathe
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => speak(helpScript)}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 0.75rem' }}
              aria-label="Read safety guidance aloud"
              title="Read guidance aloud"
            >
              <Volume2 size={18} />
              <span>Listen</span>
            </button>
            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '0.5rem' }}
              aria-label="Close help screen"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Calming Breathing Animation */}
        <div
          style={{
            textAlign: 'center',
            padding: '1.5rem',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--border-radius-md)',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-color)'
          }}
        >
          <div
            style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 1rem auto',
              borderRadius: '50%',
              backgroundColor: 'rgba(20, 184, 166, 0.2)',
              border: '3px solid var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform:
                breathingPhase === 'Inhale'
                  ? 'scale(1.25)'
                  : breathingPhase === 'Hold'
                  ? 'scale(1.2)'
                  : 'scale(0.85)',
              transition: 'transform 3.8s ease-in-out',
              boxShadow: '0 0 25px rgba(20, 184, 166, 0.3)'
            }}
          >
            <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--accent)' }}>
              {breathingPhase}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Follow the circle: Slowly breathe in calm air, hold gently, and breathe out any worry.
          </p>
        </div>

        {/* 3 Golden Safety Truths */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
              padding: '0.9rem',
              backgroundColor: 'rgba(2, 132, 199, 0.1)',
              borderRadius: 'var(--border-radius-sm)',
              borderLeft: '4px solid var(--primary)'
            }}
          >
            <Shield size={22} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                Your body belongs to you.
              </strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                You have the right to feel safe and protected in your personal space at all times.
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
              padding: '0.9rem',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderRadius: 'var(--border-radius-sm)',
              borderLeft: '4px solid var(--success)'
            }}
          >
            <Smile size={22} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                Saying "NO" is strong and okay.
              </strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                If any touch feels confusing, uncomfortable, or makes you feel uneasy, you can always say NO and walk away.
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
              padding: '0.9rem',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderRadius: 'var(--border-radius-sm)',
              borderLeft: '4px solid var(--warning)'
            }}
          >
            <Sparkles size={22} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                It is never your fault.
              </strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                You will never get in trouble for speaking up to a safe adult about someone crossing your boundaries.
              </span>
            </div>
          </div>
        </div>

        {/* Trusted Adults & Resources */}
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--border-radius-md)',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-color)'
          }}
        >
          <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={18} style={{ color: 'var(--accent)' }} />
            <span>Who to Talk With</span>
          </h4>
          <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Tell someone you trust right now:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '6px', fontSize: '0.9rem' }}>
              👨‍👩‍👧 <strong>Parent or Guardian</strong>
            </div>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '6px', fontSize: '0.9rem' }}>
              🧑‍🏫 <strong>Teacher or Aide</strong>
            </div>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '6px', fontSize: '0.9rem' }}>
              🩺 <strong>School Nurse / Doctor</strong>
            </div>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '6px', fontSize: '0.9rem' }}>
              🤝 <strong>Counselor or Case Worker</strong>
            </div>
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <strong>Support Helplines:</strong>
            <div style={{ marginTop: '0.35rem' }}>
              • <strong>Childhelp National Hotline:</strong> 1-800-422-4453 (Available 24/7)
            </div>
            <div>
              • <strong>Crisis Text Line:</strong> Text <code>HOME</code> to 741741
            </div>
            <div>
              • If in immediate danger, contact your local emergency service (e.g. 911 / 112) or alert an adult nearby.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ minWidth: '130px' }}
          >
            I Feel Better Now
          </button>
        </div>
      </div>
    </div>
  );
}
