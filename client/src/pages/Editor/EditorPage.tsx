import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  { id: 'python', name: 'Python', monaco: 'python' },
  { id: 'cpp', name: 'C++', monaco: 'cpp' },
  { id: 'java', name: 'Java', monaco: 'java' },
  { id: 'javascript', name: 'JavaScript', monaco: 'javascript' },
  { id: 'typescript', name: 'TypeScript', monaco: 'typescript' },
  { id: 'c', name: 'C', monaco: 'c' },
  { id: 'csharp', name: 'C#', monaco: 'csharp' },
  { id: 'go', name: 'Go', monaco: 'go' },
  { id: 'rust', name: 'Rust', monaco: 'rust' },
  { id: 'sql', name: 'SQL', monaco: 'sql' },
  { id: 'html', name: 'HTML', monaco: 'html' },
  { id: 'css', name: 'CSS', monaco: 'css' },
  { id: 'php', name: 'PHP', monaco: 'php' },
  { id: 'ruby', name: 'Ruby', monaco: 'ruby' },
  { id: 'kotlin', name: 'Kotlin', monaco: 'kotlin' },
  { id: 'swift', name: 'Swift', monaco: 'swift' },
];

export const EditorPage: React.FC = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState<string>(SAMPLE_CODES[0]?.code || '# Enter your code here\n');
  const [projectName, setProjectName] = useState('Untitled Workspace');
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Editor configuration
  const [fontSize, setFontSize] = useState(14);
  const [minimap, setMinimap] = useState(true);
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('on');

  // Fetch project details if editing an existing project
  useEffect(() => {
    if (projectId) {
      const fetchProject = async () => {
        try {
          const res = await apiClient.get(`/projects/${projectId}`);
          if (res.data.success && res.data.project) {
            setProjectName(res.data.project.name);
            setLanguage(res.data.project.language || 'python');
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
    // If empty or default, switch to matching sample
    const sample = SAMPLE_CODES.find((s) => s.language === newLang);
    if (sample && !projectId) {
      setCode(sample.code);
    }
  };

  const handleLoadSample = (sample: SampleCode) => {
    setLanguage(sample.language);
    setCode(sample.code);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCode(content);

      // Auto-detect language by file extension
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'py') setLanguage('python');
      else if (ext === 'cpp' || ext === 'cc' || ext === 'h') setLanguage('cpp');
      else if (ext === 'java') setLanguage('java');
      else if (ext === 'js' || ext === 'jsx') setLanguage('javascript');
      else if (ext === 'ts' || ext === 'tsx') setLanguage('typescript');
      else if (ext === 'go') setLanguage('go');
      else if (ext === 'rs') setLanguage('rust');
    };
    reader.readAsText(file);
  };

  const handleSaveProject = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      if (projectId) {
        await apiClient.put(`/projects/${projectId}`, {
          name: projectName,
          language,
          code,
        });
        setSaveStatus('Project saved successfully');
      } else {
        const res = await apiClient.post('/projects', {
          name: projectName === 'Untitled Workspace' ? 'New Algorithm Project' : projectName,
          language,
          code,
        });
        if (res.data.success) {
          setSaveStatus('Project created in MongoDB');
          navigate(`/editor/${res.data.project._id}`, { replace: true });
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save project');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleRunAnalysis = async () => {
    if (!code.trim()) {
      setErrorMsg('Please write or upload code before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const res = await apiClient.post('/analysis', {
        projectId: projectId || undefined,
        language,
        code,
        analysisType: 'full',
      });

      if (res.data.success && res.data.analysisId) {
        navigate(`/analysis/${res.data.analysisId}`);
      } else if (res.data.data) {
        // If ephemeral without ID, we can still navigate with state
        navigate('/analysis/session', { state: { resultData: res.data.data, code, language } });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Analysis failed. Please check your syntax.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.id === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#0A0F1D] overflow-hidden">
      {/* Top Editor Toolbar */}
      <div className="h-14 border-b border-slate-800/80 bg-slate-900/80 px-4 flex items-center justify-between gap-3">
        {/* Left Toolbar Items: Project Title & Language Picker */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="text-xs font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none px-1 py-0.5 max-w-[200px] truncate"
            title="Click to rename project"
          />

          <div className="h-4 w-px bg-slate-800"></div>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-cyan-300 focus:outline-none focus:border-indigo-500"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          {/* Preset Samples */}
          <div className="relative group hidden sm:block">
            <button className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1 border border-slate-700">
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>Algorithm Samples</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            <div className="absolute left-0 top-full mt-1 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 hidden group-hover:block p-1.5">
              {SAMPLE_CODES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleLoadSample(sample)}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-indigo-600 hover:text-white rounded-lg flex items-center justify-between transition-colors my-0.5"
                >
                  <span className="truncate font-medium">{sample.name}</span>
                  <span className="text-[10px] uppercase font-mono text-slate-400 group-hover:text-indigo-200">
                    {sample.language}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Toolbar Items: Upload, Save, Analyze */}
        <div className="flex items-center gap-2">
          {saveStatus && (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium mr-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {saveStatus}
            </span>
          )}

          {/* Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".py,.cpp,.java,.js,.ts,.c,.cs,.go,.rs,.sql,.html,.css,.php"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload code file"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Upload</span>
          </button>

          {/* Save Project Button */}
          <button
            onClick={handleSaveProject}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>

          {/* Primary Action: Run Full Analysis */}
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing || !code.trim()}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run Full Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="px-4 py-2 bg-rose-500/10 border-b border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="font-bold hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Monaco Editor Container */}
      <div className="flex-1 min-h-0 relative">
        <MonacoEditor
          height="100%"
          language={currentLangObj.monaco}
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val || '')}
          options={{
            fontSize,
            minimap: { enabled: minimap },
            wordWrap,
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            bracketPairColorization: { enabled: true },
          }}
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="h-7 border-t border-slate-800 bg-[#080C17] px-4 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            {currentLangObj.name} Engine
          </span>
          <span>{code.split('\n').length} lines</span>
          <span>{code.length} chars</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setWordWrap(wordWrap === 'on' ? 'off' : 'on')}
            className="hover:text-slate-200"
          >
            Wrap: {wordWrap}
          </button>
          <button
            onClick={() => setMinimap(!minimap)}
            className="hover:text-slate-200"
          >
            Minimap: {minimap ? 'On' : 'Off'}
          </button>
          <button
            onClick={() => setFontSize(fontSize === 14 ? 16 : fontSize === 16 ? 12 : 14)}
            className="hover:text-slate-200"
          >
            Font: {fontSize}px
          </button>
        </div>
      </div>
    </div>
  );
};
