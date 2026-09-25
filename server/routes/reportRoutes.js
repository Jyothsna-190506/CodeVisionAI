import express from 'express';
import { generateReport, getUserReports } from '../controllers/reportController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/', generateReport);
router.get('/', getUserReports);

export default router;
