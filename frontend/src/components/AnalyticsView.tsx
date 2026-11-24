import React from 'react';
import { 
  BarChart3, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  Sparkles,
  Zap
} from 'lucide-react';
import { Task, TeamMember, FocusSession, FocusSummary, Project } from '../types';

interface AnalyticsViewProps {
  tasks: Task[];
  team: TeamMember[];
  projects: Project[];
  focusSessions: FocusSession[];
  focusSummary: FocusSummary | null;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  tasks,
  team,
  projects,
  focusSessions,
  focusSummary
}) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const reviewTasks = tasks.filter(t => t.status === 'in_review').length;
  const backlogTasks = tasks.filter(t => t.status === 'backlog').length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Capacity calculations
  const totalWeeklyCapacity = team.reduce((acc, m) => acc + m.weekly_capacity_hours, 0);
  const totalAllocated = team.reduce((acc, m) => acc + m.allocated_hours, 0);
  const capacityLoad = totalWeeklyCapacity > 0 ? Math.round((totalAllocated / totalWeeklyCapacity) * 100) : 0;

  // Priority count
  const urgentCount = tasks.filter(t => t.priority === 'urgent').length;
  const highCount = tasks.filter(t => t.priority === 'high').length;
  const mediumCount = tasks.filter(t => t.priority === 'medium').length;
  const lowCount = tasks.filter(t => t.priority === 'low').length;

  return (
    <div className="space-y-6">
      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Focus Minutes Today */}
        <div className="p-5 rounded-2xl glass-card border border-cyan-500/30 bg-slate-950/40 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Focus Time Today</span>
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-1">
            {focusSummary?.today_minutes || 75}m
          </div>
          <div className="flex items-center gap-1.5 text-xs text-cyan-400">
            <Flame className="w-3.5 h-3.5" />
            <span>{focusSummary?.streak_days || 3} day focus streak</span>
          </div>
        </div>

        {/* Card 2: Task Completion Rate */}
        <div className="p-5 rounded-2xl glass-card border border-indigo-500/30 bg-slate-950/40 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Tasks Completed</span>
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-1">
            {completedTasks} / {totalTasks}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{completionRate}% completion rate</span>
          </div>
        </div>

        {/* Card 3: Studio Team Load */}
        <div className="p-5 rounded-2xl glass-card border border-emerald-500/30 bg-slate-950/40 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Studio Load Factor</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-1">
            {totalAllocated}h / {totalWeeklyCapacity}h
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <Zap className="w-3.5 h-3.5" />
            <span>{capacityLoad}% capacity allocated</span>
          </div>
        </div>

        {/* Card 4: Active Projects */}
        <div className="p-5 rounded-2xl glass-card border border-purple-500/30 bg-slate-950/40 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Active Roadmaps</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-1">
            {projects.length} Initiatives
          </div>
          <div className="flex items-center gap-1.5 text-xs text-purple-400">
            <span>Across 4 studio disciplines</span>
          </div>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 bg-slate-950/40 backdrop-blur-xl">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Workflow Status Breakdown
          </h3>

          <div className="space-y-3.5">
            {[
              { label: 'Backlog', count: backlogTasks, color: 'bg-slate-400' },
              { label: 'In Progress', count: inProgressTasks, color: 'bg-cyan-400' },
              { label: 'In Review', count: reviewTasks, color: 'bg-purple-400' },
              { label: 'Completed', count: completedTasks, color: 'bg-emerald-400' },
            ].map(item => {
              const pct = totalTasks > 0 ? Math.round((item.count / totalTasks) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    <span className="font-mono text-slate-400">{item.count} tasks ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 bg-slate-950/40 backdrop-blur-xl">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            Task Priority Distribution
          </h3>

          <div className="space-y-3.5">
            {[
              { label: 'Urgent', count: urgentCount, color: 'bg-rose-500' },
              { label: 'High', count: highCount, color: 'bg-amber-500' },
              { label: 'Medium', count: mediumCount, color: 'bg-cyan-500' },
              { label: 'Low', count: lowCount, color: 'bg-slate-400' },
            ].map(item => {
              const pct = totalTasks > 0 ? Math.round((item.count / totalTasks) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">{item.label} Priority</span>
                    <span className="font-mono text-slate-400">{item.count} tasks ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Focus Session Log History */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 bg-slate-950/40 backdrop-blur-xl">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          Recent Focus Capsule Sessions Log
        </h3>

        <div className="space-y-2.5">
          {focusSessions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No focus sessions logged yet. Launch the Focus Capsule to record flow state.
            </div>
          ) : (
            focusSessions.map(session => (
              <div
                key={session.id}
                className="p-3.5 rounded-xl glass-card border border-white/5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                    {session.duration_minutes}m
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      {session.task_title || 'Uninterrupted Sprint'}
                    </h4>
                    {session.notes && (
                      <p className="text-[11px] text-slate-400">
                        {session.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                    Completed
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
