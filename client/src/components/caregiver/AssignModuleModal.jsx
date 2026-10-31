import React, { useState } from 'react';
import { X, Check, BookPlus, AlertCircle } from 'lucide-react';
import api from '../../services/api.js';

export default function AssignModuleModal({ isOpen, onClose, learners, modules, onAssigned }) {
  const [learnerId, setLearnerId] = useState(learners[0]?.id || '');
  const [moduleId, setModuleId] = useState(modules[0]?.id || '');
  const [repetitionCount, setRepetitionCount] = useState(2);
  const [difficultyLevel, setDifficultyLevel] = useState('standard');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.assignModule({
        learner_id: learnerId || learners[0]?.id,
        module_id: moduleId || modules[0]?.id,
        repetition_count: Number(repetitionCount),
        difficulty_level: difficultyLevel
      });
      if (onAssigned) onAssigned();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to assign module');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
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
          maxWidth: '520px',
          width: '100%',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '2px solid var(--border-color)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookPlus size={22} color="var(--primary)" />
            <h2 style={{ fontSize: '1.3em' }}>Assign Safety Module</h2>
          </div>
          <button onClick={onClose} className="btn btn-outline" style={{ minHeight: '36px', padding: '0.3rem' }}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              borderRadius: 'var(--border-radius-sm)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9em', marginBottom: '0.35rem', fontWeight: 600 }}>
              Select Learner
            </label>
            <select
              className="input-field"
              value={learnerId}
              onChange={(e) => setLearnerId(e.target.value)}
              required
            >
              {learners.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.preferred_name} ({l.accountName || l.current_level})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9em', marginBottom: '0.35rem', fontWeight: 600 }}>
              Select Learning Module
            </label>
            <select
              className="input-field"
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              required
            >
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  Module {m.module_number}: {m.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9em', marginBottom: '0.35rem', fontWeight: 600 }}>
              Recommended Repetitions (Pacing Reinforcement)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              className="input-field"
              value={repetitionCount}
              onChange={(e) => setRepetitionCount(e.target.value)}
              required
            />
            <span style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
              Learners with intellectual disabilities benefit from 2-3 repetitions to reinforce retention.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9em', marginBottom: '0.35rem', fontWeight: 600 }}>
              Difficulty Level
            </label>
            <select
              className="input-field"
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
            >
              <option value="standard">Standard (Friendly Cues & Audio)</option>
              <option value="supported">Supported (Caregiver Guided Prompts)</option>
              <option value="independent">Independent Challenge</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              <Check size={18} />
              <span>{submitting ? 'Assigning...' : 'Confirm Assignment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
