import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { query, getMemoryStore, isUsingPostgres } from '../database/db.js';
import { checkCaregiverAccessToLearner } from '../middleware/authorize.js';
import { createLearnerSchema, updateLearnerSchema } from '../validators/schemas.js';

export async function getLearners(req, res, next) {
  try {
    const user = req.user;
    const store = getMemoryStore();

    if (user.role === 'admin') {
      // Admins see all learner profiles
      if (isUsingPostgres()) {
        const result = await query(`
          SELECT lp.*, u.name as account_name, u.email as account_email
          FROM learner_profiles lp
          LEFT JOIN users u ON lp.user_id = u.id
          ORDER BY lp.created_at DESC
        `);
        return res.json({ success: true, data: result.rows });
      } else {
        const enriched = store.learner_profiles.map(lp => {
          const u = store.users.find(usr => usr.id === lp.user_id);
          return {
            ...lp,
            account_name: u?.name || lp.preferred_name,
            account_email: u?.email || 'N/A'
          };
        });
        return res.json({ success: true, data: enriched });
      }
    }

    if (user.role === 'caregiver') {
      // Caregiver sees learners linked to them
      if (isUsingPostgres()) {
        const result = await query(`
          SELECT lp.*, cl.relationship_type, cl.permissions, u.name as account_name, u.email as account_email
          FROM caregiver_learner_links cl
          JOIN learner_profiles lp ON cl.learner_id = lp.id
          LEFT JOIN users u ON lp.user_id = u.id
          WHERE cl.caregiver_id = $1
          ORDER BY lp.created_at DESC
        `, [user.id]);
        return res.json({ success: true, data: result.rows });
      } else {
        const links = store.caregiver_learner_links.filter(l => l.caregiver_id === user.id);
        const learnerIds = links.map(l => l.learner_id);
        const profiles = store.learner_profiles
          .filter(lp => learnerIds.includes(lp.id))
          .map(lp => {
            const link = links.find(l => l.learner_id === lp.id);
            const u = store.users.find(usr => usr.id === lp.user_id);
            return {
              ...lp,
              relationship_type: link?.relationship_type || 'Caregiver',
              permissions: link?.permissions || {},
              account_name: u?.name || lp.preferred_name,
              account_email: u?.email || 'N/A'
            };
          });
        return res.json({ success: true, data: profiles });
      }
    }

    // Learner can only see their own profile
    if (user.role === 'learner') {
      if (isUsingPostgres()) {
        const result = await query('SELECT * FROM learner_profiles WHERE user_id = $1', [user.id]);
        return res.json({ success: true, data: result.rows });
      } else {
        const profiles = store.learner_profiles.filter(lp => lp.user_id === user.id);
        return res.json({ success: true, data: profiles });
      }
    }

    res.json({ success: true, data: [] });
  } catch (err) {
    next(err);
  }
}

