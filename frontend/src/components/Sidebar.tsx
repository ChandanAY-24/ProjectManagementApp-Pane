import React from 'react';
import { 
  Home, 
  CheckSquare, 
  Calendar, 
  FolderKanban, 
  BarChart2, 
  Users, 
  Settings, 
  ChevronDown,
  Layers
} from 'lucide-react';

export type ActiveNavTab = 'home' | 'tasks' | 'calendar' | 'projects' | 'insights' | 'team' | 'settings';

interface SidebarProps {
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  taskCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, taskCount = 6 }) => {
  const navItems = [
    { id: 'home' as ActiveNavTab, label: 'Home', icon: Home },
    { id: 'tasks' as ActiveNavTab, label: 'Tasks', icon: CheckSquare, badge: taskCount },
    { id: 'calendar' as ActiveNavTab, label: 'Calendar', icon: Calendar },
    { id: 'projects' as ActiveNavTab, label: 'Projects', icon: FolderKanban },
    { id: 'insights' as ActiveNavTab, label: 'Insights', icon: BarChart2 },
    { id: 'team' as ActiveNavTab, label: 'Team', icon: Users },
    { id: 'settings' as ActiveNavTab, label: 'Settings', icon: Settings },
  ];

  const pinnedProjects = [
    { id: 'tide', name: 'Tide mobile app', color: 'bg-blue-500' },
    { id: 'orbit', name: 'Orbit 2.0 launch', color: 'bg-purple-500' },
  ];

  return (
    <aside className="w-56 shrink-0 h-[calc(100vh-2rem)] sticky top-4 flex flex-col justify-between p-3.5 rounded-3xl bg-[#13151b]/80 backdrop-blur-2xl border border-white/[0.08] shadow-2xl text-slate-300 select-none">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-2.5 px-3 py-2 mb-4 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/20">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">
            GlassFlow
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/[0.12] text-white font-semibold shadow-xs border border-white/[0.15]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10 text-slate-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Pinned Projects Section */}
        <div className="mt-6 px-3">
          <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-2">
            Pinned
          </div>
          <div className="space-y-2">
            {pinnedProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => setActiveTab('projects')}
                className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-white cursor-pointer py-1 transition-colors"
              >
                <span className={`w-2 h-2 rounded-full ${p.color}`} />
                <span className="truncate">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="pt-3 border-t border-white/[0.08] px-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="Lin Zhao"
              className="w-7 h-7 rounded-full object-cover border border-white/20"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-white leading-tight">Lin Zhao</span>
            <span className="text-[10px] text-slate-400 leading-tight">Product Lead</span>
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-white" />
      </div>
    </aside>
  );
};
