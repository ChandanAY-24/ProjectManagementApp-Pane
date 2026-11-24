import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Calendar as CalendarIcon, 
  Sparkles, 
  ArrowRight, 
  X,
  Play
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SearchItem } from '../types';
import { api } from '../services/api';

interface CommandPaletteProps {
  onSelectTask?: (taskId: string) => void;
  onSelectProject?: (projectId: string) => void;
  onSelectTab?: (tab: 'kanban' | 'calendar' | 'team' | 'projects' | 'analytics') => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  onSelectTask,
  onSelectProject,
  onSelectTab
}) => {
  const { 
    isCmdKOpen, 
    setIsCmdKOpen, 
    setTriggerNewTaskModal, 
    setActiveFocusTask,
    setIsFocusCapsuleOpen,
    setTheme
  } = useTheme();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCmdKOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCmdKOpen]);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const data = await api.searchGlobal(query);
        setResults(data);
        setSelectedIndex(0);
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => clearTimeout(timeout);
  }, [query]);

  // Built-in Quick Actions when query is empty or matched
  const quickActions = [
    {
      id: 'act-new-task',
      title: 'Create New Task',
      subtitle: 'Open task creation drawer with priority and estimation',
      type: 'action' as const,
      icon: CheckSquare,
      run: () => {
        setIsCmdKOpen(false);
        setTriggerNewTaskModal(true);
      }
    },
    {
      id: 'act-focus-start',
      title: 'Start 25m Deep Work Sprint',
      subtitle: 'Open and focus with ambient soundscape',
      type: 'action' as const,
      icon: Play,
      run: () => {
        setIsCmdKOpen(false);
        setIsFocusCapsuleOpen(true);
        setActiveFocusTask({ title: 'Uninterrupted Sprint' });
      }
    },
    {
      id: 'act-theme-cyber',
      title: 'Switch Theme to Cyber Twilight',
      subtitle: 'Obsidian with neon blue and magenta nebulae',
      type: 'action' as const,
      icon: Sparkles,
      run: () => {
        setTheme('cyber');
        setIsCmdKOpen(false);
      }
    },
    {
      id: 'act-theme-aurora',
      title: 'Switch Theme to Aurora Deep',
      subtitle: 'Deep indigo and luminous cyan gradients',
      type: 'action' as const,
      icon: Sparkles,
      run: () => {
        setTheme('aurora');
        setIsCmdKOpen(false);
      }
    },
    {
      id: 'act-view-calendar',
      title: 'Open Studio Calendar',
      subtitle: 'View upcoming reviews, sprints, and events',
      type: 'action' as const,
      icon: CalendarIcon,
      run: () => {
        onSelectTab?.('calendar');
        setIsCmdKOpen(false);
      }
    },
    {
      id: 'act-view-team',
      title: 'Open Team Capacity Directory',
      subtitle: 'Inspect team workload and availability meters',
      type: 'action' as const,
      icon: Users,
      run: () => {
        onSelectTab?.('team');
        setIsCmdKOpen(false);
      }
    }
  ];

  const totalItemsCount = query.trim() ? results.length : quickActions.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalItemsCount));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalItemsCount) % Math.max(1, totalItemsCount));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeSelectedItem();
    }
  };

  const executeSelectedItem = () => {
    if (query.trim() && results[selectedIndex]) {
      const item = results[selectedIndex];
      if (item.type === 'task') {
        onSelectTask?.(item.id);
        onSelectTab?.('kanban');
      } else if (item.type === 'project') {
        onSelectProject?.(item.id);
        onSelectTab?.('projects');
      } else if (item.type === 'member') {
        onSelectTab?.('team');
      } else if (item.type === 'event') {
        onSelectTab?.('calendar');
      }
      setIsCmdKOpen(false);
    } else if (!query.trim() && quickActions[selectedIndex]) {
      quickActions[selectedIndex].run();
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <FolderKanban className="w-4 h-4 text-cyan-400" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-indigo-400" />;
      case 'member':
        return <Users className="w-4 h-4 text-emerald-400" />;
      case 'event':
        return <CalendarIcon className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-400" />;
    }
  };

  if (!isCmdKOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsCmdKOpen(false)}
    >
      <div 
        className="relative w-full max-w-2xl rounded-2xl glass-panel border border-white/20 shadow-2xl bg-slate-900/90 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search tasks, projects, people, events..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0" />
          )}
          <button
            onClick={() => setIsCmdKOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results / Suggestions List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {query.trim() === '' ? (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Quick Studio Actions
              </div>
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                const isSelected = selectedIndex === idx;
                return (
                  <div
                    key={action.id}
                    onClick={action.run}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                        : 'text-slate-300 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/10 text-cyan-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{action.title}</div>
                        <div className="text-xs text-slate-400">{action.subtitle}</div>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-cyan-400 opacity-100' : 'opacity-0'} transition-opacity`} />
                  </div>
                );
              })}
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Search Results ({results.length})
              </div>
              {results.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <div
                    key={item.id}
                    onClick={executeSelectedItem}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                        : 'text-slate-300 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/10">
                        {getItemIcon(item.type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white flex items-center gap-2">
                          <span>{item.title}</span>
                          <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                            {item.type}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">{item.subtitle}</div>
                      </div>
                    </div>
                    {item.meta && (
                      <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                        {item.meta}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              No matching tasks, projects, members, or events found for "{query}".
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-white/10 bg-black/30 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="px-1 bg-white/10 rounded font-mono">↑</kbd> <kbd className="px-1 bg-white/10 rounded font-mono">↓</kbd> to navigate</span>
            <span><kbd className="px-1 bg-white/10 rounded font-mono">↵</kbd> to select</span>
          </div>
          <span><kbd className="px-1 bg-white/10 rounded font-mono">esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};
