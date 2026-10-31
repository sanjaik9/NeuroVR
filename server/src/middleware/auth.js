import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { query } from '../database/db.js';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (jwtErr) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token. Please log in again.'
      });
    }

    // Retrieve user from DB
    const result = await query('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.id]);
    if (!result.rows || result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User account not found'
      });
    }

    req.user = result.rows[0];

    // If learner, also attach learner profile id if exists
    if (req.user.role === 'learner') {
      const pRes = await query('SELECT id, preferred_name, current_level FROM learner_profiles WHERE user_id = $1', [req.user.id]);
      if (pRes.rows && pRes.rows.length > 0) {
        req.user.learnerProfile = pRes.rows[0];
      }
    }

    next();
  } catch (err) {
    console.error('[Auth Middleware Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal authentication error'
    });
  }
}
