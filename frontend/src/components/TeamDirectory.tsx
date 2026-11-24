import React, { useState } from 'react';
import { 
  MessageSquare, 
  UserPlus, 
  CheckCircle2,
  Sun
} from 'lucide-react';
import { TeamMember } from '../types';

interface TeamDirectoryProps {
  team: TeamMember[];
  onRefresh: () => void;
}

export const TeamDirectory: React.FC<TeamDirectoryProps> = ({ team: _team }) => {
  const [selectedDept, setSelectedDept] = useState<'All' | 'Product' | 'Design' | 'Engineering' | 'Marketing'>('Design');

  const depts = ['All', 'Product', 'Design', 'Engineering', 'Marketing'] as const;

  const mockTeamMembers = [
    {
      id: 'm1',
      name: 'Nia Okoro',
      role: 'Design Lead',
      department: 'Design',
      status: 'in_focus' as const,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160',
      time: '11:41 AM Lagos · 1h ahead',
      allocated: 7,
      capacity: 32,
      openTasks: 2,
    },
    {
      id: 'm2',
      name: 'Elise Marchand',
      role: 'Product Designer',
      department: 'Design',
      status: 'online' as const,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160',
      time: '11:41 AM Lyon · 1h ahead',
      allocated: 28,
      capacity: 36,
      openTasks: 5,
    },
    {
      id: 'm3',
      name: 'Freya Nilsen',
      role: 'Brand Designer',
      department: 'Design',
      status: 'away' as const,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160',
      time: '11:41 AM Bergen · 1h ahead',
      allocated: 17,
      capacity: 32,
      openTasks: 4,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Department Filter Pills */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#181a20]/90 border border-white/[0.08]">
          {depts.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDept(d)}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
                selectedDept === d
                  ? 'bg-white/20 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500 hover:bg-blue-400 text-white text-xs font-medium transition-all shadow-sm">
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockTeamMembers.map(member => (
          <div
            key={member.id}
            className="p-5 rounded-3xl bg-[#14161c]/85 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between hover:border-white/20 transition-all shadow-sm"
          >
            {/* Top row */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <img src={member.avatar} className="w-10 h-10 rounded-full object-cover border border-white/20" />
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#14161c] ${
                    member.status === 'in_focus' ? 'bg-purple-500' : member.status === 'online' ? 'bg-emerald-400' : 'bg-slate-400'
                  }`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{member.name}</h4>
                  <p className="text-[11px] text-slate-400">{member.role}</p>
                </div>
              </div>

              {/* Department pill */}
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                <span>{member.department}</span>
              </div>

              {/* Status and Time */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-4 pb-3 border-b border-white/[0.08]">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  member.status === 'in_focus' ? 'bg-purple-400' : member.status === 'online' ? 'bg-emerald-400' : 'bg-slate-400'
                }`} />
                <span className="capitalize text-slate-300 font-medium">
                  {member.status === 'in_focus' ? 'In focus' : member.status}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
                  <Sun className="w-3 h-3 text-amber-400" />
                  {member.time}
                </span>
              </div>

              {/* Workload Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 text-[11px]">Workload</span>
                  <span className="font-mono text-slate-300 font-semibold text-[11px]">{member.allocated}h / {member.capacity}h</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-emerald-400" 
                    style={{ width: `${(member.allocated / member.capacity) * 100}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] text-xs">
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                {member.openTasks} open tasks
              </span>

              <div className="flex items-center gap-1.5">
                <button className="px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 text-xs font-medium transition-all">
                  Profile
                </button>
                <button className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-all">
                  <MessageSquare className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
