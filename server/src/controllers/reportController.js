import { getMemoryStore } from '../database/db.js';
import { checkCaregiverAccessToLearner } from '../middleware/authorize.js';

export async function getLearnerReport(req, res, next) {
  try {
    const { id } = req.params;
    const user = req.user;

    if (user.role === 'caregiver') {
      const hasAccess = await checkCaregiverAccessToLearner(user.id, id, user.role);
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'Access denied: You are not authorized for this learner report' });
      }
    }

    const store = getMemoryStore();
    const learner = store.learner_profiles.find(l => l.id === id);
    if (!learner) {
      return res.status(404).json({ success: false, message: 'Learner not found' });
    }

    const userAccount = store.users.find(u => u.id === learner.user_id);
    const assignments = store.module_assignments.filter(a => a.learner_id === id);
    const sessions = store.learning_sessions.filter(s => s.learner_id === id);
    const attempts = store.assessment_attempts.filter(a => a.learner_id === id);

    const totalQuestions = attempts.reduce((acc, curr) => acc + (curr.total_questions || 0), 0);
    const totalCorrect = attempts.reduce((acc, curr) => acc + (curr.correct_answers || 0), 0);
    const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    const moduleSummaries = store.learning_modules.map(mod => {
      const assignment = assignments.find(a => a.module_id === mod.id);
      const modAttempts = attempts.filter(a => a.module_id === mod.id);
      const modQ = modAttempts.reduce((acc, curr) => acc + (curr.total_questions || 0), 0);
      const modC = modAttempts.reduce((acc, curr) => acc + (curr.correct_answers || 0), 0);
      const modAcc = modQ > 0 ? Math.round((modC / modQ) * 100) : null;

      return {
        module_number: mod.module_number,
        title: mod.title,
        status: assignment?.status || 'unassigned',
        attemptsCount: modAttempts.length,
        accuracyPercentage: modAcc,
        recommendedRepetition: assignment?.repetition_count || 1,
        needsRevision: modAcc !== null && modAcc < 75
      };
    });

    const topicsNeedingRevision = moduleSummaries
      .filter(m => m.needsRevision)
      .map(m => m.title);

    const report = {
      learner: {
        id: learner.id,
        name: learner.preferred_name,
        accountName: userAccount?.name || learner.preferred_name,
        email: userAccount?.email || 'N/A',
        currentLevel: learner.current_level,
        repetitionPreference: learner.repetition_preference,
        notes: learner.notes || ''
      },
      metrics: {
        totalLessonsCompleted: assignments.filter(a => a.status === 'completed').length,
        totalModulesAssigned: assignments.length,
        totalSessionsConducted: sessions.length,
        totalPracticeAttempts: attempts.filter(a => a.attempt_type === 'practice').length,
        totalFormalAssessments: attempts.filter(a => a.attempt_type === 'formal_assessment').length,
        overallAccuracyPercentage: overallAccuracy,
        lastSessionDate: sessions.sort((a, b) => new Date(b.started_at) - new Date(a.started_at))[0]?.started_at || null
      },
      moduleSummaries,
      topicsNeedingRevision,
      caregiverGuidanceNotes: [
        'Educational Disclaimer: This report reflects structured simulator responses only.',
        'High quiz scores indicate conceptual understanding in a guided environment, not guaranteed prevention in real-world contexts.',
        'Always combine digital practice with ongoing caregiver conversations and open trust.'
      ]
    };

    res.json({
      success: true,
      data: report
    });
  } catch (err) {
    next(err);
  }
}

export async function exportLearnerReportCsv(req, res, next) {
  try {
    const { id } = req.params;
    const user = req.user;

    if (user.role === 'caregiver') {
      const hasAccess = await checkCaregiverAccessToLearner(user.id, id, user.role);
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'Access denied to export report' });
      }
    }

    const store = getMemoryStore();
    const learner = store.learner_profiles.find(l => l.id === id);
    if (!learner) return res.status(404).json({ success: false, message: 'Learner not found' });

    const attempts = store.assessment_attempts.filter(a => a.learner_id === id);

    let csv = 'Learner Name,Module Title,Attempt Type,Score (%),Total Questions,Correct Answers,Completed At\n';

    for (const a of attempts) {
      const mod = store.learning_modules.find(m => m.id === a.module_id);
      csv += `"${learner.preferred_name}","${mod?.title || 'Safety Module'}","${a.attempt_type}",${a.score_percentage},${a.total_questions},${a.correct_answers},"${a.completed_at}"\n`;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="neurovr_report_${learner.preferred_name}_${Date.now()}.csv"`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
}
