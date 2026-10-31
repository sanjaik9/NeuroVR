import { Router } from 'express';
import { getLearnerReport, exportLearnerReportCsv } from '../controllers/reportController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.use(authenticate);
router.use(authorize('caregiver', 'admin'));

router.get('/learners/:id', getLearnerReport);
router.get('/learners/:id/export', exportLearnerReportCsv);

export default router;
