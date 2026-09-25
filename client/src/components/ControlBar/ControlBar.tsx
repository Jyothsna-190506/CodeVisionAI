import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, RefreshCw } from 'lucide-react';
import { GlassAIButton } from '../ThreeUI/GlassAIButton';

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
    <div className="pearl-card p-3.5 rounded-2xl border border-border-pearl flex flex-col gap-2.5 shadow-pearl-sm">
      {/* Slider Scrubber & Progress */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-bold text-charcoal min-w-[65px]">
          Step {totalSteps > 0 ? currentStepIndex + 1 : 0} / {totalSteps}
        </span>
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => onScrub(parseInt(e.target.value, 10))}
          disabled={disabled || totalSteps === 0}
          className="w-full accent-terracotta bg-ivory-warm rounded-lg cursor-pointer h-2 disabled:opacity-50"
        />
      </div>

      {/* Buttons & Speed controls */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border-pearl">
        <div className="flex items-center gap-1.5">
          {/* Replay */}
          <button
            onClick={onReplay}
            disabled={disabled || totalSteps === 0}
            title="Replay from start"
            className="p-2 rounded-xl text-charcoal-muted hover:bg-ivory-warm hover:text-charcoal border border-border-pearl disabled:opacity-40 transition-colors shadow-pearl-sm"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            disabled={disabled || totalSteps === 0}
            title="Reset Visualizer"
            className="p-2 rounded-xl text-charcoal-muted hover:bg-ivory-warm hover:text-rose-600 border border-border-pearl disabled:opacity-40 transition-colors shadow-pearl-sm"
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
            className="p-2 rounded-xl bg-white border border-border-pearl text-charcoal hover:bg-ivory-warm hover:border-terracotta disabled:opacity-40 transition-all shadow-pearl-sm"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause */}
          <button
            onClick={onPlayToggle}
            disabled={disabled || totalSteps === 0}
            title={isPlaying ? 'Pause' : 'Play Automatic Execution'}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-terracotta to-orange-warm hover:from-terracotta-hover hover:to-terracotta text-white font-semibold flex items-center gap-2 shadow-terracotta-glow disabled:opacity-40 transition-all"
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
            className="p-2 rounded-xl bg-white border border-border-pearl text-charcoal hover:bg-ivory-warm hover:border-terracotta disabled:opacity-40 transition-all shadow-pearl-sm"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Toggles */}
        <div className="flex items-center gap-1 bg-ivory-warm p-1 rounded-xl border border-border-pearl">
          {[0.5, 1, 2].map((speed) => (
            <button
              key={speed}
              onClick={() => onSpeedChange(speed)}
              disabled={disabled}
              className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-colors ${
                playbackSpeed === speed
                  ? 'bg-terracotta text-white shadow-sm'
                  : 'text-charcoal-muted hover:text-charcoal'
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
