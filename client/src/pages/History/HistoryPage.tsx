import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { HistoryItem } from '../../types';
import {
  History as HistoryIcon,
  Search,
  Filter,
  Trash2,
  Clock,
  Play,
  ArrowRight,
  Code2,
  Sparkles,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');

  const fetchHistoryList = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/history', {
        params: {
          action: actionFilter || undefined,
          language: languageFilter || undefined,
        },
      });
      if (res.data.success) {
        setHistory(res.data.history || []);
      }
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryList();
  }, [actionFilter, languageFilter]);

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Delete this history record?')) return;
    try {
      const res = await apiClient.delete(`/history/${id}`);
      if (res.data.success) {
        setHistory((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error('Delete history item failed', err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <HistoryIcon className="w-6 h-6 text-cyan-400" />
            <span>Analysis & Activity History</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit log of all code executions, optimizations, and report generations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Actions</option>
            <option value="ANALYZED_CODE">Analyzed Code</option>
            <option value="CREATED_PROJECT">Created Project</option>
            <option value="UPDATED_PROJECT">Updated Project</option>
            <option value="GENERATED_REPORT">Generated Report</option>
          </select>

          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Languages</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-cyan-400">
          <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-xs text-slate-400">Loading history logs...</span>
        </div>
      ) : history.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center">
          <Clock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No History Records Found</h3>
          <p className="text-xs text-slate-400 mt-1">Analyze code in the editor to populate your activity log.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase font-semibold bg-slate-950/40">
                <th className="p-4">Action</th>
                <th className="p-4">Project / Resource</th>
                <th className="p-4">Language</th>
                <th className="p-4">Quality Score</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {history.map((item) => (
                <tr key={item._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-semibold text-slate-200">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-cyan-300 border border-indigo-500/20 font-mono text-[11px]">
                      {item.action?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 font-medium">
                    {item.projectId?.name || item.details?.name || 'Interactive Session'}
                  </td>
                  <td className="p-4">
                    {item.language ? (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] uppercase font-mono text-slate-400">
                        {item.language}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="p-4">
                    {item.qualityScore ? (
                      <span className="font-bold text-emerald-400">{item.qualityScore}/100</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[11px]">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.analysisId && (
                        <Link
                          to={`/analysis/${item.analysisId._id || item.analysisId}`}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-cyan-300 hover:bg-indigo-600 hover:text-white transition-all text-[11px] inline-flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" />
                          <span>View</span>
                        </Link>
                      )}
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
