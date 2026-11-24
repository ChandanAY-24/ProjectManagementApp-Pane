import React from 'react';
import { 
  Search, 
  Bell, 
  LayoutGrid, 
  List,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { soundscape } from './Soundscape';

interface TopBarProps {
  title: string;
  subtitle: string;
  metricPills: { label: string; value: string | number; accent?: string }[];
  primaryButtonText?: string;
  onPrimaryClick?: () => void;
  showViewToggle?: boolean;
  viewMode?: 'board' | 'list';
  onViewModeChange?: (mode: 'board' | 'list') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  metricPills,
  primaryButtonText = '+ New task',
  onPrimaryClick,
  showViewToggle = false,
  viewMode = 'board',
  onViewModeChange,
}) => {
  const { 
    setIsCmdKOpen, 
    isFocusCapsuleOpen, 
    setIsFocusCapsuleOpen,
    soundscapeMode,
    setSoundscapeMode
  } = useTheme();

  const toggleSound = () => {
    const nextMode = soundscapeMode === 'mute' ? 'alpha' : 'mute';
    setSoundscapeMode(nextMode);
    soundscape.setSoundscape(nextMode);
  };

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* Top Header Controls Line */}
      <div className="flex items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-0.5">
            {title}
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {subtitle}
          </p>
        </div>

        {/* Action Controls Group */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Dynamic Island Capsule */}
          <button
            onClick={() => setIsFocusCapsuleOpen(!isFocusCapsuleOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 border border-white/10 hover:border-white/20 text-xs font-mono text-white shadow-lg transition-all"
            title="Focus Island Status"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-sans text-slate-400">Focus</span>
            <span className="font-bold text-amber-300">24:46</span>
          </button>

          {/* Search Pill */}
          <button
            onClick={() => setIsCmdKOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181a20]/90 border border-white/[0.08] hover:border-white/20 text-xs text-slate-400 hover:text-white transition-all shadow-xs"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline text-xs">Search</span>
            <kbd className="px-1.5 py-0.2 rounded-md bg-white/10 text-[10px] font-mono text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Quick Soundscape toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-full border transition-all ${
              soundscapeMode !== 'mute'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-[#181a20]/90 text-slate-400 border-white/[0.08] hover:text-white'
            }`}
            title="Ambient Soundscape (10Hz Alpha Waves)"
          >
            {soundscapeMode === 'mute' ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button className="p-2 rounded-full bg-[#181a20]/90 text-slate-400 border border-white/[0.08] hover:text-white transition-all">
              <Bell className="w-3.5 h-3.5" />
            </button>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0d0f12]" />
          </div>

          {/* View Toggle (Board / List) */}
          {showViewToggle && (
            <div className="hidden sm:flex items-center p-0.5 rounded-full bg-[#181a20] border border-white/[0.08]">
              <button
                onClick={() => onViewModeChange?.('board')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all ${
                  viewMode === 'board'
                    ? 'bg-white/15 text-white font-medium shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                <span>Board</span>
              </button>
              <button
                onClick={() => onViewModeChange?.('list')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all ${
                  viewMode === 'list'
                    ? 'bg-white/15 text-white font-medium shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-3 h-3" />
                <span>List</span>
              </button>
            </div>
          )}

          {/* Primary Action Button */}
          {primaryButtonText && onPrimaryClick && (
            <button
              onClick={onPrimaryClick}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{primaryButtonText}</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Metric Pills Row */}
      {metricPills.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {metricPills.map((pill, idx) => (
            <div
              key={idx}
              className="px-3.5 py-1.5 rounded-2xl bg-[#14161c]/90 border border-white/[0.07] flex items-center gap-2 text-xs backdrop-blur-md"
            >
              <span className="text-slate-400 font-medium">{pill.label}</span>
              <span className={`font-bold font-mono ${pill.accent || 'text-white'}`}>
                {pill.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
