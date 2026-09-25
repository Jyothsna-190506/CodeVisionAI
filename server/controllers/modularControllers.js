import { detectBugs } from '../services/bugService.js';
import { getOptimizations } from '../services/optimizationService.js';
import { generateFlowchart } from '../services/flowchartService.js';
import { generateAST } from '../services/astService.js';
import { generateCallGraph } from '../services/callGraphService.js';
import { generateTestCases } from '../services/testCaseService.js';
import { findSimilarCode } from '../services/similarityService.js';

export const detectBugsHandler = async (req, res, next) => {
  try {
    const { code, language = 'python' } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Code is required' });
    const bugs = await detectBugs(code, language);
    res.json({ success: true, count: bugs.length, bugs });
  } catch (err) {
    next(err);
  }
};

export const getOptimizationHandler = async (req, res, next) => {
  try {
    const { code, language = 'python' } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Code is required' });
    const optimizations = await getOptimizations(code, language);
    res.json({ success: true, count: optimizations.length, optimizations });
  } catch (err) {
    next(err);
  }
};

export const getFlowchartHandler = (req, res, next) => {
  try {
    const { code, language = 'python' } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Code is required' });
    const flowchart = generateFlowchart(code, language);
    res.json({ success: true, flowchart });
  } catch (err) {
    next(err);
  }
};

export const getASTHandler = (req, res, next) => {
  try {
    const { code, language = 'python' } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Code is required' });
    const ast = generateAST(code, language);
    res.json({ success: true, ast });
  } catch (err) {
    next(err);
  }
};

export const getCallGraphHandler = (req, res, next) => {
  try {
    const { code, language = 'python' } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Code is required' });
    const callGraph = generateCallGraph(code, language);
    res.json({ success: true, callGraph });
  } catch (err) {
    next(err);
  }
};

export const generateTestsHandler = async (req, res, next) => {
  try {
    const { code, language = 'python' } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Code is required' });
    const testCases = await generateTestCases(code, language);
    res.json({ success: true, count: testCases.length, testCases });
  } catch (err) {
    next(err);
  }
};

export const findSimilarHandler = (req, res, next) => {
  try {
    const { code, language = 'python' } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Code is required' });
    const similarCode = findSimilarCode(code, language);
    res.json({ success: true, count: similarCode.length, similarCode });
  } catch (err) {
    next(err);
  }
};
