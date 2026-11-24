import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Minimize2, 
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../context/ThemeContext';
import { soundscape } from './Soundscape';
import { api } from '../services/api';

export const FocusCapsule: React.FC = () => {
  const { 
    isFocusCapsuleOpen, 
    setIsFocusCapsuleOpen, 
    activeFocusTask
  } = useTheme();

  const [durationMinutes, setDurationMinutes] = useState(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<any>(null);

  // Synchronize when duration presets change
  const handleSelectPreset = (minutes: number) => {
    setIsRunning(false);
    setDurationMinutes(minutes);
    setTimeLeftSeconds(minutes * 60);
  };

  const handleSessionCompleted = useCallback(async () => {
    setIsRunning(false);
    soundscape.playCompletionChime();

    // Trigger celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.15 },
      colors: ['#38bdf8', '#818cf8', '#c084fc', '#34d399', '#f43f5e']
    });

    // Persist session to backend
    try {
      await api.createFocusSession({
        task_id: activeFocusTask?.id,
        task_title: activeFocusTask?.title || 'Deep Work Focus Block',
        duration_minutes: durationMinutes,
        session_type: durationMinutes >= 45 ? 'deep_work' : 'pomodoro',
        completed: true,
        notes: 'Completed uninterrupted focus capsule sprint'
      });
    } catch (e) {
      console.warn('Failed to log focus session to backend:', e);
    }
  }, [activeFocusTask, durationMinutes]);

  // Timer loop
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            handleSessionCompleted();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, durationMinutes, handleSessionCompleted]);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeftSeconds(durationMinutes * 60);
  };

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalSeconds = durationMinutes * 60;
  const progressRatio = Math.max(0, Math.min(1, (totalSeconds - timeLeftSeconds) / totalSeconds));
  const strokeDashoffset = 283 - 283 * progressRatio;

  if (!isFocusCapsuleOpen) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 transition-all duration-300">
      <div 
        className={`glass-panel border border-white/20 shadow-2xl transition-all duration-300 ${
          isRunning ? 'focus-pulsing border-cyan-400/40 bg-slate-900/80' : 'bg-slate-900/60'
        } backdrop-blur-2xl rounded-full px-4 py-2 flex items-center gap-3 sm:gap-4`}
      >
        {/* Animated Progress Dial */}
        <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
          <svg className="w-9 h-9 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#capsuleGrad)"
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
            <defs>
              <linearGradient id="capsuleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {isRunning ? (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            ) : (
              <Flame className="w-3.5 h-3.5 text-amber-400" />
            )}
          </div>
        </div>

        {/* Time display & Active Task */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-mono text-base sm:text-lg font-bold tracking-wider text-white">
              {formattedTime}
            </span>
            <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              {isRunning ? 'Flowing' : 'Paused'}
            </span>
          </div>
          <div className="text-[11px] text-slate-300 max-w-[140px] sm:max-w-[200px] truncate font-medium">
            {activeFocusTask?.title || 'Deep Work Session'}
          </div>
        </div>

        {/* Presets */}
        <div className="hidden sm:flex items-center gap-1 border-l border-white/10 pl-3">
          {[15, 25, 50].map((m) => (
            <button
              key={m}
              onClick={() => handleSelectPreset(m)}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                durationMinutes === m && !isRunning
                  ? 'bg-white/20 text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {m}m
            </button>
          ))}
        </div>

        {/* Play/Pause & Reset Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 border-l border-white/10 pl-2 sm:pl-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
              isRunning
                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 hover:scale-105 active:scale-95'
            }`}
            title={isRunning ? 'Pause Timer' : 'Start Focus Session'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 translate-x-0.5" />}
          </button>

          <button
            onClick={handleReset}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            title="Reset to selected duration"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleSessionCompleted}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 transition-all"
            title="Mark Focus Session Complete (Confetti & Log)"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Close / Minimize Pill */}
        <div className="flex items-center gap-1 border-l border-white/10 pl-2">
          <button
            onClick={() => setIsFocusCapsuleOpen(false)}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-all text-xs"
            title="Hide Focus Capsule"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
