import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Volume2,
  CheckCircle,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Users,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import ThreeVRScene from '../vr/ThreeVRScene.jsx';
import FeedbackModal from './FeedbackModal.jsx';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAccessibility } from '../../context/AccessibilityContext.jsx';

export default function ScenarioPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLearner } = useAuth();
  const { speak, ttsEnabled, caregiverAssistedMode, setCaregiverAssistedMode } = useAccessibility();

  const [moduleData, setModuleData] = useState(null);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [bubbleRadius, setBubbleRadius] = useState(1.4);

  // Fetch module and initialize session
  useEffect(() => {
    async function initModule() {
      try {
        setLoading(true);
        const res = await api.getModuleById(id);
        if (res.success && res.data) {
          setModuleData(res.data);

          // If logged in as learner, start a learning session
          const learnerId = user?.learnerProfile?.id;
          if (learnerId) {
            try {
              const sessRes = await api.startSession({
                learner_id: learnerId,
                module_id: res.data.id,
                session_type: 'guided_lesson',
                assisted_by_caregiver: caregiverAssistedMode
              });
              if (sessRes.success && sessRes.data) {
                setSessionId(sessRes.data.id);
              }
            } catch (sErr) {
              console.warn('[Session Start Notice]:', sErr.message);
            }
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load module');
      } finally {
        setLoading(false);
        setStartTime(Date.now());
      }
    }
    initModule();
  }, [id, user]);

  const currentScenario = moduleData?.scenarios?.[currentScenarioIndex];

  // Auto-speak scenario prompt when scenario changes
  useEffect(() => {
    if (currentScenario && ttsEnabled) {
      speak(`${currentScenario.title}. ${currentScenario.narrator_prompt}`);
    }
    setStartTime(Date.now());
  }, [currentScenarioIndex, currentScenario]);

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);
    const responseTimeMs = Date.now() - startTime;

    // Record attempt
    const newRecord = {
      scenario_id: currentScenario.id,
      selected_option_id: option.id,
      is_correct: option.is_safe_action,
      response_time_ms: responseTimeMs
    };
    const updatedHistory = [...attemptHistory, newRecord];
    setAttemptHistory(updatedHistory);

    // If session is active, submit attempt
    const learnerId = user?.learnerProfile?.id;
    if (learnerId && moduleData) {
      try {
        await api.submitAttempt({
          session_id: sessionId,
          learner_id: learnerId,
          module_id: moduleData.id,
          attempt_type: 'practice',
          answers: [newRecord]
        });
      } catch (aErr) {
        // Continue smoothly
      }
    }

    setFeedbackOpen(true);
  };

  const handleNextScenario = () => {
    setFeedbackOpen(false);
    setSelectedOption(null);

    if (currentScenarioIndex < (moduleData?.scenarios?.length || 0) - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      if (ttsEnabled) {
        speak('Congratulations! You completed all practice scenarios in this module.');
      }
    }
  };

  const handleRetryScenario = () => {
    setFeedbackOpen(false);
    setSelectedOption(null);
    setStartTime(Date.now());
  };

  const handleRestartModule = () => {
    setCurrentScenarioIndex(0);
    setAttemptHistory([]);
    setSelectedOption(null);
    setIsCompleted(false);
    setStartTime(Date.now());
  };

  if (loading) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <Sparkles className="pulsing-bubble" size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h2>Loading 3D Safety Environment...</h2>
          <p style={{ color: 'var(--text-muted)' }}>Preparing safe space and characters...</p>
        </div>
      </div>
    );
  }

  if (error || !moduleData) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', borderColor: 'var(--danger)' }}>
          <h2>Module Not Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>{error || 'Unable to retrieve module details.'}</p>
          <Link to="/modules" className="btn btn-primary">
            <ArrowLeft size={18} />
            <span>Return to Modules</span>
          </Link>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Module Completion Summary View
  // --------------------------------------------------------------------------
  if (isCompleted) {
    const totalAnswered = attemptHistory.length;
    const safeChoices = attemptHistory.filter(a => a.is_correct).length;
    const scorePct = totalAnswered > 0 ? Math.round((safeChoices / totalAnswered) * 100) : 100;

    return (
      <div className="main-content" style={{ maxWidth: '800px', padding: '2rem 1rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div
            style={{
              width: '90px',
              height: '90px',
              margin: '0 auto 1.5rem',
              borderRadius: '50%',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--success-border)'
            }}
          >
            <ShieldCheck size={56} />
          </div>

          <h1 style={{ fontSize: '2em', color: 'var(--success)', marginBottom: '0.5rem' }}>
            Module Completed! Great Job!
          </h1>
          <p style={{ fontSize: '1.2em', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            You practiced personal boundary safety for "{moduleData.title}".
          </p>

          <div
            className="grid-cols-auto"
            style={{ margin: '2rem 0', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}
          >
            <div className="card" style={{ background: 'var(--bg-surface-elevated)' }}>
              <span style={{ fontSize: '0.9em', color: 'var(--text-muted)' }}>Safety Accuracy</span>
              <p style={{ fontSize: '2em', fontWeight: 800, color: 'var(--primary)' }}>{scorePct}%</p>
            </div>
            <div className="card" style={{ background: 'var(--bg-surface-elevated)' }}>
              <span style={{ fontSize: '0.9em', color: 'var(--text-muted)' }}>Scenarios Mastered</span>
              <p style={{ fontSize: '2em', fontWeight: 800, color: 'var(--success)' }}>
                {moduleData.scenarios?.length} / {moduleData.scenarios?.length}
              </p>
            </div>
            <div className="card" style={{ background: 'var(--bg-surface-elevated)' }}>
              <span style={{ fontSize: '0.9em', color: 'var(--text-muted)' }}>Safety Stars</span>
              <p style={{ fontSize: '2em', fontWeight: 800, color: 'var(--warning)' }}>⭐ {safeChoices}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-outline btn-large" onClick={handleRestartModule}>
              <RotateCcw size={20} />
              <span>Practice This Module Again</span>
            </button>

            <Link to="/modules" className="btn btn-primary btn-large">
              <span>Next Safety Module</span>
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Interactive Active Scenario View
  // --------------------------------------------------------------------------
  const scenariosTotal = moduleData.scenarios?.length || 1;

  return (
    <div className="main-content" style={{ maxWidth: '1100px', padding: '1rem' }}>
      {/* Top Navigation & Progress Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <Link to="/modules" className="btn btn-outline" style={{ minHeight: '40px' }}>
          <ArrowLeft size={16} />
          <span>All Modules</span>
        </Link>

        {/* Scenario Progress Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.95em' }}>
            Scenario {currentScenarioIndex + 1} of {scenariosTotal}
          </span>
          <div
            style={{
              width: '140px',
              height: '10px',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: '999px',
              overflow: 'hidden',
              border: '1px solid var(--border-color)'
            }}
          >
            <div
              style={{
                width: `${((currentScenarioIndex + 1) / scenariosTotal) * 100}%`,
                height: '100%',
                backgroundColor: 'var(--primary)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Caregiver Assisted Mode Quick Toggle */}
        <button
          className={`btn ${caregiverAssistedMode ? 'btn-accent' : 'btn-outline'}`}
          style={{ minHeight: '40px', fontSize: '0.85em' }}
          onClick={() => setCaregiverAssistedMode(!caregiverAssistedMode)}
          title="Toggle Educator / Caregiver Guide Notes"
        >
          <Users size={16} />
          <span>Caregiver Assist: {caregiverAssistedMode ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Module Title & Scenario Heading */}
      <div style={{ marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.9em', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>
          Module {moduleData.module_number}: {moduleData.title}
        </span>
        <h1 style={{ fontSize: '1.7em', marginTop: '0.2rem' }}>{currentScenario?.title}</h1>
      </div>

      {/* 3D Three.js VR Simulation Scene */}
      <ThreeVRScene
        environmentType={currentScenario?.environment_type || 'room'}
        characterSetup={currentScenario?.character_setup || {}}
        scenarioTitle={currentScenario?.title}
        narratorPrompt={currentScenario?.narrator_prompt}
        guidanceTip={currentScenario?.guidance_tip}
        bubbleRadius={bubbleRadius}
        onBubbleRadiusChange={setBubbleRadius}
      />

      {/* Narrator Prompt Box */}
      <div
        className="card"
        style={{
          marginTop: '1rem',
          backgroundColor: 'var(--bg-surface-elevated)',
          borderLeft: '5px solid var(--primary)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.85em', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
              What is happening:
            </span>
            <p style={{ fontSize: '1.2em', fontWeight: 500, marginTop: '0.25rem', lineHeight: 1.6 }}>
              {currentScenario?.narrator_prompt}
            </p>
          </div>
          <button
            className="btn btn-outline"
            style={{ minHeight: '44px', whiteSpace: 'nowrap' }}
            onClick={() => speak(currentScenario?.narrator_prompt)}
            title="Read scenario description"
          >
            <Volume2 size={18} />
            <span>Read</span>
          </button>
        </div>

        {currentScenario?.guidance_tip && (
          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.6rem 0.9rem',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--border-radius-sm)',
              fontSize: '0.95em',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Info size={18} color="var(--accent)" />
            <span>Tip: {currentScenario.guidance_tip}</span>
          </div>
        )}
      </div>

      {/* Caregiver Guided Discussion Notes (If Assisted Mode active) */}
      {caregiverAssistedMode && (
        <div
          className="card"
          style={{
            marginTop: '1rem',
            backgroundColor: 'rgba(20, 184, 166, 0.1)',
            borderColor: 'var(--accent)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Users size={18} color="var(--accent)" />
            <h3 style={{ fontSize: '1.05em', color: 'var(--accent)' }}>Caregiver & Educator Guidance Note</h3>
          </div>
          <p style={{ fontSize: '0.95em', color: 'var(--text-main)', lineHeight: 1.5 }}>
            • Encourage the learner to look at the green Personal Bubble in 3D. Ask: "Do you feel like they are too close to your bubble?"
            <br />
            • Reinforce that saying "Please give me space" is always polite, safe, and their right.
          </p>
        </div>
      )}

      {/* Decision Options Grid */}
      <div style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Choose what you want to do:</span>
        </h2>

        <div className="grid-cols-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {currentScenario?.options?.map((option, idx) => (
            <button
              key={option.id || idx}
              className="card"
              onClick={() => handleOptionSelect(option)}
              style={{
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.25rem',
                cursor: 'pointer',
                backgroundColor: 'var(--bg-surface)',
                borderWidth: '2px',
                borderColor: 'var(--border-color)',
                transition: 'all 0.2s ease',
                minHeight: '120px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    textAlign: 'center',
                    lineHeight: '32px',
                    fontWeight: 700,
                    fontSize: '0.9em',
                    color: 'var(--primary)'
                  }}
                >
                  {String.fromCharCode(65 + idx)}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(option.option_text);
                  }}
                  style={{ opacity: 0.8, padding: '0.2rem' }}
                  title="Read option aloud"
                  aria-label={`Read option ${String.fromCharCode(65 + idx)} aloud`}
                >
                  <Volume2 size={18} />
                </button>
              </div>

              <p style={{ fontSize: '1.15em', fontWeight: 600, marginTop: '0.75rem', lineHeight: 1.4 }}>
                {option.option_text}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Gentle Trauma-Informed Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        isSafeAction={selectedOption?.is_safe_action}
        explanation={selectedOption?.feedback_explanation || ''}
        encouragement={selectedOption?.encouragement_message || ''}
        onNext={handleNextScenario}
        onRetry={handleRetryScenario}
        isLastScenario={currentScenarioIndex >= scenariosTotal - 1}
      />
    </div>
  );
}
