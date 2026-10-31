// NeuroVR-2.0 Database Adapter
// Connects to PostgreSQL via pg.Pool.
// If PostgreSQL is unreachable or USE_MEMORY_DB=true is configured,
// seamlessly uses an embedded in-memory relational store with seed data.

import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { getSeedData } from './seedData.js';

const { Pool } = pg;

let pool = null;
let isPgConnected = false;
let memoryStore = null;

// Initialize in-memory store with seed data
function initMemoryStore() {
  const seed = getSeedData();
  memoryStore = {
    users: [...seed.users],
    learner_profiles: [...seed.learner_profiles],
    caregiver_learner_links: [...seed.caregiver_learner_links],
    learning_modules: [...seed.learning_modules],
    learning_scenarios: [...seed.learning_scenarios],
    scenario_options: [...seed.scenario_options],
    module_assignments: [...seed.module_assignments],
    learning_sessions: [...seed.learning_sessions],
    assessment_attempts: [...seed.assessment_attempts],
    assessment_answers: [...seed.assessment_answers],
    accessibility_preferences: [...seed.accessibility_preferences]
  };
  console.log('[Database] In-memory relational store initialized with seed records:');
  console.log(` - Users: ${memoryStore.users.length}`);
  console.log(` - Learners: ${memoryStore.learner_profiles.length}`);
  console.log(` - Modules: ${memoryStore.learning_modules.length}`);
  console.log(` - Scenarios: ${memoryStore.learning_scenarios.length}`);
  console.log(` - Options: ${memoryStore.scenario_options.length}`);
}

export async function initDb() {
  const connectionString = process.env.DATABASE_URL;
  const forceMemory = process.env.USE_MEMORY_DB === 'true';

  if (connectionString && !forceMemory) {
    try {
      pool = new Pool({
        connectionString,
        connectionTimeoutMillis: 2500
      });
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      isPgConnected = true;
      console.log('[Database] Successfully connected to PostgreSQL database.');
      return;
    } catch (err) {
      console.warn('[Database] PostgreSQL connection failed or host unavailable:', err.message);
      console.log('[Database] Activating fallback in-memory database engine for seamless operation.');
    }
  }

  isPgConnected = false;
  if (!memoryStore) {
    initMemoryStore();
  }
}

export function isUsingPostgres() {
  return isPgConnected;
}

export function getMemoryStore() {
  if (!memoryStore) {
    initMemoryStore();
  }
  return memoryStore;
}

// Universal query dispatcher
export async function query(sqlText, params = []) {
  if (isPgConnected && pool) {
    try {
      const res = await pool.query(sqlText, params);
      return res;
    } catch (err) {
      console.error('[Database PG Error]:', err.message);
      throw err;
    }
  }

  // Fallback in-memory handler
  return executeInMemoryQuery(sqlText, params);
}

