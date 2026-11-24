import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  ArrowUpRight 
} from 'lucide-react';
import { Project, Task } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  onRefresh: () => void;
  onAddTask?: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  tasks,
  onRefresh: _onRefresh,
  onAddTask
}) => {
  const currentProject = projects[0] || {
    title: 'Orbit 2.0 launch',
    description: 'Everything the public sees on launch day: site, film, press kit and the waitlist email.',
    progress: 45
  };

  const projectTasks = tasks.length > 0 ? tasks.slice(0, 5) : [
    { id: '1', title: 'Approve Orbit press kit', priority: 'urgent', due_date: 'Today' },
    { id: '2', title: 'Founder blog post', priority: 'high', due_date: 'Mon' },
    { id: '3', title: 'Launch-day run of show', priority: 'medium', due_date: 'Wed' },
  ];

  return (
    <div className="space-y-4">
      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Overview & Milestones */}
        <div className="space-y-4">
          {/* Overview Card */}
          <div className="p-5 rounded-3xl bg-[#14161c]/85 border border-white/[0.08] backdrop-blur-xl">
            <h3 className="text-xs font-semibold text-slate-300 mb-4">Overview</h3>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <span className="text-[11px] text-slate-500 block mb-1.5">Lead</span>
                <div className="flex items-center gap-2">
                  <img
                    src="/pane/photos/174-pane/ines-duarte-sm.jpg"
                    alt="Inés Duarte"
                    className="w-6 h-6 rounded-full object-cover border border-white/20"
                  />
                  <span className="text-xs font-semibold text-white">Inés Duarte</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block mb-1.5">Status</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  In progress
                </span>
              </div>
            </div>

            {/* Timeline slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span>Started <strong className="text-white">Sep 16</strong></span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono text-[10px]">Today</span>
                <span>Due <strong className="text-white">Oct 28</strong></span>
              </div>
              <div className="relative w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="w-[60%] h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
              </div>
            </div>

            {/* Target & Description */}
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {currentProject.description || 'Everything the public sees on launch day: site, film, press kit and the waitlist email.'}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] text-xs">
              <span className="text-slate-400">Team allocated</span>
              <div className="flex items-center -space-x-2">
                <img src="/pane/photos/174-pane/lin-zhao-sm.jpg" className="w-6 h-6 rounded-full border border-slate-900 object-cover" alt="" />
                <img src="/pane/photos/174-pane/nia-okoro-sm.jpg" className="w-6 h-6 rounded-full border border-slate-900 object-cover" alt="" />
                <img src="/pane/photos/174-pane/elise-marchand-sm.jpg" className="w-6 h-6 rounded-full border border-slate-900 object-cover" alt="" />
                <img src="/pane/photos/174-pane/kwame-asante-sm.jpg" className="w-6 h-6 rounded-full border border-slate-900 object-cover" alt="" />
              </div>
            </div>
          </div>

          {/* Milestones Card */}
          <div className="p-5 rounded-3xl bg-[#14161c]/85 border border-white/[0.08] backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-slate-300">Milestones</h3>
              <span className="text-[11px] text-slate-500 font-mono">1/3 reached</span>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Messaging locked', date: 'Oct 2', done: true },
                { title: 'Launch film final cut', date: 'Oct 20', done: false, current: true },
                { title: 'Press embargo lifts', date: 'Oct 28', done: false },
              ].map((m, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {m.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : m.current ? (
                      <div className="w-4 h-4 rounded-full border-2 border-purple-400 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                      </div>
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className={`text-xs font-medium block ${m.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {m.title}
                      </span>
                      {m.current && (
                        <span className="text-[10px] text-purple-300 font-medium">Next critical checkpoint</span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">{m.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Burndown Velocity & Tasks */}
        <div className="space-y-4">
          {/* Burndown Velocity Spline Card */}
          <div className="p-5 rounded-3xl bg-[#14161c]/85 border border-white/[0.08] backdrop-blur-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-slate-300">Burndown</h3>
              <span className="text-[11px] text-emerald-400 font-mono font-medium flex items-center gap-1">
                <span>On track</span>
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 mb-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-purple-400" /> Done</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-slate-500 border-t border-dashed" /> Total</span>
            </div>

            {/* SVG Spline */}
            <div className="h-36 w-full pt-2">
              <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                <path d="M 0 90 Q 50 85, 100 80 T 200 45 T 300 40" fill="none" stroke="#a855f7" strokeWidth="2.5" />
                <path d="M 0 85 L 100 70 L 200 35 L 300 25" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
                <span>Sep 16</span>
                <span>Sep 26</span>
                <span>Oct 6</span>
                <span>Oct 16</span>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="p-5 rounded-3xl bg-[#14161c]/85 border border-white/[0.08] backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-semibold text-slate-300">Tasks</h3>
                <span className="text-[11px] text-slate-500 font-mono">{projectTasks.length} assigned</span>
              </div>
              <button
                onClick={onAddTask}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500 hover:bg-blue-400 text-white text-xs font-medium transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add task</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {projectTasks.map(t => (
                <div key={t.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                    <span className="text-white font-medium truncate">{t.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {t.priority && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                        t.priority === 'urgent' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {t.priority}
                      </span>
                    )}
                    <span className="text-slate-500 text-[11px] font-mono">{t.due_date || 'Oct 28'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
