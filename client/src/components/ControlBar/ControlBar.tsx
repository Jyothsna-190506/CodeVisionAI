import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, RefreshCw } from 'lucide-react';

interface ControlBarProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  playbackSpeed: number;
  onPlayToggle: () => void;
  onStepNext: () => void;
  onStepPrev: () => void;
  onScrub: (index: number) => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
  onReplay: () => void;
  disabled?: boolean;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  playbackSpeed,
  onPlayToggle,
  onStepNext,
  onStepPrev,
  onScrub,
  onSpeedChange,
  onReset,
  onReplay,
  disabled = false
}) => {
  const isAtStart = currentStepIndex <= 0;
  const isAtEnd = currentStepIndex >= totalSteps - 1;

  return (
    <div className="glass-panel p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
      {/* Slider Scrubber & Progress */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-medium text-slate-400 min-w-[55px]">
          Step {totalSteps > 0 ? currentStepIndex + 1 : 0} / {totalSteps}
        </span>
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => onScrub(parseInt(e.target.value, 10))}
          disabled={disabled || totalSteps === 0}
          className="w-full accent-indigo-500 bg-slate-900 rounded-lg cursor-pointer h-2 disabled:opacity-50"
        />
      </div>

      {/* Buttons & Speed controls */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5">
          {/* Replay */}
          <button
            onClick={onReplay}
            disabled={disabled || totalSteps === 0}
            title="Replay from start"
            className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            disabled={disabled || totalSteps === 0}
            title="Reset Visualizer"
            className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-rose-400 disabled:opacity-40 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          {/* Step Back */}
          <button
            onClick={onStepPrev}
            disabled={disabled || isAtStart || totalSteps === 0}
            title="Previous Step"
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-indigo-500 disabled:opacity-40 transition-all"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause */}
          <button
            onClick={onPlayToggle}
            disabled={disabled || totalSteps === 0}
            title={isPlaying ? 'Pause' : 'Play Automatic Execution'}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-40 transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span className="text-xs">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white ml-0.5" />
                <span className="text-xs">{isAtEnd ? 'Replay' : 'Play'}</span>
              </>
            )}
          </button>

          {/* Step Next */}
          <button
            onClick={onStepNext}
            disabled={disabled || isAtEnd || totalSteps === 0}
            title="Next Step"
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-indigo-500 disabled:opacity-40 transition-all"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Toggles */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          {[0.5, 1, 2].map((speed) => (
            <button
              key={speed}
              onClick={() => onSpeedChange(speed)}
              disabled={disabled}
              className={`px-2 py-0.5 text-[11px] font-bold rounded transition-colors ${
                playbackSpeed === speed
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