// In-memory query interpreter for standard queries
function executeInMemoryQuery(sql, params) {
  const store = getMemoryStore();
  const trimmed = sql.trim();
  const upper = trimmed.toUpperCase();

  // Basic table detection
  let targetTable = null;
  const tableNames = Object.keys(store);
  for (const t of tableNames) {
    const regex = new RegExp(`\\b${t}\\b`, 'i');
    if (regex.test(trimmed)) {
      targetTable = t;
      break;
    }
  }

  if (upper.startsWith('SELECT')) {
    // 1. SELECT * FROM users WHERE email = $1
    if (targetTable === 'users' && /WHERE\s+email\s*=\s*\$1/i.test(trimmed)) {
      const email = params[0]?.toLowerCase();
      const rows = store.users.filter(u => u.email.toLowerCase() === email);
      return { rows, rowCount: rows.length };
    }

    // 2. SELECT * FROM users WHERE id = $1
    if (targetTable === 'users' && /WHERE\s+id\s*=\s*\$1/i.test(trimmed)) {
      const rows = store.users.filter(u => u.id === params[0]);
      return { rows, rowCount: rows.length };
    }

    // 3. SELECT * FROM learner_profiles WHERE user_id = $1
    if (targetTable === 'learner_profiles' && /WHERE\s+user_id\s*=\s*\$1/i.test(trimmed)) {
      const rows = store.learner_profiles.filter(p => p.user_id === params[0]);
      return { rows, rowCount: rows.length };
    }

    // 4. SELECT * FROM learner_profiles WHERE id = $1
    if (targetTable === 'learner_profiles' && /WHERE\s+id\s*=\s*\$1/i.test(trimmed)) {
      const rows = store.learner_profiles.filter(p => p.id === params[0]);
      return { rows, rowCount: rows.length };
    }

    // 5. SELECT accessibility_preferences
    if (targetTable === 'accessibility_preferences' && /WHERE\s+user_id\s*=\s*\$1/i.test(trimmed)) {
      const rows = store.accessibility_preferences.filter(a => a.user_id === params[0]);
      return { rows, rowCount: rows.length };
    }

    // 6. SELECT modules
    if (targetTable === 'learning_modules') {
      if (/WHERE\s+id\s*=\s*\$1/i.test(trimmed)) {
        const rows = store.learning_modules.filter(m => m.id === params[0]);
        return { rows, rowCount: rows.length };
      }
      const rows = [...store.learning_modules].sort((a, b) => a.module_number - b.module_number);
      return { rows, rowCount: rows.length };
    }

    // 7. SELECT scenarios for module
    if (targetTable === 'learning_scenarios') {
      if (/WHERE\s+id\s*=\s*\$1/i.test(trimmed)) {
        const rows = store.learning_scenarios.filter(s => s.id === params[0]);
        return { rows, rowCount: rows.length };
      }
      if (/WHERE\s+module_id\s*=\s*\$1/i.test(trimmed)) {
        const rows = store.learning_scenarios
          .filter(s => s.module_id === params[0])
          .sort((a, b) => a.scenario_order - b.scenario_order);
        return { rows, rowCount: rows.length };
      }
      return { rows: store.learning_scenarios, rowCount: store.learning_scenarios.length };
    }

    // 8. SELECT scenario_options
    if (targetTable === 'scenario_options') {
      if (/WHERE\s+scenario_id\s*=\s*\$1/i.test(trimmed)) {
        const rows = store.scenario_options
          .filter(o => o.scenario_id === params[0])
          .sort((a, b) => a.order_index - b.order_index);
        return { rows, rowCount: rows.length };
      }
      if (/WHERE\s+id\s*=\s*\$1/i.test(trimmed)) {
        const rows = store.scenario_options.filter(o => o.id === params[0]);
        return { rows, rowCount: rows.length };
      }
      return { rows: store.scenario_options, rowCount: store.scenario_options.length };
    }

    // 9. SELECT assignments
    if (targetTable === 'module_assignments') {
      if (/WHERE\s+learner_id\s*=\s*\$1/i.test(trimmed)) {
        const rows = store.module_assignments.filter(a => a.learner_id === params[0]);
        return { rows, rowCount: rows.length };
      }
      return { rows: store.module_assignments, rowCount: store.module_assignments.length };
    }

    // 10. Default fallback select all
    if (targetTable && store[targetTable]) {
      return { rows: [...store[targetTable]], rowCount: store[targetTable].length };
    }

    return { rows: [], rowCount: 0 };
  }

  // INSERT INTO ...
  if (upper.startsWith('INSERT')) {
    const id = params[0] || uuidv4();
    const newRecord = { id };

    if (targetTable === 'users') {
      const user = {
        id,
        name: params[1],
        email: params[2]?.toLowerCase(),
        password_hash: params[3],
        role: params[4],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      store.users.push(user);
      return { rows: [user], rowCount: 1 };
    }

    if (targetTable === 'learner_profiles') {
      const profile = {
        id,
        user_id: params[1],
        preferred_name: params[2],
        current_level: params[3] || 'beginner',
        repetition_preference: params[4] || 1,
        avatar_id: params[5] || 'avatar-friendly-1',
        notes: params[6] || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      store.learner_profiles.push(profile);
      return { rows: [profile], rowCount: 1 };
    }

    if (targetTable === 'module_assignments') {
      const assignment = {
        id,
        module_id: params[1],
        learner_id: params[2],
        assigned_by: params[3],
        status: params[4] || 'assigned',
        repetition_count: params[5] || 1,
        difficulty_level: params[6] || 'standard',
        due_date: params[7] || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      store.module_assignments.push(assignment);
      return { rows: [assignment], rowCount: 1 };
    }

    if (targetTable === 'learning_sessions') {
      const session = {
        id,
        learner_id: params[1],
        module_id: params[2],
        session_type: params[3] || 'guided_lesson',
        started_at: new Date().toISOString(),
        completed_at: null,
        total_interactions: 0,
        assisted_by_caregiver: params[4] || false
      };
      store.learning_sessions.push(session);
      return { rows: [session], rowCount: 1 };
    }

    if (targetTable === 'assessment_attempts') {
      const attempt = {
        id,
        session_id: params[1],
        learner_id: params[2],
        module_id: params[3],
        attempt_type: params[4] || 'practice',
        score_percentage: parseFloat(params[5]) || 0,
        total_questions: parseInt(params[6]) || 0,
        correct_answers: parseInt(params[7]) || 0,
        completed_at: new Date().toISOString()
      };
      store.assessment_attempts.push(attempt);
      return { rows: [attempt], rowCount: 1 };
    }

    if (targetTable === 'assessment_answers') {
      const ans = {
        id,
        attempt_id: params[1],
        scenario_id: params[2],
        selected_option_id: params[3],
        is_correct: !!params[4],
        response_time_ms: parseInt(params[5]) || 0,
        created_at: new Date().toISOString()
      };
      store.assessment_answers.push(ans);
      return { rows: [ans], rowCount: 1 };
    }

    if (targetTable === 'accessibility_preferences') {
      const pref = {
        id,
        user_id: params[1],
        high_contrast: !!params[2],
        contrast_theme: params[3] || 'normal',
        text_scale: params[4] || 'normal',
        tts_enabled: params[5] !== false,
        tts_speed: parseFloat(params[6]) || 1.0,
        captions_enabled: params[7] !== false,
        reduced_motion: !!params[8],
        caregiver_assistance_mode: !!params[9],
        updated_at: new Date().toISOString()
      };
      store.accessibility_preferences.push(pref);
      return { rows: [pref], rowCount: 1 };
    }

    return { rows: [{ id }], rowCount: 1 };
  }

  // UPDATE ...
  if (upper.startsWith('UPDATE')) {
    if (targetTable === 'learning_sessions') {
      const sessionId = params[params.length - 1];
      const session = store.learning_sessions.find(s => s.id === sessionId);
      if (session) {
        session.completed_at = new Date().toISOString();
        if (params[0]) session.total_interactions = parseInt(params[0]) || session.total_interactions;
        return { rows: [session], rowCount: 1 };
      }
    }
    return { rows: [], rowCount: 1 };
  }

  return { rows: [], rowCount: 0 };
}
