import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { AnalysisResultData, ASTNode } from '../../types';
import { AIExplanationView } from '../../components/AIExplanation/AIExplanationView';
import { ProjectAwareAssistant } from '../../components/ProjectAwareAssistant/ProjectAwareAssistant';
import { ProfessionalFlowchart } from '../../components/Flowchart/ProfessionalFlowchart';
import { ProfessionalASTExplorer } from '../../components/AST/ProfessionalASTExplorer';
import { ThreeUplinkLoader } from '../../components/ThreeUI/ThreeUplinkLoader';
import { GlassAIButton } from '../../components/ThreeUI/GlassAIButton';
import {
  LayoutDashboard,
  Sparkles,
  ShieldCheck,
  Bug,
  Zap,
  GitFork,
  Network,
  Binary,
  CheckCircle2,
  FileCode,
  MessageSquare,
  Download,
  Clock,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Copy,
  AlertTriangle,
  Play,
  RotateCcw,
  Code2,
  Terminal,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export const AnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'ai_explanation'
    | 'trace'
    | 'metrics'
    | 'bugs'
    | 'optimization'
    | 'flowchart'
    | 'ast'
    | 'callgraph'
    | 'tests'
    | 'similarity'
    | 'assistant'
  >('overview');

  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<AnalysisResultData | null>(null);
  const [analysisMeta, setAnalysisMeta] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Execution Trace state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingHTML, setIsExportingHTML] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Line prompt helper for Assistant
  const [linePromptToAsk, setLinePromptToAsk] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    const loadAnalysis = async () => {
      // 1. If passed via state from editor directly
      if (location.state?.resultData) {
        setResult(location.state.resultData);
        setAnalysisMeta({
          language: location.state.language,
          sourceCode: location.state.code,
          projectName: location.state.projectName || 'Active Code Session',
        });
        setLoading(false);
        return;
      }

      if (!id) {
        setLoading(false);
        return;
      }

      // 2. Load from MongoDB
      try {
        setLoading(true);
        const res = await apiClient.get(`/analysis/${id}`);
        if (res.data.success) {
          setResult(res.data.data);
          setAnalysisMeta(res.data.analysis);
        }
      } catch (err: any) {
        setErrorMsg('Failed to load analysis: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [id, location.state]);

  const handleExportReport = async (format: 'PDF' | 'HTML') => {
    if (!id) return;
    if (format === 'PDF') setIsExportingPDF(true);
    else setIsExportingHTML(true);

    try {
      const response = await apiClient.post(
        '/reports',
        { analysisId: id, reportType: format },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], {
        type: format === 'PDF' ? 'application/pdf' : 'text/html',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `codevision-report-${id}.${format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Failed to export report: ' + err.message);
    } finally {
      setIsExportingPDF(false);
      setIsExportingHTML(false);
    }
  };

  const handleAskAboutLine = (lineNumber: number) => {
    setActiveTab('assistant');
    setLinePromptToAsk(`Explain line ${lineNumber} in detail and how it affects memory state.`);
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6">
        <ThreeUplinkLoader
          status="Executing 11-Domain AI Analysis Pipeline..."
          stage="AST Extraction → Flowchart → Asymptotic Complexity → Step Simulation"
        />
      </div>
    );
  }

  if (errorMsg || !result) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="glass-panel p-8 rounded-3xl border border-rose-500/30 bg-rose-950/20">
          <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-2">Analysis Not Available</h2>
          <p className="text-xs text-slate-300 mb-6">{errorMsg || 'Could not retrieve analysis data.'}</p>
          <Link
            to="/editor"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg inline-flex items-center gap-2"
          >
            <Code2 className="w-4 h-4" />
            <span>Open Code Editor</span>
          </Link>
        </div>
      </div>
    );
  }

  // Quality Radar Data
  const qualityRadarData = [
    { subject: 'Readability', score: result.qualityScore?.breakdown?.readability || 85, fullMark: 100 },
    { subject: 'Maintainability', score: result.qualityScore?.breakdown?.maintainability || 85, fullMark: 100 },
    { subject: 'Complexity', score: result.qualityScore?.breakdown?.complexity || 80, fullMark: 100 },
    { subject: 'Documentation', score: result.qualityScore?.breakdown?.documentation || 75, fullMark: 100 },
    { subject: 'Duplication', score: result.qualityScore?.breakdown?.duplication || 90, fullMark: 100 },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'ai_explanation', label: 'AI Explanation', icon: Sparkles },
    { id: 'trace', label: 'Execution Trace', icon: Terminal },
    { id: 'metrics', label: 'Metrics & Quality', icon: ShieldCheck },
    { id: 'bugs', label: `Bugs (${(result.bugs || []).length})`, icon: Bug },
    { id: 'optimization', label: `Optimization (${(result.optimizations || []).length})`, icon: Zap },
    { id: 'flowchart', label: 'Flowchart', icon: GitFork },
    { id: 'ast', label: 'AST Visualizer', icon: Binary },
    { id: 'callgraph', label: 'Call Graph', icon: Network },
    { id: 'tests', label: `Test Cases (${(result.testCases || []).length})`, icon: CheckCircle2 },
    { id: 'similarity', label: 'Similar Code', icon: FileCode },
    { id: 'assistant', label: 'Project-Aware AI Assistant', icon: MessageSquare },
  ];

  const steps = result.stepByStepExplanation || [];
  const activeStep = steps[currentStepIndex];

  return (
    <div className="p-6 max-w-[1700px] mx-auto space-y-6">
      {/* Top Banner & Header Controls */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30">
              {analysisMeta?.language || 'Algorithm'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Quality Score:{' '}
              <strong className="text-emerald-400 font-bold">{result.qualityScore?.overall || 85}/100</strong>
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">{result.overview?.title || 'Comprehensive Code Analysis'}</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">{result.overview?.description}</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleExportReport('PDF')}
            disabled={isExportingPDF || !id}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isExportingPDF ? 'Generating...' : 'Export PDF'}</span>
          </button>

          <button
            onClick={() => handleExportReport('HTML')}
            disabled={isExportingHTML || !id}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isExportingHTML ? 'Generating...' : 'Export HTML'}</span>
          </button>

          <Link
            to={analysisMeta?.projectId ? `/editor/${analysisMeta.projectId}` : '/editor'}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Edit Code</span>
          </Link>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-500/20 text-cyan-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : ''}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
              <span className="text-xs text-slate-400 font-medium">Time Complexity</span>
              <div className="text-xl font-bold text-cyan-400 mt-1">{result.complexity?.timeComplexity || 'O(n)'}</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Asymptotic computation limit</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
              <span className="text-xs text-slate-400 font-medium">Space Complexity</span>
              <div className="text-xl font-bold text-indigo-400 mt-1">{result.complexity?.spaceComplexity || 'O(1)'}</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Auxiliary stack & heap memory</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
              <span className="text-xs text-slate-400 font-medium">Cyclomatic Complexity</span>
              <div className="text-xl font-bold text-amber-400 mt-1">{result.metrics?.cyclomaticComplexity || 1}</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Independent linear execution paths</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
              <span className="text-xs text-slate-400 font-medium">Maintainability Index</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">{result.metrics?.maintainabilityIndex || 85}/100</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Halstead Volume & LOC metric</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Complexity & Execution Analysis</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {result.complexity?.explanation || 'Algorithmic execution verified across all branching conditions.'}
              </p>

              {result.complexity?.bottlenecks && result.complexity.bottlenecks.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                  <span className="font-bold block mb-1">Identified Performance Bottlenecks:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {result.complexity.bottlenecks.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.overview?.finalResult && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">Final Computed Result / Output</span>
                  <pre className="text-xs font-mono text-cyan-300 whitespace-pre-wrap">{result.overview.finalResult}</pre>
                </div>
              )}
            </div>

            {/* Quality Radar Chart */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-white mb-2">Quality Dimension Breakdown</h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={qualityRadarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                    <PolarRadiusAxis stroke="#475569" angle={30} domain={[0, 100]} fontSize={9} />
                    <Radar name="Quality" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DEDICATED AI EXPLANATION TAB (ALL 11 SECTIONS) */}
      {activeTab === 'ai_explanation' && (
        <AIExplanationView
          explanation={result.aiExplanation}
          language={analysisMeta?.language || 'cpp'}
          onAskAIAboutSection={(prompt) => {
            setActiveTab('assistant');
            setLinePromptToAsk(prompt);
          }}
        />
      )}

      {/* 3. EXECUTION TRACE (INTERACTIVE LINE-BY-LINE STEP RUNNER) */}
      {activeTab === 'trace' && (
        <div className="space-y-4">
          {steps.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
              No step execution trace available for this code snippet.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Step Player Controls & Memory */}
              <div className="lg:col-span-8 glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-600/30 text-cyan-300 text-xs font-mono font-bold">
                        Step {activeStep?.step || currentStepIndex + 1} of {steps.length}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 uppercase font-mono">
                        Line {activeStep?.line || 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAskAboutLine(activeStep?.line || 1)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-600 text-cyan-300 hover:text-white border border-indigo-500/30 text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Ask AI about this line</span>
                      </button>
                    </div>
                  </div>

                  {/* Active Code Line */}
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200">
                    <span className="text-indigo-400 font-bold mr-2">{activeStep?.line} |</span>
                    <span className="text-amber-300">{activeStep?.code}</span>
                  </div>

                  {/* Step Action Explanation */}
                  <div className="mt-4 p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-200 leading-relaxed">
                    <strong className="text-cyan-400 block mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Statement Execution Action:
                    </strong>
                    {activeStep?.explanation || 'Executing runtime instruction and memory register update.'}
                  </div>

                  {/* Active Variables in Memory */}
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-slate-300 mb-2">Variables in Memory:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {activeStep?.variables &&
                        Object.entries(activeStep.variables).map(([key, val]) => {
                          const isChanged = (activeStep?.changed_variables || []).includes(key);
                          return (
                            <div
                              key={key}
                              className={`p-2.5 rounded-xl border text-xs font-mono ${
                                isChanged
                                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                                  : 'bg-slate-950/80 border-slate-800 text-slate-300'
                              }`}
                            >
                              <span className="text-slate-500 text-[10px] block">{key}</span>
                              <span className="font-bold">{JSON.stringify(val)}</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Step Slider / Controls */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                  <button
                    onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentStepIndex === 0}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold disabled:opacity-40"
                  >
                    Previous Step
                  </button>

                  <input
                    type="range"
                    min={0}
                    max={steps.length - 1}
                    value={currentStepIndex}
                    onChange={(e) => setCurrentStepIndex(Number(e.target.value))}
                    className="flex-1 accent-indigo-500"
                  />

                  <button
                    onClick={() => setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                    disabled={currentStepIndex === steps.length - 1}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-40"
                  >
                    Next Step
                  </button>
                </div>
              </div>

              {/* Right Steps Navigation List */}
              <div className="lg:col-span-4 glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/60 max-h-[500px] overflow-y-auto space-y-2">
                <h4 className="text-xs font-bold text-white mb-3">All Execution Steps</h4>
                {steps.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      idx === currentStepIndex
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-cyan-300'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                      <span>Step #{s.step || idx + 1}</span>
                      <span className="text-[10px] text-slate-500">Line {s.line}</span>
                    </div>
                    <p className="text-[11px] truncate text-slate-300">{s.code}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. METRICS & QUALITY TAB */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60">
            <h3 className="text-base font-bold text-white mb-1">Transparent Quality Formula</h3>
            <p className="text-xs text-slate-400 mb-4">{result.qualityScore?.formula}</p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              {Object.entries(result.qualityScore?.breakdown || {}).map(([key, val]) => (
                <div key={key} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 uppercase font-mono">{key}</span>
                  <div className="text-xl font-black text-cyan-400 mt-1">{val}/100</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/40">
              <span className="text-[11px] text-slate-400 font-mono">Total Lines</span>
              <div className="text-lg font-bold text-white mt-1">{result.metrics?.lines || 0}</div>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/40">
              <span className="text-[11px] text-slate-400 font-mono">Comments LOC</span>
              <div className="text-lg font-bold text-emerald-400 mt-1">{result.metrics?.comments || 0}</div>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/40">
              <span className="text-[11px] text-slate-400 font-mono">Functions Count</span>
              <div className="text-lg font-bold text-indigo-400 mt-1">{result.metrics?.functions || 0}</div>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/40">
              <span className="text-[11px] text-slate-400 font-mono">Max Nesting Depth</span>
              <div className="text-lg font-bold text-amber-400 mt-1">{result.metrics?.nestingDepth || 1}</div>
            </div>
          </div>
        </div>
      )}

      {/* 5. BUGS & SECURITY TAB */}
      {activeTab === 'bugs' && (
        <div className="space-y-4">
          {(result.bugs || []).length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center text-xs text-emerald-400">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
              No static bugs or critical security issues detected.
            </div>
          ) : (
            (result.bugs || []).map((bug, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        bug.severity === 'Critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : bug.severity === 'High'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-cyan-300 border border-blue-500/30'
                      }`}
                    >
                      {bug.severity}
                    </span>
                    <span className="text-xs font-bold text-white">{bug.title}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <span>Line {bug.line}</span>
                    <span>•</span>
                    <span>{bug.source || 'static-analysis'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{bug.description}</p>
                <div className="text-xs text-slate-400">
                  <strong className="text-slate-300">Why it matters: </strong>
                  {bug.whyItMatters}
                </div>

                {bug.suggestedFix && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300">
                    <span className="text-[10px] text-slate-500 block mb-1">Suggested Fix:</span>
                    {bug.suggestedFix}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 6. OPTIMIZATION TAB */}
      {activeTab === 'optimization' && (
        <div className="space-y-4">
          {(result.optimizations || []).map((opt, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{opt.title}</h3>
                  <span className="text-[10px] text-cyan-400 font-mono">{opt.category}</span>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
                  ⚡ {opt.expectedBenefit}
                </span>
              </div>

              <p className="text-xs text-slate-300">{opt.explanation}</p>

              {/* Side-by-side Diff / Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Current Code</span>
                  <pre className="text-xs font-mono text-rose-300/90 whitespace-pre-wrap overflow-x-auto">{opt.currentCode}</pre>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-emerald-400 uppercase font-mono">Optimized Code</span>
                    <button
                      onClick={() => handleCopy(opt.optimizedCode, `opt-${idx}`)}
                      className="text-slate-400 hover:text-white p-1 text-[10px] flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedId === `opt-${idx}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap overflow-x-auto">{opt.optimizedCode}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7. ENHANCED PROFESSIONAL FLOWCHART TAB */}
      {activeTab === 'flowchart' && (
        <ProfessionalFlowchart
          flowchart={result.flowchart}
          language={analysisMeta?.language || 'cpp'}
          onAskAI={(prompt) => {
            setActiveTab('assistant');
            setLinePromptToAsk(prompt);
          }}
        />
      )}

      {/* 8. ENHANCED PROFESSIONAL AST EXPLORER TAB */}
      {activeTab === 'ast' && (
        <ProfessionalASTExplorer
          ast={result.ast}
          language={analysisMeta?.language || 'cpp'}
          onAskAI={(prompt) => {
            setActiveTab('assistant');
            setLinePromptToAsk(prompt);
          }}
        />
      )}

      {/* 9. CALL GRAPH TAB */}
      {activeTab === 'callgraph' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60">
          <h3 className="text-sm font-bold text-white mb-1">Function Call Graph</h3>
          <p className="text-xs text-slate-400 mb-6">Invocations and caller/callee dependencies</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(result.callGraph?.nodes || []).map((node) => (
              <div key={node.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-300">{node.label}</span>
                  <span className="text-[10px] text-slate-500">Line {node.line || '—'}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Calls: <strong className="text-indigo-400">{node.callCount} functions</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. TEST CASES TAB */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          {(result.testCases || []).map((tc, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-cyan-300 text-xs font-mono font-bold">
                    {tc.id}
                  </span>
                  <span className="text-xs font-bold text-white">{tc.type}</span>
                </div>
                <button
                  onClick={() => handleCopy(tc.codeSnippet, `test-${idx}`)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === `test-${idx}` ? 'Copied' : 'Copy Test'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300">{tc.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                  <span className="text-[10px] text-slate-500 block">Input:</span>
                  {tc.input}
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400">
                  <span className="text-[10px] text-slate-500 block">Expected Output:</span>
                  {tc.expectedOutput}
                </div>
              </div>

              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 whitespace-pre-wrap overflow-x-auto">
                {tc.codeSnippet}
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* 11. SIMILAR CODE / RAG TAB */}
      {activeTab === 'similarity' && (
        <div className="space-y-4">
          {(result.similarCode || []).map((item, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{item.functionName}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">{item.repository}</span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-emerald-400">{item.similarityScore}%</span>
                  <span className="text-[10px] text-slate-500 block">Similarity Match</span>
                </div>
              </div>

              <p className="text-xs text-slate-300">{item.explanation}</p>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap overflow-x-auto">
                {item.code}
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* 12. PROJECT-AWARE AI ASSISTANT (CONVERSATIONAL INTERACTION) */}
      {activeTab === 'assistant' && (
        <ProjectAwareAssistant
          projectId={analysisMeta?.projectId}
          analysisId={id}
          sourceCode={analysisMeta?.sourceCode || ''}
          language={analysisMeta?.language || 'cpp'}
          projectName={analysisMeta?.projectName || 'Active Code Analysis'}
          activeLine={activeStep?.line}
        />
      )}
    </div>
  );
};

// Helper recursive tree renderer for AST
function renderASTTree(node?: ASTNode, depth = 0) {
  if (!node) return <div className="text-slate-500">AST parsing not available for this language.</div>;
  return (
    <div className="space-y-1" style={{ paddingLeft: depth * 16 }}>
      <div className="text-indigo-400">
        <span className="text-slate-500">[{node.type}]</span>{' '}
        <span className="text-cyan-300 font-bold">{node.name || ''}</span>
        {node.loc && <span className="text-slate-500 text-[10px] ml-2">L:{node.loc.start}-{node.loc.end}</span>}
      </div>
      {node.children?.map((child, idx) => (
        <React.Fragment key={idx}>{renderASTTree(child, depth + 1)}</React.Fragment>
      ))}
    </div>
  );
}
