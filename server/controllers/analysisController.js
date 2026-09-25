import Analysis from '../models/Analysis.js';
import AnalysisResult from '../models/AnalysisResult.js';
import Project from '../models/Project.js';
import History from '../models/History.js';
import { calculateMetrics } from '../services/analysisService.js';
import { detectBugs } from '../services/bugService.js';
import { getOptimizations } from '../services/optimizationService.js';
import { generateFlowchart } from '../services/flowchartService.js';
import { generateAST } from '../services/astService.js';
import { generateCallGraph } from '../services/callGraphService.js';
import { generateTestCases } from '../services/testCaseService.js';
import { findSimilarCode } from '../services/similarityService.js';
import { aiService } from '../services/aiService.js';
import { generateFallbackSteps } from '../services/fallbackSimulator.js';
import { generateAIExplanation } from '../services/aiExplanationService.js';

export const createAnalysis = async (req, res, next) => {
  try {
    const { projectId, code, language = 'python', analysisType = 'full' } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Source code is required for analysis.',
        errorCode: 'MISSING_SOURCE_CODE',
      });
    }

    const userId = req.user ? req.user._id : null;

    // 1. Calculate static & AST metrics
    const { metrics, qualityScore } = calculateMetrics(code, language);

    // 2. Run bugs, optimizations, flowchart, ast, callgraph, tests, similarity & AI explanation concurrently
    const [bugs, optimizations, flowchart, ast, callGraph, testCases, similarCode, aiExplanation] = await Promise.all([
      detectBugs(code, language),
      getOptimizations(code, language),
      Promise.resolve(generateFlowchart(code, language)),
      Promise.resolve(generateAST(code, language)),
      Promise.resolve(generateCallGraph(code, language)),
      generateTestCases(code, language),
      Promise.resolve(findSimilarCode(code, language)),
      generateAIExplanation(code, language),
    ]);

    // 3. AI Overview & Step-by-Step Explanation
    let overview = {
      title: `${language.toUpperCase()} Execution Pipeline`,
      description: 'Source code processes algorithms with structured control flow.',
      timeComplexity: metrics.cyclomaticComplexity > 3 ? 'O(n log n)' : 'O(n)',
      spaceComplexity: 'O(1)',
    };

    let stepByStep = [];

    // Attempt AI or Fallback Step Simulator for deep trace
    try {
      const simulated = generateFallbackSteps(language, code);
      if (simulated && simulated.success) {
        if (simulated.summary) {
          overview = {
            ...overview,
            title: simulated.summary.title || overview.title,
            description: simulated.summary.description || overview.description,
            timeComplexity: simulated.summary.time_complexity || overview.timeComplexity,
            spaceComplexity: simulated.summary.space_complexity || overview.spaceComplexity,
            finalResult: simulated.summary.final_result || '',
          };
        }
        if (Array.isArray(simulated.steps) && simulated.steps.length > 0) {
          stepByStep = simulated.steps;
        }
      }
    } catch (simErr) {
      console.warn('Simulator fallback note:', simErr.message);
    }

    // Complexity details
    const complexity = {
      timeComplexity: overview.timeComplexity || 'O(n)',
      spaceComplexity: overview.spaceComplexity || 'O(1)',
      explanation: `Time complexity computed based on ${metrics.cyclomaticComplexity} branch paths and loop structures. Space complexity evaluated through auxiliary allocations.`,
      bottlenecks: bugs.filter(b => b.category === 'Performance').map(b => b.description),
    };

    let analysis = null;
    let result = null;

    // 4. Save in MongoDB if user is authenticated
    if (userId) {
      analysis = await Analysis.create({
        userId,
        projectId: projectId || null,
        language: language.toLowerCase(),
        sourceCode: code,
        analysisType,
        status: 'completed',
        completedAt: new Date(),
      });

      result = await AnalysisResult.create({
        analysisId: analysis._id,
        userId,
        projectId: projectId || null,
        overview,
        aiExplanation,
        stepByStepExplanation: stepByStep,
        complexity,
        qualityScore,
        metrics,
        bugs,
        optimizations,
        flowchart,
        ast,
        callGraph,
        testCases,
        similarCode,
      });

      // Update Project stats if projectId provided
      if (projectId) {
        await Project.findOneAndUpdate(
          { _id: projectId, userId },
          {
            qualityScore: qualityScore.overall,
            bugCount: bugs.length,
            lastAnalyzed: new Date(),
            latestAnalysisId: analysis._id,
          }
        );
      }

      // Record in History
      await History.create({
        userId,
        projectId: projectId || null,
        analysisId: analysis._id,
        action: 'ANALYZED_CODE',
        language: language.toLowerCase(),
        qualityScore: qualityScore.overall,
        bugCount: bugs.length,
        details: {
          metrics,
          complexity,
        },
      });
    }

    res.json({
      success: true,
      message: 'Analysis completed successfully.',
      analysisId: analysis ? analysis._id : null,
      data: {
        analysis: analysis || { language, createdAt: new Date() },
        overview,
        aiExplanation,
        stepByStepExplanation: stepByStep,
        complexity,
        qualityScore,
        metrics,
        bugs,
        optimizations,
        flowchart,
        ast,
        callGraph,
        testCases,
        similarCode,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found.',
        errorCode: 'ANALYSIS_NOT_FOUND',
      });
    }

    const result = await AnalysisResult.findOne({ analysisId: analysis._id });

    res.json({
      success: true,
      analysis,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserAnalyses = async (req, res, next) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('projectId', 'name');

    res.json({
      success: true,
      count: analyses.length,
      analyses,
    });
  } catch (error) {
    next(error);
  }
};
