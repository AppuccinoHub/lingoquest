'use client';

import React, { useState, useEffect } from 'react';
import { LessonPlan, SupplementalMaterial } from '@/types/actfl';
import { generateDozensMaterials } from '@/lib/materialsGenerator';
import { 
  Layers, 
  Search, 
  Filter, 
  Printer, 
  Copy, 
  Check, 
  FileDown, 
  Gamepad2, 
  Sparkles,
  ExternalLink,
  BookOpen,
  Tag
} from 'lucide-react';

interface MaterialsLibraryProps {
  lesson: LessonPlan;
  onUpdateLesson: (lesson: LessonPlan) => void;
  onLaunchInArcade: () => void;
}

export default function MaterialsLibrary({
  lesson,
  onUpdateLesson,
  onLaunchInArcade
}: MaterialsLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<SupplementalMaterial | null>(
    lesson.materials[0] || null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Auto-generate if empty
  useEffect(() => {
    if (lesson.materials.length === 0) {
      const initial = generateDozensMaterials(lesson);
      onUpdateLesson({
        ...lesson,
        materials: initial
      });
      setSelectedMaterial(initial[0]);
    } else if (!selectedMaterial && lesson.materials.length > 0) {
      setSelectedMaterial(lesson.materials[0]);
    }
  }, [lesson, onUpdateLesson, selectedMaterial]);

  const categories = [
    { id: 'all', label: 'All Supplemental Materials' },
    { id: 'bellringer', label: '☕ 3-Min Bellringers' },
    { id: 'escape_room', label: '🔐 Escape Rooms' },
    { id: 'vocab_bracket', label: '🥊 Vocab Brackets' },
    { id: 'graphic_organizer', label: '📊 Graphic Organizers' },
    { id: 'dialogue_script', label: '🕶️ Whispering / Spy Cards' },
    { id: 'cultural_ticket', label: '🎟️ Cultural Exit Tickets' },
    { id: 'rubric', label: '🎮 RPG ACTFL Rubrics' },
    { id: 'game_station', label: '🎲 Station Games' }
  ];

  const filteredMaterials = lesson.materials.filter(m => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Teacher Supplemental Material Vault
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
              {lesson.materials.length} Resources Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dozens of high-engagement, low-anxiety printables, silent bellringers, escape puzzles, and partner game cards generated for <strong>{lesson.title}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLaunchInArcade}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-purple-600/20"
          >
            <Gamepad2 className="w-4 h-4" />
            Play in Arcade Mode
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Current
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search activities & games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Two Column Layout: List on Left, Active Preview & Printable on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Material Cards List (5 cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          {filteredMaterials.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-slate-300 font-bold text-sm">No materials in this filter</div>
              <p className="text-xs text-slate-400">
                Click &quot;All Supplemental Materials&quot; or generate more from the Lesson Studio.
              </p>
            </div>
          ) : (
            filteredMaterials.map((mat) => {
              const isSelected = selectedMaterial?.id === mat.id;
              return (
                <div
                  key={mat.id}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500'
                      : 'bg-slate-900/80 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {mat.categoryLabel}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      mat.anxietyRating.includes('Zero') 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}>
                      {mat.anxietyRating}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-100 text-sm mb-1 leading-snug">
                    {mat.title}
                  </h3>
                  
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {mat.summary}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span>⏱️ {mat.estimatedMinutes} min</span>
                      <span>•</span>
                      <span>🎯 {mat.actflMode}</span>
                    </div>
                    <span className="text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                      View Activity &rarr;
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Full Markdown Material Preview (7 cols) */}
        <div className="lg:col-span-7">
          {selectedMaterial ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl sticky top-28">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {selectedMaterial.categoryLabel}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      Level: {selectedMaterial.proficiencyLevel}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                      {selectedMaterial.anxietyRating}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white">
                    {selectedMaterial.title}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {selectedMaterial.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy(selectedMaterial.content, selectedMaterial.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-colors"
                    title="Copy formatted markdown text to clipboard"
                  >
                    {copiedId === selectedMaterial.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300"
                    title="Print worksheet"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ACTFL Standards Alignment Pillbox */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">ACTFL Mode:</span>
                  <span className="font-bold text-slate-200">{selectedMaterial.actflMode} Mode</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">World-Readiness 5 C&apos;s:</span>
                  {selectedMaterial.target5C.map(c => (
                    <span key={c} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] text-purple-300">
                      {c}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span>Duration: <strong>{selectedMaterial.estimatedMinutes} mins</strong></span>
                </div>
              </div>

              {/* Printable Worksheet Body Container */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800/80 p-5 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[460px] overflow-y-auto selection:bg-purple-600 selection:text-white">
                {selectedMaterial.content}
              </div>

              {/* Teacher Implementation Note */}
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs flex items-start gap-3">
                <div className="w-5 h-5 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  💡
                </div>
                <div>
                  <strong className="text-indigo-100">Why this overcomes speaking fear:</strong>{' '}
                  {selectedMaterial.anxietyRating.includes('Zero') 
                    ? 'Students can participate 100% silently, in non-verbal voting pairs, or via written codebreaking clues before uttering a single syllable.'
                    : 'Students adopt silly operative personas or game roles. The psychological focus shifts from "My teacher is grading my accent" to "Can we solve the clue together?"'}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12 text-slate-400 border border-dashed border-slate-800 rounded-3xl">
              Select an activity from the left to view details &amp; print.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
