import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query, getMemoryStore, isUsingPostgres } from '../database/db.js';
import { config } from '../config/index.js';
import { registerSchema, loginSchema } from '../validators/schemas.js';

export async function register(req, res, next) {
  try {
    const validated = registerSchema.parse(req.body);
    const emailLower = validated.email.toLowerCase().trim();

    // Check if email already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [emailLower]);
    if (existing.rows && existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validated.password, salt);
    const userId = uuidv4();

    // Insert user
    await query(
      `INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, validated.name.trim(), emailLower, passwordHash, validated.role, new Date().toISOString(), new Date().toISOString()]
    );

    let learnerProfile = null;
    if (validated.role === 'learner') {
      const profileId = uuidv4();
      const preferredName = validated.preferred_name || validated.name.split(' ')[0];
      await query(
        `INSERT INTO learner_profiles (id, user_id, preferred_name, current_level, repetition_preference, avatar_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [profileId, userId, preferredName, 'beginner', 1, 'avatar-friendly-1', new Date().toISOString(), new Date().toISOString()]
      );
      learnerProfile = {
        id: profileId,
        user_id: userId,
        preferred_name: preferredName,
        current_level: 'beginner',
        repetition_preference: 1,
        avatar_id: 'avatar-friendly-1'
      };
    }

    // Initialize default accessibility preferences
    const prefId = uuidv4();
    await query(
      `INSERT INTO accessibility_preferences (id, user_id, high_contrast, contrast_theme, text_scale, tts_enabled, tts_speed, captions_enabled, reduced_motion, caregiver_assistance_mode, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [prefId, userId, false, 'normal', 'normal', true, 1.0, true, false, false, new Date().toISOString()]
    );

    const token = jwt.sign(
      { id: userId, email: emailLower, role: validated.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        token,
        user: {
          id: userId,
          name: validated.name.trim(),
          email: emailLower,
          role: validated.role,
          learnerProfile
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const validated = loginSchema.parse(req.body);
    const emailLower = validated.email.toLowerCase().trim();

    let user;
    if (isUsingPostgres()) {
      const resUser = await query('SELECT * FROM users WHERE email = $1', [emailLower]);
      user = resUser.rows[0];
    } else {
      const store = getMemoryStore();
      user = store.users.find(u => u.email.toLowerCase() === emailLower);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(validated.password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    let learnerProfile = null;
    if (user.role === 'learner') {
      if (isUsingPostgres()) {
        const pRes = await query('SELECT * FROM learner_profiles WHERE user_id = $1', [user.id]);
        learnerProfile = pRes.rows[0];
      } else {
        const store = getMemoryStore();
        learnerProfile = store.learner_profiles.find(p => p.user_id === user.id);
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          learnerProfile
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}

export async function getMe(req, res, next) {
  try {
    const user = req.user;
    let learnerProfile = null;
    let preferences = null;

    if (isUsingPostgres()) {
      if (user.role === 'learner') {
        const pRes = await query('SELECT * FROM learner_profiles WHERE user_id = $1', [user.id]);
        learnerProfile = pRes.rows[0] || null;
      }
      const aRes = await query('SELECT * FROM accessibility_preferences WHERE user_id = $1', [user.id]);
      preferences = aRes.rows[0] || null;
    } else {
      const store = getMemoryStore();
      if (user.role === 'learner') {
        learnerProfile = store.learner_profiles.find(p => p.user_id === user.id) || null;
      }
      preferences = store.accessibility_preferences.find(p => p.user_id === user.id) || null;
    }

    res.json({
      success: true,
      data: {
        user: {
          ...user,
          learnerProfile,
          preferences
        }
      }
    });
  } catch (err) {
    next(err);
  }
}
