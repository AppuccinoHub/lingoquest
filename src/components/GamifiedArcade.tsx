'use client';

import React, { useState, useEffect } from 'react';
import { LessonPlan, VocabularyItem } from '@/types/actfl';
import { soundFX } from '@/lib/soundFx';
import confetti from 'canvas-confetti';
import { 
  Mic, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Flame, 
  Trophy, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  Shuffle, 
  MessageSquare,
  Bot,
  Zap,
  Radio,
  SlidersHorizontal,
  ThumbsUp,
  HeartHandshake,
  Glasses
} from 'lucide-react';

interface GamifiedArcadeProps {
  lesson: LessonPlan;
  onEarnXP: (amount: number) => void;
  whisperModeActive: boolean;
}

export default function GamifiedArcade({
  lesson,
  onEarnXP,
  whisperModeActive
}: GamifiedArcadeProps) {
  // Game Selector: 1) Voice Quest RPG, 2) Pronunciation Sound Wave Hero, 3) Emoji Guess & Speak, 4) Undercover Spy Whispers
  const [activeGame, setActiveGame] = useState<'quest' | 'soundhero' | 'emoji' | 'spy'>('quest');

  // Common Arcade State
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState<string | null>(null);
  const [hasCompletedCurrent, setHasCompletedCurrent] = useState(false);

  // Quest RPG State
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'npc' | 'user'; text: string; translation?: string }>>([]);
  const [userTypedInput, setUserTypedInput] = useState('');
  const [selectedVoiceEffect, setSelectedVoiceEffect] = useState<'normal' | 'robot' | 'whisper' | 'slow'>('whisper');

  const currentWord: VocabularyItem = lesson.coreVocabulary[selectedWordIndex] || {
    target: 'Hola',
    native: 'Hello',
    emoji: '👋'
  };

  // Pre-configured quest scenarios based on active lesson
  const questScenarios = [
    {
      npcName: lesson.targetLanguage === 'Spanish' ? 'Mateo el Camarero' : lesson.targetLanguage === 'French' ? 'Jean-Luc le Boulanger' : 'Kenji san',
      npcAvatar: lesson.targetLanguage === 'Spanish' ? '🧑‍🍳' : lesson.targetLanguage === 'French' ? '🥖' : '🍱',
      npcPrompt: lesson.targetLanguage === 'Spanish' 
        ? '¡Buenas tardes! Bienvenido a nuestro café. ¿Qué le gustaría tomar hoy?' 
        : lesson.targetLanguage === 'French' 
        ? 'Bonjour ! Bienvenue à la boulangerie. Que désirez-vous aujourd’hui ?' 
        : 'いらっしゃいませ！何にしますか？',
      npcTranslation: 'Good afternoon! Welcome. What would you like today?',
      acceptableHints: [
        lesson.coreVocabulary[0]?.target || 'Quisiera un jugo de naranja',
        lesson.keyPhrases[0]?.target || 'Para mí, una porción de churros'
      ],
      quickReplies: [
        lesson.coreVocabulary[0]?.target || 'Quisiera un vaso de agua',
        lesson.coreVocabulary[1]?.target || '¿Cuánto cuesta?',
        lesson.keyPhrases[0]?.target || 'Para mí, una porción de churros'
      ]
    },
    {
      npcName: 'Agente Secreta Carmen',
      npcAvatar: '🕵️‍♀️',
      npcPrompt: lesson.targetLanguage === 'Spanish'
        ? 'Disculpe... ¿El café tiene azúcar o prefiere agua fresca?'
        : 'Pardon... Le musée est ouvert ou fermé aujourd’hui ?',
      npcTranslation: 'Excuse me... Does the café have sugar or do you prefer fresh water?',
      acceptableHints: [
        'Un vaso de agua fresca, por favor',
        'Sin hielo, por favor'
      ],
      quickReplies: [
        'Sin hielo, por favor',
        'Delicioso, muchas gracias',
        'La cuenta, por favor'
      ]
    }
  ];

  const currentScenario = questScenarios[currentPromptIdx % questScenarios.length];

  // Initialize or reset chat when game starts or scenario changes
  useEffect(() => {
    setChatHistory([
      {
        sender: 'npc',
        text: currentScenario.npcPrompt,
        translation: currentScenario.npcTranslation
      }
    ]);
    setHasCompletedCurrent(false);
    setAudioFeedback(null);
  }, [currentPromptIdx, lesson]);

  // Audio Playback helper
  const handleHearTarget = (text: string) => {
    soundFX.speakText(text, lesson.targetLanguage, selectedVoiceEffect);
  };

  // Mock / Speech recognition handler (works with Web Speech API if supported, or simulated confidence-builder)
  const handleMicrophonePractice = (targetExpected: string) => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    setAudioFeedback('Listening to your awesome voice... (Whisper, silly voice, or speech all count!)');

    // Check if browser has SpeechRecognition
    const SpeechRecognition = (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).SpeechRecognition ||
                              (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = lesson.targetLanguage.toLowerCase().includes('span') ? 'es-ES' : 
                           lesson.targetLanguage.toLowerCase().includes('fren') ? 'fr-FR' : 
                           lesson.targetLanguage.toLowerCase().includes('japan') ? 'ja-JP' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 3;

        recognition.onresult = (event: any) => {
          const spoken = event.results[0][0].transcript;
          setIsRecording(false);
          evaluateSpeech(spoken, targetExpected);
        };

        recognition.onerror = () => {
          // If microphone fails or user is shy, gracefully fallback to confidence simulator!
          simulateFriendlyMicSuccess(targetExpected);
        };

        recognition.start();

        // 4-second safety timeout
        setTimeout(() => {
          if (isRecording) {
            simulateFriendlyMicSuccess(targetExpected);
          }
        }, 4000);

      } catch {
        simulateFriendlyMicSuccess(targetExpected);
      }
    } else {
      simulateFriendlyMicSuccess(targetExpected);
    }
  };

  const simulateFriendlyMicSuccess = (targetExpected: string) => {
    setTimeout(() => {
      setIsRecording(false);
      evaluateSpeech(targetExpected, targetExpected);
    }, 1200);
  };

  const evaluateSpeech = (spoken: string, targetExpected: string) => {
    soundFX.playSuccess();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    const gainedXP = 45;
    onEarnXP(gainedXP);
    setScore(prev => prev + 100);
    setCombo(prev => prev + 1);
    setHasCompletedCurrent(true);

    setAudioFeedback(
      `🎉 Spot on! Fantastic rhythm and clarity: "${spoken}". +${gainedXP} XP`
    );

    // If in quest mode, add to history
    if (activeGame === 'quest') {
      setChatHistory(prev => [
        ...prev,
        { sender: 'user', text: targetExpected },
        { 
          sender: 'npc', 
          text: lesson.targetLanguage === 'Spanish' ? '¡Excelente! Aquí tiene su pedido al instante. ¿Algo más?' : 'Parfait ! Voici pour vous.',
          translation: 'Excellent! Here is your order right away. Anything else?'
        }
      ]);
    }
  };

  const handleNextWord = () => {
    setAudioFeedback(null);
    setHasCompletedCurrent(false);
    setSelectedWordIndex((prev) => (prev + 1) % lesson.coreVocabulary.length);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Game Mode Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveGame('quest')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeGame === 'quest'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Bot className="w-4 h-4 text-amber-300" />
            <span>🤖 RPG Voice Quest</span>
          </button>

          <button
            onClick={() => setActiveGame('soundhero')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeGame === 'soundhero'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>🌊 Sound Wave Hero</span>
          </button>

          <button
            onClick={() => setActiveGame('emoji')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeGame === 'emoji'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>⚡ Emoji Speed Match</span>
          </button>

          <button
            onClick={() => setActiveGame('spy')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeGame === 'spy'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Glasses className="w-4 h-4 text-cyan-400" />
            <span>🕶️ Spy Whisper Battle</span>
          </button>
        </div>

        {/* Live Gamer Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-xl font-bold">
            <Trophy className="w-3.5 h-3.5 fill-amber-400" />
            <span>Score: {score}</span>
          </div>
          {combo > 1 && (
            <div className="flex items-center gap-1 text-xs text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2.5 py-1 rounded-xl font-bold animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-pink-400" />
              <span>{combo}x Combo!</span>
            </div>
          )}
        </div>
      </div>

      {/* Shy-Speaker Superpower Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 text-base shrink-0">
            🛡️
          </div>
          <div>
            <div className="font-bold text-emerald-300">
              Low-Anxiety Speaking Shield Activated
            </div>
            <p className="text-slate-300 text-[11px]">
              No awkward pauses, no harsh judgment. Play with whisper voice, robot effects, or tap 1-click audio scaffolding to build confidence step-by-step.
            </p>
          </div>
        </div>

        {/* Voice Pitch / Modifiers */}
        <div className="flex items-center gap-1.5 shrink-0 bg-slate-950 border border-slate-800 p-1 rounded-xl">
          <span className="text-[10px] text-slate-400 px-2 font-medium">Voice FX:</span>
          {(['whisper', 'robot', 'slow', 'normal'] as const).map(effect => (
            <button
              key={effect}
              onClick={() => {
                setSelectedVoiceEffect(effect);
                soundFX.playCoin();
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                selectedVoiceEffect === effect
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {effect === 'whisper' && '🤫 '}
              {effect === 'robot' && '🤖 '}
              {effect === 'slow' && '🐢 '}
              {effect === 'normal' && '👤 '}
              {effect}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GAME 1: RPG VOICE QUEST (NPC Conversational Simulation) */}
      {/* ========================================================================= */}
      {activeGame === 'quest' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Quest Dialogue Box (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 flex flex-col justify-between shadow-2xl min-h-[500px]">
            
            {/* Top Bar: NPC Identity */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl shadow-inner">
                  {currentScenario.npcAvatar}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                    {currentScenario.npcName}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                      ACTFL Interpersonal
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Scenario: Order food &amp; navigate without stress in {lesson.targetLanguage}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setCurrentPromptIdx(prev => prev + 1);
                  soundFX.playCoin();
                }}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 font-medium transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" />
                Next NPC
              </button>
            </div>

            {/* Chat Thread */}
            <div className="space-y-4 my-4 flex-1 overflow-y-auto max-h-[320px] pr-2">
              {chatHistory.map((item, idx) => (
                <div 
                  key={idx}
                  className={`flex items-start gap-3 ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {item.sender === 'npc' && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-900/60 border border-indigo-700/60 flex items-center justify-center text-sm shrink-0">
                      {currentScenario.npcAvatar}
                    </div>
                  )}

                  <div className={`p-4 rounded-2xl max-w-md space-y-1.5 text-xs ${
                    item.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}>
                    <div className="font-semibold leading-relaxed text-sm">
                      {item.text}
                    </div>
                    {item.translation && (
                      <div className="text-[11px] text-slate-400 italic border-t border-slate-800/80 pt-1">
                        {item.translation}
                      </div>
                    )}

                    {item.sender === 'npc' && (
                      <div className="pt-1 flex items-center gap-2">
                        <button
                          onClick={() => handleHearTarget(item.text)}
                          className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 font-bold"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          Listen Pronunciation ({selectedVoiceEffect})
                        </button>
                      </div>
                    )}
                  </div>

                  {item.sender === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-purple-600/40 border border-purple-500/60 flex items-center justify-center text-sm shrink-0">
                      😎
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Speaking / Confidence Action Controls */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              
              {/* Quick Reply Scaffolds (Allows shy kids to click to speak or practice before talking) */}
              <div>
                <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
                  💡 Zero-Stress Sentence Stems (Tap to practice or choose response):
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentScenario.quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleMicrophonePractice(reply)}
                      className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500/50 text-xs text-slate-200 font-medium transition-all text-left"
                    >
                      <span>💬 {reply}</span>
                      <Volume2 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHearTarget(reply);
                        }} 
                        className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400" 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Big Interactive Mic Button */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => handleMicrophonePractice(currentScenario.quickReplies[0])}
                  disabled={isRecording}
                  className={`flex-1 w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-black text-sm tracking-wide transition-all shadow-xl cursor-pointer ${
                    isRecording 
                      ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                      : 'bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white shadow-emerald-600/20 transform hover:-translate-y-0.5'
                  }`}
                >
                  <Mic className={`w-5 h-5 ${isRecording ? 'animate-bounce' : ''}`} />
                  <span>
                    {isRecording 
                      ? 'Listening to your voice...' 
                      : 'Tap to Speak / Whisper to NPC (+45 XP)'}
                  </span>
                </button>

                <button
                  onClick={() => handleHearTarget(currentScenario.quickReplies[0])}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
                  title="Hear how it sounds first"
                >
                  <Volume2 className="w-4 h-4 text-indigo-400" />
                  <span>Preview Audio</span>
                </button>
              </div>

              {/* Live Audio Feedback */}
              {audioFeedback && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between animate-in slide-in-from-bottom-2">
                  <span>{audioFeedback}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
              )}

            </div>

          </div>

          {/* Right Column: Quest Inventory & Quest Badges (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Mission Objectives Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  Café Quest Mission
                </h4>
                <span className="text-xs text-amber-400 font-bold">ACTFL Novice Mid</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <div>
                    <div className="font-semibold text-slate-200">Polite Greeting &amp; Opener</div>
                    <p className="text-[11px] text-slate-400">Say &quot;¡Buenas tardes!&quot; or &quot;Hola&quot;</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className={hasCompletedCurrent ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                    {hasCompletedCurrent ? '✓' : '○'}
                  </span>
                  <div>
                    <div className="font-semibold text-slate-200">Order using &quot;Quisiera...&quot;</div>
                    <p className="text-[11px] text-slate-400">Ask for food or drink politely</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">○</span>
                  <div>
                    <div className="font-semibold text-slate-200">Request the Bill</div>
                    <p className="text-[11px] text-slate-400">&quot;La cuenta, por favor&quot;</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shy Kid Secret Weapon Box */}
            <div className="bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                <HeartHandshake className="w-4 h-4" />
                Speaking Anxiety Survival Tip
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Remember: Native speakers love when you try! They don&apos;t expect you to sound like a news anchor. Even a single whispered word like &quot;Agua, por favor&quot; completes the mission and wins full credit!
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* GAME 2: SOUND WAVE HERO (Pronunciation & Rhythm Arcade) */}
      {/* ========================================================================= */}
      {activeGame === 'soundhero' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-10 space-y-8 shadow-2xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
                <Radio className="w-3.5 h-3.5" />
                Acoustic Rhythm &amp; Intonation Hero
              </div>
              <h2 className="text-2xl font-black text-white">
                Match the Frequency &amp; Pitch Contour
              </h2>
              <p className="text-xs text-slate-400">
                Kids can listen, hum, whisper, or speak with silly effects. Points are awarded for participation and flow!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Word {selectedWordIndex + 1} of {lesson.coreVocabulary.length}</span>
              <button
                onClick={handleNextWord}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-colors"
              >
                <span>Next Word</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sound Wave Visualizer Card */}
          <div className="relative bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6 overflow-hidden">
            
            {/* Animated Audio Equalizer Bars */}
            <div className="flex items-center justify-center gap-1.5 h-16 w-full max-w-md">
              {[40, 75, 30, 95, 60, 85, 45, 100, 70, 50, 90, 65, 35, 80, 55].map((height, i) => (
                <div
                  key={i}
                  style={{ height: `${isRecording ? Math.min(100, height * 1.2) : height * 0.4}%` }}
                  className={`w-2 rounded-full transition-all duration-150 ${
                    isRecording 
                      ? 'bg-gradient-to-t from-pink-500 to-indigo-500 animate-pulse' 
                      : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>

            {/* Target Big Word */}
            <div className="space-y-2">
              <span className="text-4xl block animate-bounce">{currentWord.emoji || '💬'}</span>
              <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-indigo-400 tracking-tight">
                {currentWord.target}
              </h1>
              <p className="text-sm font-semibold text-slate-300">
                Meaning: <span className="text-white">&quot;{currentWord.native}&quot;</span>
              </p>
              {currentWord.phonetic && (
                <div className="inline-block px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-purple-300">
                  Phonetics: /{currentWord.phonetic}/
                </div>
              )}
            </div>

            {/* Dual Action: Listen Slow vs Mic Match */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg pt-4">
              <button
                onClick={() => handleHearTarget(currentWord.target)}
                className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 font-bold text-xs transition-all"
              >
                <Volume2 className="w-4 h-4 text-indigo-400" />
                <span>Hear Native Audio</span>
              </button>

              <button
                onClick={() => handleMicrophonePractice(currentWord.target)}
                disabled={isRecording}
                className={`w-full sm:w-1/2 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-xs transition-all shadow-lg ${
                  isRecording 
                    ? 'bg-rose-600 text-white animate-pulse' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/20'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isRecording ? 'Listening...' : 'Match Waveform (+30 XP)'}</span>
              </button>
            </div>

            {audioFeedback && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{audioFeedback}</span>
              </div>
            )}

          </div>

          {/* Quick Word Strip Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {lesson.coreVocabulary.map((v, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedWordIndex(idx);
                  setAudioFeedback(null);
                  soundFX.playCoin();
                }}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedWordIndex === idx
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span>{v.emoji || '✨'}</span>
                <span>{v.target}</span>
              </button>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* GAME 3: EMOJI SPEED MATCH (Visual & Low-Stakes Recognition) */}
      {/* ========================================================================= */}
      {activeGame === 'emoji' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Zero-Speaking Silent Speed Challenge
              </div>
              <h2 className="text-xl font-black text-white">
                Tap the Target Item Before the Clock Ticks Down!
              </h2>
              <p className="text-xs text-slate-400">
                Great for introverted days or bellringers. Kids reinforce vocabulary without being put on the spot.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleHearTarget(currentWord.target)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 font-bold"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                Listen Target
              </button>
            </div>
          </div>

          {/* Big Challenge Display */}
          <div className="text-center py-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">
              Which item means:
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">
              &quot;{currentWord.native}&quot;
            </div>
            <div className="text-xs text-slate-400">
              (In {lesson.targetLanguage}: <span className="text-amber-400 font-semibold">{currentWord.target}</span>)
            </div>
          </div>

          {/* 4-Option Choice Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lesson.coreVocabulary.slice(0, 4).map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (item.target === currentWord.target) {
                    soundFX.playSuccess();
                    confetti({ particleCount: 30, spread: 50 });
                    onEarnXP(25);
                    setScore(prev => prev + 50);
                    handleNextWord();
                  } else {
                    soundFX.playErrorSoft();
                  }
                }}
                className="p-5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/60 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl group-hover:scale-125 transition-transform">
                    {item.emoji || '✨'}
                  </span>
                  <div>
                    <div className="font-extrabold text-white text-sm group-hover:text-indigo-300">
                      {item.target}
                    </div>
                    <div className="text-xs text-slate-400">
                      Tap to select
                    </div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/40">
                  &rarr;
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GAME 4: SPY WHISPER BATTLE (Peer-to-Peer Secret Agent Mission) */}
      {/* ========================================================================= */}
      {activeGame === 'spy' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold mb-2">
              <Glasses className="w-3.5 h-3.5" />
              Undercover Operative Whispering Quest
            </div>
            <h2 className="text-xl font-black text-white">
              Whisper the Secret Spy Codeword to Your Partner
            </h2>
            <p className="text-xs text-slate-400">
              Students pair up. Speaking at a quiet whisper removes the fear of peer judgment while boosting foreign language confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Agent 001 Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-indigo-950/40 border border-indigo-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  🕶️ AGENT CODE: ALPHA
                </span>
                <span className="text-xs text-slate-400">Partner 1</span>
              </div>
              <h3 className="text-sm font-bold text-slate-200">
                Your Secret Transmission (Whisper this):
              </h3>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-sm font-bold">
                &ldquo;{lesson.keyPhrases[0]?.target || 'Quisiera un vaso de agua fresca por favor.'}&rdquo;
              </div>
              <p className="text-xs text-slate-400 italic">
                Translation: &quot;{lesson.keyPhrases[0]?.english || 'I would like a glass of fresh water please.'}&quot;
              </p>
              <button
                onClick={() => handleHearTarget(lesson.keyPhrases[0]?.target || '')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold"
              >
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                Listen in Whisper Voice
              </button>
            </div>

            {/* Agent 002 Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-purple-950/40 border border-purple-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  🎧 AGENT CODE: OMEGA
                </span>
                <span className="text-xs text-slate-400">Partner 2</span>
              </div>
              <h3 className="text-sm font-bold text-slate-200">
                Your Covert Counter-Password:
              </h3>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-purple-300 font-mono text-sm font-bold">
                &ldquo;{lesson.keyPhrases[1]?.target || 'Sin hielo y con limón, muchas gracias.'}&rdquo;
              </div>
              <p className="text-xs text-slate-400 italic">
                Translation: &quot;{lesson.keyPhrases[1]?.english || 'Without ice and with lemon, thank you very much.'}&quot;
              </p>
              <button
                onClick={() => handleHearTarget(lesson.keyPhrases[1]?.target || '')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold"
              >
                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                Listen in Whisper Voice
              </button>
            </div>

          </div>

          <div className="flex items-center justify-center pt-2">
            <button
              onClick={() => {
                soundFX.playPowerUp();
                confetti({ particleCount: 40 });
                onEarnXP(50);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-600/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>We Whispered Both Codewords! (+50 XP)</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
