import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import learnerRoutes from './routes/learnerRoutes.js';
import moduleRoutes from './routes/moduleRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import accessibilityRoutes from './routes/accessibilityRoutes.js';
import { getScenarioById } from './controllers/moduleController.js';
import { errorHandler } from './middleware/errorHandler.js';
import { isUsingPostgres } from './database/db.js';

const app = express();

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false, // Allows flexible 3D asset/font/audio evaluation in development
  crossOriginEmbedderPolicy: false
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    application: 'NeuroVR-2.0 Server',
    version: '2.0.0',
    database: isUsingPostgres() ? 'PostgreSQL' : 'Resilient In-Memory Relational Engine',
    timestamp: new Date().toISOString()
  });
});

// Direct scenario route support
app.get('/api/scenarios/:id', getScenarioById);

// Mount Modular API Routes
app.use('/api/auth', authRoutes);
app.use('/api/learners', learnerRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/accessibility', accessibilityRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.method} ${req.originalUrl}' not found`
  });
});

// Centralized Error Handling
app.use(errorHandler);

export default app;
