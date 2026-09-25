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

  const lineCount = code.split('\n').length;
  const charCount = code.length;
  const hasLoop = code.includes('for') || code.includes('while');

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-pearl relative overflow-hidden">
      {/* Top IDE Toolbar */}
      <div className="h-14 border-b border-border-pearl bg-ivory/95 px-4 flex items-center justify-between gap-4 flex-shrink-0 z-20 shadow-pearl-sm">
        {/* Left Project Name & Language */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-terracotta" />
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project Name..."
              className="bg-white border border-[#D5CEBF] hover:border-terracotta focus:border-terracotta text-xs font-bold text-charcoal focus:outline-none px-2.5 py-1 rounded-xl max-w-[200px] sm:max-w-xs transition-colors shadow-sm"
            />
          </div>

          <div className="h-4 w-px bg-border-pearl hidden sm:block"></div>

          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-white border border-border-pearl hover:border-border-warm text-charcoal text-xs font-mono font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-terracotta cursor-pointer appearance-none pr-8 shadow-pearl-sm"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-ivory-warm text-charcoal-muted hover:text-charcoal text-xs font-semibold border border-border-pearl flex items-center gap-1.5 transition-colors hidden sm:flex shadow-pearl-sm"
            title="Import source file"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-ivory-warm text-charcoal text-xs font-semibold border border-border-pearl hover:border-border-warm flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-pearl-sm"
          >
            <Save className="w-3.5 h-3.5 text-terracotta" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>

          <GlassAIButton
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            size="sm"
            variant="primary"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Code'}</span>
          </GlassAIButton>
        </div>
      </div>

      {/* Notifications bar */}
      {(saveStatus || errorMsg) && (
        <div className={`px-4 py-1.5 text-xs flex items-center justify-between z-20 ${
          errorMsg ? 'bg-rose-50 border-b border-rose-200 text-rose-700' : 'bg-lime-soft border-b border-lime-digital text-charcoal font-semibold'
        }`}>
          <span>{errorMsg || saveStatus}</span>
          <button onClick={() => { setErrorMsg(null); setSaveStatus(null); }} className="text-charcoal-muted hover:text-charcoal">✕</button>
        </div>
      )}

      {/* Main Split Layout: Light Monaco Editor + Side Telemetry Panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 relative">
        {/* Left Light Monaco IDE */}
        <div className="lg:col-span-8 h-full border-r border-border-pearl bg-white relative flex flex-col justify-between">
          <div className="flex-1 min-h-0">
            <MonacoEditor
              height="100%"
              language={SUPPORTED_LANGUAGES.find((l) => l.id === language)?.monaco || 'cpp'}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="light"
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
          <div className="h-7 bg-ivory border-t border-border-pearl px-4 flex items-center justify-between text-[11px] font-mono text-charcoal-muted select-none">
            <div className="flex items-center gap-4">
              <span>LANG: <strong className="text-terracotta uppercase">{language}</strong></span>
              <span>LINES: <strong>{lineCount}</strong></span>
              <span>CHARS: <strong>{charCount}</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <span>UTF-8</span>
              <span className="text-lime-digital font-bold">● READY</span>
            </div>
          </div>
        </div>

        {/* Right Side Telemetry & Quick Action Panel */}
        <div className="lg:col-span-4 h-full bg-ivory p-5 flex flex-col justify-between overflow-y-auto space-y-4">
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
                <div className="flex items-center justify-between pb-3 border-b border-border-pearl">
                  <h3 className="text-xs font-bold text-charcoal flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-terracotta" /> Active Code Telemetry
                  </h3>
                  <span className="text-[10px] font-mono text-charcoal-muted uppercase font-bold">Live Scope</span>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="pearl-card p-3 rounded-xl border border-border-pearl space-y-1">
                    <span className="text-[10px] text-charcoal-muted font-mono block">Estimated Time</span>
                    <span className="text-sm font-black text-terracotta font-mono">
                      {hasLoop ? 'O(n)' : 'O(1)'}
                    </span>
                  </div>
                  <div className="pearl-card p-3 rounded-xl border border-border-pearl space-y-1">
                    <span className="text-[10px] text-charcoal-muted font-mono block">Auxiliary Space</span>
                    <span className="text-sm font-black text-charcoal font-mono">O(1) Constant</span>
                  </div>
                </div>

                {/* Quick Inspection Summary */}
                <div className="pearl-card p-3.5 rounded-xl border border-border-pearl text-xs space-y-2">
                  <span className="text-[10px] uppercase font-mono font-bold text-terracotta block">
                    Pre-Analysis Static Audit
                  </span>
                  <p className="text-charcoal-muted text-[11px] leading-relaxed font-normal">
                    Source code contains <strong>{lineCount} statements</strong>. Ready to compute complete AST hierarchy, memory execution trace, and automated test cases.
                  </p>
                </div>
              </div>

              {/* Quick AI Action Triggers */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase text-charcoal-muted font-mono block">
                  Quick AI Operations
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAnalyze}
                    className="p-2.5 rounded-xl bg-white hover:bg-ivory-warm border border-border-pearl hover:border-terracotta/50 text-left text-xs text-charcoal transition-all flex items-center gap-2 shadow-pearl-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                    <span>Explain Code</span>
                  </button>

                  <button
                    onClick={handleAnalyze}
                    className="p-2.5 rounded-xl bg-white hover:bg-ivory-warm border border-border-pearl hover:border-orange-warm/50 text-left text-xs text-charcoal transition-all flex items-center gap-2 shadow-pearl-sm"
                  >
                    <Zap className="w-3.5 h-3.5 text-orange-warm" />
                    <span>Optimize</span>
                  </button>

                  <button
                    onClick={handleAnalyze}
                    className="p-2.5 rounded-xl bg-white hover:bg-ivory-warm border border-border-pearl hover:border-terracotta/50 text-left text-xs text-charcoal transition-all flex items-center gap-2 shadow-pearl-sm"
                  >
                    <Bug className="w-3.5 h-3.5 text-terracotta" />
                    <span>Find Bugs</span>
                  </button>

                  <button
                    onClick={handleAnalyze}
                    className="p-2.5 rounded-xl bg-white hover:bg-ivory-warm border border-border-pearl hover:border-lime-digital/60 text-left text-xs text-charcoal transition-all flex items-center gap-2 shadow-pearl-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-digital" />
                    <span>Generate Tests</span>
                  </button>
                </div>
              </div>

              {/* Primary Analyze Trigger */}
              <div className="pt-3 border-t border-border-pearl">
                <GlassAIButton
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  size="md"
                  variant="primary"
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 text-white" />
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
