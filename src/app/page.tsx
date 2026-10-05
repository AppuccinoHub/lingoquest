'use client';

import React, { useState } from 'react';
import { LessonPlan } from '@/types/actfl';
import { SAMPLE_LESSONS } from '@/lib/sampleLessons';
import { 
  Sparkles, 
  BookOpen, 
  Gamepad2, 
  Layers, 
  Download, 
  Volume2, 
  SlidersHorizontal,
  Flame,
  Award,
  Zap,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import LessonStudio from '@/components/LessonStudio';
import GamifiedArcade from '@/components/GamifiedArcade';
import MaterialsLibrary from '@/components/MaterialsLibrary';
import ClassroomKit from '@/components/ClassroomKit';
import VoiceCoachSettingsModal from '@/components/VoiceCoachSettingsModal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'studio' | 'arcade' | 'materials' | 'classroom'>('arcade');
  const [lessons, setLessons] = useState<LessonPlan[]>(SAMPLE_LESSONS);
  const [currentLessonId, setCurrentLessonId] = useState<string>(SAMPLE_LESSONS[0].id);
  const [xp, setXp] = useState<number>(380);
  const [streak, setStreak] = useState<number>(4);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [whisperModeActive, setWhisperModeActive] = useState<boolean>(true);

  const activeLesson = lessons.find(l => l.id === currentLessonId) || lessons[0];

  const handleEarnXP = (amount: number) => {
    setXp(prev => prev + amount);
  };

  const handleUpdateLesson = (updatedLesson: LessonPlan) => {
    setLessons(prev => prev.map(l => l.id === updatedLesson.id ? updatedLesson : l));
  };

  const handleCreateNewLesson = (newLesson: LessonPlan) => {
    setLessons(prev => [newLesson, ...prev]);
    setCurrentLessonId(newLesson.id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 text-white font-black text-xl">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    LinguaQuest <span className="text-amber-400 font-mono text-sm px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">ACTFL</span>
                  </span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                    Low-Anxiety Speaking
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Teacher Lesson Generator & Gamified Speaking Arcades
                </p>
              </div>
            </div>

            {/* Mobile lesson selector */}
            <div className="sm:hidden">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Lesson Switcher dropdown in header */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400 font-medium">Active Unit:</span>
              <select
                aria-label="Active Unit"
                value={currentLessonId}
                onChange={(e) => setCurrentLessonId(e.target.value)}
                className="bg-transparent font-semibold text-slate-100 focus:outline-none cursor-pointer max-w-[180px] sm:max-w-[220px] truncate"
              >
                {lessons.map(l => (
                  <option key={l.id} value={l.id} className="bg-slate-900 text-slate-100">
                    {l.title} ({l.targetLanguage})
                  </option>
                ))}
              </select>
            </div>

            {/* Gamification Stats: Streak & XP */}
            <div className="flex items-center gap-2 ml-auto">
              <div 
                title="Daily streak keeps speaking anxiety low with small micro-doses!"
                className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-xl text-xs font-bold"
              >
                <Flame className="w-3.5 h-3.5 fill-amber-400 animate-pulse" />
                <span>{streak}d</span>
              </div>

              <div 
                title="Class & Student XP: Unlocks new low-pressure avatar badges"
                className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-xl text-xs font-bold"
              >
                <Zap className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
                <span>{xp} XP</span>
              </div>

              {/* Low-Anxiety Mode Toggle Pill */}
              <button
                onClick={() => setWhisperModeActive(!whisperModeActive)}
                className={`hidden md:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl border transition-all ${
                  whisperModeActive 
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/20' 
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title="Whisper & Robot Mode: Audio pitch shifting & soft threshold for shy speakers"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>🤫 Shy Mode: {whisperModeActive ? 'ON' : 'OFF'}</span>
              </button>

              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="hidden sm:flex items-center gap-1.5 p-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Audio/Voice</span>
              </button>
            </div>

          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-1 border-t border-slate-800/80 pt-2.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('arcade')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'arcade'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>🎮 Kids Speaking Arcade</span>
            <span className="text-[10px] bg-purple-400/20 text-purple-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
              Low-Anxiety
            </span>
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'studio'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>✨ Teacher ACTFL Studio</span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-full font-bold">
              1-Click AI
            </span>
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'materials'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>📚 Supplemental Materials Library</span>
            <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-full font-semibold">
              {activeLesson.materials.length} generated
            </span>
          </button>

          <button
            onClick={() => setActiveTab('classroom')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'classroom'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>🖨️ Export & Projector Mode</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {activeTab === 'arcade' && (
          <GamifiedArcade 
            lesson={activeLesson}
            onEarnXP={handleEarnXP}
            whisperModeActive={whisperModeActive}
          />
        )}

        {activeTab === 'studio' && (
          <LessonStudio 
            activeLesson={activeLesson}
            onUpdateLesson={handleUpdateLesson}
            onCreateLesson={handleCreateNewLesson}
            onSwitchToMaterials={() => setActiveTab('materials')}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialsLibrary 
            lesson={activeLesson}
            onUpdateLesson={handleUpdateLesson}
            onLaunchInArcade={() => setActiveTab('arcade')}
          />
        )}

        {activeTab === 'classroom' && (
          <ClassroomKit 
            lesson={activeLesson}
          />
        )}
      </main>

      {/* Floating Shy Mode / Teacher Info banner */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-4 px-6 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
          <span>
            <strong>ACTFL Aligned:</strong> World-Readiness Standards (5 C&apos;s: Communication, Cultures, Connections, Comparisons, Communities).
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Target Level: <strong className="text-slate-200">{activeLesson.level}</strong></span>
          <span>•</span>
          <span>Affective Filter: <strong className="text-emerald-400">Ultra-Low (Gamified)</strong></span>
          <span>•</span>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="text-indigo-400 hover:underline flex items-center gap-1"
          >
            <SlidersHorizontal className="w-3 h-3" /> Voice & Audio Controls
          </button>
        </div>
      </footer>

      {/* Voice Coach & Audio Settings Modal */}
      {isSettingsOpen && (
        <VoiceCoachSettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)}
          whisperModeActive={whisperModeActive}
          setWhisperModeActive={setWhisperModeActive}
        />
      )}
    </div>
  );
}
