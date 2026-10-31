import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Filter, CheckCircle2, BookOpen } from 'lucide-react';
import ModuleCard from './ModuleCard.jsx';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAccessibility } from '../../context/AccessibilityContext.jsx';

export default function ModuleList() {
  const { user } = useAuth();
  const { speak } = useAccessibility();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'beginner' | 'intermediate'

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
        console.error('Failed to load modules:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const filteredModules = modules.filter(m => {
    if (filter === 'all') return true;
    return m.difficulty_level === filter;
  });

  return (
    <div className="main-content" style={{ maxWidth: '1200px' }}>
      {/* Hero Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(20, 184, 166, 0.15) 100%)',
          borderColor: 'rgba(2, 132, 199, 0.4)',
          marginBottom: '2rem',
          padding: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div
            style={{
              padding: '0.6rem',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              display: 'inline-flex'
            }}
          >
            <Shield size={28} />
          </div>
          <span className="badge badge-primary">NeuroVR-2.0 Interactive Learning</span>
        </div>

        <h1 style={{ fontSize: '2.1em', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Personal Safety & Boundary Awareness
        </h1>
        <p style={{ fontSize: '1.15em', color: 'var(--text-muted)', maxWidth: '820px', lineHeight: 1.6 }}>
          Learn your personal boundaries, recognize safe and caring touches, practice what to do in uncomfortable situations,
          and build confidence in a supportive, friendly 3D virtual environment.
        </p>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.9em', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Filter size={16} />
            <span>Filter Modules:</span>
          </span>
          {['all', 'beginner', 'intermediate'].map((level) => (
            <button
              key={level}
              className={`btn ${filter === level ? 'btn-primary' : 'btn-outline'}`}
              style={{ minHeight: '38px', padding: '0.3rem 0.85rem', fontSize: '0.85em', textTransform: 'capitalize' }}
              onClick={() => setFilter(level)}
            >
              {level}
            </button>
          ))}
        </div>

        <span style={{ fontSize: '0.9em', color: 'var(--text-muted)' }}>
          Showing {filteredModules.length} Safety Learning Modules
        </span>
      </div>

      {/* Module Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading learning modules...</p>
        </div>
      ) : (
        <div className="grid-cols-auto">
          {filteredModules.map((mod) => (
            <ModuleCard key={mod.id} module={mod} />
          ))}
        </div>
      )}
    </div>
  );
}
