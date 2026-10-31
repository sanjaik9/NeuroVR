import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z.enum(['learner', 'caregiver', 'admin'], {
    errorMap: () => ({ message: 'Role must be learner, caregiver, or admin' })
  }),
  preferred_name: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const createLearnerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email().optional(),
  preferred_name: z.string().min(1, 'Preferred name is required'),
  current_level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  repetition_preference: z.number().int().min(1).max(5).default(1),
  avatar_id: z.string().default('avatar-friendly-1'),
  notes: z.string().max(500).optional(),
  relationship_type: z.string().default('Educator')
});

export const updateLearnerSchema = z.object({
  preferred_name: z.string().min(1).optional(),
  current_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  repetition_preference: z.number().int().min(1).max(5).optional(),
  avatar_id: z.string().optional(),
  notes: z.string().max(500).optional()
});

export const assignModuleSchema = z.object({
  learner_id: z.string().uuid('Valid learner ID is required'),
  repetition_count: z.number().int().min(1).max(10).default(1),
  difficulty_level: z.enum(['beginner', 'standard', 'advanced']).default('standard'),
  due_date: z.string().optional().nullable()
});

export const createSessionSchema = z.object({
  learner_id: z.string().uuid('Valid learner ID required'),
  module_id: z.string().uuid('Valid module ID required'),
  session_type: z.enum(['guided_lesson', 'practice', 'formal_assessment']).default('guided_lesson'),
  assisted_by_caregiver: z.boolean().default(false)
});

export const submitAttemptSchema = z.object({
  session_id: z.string().uuid().optional().nullable(),
  learner_id: z.string().uuid('Valid learner ID is required'),
  module_id: z.string().uuid('Valid module ID is required'),
  attempt_type: z.enum(['practice', 'formal_assessment']).default('practice'),
  answers: z.array(
    z.object({
      scenario_id: z.string().uuid(),
      selected_option_id: z.string(),
      response_time_ms: z.number().int().nonnegative().default(0)
    })
  ).min(1, 'At least one answer must be submitted')
});

export const accessibilityPreferencesSchema = z.object({
  high_contrast: z.boolean().optional(),
  contrast_theme: z.enum(['normal', 'high_contrast_dark', 'high_contrast_yellow']).optional(),
  text_scale: z.enum(['normal', 'large', 'x-large']).optional(),
  tts_enabled: z.boolean().optional(),
  tts_speed: z.number().min(0.5).max(2.0).optional(),
  captions_enabled: z.boolean().optional(),
  reduced_motion: z.boolean().optional(),
  caregiver_assistance_mode: z.boolean().optional()
});
