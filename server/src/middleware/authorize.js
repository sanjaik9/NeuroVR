import { query, getMemoryStore, isUsingPostgres } from '../database/db.js';

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user.role}' is not authorized to perform this action`
      });
    }

    next();
  };
}

// Ensure caregiver can only access learners they are linked to (admins have universal access)
export async function checkCaregiverAccessToLearner(caregiverId, learnerId, role) {
  if (role === 'admin') return true;

  if (isUsingPostgres()) {
    const res = await query(
      `SELECT id FROM caregiver_learner_links WHERE caregiver_id = $1 AND learner_id = $2`,
      [caregiverId, learnerId]
    );
    return res.rows && res.rows.length > 0;
  } else {
    const store = getMemoryStore();
    const link = store.caregiver_learner_links.find(
      l => l.caregiver_id === caregiverId && l.learner_id === learnerId
    );
    return !!link;
  }
}