export async function createLearner(req, res, next) {
  try {
    const validated = createLearnerSchema.parse(req.body);
    const caregiverId = req.user.id;
    const store = getMemoryStore();

    // Create user account for learner
    const userId = uuidv4();
    const learnerEmail = validated.email || `learner_${Date.now()}@neurovr.local`;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('LearnerPass123!', salt);

    await query(
      `INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, validated.name.trim(), learnerEmail, passwordHash, 'learner', new Date().toISOString(), new Date().toISOString()]
    );

    // Create learner profile
    const profileId = uuidv4();
    await query(
      `INSERT INTO learner_profiles (id, user_id, preferred_name, current_level, repetition_preference, avatar_id, notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        profileId,
        userId,
        validated.preferred_name,
        validated.current_level,
        validated.repetition_preference,
        validated.avatar_id,
        validated.notes || '',
        new Date().toISOString(),
        new Date().toISOString()
      ]
    );

    // Link caregiver to learner
    const linkId = uuidv4();
    if (isUsingPostgres()) {
      await query(
        `INSERT INTO caregiver_learner_links (id, caregiver_id, learner_id, relationship_type, permissions, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [linkId, caregiverId, profileId, validated.relationship_type, JSON.stringify({ can_assign: true, can_view_reports: true }), new Date().toISOString()]
      );
    } else {
      store.caregiver_learner_links.push({
        id: linkId,
        caregiver_id: caregiverId,
        learner_id: profileId,
        relationship_type: validated.relationship_type,
        permissions: { can_assign: true, can_view_reports: true },
        created_at: new Date().toISOString()
      });
    }

    // Default accessibility
    const accId = uuidv4();
    await query(
      `INSERT INTO accessibility_preferences (id, user_id, high_contrast, contrast_theme, text_scale, tts_enabled, tts_speed, captions_enabled, reduced_motion, caregiver_assistance_mode, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [accId, userId, false, 'normal', 'normal', true, 1.0, true, false, false, new Date().toISOString()]
    );

    // Auto-assign Module 1
    const assignId = uuidv4();
    let mod1Id = 'm1111111-0001-0000-0000-000000000001';
    if (isUsingPostgres()) {
      const mRes = await query('SELECT id FROM learning_modules WHERE module_number = 1');
      if (mRes.rows[0]) mod1Id = mRes.rows[0].id;
    }
    await query(
      `INSERT INTO module_assignments (id, module_id, learner_id, assigned_by, status, repetition_count, difficulty_level, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [assignId, mod1Id, profileId, caregiverId, 'assigned', validated.repetition_preference, 'standard', new Date().toISOString()]
    );

    res.status(201).json({
      success: true,
      message: 'Learner profile created and linked successfully',
      data: {
        id: profileId,
        user_id: userId,
        preferred_name: validated.preferred_name,
        current_level: validated.current_level,
        repetition_preference: validated.repetition_preference,
        avatar_id: validated.avatar_id,
        relationship_type: validated.relationship_type
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getLearnerById(req, res, next) {
  try {
    const { id } = req.params;
    const user = req.user;

    // Check authorization
    if (user.role === 'caregiver') {
      const hasAccess = await checkCaregiverAccessToLearner(user.id, id, user.role);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You are not authorized to view this learner profile'
        });
      }
    } else if (user.role === 'learner') {
      if (user.learnerProfile?.id !== id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only view your own profile'
        });
      }
    }

    let profile;
    const store = getMemoryStore();
    if (isUsingPostgres()) {
      const resProfile = await query('SELECT * FROM learner_profiles WHERE id = $1', [id]);
      profile = resProfile.rows[0];
    } else {
      profile = store.learner_profiles.find(p => p.id === id);
    }

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Learner profile not found' });
    }

    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

export async function updateLearner(req, res, next) {
  try {
    const { id } = req.params;
    const user = req.user;
    const validated = updateLearnerSchema.parse(req.body);

    if (user.role === 'caregiver') {
      const hasAccess = await checkCaregiverAccessToLearner(user.id, id, user.role);
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'Access denied: Not authorized for this learner' });
      }
    }

    const store = getMemoryStore();
    if (isUsingPostgres()) {
      const existing = await query('SELECT * FROM learner_profiles WHERE id = $1', [id]);
      if (!existing.rows[0]) return res.status(404).json({ success: false, message: 'Learner profile not found' });

      const updated = { ...existing.rows[0], ...validated, updated_at: new Date().toISOString() };
      await query(
        `UPDATE learner_profiles
         SET preferred_name = $1, current_level = $2, repetition_preference = $3, avatar_id = $4, notes = $5, updated_at = $6
         WHERE id = $7`,
        [updated.preferred_name, updated.current_level, updated.repetition_preference, updated.avatar_id, updated.notes, updated.updated_at, id]
      );
      return res.json({ success: true, message: 'Learner updated successfully', data: updated });
    } else {
      const profile = store.learner_profiles.find(p => p.id === id);
      if (!profile) return res.status(404).json({ success: false, message: 'Learner profile not found' });

      Object.assign(profile, validated, { updated_at: new Date().toISOString() });
      return res.json({ success: true, message: 'Learner updated successfully', data: profile });
    }
  } catch (err) {
    next(err);
  }
}

export async function getLearnerProgress(req, res, next) {
  try {
    const { id } = req.params;
    const user = req.user;

    if (user.role === 'caregiver') {
      const hasAccess = await checkCaregiverAccessToLearner(user.id, id, user.role);
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'Access denied to learner progress' });
      }
    }

    const store = getMemoryStore();
    const attempts = store.assessment_attempts.filter(a => a.learner_id === id);
    const sessions = store.learning_sessions.filter(s => s.learner_id === id);
    const assignments = store.module_assignments.filter(a => a.learner_id === id);

    // Compute metrics
    const totalSessions = sessions.length;
    const completedLessons = assignments.filter(a => a.status === 'completed').length;
    const practiceAttempts = attempts.filter(a => a.attempt_type === 'practice').length;
    const formalAssessments = attempts.filter(a => a.attempt_type === 'formal_assessment').length;

    const totalQuestions = attempts.reduce((acc, curr) => acc + (curr.total_questions || 0), 0);
    const totalCorrect = attempts.reduce((acc, curr) => acc + (curr.correct_answers || 0), 0);
    const quizAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Module-wise performance
    const modulePerformance = store.learning_modules.map(mod => {
      const modAttempts = attempts.filter(a => a.module_id === mod.id);
      const modQuestions = modAttempts.reduce((acc, curr) => acc + (curr.total_questions || 0), 0);
      const modCorrect = modAttempts.reduce((acc, curr) => acc + (curr.correct_answers || 0), 0);
      const accuracy = modQuestions > 0 ? Math.round((modCorrect / modQuestions) * 100) : null;
      const assignment = assignments.find(a => a.module_id === mod.id);

      return {
        module_id: mod.id,
        module_number: mod.module_number,
        title: mod.title,
        status: assignment?.status || 'not_assigned',
        attemptsCount: modAttempts.length,
        accuracy: accuracy,
        needsPractice: accuracy !== null && accuracy < 75
      };
    });

    const topicsNeedingPractice = modulePerformance
      .filter(m => m.needsPractice || (m.status === 'in_progress' && m.accuracy !== null && m.accuracy < 80))
      .map(m => m.title);

    const lastSession = sessions.sort((a, b) => new Date(b.started_at) - new Date(a.started_at))[0];

    res.json({
      success: true,
      data: {
        learner_id: id,
        totalLessonsCompleted: completedLessons,
        currentLearningLevel: store.learner_profiles.find(p => p.id === id)?.current_level || 'beginner',
        quizAccuracy,
        totalPracticeAttempts: practiceAttempts,
        totalFormalAssessments: formalAssessments,
        totalSessions,
        lastSessionDate: lastSession?.started_at || null,
        topicsNeedingPractice,
        modulePerformance,
        recentAttempts: attempts.slice(-5).reverse()
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getLearnerHistory(req, res, next) {
  try {
    const { id } = req.params;
    const user = req.user;

    if (user.role === 'caregiver') {
      const hasAccess = await checkCaregiverAccessToLearner(user.id, id, user.role);
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    const store = getMemoryStore();
    const sessions = store.learning_sessions
      .filter(s => s.learner_id === id)
      .map(s => {
        const mod = store.learning_modules.find(m => m.id === s.module_id);
        const relatedAttempts = store.assessment_attempts.filter(a => a.session_id === s.id);
        return {
          ...s,
          module_title: mod?.title || 'Safety Module',
          module_number: mod?.module_number || 1,
          attempts: relatedAttempts
        };
      })
      .sort((a, b) => new Date(b.started_at) - new Date(a.started_at));

    res.json({ success: true, data: sessions });
  } catch (err) {
    next(err);
  }
}
