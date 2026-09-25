import express from 'express';
import { sendMessage, getChatHistory, clearChatHistory } from '../controllers/chatController.js';
import { optionalAuthMiddleware, authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuthMiddleware, sendMessage);
router.get('/', authMiddleware, getChatHistory);
router.post('/clear', authMiddleware, clearChatHistory);

export default router;
