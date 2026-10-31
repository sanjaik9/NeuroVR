import { Router } from 'express';
import { submitAssessmentAttempt, getAssessmentAttemptById } from '../controllers/sessionController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/attempts', submitAssessmentAttempt);
router.get('/attempts/:id', getAssessmentAttemptById);

export default router;
