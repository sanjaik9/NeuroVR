import { v4 as uuidv4 } from 'uuid';
import { getMemoryStore, query, isUsingPostgres } from '../database/db.js';
import { accessibilityPreferencesSchema } from '../validators/schemas.js';

export async function getPreferences(req, res, next) {
  try {
    const userId = req.user.id;
    const store = getMemoryStore();

    let pref = store.accessibility_preferences.find(p => p.user_id === userId);
    if (!pref) {
      // Create defaults
      pref = {
        id: uuidv4(),
        user_id: userId,
        high_contrast: false,
        contrast_theme: 'normal',
        text_scale: 'normal',
        tts_enabled: true,
        tts_speed: 1.0,
        captions_enabled: true,
        reduced_motion: false,
        caregiver_assistance_mode: false,
        updated_at: new Date().toISOString()
      };
      store.accessibility_preferences.push(pref);
    }

    res.json({
      success: true,
      data: pref
    });
  } catch (err) {
    next(err);
  }
}

export async function updatePreferences(req, res, next) {
  try {
    const userId = req.user.id;
    const validated = accessibilityPreferencesSchema.parse(req.body);
    const store = getMemoryStore();

    let pref = store.accessibility_preferences.find(p => p.user_id === userId);
    if (!pref) {
      pref = {
        id: uuidv4(),
        user_id: userId,
        high_contrast: false,
        contrast_theme: 'normal',
        text_scale: 'normal',
        tts_enabled: true,
        tts_speed: 1.0,
        captions_enabled: true,
        reduced_motion: false,
        caregiver_assistance_mode: false,
        updated_at: new Date().toISOString()
      };
      store.accessibility_preferences.push(pref);
    }

    Object.assign(pref, validated, { updated_at: new Date().toISOString() });

    res.json({
      success: true,
      message: 'Accessibility preferences updated',
      data: pref
    });
  } catch (err) {
    next(err);
  }
}
