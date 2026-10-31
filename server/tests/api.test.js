import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { initDb } from '../src/database/db.js';

beforeAll(async () => {
  process.env.USE_MEMORY_DB = 'true';
  await initDb();
});

describe('NeuroVR-2.0 Server API Suite', () => {
  it('GET /api/health should return healthy status and version 2.0.0', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.application).toBe('NeuroVR-2.0 Server');
    expect(res.body.version).toBe('2.0.0');
  });

  describe('Authentication Endpoints', () => {
    it('POST /api/auth/login should authenticate seed caregiver Elena Vance', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'caregiver@neurovr.org',
          password: 'CaregiverPass123!'
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('caregiver');
      expect(res.body.data.token).toBeDefined();
    });

    it('POST /api/auth/login should authenticate seed learner Sammy Chen', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'sammy@neurovr.org',
          password: 'LearnerPass123!'
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('learner');
      expect(res.body.data.user.learnerProfile).toBeDefined();
      expect(res.body.data.user.learnerProfile.preferred_name).toBe('Sammy');
    });

    it('POST /api/auth/login should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'caregiver@neurovr.org',
          password: 'WrongPassword999!'
        });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Learning Modules & Scenarios Endpoints', () => {
    it('GET /api/modules should return 5 personal safety awareness modules', async () => {
      const res = await request(app).get('/api/modules');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(5);

      const moduleTitles = res.body.data.map(m => m.title);
      expect(moduleTitles).toContain('Understanding Personal Boundaries');
      expect(moduleTitles).toContain('Safe and Caring Touch');
      expect(moduleTitles).toContain('Unsafe Touch and Warning Signs');
    });

    it('GET /api/modules/:id should return module details with scenarios and options', async () => {
      const listRes = await request(app).get('/api/modules');
      const firstModule = listRes.body.data[0];

      const res = await request(app).get(`/api/modules/${firstModule.id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(firstModule.id);
      expect(Array.isArray(res.body.data.scenarios)).toBe(true);
      expect(res.body.data.scenarios.length).toBeGreaterThan(0);

      const firstScenario = res.body.data.scenarios[0];
      expect(firstScenario.title).toBeDefined();
      expect(Array.isArray(firstScenario.options)).toBe(true);
      expect(firstScenario.options.length).toBeGreaterThan(0);
      expect(firstScenario.options[0].feedback_explanation).toBeDefined();
    });
  });

  describe('Accessibility Preferences Endpoints', () => {
    it('GET & PATCH /api/accessibility should update theme and text scale', async () => {
      // First login as caregiver
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'caregiver@neurovr.org',
          password: 'CaregiverPass123!'
        });
      const token = loginRes.body.data.token;

      // Update accessibility preferences
      const patchRes = await request(app)
        .patch('/api/accessibility')
        .set('Authorization', `Bearer ${token}`)
        .send({
          high_contrast: true,
          contrast_theme: 'high_contrast_yellow',
          text_scale: 'large',
          tts_enabled: true,
          tts_speed: 1.1,
          captions_enabled: true,
          reduced_motion: true
        });

      expect(patchRes.status).toBe(200);
      expect(patchRes.body.success).toBe(true);
      expect(patchRes.body.data.contrast_theme).toBe('high_contrast_yellow');
      expect(patchRes.body.data.text_scale).toBe('large');
      expect(patchRes.body.data.reduced_motion).toBe(true);
    });
  });

  describe('Caregiver Reports Endpoints', () => {
    it('GET /api/reports/learners/:id should return detailed safety progress', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'caregiver@neurovr.org',
          password: 'CaregiverPass123!'
        });
      const token = loginRes.body.data.token;

      // Learner Sammy ID is 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
      const learnerId = 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
      const res = await request(app)
        .get(`/api/reports/learners/${learnerId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.learner.name).toBe('Sammy');
      expect(res.body.data.metrics.overallAccuracyPercentage).toBeDefined();
      expect(Array.isArray(res.body.data.moduleSummaries)).toBe(true);
    });
  });
});
