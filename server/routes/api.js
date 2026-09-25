import express from 'express';
import { visualizeCode } from '../controllers/visualizeController.js';
import {
  detectBugsHandler,
  getOptimizationHandler,
  getFlowchartHandler,
  getASTHandler,
  getCallGraphHandler,
  generateTestsHandler,
  findSimilarHandler,
} from '../controllers/modularControllers.js';

import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import projectRoutes from './projectRoutes.js';
import analysisRoutes from './analysisRoutes.js';
import chatRoutes from './chatRoutes.js';
import reportRoutes from './reportRoutes.js';
import historyRoutes from './historyRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

// Existing & Core AI / Analysis Endpoints
router.post('/visualize', visualizeCode);
router.post('/bugs', detectBugsHandler);
router.post('/optimization', getOptimizationHandler);
router.post('/flowchart', getFlowchartHandler);
router.post('/ast', getASTHandler);
router.post('/callgraph', getCallGraphHandler);
router.post('/tests', generateTestsHandler);
router.post('/similar-code', findSimilarHandler);

// Modular Full-Stack Sub-Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/analysis', analysisRoutes);
router.use('/chat', chatRoutes);
router.use('/reports', reportRoutes);
router.use('/history', historyRoutes);
router.use('/admin', adminRoutes);

export default router;
