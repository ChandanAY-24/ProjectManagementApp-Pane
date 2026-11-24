import React, { useState } from 'react';
import { 
  Layers, 
  Calendar as CalendarIcon, 
  Users, 
  FolderKanban, 
  BarChart3, 
  Search, 
  Plus, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Clock, 
  Palette,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ThemePreset } from '../types';
import { soundscape } from './Soundscape';
import { api } from '../services/api';

interface NavbarProps {
  activeTab: 'kanban' | 'calendar' | 'team' | 'projects' | 'analytics';
  setActiveTab: (tab: 'kanban' | 'calendar' | 'team' | 'projects' | 'analytics') => void;
  onRefreshData?: () => void;
}

const THEME_OPTIONS: { id: ThemePreset; name: string; gradient: string }[] = [
  { id: 'aurora', name: 'Aurora Deep', gradient: 'from-indigo-500 via-purple-500 to-cyan-400' },
  { id: 'cyber', name: 'Cyber Twilight', gradient: 'from-pink-500 via-purple-600 to-blue-500' },
  { id: 'emerald', name: 'Liquid Emerald', gradient: 'from-emerald-500 via-teal-500 to-cyan-500' },
  { id: 'sunset', name: 'Sunset Solstice', gradient: 'from-amber-500 via-rose-500 to-purple-600' },
  { id: 'obsidian', name: 'Obsidian Minimal', gradient: 'from-slate-400 via-zinc-500 to-neutral-400' },
];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onRefreshData }) => {
  const { 
    theme, 
    setTheme, 
    soundscapeMode, 
    setSoundscapeMode, 
    isFocusCapsuleOpen, 
    setIsFocusCapsuleOpen,
    setIsCmdKOpen,
    setTriggerNewTaskModal
  } = useTheme();

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isSoundMenuOpen, setIsSoundMenuOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSoundChange = (mode: 'mute' | 'alpha' | 'rain' | 'white') => {
    setSoundscapeMode(mode);
    soundscape.setSoundscape(mode);
    setIsSoundMenuOpen(false);
  };

  const handleResetDemo = async () => {
    if (confirm('Re-seed all sample data (Projects, Tasks, Team, Focus Sessions)?')) {
      try {
        setIsResetting(true);
        await api.resetSeedData();
        onRefreshData?.();
      } catch (err) {
        console.error(err);
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 py-3 border-b border-white/10 bg-slate-950/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('kanban')}>
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-white/30">
              <Layers className="w-5 h-5 text-white animate-pulse" />
              <div className="absolute inset-0 rounded-xl bg-white/20 blur-xs" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  GlassFlow
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Spatial Project & Focus Engine
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'kanban'
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'calendar'
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Calendar
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'team'
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Team Capacity
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'projects'
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Projects
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics
            </button>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Cmd+K Search Omnibar trigger */}
          <button
            onClick={() => setIsCmdKOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium transition-all shadow-xs"
            title="Press Cmd+K to search anything"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search studio...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded border border-white/15 text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Quick Add Task */}
          <button
            onClick={() => setTriggerNewTaskModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 border border-cyan-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Task</span>
          </button>

          {/* Focus Timer Capsule Toggle */}
          <button
            onClick={() => setIsFocusCapsuleOpen(!isFocusCapsuleOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              isFocusCapsuleOpen 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-xs shadow-cyan-500/20' 
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Toggle Floating Focus Capsule"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Focus</span>
          </button>

          {/* Ambient Soundscapes Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSoundMenuOpen(!isSoundMenuOpen);
                setIsThemeMenuOpen(false);
              }}
              className={`p-2 rounded-xl border transition-all ${
                soundscapeMode !== 'mute'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
              title="Ambient Soundscapes (Alpha Waves, Rain, White Noise)"
            >
              {soundscapeMode === 'mute' ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {isSoundMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 p-2 rounded-2xl glass-panel shadow-2xl z-50 flex flex-col gap-1 border border-white/15 bg-slate-900/90 backdrop-blur-2xl">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Ambient Audio
                </div>
                {[
                  { id: 'mute', label: 'Off / Mute' },
                  { id: 'alpha', label: '10Hz Alpha Waves (Focus)' },
                  { id: 'rain', label: 'Gentle Rain Stream' },
                  { id: 'white', label: 'Warm White Noise' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSoundChange(item.id as any)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-all ${
                      soundscapeMode === item.id
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{item.label}</span>
                    {soundscapeMode === item.id && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Wallpaper Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setIsThemeMenuOpen(!isThemeMenuOpen);
                setIsSoundMenuOpen(false);
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all"
              title="Change Backdrop Wallpaper Theme"
            >
              <Palette className="w-4 h-4" />
            </button>

            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 p-2 rounded-2xl glass-panel shadow-2xl z-50 flex flex-col gap-1 border border-white/15 bg-slate-900/90 backdrop-blur-2xl">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Atmosphere Theme
                </div>
                {THEME_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setTheme(opt.id);
                      setIsThemeMenuOpen(false);
                    }}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-left transition-all ${
                      theme === opt.id
                        ? 'bg-white/15 text-white font-medium border border-white/20'
                        : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${opt.gradient} border border-white/30`} />
                    <span>{opt.name}</span>
                  </button>
                ))}
                <div className="my-1 border-t border-white/10" />
                <button
                  onClick={handleResetDemo}
                  disabled={isResetting}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-300 hover:bg-rose-500/15 transition-all text-left"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                  <span>Re-seed Demo Fixtures</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
