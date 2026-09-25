import express from 'express';
import { getHistory, deleteHistoryItem } from '../controllers/historyController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', getHistory);
router.delete('/:id', deleteHistoryItem);

export default router;
