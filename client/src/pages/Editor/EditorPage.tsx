import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import apiClient from '../../services/apiClient';
import { SAMPLE_CODES, SampleCode } from '../../constants/samples';
import {
  Code2,
  Play,
  Zap,
  Save,
  Upload,
  Sparkles,
  FileCode,
  Settings,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  FolderKanban,
  Cpu,
  Layers,
  Terminal,
  Bug,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { GlassAIButton } from '../../components/ThreeUI/GlassAIButton';
import { ThreeUplinkLoader } from '../../components/ThreeUI/ThreeUplinkLoader';

const SUPPORTED_LANGUAGES = [
  { id: 'cpp', name: 'C++', monaco: 'cpp' },
  { id: 'python', name: 'Python', monaco: 'python' },
  { id: 'java', name: 'Java', monaco: 'java' },
  { id: 'javascript', name: 'JavaScript', monaco: 'javascript' },
  { id: 'typescript', name: 'TypeScript', monaco: 'typescript' },
  { id: 'c', name: 'C', monaco: 'c' },
  { id: 'csharp', name: 'C#', monaco: 'csharp' },
  { id: 'go', name: 'Go', monaco: 'go' },
  { id: 'rust', name: 'Rust', monaco: 'rust' },
  { id: 'sql', name: 'SQL', monaco: 'sql' },
];

export const EditorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState<string>(
    `#include <iostream>\nusing namespace std;\n\nint main() {\n    int arr[] = {2, 4, 6};\n    int sum = 0;\n\n    for (int i = 0; i < 3; i++) {\n        sum += arr[i];\n    }\n\n    cout << "Total Sum: " << sum << endl;\n    return 0;\n}`
  );
  const [projectName, setProjectName] = useState('Array Sum Optimization');
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Editor layout options
  const [fontSize, setFontSize] = useState(14);
  const [minimap, setMinimap] = useState(false);

  // Fetch project details if editing an existing project
  useEffect(() => {
    if (projectId) {
      const fetchProject = async () => {
        try {
          const res = await apiClient.get(`/projects/${projectId}`);
          if (res.data.success && res.data.project) {
            setProjectName(res.data.project.name);
            setLanguage(res.data.project.language || 'cpp');
            setCode(res.data.project.code || '');
          }
        } catch (err: any) {
          setErrorMsg('Failed to load project: ' + err.message);
        }
      };
      fetchProject();
    }
  }, [projectId]);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    const sample = SAMPLE_CODES.find((s) => s.language === newLang);
    if (sample && !projectId) {
      setCode(sample.code);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCode(content);
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'py') setLanguage('python');
      else if (ext === 'cpp' || ext === 'cc') setLanguage('cpp');
      else if (ext === 'java') setLanguage('java');
      else if (ext === 'js') setLanguage('javascript');
      else if (ext === 'ts') setLanguage('typescript');
      else if (ext === 'go') setLanguage('go');
      else if (ext === 'rs') setLanguage('rust');
      setProjectName(file.name.replace(/\.[^/.]+$/, ''));
    };
    reader.readAsText(file);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveStatus(null);
      setErrorMsg(null);

      if (projectId) {
        await apiClient.put(`/projects/${projectId}`, {
          name: projectName,
          language,
          code,
        });
      } else {
        const res = await apiClient.post('/projects', {
          name: projectName,
          language,
          code,
        });
        if (res.data.success && res.data.project) {
          navigate(`/editor?projectId=${res.data.project._id}`, { replace: true });
        }
      }
      setSaveStatus('Project saved successfully');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save project.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setErrorMsg('Please enter code to analyze.');
      return;
    }

    try {
      setIsAnalyzing(true);
      setErrorMsg(null);

      let currentProjId = projectId;
      if (!currentProjId) {
        const projRes = await apiClient.post('/projects', {
          name: projectName || 'Source Unit Analysis',
          language,
          code,
        });
        if (projRes.data.success) {
          currentProjId = projRes.data.project._id;
        }
      }

      const res = await apiClient.post('/analysis', {
        projectId: currentProjId,
        code,
        language,
        analysisType: 'full',
      });

      if (res.data.success && res.data.analysis) {
        navigate(`/analysis/${res.data.analysis._id}`);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to run analysis pipeline.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Quick stats calculation
  const lineCount = code.split('\n').length;
  const charCount = code.length;
  const hasLoop = code.includes('for') || code.includes('while');

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#030712] relative overflow-hidden">
      {/* Top IDE Toolbar */}
      <div className="h-14 border-b border-slate-800/80 bg-[#080d1a]/90 backdrop-blur-xl px-4 flex items-center justify-between gap-4 flex-shrink-0 z-20">
        {/* Left Project Name & Language */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project Name..."
              className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-500 text-xs font-bold text-white focus:outline-none px-1 py-0.5 max-w-[200px] sm:max-w-xs transition-colors"
            />
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-mono font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none pr-8"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".py,.cpp,.c,.java,.js,.ts,.go,.rs,.sql"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 flex items-center gap-1.5 transition-colors hidden sm:flex"
            title="Import source file"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 hover:border-slate-600 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>

          <GlassAIButton
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            size="sm"
            variant="primary"
          >
            <Play className="w-3.5 h-3.5 fill-cyan-200 text-cyan-200" />
            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Code'}</span>
          </GlassAIButton>
        </div>
      </div>

      {/* Notifications bar */}
      {(saveStatus || errorMsg) && (
        <div className={`px-4 py-1.5 text-xs flex items-center justify-between z-20 ${
          errorMsg ? 'bg-rose-500/20 text-rose-300 border-b border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/30'
        }`}>
          <span>{errorMsg || saveStatus}</span>
          <button onClick={() => { setErrorMsg(null); setSaveStatus(null); }} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Split Layout: Monaco Editor + Side Telemetry Panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 relative">
        {/* Left Monaco IDE */}
        <div className="lg:col-span-8 h-full border-r border-slate-800/80 bg-[#02050c] relative flex flex-col justify-between">
          <div className="flex-1 min-h-0">
            <MonacoEditor
              height="100%"
              language={SUPPORTED_LANGUAGES.find((l) => l.id === language)?.monaco || 'cpp'}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                fontSize,
                minimap: { enabled: minimap },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                cursorBlinking: 'smooth',
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
              }}
            />
          </div>

          {/* IDE Bottom Status Bar */}
          <div className="h-7 bg-[#050914] border-t border-slate-800/80 px-4 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none">
            <div className="flex items-center gap-4">
              <span>LANG: <strong className="text-cyan-400 uppercase">{language}</strong></span>
              <span>LINES: <strong>{lineCount}</strong></span>
              <span>CHARS: <strong>{charCount}</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <span>UTF-8</span>
              <span className="text-emerald-400">● READY</span>
            </div>
          </div>
        </div>

        {/* Right Side Telemetry & Quick Action Panel */}
        <div className="lg:col-span-4 h-full bg-[#060b18]/90 backdrop-blur-md p-5 flex flex-col justify-between overflow-y-auto space-y-4">
          {isAnalyzing ? (
            <div className="my-auto">
              <ThreeUplinkLoader
                status="Executing 11-Domain AI Analysis..."
                stage="AST Parsing → Complexity Calculation → Step Simulation"
              />
            </div>
          ) : (
            <>
              {/* Telemetry Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" /> Active Code Telemetry
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Live Scope</span>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono block">Estimated Time</span>
                    <span className="text-sm font-bold text-cyan-300 font-mono">
                      {hasLoop ? 'O(n)' : 'O(1)'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono block">Auxiliary Space</span>
                    <span className="text-sm font-bold text-emerald-300 font-mono">O(1) Constant</span>
                  </div>
                </div>

                {/* Quick Inspection Summary */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                  <span className="text-[10px] uppercase font-mono font-bold text-indigo-400 block">
                    Pre-Analysis Static Audit
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Source code contains <strong>{lineCount} statements</strong>. Ready to compute complete AST hierarchy, memory execution trace, and automated test cases.
                  </p>
                </div>
              </div>

              {/* Quick AI Action Triggers */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 font-mono block">
                  Quick AI Operations
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAnalyze}
                    className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 text-left text-xs text-slate-200 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Explain Code</span>
                  </button>

                  <button
                    onClick={handleAnalyze}
                    className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 text-left text-xs text-slate-200 transition-all flex items-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Optimize</span>
                  </button>

                  <button
                    onClick={handleAnalyze}
                    className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/40 text-left text-xs text-slate-200 transition-all flex items-center gap-2"
                  >
                    <Bug className="w-3.5 h-3.5 text-rose-400" />
                    <span>Find Bugs</span>
                  </button>

                  <button
                    onClick={handleAnalyze}
                    className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-left text-xs text-slate-200 transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Generate Tests</span>
                  </button>
                </div>
              </div>

              {/* Primary Analyze Trigger */}
              <div className="pt-3 border-t border-slate-800">
                <GlassAIButton
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  size="md"
                  variant="primary"
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Execute Full 11-Domain Analysis</span>
                </GlassAIButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
