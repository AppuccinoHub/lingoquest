export type ProficiencyLevel =
  | "Novice Low"
  | "Novice Mid"
  | "Novice High"
  | "Intermediate Low"
  | "Intermediate Mid"
  | "Intermediate High";

export type CommMode = "Interpretive" | "Interpersonal" | "Presentational";

export interface LessonInput {
  language: string;
  level: ProficiencyLevel;
  theme: string;
  title: string;
  vocabRaw: string;
  objectives: string;
}

export interface VocabTerm {
  term: string;
  gloss: string;
  example: string;
}

export interface Material {
  id: string;
  kind: string;
  title: string;
  mode: CommMode | "Mixed";
  icon: string;
  minutes: number;
  group: string;
  tags: string[];
  summary: string;
  sections: { heading: string; items: string[] }[];
}

export const LANGUAGES = [
  { value: "Spanish", code: "es-ES", flag: "🇪🇸" },
  { value: "French", code: "fr-FR", flag: "🇫🇷" },
  { value: "German", code: "de-DE", flag: "🇩🇪" },
  { value: "Italian", code: "it-IT", flag: "🇮🇹" },
  { value: "Mandarin", code: "zh-CN", flag: "🇨🇳" },
  { value: "Japanese", code: "ja-JP", flag: "🇯🇵" },
];

export const LEVELS: ProficiencyLevel[] = [
  "Novice Low",
  "Novice Mid",
  "Novice High",
  "Intermediate Low",
  "Intermediate Mid",
  "Intermediate High",
];

export const THEMES = [
  "Food & Restaurants",
  "Travel & Directions",
  "School & Daily Life",
  "Family & Friends",
  "Health & Body",
  "Weather & Seasons",
];

export const FIVE_CS = [
  {
    letter: "C1",
    name: "Communication",
    color: "bg-sky-500",
    desc: "Interact, interpret & present in the language across the three modes.",
  },
  {
    letter: "C2",
    name: "Cultures",
    color: "bg-amber-500",
    desc: "Investigate products, practices & perspectives of the target culture.",
  },
  {
    letter: "C3",
    name: "Connections",
    color: "bg-emerald-500",
    desc: "Connect language to other disciplines and authentic viewpoints.",
  },
  {
    letter: "C4",
    name: "Comparisons",
    color: "bg-violet-500",
    desc: "Compare your language/culture with the target to build insight.",
  },
  {
    letter: "C5",
    name: "Communities",
    color: "bg-rose-500",
    desc: "Use the language beyond school — clubs, travel, online, family.",
  },
];

export const CAN_DO_BANK: Record<string, string[]> = {
  "Novice Low": [
    "I can greet people and say goodbye with memorized phrases.",
    "I can name familiar objects, foods, and places from pictures.",
    "I can answer yes/no and either-or questions about myself.",
  ],
  "Novice Mid": [
    "I can introduce myself and share likes/dislikes in short phrases.",
    "I can ask and answer simple questions about daily routines.",
    "I can describe my family, school, or food with lists of words.",
  ],
  "Novice High": [
    "I can handle a simple restaurant, shop, or travel transaction.",
    "I can ask follow-up questions to keep a conversation going.",
    "I can write a short message or post about my plans and pastimes.",
  ],
  "Intermediate Low": [
    "I can narrate daily life in present time with connected sentences.",
    "I can ask for directions and resolve a simple travel problem.",
    "I can compare habits and explain preferences with reasons.",
  ],
  "Intermediate Mid": [
    "I can tell a story about a past trip with beginning, middle, end.",
    "I can manage an unexpected complication (missed bus, wrong order).",
    "I can present pros/cons on a familiar topic with supporting details.",
  ],
  "Intermediate High": [
    "I can debate a current issue and defend my opinion with evidence.",
    "I can narrate across past, present, and future time frames.",
    "I can adapt language for formal vs. informal audiences.",
  ],
};

export function levelIndex(level: ProficiencyLevel): number {
  return LEVELS.indexOf(level);
}

export function levelExpectations(level: ProficiencyLevel): string[] {
  const i = levelIndex(level);
  if (i <= 1)
    return [
      "Single words + memorized chunks — no full grammar explanations needed.",
      "Heavy visual support; yes/no + choice questions first.",
      "Presentational = lists, labels, captions (not paragraphs).",
    ];
  if (i <= 3)
    return [
      "Short sentences + follow-up questions; recombine learned chunks.",
      "Survival transactions (café, directions, shopping) are the sweet spot.",
      "Push for connectors: y / también / pero / porque.",
    ];
  return [
    "Connected narration across time frames; opinions with porque + detail.",
    "Complications + problem-solving role plays unlock engagement.",
    "Presentational = organized paragraphs with transitions.",
  ];
}
