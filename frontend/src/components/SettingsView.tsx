import React, { useState } from 'react';
import { Palette, Volume2, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ThemePreset } from '../types';
import { soundscape } from './Soundscape';
import { api } from '../services/api';

const THEMES: { id: ThemePreset; name: string; color: string }[] = [
  { id: 'obsidian', name: 'Obsidian Studio', color: 'from-slate-800 to-zinc-900' },
  { id: 'aurora', name: 'Aurora Deep', color: 'from-indigo-600 to-cyan-500' },
  { id: 'cyber', name: 'Cyber Twilight', color: 'from-pink-600 to-purple-600' },
  { id: 'emerald', name: 'Liquid Emerald', color: 'from-emerald-600 to-teal-500' },
  { id: 'sunset', name: 'Sunset Solstice', color: 'from-amber-600 to-rose-600' },
];

export const SettingsView: React.FC = () => {
  const { theme, setTheme, soundscapeMode, setSoundscapeMode } = useTheme();
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    if (confirm('Re-seed all default demo fixtures (Projects, Tasks, Team, Focus)?')) {
      try {
        setResetting(true);
        await api.resetSeedData();
        window.location.reload();
      } catch (err) {
        console.error(err);
      } finally {
        setResetting(false);
      }
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Theme Card */}
      <div className="p-6 rounded-3xl bg-[#14161c]/85 border border-white/[0.08] backdrop-blur-xl">
        <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-400" />
          Appearance & Atmosphere Themes
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Select a liquid glass reflection and circadian backdrop preset.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                theme === t.id
                  ? 'border-blue-400/50 bg-blue-500/10 shadow-sm'
                  : 'border-white/[0.08] hover:border-white/20 bg-white/[0.02]'
              }`}
            >
              <div className={`w-full h-8 rounded-xl bg-gradient-to-r ${t.color} mb-2`} />
              <div className="text-xs font-semibold text-white">{t.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Soundscape Card */}
      <div className="p-6 rounded-3xl bg-[#14161c]/85 border border-white/[0.08] backdrop-blur-xl">
        <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-purple-400" />
          Ambient Audio Synthesizer
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Built-in Web Audio synthesis for deep work and concentration.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'mute', label: 'Off / Silent' },
            { id: 'alpha', label: '10Hz Alpha Waves (Focus)' },
            { id: 'rain', label: 'Gentle Rain Stream' },
            { id: 'white', label: 'Warm White Noise' },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => {
                setSoundscapeMode(s.id as any);
                soundscape.setSoundscape(s.id as any);
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                soundscapeMode === s.id
                  ? 'border-purple-400/50 bg-purple-500/10 shadow-sm text-white'
                  : 'border-white/[0.08] hover:border-white/20 bg-white/[0.02] text-slate-300'
              }`}
            >
              <div className="text-xs font-semibold">{s.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Database Maintenance */}
      <div className="p-6 rounded-3xl bg-[#14161c]/85 border border-white/[0.08] backdrop-blur-xl flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white mb-0.5">Reset Demo Database</h3>
          <p className="text-xs text-slate-400">Restore factory sample tasks, projects, calendar events, and team.</p>
        </div>
        <button
          onClick={handleReset}
          disabled={resetting}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
          <span>Re-seed Data</span>
        </button>
      </div>
    </div>
  );
};
