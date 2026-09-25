import User from '../models/User.js';
import Project from '../models/Project.js';
import Analysis from '../models/Analysis.js';
import AnalysisResult from '../models/AnalysisResult.js';
import Report from '../models/Report.js';
import History from '../models/History.js';

export const getAdminAnalytics = async (req, res, next) => {
  try {
    const [totalUsers, activeUsers, totalProjects, totalAnalyses, totalReports] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Project.countDocuments(),
      Analysis.countDocuments(),
      Report.countDocuments(),
    ]);

    // Aggregate projects by language
    const languageStats = await Project.aggregate([
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Average code quality across projects
    const avgQuality = await Project.aggregate([
      { $match: { qualityScore: { $ne: null } } },
      { $group: { _id: null, avgScore: { $avg: '$qualityScore' } } },
    ]);

    // Recent 7 days activity counts
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentActivityTrend = await History.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalProjects,
        totalAnalyses,
        totalReports,
        averageQualityScore: avgQuality[0] ? Math.round(avgQuality[0].avgScore) : 85,
        projectsByLanguage: languageStats.map((l) => ({ language: l._id || 'other', count: l.count })),
        recentActivityTrend: recentActivityTrend.map((a) => ({ date: a._id, count: a.count })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminUsers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) query.role = role;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (isActive !== undefined) user.isActive = isActive;
    if (role && ['USER', 'ADMIN'].includes(role)) user.role = role;

    await user.save();

    res.json({
      success: true,
      message: 'User status updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Cascade delete user data
    await Promise.all([
      User.findByIdAndDelete(req.params.id),
      Project.deleteMany({ userId: req.params.id }),
      Analysis.deleteMany({ userId: req.params.id }),
      AnalysisResult.deleteMany({ userId: req.params.id }),
      Report.deleteMany({ userId: req.params.id }),
      History.deleteMany({ userId: req.params.id }),
    ]);

    res.json({
      success: true,
      message: 'User and all associated data deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminActivity = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      History.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'name email role')
        .populate('projectId', 'name language'),
      History.countDocuments(),
    ]);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      logs,
    });
  } catch (error) {
    next(error);
  }
};
