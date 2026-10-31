import { Router } from 'express';
import { createSession, updateSession } from '../controllers/sessionController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', createSession);
router.patch('/:id', updateSession);

export default router;
