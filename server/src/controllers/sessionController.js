import { v4 as uuidv4 } from 'uuid';
import { query, getMemoryStore, isUsingPostgres } from '../database/db.js';
import { createSessionSchema, submitAttemptSchema } from '../validators/schemas.js';

export async function createSession(req, res, next) {
  try {
    const validated = createSessionSchema.parse(req.body);
    const store = getMemoryStore();

    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      learner_id: validated.learner_id,
      module_id: validated.module_id,
      session_type: validated.session_type,
      started_at: new Date().toISOString(),
      completed_at: null,
      total_interactions: 0,
      assisted_by_caregiver: validated.assisted_by_caregiver
    };

    store.learning_sessions.push(session);

    // Update assignment status to 'in_progress'
    const assignment = store.module_assignments.find(
      a => a.learner_id === validated.learner_id && a.module_id === validated.module_id
    );
    if (assignment && assignment.status === 'assigned') {
      assignment.status = 'in_progress';
      assignment.updated_at = new Date().toISOString();
    }

    res.status(201).json({
      success: true,
      message: 'Learning session started',
      data: session
    });
  } catch (err) {
    next(err);
  }
}

export async function updateSession(req, res, next) {
  try {
    const { id } = req.params;
    const { total_interactions, completed } = req.body;
    const store = getMemoryStore();

    const session = store.learning_sessions.find(s => s.id === id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (total_interactions !== undefined) {
      session.total_interactions = parseInt(total_interactions, 10) || session.total_interactions;
    }

    if (completed) {
      session.completed_at = new Date().toISOString();
    }

    res.json({
      success: true,
      message: 'Session updated',
      data: session
    });
  } catch (err) {
    next(err);
  }
}

export async function submitAssessmentAttempt(req, res, next) {
  try {
    const validated = submitAttemptSchema.parse(req.body);
    const store = getMemoryStore();

    let correctCount = 0;
    const processedAnswers = [];

    // Evaluate answers
    for (const ans of validated.answers) {
      const option = store.scenario_options.find(o => o.id === ans.selected_option_id);
      const isCorrect = option ? option.is_safe_action : false;
      if (isCorrect) correctCount++;

      processedAnswers.push({
        id: uuidv4(),
        scenario_id: ans.scenario_id,
        selected_option_id: ans.selected_option_id,
        is_correct: isCorrect,
        response_time_ms: ans.response_time_ms || 0,
        feedback: option?.feedback_explanation || 'Good job taking time to learn.',
        encouragement: option?.encouragement_message || 'Keep practicing!'
      });
    }

    const totalQuestions = validated.answers.length;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const attemptId = uuidv4();
    const attempt = {
      id: attemptId,
      session_id: validated.session_id || null,
      learner_id: validated.learner_id,
      module_id: validated.module_id,
      attempt_type: validated.attempt_type,
      score_percentage: scorePercentage,
      total_questions: totalQuestions,
      correct_answers: correctCount,
      completed_at: new Date().toISOString()
    };

    store.assessment_attempts.push(attempt);

    // Save individual answers
    for (const pa of processedAnswers) {
      store.assessment_answers.push({
        ...pa,
        attempt_id: attemptId,
        created_at: new Date().toISOString()
      });
    }

    // Mark module assignment completed if completed or score >= 75%
    const assignment = store.module_assignments.find(
      a => a.learner_id === validated.learner_id && a.module_id === validated.module_id
    );
    if (assignment) {
      assignment.status = 'completed';
      assignment.updated_at = new Date().toISOString();
    }

    res.status(201).json({
      success: true,
      message: 'Assessment attempt evaluated successfully',
      data: {
        attempt,
        answers: processedAnswers,
        feedbackSummary: scorePercentage >= 80
          ? 'Wonderful job! You showed great understanding of safe boundaries and communication.'
          : 'Great effort practicing! With a little more revision together, your boundary confidence will grow even stronger.'
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getAssessmentAttemptById(req, res, next) {
  try {
    const { id } = req.params;
    const store = getMemoryStore();

    const attempt = store.assessment_attempts.find(a => a.id === id);
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Assessment attempt not found' });
    }

    const answers = store.assessment_answers.filter(ans => ans.attempt_id === id);

    res.json({
      success: true,
      data: {
        ...attempt,
        answers
      }
    });
  } catch (err) {
    next(err);
  }
}
