import Report from '../models/Report.js';
import Analysis from '../models/Analysis.js';
import AnalysisResult from '../models/AnalysisResult.js';
import Project from '../models/Project.js';
import History from '../models/History.js';
import { generatePDFReport, generateHTMLReport } from '../services/reportService.js';

export const generateReport = async (req, res, next) => {
  try {
    const { analysisId, reportType = 'PDF' } = req.body;

    if (!analysisId) {
      return res.status(400).json({
        success: false,
        message: 'Analysis ID is required to generate report.',
        errorCode: 'MISSING_ANALYSIS_ID',
      });
    }

    const analysis = await Analysis.findOne({
      _id: analysisId,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found.',
        errorCode: 'ANALYSIS_NOT_FOUND',
      });
    }

    const [result, project] = await Promise.all([
      AnalysisResult.findOne({ analysisId: analysis._id }),
      analysis.projectId ? Project.findById(analysis.projectId) : null,
    ]);

    // Record report in DB
    const reportRecord = await Report.create({
      userId: req.user._id,
      projectId: analysis.projectId || null,
      analysisId: analysis._id,
      title: `${project?.name || 'Code Analysis'} Report`,
      reportType: reportType.toUpperCase(),
      summary: {
        qualityScore: result?.qualityScore?.overall || 85,
        lines: result?.metrics?.lines || 0,
        bugsCount: (result?.bugs || []).length,
      },
    });

    await History.create({
      userId: req.user._id,
      projectId: analysis.projectId || null,
      analysisId: analysis._id,
      action: 'GENERATED_REPORT',
      details: { format: reportType },
    });

    if (reportType.toUpperCase() === 'PDF') {
      const pdfBuffer = await generatePDFReport({ project, analysis, result });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="codevision-report-${analysisId}.pdf"`);
      return res.send(pdfBuffer);
    } else {
      const html = generateHTMLReport({ project, analysis, result });
      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    }
  } catch (error) {
    next(error);
  }
};

export const getUserReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('projectId', 'name');

    res.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    next(error);
  }
};
