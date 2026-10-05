'use client';

import React, { useState } from 'react';
import { LessonPlan } from '@/types/actfl';
import { 
  Download, 
  Printer, 
  Projector, 
  Tv, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  Share2, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClassroomKitProps {
  lesson: LessonPlan;
}

export default function ClassroomKit({ lesson }: ClassroomKitProps) {
  const [projectorMode, setProjectorMode] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const slides = [
    {
      title: `🛎️ 3-Minute Bellringer: ${lesson.title}`,
      subtitle: 'Zero-Speaking Visual Activation',
      body: lesson.materials[0]?.content || 'Look at the prompt on the screen and write your choice silently on your paper.'
    },
    {
      title: `🎯 Today's ACTFL Can-Do Targets`,
      subtitle: `${lesson.level} | ${lesson.targetLanguage}`,
      body: lesson.canDoStatements.map((c, i) => `${i + 1}. [${c.mode} Mode] ${c.text}`).join('\n\n')
    },
    {
      title: `🥊 Vocabulary March Madness Arena`,
      subtitle: 'Hold up thumbs up or thumbs down to vote!',
      body: `Matchup #1: ${lesson.coreVocabulary[0]?.target || 'Option A'} 🆚 ${lesson.coreVocabulary[1]?.target || 'Option B'}\n\nSentence Stem to use: "Prefiero X porque es más delicioso."`
    }
  ];

  const handleCopyMarkdownExport = () => {
    let output = `# ${lesson.title} - ACTFL Classroom Unit Kit\n`;
    output += `Target Language: ${lesson.targetLanguage} | Level: ${lesson.level}\n`;
    output += `Theme: ${lesson.theme}\n`;
    output += `Cultural Focus: ${lesson.culturalTopic}\n\n`;

    output += `## 1. NCSSFL-ACTFL Can-Do Statements\n`;
    lesson.canDoStatements.forEach(cd => {
      output += `- [${cd.mode}] ${cd.text} (${cd.level})\n`;
    });

    output += `\n## 2. Core Vocabulary & Chunks\n`;
    lesson.coreVocabulary.forEach(v => {
      output += `- **${v.target}**: ${v.native} ${v.phonetic ? `(/${v.phonetic}/)` : ''}\n`;
    });

    output += `\n## 3. Supplemental Materials & Activities\n`;
    lesson.materials.forEach(m => {
      output += `\n### ${m.title} (${m.categoryLabel})\n`;
      output += `Anxiety Rating: ${m.anxietyRating} | Duration: ${m.estimatedMinutes}m\n`;
      output += `${m.content}\n`;
    });

    navigator.clipboard.writeText(output);
    setCopiedType('markdown');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyLMSExport = () => {
    const lmsHtml = `
      <div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
        <h2>${lesson.title}</h2>
        <p><strong>ACTFL Level:</strong> ${lesson.level} | <strong>Language:</strong> ${lesson.targetLanguage}</p>
        <h3>Can-Do Statements:</h3>
        <ul>
          ${lesson.canDoStatements.map(c => `<li><strong>[${c.mode}]</strong> ${c.text}</li>`).join('')}
        </ul>
        <h3>Student Mission Activities:</h3>
        <p>Complete the low-stress speaking quest cards with your assigned secret partner!</p>
      </div>
    `;
    navigator.clipboard.writeText(lmsHtml);
    setCopiedType('lms');
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-400" />
              Classroom Kit &amp; Projector Presenter Mode
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              Ready to Teach
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Instantly export everything for Google Classroom, Canvas LMS, printable PDF packets, or switch directly into Big Screen Projector Mode for whole-class zero-anxiety warmups.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setProjectorMode(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-extrabold text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
          >
            <Projector className="w-4 h-4" />
            Launch Big Screen Projector
          </button>
          
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print All Worksheets
          </button>
        </div>
      </div>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Full Unit Bundle (Markdown / PDF) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-base">
              Full ACTFL Unit Dossier
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Includes all Can-Do targets, essential questions, core vocabulary with IPA pronunciation keys, and all generated games &amp; rubrics.
            </p>
          </div>

          <button
            onClick={handleCopyMarkdownExport}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
          >
            {copiedType === 'markdown' ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied Unit Markdown!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Markdown / Text</span>
              </>
            )}
          </button>
        </div>

        {/* Card 2: Canvas / Google Classroom Ready HTML */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-base">
              LMS Rich Text Export
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Formatted for pasting directly into Canvas LMS, Schoology, Google Classroom assignment descriptions, or district portals.
            </p>
          </div>

          <button
            onClick={handleCopyLMSExport}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
          >
            {copiedType === 'lms' ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied LMS Rich Text!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy LMS HTML Snippet</span>
              </>
            )}
          </button>
        </div>

        {/* Card 3: Flashcard Print Strips */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-base">
              Tangible Peer Flashcard Strips
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Printable tactile 2-sided cards designed for shy pairs. Students reveal words to their partner without teacher spotlight.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-pink-600/30 hover:bg-pink-600/50 border border-pink-500/40 text-xs font-bold text-pink-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Flashcard Cutouts</span>
          </button>
        </div>

      </div>

      {/* Printable Flashcard Sheet Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="font-bold text-slate-200 text-base">
              ✂️ Printable Pocket Cards (Tactile Partner Practice)
            </h2>
            <p className="text-xs text-slate-400">
              Cut along the dashed lines. Front side has the Target Word + Emoji; back side has the Native meaning and sentence frame.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
          >
            <Printer className="w-3.5 h-3.5" /> Print Sheet
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {lesson.coreVocabulary.map((v, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl border-2 border-dashed border-slate-700 bg-slate-950 flex flex-col items-center justify-center text-center space-y-2 min-h-[130px]"
            >
              <span className="text-2xl">{v.emoji || '💬'}</span>
              <div className="font-bold text-slate-100 text-xs">{v.target}</div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-1 w-full truncate">
                {v.native}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Screen Projector Mode Overlay */}
      {projectorMode && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col p-8 sm:p-14 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs">
                PROJECTOR MODE
              </span>
              <span className="text-xs text-slate-400">
                Slide {currentSlideIndex + 1} of {slides.length}
              </span>
            </div>

            <button
              onClick={() => setProjectorMode(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Exit Projector [Esc]
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center max-w-4xl mx-auto w-full text-center space-y-8">
            <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest">
              {slides[currentSlideIndex].subtitle}
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
              {slides[currentSlideIndex].title}
            </h1>
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-slate-200 text-lg sm:text-2xl font-mono whitespace-pre-wrap leading-relaxed max-w-2xl text-left w-full shadow-2xl">
              {slides[currentSlideIndex].body}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-6 mt-6">
            <button
              disabled={currentSlideIndex === 0}
              onClick={() => setCurrentSlideIndex(prev => prev - 1)}
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm disabled:opacity-30"
            >
              &larr; Previous Slide
            </button>

            <button
              onClick={() => {
                confetti({ particleCount: 30 });
                setCurrentSlideIndex(prev => (prev + 1) % slides.length);
              }}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm shadow-xl shadow-orange-500/20"
            >
              Next Slide &rarr;
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
