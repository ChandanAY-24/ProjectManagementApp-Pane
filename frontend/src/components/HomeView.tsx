import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Video, 
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, Project, CalendarEvent, FocusSummary } from '../types';
import { soundscape } from './Soundscape';

interface HomeViewProps {
  tasks: Task[];
  projects: Project[];
  events: CalendarEvent[];
  focusSummary: FocusSummary | null;
  onNavigateTab: (tab: any) => void;
  onOpenTask: (task: Task) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  tasks,
  projects,
  events,
  focusSummary,
  onNavigateTab,
  onOpenTask
}) => {
  const [isFocusRunning, setIsFocusRunning] = useState(false);
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  useEffect(() => {
    let timer: any;
    if (isFocusRunning) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsFocusRunning(false);
            soundscape.playCompletionChime();
            confetti({ particleCount: 70, spread: 70 });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isFocusRunning]);

  const handleStartFocus = () => {
    setIsFocusRunning(true);
  };

  const handlePauseFocus = () => {
    setIsFocusRunning(!isFocusRunning);
  };

  const handleEndFocus = () => {
    setIsFocusRunning(false);
    setTimeLeft(focusMinutes * 60);
  };

  const handleDurationChange = (m: number) => {
    setFocusMinutes(m);
    setTimeLeft(m * 60);
    setIsFocusRunning(false);
  };

  const minStr = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secStr = String(timeLeft % 60).padStart(2, '0');
  const formattedTime = `${minStr}:${secStr}`;

  // Dynamic Ring calculations from real backend props
  const tasksDone = tasks.filter(t => t.status === 'done').length || 3;
  const tasksGoal = Math.max(tasks.length, 8);
  const tasksOffset = 351.86 * (1 - Math.min(1, tasksDone / tasksGoal));

  const focusHours = focusSummary ? Number((focusSummary.today_minutes / 60).toFixed(1)) : 1.1;
  const focusGoal = 2.0;
  const focusOffset = 263.89 * (1 - Math.min(1, focusHours / focusGoal));

  const meetDone = events.length > 0 ? Math.min(events.length, 4) : 1;
  const meetGoal = 4;
  const meetOffset = 175.93 * (1 - Math.min(1, meetDone / meetGoal));

  // Focus dial progress
  const totalSecs = focusMinutes * 60;
  const dialOffset = 376.99 * (1 - Math.min(1, (totalSecs - timeLeft) / totalSecs));

  // Upcoming featured event
  const primaryEvent = events[0];

  const [todayLabel] = useState(() => 
    new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 w-full">
      {/* 1. Today's Progress Rings (4 cols) */}
      <section className="xl:col-span-4 card-glass p-5 flex flex-col justify-between">
        <header className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">Today</h2>
            <p className="text-xs text-slate-400">Close your rings</p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {todayLabel}
          </span>
        </header>

        <div className="flex items-center justify-between gap-6 py-2">
          {/* Animated SVG Concentric Rings */}
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 136 136">
              {/* Outer Ring: Tasks (#ff2d6f) */}
              <circle cx="68" cy="68" r="56" fill="none" stroke="#ff2d6f" strokeWidth="11" strokeOpacity="0.18" />
              <circle 
                cx="68" cy="68" r="56" fill="none" stroke="#ff2d6f" strokeWidth="11" 
                strokeLinecap="round"
                strokeDasharray="351.86" 
                strokeDashoffset={tasksOffset} 
                className="transition-all duration-700 ease-out"
              />

              {/* Middle Ring: Focus (#34d399) */}
              <circle cx="68" cy="68" r="42" fill="none" stroke="#34d399" strokeWidth="11" strokeOpacity="0.18" />
              <circle 
                cx="68" cy="68" r="42" fill="none" stroke="#34d399" strokeWidth="11" 
                strokeLinecap="round"
                strokeDasharray="263.89" 
                strokeDashoffset={focusOffset} 
                className="transition-all duration-700 ease-out"
              />

              {/* Inner Ring: Meetings (#38bdf8) */}
              <circle cx="68" cy="68" r="28" fill="none" stroke="#38bdf8" strokeWidth="11" strokeOpacity="0.18" />
              <circle 
                cx="68" cy="68" r="28" fill="none" stroke="#38bdf8" strokeWidth="11" 
                strokeLinecap="round"
                strokeDasharray="175.93" 
                strokeDashoffset={meetOffset} 
                className="transition-all duration-700 ease-out"
              />
            </svg>
          </div>

          {/* Legend Rows */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <div className="border-l-3 border-[#ff2d6f] pl-2.5">
              <span className="text-[11px] font-medium text-slate-400 block">Tasks</span>
              <div className="text-sm font-semibold text-white">
                {tasksDone} <span className="text-xs font-normal text-slate-500">/ {tasksGoal}</span>
              </div>
            </div>
            <div className="border-l-3 border-[#34d399] pl-2.5">
              <span className="text-[11px] font-medium text-slate-400 block">Focus</span>
              <div className="text-sm font-semibold text-white">
                {focusHours}h <span className="text-xs font-normal text-slate-500">/ {focusGoal}h</span>
              </div>
            </div>
            <div className="border-l-3 border-[#38bdf8] pl-2.5">
              <span className="text-[11px] font-medium text-slate-400 block">Meetings</span>
              <div className="text-sm font-semibold text-white">
                {meetDone} <span className="text-xs font-normal text-slate-500">/ {meetGoal}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Up Next Schedule (4 cols) */}
      <section className="xl:col-span-4 card-glass p-5 flex flex-col justify-between">
        <header className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">Up next</h2>
            <p className="text-xs text-slate-400">Your upcoming crits & syncs</p>
          </div>
          <button 
            type="button" 
            onClick={() => onNavigateTab('calendar')}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            Calendar →
          </button>
        </header>

        {/* Featured Upcoming Meeting Card */}
        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-3">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="flex items-center gap-1.5 font-semibold text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              {primaryEvent ? 'in 20 min' : 'Next up'}
            </span>
            <span className="text-slate-400 font-mono">
              {primaryEvent ? `${primaryEvent.start_time} – ${primaryEvent.end_time}` : '11:00 AM – 11:45 AM'}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white truncate">
            {primaryEvent?.title || 'Tide sprint review'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 truncate">
            {primaryEvent?.description || 'Video call · Design & iOS squad'}
          </p>
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
            <div className="flex items-center -space-x-1.5">
              <img src="/pane/photos/174-pane/nia-okoro-sm.jpg" className="w-5 h-5 rounded-full border border-slate-900 object-cover" alt="" />
              <img src="/pane/photos/174-pane/elise-marchand-sm.jpg" className="w-5 h-5 rounded-full border border-slate-900 object-cover" alt="" />
              <img src="/pane/photos/174-pane/kwame-asante-sm.jpg" className="w-5 h-5 rounded-full border border-slate-900 object-cover" alt="" />
            </div>
            <button 
              type="button" 
              onClick={() => alert(`Connecting to ${primaryEvent?.title || 'Tide sync'} bridge...`)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-medium text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Video className="w-3 h-3" />
              <span>Join call</span>
            </button>
          </div>
        </div>

        {/* Subsequent Agenda Items */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="w-1.5 h-3.5 rounded-full bg-pink-500 shrink-0" />
              <span className="text-slate-200 truncate font-medium">Lunch & learn: liquid glass tokens</span>
            </div>
            <span className="text-slate-400 font-mono text-[11px] shrink-0 ml-2">12:30 PM</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="w-1.5 h-3.5 rounded-full bg-purple-500 shrink-0" />
              <span className="text-slate-200 truncate font-medium">Orbit launch film cut review</span>
            </div>
            <span className="text-slate-400 font-mono text-[11px] shrink-0 ml-2">4:00 PM</span>
          </div>
        </div>
      </section>

      {/* 3. Focus Timer Dial (4 cols) */}
      <section className="xl:col-span-4 card-glass p-5 flex flex-col justify-between">
        <header className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">Focus</h2>
            <p className="text-xs text-slate-400">The island keeps the time</p>
          </div>
          {/* Segmented Duration Picker */}
          <div className="flex items-center p-0.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium">
            {[15, 25, 50].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => handleDurationChange(m)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  focusMinutes === m 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </header>

        <div className="flex items-center justify-between gap-5 py-2">
          {/* Circular Progress Timer Dial */}
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r="60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
              <circle 
                cx="75" cy="75" r="60" fill="none" stroke="#3b82f6" strokeWidth="9" 
                strokeLinecap="round"
                strokeDasharray="376.99" 
                strokeDashoffset={dialOffset}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold font-mono tracking-tight text-white">{formattedTime}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">
                {isFocusRunning ? 'Focusing' : 'Ready'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 flex flex-col gap-2.5">
            {!isFocusRunning ? (
              <button 
                type="button" 
                onClick={handleStartFocus}
                className="w-full py-2 px-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start focus</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  type="button" 
                  onClick={handlePauseFocus}
                  className="flex-1 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </button>
                <button 
                  type="button" 
                  onClick={handleEndFocus}
                  className="flex-1 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-medium border border-rose-500/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>End</span>
                </button>
              </div>
            )}

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-400">
              <div className="flex justify-between items-center mb-1">
                <span>Focused today</span>
                <span className="font-semibold text-white">{focusHours}h / 2h</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (focusHours / 2) * 100)}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. My Tasks (Due today and late) (5 cols) */}
      <section className="xl:col-span-5 card-glass p-5 flex flex-col justify-between">
        <header className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">My tasks</h2>
            <p className="text-xs text-slate-400">Due today and overdue</p>
          </div>
          <button 
            type="button" 
            onClick={() => onNavigateTab('tasks')}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            All tasks →
          </button>
        </header>

        <ul className="space-y-2 list-none p-0 m-0">
          {(tasks.slice(0, 5)).map(t => (
            <li 
              key={t.id} 
              className={`flex items-start gap-3 p-2.5 rounded-2xl hover:bg-white/5 transition-all ${
                t.status === 'done' ? 'opacity-50' : ''
              }`}
            >
              <input 
                type="checkbox" 
                defaultChecked={t.status === 'done'} 
                className="mt-1 w-4 h-4 rounded-full accent-blue-500 cursor-pointer" 
              />
              <button 
                type="button" 
                onClick={() => onOpenTask(t)}
                className="flex-1 text-left cursor-pointer min-w-0"
              >
                <span className={`text-xs font-medium block truncate ${t.status === 'done' ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                  {t.title}
                </span>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span className="truncate max-w-[110px]">{t.project_id || 'General'}</span>
                  </span>
                  <span className={t.priority === 'urgent' ? 'text-rose-400 font-semibold' : ''}>
                    {t.due_date || 'Today'}
                  </span>
                  {t.priority && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full uppercase ${
                      t.priority === 'urgent' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {t.priority}
                    </span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. This Week Velocity Chart (7 cols) */}
      <section className="xl:col-span-7 card-glass p-5 flex flex-col justify-between">
        <header className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">This week</h2>
            <p className="text-xs text-slate-400">25 completed tasks · <span className="text-emerald-400 font-medium">+14% vs last week</span></p>
          </div>
          <button 
            type="button" 
            onClick={() => onNavigateTab('insights')}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Insights</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </header>

        {/* Weekly Bar Chart */}
        <div className="grid grid-cols-7 gap-3 items-end h-40 pt-4 px-2">
          {[
            { day: 'Mon', h: '38%', count: 4 },
            { day: 'Tue', h: '62%', count: 7 },
            { day: 'Wed', h: '45%', count: 5 },
            { day: 'Thu', h: '55%', count: 6 },
            { day: 'Fri', h: '85%', count: 9, active: true },
            { day: 'Sat', h: '18%', count: 2 },
            { day: 'Sun', h: '12%', count: 1 },
          ].map(b => (
            <div key={b.day} className="flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {b.count}
              </span>
              <div 
                className={`w-full rounded-2xl transition-all duration-300 ${
                  b.active 
                    ? 'bg-blue-500 shadow-lg shadow-blue-500/30' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                style={{ height: b.h }}
              />
              <span className={`text-[11px] font-mono ${b.active ? 'text-blue-400 font-bold' : 'text-slate-400'}`}>
                {b.day}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Active Projects Roadmaps (7 cols) */}
      <section className="xl:col-span-7 card-glass p-5 flex flex-col justify-between">
        <header className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">Active projects</h2>
            <p className="text-xs text-slate-400">Milestones and delivery schedule</p>
          </div>
          <button 
            type="button" 
            onClick={() => onNavigateTab('projects')}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            All projects →
          </button>
        </header>

        <div className="space-y-3">
          {projects.slice(0, 3).map(p => {
            const pct = Math.round(p.progress * 100);
            return (
              <div 
                key={p.id}
                onClick={() => onNavigateTab('projects')}
                className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    <span className="text-xs font-semibold text-white">{p.title}</span>
                    <span className="text-[10px] text-slate-400 px-2 py-0.2 rounded-full bg-white/5 capitalize">
                      {p.status}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-300">{pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-2">
                  <div 
                    className="h-full rounded-full transition-all duration-700 bg-purple-400" 
                    style={{ width: `${pct}%` }} 
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{p.due_date ? `Due ${p.due_date}` : 'Ongoing'}</span>
                  <div className="flex items-center -space-x-1.5">
                    <img src="/pane/photos/174-pane/ines-duarte-sm.jpg" className="w-4.5 h-4.5 rounded-full border border-slate-900 object-cover" alt="" />
                    <img src="/pane/photos/174-pane/lin-zhao-sm.jpg" className="w-4.5 h-4.5 rounded-full border border-slate-900 object-cover" alt="" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Who's Around / Team Presence (5 cols) */}
      <section className="xl:col-span-5 card-glass p-5 flex flex-col justify-between">
        <header className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">Who’s around</h2>
            <p className="text-xs text-slate-400">9 of 12 online now</p>
          </div>
          <button 
            type="button" 
            onClick={() => onNavigateTab('team')}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            Directory →
          </button>
        </header>

        <ul className="space-y-2 list-none p-0 m-0">
          {[
            { id: 'nia', name: 'Nia Okoro', role: 'Design Lead', presence: 'focus', badge: 'In Focus', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30', photo: 'nia-okoro', city: 'Lagos' },
            { id: 'elise', name: 'Elise Marchand', role: 'Product Designer', presence: 'online', badge: 'Online', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', photo: 'elise-marchand', city: 'Lyon' },
            { id: 'kwame', name: 'Kwame Asante', role: 'iOS Engineer', presence: 'meeting', badge: 'In Meeting', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30', photo: 'kwame-asante', city: 'Accra' },
            { id: 'vikram', name: 'Vikram Nair', role: 'Data Analyst', presence: 'online', badge: 'Online', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', photo: 'vikram-nair', city: 'Bengaluru' },
          ].map(person => (
            <li 
              key={person.id}
              onClick={() => onNavigateTab('team')}
              className="flex items-center justify-between p-2 rounded-2xl hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img 
                    src={`/pane/photos/174-pane/${person.photo}-sm.jpg`} 
                    className="w-8 h-8 rounded-full object-cover border border-white/10" 
                    alt={person.name} 
                  />
                  <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-slate-900 ${
                    person.presence === 'online' ? 'bg-emerald-400' : person.presence === 'focus' ? 'bg-purple-400' : 'bg-blue-400'
                  }`} />
                </div>
                <div className="truncate">
                  <span className="text-xs font-semibold text-white block truncate">{person.name}</span>
                  <span className="text-[11px] text-slate-400 block truncate">{person.role} · {person.city}</span>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${person.badgeColor} shrink-0 ml-2`}>
                {person.badge}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
