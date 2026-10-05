export type ACTFLProficiency = 
  | 'Novice Low' 
  | 'Novice Mid' 
  | 'Novice High' 
  | 'Intermediate Low' 
  | 'Intermediate Mid' 
  | 'Intermediate High' 
  | 'Advanced Low';

export type ACTFLMode = 'Interpersonal' | 'Interpretive' | 'Presentational';

export type ACTFL5C = 'Communication' | 'Cultures' | 'Connections' | 'Comparisons' | 'Communities';

export interface VocabularyItem {
  target: string;
  native: string; // English
  phonetic?: string;
  contextSentence?: string;
  category?: string;
  emoji?: string;
}

export interface CanDoStatement {
  id: string;
  text: string;
  mode: ACTFLMode;
  level: ACTFLProficiency;
}

export interface SupplementalMaterial {
  id: string;
  title: string;
  category: 
    | 'bellringer' 
    | 'graphic_organizer' 
    | 'escape_room' 
    | 'infographic_reading' 
    | 'vocab_bracket' 
    | 'cultural_ticket' 
    | 'rubric' 
    | 'peer_scaffold' 
    | 'game_station' 
    | 'dialogue_script';
  categoryLabel: string;
  actflMode: ACTFLMode;
  target5C: ACTFL5C[];
  proficiencyLevel: ACTFLProficiency;
  estimatedMinutes: number;
  anxietyRating: 'Zero Stress (Silent/Team)' | 'Low Stress (Pairs/Sound Effects)' | 'Playful Challenge';
  summary: string;
  content: string; // Markdown or rich formatted text
  printableTemplate?: string;
  interactiveAvailable?: boolean;
}

export interface LessonPlan {
  id: string;
  title: string;
  targetLanguage: string;
  level: ACTFLProficiency;
  theme: string;
  culturalTopic: string;
  coreVocabulary: VocabularyItem[];
  keyPhrases: { target: string; english: string; audioHelp?: string }[];
  canDoStatements: CanDoStatement[];
  essentialQuestions: string[];
  materials: SupplementalMaterial[];
}

export interface SpeakingMinigamePrompt {
  id: string;
  promptText: string;
  targetResponse: string;
  acceptableVariants: string[];
  englishHint: string;
  audioPronunciationText: string;
  level: ACTFLProficiency;
  scenario: string;
  npcName: string;
  npcAvatar: string;
  xpReward: number;
}
