# NeuroVR-2.0 Setup and Run Guide

## Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* **PostgreSQL**: v14+ (If offline, NeuroVR-2.0 automatically uses the embedded in-memory relational engine with demo data)

---

## 1. Quick Start

### Step 1: Install Dependencies
Run the workspace install command from the root directory:
```bash
npm run install:all
```

### Step 2: Configure Environment
Copy `.env.example` to `.env` (or configure server environment variables):
```bash
cp .env.example .env
```

### Step 3: Seed Database Demo Data
```bash
npm run seed
```

### Step 4: Launch Dev Servers
Start both backend (Port 5000) and frontend (Port 5173) simultaneously:
```bash
npm run dev
```

Visit the application at:
👉 **http://localhost:5173**

Backend Health Check:
👉 **http://localhost:5000/api/health**

---

## 2. Demo User Credentials

The application includes pre-configured demo accounts accessible via the **One-Click Demo Accounts** section on the login screen, or manually:

| Role | Email | Password | Name |
| :--- | :--- | :--- | :--- |
| **Caregiver / Educator** | `caregiver@neurovr.org` | `CaregiverPass123!` | Elena Vance (Special Educator) |
| **Learner (Alex)** | `alex@neurovr.org` | `LearnerPass123!` | Alex Rivera |
| **Learner (Sammy)** | `sammy@neurovr.org` | `LearnerPass123!` | Sammy Chen |
| **Admin** | `admin@neurovr.org` | `AdminPass123!` | Admin Supervisor |

---

## 3. Running Automated Tests

Run all unit and integration tests across backend and frontend:

```bash
# Run both server & client test suites
npm test

# Run backend tests only
npm run test:server

# Run frontend tests only
npm run test:client
```

---

## 4. Building for Production

Compile the optimized client bundle:
```bash
npm run build:client
```
Output will be placed in `client/dist`.
