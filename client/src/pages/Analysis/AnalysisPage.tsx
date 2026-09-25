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
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 bg-pearl">
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
        <div className="pearl-card p-8 rounded-3xl border border-rose-200 bg-white shadow-pearl-md">
          <AlertTriangle className="w-10 h-10 text-terracotta mx-auto mb-3" />
          <h2 className="text-lg font-bold text-charcoal mb-2">Analysis Not Available</h2>
          <p className="text-xs text-charcoal-muted mb-6">{errorMsg || 'Could not retrieve analysis data.'}</p>
          <Link
            to="/editor"
            className="px-5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold shadow-pearl-sm inline-flex items-center gap-2"
          >
            <Code2 className="w-4 h-4" />
            <span>Open Code Editor</span>
          </Link>
        </div>
      </div>
    );
  }

  // Quality Radar Data (Terracotta / Lime styling)
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
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
  ];

  const steps = result.stepByStepExplanation || [];
  const activeStep = steps[currentStepIndex];

  return (
    <div className="p-6 max-w-[1700px] mx-auto space-y-6 bg-pearl min-h-screen">
      {/* Top Banner & Header Controls */}
      <div className="pearl-card p-6 rounded-3xl border border-border-pearl bg-white shadow-pearl-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-ivory-warm text-terracotta text-[10px] font-bold uppercase tracking-wider border border-border-pearl font-mono">
              {analysisMeta?.language || 'Algorithm'}
            </span>
            <span className="text-xs text-charcoal-muted font-mono">
              Quality Score:{' '}
              <strong className="text-charcoal bg-lime-soft px-2 py-0.5 rounded border border-lime-digital/30">{result.qualityScore?.overall || 85}/100</strong>
            </span>
          </div>
          <h1 className="text-2xl font-black text-charcoal">{result.overview?.title || 'Comprehensive Code Analysis'}</h1>
          <p className="text-xs text-charcoal-muted mt-1 max-w-2xl font-normal">{result.overview?.description}</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleExportReport('PDF')}
            disabled={isExportingPDF || !id}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-ivory-warm text-charcoal text-xs font-semibold border border-border-pearl flex items-center gap-2 transition-all disabled:opacity-50 shadow-pearl-sm"
          >
            <Download className="w-3.5 h-3.5 text-terracotta" />
            <span>{isExportingPDF ? 'Generating...' : 'Export PDF'}</span>
          </button>

          <button
            onClick={() => handleExportReport('HTML')}
            disabled={isExportingHTML || !id}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-ivory-warm text-charcoal text-xs font-semibold border border-border-pearl flex items-center gap-2 transition-all disabled:opacity-50 shadow-pearl-sm"
          >
            <Download className="w-3.5 h-3.5 text-orange-warm" />
            <span>{isExportingHTML ? 'Generating...' : 'Export HTML'}</span>
          </button>

          <Link
            to={analysisMeta?.projectId ? `/editor?projectId=${analysisMeta.projectId}` : '/editor'}
            className="px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold shadow-pearl-sm transition-all flex items-center gap-1.5"
          >
            <Code2 className="w-4 h-4" />
            <span>Edit Code</span>
          </Link>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border-pearl scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-terracotta border border-border-pearl border-b-2 border-b-terracotta shadow-pearl-sm'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-white/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-terracotta' : 'text-charcoal-muted'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="pearl-card p-5 rounded-2xl border border-border-pearl space-y-1 shadow-pearl-sm">
              <span className="text-[10px] font-mono uppercase font-bold text-charcoal-muted">Time Complexity</span>
              <div className="text-2xl font-black font-mono text-terracotta">{result.complexity?.timeComplexity || 'O(n)'}</div>
              <p className="text-[11px] text-charcoal-muted line-clamp-1">{result.complexity?.explanation || 'Linear iteration bound'}</p>
            </div>

            <div className="pearl-card p-5 rounded-2xl border border-border-pearl space-y-1 shadow-pearl-sm">
              <span className="text-[10px] font-mono uppercase font-bold text-charcoal-muted">Space Complexity</span>
              <div className="text-2xl font-black font-mono text-charcoal">{result.complexity?.spaceComplexity || 'O(1)'}</div>
              <p className="text-[11px] text-charcoal-muted">Scalar memory accumulation</p>
            </div>

            <div className="pearl-card p-5 rounded-2xl border border-border-pearl space-y-1 shadow-pearl-sm">
              <span className="text-[10px] font-mono uppercase font-bold text-charcoal-muted">Quality Score</span>
              <div className="text-2xl font-black font-mono text-charcoal">{result.qualityScore?.overall || 85} / 100</div>
              <p className="text-[11px] text-lime-digital font-bold">Grade: {result.qualityScore?.grade || 'A'}</p>
            </div>

            <div className="pearl-card p-5 rounded-2xl border border-border-pearl space-y-1 shadow-pearl-sm">
              <span className="text-[10px] font-mono uppercase font-bold text-charcoal-muted">Maintainability</span>
              <div className="text-2xl font-black font-mono text-orange-warm">{result.metrics?.maintainabilityIndex || 85}/100</div>
              <p className="text-[11px] text-charcoal-muted">Halstead clean metric</p>
            </div>
          </div>

          {/* Radar Chart & Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 pearl-card p-6 rounded-2xl border border-border-pearl space-y-4 shadow-pearl-sm">
              <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-terracotta" /> Core Architectural Overview
              </h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                {result.aiExplanation?.overview || result.overview?.description || 'CodeVision AI has successfully analyzed and parsed your active source code.'}
              </p>

              <div className="pt-2 border-t border-border-pearl">
                <h4 className="text-xs font-bold text-charcoal mb-2 font-mono uppercase">Algorithmic Pattern:</h4>
                <div className="p-3 rounded-xl bg-ivory-warm border border-border-pearl text-xs font-mono text-charcoal">
                  {result.aiExplanation?.algorithm || 'Linear Accumulator Pattern'}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 pearl-card p-6 rounded-2xl border border-border-pearl space-y-2 flex flex-col justify-between shadow-pearl-sm">
              <h3 className="text-sm font-bold text-charcoal">Quality Score Radar</h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={qualityRadarData}>
                    <PolarGrid stroke="#D9D2C5" />
                    <PolarAngleAxis dataKey="subject" stroke="#6F6A61" fontSize={10} />
                    <PolarRadiusAxis stroke="#D9D2C5" angle={30} domain={[0, 100]} fontSize={9} />
                    <Radar name="Quality" dataKey="score" stroke="#D85C32" fill="#D85C32" fillOpacity={0.25} />
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
            <div className="pearl-card p-8 rounded-2xl border border-border-pearl text-center text-xs text-charcoal-muted shadow-pearl-sm">
              No step execution trace available for this code snippet.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Step Player Controls & Memory */}
              <div className="lg:col-span-8 pearl-card p-6 rounded-2xl border border-border-pearl bg-white shadow-pearl-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-border-pearl">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-terracotta-light text-terracotta text-xs font-mono font-bold border border-terracotta/20">
                        Step {activeStep?.step || currentStepIndex + 1} of {steps.length}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-ivory-warm text-charcoal uppercase font-mono border border-border-pearl">
                        Line {activeStep?.line || 1}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAskAboutLine(activeStep?.line || 1)}
                      className="px-2.5 py-1 rounded-lg bg-ivory-warm hover:bg-white text-terracotta border border-border-pearl text-[11px] font-semibold flex items-center gap-1.5 transition-colors shadow-pearl-sm"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-terracotta" />
                      <span>Ask AI about this line</span>
                    </button>
                  </div>

                  {/* Active Code Line */}
                  <div className="mt-4 p-3.5 rounded-xl bg-ivory-warm border border-border-pearl font-mono text-xs text-charcoal">
                    <span className="text-terracotta font-bold mr-2">{activeStep?.line} |</span>
                    <span className="font-semibold">{activeStep?.code}</span>
                  </div>

                  {/* Step Action Explanation */}
                  <div className="mt-4 p-4 rounded-xl bg-ivory border border-border-pearl text-xs text-charcoal leading-relaxed">
                    <strong className="text-terracotta block mb-1 flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5" /> Statement Execution Action:
                    </strong>
                    {activeStep?.explanation || 'Executing runtime instruction and memory register update.'}
                  </div>

                  {/* Active Variables in Memory */}
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-charcoal mb-2 font-mono uppercase">Variables in Memory:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {activeStep?.variables &&
                        Object.entries(activeStep.variables).map(([key, val]) => (
                          <div
                            key={key}
                            className="p-2.5 rounded-xl border border-border-pearl bg-white text-xs font-mono shadow-pearl-sm"
                          >
                            <span className="text-charcoal-muted text-[10px] block">{key}</span>
                            <span className="font-bold text-charcoal">{JSON.stringify(val)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Step Slider / Controls */}
                <div className="pt-4 border-t border-border-pearl flex items-center justify-between gap-4">
                  <button
                    onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentStepIndex === 0}
                    className="px-3 py-1.5 rounded-lg bg-ivory-warm hover:bg-white text-charcoal text-xs font-semibold border border-border-pearl disabled:opacity-40 shadow-pearl-sm"
                  >
                    Previous Step
                  </button>

                  <input
                    type="range"
                    min={0}
                    max={steps.length - 1}
                    value={currentStepIndex}
                    onChange={(e) => setCurrentStepIndex(Number(e.target.value))}
                    className="flex-1 accent-terracotta"
                  />

                  <button
                    onClick={() => setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                    disabled={currentStepIndex === steps.length - 1}
                    className="px-3 py-1.5 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold disabled:opacity-40 shadow-pearl-sm"
                  >
                    Next Step
                  </button>
                </div>
              </div>

              {/* Right Steps Navigation List */}
              <div className="lg:col-span-4 pearl-card p-4 rounded-2xl border border-border-pearl bg-white shadow-pearl-sm max-h-[500px] overflow-y-auto space-y-2">
                <h4 className="text-xs font-bold text-charcoal mb-3 font-mono uppercase">All Execution Steps</h4>
                {steps.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`p-2.5 rounded-xl cursor-pointer text-xs transition-all flex items-center justify-between border ${
                      currentStepIndex === idx
                        ? 'bg-terracotta-light border-terracotta text-terracotta font-bold'
                        : 'bg-ivory-warm border-border-pearl text-charcoal hover:bg-white'
                    }`}
                  >
                    <div className="truncate max-w-[200px]">
                      <span className="text-[10px] font-mono mr-1">L{s.line}:</span>
                      <span>{s.code || s.explanation}</span>
                    </div>
                    <span className="text-[10px] font-mono text-charcoal-muted">Step {s.step}</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="pearl-card p-5 rounded-2xl border border-border-pearl space-y-1 shadow-pearl-sm">
              <span className="text-[10px] font-mono font-bold text-charcoal-muted uppercase">Cyclomatic Complexity</span>
              <div className="text-2xl font-black font-mono text-terracotta">{result.metrics?.cyclomaticComplexity || 2}</div>
              <p className="text-[11px] text-charcoal-muted">Independent execution branches</p>
            </div>

            <div className="pearl-card p-5 rounded-2xl border border-border-pearl space-y-1 shadow-pearl-sm">
              <span className="text-[10px] font-mono font-bold text-charcoal-muted uppercase">Lines of Code (SLOC)</span>
              <div className="text-2xl font-black font-mono text-charcoal">{result.metrics?.linesOfCode || 12}</div>
              <p className="text-[11px] text-charcoal-muted">Active source statements</p>
            </div>

            <div className="pearl-card p-5 rounded-2xl border border-border-pearl space-y-1 shadow-pearl-sm">
              <span className="text-[10px] font-mono font-bold text-charcoal-muted uppercase">Halstead Volume</span>
              <div className="text-2xl font-black font-mono text-charcoal">{Math.round(result.metrics?.halsteadVolume || 120)}</div>
              <p className="text-[11px] text-charcoal-muted">Computational token entropy</p>
            </div>

            <div className="pearl-card p-5 rounded-2xl border border-border-pearl space-y-1 shadow-pearl-sm">
              <span className="text-[10px] font-mono font-bold text-charcoal-muted uppercase">Halstead Difficulty</span>
              <div className="text-2xl font-black font-mono text-orange-warm">{result.metrics?.halsteadDifficulty?.toFixed(1) || '3.5'}</div>
              <p className="text-[11px] text-charcoal-muted">Cognitive implementation effort</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. BUGS & SECURITY TAB */}
      {activeTab === 'bugs' && (
        <div className="space-y-4">
          {(result.bugs || []).length === 0 ? (
            <div className="pearl-card p-8 rounded-2xl border border-border-pearl text-center text-xs text-charcoal font-semibold shadow-pearl-sm bg-lime-soft">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-lime-digital" />
              No static bugs or critical vulnerabilities detected in active source code.
            </div>
          ) : (
            (result.bugs || []).map((bug, idx) => (
              <div key={idx} className="pearl-card p-5 rounded-2xl border border-border-pearl space-y-3 shadow-pearl-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-terracotta-light text-terracotta border border-terracotta/20 font-mono">
                      {bug.severity}
                    </span>
                    <span className="text-xs font-bold text-charcoal">{bug.title}</span>
                  </div>
                  <span className="text-[11px] text-charcoal-muted font-mono">Line {bug.line}</span>
                </div>

                <p className="text-xs text-charcoal-muted leading-relaxed">{bug.description}</p>
                {bug.suggestedFix && (
                  <div className="p-3 rounded-xl bg-ivory-warm border border-border-pearl font-mono text-xs text-charcoal">
                    <span className="text-[10px] text-charcoal-muted block mb-1">Suggested Fix:</span>
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
            <div key={idx} className="pearl-card p-6 rounded-2xl border border-border-pearl space-y-4 shadow-pearl-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-charcoal">{opt.title}</h3>
                  <span className="text-[10px] text-terracotta font-mono font-semibold">{opt.category}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-lime-soft border border-lime-digital/30 text-charcoal text-xs font-bold font-mono">
                  ⚡ {opt.expectedBenefit}
                </span>
              </div>

              <p className="text-xs text-charcoal-muted">{opt.explanation}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-ivory-warm border border-border-pearl">
                  <span className="text-[10px] text-charcoal-muted uppercase font-mono block mb-1">Current Code</span>
                  <pre className="text-xs font-mono text-charcoal whitespace-pre-wrap overflow-x-auto">{opt.currentCode}</pre>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-terracotta/30 relative shadow-pearl-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-terracotta uppercase font-mono font-bold">Optimized Code</span>
                    <button
                      onClick={() => handleCopy(opt.optimizedCode, `opt-${idx}`)}
                      className="text-charcoal-muted hover:text-charcoal p-1 text-[10px] flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedId === `opt-${idx}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-charcoal font-semibold whitespace-pre-wrap overflow-x-auto">{opt.optimizedCode}</pre>
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
        <div className="pearl-card p-6 rounded-2xl border border-border-pearl space-y-4 shadow-pearl-sm">
          <h3 className="text-sm font-bold text-charcoal mb-1">Function Call Graph</h3>
          <p className="text-xs text-charcoal-muted mb-4 font-normal">Invocations and caller/callee dependencies</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(result.callGraph?.nodes || []).map((node) => (
              <div key={node.id} className="p-4 rounded-2xl bg-ivory-warm border border-border-pearl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-terracotta">{node.label}</span>
                  <span className="text-[10px] text-charcoal-muted font-mono">Line {node.line || '—'}</span>
                </div>
                <div className="text-[11px] text-charcoal-muted">
                  Calls: <strong className="text-charcoal">{node.callCount} functions</strong>
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
            <div key={idx} className="pearl-card p-5 rounded-2xl border border-border-pearl space-y-3 shadow-pearl-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-terracotta-light text-terracotta text-xs font-mono font-bold border border-terracotta/20">
                    {tc.id}
                  </span>
                  <span className="text-xs font-bold text-charcoal">{tc.type}</span>
                </div>
                <button
                  onClick={() => handleCopy(tc.codeSnippet, `test-${idx}`)}
                  className="text-xs text-charcoal-muted hover:text-charcoal flex items-center gap-1 font-semibold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === `test-${idx}` ? 'Copied' : 'Copy Test'}</span>
                </button>
              </div>

              <p className="text-xs text-charcoal-muted">{tc.description}</p>
              <pre className="p-3 rounded-xl bg-ivory-warm border border-border-pearl text-xs font-mono text-charcoal whitespace-pre-wrap overflow-x-auto">
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
            <div key={idx} className="pearl-card p-5 rounded-2xl border border-border-pearl space-y-3 shadow-pearl-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-charcoal">{item.functionName}</h3>
                  <span className="text-[10px] text-charcoal-muted font-mono">{item.repository}</span>
                </div>
                <span className="text-sm font-black text-terracotta">{item.similarityScore}% Match</span>
              </div>
              <pre className="p-3 rounded-xl bg-ivory-warm border border-border-pearl text-xs font-mono text-charcoal whitespace-pre-wrap overflow-x-auto">
                {item.code}
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* 12. PROJECT-AWARE AI ASSISTANT */}
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
