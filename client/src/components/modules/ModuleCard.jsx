import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  HeartHandshake,
  AlertCircle,
  Compass,
  RotateCcw,
  Clock,
  ChevronRight,
  Volume2,
  CheckCircle2
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext.jsx';

const ICON_MAP = {
  ShieldCheck,
  HeartHandshake,
  AlertCircle,
  Compass,
  RotateCcw
};

export default function ModuleCard({ module }) {
  const { speak } = useAccessibility();
  const IconComponent = ICON_MAP[module.icon_name] || ShieldCheck;

  const assignmentStatus = module.assignment?.status || 'available';
  const isCompleted = assignmentStatus === 'completed';

  const handleReadAloud = (e) => {
    e.preventDefault();
    e.stopPropagation();
    speak(`Module ${module.module_number}: ${module.title}. ${module.subtitle}. ${module.description}`);
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        borderTop: isCompleted ? '4px solid var(--success)' : '4px solid var(--primary)',
        height: '100%'
      }}
    >
      <div>
        {/* Header Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: isCompleted ? 'var(--success-bg)' : 'rgba(2, 132, 199, 0.15)',
              color: isCompleted ? 'var(--success)' : 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${isCompleted ? 'var(--success-border)' : 'var(--primary-glow)'}`
            }}
          >
            <IconComponent size={28} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {isCompleted && (
              <span className="badge badge-success">
                <CheckCircle2 size={14} />
                <span>Done</span>
              </span>
            )}
            <button
              onClick={handleReadAloud}
              className="btn btn-outline"
              style={{ minHeight: '36px', padding: '0.3rem 0.5rem' }}
              title="Read module description aloud"
              aria-label={`Read module ${module.module_number} description aloud`}
            >
              <Volume2 size={16} />
            </button>
          </div>
        </div>

        {/* Module Number & Subtitle */}
        <span style={{ fontSize: '0.85em', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>
          Module {module.module_number}
        </span>
        <h2 style={{ fontSize: '1.35em', marginTop: '0.2rem', marginBottom: '0.35rem', lineHeight: 1.3 }}>
          {module.title}
        </h2>
        <h3 style={{ fontSize: '1em', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.75rem' }}>
          {module.subtitle}
        </h3>

        {/* Description */}
        <p style={{ fontSize: '0.95em', color: 'var(--text-dim)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          {module.description}
        </p>
      </div>

      <div>
        {/* Metadata Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-color)',
            marginBottom: '1rem',
            fontSize: '0.85em',
            color: 'var(--text-muted)'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={15} />
            <span>{module.estimated_minutes || 10} mins</span>
          </span>
          <span>•</span>
          <span>{module.scenarioCount || 2} Interactive 3D Scenarios</span>
        </div>

        {/* Start Button */}
        <Link
          to={`/modules/${module.id}`}
          className={`btn ${isCompleted ? 'btn-outline' : 'btn-primary'}`}
          style={{ width: '100%' }}
        >
          <span>{isCompleted ? 'Practice Again' : 'Enter 3D VR Lesson'}</span>
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
}
