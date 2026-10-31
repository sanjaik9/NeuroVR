// Seed script for PostgreSQL database
import dotenv from 'dotenv';
import pg from 'pg';
import { getSeedData } from './seedData.js';

dotenv.config();

async function runSeeds() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.log('[Seed] No DATABASE_URL specified. In-memory fallback will automatically use seedData.');
    return;
  }

  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    console.log('[Seed] Connected to PostgreSQL. Seeding demo content...');

    const data = getSeedData();

    // 1. Users
    for (const u of data.users) {
      await client.query(
        `INSERT INTO users (id, name, email, password_hash, role, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [u.id, u.name, u.email, u.password_hash, u.role, u.created_at]
      );
    }

    // 2. Learner Profiles
    for (const lp of data.learner_profiles) {
      await client.query(
        `INSERT INTO learner_profiles (id, user_id, preferred_name, current_level, repetition_preference, avatar_id, notes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [lp.id, lp.user_id, lp.preferred_name, lp.current_level, lp.repetition_preference, lp.avatar_id, lp.notes, lp.created_at]
      );
    }

    // 3. Links
    for (const link of data.caregiver_learner_links) {
      await client.query(
        `INSERT INTO caregiver_learner_links (id, caregiver_id, learner_id, relationship_type, permissions, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (caregiver_id, learner_id) DO NOTHING`,
        [link.id, link.caregiver_id, link.learner_id, link.relationship_type, JSON.stringify(link.permissions), link.created_at]
      );
    }

    // 4. Learning Modules
    for (const m of data.learning_modules) {
      await client.query(
        `INSERT INTO learning_modules (id, module_number, title, subtitle, description, icon_name, estimated_minutes, difficulty_level)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [m.id, m.module_number, m.title, m.subtitle, m.description, m.icon_name, m.estimated_minutes, m.difficulty_level]
      );
    }

    // 5. Scenarios
    for (const s of data.learning_scenarios) {
      await client.query(
        `INSERT INTO learning_scenarios (id, module_id, scenario_order, title, environment_type, narrator_prompt, character_setup, guidance_tip, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING`,
        [s.id, s.module_id, s.scenario_order, s.title, s.environment_type, s.narrator_prompt, JSON.stringify(s.character_setup), s.guidance_tip, s.created_at || new Date().toISOString()]
      );
    }

    // 6. Options
    for (const o of data.scenario_options) {
      await client.query(
        `INSERT INTO scenario_options (id, scenario_id, option_text, is_safe_action, feedback_explanation, encouragement_message, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
        [o.id, o.scenario_id, o.option_text, o.is_safe_action, o.feedback_explanation, o.encouragement_message, o.order_index]
      );
    }

    // 7. Assignments
    for (const a of data.module_assignments) {
      await client.query(
        `INSERT INTO module_assignments (id, module_id, learner_id, assigned_by, status, repetition_count, difficulty_level, due_date, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING`,
        [a.id, a.module_id, a.learner_id, a.assigned_by, a.status, a.repetition_count, a.difficulty_level, a.due_date, a.created_at]
      );
    }

    // 8. Accessibility Preferences
    for (const p of data.accessibility_preferences) {
      await client.query(
        `INSERT INTO accessibility_preferences (id, user_id, high_contrast, contrast_theme, text_scale, tts_enabled, tts_speed, captions_enabled, reduced_motion, caregiver_assistance_mode, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (user_id) DO NOTHING`,
        [p.id, p.user_id, p.high_contrast, p.contrast_theme, p.text_scale, p.tts_enabled, p.tts_speed, p.captions_enabled, p.reduced_motion, p.caregiver_assistance_mode, p.updated_at]
      );
    }

    console.log('[Seed] PostgreSQL seeding finished successfully.');
  } catch (err) {
    console.error('[Seed Error]:', err.message);
  } finally {
    await client.end().catch(() => {});
  }
}

runSeeds();
