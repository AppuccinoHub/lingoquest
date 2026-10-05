'use client';

import React, { useState } from 'react';
import { LessonPlan, SupplementalMaterial } from '@/types/actfl';
import { generateDozensMaterials } from '@/lib/materialsGenerator';
import { 
  Sparkles, 
  Layers, 
  CheckCircle, 
  Plus, 
  FileText, 
  Target, 
  Compass, 
  BookOpen, 
  Cpu, 
  ArrowRight,
  RefreshCw,
  Wand2,
  Trash2
} from 'lucide-react';

interface LessonStudioProps {
  activeLesson: LessonPlan;
  onUpdateLesson: (lesson: LessonPlan) => void;
  onCreateLesson: (lesson: LessonPlan) => void;
  onSwitchToMaterials: () => void;
}

export default function LessonStudio({
  activeLesson,
  onUpdateLesson,
  onCreateLesson,
  onSwitchToMaterials
}: LessonStudioProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationCount, setGenerationCount] = useState<number | null>(null);
  const [newVocabTarget, setNewVocabTarget] = useState('');
  const [newVocabNative, setNewVocabNative] = useState('');
  const [newVocabPhonetic, setNewVocabPhonetic] = useState('');
  const [customTheme, setCustomTheme] = useState(activeLesson.theme);
  const [customCulture, setCustomCulture] = useState(activeLesson.culturalTopic);

  const handleGenerateDozens = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateDozensMaterials(activeLesson);
      
      // Combine with existing non-duplicates
      const existingIds = new Set(activeLesson.materials.map(m => m.title));
      const filtered = generated.filter(g => !existingIds.has(g.title));
      
      const updatedMaterials = [...activeLesson.materials, ...filtered];
      onUpdateLesson({
        ...activeLesson,
        materials: updatedMaterials
      });
      setIsGenerating(false);
      setGenerationCount(filtered.length);
    }, 600);
  };

  const handleAddVocab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVocabTarget.trim() || !newVocabNative.trim()) return;

    const newVocab = {
      target: newVocabTarget.trim(),
      native: newVocabNative.trim(),
      phonetic: newVocabPhonetic.trim() || undefined,
      emoji: '✨'
    };

    onUpdateLesson({
      ...activeLesson,
      coreVocabulary: [...activeLesson.coreVocabulary, newVocab]
    });

    setNewVocabTarget('');
    setNewVocabNative('');
    setNewVocabPhonetic('');
  };

  const handleRemoveVocab = (index: number) => {
    const updated = [...activeLesson.coreVocabulary];
    updated.splice(index, 1);
    onUpdateLesson({
      ...activeLesson,
      coreVocabulary: updated
    });
  };

  const handleSaveThemeChanges = () => {
    onUpdateLesson({
      ...activeLesson,
      theme: customTheme,
      culturalTopic: customCulture
    });
  };

  const handleCreateBlankUnit = (lang: string, level: any) => {
    const newId = `custom-unit-${Date.now()}`;
    const newLesson: LessonPlan = {
      id: newId,
      title: `New ${lang} Exploration Unit`,
      targetLanguage: lang,
      level: level,
      theme: 'Daily Life, Hobbies & Meeting Friends',
      culturalTopic: 'Youth culture and casual greetings',
      essentialQuestions: [
        'How do friends connect and share what they enjoy doing together?',
        'What body language and courteous phrases build trust in the culture?'
      ],
      canDoStatements: [
        {
          id: `cd-${Date.now()}-1`,
          text: 'I can introduce myself and share 2 activities I like to do.',
          mode: 'Interpersonal',
          level: level
        },
        {
          id: `cd-${Date.now()}-2`,
          text: 'I can understand short audio and text invitations from classmates.',
          mode: 'Interpretive',
          level: level
        }
      ],
      coreVocabulary: [
        { target: '¡Hola! ¿Cómo te llamas?', native: 'Hello! What is your name?', emoji: '👋' },
        { target: 'Me gusta mucho...', native: 'I really like...', emoji: '❤️' },
        { target: '¿Quieres jugar hoy?', native: 'Do you want to play today?', emoji: '🎮' },
        { target: '¡Claro que sí!', native: 'Of course yes!', emoji: '👍' }
      ],
      keyPhrases: [
        { target: 'Mucho gusto en conocerte.', english: 'Nice to meet you.' },
        { target: '¿Cuál es tu pasatiempo favorito?', english: 'What is your favorite hobby?' }
      ],
      materials: []
    };

    onCreateLesson(newLesson);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Banner: 1-Click Generator */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 border border-purple-500/30 p-6 lg:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Teacher Co-Pilot Engine
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              Instant ACTFL Curriculum &amp; Dozens of Low-Anxiety Materials
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Feed your lesson theme and key vocabulary. Instantly produce classroom escape rooms, zero-stress bellringers, March Madness vocab brackets, Lego sentence organizers, and low-stakes spy speaking cards.
            </p>

            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-300">
                🎯 <strong>ACTFL Level:</strong> {activeLesson.level}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-300">
                🌐 <strong>Modes:</strong> Interpersonal, Interpretive, Presentational
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-emerald-400">
                🛡️ <strong>Affective Filter:</strong> Shy-speaker friendly
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={handleGenerateDozens}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white font-extrabold text-sm shadow-xl shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating 10+ ACTFL Materials...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Dozens of Materials Now!
                </>
              )}
            </button>

            {activeLesson.materials.length > 0 && (
              <button
                onClick={onSwitchToMaterials}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all"
              >
                <Layers className="w-4 h-4 text-purple-400" />
                <span>View {activeLesson.materials.length} Materials in Library</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            )}
          </div>
        </div>

        {generationCount !== null && (
          <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>
                Generated <strong>{generationCount} new ACTFL supplemental activities</strong>! Includes Escape Room, Vocab Bracket, Bellringers &amp; Whispering Quest cards.
              </span>
            </div>
            <button 
              onClick={onSwitchToMaterials}
              className="underline font-bold hover:text-white"
            >
              Open Library
            </button>
          </div>
        )}
      </div>

      {/* Grid: 2 Columns (Lesson Parameters & Vocab / Standards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Lesson Config & Standards */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Unit Overview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                Unit Scope &amp; ACTFL Goals
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                {activeLesson.targetLanguage}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Theme / Essential Topic</label>
                <input
                  type="text"
                  value={customTheme}
                  onChange={(e) => setCustomTheme(e.target.value)}
                  onBlur={handleSaveThemeChanges}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Cultural Connection (Cultures 5C)</label>
                <input
                  type="text"
                  value={customCulture}
                  onChange={(e) => setCustomCulture(e.target.value)}
                  onBlur={handleSaveThemeChanges}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Essential Questions</label>
                <div className="space-y-1.5">
                  {activeLesson.essentialQuestions.map((eq, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 leading-relaxed italic">
                      &quot;{eq}&quot;
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Template Creator Buttons */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block mb-2">Create New Unit From Scratch:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleCreateBlankUnit('Spanish', 'Novice Mid')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-left font-medium"
                >
                  🇪🇸 Spanish (Novice)
                </button>
                <button
                  onClick={() => handleCreateBlankUnit('French', 'Novice High')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-left font-medium"
                >
                  🇫🇷 French (Novice)
                </button>
                <button
                  onClick={() => handleCreateBlankUnit('German', 'Novice Mid')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-left font-medium"
                >
                  🇩🇪 German (Novice)
                </button>
                <button
                  onClick={() => handleCreateBlankUnit('Japanese', 'Novice Low')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-left font-medium"
                >
                  🇯🇵 Japanese (Novice)
                </button>
              </div>
            </div>
          </div>

          {/* NCSSFL-ACTFL Can-Do Statements */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                NCSSFL-ACTFL Can-Do Targets
              </h2>
              <span className="text-xs text-slate-400">3 Modes</span>
            </div>

            <div className="space-y-2.5">
              {activeLesson.canDoStatements.map((cd) => (
                <div key={cd.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`px-2 py-0.5 rounded-md font-semibold ${
                      cd.mode === 'Interpersonal' 
                        ? 'bg-purple-500/20 text-purple-300' 
                        : cd.mode === 'Interpretive' 
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {cd.mode} Mode
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">{cd.level}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {cd.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 2 Columns: Core Vocabulary & Phrases + Generated Materials Preview */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Vocabulary Manager */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 className="font-bold text-slate-200 text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  Target Vocabulary &amp; High-Frequency Chunks
                </h2>
                <p className="text-xs text-slate-400">
                  These feed directly into games, escape puzzles, brackets, and soundboards.
                </p>
              </div>
              <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-xl">
                {activeLesson.coreVocabulary.length} words loaded
              </span>
            </div>

            {/* Vocab Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeLesson.coreVocabulary.map((v, idx) => (
                <div 
                  key={idx} 
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg shrink-0">{v.emoji || '💬'}</span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-200 text-xs truncate">
                        {v.target}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {v.native} {v.phonetic && <span className="text-slate-400 font-mono">({v.phonetic})</span>}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveVocab(idx)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 transition-opacity"
                    title="Remove word"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add Word Form */}
            <form onSubmit={handleAddVocab} className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Target word/phrase (e.g., ¡Qué rico!)"
                value={newVocabTarget}
                onChange={(e) => setNewVocabTarget(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="English meaning (e.g., How delicious!)"
                value={newVocabNative}
                onChange={(e) => setNewVocabNative(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Phonetics (optional)"
                value={newVocabPhonetic}
                onChange={(e) => setNewVocabPhonetic(e.target.value)}
                className="w-full sm:w-32 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Word
              </button>
            </form>
          </div>

          {/* Key Dialogues / Secret Phrases */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              Conversational Sentence Frames &amp; Spy Codes
            </h2>
            <div className="space-y-2">
              {activeLesson.keyPhrases.map((phrase, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <span className="font-semibold text-purple-300">
                    &ldquo;{phrase.target}&rdquo;
                  </span>
                  <span className="text-slate-400 italic">
                    {phrase.english}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Categories Banner */}
          <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold text-slate-200 text-xs">
                Available Supplemental Material Generators:
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-300">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">🔐 Escape Rooms</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">☕ 3-Min Bellringers</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">🏆 Vocab Brackets</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">📊 Lego Organizers</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">🕶️ Whispering Cards</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">🎟️ 3-2-1 Exit Tickets</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">🎮 RPG Rubrics</span>
              </div>
            </div>
            <button
              onClick={handleGenerateDozens}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shrink-0"
            >
              Generate All
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
