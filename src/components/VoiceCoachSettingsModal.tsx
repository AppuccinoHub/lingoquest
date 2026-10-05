'use client';

import React from 'react';
import { X, Volume2, Mic, ShieldAlert, Sparkles, Sliders } from 'lucide-react';
import { soundFX } from '@/lib/soundFx';

interface VoiceCoachSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  whisperModeActive: boolean;
  setWhisperModeActive: (val: boolean) => void;
}

export default function VoiceCoachSettingsModal({
  isOpen,
  onClose,
  whisperModeActive,
  setWhisperModeActive
}: VoiceCoachSettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
              🎙️
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Voice Coach &amp; Anxiety Dampener
              </h3>
              <p className="text-xs text-slate-400">
                Audio tuning to help shy kids speak comfortably
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          
          {/* Toggle: Whisper Detection */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold text-slate-200 text-xs flex items-center gap-2">
                <span>🤫 Low-Volume &amp; Whisper Acceptance</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Lowers speech threshold so students can whisper softly without failing speech recognition.
              </p>
            </div>
            <input
              type="checkbox"
              checked={whisperModeActive}
              onChange={(e) => setWhisperModeActive(e.target.checked)}
              className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {/* Test Audio Voice FX */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="font-bold text-slate-200 text-xs">
              Preview Voice Filters (Synthesizer Soundboard)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => soundFX.speakText('¡Hola amigo! ¿Qué tal estás hoy?', 'es-ES', 'whisper')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Test Whisper Voice</span>
              </button>
              <button
                onClick={() => soundFX.speakText('¡Hola amigo! ¿Qué tal estás hoy?', 'es-ES', 'robot')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Test Robot Voice</span>
              </button>
            </div>
          </div>

          {/* Pedagogy Note */}
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs leading-relaxed">
            <strong>Stephen Krashen&apos;s Affective Filter Hypothesis:</strong> High anxiety acts as a mental wall preventing language acquisition. Gamification, voice pitch disguises, and pair whispering lower this filter to near zero.
          </div>

        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
          >
            Save &amp; Continue
          </button>
        </div>

      </div>
    </div>
  );
}
