import Project from '../models/Project.js';
import Analysis from '../models/Analysis.js';
import AnalysisResult from '../models/AnalysisResult.js';
import History from '../models/History.js';
import ChatMessage from '../models/ChatMessage.js';

export const getProjects = async (req, res, next) => {
  try {
    const { search, language, isFavorite, sort = 'updatedAt' } = req.query;
    const query = { userId: req.user._id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (language) {
      query.language = language.toLowerCase();
    }

    if (isFavorite !== undefined) {
      query.isFavorite = isFavorite === 'true';
    }

    const sortOption = sort === 'name' ? { name: 1 } : { updatedAt: -1 };
    const projects = await Project.find(query).sort(sortOption);

    res.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or access denied.',
        errorCode: 'PROJECT_NOT_FOUND',
      });
    }

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { name, description, language = 'python', code = '', tags = [] } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required.',
        errorCode: 'MISSING_NAME',
      });
    }

    const project = await Project.create({
      userId: req.user._id,
      name,
      description,
      language: language.toLowerCase(),
      code,
      tags: Array.isArray(tags) ? tags : [],
    });

    await History.create({
      userId: req.user._id,
      projectId: project._id,
      action: 'CREATED_PROJECT',
      language: project.language,
      details: { name: project.name },
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { name, description, language, code, tags, isFavorite } = req.body;
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
        errorCode: 'PROJECT_NOT_FOUND',
      });
    }

    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (language) project.language = language.toLowerCase();
    if (code !== undefined) project.code = code;
    if (tags !== undefined) project.tags = tags;
    if (isFavorite !== undefined) project.isFavorite = isFavorite;

    await project.save();

    await History.create({
      userId: req.user._id,
      projectId: project._id,
      action: 'UPDATED_PROJECT',
      language: project.language,
      details: { name: project.name },
    });

    res.json({
      success: true,
      message: 'Project updated successfully.',
      project,
    });
  } catch (error) {
    next(error);
  }
};

export const duplicateProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Original project not found.',
        errorCode: 'PROJECT_NOT_FOUND',
      });
    }

    const duplicated = await Project.create({
      userId: req.user._id,
      name: `${project.name} (Copy)`,
      description: project.description,
      language: project.language,
      code: project.code,
      tags: [...project.tags],
      isFavorite: false,
    });

    res.status(201).json({
      success: true,
      message: 'Project duplicated successfully.',
      project: duplicated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
        errorCode: 'PROJECT_NOT_FOUND',
      });
    }

    // Clean up related analyses, results, chat messages
    await Analysis.deleteMany({ projectId: req.params.id });
    await AnalysisResult.deleteMany({ projectId: req.params.id });
    await ChatMessage.deleteMany({ projectId: req.params.id });

    await History.create({
      userId: req.user._id,
      action: 'DELETED_PROJECT',
      details: { name: project.name },
    });

    res.json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
