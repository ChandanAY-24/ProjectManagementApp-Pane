import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemePreset } from '../types';

interface ThemeContextType {
  theme: ThemePreset;
  setTheme: (theme: ThemePreset) => void;
  soundscapeMode: 'mute' | 'alpha' | 'rain' | 'white';
  setSoundscapeMode: (mode: 'mute' | 'alpha' | 'rain' | 'white') => void;
  isFocusCapsuleOpen: boolean;
  setIsFocusCapsuleOpen: (open: boolean) => void;
  activeFocusTask: { id?: string; title?: string } | null;
  setActiveFocusTask: (task: { id?: string; title?: string } | null) => void;
  isCmdKOpen: boolean;
  setIsCmdKOpen: (open: boolean) => void;
  triggerNewTaskModal: boolean;
  setTriggerNewTaskModal: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemePreset>(() => {
    return (localStorage.getItem('glassflow_theme') as ThemePreset) || 'aurora';
  });

  const [soundscapeMode, setSoundscapeMode] = useState<'mute' | 'alpha' | 'rain' | 'white'>('mute');
  const [isFocusCapsuleOpen, setIsFocusCapsuleOpen] = useState(true);
  const [activeFocusTask, setActiveFocusTask] = useState<{ id?: string; title?: string } | null>(null);
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [triggerNewTaskModal, setTriggerNewTaskModal] = useState(false);

  const setTheme = (newTheme: ThemePreset) => {
    setThemeState(newTheme);
    localStorage.setItem('glassflow_theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdKOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCmdKOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        soundscapeMode,
        setSoundscapeMode,
        isFocusCapsuleOpen,
        setIsFocusCapsuleOpen,
        activeFocusTask,
        setActiveFocusTask,
        isCmdKOpen,
        setIsCmdKOpen,
        triggerNewTaskModal,
        setTriggerNewTaskModal,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
