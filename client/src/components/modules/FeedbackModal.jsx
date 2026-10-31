import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Volume2, Sparkles, Heart } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext.jsx';

export default function FeedbackModal({
  isOpen,
  isSafeAction,
  explanation,
  encouragement,
  onNext,
  onRetry,
  isLastScenario
}) {
  const { speak, ttsEnabled } = useAccessibility();

  useEffect(() => {
    if (isOpen) {
      if (isSafeAction) {
        // Celebratory confetti burst
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore if canvas unavailable
        }
      }

      if (ttsEnabled) {
        const message = isSafeAction
          ? `Great choice! ${explanation} ${encouragement}`
          : `Thank you for choosing. Here is what to remember: ${explanation} ${encouragement}`;
        speak(message);
      }
    }
  }, [isOpen, isSafeAction, explanation, encouragement]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        zIndex: 9999
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '560px',
          width: '100%',
          borderWidth: '2px',
          borderColor: isSafeAction ? 'var(--success)' : 'var(--warning)',
          backgroundColor: 'var(--bg-surface-elevated)',
          textAlign: 'center',
          animation: 'fadeIn 0.25s ease-out'
        }}
      >
        {/* Status Icon */}
        <div
          style={{
            width: '76px',
            height: '76px',
            margin: '0 auto 1rem',
            borderRadius: '50%',
            backgroundColor: isSafeAction ? 'var(--success-bg)' : 'var(--warning-bg)',
            color: isSafeAction ? 'var(--success)' : 'var(--warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${isSafeAction ? 'var(--success-border)' : 'var(--warning-border)'}`
          }}
        >
          {isSafeAction ? <CheckCircle2 size={42} /> : <Heart size={42} />}
        </div>

        {/* Title */}
        <h2
          id="feedback-title"
          style={{
            fontSize: '1.6em',
            marginBottom: '0.75rem',
            color: isSafeAction ? 'var(--success)' : 'var(--warning)'
          }}
        >
          {isSafeAction ? 'Safe Choice! Excellent Job!' : 'Gentle Learning Moment'}
        </h2>

        {/* Safety Star Badge */}
        {isSafeAction && (
          <div
            className="badge badge-success"
            style={{ marginBottom: '1rem', padding: '0.35rem 0.9rem', fontSize: '0.95em' }}
          >
            <Sparkles size={16} />
            <span>+1 Safety Awareness Star Earned</span>
          </div>
        )}

        {/* Explanation */}
        <p
          style={{
            fontSize: '1.1em',
            lineHeight: 1.6,
            marginBottom: '1rem',
            color: 'var(--text-main)',
            textAlign: 'left',
            padding: '1rem',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--border-radius-sm)',
            border: '1px solid var(--border-color)'
          }}
        >
          {explanation}
        </p>

        {/* Encouragement Reassurance */}
        <p
          style={{
            fontSize: '1em',
            color: 'var(--text-muted)',
            marginBottom: '1.75rem',
            fontStyle: 'italic'
          }}
        >
          "{encouragement}"
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-outline"
            onClick={onRetry}
            style={{ minHeight: '50px' }}
          >
            <RotateCcw size={18} />
            <span>Try Option Again</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={onNext}
            style={{ minHeight: '50px', padding: '0.75rem 1.75rem' }}
          >
            <span>{isLastScenario ? 'Finish Lesson' : 'Next Scenario'}</span>
            <ArrowRight size={18} />
          </button>

          <button
            className="btn btn-outline"
            onClick={() => speak(`${explanation} ${encouragement}`)}
            title="Listen again"
            aria-label="Listen to explanation again"
            style={{ minHeight: '50px' }}
          >
            <Volume2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
