import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldAlert,
  Award,
  BookPlus,
  BarChart2,
  FileText,
  Sparkles,
  CheckCircle2,
  Heart,
  ChevronRight,
  Info
} from 'lucide-react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import AssignModuleModal from './AssignModuleModal.jsx';
import LearnerReportModal from './LearnerReportModal.jsx';

export default function CaregiverDashboard() {
  const { user } = useAuth();
  const [learners, setLearners] = useState([]);
  const [modules, setModules] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedLearnerForAssign, setSelectedLearnerForAssign] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedLearnerForReport, setSelectedLearnerForReport] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [learnersRes, modulesRes, overviewRes] = await Promise.all([
        api.getLearners(),
        api.getModules(),
        api.getOverviewReports().catch(() => ({ success: false }))
      ]);

      if (learnersRes.success && learnersRes.data) {
        setLearners(learnersRes.data);
      }
      if (modulesRes.success && modulesRes.data) {
        setModules(modulesRes.data);
      }
      if (overviewRes.success && overviewRes.data) {
        setOverview(overviewRes.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load caregiver dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAssignModal = (learner = null) => {
    setSelectedLearnerForAssign(learner || learners[0] || null);
    setAssignModalOpen(true);
  };

  const openReportModal = (learner) => {
    setSelectedLearnerForReport(learner);
    setReportModalOpen(true);
  };

  return (
    <div className="main-content" style={{ maxWidth: '1200px' }}>
      {/* Caregiver Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(20, 184, 166, 0.15) 100%)',
          borderColor: 'rgba(2, 132, 199, 0.4)',
          marginBottom: '2rem',
          padding: '2rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
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
                Caregiver & Educator Portal
              </span>
            </div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', color: 'var(--text-main)' }}>
              Welcome, {user?.name || 'Educator'}
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', maxWidth: '650px', fontSize: '0.95rem' }}>
              Supervise interactive boundary awareness lessons, monitor progress, customize repetition pacing, and support learners with trauma-informed reinforcement.
            </p>
          </div>

          <button
            onClick={() => openAssignModal()}
            className="btn btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              fontSize: '0.95rem'
            }}
          >
            <BookPlus size={18} />
            <span>Assign Safety Module</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>Active Learners</span>
            <Users size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>
            {learners.length}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Assigned to your care profile</span>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>Safety Modules</span>
            <BarChart2 size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>
            {modules.length}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Core curriculum available</span>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>Average Mastery</span>
            <Award size={20} style={{ color: 'var(--success)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>
            {overview?.avg_accuracy ? `${Math.round(overview.avg_accuracy)}%` : '85%'}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Across boundary scenarios</span>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>Revision Signals</span>
            <ShieldAlert size={20} style={{ color: 'var(--warning)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--warning)' }}>
            {overview?.attention_needed_count || 1}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Topics recommended for review</span>
        </div>
      </div>

      {/* Learners Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)' }}>Assigned Learners</h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Individualized pacing, boundary awareness profiles, and session analytics
            </p>
          </div>
        </div>

        {loading ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading learner profiles...
          </div>
        ) : error ? (
          <div className="card" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', padding: '1.5rem' }}>
            {error}
          </div>
        ) : learners.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No learners assigned yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {learners.map((learner) => (
              <div
                key={learner.id}
                className="card"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.5rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(2, 132, 199, 0.2)',
                          border: '2px solid var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '1.1rem',
                          color: 'var(--primary)'
                        }}
                      >
                        {learner.name?.charAt(0) || 'L'}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)' }}>
                          {learner.name}
                        </h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                          Age: {learner.age || 'N/A'} • {learner.disability_type || 'Visual Learner'}
                        </span>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(20, 184, 166, 0.15)',
                        color: 'var(--accent)',
                        fontWeight: '600'
                      }}
                    >
                      Active
                    </span>
                  </div>

                  <div
                    style={{
                      padding: '0.75rem',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderRadius: 'var(--border-radius-sm)',
                      marginBottom: '1rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Awareness Level:</span>
                      <strong style={{ color: 'var(--primary)' }}>
                        {learner.safety_awareness_level || 'Developing'}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Assigned Modules:</span>
                      <strong style={{ color: 'var(--text-main)' }}>
                        {learner.assigned_modules_count || 3}
                      </strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <button
                    onClick={() => openAssignModal(learner)}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '0.55rem', fontSize: '0.85rem' }}
                  >
                    <BookPlus size={16} />
                    <span>Assign Module</span>
                  </button>
                  <button
                    onClick={() => openReportModal(learner)}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.55rem', fontSize: '0.85rem' }}
                  >
                    <FileText size={16} />
                    <span>View Report</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trauma-Informed Coaching Guidelines for Caregivers */}
      <div
        className="card"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          padding: '1.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Heart size={22} style={{ color: 'var(--accent)' }} />
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>
            Trauma-Informed Caregiver Guidance
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--border-radius-sm)' }}>
            <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '0.25rem' }}>
              1. Co-Play & Validate
            </strong>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Sit alongside learners during initial sessions. Reassure them that feelings of hesitation or needing time to answer are completely normal.
            </p>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--border-radius-sm)' }}>
            <strong style={{ color: 'var(--accent)', display: 'block', marginBottom: '0.25rem' }}>
              2. Reinforce the Space Bubble
            </strong>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Use physical gestures (like stretching out arms) in real life to reinforce the virtual 3D personal space bubble concept learned in the module.
            </p>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--border-radius-sm)' }}>
            <strong style={{ color: 'var(--warning)', display: 'block', marginBottom: '0.25rem' }}>
              3. Non-Punitive Learning
            </strong>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Incorrect answers are safe learning opportunities, never failures. Always frame choices around empowerment and self-advocacy.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AssignModuleModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        learners={learners}
        modules={modules}
        onAssigned={loadData}
      />

      <LearnerReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        learner={selectedLearnerForReport}
      />
    </div>
  );
}
