import app from '../server/src/app.js';
import { initDb } from '../server/src/database/db.js';

let initialized = false;

export default async function handler(req, res) {
  if (!initialized) {
    try {
      await initDb();
    } catch (err) {
      console.error('[Vercel Serverless Database Initialization Error]:', err);
    }
    initialized = true;
  }
  return app(req, res);
}
