# NeuroVR-2.0 REST API Documentation

NeuroVR-2.0 provides a secure, role-based RESTful API supporting authentication, learner supervision, module delivery, interactive scenario sessions, assessments, and caregiver analytics.

---

## Base URL
`/api`

All protected endpoints require an `Authorization: Bearer <JWT_TOKEN>` header.

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Creates a new caregiver, educator, or learner account.
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Elena Vance",
    "email": "elena@example.com",
    "password": "SecurePassword123!",
    "role": "caregiver" // "caregiver" | "learner"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "uuid",
        "name": "Elena Vance",
        "email": "elena@example.com",
        "role": "caregiver"
      },
      "token": "jwt_token_string"
    }
  }
  ```

### `POST /api/auth/login`
Authenticates a user and returns a signed JWT.
- **Access**: Public (Rate-limited: 5 attempts per 15 minutes)
- **Request Body**:
  ```json
  {
    "email": "caregiver@neurovr.org",
    "password": "CaregiverPass123!"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "uuid",
        "email": "caregiver@neurovr.org",
        "role": "caregiver",
        "learnerProfile": null
      },
      "token": "jwt_token_string"
    }
  }
  ```

### `GET /api/auth/me`
Retrieves the profile and preferences of the authenticated session.
- **Access**: Authenticated (`caregiver`, `learner`, `admin`)
- **Response `200 OK`**: Current user record, role, and linked learner profile if applicable.

---

## 2. Learner Profiles & Supervision

### `GET /api/learners`
Retrieves supervised learners. Caregivers only see learners linked to their account.
- **Access**: Authenticated (`caregiver`, `admin`)

### `GET /api/learners/:id`
Retrieves profile and awareness level for a specific learner.
- **Access**: Caregiver of learner, the learner themselves, or admin.

### `PATCH /api/learners/:id`
Updates developmental notes, sensory preferences, or awareness ratings.
- **Access**: Authorized caregiver or admin.

---

## 3. Curriculum Modules & 3D Scenarios

### `GET /api/modules`
Returns safety modules with scenarios, options, and status.
- **Query Params**: `?learner_id=<uuid>` (optional: decorates assignments and completion status)
- **Access**: Public / Authenticated

### `GET /api/modules/:id`
Returns full module detail including ordered scenarios, 3D assets, dialogue prompts, and options.

### `GET /api/scenarios/:id`
Retrieves an individual scenario and its choice options.

### `POST /api/modules/assign`
Assigns a safety module to a learner with custom repetition counts and pacing.
- **Access**: Authenticated `caregiver` or `admin`.
- **Request Body**:
  ```json
  {
    "learner_id": "uuid",
    "module_id": "uuid",
    "repetition_count": 3,
    "difficulty_level": "standard" // "beginner" | "standard" | "advanced"
  }
  ```

---

## 4. Learning Sessions & Assessments

### `POST /api/sessions`
Initializes a new interactive VR learning session.
- **Request Body**:
  ```json
  {
    "learner_id": "uuid",
    "module_id": "uuid",
    "session_type": "guided_lesson",
    "assisted_by_caregiver": false
  }
  ```

### `PATCH /api/sessions/:id`
Updates session completion, duration, score percentage, and notes.

### `POST /api/assessments/attempts`
Submits an answer to a scenario. Calculates whether the choice was safe, registers reaction time, and returns trauma-informed constructive feedback.
- **Request Body**:
  ```json
  {
    "session_id": "uuid",
    "scenario_id": "uuid",
    "option_id": "uuid",
    "reaction_time_ms": 3200,
    "assisted": false
  }
  ```

---

## 5. Reports & Progress Analytics

### `GET /api/reports/learners/:id`
Provides aggregated metrics: total sessions, attempts, average accuracy, module completion, and topics recommended for revision.

### `GET /api/reports/learners/:id/export`
Exports a CSV file summarizing the learner's session history and mastery rates.
- **Format**: `text/csv`

---

## 6. Accessibility Preferences

### `GET /api/accessibility/preferences`
Retrieves saved accessibility configurations (contrast theme, text scale, TTS speed, reduced motion).

### `PATCH /api/accessibility/preferences`
Updates user's accessibility settings.
