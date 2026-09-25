import apiClient from './apiClient';
import {
  User,
  Project,
  AnalysisResultData,
  HistoryItem,
  ReportItem,
} from '../types';

export interface Step {
  step: number;
  line: number;
  code: string;
  type: string;
  explanation: string;
  variables: Record<string, any>;
  changed_variables?: string[];
  output?: string | null;
  stack?: string[];
  next_action?: string;
  complexity_note?: string;
}

export interface Summary {
  title: string;
  description: string;
  final_result?: string;
  time_complexity: string;
  space_complexity: string;
}

export interface VisualizeResponse {
  success: boolean;
  language?: string;
  summary?: Summary;
  steps?: Step[];
  error?: string;
}

// Preserve existing visualizeCode endpoint
export const visualizeCode = async (
  language: string,
  code: string
): Promise<VisualizeResponse> => {
  try {
    const response = await apiClient.post<VisualizeResponse>('/visualize', {
      language,
      code,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to communicate with visualization engine.');
  }
};

// Full-Stack Analysis API
export const runFullAnalysis = async (payload: {
  projectId?: string;
  code: string;
  language: string;
}): Promise<{ success: boolean; analysisId: string; data: AnalysisResultData }> => {
  const response = await apiClient.post('/analysis', payload);
  return response.data;
};

export const getAnalysis = async (id: string): Promise<{ success: boolean; data: AnalysisResultData; analysis: any }> => {
  const response = await apiClient.get(`/analysis/${id}`);
  return response.data;
};

// Projects API
export const fetchProjects = async (params?: any): Promise<{ success: boolean; projects: Project[] }> => {
  const response = await apiClient.get('/projects', { params });
  return response.data;
};

export const fetchProject = async (id: string): Promise<{ success: boolean; project: Project }> => {
  const response = await apiClient.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (data: Partial<Project>): Promise<{ success: boolean; project: Project }> => {
  const response = await apiClient.post('/projects', data);
  return response.data;
};

export const updateProject = async (id: string, data: Partial<Project>): Promise<{ success: boolean; project: Project }> => {
  const response = await apiClient.put(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: string): Promise<{ success: boolean }> => {
  const response = await apiClient.delete(`/projects/${id}`);
  return response.data;
};

export const duplicateProject = async (id: string): Promise<{ success: boolean; project: Project }> => {
  const response = await apiClient.post(`/projects/${id}/duplicate`);
  return response.data;
};

// Chat API
export const sendChatMessage = async (payload: {
  projectId?: string;
  analysisId?: string;
  message: string;
  codeSnippet?: string;
}): Promise<{ success: boolean; reply: string }> => {
  const response = await apiClient.post('/chat', payload);
  return response.data;
};

export const fetchChatHistory = async (projectId?: string): Promise<{ success: boolean; messages: any[] }> => {
  const response = await apiClient.get('/chat', { params: { projectId } });
  return response.data;
};

export const clearChat = async (projectId?: string): Promise<{ success: boolean }> => {
  const response = await apiClient.post('/chat/clear', { projectId });
  return response.data;
};

// Reports API
export const downloadReport = async (analysisId: string, reportType: 'PDF' | 'HTML' = 'PDF'): Promise<Blob> => {
  const response = await apiClient.post(
    '/reports',
    { analysisId, reportType },
    { responseType: 'blob' }
  );
  return response.data;
};

export const fetchUserReports = async (): Promise<{ success: boolean; reports: ReportItem[] }> => {
  const response = await apiClient.get('/reports');
  return response.data;
};

// History API
export const fetchHistory = async (params?: any): Promise<{ success: boolean; history: HistoryItem[]; total: number; totalPages: number }> => {
  const response = await apiClient.get('/history', { params });
  return response.data;
};

export const deleteHistory = async (id: string): Promise<{ success: boolean }> => {
  const response = await apiClient.delete(`/history/${id}`);
  return response.data;
};

// Admin API
export const fetchAdminAnalytics = async (): Promise<{ success: boolean; data: any }> => {
  const response = await apiClient.get('/admin/analytics');
  return response.data;
};

export const fetchAdminUsers = async (params?: any): Promise<{ success: boolean; users: User[]; total: number }> => {
  const response = await apiClient.get('/admin/users', { params });
  return response.data;
};

export const updateAdminUser = async (id: string, data: { isActive?: boolean; role?: string }): Promise<{ success: boolean; user: User }> => {
  const response = await apiClient.put(`/admin/users/${id}`, data);
  return response.data;
};

export const deleteAdminUser = async (id: string): Promise<{ success: boolean }> => {
  const response = await apiClient.delete(`/admin/users/${id}`);
  return response.data;
};

export const fetchAdminActivity = async (params?: any): Promise<{ success: boolean; logs: any[]; total: number }> => {
  const response = await apiClient.get('/admin/activity', { params });
  return response.data;
};
