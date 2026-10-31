import React, { useState } from 'react';
import {
  Eye,
  Type,
  Volume2,
  VolumeX,
  Gauge,
  Sparkles,
  UserCheck,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext.jsx';

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    contrastTheme,
    cycleTheme,
    textScale,
    cycleTextScale,
    ttsEnabled,
    setTtsEnabled,
    ttsSpeed,
    setTtsSpeed,
    captionsEnabled,
    setCaptionsEnabled,
    reducedMotion,
    setReducedMotion,
    caregiverAssistedMode,
    setCaregiverAssistedMode,
    speak
  } = useAccessibility();

  const handleTtsToggle = () => {
    const next = !ttsEnabled;
    setTtsEnabled(next);
    if (next) {
      speak('Audio speech narration turned on.');
    }
  };

  const getThemeLabel = () => {
    if (contrastTheme === 'high_contrast_yellow') return 'Yellow on Black';
    if (contrastTheme === 'high_contrast_dark') return 'High Contrast Dark';
    return 'Default Calm';
  };

  const getTextScaleLabel = () => {
    if (textScale === 'large') return 'Large (18px)';
    if (textScale === 'xlarge') return 'Extra Large (22px)';
    return 'Standard (16px)';
  };

  return (
    <aside
      aria-label="Accessibility options"
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 9000,
        maxWidth: '380px',
        width: isOpen ? 'calc(100vw - 2rem)' : 'auto'
      }}
    >
      {/* Floating Toggle Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-secondary"
          style={{
            borderRadius: '9999px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            border: '2px solid var(--accent)',
            backgroundColor: 'var(--bg-surface-elevated)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.15rem'
          }}
          aria-expanded="false"
          aria-controls="accessibility-panel"
        >
          <Sliders size={20} style={{ color: 'var(--accent)' }} />
          <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Accessibility & Audio</span>
          <ChevronUp size={18} />
        </button>
      )}

      {/* Expanded Accessibility Settings Card */}
      {isOpen && (
        <div
          id="accessibility-panel"
          className="card"
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '2px solid var(--primary)',
            boxShadow: '0 16px 36px rgba(0,0,0,0.6)',
            borderRadius: 'var(--border-radius-md)',
            padding: '1.25rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={20} style={{ color: 'var(--primary)' }} />
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                Accessibility Controls
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.6rem' }}
              aria-label="Collapse accessibility menu"
            >
              <ChevronDown size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Contrast Theme */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={18} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Contrast Theme</span>
              </div>
              <button
                onClick={cycleTheme}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
                aria-label={`Cycle theme, currently ${getThemeLabel()}`}
              >
                {getThemeLabel()}
              </button>
            </div>

            {/* Font Size */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Type size={18} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Text Size</span>
              </div>
              <button
                onClick={cycleTextScale}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
                aria-label={`Cycle text size, currently ${getTextScaleLabel()}`}
              >
                {getTextScaleLabel()}
              </button>
            </div>

            {/* Speech Narration / TTS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {ttsEnabled ? (
                  <Volume2 size={18} style={{ color: 'var(--success)' }} />
                ) : (
                  <VolumeX size={18} style={{ color: 'var(--text-muted)' }} />
                )}
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Speech (TTS)</span>
              </div>
              <button
                onClick={handleTtsToggle}
                className={`btn ${ttsEnabled ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
                aria-pressed={ttsEnabled}
              >
                {ttsEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* TTS Speed Rate Slider */}
            {ttsEnabled && (
              <div style={{ paddingLeft: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Gauge size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pace:</span>
                <input
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.25"
                  value={ttsSpeed}
                  onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
                  aria-label="Speech pace slider"
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{ttsSpeed}x</span>
              </div>
            )}

            {/* Reduced Motion Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} style={{ color: 'var(--warning)' }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Reduce Motion</span>
              </div>
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`btn ${reducedMotion ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
                aria-pressed={reducedMotion}
              >
                {reducedMotion ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Caregiver Co-Pilot Mode */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck size={18} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Caregiver Co-Pilot</span>
              </div>
              <button
                onClick={() => setCaregiverAssistedMode(!caregiverAssistedMode)}
                className={`btn ${caregiverAssistedMode ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
                aria-pressed={caregiverAssistedMode}
              >
                {caregiverAssistedMode ? 'Active' : 'Solo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
