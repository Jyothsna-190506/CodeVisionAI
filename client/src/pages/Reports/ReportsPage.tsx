import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { ReportItem } from '../../types';
import { FileText, Download } from 'lucide-react';

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
        <h1 className="text-2xl font-black text-charcoal flex items-center gap-2.5">
          <FileText className="w-6 h-6 text-terracotta" />
          <span>Exported Reports</span>
        </h1>
        <p className="text-xs text-secondary-text mt-1 font-medium">
          Download past PDF and HTML code audit and complexity summaries.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-terracotta">
          <div className="w-8 h-8 border-3 border-terracotta border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-xs text-secondary-text font-bold">Loading reports repository...</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="p-12 rounded-3xl border border-border-pearl bg-white text-center shadow-sm">
          <FileText className="w-10 h-10 text-secondary-text mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-black text-charcoal">No Reports Generated Yet</h3>
          <p className="text-xs text-secondary-text mt-1">
            Run an analysis in the Editor and click "Export PDF" or "Export HTML" to store reports here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((report) => (
            <div
              key={report._id}
              className="p-6 rounded-3xl border border-border-pearl bg-white shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-terracotta/10 text-terracotta border border-terracotta/20 font-mono">
                    {report.reportType}
                  </span>
                  <span className="text-[10px] text-secondary-text font-mono font-medium">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-black text-charcoal truncate">{report.title}</h3>
                <p className="text-xs text-secondary-text mt-1 font-medium">
                  Project: {report.projectId?.name || 'Interactive Code'}
                </p>

                {report.summary && (
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2.5 rounded-2xl bg-secondary-card border border-border-pearl">
                      <span className="text-[9px] text-secondary-text block font-bold">Quality</span>
                      <span className="text-lime-700 font-bold">{report.summary.qualityScore}/100</span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-secondary-card border border-border-pearl">
                      <span className="text-[9px] text-secondary-text block font-bold">Lines</span>
                      <span className="text-charcoal font-bold">{report.summary.lines}</span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-secondary-card border border-border-pearl">
                      <span className="text-[9px] text-secondary-text block font-bold">Bugs</span>
                      <span className="text-terracotta font-bold">{report.summary.bugsCount}</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleDownload(report)}
                className="w-full py-2.5 px-4 rounded-2xl bg-terracotta hover:bg-orange-warm text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-terracotta/20 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Download Report</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
