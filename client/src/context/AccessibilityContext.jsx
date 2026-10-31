import React, { createContext, useContext, useState, useEffect } from 'react';
import tts from '../services/tts.js';
import api from '../services/api.js';

const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children }) {
  const [contrastTheme, setContrastTheme] = useState(() => {
    return localStorage.getItem('neurovr_theme') || 'normal';
  });

  const [textScale, setTextScale] = useState(() => {
    return localStorage.getItem('neurovr_text_scale') || 'normal';
  });

  const [ttsEnabled, setTtsEnabled] = useState(() => {
    const saved = localStorage.getItem('neurovr_tts');
    return saved !== null ? saved === 'true' : true;
  });

  const [ttsSpeed, setTtsSpeed] = useState(() => {
    return Number(localStorage.getItem('neurovr_tts_speed')) || 1.0;
  });

  const [captionsEnabled, setCaptionsEnabled] = useState(() => {
    const saved = localStorage.getItem('neurovr_captions');
    return saved !== null ? saved === 'true' : true;
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem('neurovr_reduced_motion') === 'true';
  });

  const [caregiverAssistedMode, setCaregiverAssistedMode] = useState(() => {
    return localStorage.getItem('neurovr_caregiver_mode') === 'true';
  });

  // Apply visual classes to body
  useEffect(() => {
    document.body.classList.remove('theme-high-contrast-dark', 'theme-high-contrast-yellow');
    if (contrastTheme === 'high_contrast_dark') {
      document.body.classList.add('theme-high-contrast-dark');
    } else if (contrastTheme === 'high_contrast_yellow') {
      document.body.classList.add('theme-high-contrast-yellow');
    }
    localStorage.setItem('neurovr_theme', contrastTheme);
  }, [contrastTheme]);

  useEffect(() => {
    document.body.classList.remove('text-scale-normal', 'text-scale-large', 'text-scale-xlarge');
    document.body.classList.add(`text-scale-${textScale}`);
    localStorage.setItem('neurovr_text_scale', textScale);
  }, [textScale]);

  useEffect(() => {
    if (reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
    localStorage.setItem('neurovr_reduced_motion', String(reducedMotion));
  }, [reducedMotion]);

  useEffect(() => {
    tts.setEnabled(ttsEnabled);
    localStorage.setItem('neurovr_tts', String(ttsEnabled));
  }, [ttsEnabled]);

  useEffect(() => {
    tts.setSpeed(ttsSpeed);
    localStorage.setItem('neurovr_tts_speed', String(ttsSpeed));
  }, [ttsSpeed]);

  useEffect(() => {
    localStorage.setItem('neurovr_captions', String(captionsEnabled));
  }, [captionsEnabled]);

  useEffect(() => {
    localStorage.setItem('neurovr_caregiver_mode', String(caregiverAssistedMode));
  }, [caregiverAssistedMode]);

  // Audio speech narration helper
  const speak = (text) => {
    if (ttsEnabled) {
      tts.speak(text);
    }
  };

  const stopSpeaking = () => {
    tts.stop();
  };

  const cycleTheme = () => {
    const themes = ['normal', 'high_contrast_dark', 'high_contrast_yellow'];
    const nextIndex = (themes.indexOf(contrastTheme) + 1) % themes.length;
    setContrastTheme(themes[nextIndex]);
  };

  const cycleTextScale = () => {
    const scales = ['normal', 'large', 'xlarge'];
    const nextIndex = (scales.indexOf(textScale) + 1) % scales.length;
    setTextScale(scales[nextIndex]);
  };

  // Sync to remote profile if logged in
  const syncPreferences = async (overrides = {}) => {
    try {
      const payload = {
        high_contrast: (overrides.contrastTheme || contrastTheme) !== 'normal',
        contrast_theme: overrides.contrastTheme || contrastTheme,
        text_scale: overrides.textScale || textScale,
        tts_enabled: overrides.ttsEnabled !== undefined ? overrides.ttsEnabled : ttsEnabled,
        tts_speed: overrides.ttsSpeed || ttsSpeed,
        captions_enabled: overrides.captionsEnabled !== undefined ? overrides.captionsEnabled : captionsEnabled,
        reduced_motion: overrides.reducedMotion !== undefined ? overrides.reducedMotion : reducedMotion,
        caregiver_assistance_mode: overrides.caregiverAssistedMode !== undefined ? overrides.caregiverAssistedMode : caregiverAssistedMode
      };
      await api.updateAccessibilityPreferences(payload);
    } catch (err) {
      // Local preferences always remain active even if offline
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        contrastTheme,
        setContrastTheme,
        cycleTheme,
        textScale,
        setTextScale,
        cycleTextScale,
        ttsEnabled,
        setTtsEnabled,
        ttsSpeed,
        setTtsSpeed,
        captionsEnabled,
        setCaptionsEnabled,
        reducedMotion,
        setReducedMotion,
        caregiverAssistedMode,
        setCaregiverAssistedMode,
        speak,
        stopSpeaking,
        syncPreferences
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
