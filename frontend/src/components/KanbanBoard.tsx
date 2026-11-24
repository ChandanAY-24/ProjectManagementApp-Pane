import React, { useState } from 'react';
import { 
  Plus, 
  Circle, 
  CheckCircle2, 
  Calendar, 
  MessageSquare, 
  Search, 
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, Project, TeamMember, TaskStatus } from '../types';
import { api } from '../services/api';

interface KanbanBoardProps {
  tasks: Task[];
  projects: Project[];
  team: TeamMember[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status?: TaskStatus) => void;
  onRefresh: () => void;
}

const PROJECT_COLORS: Record<string, { dot: string; text: string }> = {
  'proj-1': { dot: 'bg-orange-500', text: 'text-orange-400' },
  'proj-2': { dot: 'bg-purple-500', text: 'text-purple-400' },
  'proj-3': { dot: 'bg-emerald-500', text: 'text-emerald-400' },
  'proj-4': { dot: 'bg-blue-500', text: 'text-blue-400' },
  'default': { dot: 'bg-pink-500', text: 'text-pink-400' }
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  projects,
  team: _team,
  onTaskClick,
  onAddTask,
  onRefresh
}) => {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [mineOnly, setMineOnly] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const COLUMNS = [
    { id: 'backlog' as TaskStatus, label: 'To do', icon: <Circle className="w-3.5 h-3.5 text-slate-400" /> },
    { id: 'in_progress' as TaskStatus, label: 'In progress', icon: <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> },
    { id: 'in_review' as TaskStatus, label: 'In review', icon: <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> },
    { id: 'done' as TaskStatus, label: 'Done', icon: <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> },
  ];

  const filteredTasks = tasks.filter(t => {
    if (selectedProject !== 'all' && t.project_id !== selectedProject) return false;
    if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;
    if (mineOnly && !t.assignee_name.toLowerCase().includes('lin') && !t.assignee_name.toLowerCase().includes('elena')) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const match = t.title.toLowerCase().includes(q) || 
                    (t.description || '').toLowerCase().includes(q) ||
                    t.assignee_name.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault();
    if (dragOverColumn !== columnId) setDragOverColumn(columnId);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setDraggedTaskId(null);

    if (!taskId) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === targetStatus) return;

    if (targetStatus === 'done') {
      confetti({ particleCount: 50, spread: 60 });
    }

    try {
      await api.updateTask(taskId, { status: targetStatus });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const getProject = (id: string) => projects.find(p => p.id === id);

  return (
    <div className="space-y-4">
      {/* Secondary Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Projects dropdown */}
          <div className="relative">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-1.5 rounded-full bg-[#181a20]/90 border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white cursor-pointer outline-none"
            >
              <option value="all" className="bg-slate-900">All projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id} className="bg-slate-900">{p.title}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Mine only button */}
          <button
            onClick={() => setMineOnly(!mineOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              mineOnly 
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' 
                : 'bg-[#181a20]/90 border border-white/[0.08] text-slate-400 hover:text-white'
            }`}
          >
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80" 
              className="w-3.5 h-3.5 rounded-full object-cover" 
            />
            <span>Mine only</span>
          </button>

          {/* Any priority dropdown */}
          <div className="relative">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-1.5 rounded-full bg-[#181a20]/90 border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white cursor-pointer outline-none"
            >
              <option value="all" className="bg-slate-900">Any priority</option>
              <option value="urgent" className="bg-slate-900">Urgent</option>
              <option value="high" className="bg-slate-900">High</option>
              <option value="medium" className="bg-slate-900">Medium</option>
              <option value="low" className="bg-slate-900">Low</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filter by title, project or person input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by title, project or person"
              className="pl-8 pr-3.5 py-1.5 rounded-full bg-[#181a20]/90 border border-white/[0.08] text-xs text-slate-200 placeholder-slate-500 outline-none w-52 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* 4 Columns Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          const isOver = dragOverColumn === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={() => setDragOverColumn(null)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex flex-col min-h-[520px] rounded-3xl p-3 bg-[#13151b]/80 border transition-all duration-200 ${
                isOver ? 'border-blue-400/50 bg-blue-500/[0.05]' : 'border-white/[0.08]'
              } backdrop-blur-xl`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-2 mb-2">
                <div className="flex items-center gap-2">
                  {col.icon}
                  <span className="text-xs font-semibold text-white tracking-wide">
                    {col.label}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => onAddTask(col.id)}
                  className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[70vh] pr-0.5">
                {colTasks.map((task) => {
                  const project = getProject(task.project_id);
                  const isDone = task.status === 'done';
                  const colorConfig = PROJECT_COLORS[task.project_id] || PROJECT_COLORS.default;

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => onTaskClick(task)}
                      className="p-3.5 rounded-2xl bg-[#181a20]/90 hover:bg-[#1f222a] border border-white/[0.07] hover:border-white/20 transition-all cursor-pointer group shadow-sm"
                    >
                      {/* Project Tag Dot */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 truncate">
                          <span className={`w-2 h-2 rounded-full ${colorConfig.dot}`} />
                          <span className="truncate">{project?.title || 'General'}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <div className="flex items-start gap-2 mb-2.5">
                        {isDone && (
                          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        )}
                        <h4 className={`text-xs font-semibold leading-snug transition-colors ${
                          isDone ? 'text-slate-300 line-through' : 'text-white group-hover:text-blue-300'
                        }`}>
                          {task.title}
                        </h4>
                      </div>

                      {/* Progress Bar (if in progress or subtasks exist) */}
                      {task.status !== 'backlog' && task.estimate_hours > 0 && (
                        <div className="flex items-center gap-2 mb-2.5">
                          <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                isDone ? 'bg-blue-400' : 'bg-gradient-to-r from-orange-400 to-amber-500'
                              }`} 
                              style={{ width: isDone ? '100%' : `${Math.min(100, (task.spent_hours / task.estimate_hours) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {isDone ? '3/3' : '2/3'}
                          </span>
                        </div>
                      )}

                      {/* Footer: Due date, Priority flag, Assignee avatar */}
                      <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            {task.due_date ? task.due_date.slice(5) : 'Nov 7'}
                          </span>
                          <span className="flex items-center gap-0.5 text-[10px] text-slate-500">
                            <MessageSquare className="w-2.5 h-2.5" />
                            1
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {task.priority === 'urgent' && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              🚩 Urgent
                            </span>
                          )}
                          {task.priority === 'high' && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                              High
                            </span>
                          )}

                          {task.assignee_avatar ? (
                            <img
                              src={task.assignee_avatar}
                              alt={task.assignee_name}
                              className="w-5 h-5 rounded-full object-cover border border-white/20"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold flex items-center justify-center">
                              {task.assignee_name.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
