import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { HistoryItem } from '../../types';
import {
  History as HistoryIcon,
  Trash2,
  Clock,
  Play,
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
          <h1 className="text-2xl font-black text-charcoal flex items-center gap-2.5">
            <HistoryIcon className="w-6 h-6 text-terracotta" />
            <span>Analysis & Activity History</span>
          </h1>
          <p className="text-xs text-secondary-text mt-1 font-medium">
            Audit log of all code executions, optimizations, and report generations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-white border border-[#D5CEBF] text-xs text-charcoal font-bold focus:outline-none focus:border-terracotta shadow-sm"
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
            className="px-3.5 py-2.5 rounded-2xl bg-white border border-[#D5CEBF] text-xs text-charcoal font-bold focus:outline-none focus:border-terracotta shadow-sm"
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
        <div className="py-20 flex flex-col items-center justify-center text-terracotta">
          <div className="w-8 h-8 border-3 border-terracotta border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-xs text-secondary-text font-bold">Loading history logs...</span>
        </div>
      ) : history.length === 0 ? (
        <div className="p-12 rounded-3xl border border-border-pearl bg-white text-center shadow-sm">
          <Clock className="w-10 h-10 text-secondary-text mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-black text-charcoal">No History Records Found</h3>
          <p className="text-xs text-secondary-text mt-1">Analyze code in the editor to populate your activity log.</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-border-pearl overflow-hidden bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-pearl text-[11px] text-secondary-text uppercase font-bold bg-ivory font-mono">
                <th className="p-4">Action</th>
                <th className="p-4">Project / Resource</th>
                <th className="p-4">Language</th>
                <th className="p-4">Quality Score</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-pearl text-xs">
              {history.map((item) => (
                <tr key={item._id} className="hover:bg-pearl/60 transition-colors">
                  <td className="p-4 font-semibold text-charcoal">
                    <span className="px-2.5 py-1 rounded-full bg-terracotta/10 text-terracotta border border-terracotta/20 font-mono text-[11px] font-bold">
                      {item.action?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-charcoal font-bold">
                    {item.projectId?.name || item.details?.name || 'Interactive Session'}
                  </td>
                  <td className="p-4">
                    {item.language ? (
                      <span className="px-2 py-0.5 rounded-full bg-secondary-card text-[10px] uppercase font-mono text-secondary-text font-bold">
                        {item.language}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="p-4">
                    {item.qualityScore ? (
                      <span className="font-bold font-mono text-lime-700">{item.qualityScore}/100</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="p-4 text-secondary-text font-mono text-[11px]">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.analysisId && (
                        <Link
                          to={`/analysis/${item.analysisId._id || item.analysisId}`}
                          className="px-3 py-1 rounded-xl bg-terracotta text-white hover:bg-orange-warm transition-all text-[11px] font-bold inline-flex items-center gap-1 shadow-sm"
                        >
                          <Play className="w-3 h-3" />
                          <span>View</span>
                        </Link>
                      )}
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="p-1.5 rounded-lg text-secondary-text hover:text-terracotta hover:bg-secondary-card transition-colors cursor-pointer"
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
