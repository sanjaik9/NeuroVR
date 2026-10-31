import React, { useState, useEffect } from 'react';
import {
  Shield,
  Activity,
  Users,
  BookOpen,
  CheckCircle2,
  Server,
  RefreshCw,
  Database
} from 'lucide-react';
import api from '../services/api.js';

export default function AdminDashboard() {
  const [health, setHealth] = useState(null);
  const [modules, setModules] = useState([]);
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [modulesRes, learnersRes] = await Promise.all([
        api.getModules(),
        api.getLearners()
      ]);

      if (modulesRes.success) setModules(modulesRes.data || []);
      if (learnersRes.success) setLearners(learnersRes.data || []);

      // Check health
      try {
        const hRes = await fetch('/api/health');
        const hData = await hRes.json();
        setHealth(hData);
      } catch (err) {
        setHealth({ status: 'offline', database: 'unavailable' });
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  return (
    <div className="main-content" style={{ maxWidth: '1200px' }}>
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%)',
          borderColor: 'rgba(2, 132, 199, 0.4)',
          marginBottom: '2rem',
          padding: '2rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}
            >
              System Administration
            </span>
            <h1 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1.8rem', color: 'var(--text-main)' }}>
              NeuroVR-2.0 System Control
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Database persistence, system health, modules, and user authorization
            </p>
          </div>

          <button
            onClick={loadAdminData}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={16} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* System Health Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Server Status</span>
            <Activity size={20} style={{ color: 'var(--success)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--success)' }}>
            {health?.status === 'healthy' ? 'Operational' : 'Active'}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            NeuroVR-2.0 Node/Express API
          </span>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Database Layer</span>
            <Database size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.3rem' }}>
            {health?.database || 'PostgreSQL Engine'}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Auto-migrating relational schema
          </span>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Active Modules</span>
            <BookOpen size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>
            {modules.length}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Curriculum learning units
          </span>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Registered Learners</span>
            <Users size={20} style={{ color: 'var(--warning)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>
            {learners.length}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Supervised learner profiles
          </span>
        </div>
      </div>

      {/* Module Overview Table */}
      <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-surface)', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', margin: '0 0 1rem 0', color: 'var(--text-main)' }}>
          System Curriculum Modules
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Title</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Difficulty</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Scenarios</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>
                    {m.title}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', textTransform: 'capitalize' }}>
                    {m.difficulty_level}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    {m.scenarios?.length || 2} scenarios
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(34, 197, 94, 0.2)',
                        color: 'var(--success)',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      Published
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
