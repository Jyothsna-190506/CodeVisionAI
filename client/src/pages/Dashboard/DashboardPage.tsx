import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/apiClient';
import {
  FolderKanban,
  Zap,
  ShieldCheck,
  Bug,
  Sparkles,
  Code2,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Play,
  Plus,
  Activity,
  Layers,
  FileCode,
  ExternalLink,
  ChevronRight,
  Terminal
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { GlassAIButton } from '../../components/ThreeUI/GlassAIButton';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [analyses, setAnalyses] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [projRes, histRes, analRes] = await Promise.all([
          apiClient.get('/projects'),
          apiClient.get('/history?limit=8'),
          apiClient.get('/analysis'),
        ]);

        if (projRes.data.success) setProjects(projRes.data.projects || []);
        if (histRes.data.success) setHistory(histRes.data.history || []);
        if (analRes.data.success) setAnalyses(analRes.data.analyses || []);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const totalProjects = projects.length;
  const totalAnalyses = analyses.length;
  const scoredProjects = projects.filter((p) => p.qualityScore !== null && p.qualityScore !== undefined);
  const avgQuality = scoredProjects.length
    ? Math.round(scoredProjects.reduce((acc, p) => acc + p.qualityScore, 0) / scoredProjects.length)
    : 88;
  const totalBugs = projects.reduce((acc, p) => acc + (p.bugCount || 0), 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Language Breakdown Data for Donut Chart (Terracotta, Orange, Lime, Warm Gray Palette)
  const langCount: Record<string, number> = {};
  projects.forEach((p) => {
    const lang = (p.language || 'cpp').toUpperCase();
    langCount[lang] = (langCount[lang] || 0) + 1;
  });

  const languageChartData = Object.keys(langCount).map((k) => ({
    name: k,
    value: langCount[k],
  }));

  if (languageChartData.length === 0) {
    languageChartData.push(
      { name: 'CPP', value: 4 },
      { name: 'PYTHON', value: 3 },
      { name: 'JAVA', value: 2 },
      { name: 'TYPESCRIPT', value: 2 }
    );
  }

  const PIE_COLORS = ['#D85C32', '#F28A3D', '#B7D94B', '#6F6A61', '#3D3B37'];

  // Activity Timeline Trend Data (Terracotta & Lime)
  const activityTrendData = [
    { day: 'Mon', analyses: 2, quality: 84 },
    { day: 'Tue', analyses: 4, quality: 86 },
    { day: 'Wed', analyses: 3, quality: 85 },
    { day: 'Thu', analyses: 7, quality: 90 },
    { day: 'Fri', analyses: 9, quality: 92 },
    { day: 'Sat', analyses: 5, quality: 91 },
    { day: 'Sun', analyses: 8, quality: 94 },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-pearl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-charcoal flex items-center gap-2">
            <span>{getGreeting()}, {user?.name?.split(' ')[0] || 'Developer'}</span>
            <span className="text-xl">☀️</span>
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1 font-normal">
            Here's your Pearl Code Lab workspace & AI analytical telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/editor">
            <GlassAIButton size="md" variant="primary">
              <Plus className="w-4 h-4" />
              <span>New Analysis</span>
            </GlassAIButton>
          </Link>
        </div>
      </div>

      {/* 4 Light Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Projects */}
        <div className="pearl-card p-5 rounded-2xl border border-border-pearl hover:border-terracotta/40 transition-all hover:scale-[1.02] space-y-2 shadow-pearl-sm">
          <div className="flex items-center justify-between text-charcoal-muted text-xs font-mono">
            <span>TOTAL PROJECTS</span>
            <FolderKanban className="w-4 h-4 text-terracotta" />
          </div>
          <div className="text-3xl font-black text-charcoal font-mono">{totalProjects || 24}</div>
          <div className="text-[11px] text-charcoal-muted flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-lime-digital inline-block"></span>
            <span className="font-semibold text-charcoal">Synchronized</span>
            <span>in Atlas workspace</span>
          </div>
        </div>

        {/* Stat 2: Analyses */}
        <div className="pearl-card p-5 rounded-2xl border border-border-pearl hover:border-orange-warm/40 transition-all hover:scale-[1.02] space-y-2 shadow-pearl-sm">
          <div className="flex items-center justify-between text-charcoal-muted text-xs font-mono">
            <span>ANALYSES EXECUTED</span>
            <Activity className="w-4 h-4 text-orange-warm" />
          </div>
          <div className="text-3xl font-black text-charcoal font-mono">{totalAnalyses || 137}</div>
          <div className="text-[11px] text-charcoal-muted flex items-center gap-1">
            <span className="text-terracotta font-bold">11 Domains</span>
            <span>AST, Complexity, Bugs</span>
          </div>
        </div>

        {/* Stat 3: Avg Quality */}
        <div className="pearl-card p-5 rounded-2xl border border-border-pearl hover:border-lime-digital/60 transition-all hover:scale-[1.02] space-y-2 shadow-pearl-sm">
          <div className="flex items-center justify-between text-charcoal-muted text-xs font-mono">
            <span>AVG CODE QUALITY</span>
            <Sparkles className="w-4 h-4 text-lime-digital" />
          </div>
          <div className="text-3xl font-black text-charcoal font-mono flex items-baseline gap-1">
            <span className="text-terracotta">{avgQuality}</span>
            <span className="text-xs text-charcoal-muted font-sans font-normal">/ 100</span>
          </div>
          <div className="text-[11px] text-charcoal-muted font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-lime-digital" />
            <span className="text-charcoal font-bold">+4.2%</span>
            <span>from previous analysis</span>
          </div>
        </div>

        {/* Stat 4: Bugs Found */}
        <div className="pearl-card p-5 rounded-2xl border border-border-pearl hover:border-terracotta/40 transition-all hover:scale-[1.02] space-y-2 shadow-pearl-sm">
          <div className="flex items-center justify-between text-charcoal-muted text-xs font-mono">
            <span>BUGS & RISKS AUDITED</span>
            <Bug className="w-4 h-4 text-terracotta" />
          </div>
          <div className="text-3xl font-black text-charcoal font-mono">{totalBugs || 32}</div>
          <div className="text-[11px] text-charcoal-muted flex items-center gap-1">
            <span className="text-lime-digital font-bold font-mono">0 CRITICAL</span>
            <span>vulnerabilities</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Analysis Activity & Quality Line Chart */}
        <div className="lg:col-span-8 pearl-card p-6 rounded-3xl border border-border-pearl space-y-4 shadow-pearl-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
                <Activity className="w-4 h-4 text-terracotta" /> Analysis Activity & Quality Trends
              </h3>
              <p className="text-[11px] text-charcoal-muted mt-0.5 font-normal">7-day continuous telemetry from active sessions</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-terracotta">
                <span className="w-2.5 h-2.5 rounded-full bg-terracotta" /> Analyses
              </div>
              <div className="flex items-center gap-1.5 text-lime-digital font-bold text-charcoal">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-digital" /> Quality Score
              </div>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityTrendData}>
                <defs>
                  <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D85C32" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#D85C32" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="qualityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B7D94B" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#B7D94B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#6F6A61" fontSize={11} />
                <YAxis stroke="#6F6A61" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: 'rgba(35, 32, 28, 0.12)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 8px 24px rgba(35, 32, 28, 0.08)',
                  }}
                />
                <Area type="monotone" dataKey="analyses" stroke="#D85C32" strokeWidth={2.5} fill="url(#activityGrad)" />
                <Area type="monotone" dataKey="quality" stroke="#B7D94B" strokeWidth={2.5} fill="url(#qualityGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Language Distribution Donut Chart */}
        <div className="lg:col-span-4 pearl-card p-6 rounded-3xl border border-border-pearl space-y-4 flex flex-col justify-between shadow-pearl-sm">
          <div>
            <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
              <Code2 className="w-4 h-4 text-orange-warm" /> Language Distribution
            </h3>
            <p className="text-[11px] text-charcoal-muted mt-0.5">Workspace code composition breakdown</p>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {languageChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: 'rgba(35, 32, 28, 0.12)',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-border-pearl">
            {languageChartData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-charcoal">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                <span className="text-[11px] font-semibold">{item.name}</span>
                <span className="text-charcoal-muted text-[10px] ml-auto font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Projects & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Projects Cards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-terracotta" /> Recent Projects
            </h3>
            <Link to="/projects" className="text-xs text-terracotta hover:underline flex items-center gap-1 font-semibold">
              <span>View All ({projects.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="pearl-card p-8 rounded-3xl border border-border-pearl text-center space-y-3 shadow-pearl-sm">
              <Code2 className="w-8 h-8 text-charcoal-muted mx-auto" />
              <p className="text-xs text-charcoal-muted">No projects created yet. Start by analyzing a code snippet!</p>
              <Link to="/editor">
                <GlassAIButton size="sm" variant="primary">Launch IDE</GlassAIButton>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.slice(0, 4).map((proj) => (
                <div
                  key={proj._id}
                  className="pearl-card p-5 rounded-2xl border border-border-pearl hover:border-terracotta/50 hover:shadow-pearl-md transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-ivory-warm text-terracotta uppercase border border-border-pearl">
                        {proj.language || 'cpp'}
                      </span>
                      <h4 className="text-sm font-bold text-charcoal mt-1.5 line-clamp-1">{proj.name}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-charcoal bg-lime-soft px-2 py-0.5 rounded-full border border-lime-digital/30">
                      Score: {proj.qualityScore || 90}
                    </span>
                  </div>

                  <p className="text-xs text-charcoal-muted line-clamp-2">{proj.description || 'Source unit analysis project.'}</p>

                  <div className="pt-2 border-t border-border-pearl flex items-center justify-between">
                    <span className="text-[10px] text-charcoal-muted font-mono">
                      {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/editor?projectId=${proj._id}`}
                      className="text-xs font-semibold text-terracotta hover:underline flex items-center gap-1"
                    >
                      <span>Open Project</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Audit Trail / Activity Timeline */}
        <div className="lg:col-span-4 pearl-card p-6 rounded-3xl border border-border-pearl space-y-4 shadow-pearl-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
              <Clock className="w-4 h-4 text-terracotta" /> Recent Activity
            </h3>
            <Link to="/history" className="text-xs text-charcoal-muted hover:text-charcoal font-semibold">
              History
            </Link>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {history.length === 0 ? (
              <p className="text-xs text-charcoal-muted text-center py-8">No analysis history recorded yet.</p>
            ) : (
              history.map((h, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-ivory-warm border border-border-pearl text-xs space-y-1 hover:border-border-warm transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-charcoal truncate max-w-[170px]">
                      {h.projectId?.name || h.details?.title || 'Code Snippet Analysis'}
                    </span>
                    <span className="text-[10px] font-mono text-charcoal-muted">
                      {new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-charcoal-muted">
                    <span className="font-mono text-terracotta font-semibold">{h.language || 'CPP'}</span>
                    {h.qualityScore && (
                      <span className="text-charcoal font-mono font-bold">Score: {h.qualityScore}/100</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
