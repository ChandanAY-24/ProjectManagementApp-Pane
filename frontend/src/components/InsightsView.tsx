import React, { useState } from 'react';
import { Download, Table, ArrowUpRight } from 'lucide-react';

export const InsightsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('90D');

  return (
    <div className="space-y-4">
      {/* Time Range Filter Bar */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#181a20]/90 border border-white/[0.08]">
          {(['7D', '30D', '90D'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all ${
                timeRange === range
                  ? 'bg-white/20 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181a20]/90 hover:bg-white/10 border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white transition-all">
          <Download className="w-3 h-3" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Grid: 2 Top Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Throughput */}
        <div className="p-5 rounded-3xl bg-[#14161c]/85 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xs font-semibold text-slate-300">Throughput</h3>
                <p className="text-[11px] text-slate-500">Tasks finished each week</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.05] text-[11px] text-slate-400 hover:text-white">
                  <Table className="w-3 h-3" />
                  <span>Table</span>
                </button>
                <ArrowUpRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div className="mb-4">
              <span className="text-2xl font-bold font-mono text-white">193 </span>
              <span className="text-xs text-slate-500">finished · <span className="text-slate-400">No earlier history to compare</span></span>
            </div>

            {/* Smooth Spline Canvas */}
            <div className="h-44 w-full pt-2">
              <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="blueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                    <stop offset="100%" stopColor="rgba(59, 130, 246, 0.0)" />
                  </linearGradient>
                </defs>
                <path 
                  d="M 20 80 Q 40 40, 70 100 T 130 50 T 200 40 T 260 70 T 340 30 T 390 60 L 390 120 L 20 120 Z" 
                  fill="url(#blueGlow)" 
                />
                <path 
                  d="M 20 80 Q 40 40, 70 100 T 130 50 T 200 40 T 260 70 T 340 30 T 390 60" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="2.5" 
                />
              </svg>
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-2">
                <span>Jul 18</span>
                <span>Aug 1</span>
                <span>Aug 15</span>
                <span>Aug 29</span>
                <span>Sep 12</span>
                <span>Sep 26</span>
                <span>Oct 10</span>
              </div>
            </div>
          </div>
        </div>

        {/* By Project Donut */}
        <div className="p-5 rounded-3xl bg-[#14161c]/85 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-semibold text-slate-300">By project</h3>
                <p className="text-[11px] text-slate-500">Where the finished work went</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-6 py-2">
              {/* Donut SVG */}
              <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#8b5cf6" strokeWidth="10" strokeDasharray="55 239" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#3b82f6" strokeWidth="10" strokeDasharray="48 239" strokeDashoffset="-55" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#06b6d4" strokeWidth="10" strokeDasharray="48 239" strokeDashoffset="-103" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray="43 239" strokeDashoffset="-151" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#ec4899" strokeWidth="10" strokeDasharray="45 239" strokeDashoffset="-194" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-bold font-mono text-white">332</span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider">finished</span>
                </div>
              </div>

              {/* Project Percent Breakdown */}
              <div className="space-y-2 flex-1 text-xs">
                {[
                  { name: 'Orbit 2.0 launch', count: 78, pct: '23%', color: 'bg-purple-500' },
                  { name: 'Tide mobile app', count: 67, pct: '20%', color: 'bg-blue-500' },
                  { name: 'Northstar analytics', count: 67, pct: '20%', color: 'bg-cyan-500' },
                  { name: 'Sprout onboarding', count: 61, pct: '18%', color: 'bg-emerald-500' },
                  { name: 'Facet design system', count: 59, pct: '18%', color: 'bg-pink-500' },
                ].map(p => (
                  <div key={p.name} className="flex items-center justify-between text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${p.color}`} />
                      <span className="truncate max-w-[130px]">{p.name}</span>
                    </div>
                    <span className="font-mono text-slate-500 text-[11px]">{p.count} <span className="text-slate-400 font-bold">{p.pct}</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 2 Bottom Cards (Focus & Workload) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Focus Chart */}
        <div className="p-5 rounded-3xl bg-[#14161c]/85 border border-white/[0.08] backdrop-blur-xl">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-slate-300">Focus</h3>
            <p className="text-[11px] text-slate-500">Team focus hours each week</p>
            <div className="mt-2 text-xl font-bold font-mono text-white">
              443 <span className="text-xs font-sans text-slate-400 font-normal">hours · about 63h a week</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3 items-end h-28 pt-2">
            {[45, 62, 58, 70, 65, 80, 63].map((val, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                <div 
                  className="w-full rounded-xl bg-purple-500/70 hover:bg-purple-500 transition-all" 
                  style={{ height: `${(val / 80) * 100}%` }} 
                />
                <span className="text-[9px] font-mono text-slate-500">W{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Workload Card */}
        <div className="p-5 rounded-3xl bg-[#14161c]/85 border border-white/[0.08] backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-300">Workload</h3>
              <p className="text-[11px] text-slate-500">Open task hours against weekly capacity</p>
            </div>
            <span className="text-xs text-emerald-400 font-medium">All within capacity</span>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Elise Marchand', role: 'Product Designer', allocated: 28, cap: 36, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60' },
              { name: 'Lin Zhao', role: 'Product Lead', allocated: 18, cap: 32, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60' },
            ].map(m => (
              <div key={m.name} className="flex items-center gap-3">
                <img src={m.avatar} className="w-7 h-7 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white font-medium">{m.name}</span>
                    <span className="font-mono text-slate-400 text-[11px]">{m.allocated}h / {m.cap}h</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-blue-500" 
                      style={{ width: `${(m.allocated / m.cap) * 100}%` }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
