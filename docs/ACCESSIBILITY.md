# NeuroVR-2.0 Accessibility & Trauma-Informed Guide

NeuroVR-2.0 is specifically designed for individuals with intellectual disabilities, neurodivergent learners, and individuals with visual learning preferences. It adheres to **WCAG 2.2 AAA** guidelines and trauma-informed safety principles.

---

## 1. Visual & Contrast Themes

1. **Default Calm Modern Palette**
   - Soft deep navy background (`#0c1222`) with teal and ocean blue accents.
   - Low sensory stress, avoiding harsh glare or strobe effects.
2. **High-Contrast Yellow on Black (Low-Vision & Cognitive Clarity)**
   - `#ffff00` high-luminescence text against pure `#000000` background.
   - Maximum luminance contrast ratio exceeds **18:1**, far surpassing the WCAG AAA 7:1 threshold.
3. **High-Contrast Dark**
   - High-contrast white and cyan on deep black for low-glare reading.

---

## 2. Typography & Readability

- **Lexend & Outfit Typefaces**: Specifically engineered to reduce visual crowding and increase reading comprehension for learners with dyslexia and cognitive challenges.
- **Dynamic Text Scaling**:
  - Standard: `16px` (baseline)
  - Large: `18px` (+12.5%)
  - Extra Large: `22px` (+37.5%)
- **Spacing**: Increased line-height (`1.6`) and generous paragraph spacing to avoid cognitive fatigue.

---

## 3. Audio Narration & Web Speech API

- **Text-to-Speech (TTS)**: Native browser speech synthesis narrates:
  - Scenario storylines and avatar dialogue
  - Multiple choice options
  - Constructive feedback and celebration messages
- **Pacing Control**: Learners and caregivers can adjust the speed from `0.75x` (slow and clear) to `1.5x`.
- **Screen Reader Compatibility**: Semantic HTML with ARIA live regions, dialog roles, and descriptive button labels.

---

## 4. Emotional Safety & Trauma-Informed Safeguards

1. **Non-Threatening Scenarios**:
   - Avatars and situations represent everyday safe interactions (waving, high fives, asking before hugging) and non-graphic boundary moments (unwanted closeness, keeping secrets).
   - No graphic or violent depictions.
2. **Immediate Constructive Feedback**:
   - Correct choices: Confetti burst, positive affirmation star, and explanation of why it was safe.
   - Gentle learning moments: Clear explanation of what to do next without shame or penalty.
3. **Emergency "I Need Help" Button**:
   - Available from every screen.
   - Features a soothing breathing pacer (Inhale, Hold, Exhale).
   - Core boundary reminders: "Your body belongs to you. Saying NO is okay. It is never your fault."
   - Directory of trusted adults (parent, teacher, counselor, nurse) and 24/7 support helplines.

---

## 5. Keyboard Navigation & Touch Targets

- **Large Interactive Buttons**: Minimum touch target size of 48×48px with clear visual hover and focus rings (`3px solid #38bdf8`).
- **Full Keyboard Accessibility**: All controls, 3D scenario actions, and modal dialogs are operable via `Tab`, `Enter`, `Space`, and `Escape`.
- **Reduced Motion**: Disables 3D camera sweeps, confetti, and floating animations when activated.
