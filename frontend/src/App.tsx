import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Sidebar, ActiveNavTab } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { HomeView } from './components/HomeView';
import { KanbanBoard } from './components/KanbanBoard';
import { CalendarView } from './components/CalendarView';
import { ProjectsView } from './components/ProjectsView';
import { InsightsView } from './components/InsightsView';
import { TeamDirectory } from './components/TeamDirectory';
import { SettingsView } from './components/SettingsView';
import { TaskModal } from './components/TaskModal';
import { CommandPalette } from './components/CommandPalette';
import { Project, Task, TeamMember, CalendarEvent, FocusSession, FocusSummary, TaskStatus } from './types';
import { api } from './services/api';

const MainShell: React.FC = () => {
  const { triggerNewTaskModal, setTriggerNewTaskModal } = useTheme();

  const [activeTab, setActiveTab] = useState<ActiveNavTab>('home');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [_focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [focusSummary, setFocusSummary] = useState<FocusSummary | null>(null);

  const [_loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [p, t, tm, ev, fs, fsum] = await Promise.all([
        api.getProjects(),
        api.getTasks(),
        api.getTeam(),
        api.getCalendarEvents(),
        api.getFocusSessions(),
        api.getFocusSummary()
      ]);
      setProjects(p);
      setTasks(t);
      setTeam(tm);
      setEvents(ev);
      setFocusSessions(fs);
      setFocusSummary(fsum);
    } catch (e) {
      console.error('Error loading studio data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (triggerNewTaskModal) {
      setSelectedTask(null);
      setIsTaskModalOpen(true);
      setTriggerNewTaskModal(false);
    }
  }, [triggerNewTaskModal, setTriggerNewTaskModal]);

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleNewTaskWithStatus = (status?: TaskStatus) => {
    setSelectedTask(status ? ({ status } as any) : null);
    setIsTaskModalOpen(true);
  };

  // Header metadata based on current active tab
  const getHeaderMeta = () => {
    switch (activeTab) {
      case 'home':
        return {
          title: 'Good morning, Lin',
          subtitle: 'Friday, October 16 · 4 meetings and 6 tasks left today',
          metricPills: [
            { label: 'Done today', value: '3/8' },
            { label: 'Focus today', value: '1.1h', accent: 'text-amber-300' },
            { label: 'Overdue', value: '0' },
          ],
          primaryText: '+ New task',
          onPrimaryClick: () => handleNewTaskWithStatus('backlog')
        };
      case 'tasks':
        return {
          title: 'Tasks',
          subtitle: '31 open across 5 projects',
          metricPills: [
            { label: 'Open', value: 31 },
            { label: 'Due this week', value: 11 },
            { label: 'Overdue', value: 0 },
            { label: 'Done this week', value: 26, accent: 'text-emerald-400' },
          ],
          primaryText: '+ New task',
          onPrimaryClick: () => handleNewTaskWithStatus('backlog'),
          showViewToggle: true
        };
      case 'calendar':
        return {
          title: 'Calendar',
          subtitle: 'October 2026 · 14 events scheduled',
          metricPills: [
            { label: 'Upcoming crits', value: 3 },
            { label: 'Focus sprints', value: 5, accent: 'text-cyan-300' },
            { label: 'Milestones', value: 2, accent: 'text-purple-300' },
          ],
          primaryText: 'Schedule Event',
          onPrimaryClick: () => {}
        };
      case 'projects':
        return {
          title: 'Orbit 2.0 launch',
          subtitle: 'Everything the public sees on launch day: site, film, press kit and the waitlist email.',
          metricPills: [
            { label: 'Progress', value: '45%', accent: 'text-purple-300' },
            { label: 'Open tasks', value: 6 },
            { label: 'Done', value: 5, accent: 'text-emerald-400' },
            { label: 'Days left', value: 13, accent: 'text-amber-300' },
          ],
          primaryText: 'New event',
          onPrimaryClick: () => {}
        };
      case 'insights':
        return {
          title: 'Insights',
          subtitle: 'How the team worked over the last 90 days',
          metricPills: [
            { label: 'Completed', value: 205, accent: 'text-emerald-400' },
            { label: 'On-time rate', value: '95%', accent: 'text-blue-300' },
            { label: 'Focus hours', value: '470h', accent: 'text-amber-300' },
            { label: 'Avg cycle time', value: '4.0d' },
          ],
          primaryText: 'Export CSV',
          onPrimaryClick: () => {}
        };
      case 'team':
        return {
          title: 'Team',
          subtitle: '12 people · 4 teams',
          metricPills: [
            { label: 'Online now', value: '9/12', accent: 'text-emerald-400' },
            { label: 'In focus', value: 2, accent: 'text-purple-300' },
            { label: 'Average load', value: '32%', accent: 'text-cyan-300' },
          ],
          primaryText: 'Invite',
          onPrimaryClick: () => {}
        };
      case 'settings':
        return {
          title: 'Settings',
          subtitle: 'Workspace preferences, themes, soundscapes and data',
          metricPills: [],
          primaryText: ''
        };
    }
  };

  const meta = getHeaderMeta();

  return (
    <div className="min-h-screen bg-[#0d0f14] text-slate-100 flex p-4 gap-5">
      {/* Left Glass Floating Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        taskCount={tasks.filter(t => t.status !== 'done').length}
      />

      {/* Main Studio Viewport */}
      <div className="flex-1 flex flex-col min-w-0 max-h-[calc(100vh-2rem)] overflow-y-auto pr-1">
        {/* Top Header Bar */}
        <TopBar
          title={meta.title}
          subtitle={meta.subtitle}
          metricPills={meta.metricPills}
          primaryButtonText={meta.primaryText}
          onPrimaryClick={meta.onPrimaryClick}
          showViewToggle={meta.showViewToggle}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Content Tabs */}
        <main className="flex-1 pb-8">
          {activeTab === 'home' && (
            <HomeView
              tasks={tasks}
              projects={projects}
              events={events}
              focusSummary={focusSummary}
              onNavigateTab={setActiveTab}
              onOpenTask={handleOpenTask}
            />
          )}

          {activeTab === 'tasks' && (
            <KanbanBoard
              tasks={tasks}
              projects={projects}
              team={team}
              onTaskClick={handleOpenTask}
              onAddTask={handleNewTaskWithStatus}
              onRefresh={loadData}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              events={events}
              projects={projects}
              onRefresh={loadData}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              tasks={tasks}
              onRefresh={loadData}
              onAddTask={() => handleNewTaskWithStatus('backlog')}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsView />
          )}

          {activeTab === 'team' && (
            <TeamDirectory
              team={team}
              onRefresh={loadData}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Task Drawer / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        projects={projects}
        team={team}
        onTaskSaved={loadData}
        onTaskDeleted={loadData}
      />

      {/* Cmd+K Omnibar Search */}
      <CommandPalette
        onSelectTask={(id) => {
          const t = tasks.find(x => x.id === id);
          if (t) handleOpenTask(t);
        }}
        onSelectTab={(tab) => {
          if (tab === 'kanban') setActiveTab('tasks');
          else if (tab === 'analytics') setActiveTab('insights');
          else setActiveTab(tab as any);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <MainShell />
    </ThemeProvider>
  );
}
