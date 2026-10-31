import app from './app.js';
import { config } from './config/index.js';
import { initDb, isUsingPostgres } from './database/db.js';

async function startServer() {
  try {
    console.log('----------------------------------------------------');
    console.log('Starting NeuroVR-2.0 Personal Safety Awareness Server');
    console.log(`Node.js Version: ${process.version}`);
    console.log(`Environment: ${config.env}`);
    console.log('----------------------------------------------------');

    // Initialize database
    await initDb();

    const server = app.listen(config.port, () => {
      console.log(`[NeuroVR Server] Listening on http://localhost:${config.port}`);
      console.log(`[NeuroVR Server] Database Status: ${isUsingPostgres() ? 'Connected to PostgreSQL' : 'Active In-Memory Relational Engine (Resilient fallback)'}`);
      console.log(`[NeuroVR Server] Health Check: http://localhost:${config.port}/api/health`);
    });

    const gracefulShutdown = () => {
      console.log('\n[NeuroVR Server] Graceful shutdown initiated...');
      server.close(() => {
        console.log('[NeuroVR Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  } catch (err) {
    console.error('[Fatal Server Startup Error]:', err);
    process.exit(1);
  }
}

startServer();
