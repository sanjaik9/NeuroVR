import { Router } from 'express';
import { getModules, getModuleById, assignModule, getScenarioById } from '../controllers/moduleController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

// Modules can be browsed publicly or authenticated
router.get('/', (req, res, next) => {
  // Optional auth
  if (req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
}, getModules);

router.get('/:id', getModuleById);
router.post('/:id/assign', authenticate, authorize('caregiver', 'admin'), assignModule);

export default router;
