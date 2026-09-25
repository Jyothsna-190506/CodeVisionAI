import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { ReportItem } from '../../types';
import { FileText, Download, Clock, FolderKanban, CheckCircle2 } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await apiClient.get('/reports');
        if (res.data.success) {
          setReports(res.data.reports || []);
        }
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDownload = async (report: ReportItem) => {
    try {
      const res = await apiClient.post(
        '/reports',
        { analysisId: report.analysisId, reportType: report.reportType || 'PDF' },
        { responseType: 'blob' }
      );

      const blob = new Blob([res.data], {
        type: report.reportType === 'PDF' ? 'application/pdf' : 'text/html',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `codevision-report-${report._id}.${report.reportType?.toLowerCase() || 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Download error: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <FileText className="w-6 h-6 text-cyan-400" />
          <span>Exported Reports</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Download past PDF and HTML code audit and complexity summaries.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-cyan-400">
          <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-xs text-slate-400">Loading reports repository...</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center">
          <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No Reports Generated Yet</h3>
          <p className="text-xs text-slate-400 mt-1">
            Run an analysis in the Editor and click "Export PDF" or "Export HTML" to store reports here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((report) => (
            <div
              key={report._id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-indigo-500/20 text-cyan-300 border border-indigo-500/30">
                    {report.reportType}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white truncate">{report.title}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Project: {report.projectId?.name || 'Interactive Code'}
                </p>

                {report.summary && (
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[9px] text-slate-500 block">Quality</span>
                      <span className="text-emerald-400 font-bold">{report.summary.qualityScore}/100</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[9px] text-slate-500 block">Lines</span>
                      <span className="text-cyan-400 font-bold">{report.summary.lines}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[9px] text-slate-500 block">Bugs</span>
                      <span className="text-rose-400 font-bold">{report.summary.bugsCount}</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleDownload(report)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download Report</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
