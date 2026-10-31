// NeuroVR-2.0 Client API Service
// Interfaces seamlessly with backend endpoints at /api

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

function getAuthHeader() {
  const token = localStorage.getItem('neurovr_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: `Network response was not valid JSON (${response.status})`
  }));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (payload) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getCurrentUser: () => request('/auth/me'),

  // Modules & Scenarios
  getModules: (learnerId) => {
    const query = learnerId ? `?learner_id=${encodeURIComponent(learnerId)}` : '';
    return request(`/modules${query}`);
  },

  getModuleById: (id) => request(`/modules/${id}`),

  getScenarioById: (id) => request(`/scenarios/${id}`),

  assignModule: (payload) =>
    request('/modules/assign', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Learning Sessions
  startSession: (payload) =>
    request('/sessions', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  updateSession: (sessionId, payload) =>
    request(`/sessions/${sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),

  // Assessments
  submitAttempt: (payload) =>
    request('/assessments/attempts', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Learners
  getLearners: () => request('/learners'),
  getLearnerById: (id) => request(`/learners/${id}`),
  updateLearnerProfile: (id, payload) =>
    request(`/learners/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),

  // Reports
  getLearnerReport: (learnerId) => request(`/reports/learners/${learnerId}`),
  getOverviewReports: () => request('/reports/overview'),

  // Accessibility
  getAccessibilityPreferences: () => request('/accessibility/preferences'),
  updateAccessibilityPreferences: (payload) =>
    request('/accessibility/preferences', {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
};

export default api;
