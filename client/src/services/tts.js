// NeuroVR-2.0 Accessible Text-to-Speech (TTS) Service
// Grounded in Web Speech API with fallbacks and cognitive pacing controls

class TTSService {
  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    this.isEnabled = true;
    this.speed = 1.0;
    this.currentUtterance = null;
    this.voices = [];
    this.preferredVoice = null;

    if (this.isSupported) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  loadVoices() {
    if (!this.isSupported) return;
    this.voices = window.speechSynthesis.getVoices();
    // Prioritize natural English voices
    this.preferredVoice =
      this.voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri'))) ||
      this.voices.find(v => v.lang.startsWith('en')) ||
      this.voices[0] ||
      null;
  }

  setSpeed(speedMultiplier) {
    this.speed = Math.max(0.6, Math.min(1.8, Number(speedMultiplier) || 1.0));
  }

  setEnabled(enabled) {
    this.isEnabled = Boolean(enabled);
    if (!this.isEnabled) {
      this.stop();
    }
  }

  speak(text, onEndCallback = null) {
    if (!this.isSupported || !this.isEnabled || !text) return;

    this.stop();

    try {
      const cleanText = text.replace(/[*_#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = this.speed;
      utterance.pitch = 1.05; // Slightly warmer, friendlier pitch for calm tone

      if (this.preferredVoice) {
        utterance.voice = this.preferredVoice;
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        if (onEndCallback) onEndCallback();
      };

      utterance.onerror = (e) => {
        // Interrupted is normal when user switches slides or cancels
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('[TTS Warning]', e.error);
        }
        this.currentUtterance = null;
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[TTS Playback Failed]:', err);
    }
  }

  stop() {
    if (this.isSupported) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
      this.currentUtterance = null;
    }
  }
}

export const tts = new TTSService();
export default tts;
