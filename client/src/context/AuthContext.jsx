import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export const DEMO_ACCOUNTS = {
  caregiver: {
    email: 'caregiver@neurovr.org',
    password: 'CaregiverPass123!',
    label: 'Elena Vance (Special Educator)'
  },
  learner_sammy: {
    email: 'sammy@neurovr.org',
    password: 'LearnerPass123!',
    label: 'Sammy Chen (Learner)'
  },
  learner_alex: {
    email: 'alex@neurovr.org',
    password: 'LearnerPass123!',
    label: 'Alex Rivera (Learner)'
  },
  admin: {
    email: 'admin@neurovr.org',
    password: 'AdminPass123!',
    label: 'Admin Supervisor'
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('neurovr_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getCurrentUser();
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          logout();
        }
      } catch (err) {
        // Token invalid or expired
        logout();
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.login(email, password);
      if (res.success && res.data) {
        localStorage.setItem('neurovr_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data.user;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (payload) => {
    setError(null);
    try {
      const res = await api.register(payload);
      if (res.success && res.data) {
        localStorage.setItem('neurovr_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data.user;
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('neurovr_token');
    setToken(null);
    setUser(null);
  };

  const switchDemoUser = async (demoKey) => {
    const creds = DEMO_ACCOUNTS[demoKey];
    if (!creds) return;
    return await login(creds.email, creds.password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated: Boolean(user),
        isLearner: user?.role === 'learner',
        isCaregiver: user?.role === 'caregiver',
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        switchDemoUser,
        demoAccounts: DEMO_ACCOUNTS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
