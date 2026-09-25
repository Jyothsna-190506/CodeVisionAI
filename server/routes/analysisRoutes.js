import express from 'express';
import {
  createAnalysis,
  getAnalysisById,
  getUserAnalyses,
} from '../controllers/analysisController.js';
import { optionalAuthMiddleware, authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuthMiddleware, createAnalysis);
router.get('/', authMiddleware, getUserAnalyses);
router.get('/:id', authMiddleware, getAnalysisById);

export default router;
