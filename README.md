# NeuroVR-2.0: Interactive VR Model for Personal Safety Awareness

[![Tests Status](https://img.shields.io/badge/Tests-12%2F12%20Passed-success)](#testing)
[![WCAG](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AAA-blue)](#accessibility)
[![Node](https://img.shields.io/badge/Node.js-v18%2B-green)](#technology-stack)
[![React](https://img.shields.io/badge/React-18%20%2B%20Vite-61dafb)](#technology-stack)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Spatial-black)](#technology-stack)

**NeuroVR-2.0** is an accessible, trauma-informed 3D educational application designed to help individuals with intellectual disabilities, neurodivergent learners, and visual learners understand personal boundaries, recognize safe versus unsafe touch, and build confidence advocating for their personal space.

---

## 🌟 Key Features

### 1. Interactive 3D Personal Space Bubble
- **Visual Spatial Distance**: A dynamic 3D sphere rendered in **Three.js** surrounds the avatar to demonstrate healthy arm's-length boundaries.
- **Real-Time Visual Cues**: The bubble glows calm green when boundaries are respected, and transitions to warning amber when someone steps inside without permission.
- **Hardware-Free Accessibility**: Operates smoothly in any standard desktop, tablet, or mobile browser without requiring a VR headset, with spatial WebXR architectural readiness.

### 2. Safe vs. Unsafe Touch Curriculum
- **Scenario 1**: Friendly greetings (High fives, waving, asking before hugging).
- **Scenario 2**: Respecting personal boundaries when someone asks for space.
- **Scenario 3**: Recognizing and rejecting secret or confusing touch in private spaces.
- **Scenario 4**: Practicing saying **"NO"** loud and clear and walking away to find a trusted adult.

### 3. Trauma-Informed Feedback & Voice Guidance
- **Web Speech API Audio Narration**: Scenarios, options, and explanations are read aloud with customizable narration speed (`0.75x` to `1.5x`).
- **Constructive Reinforcement**: Safe choices trigger positive affirmations and confetti bursts; learning moments explain *why* without shame or penalties.
- **Emotional Grounding Modal**: A dedicated "I Need Help" button with a gentle breathing circle pacer, reminders that *"Your body belongs to you"*, and a trusted adult directory.

### 4. Caregiver & Educator Supervision
- **Personalized Pacing**: Caregivers can assign modules with customized repetition counts (`1x`, `2x`, `3x`) and difficulty levels.
- **Mastery Analytics**: Track session frequency, average accuracy, reaction times, and specific topics needing supportive revision.
- **Data Portability**: Instant CSV export of learner progress reports.

### 5. WCAG 2.2 AAA Accessibility
- **High-Contrast Themes**: Default Calm Navy, High-Contrast Yellow-on-Black (18:1 contrast), and High-Contrast Dark.
- **Dynamic Text Scaling**: Standard (16px), Large (18px), and Extra Large (22px).
- **Cognitive Typography**: Lexend typeface to prevent visual crowding.
- **Reduced Motion Support**: Disables camera pans, floating oscillations, and particle bursts for motion sensitivity.

---

## 🛠 Technology Stack

- **Frontend**: React 18, Vite, Three.js, React Router v7, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express.js, JWT Authentication, bcrypt password hashing, Zod schema validation, Helmet security headers, express-rate-limit.
- **Database**: PostgreSQL with parameterized queries + Resilient In-Memory Relational Engine for offline and test environments.
- **Testing**: Vitest, React Testing Library, Supertest.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies for root, client, and server
npm run install:all

# 2. Seed database records
npm run seed

# 3. Launch both backend and frontend servers
npm run dev
```

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Telemetry**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 👤 Demo Accounts

Click the **One-Click Demo Accounts** buttons on the Login page or use these credentials:

| Role | Email | Password | Name |
| :--- | :--- | :--- | :--- |
| **Caregiver / Educator** | `caregiver@neurovr.org` | `CaregiverPass123!` | Elena Vance (Special Educator) |
| **Learner** | `alex@neurovr.org` | `LearnerPass123!` | Alex Rivera |
| **Learner** | `sammy@neurovr.org` | `LearnerPass123!` | Sammy Chen |
| **Administrator** | `admin@neurovr.org` | `AdminPass123!` | Admin Supervisor |

---

## 🧪 Testing

Both frontend and backend test suites run via Vitest:

```bash
# Run all tests
npm test

# Run backend tests (8 passing)
npm run test:server

# Run frontend tests (4 passing)
npm run test:client
```

---

## 📚 Documentation Links

- [REST API Specifications](docs/API.md)
- [Database Schema & Architecture](docs/DATABASE.md)
- [Accessibility & Trauma-Informed Guide](docs/ACCESSIBILITY.md)
- [Setup & Run Instructions](docs/SETUP.md)

---

## 🛡 Safeguarding Notice

*NeuroVR-2.0 is an educational boundary awareness supplement. It does not replace real-world caregiver supervision, family dialogue, or professional safeguarding services. In any situation involving immediate danger, contact a trusted adult or emergency services (911 / 112) immediately.*
