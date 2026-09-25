import express from 'express';
import {
  getAdminAnalytics,
  getAdminUsers,
  updateUserStatus,
  deleteUser,
  getAdminActivity,
} from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/analytics', getAdminAnalytics);
router.get('/users', getAdminUsers);
router.put('/users/:id', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/activity', getAdminActivity);

export default router;
