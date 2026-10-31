import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BookOpen,
  Volume2
} from 'lucide-react';
import api from '../../services/api.js';
import { useAccessibility } from '../../context/AccessibilityContext.jsx';

export default function LearnerReportModal({ isOpen, onClose, learner }) {
  const { speak } = useAccessibility();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !learner?.id) return;

    async function loadReport() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getLearnerReport(learner.id);
        if (res.success && res.data) {
          setReport(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load progress report');
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [isOpen, learner]);

  if (!isOpen) return null;

  const handleExportCsv = () => {
    if (!learner?.id) return;
    const token = localStorage.getItem('neurovr_token');
    // Direct browser download
    const url = `/api/reports/learners/${learner.id}/export`;
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `${learner.name || 'learner'}_progress_report.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const readReportSummary = () => {
    if (!report) return;
    const msg = `Safety progress report for ${learner?.name}. Total sessions: ${report.summary?.total_sessions || 0}. Overall accuracy: ${Math.round(report.summary?.average_accuracy || 0)} percent.`;
    speak(msg);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '2px solid var(--border-color)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          borderRadius: 'var(--border-radius-lg)',
          padding: '2rem'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 id="report-modal-title" style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={24} style={{ color: 'var(--primary)' }} />
              <span>Safety Progress Report: {learner?.name}</span>
            </h2>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Non-punitive mastery analytics & revision tracking
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={readReportSummary}
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              title="Read report summary aloud"
            >
              <Volume2 size={16} />
              <span className="hide-sm">Listen</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="btn btn-primary"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              title="Download CSV analytics file"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '0.45rem' }}
              aria-label="Close report"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading progress metrics...
          </div>
        ) : error ? (
          <div className="card" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', padding: '1.5rem' }}>
            {error}
          </div>
        ) : report ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Top Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--border-radius-sm)',
                  border: '1px solid var(--border-color)',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Sessions</span>
                <strong style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>
                  {report.summary?.total_sessions || 0}
                </strong>
              </div>

              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--border-radius-sm)',
                  border: '1px solid var(--border-color)',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Total Attempts</span>
                <strong style={{ fontSize: '1.8rem', color: 'var(--accent)' }}>
                  {report.summary?.total_attempts || 0}
                </strong>
              </div>

              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--border-radius-sm)',
                  border: '1px solid var(--border-color)',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Average Accuracy</span>
                <strong style={{ fontSize: '1.8rem', color: 'var(--success)' }}>
                  {Math.round(report.summary?.average_accuracy || 0)}%
                </strong>
              </div>

              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--border-radius-sm)',
                  border: '1px solid var(--border-color)',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Practice Time</span>
                <strong style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>
                  {Math.round((report.summary?.total_duration_seconds || 0) / 60)}m
                </strong>
              </div>
            </div>

            {/* Topics Needing Revision Alert Section */}
            {report.topicsNeedingRevision && report.topicsNeedingRevision.length > 0 && (
              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--warning)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <AlertTriangle size={20} style={{ color: 'var(--warning)' }} />
                  <h4 style={{ margin: 0, color: 'var(--warning)', fontSize: '1.05rem' }}>
                    Topics Recommended for Supportive Revision
                  </h4>
                </div>
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Learners reinforce boundary retention best through calm repetition rather than test pressure:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {report.topicsNeedingRevision.map((topic, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.6rem 0.9rem',
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{topic.title}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--warning)' }}>
                        Accuracy: {Math.round(topic.accuracy)}% ({topic.incorrect_count} incorrect)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module Mastery Breakdown */}
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} style={{ color: 'var(--primary)' }} />
                <span>Assigned Modules & Status</span>
              </h3>
              {report.assignedModules && report.assignedModules.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {report.assignedModules.map((mod) => (
                    <div
                      key={mod.id}
                      style={{
                        padding: '0.85rem 1.15rem',
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: 'var(--border-radius-sm)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <strong style={{ color: 'var(--text-main)', display: 'block' }}>{mod.title}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Assigned Repetitions: {mod.repetition_count} | Difficulty: {mod.difficulty_level}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          backgroundColor: mod.status === 'completed' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(2, 132, 199, 0.2)',
                          color: mod.status === 'completed' ? 'var(--success)' : 'var(--primary)',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}
                      >
                        {mod.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No modules assigned yet.</p>
              )}
            </div>

            {/* Recent Sessions Log */}
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} style={{ color: 'var(--accent)' }} />
                <span>Recent Learning Sessions</span>
              </h3>
              {report.recentSessions && report.recentSessions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {report.recentSessions.slice(0, 5).map((s) => (
                    <div
                      key={s.id}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: 'var(--border-radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.9rem'
                      }}
                    >
                      <div>
                        <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>
                          {s.module_title || 'Safety Exploration'}
                        </span>
                        <span style={{ color: 'var(--text-dim)', marginLeft: '0.5rem', fontSize: '0.8rem' }}>
                          {new Date(s.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Duration: {Math.round(s.duration_seconds || 0)}s
                        </span>
                        <span style={{ fontWeight: '600', color: 'var(--success)' }}>
                          Score: {s.score_percentage != null ? `${Math.round(s.score_percentage)}%` : 'Completed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No sessions recorded yet.</p>
              )}
            </div>

            {/* Disclaimer */}
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-dim)',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--border-radius-sm)',
                lineHeight: '1.4'
              }}
            >
              <strong>Clinical & Safeguarding Note:</strong> High scenario practice scores reflect familiarity with safety concepts in a guided virtual simulation. They do not substitute for real-world caregiver supervision, environmental safety planning, or open family communication.
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
