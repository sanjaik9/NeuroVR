import { Router } from 'express';
import {
  getLearners,
  createLearner,
  getLearnerById,
  updateLearner,
  getLearnerProgress,
  getLearnerHistory
} from '../controllers/learnerController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.use(authenticate);

router.get('/', getLearners);
router.post('/', authorize('caregiver', 'admin'), createLearner);
router.get('/:id', getLearnerById);
router.patch('/:id', authorize('caregiver', 'admin'), updateLearner);
router.get('/:id/progress', getLearnerProgress);
router.get('/:id/history', getLearnerHistory);

export default router;
