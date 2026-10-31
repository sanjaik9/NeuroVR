import { Router } from 'express';
import { getPreferences, updatePreferences } from '../controllers/accessibilityController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/preferences', getPreferences);
router.patch('/preferences', updatePreferences);
router.get('/', getPreferences);
router.patch('/', updatePreferences);

export default router;
