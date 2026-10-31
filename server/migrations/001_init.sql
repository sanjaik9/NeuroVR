-- NeuroVR-2.0 Database Schema Migration
-- PostgreSQL 14+ compatible with UUIDs, foreign keys, and indexes

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('learner', 'caregiver', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Learner Profiles Table
CREATE TABLE IF NOT EXISTS learner_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    preferred_name VARCHAR(255) NOT NULL,
    current_level VARCHAR(50) DEFAULT 'beginner',
    repetition_preference INT DEFAULT 1,
    avatar_id VARCHAR(50) DEFAULT 'avatar-friendly-1',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_learner_profiles_user_id ON learner_profiles(user_id);

-- 3. Caregiver to Learner Links (Authorization mapping)
CREATE TABLE IF NOT EXISTS caregiver_learner_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    caregiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    learner_id UUID NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
    relationship_type VARCHAR(100) DEFAULT 'Educator',
    permissions JSONB DEFAULT '{"can_assign": true, "can_view_reports": true}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(caregiver_id, learner_id)
);

CREATE INDEX IF NOT EXISTS idx_cl_links_caregiver ON caregiver_learner_links(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_cl_links_learner ON caregiver_learner_links(learner_id);

-- 4. Learning Modules Table
CREATE TABLE IF NOT EXISTS learning_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_number INT UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon_name VARCHAR(100) DEFAULT 'Shield',
    estimated_minutes INT DEFAULT 10,
    difficulty_level VARCHAR(50) DEFAULT 'beginner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Learning Scenarios Table
CREATE TABLE IF NOT EXISTS learning_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
    scenario_order INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    environment_type VARCHAR(100) NOT NULL, -- 'room', 'school', 'home'
    narrator_prompt TEXT NOT NULL,
    character_setup JSONB DEFAULT '{}'::jsonb,
    guidance_tip TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scenarios_module_id ON learning_scenarios(module_id);

-- 6. Scenario Options Table
CREATE TABLE IF NOT EXISTS scenario_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scenario_id UUID NOT NULL REFERENCES learning_scenarios(id) ON DELETE CASCADE,
    option_text VARCHAR(255) NOT NULL,
    is_safe_action BOOLEAN NOT NULL DEFAULT TRUE,
    feedback_explanation TEXT NOT NULL,
    encouragement_message TEXT NOT NULL,
    order_index INT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_options_scenario_id ON scenario_options(scenario_id);

-- 7. Module Assignments Table
CREATE TABLE IF NOT EXISTS module_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
    learner_id UUID NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed')),
    repetition_count INT DEFAULT 1,
    difficulty_level VARCHAR(50) DEFAULT 'standard',
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assignments_learner ON module_assignments(learner_id);
CREATE INDEX IF NOT EXISTS idx_assignments_module ON module_assignments(module_id);

-- 8. Learning Sessions Table
CREATE TABLE IF NOT EXISTS learning_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    learner_id UUID NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
    session_type VARCHAR(50) DEFAULT 'guided_lesson',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    total_interactions INT DEFAULT 0,
    assisted_by_caregiver BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_sessions_learner ON learning_sessions(learner_id);

-- 9. Assessment Attempts Table
CREATE TABLE IF NOT EXISTS assessment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES learning_sessions(id) ON DELETE SET NULL,
    learner_id UUID NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
    attempt_type VARCHAR(50) DEFAULT 'practice' CHECK (attempt_type IN ('practice', 'formal_assessment')),
    score_percentage DECIMAL(5,2) DEFAULT 0.00,
    total_questions INT NOT NULL DEFAULT 0,
    correct_answers INT NOT NULL DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attempts_learner ON assessment_attempts(learner_id);

-- 10. Assessment Answers Table
CREATE TABLE IF NOT EXISTS assessment_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    scenario_id UUID NOT NULL REFERENCES learning_scenarios(id) ON DELETE CASCADE,
    selected_option_id UUID NOT NULL REFERENCES scenario_options(id) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL,
    response_time_ms INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_answers_attempt ON assessment_answers(attempt_id);

-- 11. Accessibility Preferences Table
CREATE TABLE IF NOT EXISTS accessibility_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    high_contrast BOOLEAN DEFAULT FALSE,
    contrast_theme VARCHAR(50) DEFAULT 'normal', -- 'normal', 'high_contrast_dark', 'high_contrast_yellow'
    text_scale VARCHAR(50) DEFAULT 'normal', -- 'normal', 'large', 'x-large'
    tts_enabled BOOLEAN DEFAULT TRUE,
    tts_speed DECIMAL(3,2) DEFAULT 1.00,
    captions_enabled BOOLEAN DEFAULT TRUE,
    reduced_motion BOOLEAN DEFAULT FALSE,
    caregiver_assistance_mode BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_access_prefs_user ON accessibility_preferences(user_id);
