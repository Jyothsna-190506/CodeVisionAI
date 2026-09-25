import History from '../models/History.js';

export const getHistory = async (req, res, next) => {
  try {
    const { action, language, page = 1, limit = 20 } = req.query;
    const query = { userId: req.user._id };

    if (action) query.action = action;
    if (language) query.language = language.toLowerCase();

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [history, total] = await Promise.all([
      History.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('projectId', 'name language')
        .populate('analysisId', 'analysisType completedAt'),
      History.countDocuments(query),
    ]);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      history,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHistoryItem = async (req, res, next) => {
  try {
    const item = await History.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'History record not found.',
      });
    }

    res.json({
      success: true,
      message: 'History record removed.',
    });
  } catch (error) {
    next(error);
  }
};
