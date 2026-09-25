import { analyzeCodeExecution } from '../services/visualizeService.js';

export const handleVisualize = async (req, res) => {
  try {
    const { language, code } = req.body;
    const result = await analyzeCodeExecution(language, code);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json(result);
  } catch (error) {
    console.error('Error in handleVisualize:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing code visualization.'
    });
  }
};

export const handleHealthCheck = (req, res) => {
  return res.json({
    status: 'OK',
    app: 'CodeVision AI API Server',
    groq_configured: Boolean(process.env.GROQ_API_KEY),
    timestamp: new Date().toISOString()
  });
};

export const visualizeCode = handleVisualize;
