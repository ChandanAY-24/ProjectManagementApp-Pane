import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Trash2,
  X
} from 'lucide-react';
import { CalendarEvent, Project } from '../types';
import { api } from '../services/api';

interface CalendarViewProps {
  events: CalendarEvent[];
  projects: Project[];
  onRefresh: () => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  sprint: { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  meeting: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
  milestone: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30' },
  focus: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  review: { bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/30' },
};

export const CalendarView: React.FC<CalendarViewProps> = ({ events, projects: _projects, onRefresh }) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    () => new Date().toISOString().split('T')[0]
  );
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Form states for new event
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventDate, setEventDate] = useState(selectedDateStr);
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('12:00');
  const [category, setCategory] = useState<'sprint' | 'meeting' | 'milestone' | 'focus' | 'review'>('meeting');
  const [attendees, setAttendees] = useState('');
  const [loading, setLoading] = useState(false);

  // Calendar math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDateStr(dateStr);
    setEventDate(dateStr);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    try {
      setLoading(true);
      await api.createCalendarEvent({
        title: eventTitle,
        description: eventDesc,
        date: eventDate,
        start_time: startTime,
        end_time: endTime,
        category,
        attendees
      });
      setIsEventModalOpen(false);
      setEventTitle('');
      setEventDesc('');
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Delete this calendar event?')) {
      try {
        await api.deleteCalendarEvent(id);
        onRefresh();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const selectedDayEvents = events.filter(e => e.date === selectedDateStr);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Calendar Grid Container */}
      <div className="flex-1 rounded-2xl glass-panel p-5 border border-white/10 bg-slate-950/40 backdrop-blur-xl flex flex-col">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 rounded-lg text-xs font-medium glass-pill text-slate-300 hover:text-white"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg glass-pill text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg glass-pill text-slate-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setEventDate(selectedDateStr);
                setIsEventModalOpen(true);
              }}
              className="flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 border border-cyan-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Event</span>
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-slate-400">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Days Matrix */}
        <div className="grid grid-cols-7 gap-2 flex-1 auto-rows-fr">
          {/* Leading empty days */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2 rounded-xl bg-white/[0.01] border border-white/5 opacity-30" />
          ))}

          {/* Month days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = selectedDateStr === dateStr;
            const dayEvents = events.filter(e => e.date === dateStr);
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <div
                key={`day-${day}`}
                onClick={() => handleDayClick(day)}
                className={`min-h-[75px] sm:min-h-[90px] p-2 rounded-xl cursor-pointer transition-all flex flex-col justify-between border ${
                  isSelected
                    ? 'border-cyan-400/60 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                    : 'border-white/10 hover:border-white/25 bg-white/[0.03] hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${
                    isToday ? 'w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold' : 'text-slate-300'
                  }`}>
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] font-mono text-cyan-300 font-bold">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                {/* Event Pills */}
                <div className="space-y-1 mt-1 overflow-hidden">
                  {dayEvents.slice(0, 2).map(ev => {
                    const style = CATEGORY_COLORS[ev.category] || CATEGORY_COLORS.meeting;
                    return (
                      <div
                        key={ev.id}
                        className={`px-1.5 py-0.5 rounded text-[10px] truncate font-medium border ${style.bg} ${style.text} ${style.border}`}
                      >
                        {ev.start_time} {ev.title}
                      </div>
                    );
                  })}
                  {dayEvents.length > 2 && (
                    <span className="text-[9px] text-slate-400 pl-1">
                      +{dayEvents.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Drawer */}
      <div className="w-full lg:w-80 rounded-2xl glass-panel p-5 border border-white/10 bg-slate-950/40 backdrop-blur-xl flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Daily Agenda</h3>
            <p className="text-xs text-slate-400">{selectedDateStr}</p>
          </div>
          <button
            onClick={() => {
              setEventDate(selectedDateStr);
              setIsEventModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-all"
            title="Add event on this date"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px]">
          {selectedDayEvents.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No events scheduled for this day. Click "+" to create one.
            </div>
          ) : (
            selectedDayEvents.map(ev => {
              const style = CATEGORY_COLORS[ev.category] || CATEGORY_COLORS.meeting;
              return (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl glass-card border border-white/10 hover:border-white/20 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
                      {ev.category}
                    </span>
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 transition-all"
                      title="Delete event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-sm font-medium text-white mb-1">
                    {ev.title}
                  </h4>
                  {ev.description && (
                    <p className="text-xs text-slate-400 mb-2">
                      {ev.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {ev.start_time} - {ev.end_time}
                    </span>
                    {ev.attendees && (
                      <span className="flex items-center gap-1 text-[11px] truncate max-w-[120px]">
                        <Users className="w-3 h-3 text-indigo-400" />
                        {ev.attendees}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Schedule Event Modal */}
      {isEventModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsEventModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl glass-panel border border-white/20 shadow-2xl bg-slate-900/90 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-cyan-400" />
                Schedule Studio Event
              </h3>
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Design Critique & Token Review"
                  className="w-full px-3 py-2 glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 glass-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 glass-input text-xs bg-slate-900"
                >
                  <option value="sprint">Sprint Review</option>
                  <option value="meeting">Team Meeting / Sync</option>
                  <option value="milestone">Milestone Release</option>
                  <option value="focus">Focus Work Block</option>
                  <option value="review">Design Crit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Attendees</label>
                <input
                  type="text"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  placeholder="e.g. Elena Rostova, Marcus Chen"
                  className="w-full px-3 py-2 glass-input text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20"
                >
                  {loading ? 'Saving...' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
