import React, { useState, useEffect } from 'react';
import { X, Trash2, Calendar, Clock, Tag, User, FolderKanban, AlertCircle } from 'lucide-react';
import { Task, Project, TeamMember, TaskPriority, TaskStatus } from '../types';
import { api } from '../services/api';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  projects: Project[];
  team: TeamMember[];
  onTaskSaved: () => void;
  onTaskDeleted?: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  projects,
  team,
  onTaskSaved,
  onTaskDeleted
}) => {
  const isEditing = Boolean(task?.id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState<TaskStatus>('backlog');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [estimateHours, setEstimateHours] = useState(4);
  const [spentHours, setSpentHours] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setProjectId(task.project_id || (projects[0]?.id ?? ''));
      setStatus(task.status || 'backlog');
      setPriority(task.priority || 'medium');
      const foundMember = team.find(m => m.name === task.assignee_name);
      setAssigneeId(foundMember ? foundMember.id : (team[0]?.id ?? ''));
      setEstimateHours(task.estimate_hours || 4);
      setSpentHours(task.spent_hours || 0);
      setDueDate(task.due_date || '');
      setTags(task.tags || '');
    } else {
      setTitle('');
      setDescription('');
      setProjectId(projects[0]?.id || '');
      setStatus('backlog');
      setPriority('medium');
      setAssigneeId(team[0]?.id || '');
      setEstimateHours(4);
      setSpentHours(0);
      setDueDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
      setTags('UI,Feature');
    }
    setError('');
  }, [task, isOpen, projects, team]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    const selectedMember = team.find(m => m.id === assigneeId) || team[0];

    const taskPayload = {
      title,
      description,
      project_id: projectId || projects[0]?.id || 'proj-1',
      status,
      priority,
      assignee_name: selectedMember?.name || 'Elena Rostova',
      assignee_avatar: selectedMember?.avatar || '',
      assignee_role: selectedMember?.role || 'Designer',
      estimate_hours: Number(estimateHours),
      spent_hours: Number(spentHours),
      due_date: dueDate,
      tags
    };

    try {
      setLoading(true);
      if (isEditing && task?.id) {
        await api.updateTask(task.id, taskPayload);
      } else {
        await api.createTask(taskPayload);
      }
      onTaskSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task?.id) return;
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await api.deleteTask(task.id);
        onTaskDeleted?.();
        onClose();
      } catch (err: any) {
        setError(err.message || 'Failed to delete task');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl rounded-2xl glass-panel border border-white/20 shadow-2xl bg-slate-900/90 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-white">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all text-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement liquid glass button specular reflection"
              className="w-full px-3.5 py-2 glass-input text-sm"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide technical requirements, criteria, or context..."
              className="w-full px-3.5 py-2 glass-input text-sm resize-none"
            />
          </div>

          {/* Project & Assignee Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 glass-input text-sm bg-slate-900"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 glass-input text-sm bg-slate-900"
              >
                {team.map((m) => (
                  <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                    {m.name} ({m.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Status Column
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 glass-input text-sm bg-slate-900"
              >
                <option value="backlog" className="bg-slate-900">Backlog</option>
                <option value="in_progress" className="bg-slate-900">In Progress</option>
                <option value="in_review" className="bg-slate-900">In Review</option>
                <option value="done" className="bg-slate-900">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 glass-input text-sm bg-slate-900"
              >
                <option value="low" className="bg-slate-900">Low</option>
                <option value="medium" className="bg-slate-900">Medium</option>
                <option value="high" className="bg-slate-900">High</option>
                <option value="urgent" className="bg-slate-900">Urgent</option>
              </select>
            </div>
          </div>

          {/* Estimation & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Est. Hours
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={estimateHours}
                onChange={(e) => setEstimateHours(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Spent Hours
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={spentHours}
                onChange={(e) => setSpentHours(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 glass-input text-sm"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-purple-400" />
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. DesignTokens, CSS, Refraction"
              className="w-full px-3.5 py-2 glass-input text-sm"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 text-xs font-medium transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Task</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 text-xs font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 border border-cyan-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Task')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
