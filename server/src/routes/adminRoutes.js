import { Router } from 'express';
import { getAdminUsers, updateAdminUser, createAdminModule, getAdminStats } from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/users', getAdminUsers);
router.patch('/users/:id', updateAdminUser);
router.post('/modules', createAdminModule);
router.get('/stats', getAdminStats);

export default router;
