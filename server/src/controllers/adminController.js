import { v4 as uuidv4 } from 'uuid';
import { getMemoryStore, query, isUsingPostgres } from '../database/db.js';

export async function getAdminUsers(req, res, next) {
  try {
    const store = getMemoryStore();
    const users = store.users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      created_at: u.created_at
    }));

    res.json({
      success: true,
      data: users
    });
  } catch (err) {
    next(err);
  }
}

export async function updateAdminUser(req, res, next) {
  try {
    const { id } = req.params;
    const { role, name } = req.body;
    const store = getMemoryStore();

    const user = store.users.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role && ['learner', 'caregiver', 'admin'].includes(role)) {
      user.role = role;
    }
    if (name) {
      user.name = name.trim();
    }
    user.updated_at = new Date().toISOString();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function createAdminModule(req, res, next) {
  try {
    const { title, subtitle, description, icon_name, estimated_minutes, difficulty_level } = req.body;
    const store = getMemoryStore();

    const newModuleNumber = store.learning_modules.length + 1;
    const moduleId = uuidv4();

    const newModule = {
      id: moduleId,
      module_number: newModuleNumber,
      title: title || `Module ${newModuleNumber}`,
      subtitle: subtitle || 'New Safety Lesson',
      description: description || 'Educational safety activity.',
      icon_name: icon_name || 'ShieldCheck',
      estimated_minutes: parseInt(estimated_minutes, 10) || 10,
      difficulty_level: difficulty_level || 'beginner'
    };

    store.learning_modules.push(newModule);

    res.status(201).json({
      success: true,
      message: 'Learning module created successfully',
      data: newModule
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdminStats(req, res, next) {
  try {
    const store = getMemoryStore();

    const stats = {
      totalUsers: store.users.length,
      usersByRole: {
        learners: store.users.filter(u => u.role === 'learner').length,
        caregivers: store.users.filter(u => u.role === 'caregiver').length,
        admins: store.users.filter(u => u.role === 'admin').length
      },
      totalLearnerProfiles: store.learner_profiles.length,
      totalModules: store.learning_modules.length,
      totalScenarios: store.learning_scenarios.length,
      totalSessionsConducted: store.learning_sessions.length,
      totalAssessmentAttempts: store.assessment_attempts.length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    next(err);
  }
}
