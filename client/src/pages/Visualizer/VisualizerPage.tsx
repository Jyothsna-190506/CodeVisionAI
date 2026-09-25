import React, { useState, useEffect, useRef } from 'react';
import { LanguageSelector, SupportedLanguage } from '../../components/LanguageSelector/LanguageSelector';
import { CodeEditor } from '../../components/CodeEditor/CodeEditor';
import { VisualizationCanvas } from '../../components/Visualization/VisualizationCanvas';
import { StepCard } from '../../components/StepCard/StepCard';
import { ControlBar } from '../../components/ControlBar/ControlBar';
import { SAMPLE_CODES, SampleCode } from '../../constants/samples';
import { visualizeCode, VisualizeResponse, Step, Summary } from '../../services/api';
import { Play, Trash2, Code, Sparkles, AlertCircle, FileCode } from 'lucide-react';
import { GlassAIButton } from '../../components/ThreeUI/GlassAIButton';

export const VisualizerPage: React.FC = () => {
  // Input state
  const [language, setLanguage] = useState<SupportedLanguage>('cpp');
  const [code, setCode] = useState<string>(SAMPLE_CODES[0].code);

  // Visualization execution state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [summary, setSummary] = useState<Summary | undefined>(undefined);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play timer effect
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      const intervalMs = 1500 / playbackSpeed;
      timerRef.current = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, intervalMs);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps, playbackSpeed]);

  // Handle language change & default sample code auto-population
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    const matchingSample = SAMPLE_CODES.find((s) => s.language === newLang);
    if (matchingSample) {
      setCode(matchingSample.code);
    }
  };

  // Load sample code
  const handleLoadSample = (sample: SampleCode) => {
    setLanguage(sample.language);
    setCode(sample.code);
    setErrorMsg(null);
  };

  // Clear code editor & visualizer
  const handleClear = () => {
    setCode('');
    setSteps([]);
    setSummary(undefined);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setErrorMsg(null);
  };

  // Trigger Visualization API call
  const handleVisualize = async () => {
    if (!code.trim()) {
      setErrorMsg('Please enter or paste code in the editor before visualizing.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);
    setIsPlaying(false);

    try {
      const res: VisualizeResponse = await visualizeCode(language, code);
      if (res.success && res.steps && res.steps.length > 0) {
        setSteps(res.steps);
        setSummary(res.summary);
        setCurrentStepIndex(0);
        setIsPlaying(true);
      } else {
        setErrorMsg(res.error || 'Execution analysis failed. Please check code syntax.');
        setSteps([]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with Groq AI visualization service.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const activeStep = steps.length > 0 ? steps[currentStepIndex] : null;
  const activeLine = activeStep ? activeStep.line : null;

  return (
    <div className="h-[calc(100vh-4rem)] p-3 sm:p-4 max-w-[1800px] mx-auto flex flex-col gap-3 overflow-hidden font-sans text-charcoal">
      {/* Top Banner Alert (If Any Error) */}
      {errorMsg && (
        <div className="px-4 py-2.5 rounded-2xl border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-center justify-between shadow-pearl-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-rose-600 hover:text-rose-800 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main 3-Panel Responsive Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-h-0">
        
        {/* LEFT PANEL (Code Editor) */}
        <div className="lg:col-span-4 pearl-card p-3.5 rounded-2xl border border-border-pearl flex flex-col gap-3 min-h-0 shadow-pearl-sm">
          {/* Header Controls: Language Selector & Sample dropdown */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-border-pearl">
            <LanguageSelector
              selectedLanguage={language}
              onChange={handleLanguageChange}
              disabled={isAnalyzing}
            />

            {/* Sample Selector */}
            <div className="relative group">
              <button
                className="px-2.5 py-1.5 rounded-xl bg-ivory-warm hover:bg-white text-xs font-semibold text-charcoal flex items-center gap-1 border border-border-pearl transition-colors shadow-pearl-sm"
                title="Load preset algorithm sample"
              >
                <FileCode className="w-3.5 h-3.5 text-terracotta" />
                <span>Samples</span>
              </button>

              <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-border-pearl rounded-2xl shadow-pearl-lg z-50 hidden group-hover:block p-1.5">
                {SAMPLE_CODES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleLoadSample(sample)}
                    className="w-full text-left px-3 py-2 text-xs text-charcoal hover:bg-terracotta hover:text-white rounded-xl flex items-center justify-between transition-colors my-0.5"
                  >
                    <span className="truncate font-medium">{sample.name}</span>
                    <span className="text-[10px] uppercase font-mono text-charcoal-muted group-hover:text-white">
                      {sample.language}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Monaco Code Editor */}
          <div className="flex-1 min-h-[300px]">
            <CodeEditor
              code={code}
              onChange={(val) => setCode(val || '')}
              language={language}
              activeLine={activeLine}
            />
          </div>

          {/* Buttons Toolbar: Visualize & Clear */}
          <div className="flex items-center gap-2">
            <GlassAIButton
              onClick={handleVisualize}
              disabled={isAnalyzing || !code.trim()}
              variant="primary"
              size="md"
              className="flex-1"
              icon={isAnalyzing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Play className="w-4 h-4 fill-white" />}
            >
              {isAnalyzing ? 'Analyzing...' : 'Visualize'}
            </GlassAIButton>

            <button
              onClick={handleClear}
              disabled={isAnalyzing}
              title="Clear Editor"
              className="p-2.5 rounded-xl bg-white border border-border-pearl hover:bg-ivory-warm text-charcoal-muted hover:text-rose-600 disabled:opacity-40 transition-colors shadow-pearl-sm"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CENTER PANEL (Visualization Canvas) */}
        <div className="lg:col-span-5 flex flex-col gap-3 min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto">
            <VisualizationCanvas
              currentStep={activeStep}
              totalSteps={steps.length}
              isAnalyzing={isAnalyzing}
            />
          </div>

          {/* Playback Control Bar */}
          <ControlBar
            currentStepIndex={currentStepIndex}
            totalSteps={steps.length}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            onPlayToggle={() => setIsPlaying(!isPlaying)}
            onStepNext={() => setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
            onStepPrev={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            onScrub={(index) => setCurrentStepIndex(index)}
            onSpeedChange={(speed) => setPlaybackSpeed(speed)}
            onReset={() => {
              setCurrentStepIndex(0);
              setIsPlaying(false);
            }}
            onReplay={() => {
              setCurrentStepIndex(0);
              setIsPlaying(true);
            }}
            disabled={isAnalyzing || steps.length === 0}
          />
        </div>

        {/* RIGHT PANEL (Step Details Card) */}
        <div className="lg:col-span-3 pearl-card p-3.5 rounded-2xl border border-border-pearl flex flex-col min-h-0 shadow-pearl-sm">
          <StepCard
            step={activeStep}
            summary={summary}
            totalSteps={steps.length}
          />
        </div>

      </div>
    </div>
  );
};
