export type ActflLevelId =
  | "novice-low"
  | "novice-mid"
  | "novice-high"
  | "intermediate-low"
  | "intermediate-mid"
  | "intermediate-high"
  | "advanced-low"
  | "advanced-mid"
  | "advanced-high";

export type Band = "Novice" | "Intermediate" | "Advanced";

export type Mode = "interpersonal" | "interpretive" | "presentational";

export type Skill = "speaking" | "listening" | "reading" | "writing";

export interface ActflLevel {
  id: ActflLevelId;
  label: string;
  short: string;
  band: Band;
  /** 0-based index used for min/max comparisons */
  order: number;
  /** Paraphrase of the ACTFL Proficiency Guidelines descriptor */
  summary: string;
  /** What the learner can produce at this level */
  textType: string;
  /** Student-facing rank name used in the arcade */
  rank: string;
}

export const ACTFL_LEVELS: ActflLevel[] = [
  {
    id: "novice-low",
    label: "Novice Low",
    short: "NL",
    band: "Novice",
    order: 0,
    summary:
      "Communicates with isolated words and a few high-frequency phrases on very familiar topics. Relies heavily on memorized language.",
    textType: "Isolated words, lists",
    rank: "Word Collector",
  },
  {
    id: "novice-mid",
    label: "Novice Mid",
    short: "NM",
    band: "Novice",
    order: 1,
    summary:
      "Uses a number of isolated words and memorized phrases on predictable topics. Responds to direct questions with words, lists, and short formulaic phrases.",
    textType: "Words, phrases, memorized chunks",
    rank: "Phrase Finder",
  },
  {
    id: "novice-high",
    label: "Novice High",
    short: "NH",
    band: "Novice",
    order: 2,
    summary:
      "Handles a variety of uncomplicated communicative tasks in straightforward social situations. Begins to create with language, mostly in short sentences on familiar topics.",
    textType: "Simple sentences emerging",
    rank: "Sentence Starter",
  },
  {
    id: "intermediate-low",
    label: "Intermediate Low",
    short: "IL",
    band: "Intermediate",
    order: 3,
    summary:
      "Creates with language to express personal meaning. Asks and answers simple questions and handles basic survival situations using strings of simple sentences in present time.",
    textType: "Discrete sentences",
    rank: "Conversation Rookie",
  },
  {
    id: "intermediate-mid",
    label: "Intermediate Mid",
    short: "IM",
    band: "Intermediate",
    order: 4,
    summary:
      "Handles a range of uncomplicated tasks with ease and confidence. Produces connected sentences about self, routines, and interests, mostly in present time.",
    textType: "Strings of connected sentences",
    rank: "Story Teller",
  },
  {
    id: "intermediate-high",
    label: "Intermediate High",
    short: "IH",
    band: "Intermediate",
    order: 5,
    summary:
      "Narrates and describes in all major time frames with some breakdown. Paragraph-length discourse is emerging but not consistently sustained.",
    textType: "Paragraph-like discourse emerging",
    rank: "Narrator",
  },
  {
    id: "advanced-low",
    label: "Advanced Low",
    short: "AL",
    band: "Advanced",
    order: 6,
    summary:
      "Narrates and describes in past, present, and future in paragraph-length connected discourse. Handles a situation with an unexpected complication.",
    textType: "Paragraphs",
    rank: "Debater",
  },
  {
    id: "advanced-mid",
    label: "Advanced Mid",
    short: "AM",
    band: "Advanced",
    order: 7,
    summary:
      "Communicates with ease and confidence on concrete topics of personal and general interest. Narrates and describes fully in all major time frames with good control.",
    textType: "Well-organized paragraphs",
    rank: "Ambassador",
  },
  {
    id: "advanced-high",
    label: "Advanced High",
    short: "AH",
    band: "Advanced",
    order: 8,
    summary:
      "Performs all Advanced-level tasks with linguistic ease. Can argue and hypothesize on some abstract topics, though not consistently at the Superior level.",
    textType: "Extended discourse",
    rank: "Diplomat",
  },
];

export const LEVEL_BY_ID: Record<ActflLevelId, ActflLevel> = Object.fromEntries(
  ACTFL_LEVELS.map((l) => [l.id, l]),
) as Record<ActflLevelId, ActflLevel>;

export function getLevel(id: ActflLevelId): ActflLevel {
  return LEVEL_BY_ID[id] ?? ACTFL_LEVELS[1];
}

export const MODES: { id: Mode; label: string; blurb: string; color: string }[] = [
  {
    id: "interpersonal",
    label: "Interpersonal",
    blurb: "Two-way, spontaneous negotiation of meaning",
    color: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-900",
  },
  {
    id: "interpretive",
    label: "Interpretive",
    blurb: "Understanding authentic listening, reading, and viewing",
    color: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-900",
  },
  {
    id: "presentational",
    label: "Presentational",
    blurb: "One-way, rehearsed speaking or writing for an audience",
    color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-900",
  },
];

export const MODE_BY_ID = Object.fromEntries(MODES.map((m) => [m.id, m])) as Record<
  Mode,
  (typeof MODES)[number]
>;

/**
 * The 5 Cs of the World-Readiness Standards for Learning Languages.
 */
export const FIVE_CS = [
  { id: "communication", label: "Communication", blurb: "Communicate effectively in more than one language" },
  { id: "cultures", label: "Cultures", blurb: "Interact with cultural competence and understanding" },
  { id: "connections", label: "Connections", blurb: "Connect with other disciplines and acquire information" },
  { id: "comparisons", label: "Comparisons", blurb: "Develop insight into the nature of language and culture" },
  { id: "communities", label: "Communities", blurb: "Communicate and interact in multilingual communities" },
] as const;

type CanDoSet = Record<
  "interpersonal" | "interpretiveListening" | "interpretiveReading" | "presentationalSpeaking" | "presentationalWriting",
  string
>;

/**
 * Paraphrased NCSSFL-ACTFL Can-Do benchmark statements, by sublevel.
 */
export const CAN_DO: Record<ActflLevelId, CanDoSet> = {
  "novice-low": {
    interpersonal:
      "I can communicate on some very familiar topics using single words and phrases that I have practiced and memorized.",
    interpretiveListening: "I can recognize a few memorized words and phrases when I hear them spoken.",
    interpretiveReading: "I can recognize a few letters or characters and some memorized words when I read.",
    presentationalSpeaking: "I can present information about myself and some other very familiar topics using single words or memorized phrases.",
    presentationalWriting: "I can copy some familiar words, characters, or phrases.",
  },
  "novice-mid": {
    interpersonal:
      "I can communicate on very familiar topics using a variety of words and phrases that I have practiced and memorized.",
    interpretiveListening: "I can recognize some familiar words and phrases when I hear them spoken.",
    interpretiveReading: "I can recognize some letters or characters and understand some learned or memorized words and phrases when I read.",
    presentationalSpeaking:
      "I can present information about myself and some other very familiar topics using a variety of words, phrases, and memorized expressions.",
    presentationalWriting: "I can write lists and memorized phrases on familiar topics.",
  },
  "novice-high": {
    interpersonal:
      "I can communicate and exchange information about familiar topics using phrases and simple sentences, sometimes supported by memorized language. I can usually handle short social interactions by asking and answering simple questions.",
    interpretiveListening: "I can often understand words, phrases, and simple sentences related to everyday life.",
    interpretiveReading: "I can understand familiar words, phrases, and sentences within short and simple texts related to everyday life.",
    presentationalSpeaking: "I can present basic information on familiar topics using language I have practiced, using phrases and simple sentences.",
    presentationalWriting: "I can write short messages and notes on familiar topics related to everyday life.",
  },
  "intermediate-low": {
    interpersonal:
      "I can participate in conversations on a number of familiar topics using simple sentences. I can handle short social interactions in everyday situations by asking and answering simple questions.",
    interpretiveListening: "I can understand the main idea in short, simple messages and presentations on familiar topics.",
    interpretiveReading: "I can understand the main idea of short and simple texts when the topic is familiar.",
    presentationalSpeaking: "I can present information on most familiar topics using a series of simple sentences.",
    presentationalWriting: "I can write briefly about most familiar topics and present information using a series of simple sentences.",
  },
  "intermediate-mid": {
    interpersonal:
      "I can participate in conversations on familiar topics using sentences and series of sentences. I can handle short social interactions by asking and answering a variety of questions, and can usually say what I want to say about myself and my everyday life.",
    interpretiveListening: "I can understand the main idea in messages and presentations on a variety of topics related to everyday life and personal interests.",
    interpretiveReading: "I can understand the main idea of texts related to everyday life and personal interests or studies.",
    presentationalSpeaking: "I can make presentations on a wide variety of familiar topics using connected sentences.",
    presentationalWriting: "I can write on a wide variety of familiar topics using connected sentences.",
  },
  "intermediate-high": {
    interpersonal:
      "I can participate with ease and confidence in conversations on familiar topics. I can usually talk about events and experiences in various time frames and can handle social interactions in everyday situations, sometimes even when there is an unexpected complication.",
    interpretiveListening: "I can easily understand the main idea in messages and presentations on a variety of topics, and can usually understand a few details.",
    interpretiveReading: "I can easily understand the main idea of texts related to everyday life, personal interests, and studies, and can sometimes follow stories and descriptions about events and experiences in various time frames.",
    presentationalSpeaking: "I can make presentations in a generally organized way on school, work, and community topics, and on topics I have researched. I can make presentations on some events and experiences in various time frames.",
    presentationalWriting: "I can write on topics related to school, work, and community in a generally organized way, and can write some simple paragraphs about events and experiences in various time frames.",
  },
  "advanced-low": {
    interpersonal:
      "I can participate in conversations about familiar topics that go beyond my everyday life. I can talk in an organized way and with some detail about events and experiences in various time frames, and can confidently handle routine situations with an unexpected complication.",
    interpretiveListening: "I can understand the main idea and most supporting details on a variety of topics of personal and general interest, and can follow stories and descriptions of some length and in various time frames.",
    interpretiveReading: "I can understand the main idea and most supporting details of texts on topics of personal and general interest, and can follow stories and descriptions of some length and in various time frames.",
    presentationalSpeaking: "I can deliver organized presentations appropriate to my audience on a variety of topics, and can present information about events and experiences in various time frames.",
    presentationalWriting: "I can write on general interest, academic, and professional topics. I can write organized paragraphs about events and experiences in various time frames.",
  },
  "advanced-mid": {
    interpersonal:
      "I can express myself fully not only on familiar topics but also on some concrete social, academic, and professional topics. I can talk in detail and in an organized way about events and experiences in various time frames, and can handle a complication that arises.",
    interpretiveListening: "I can understand the main idea and most details in a variety of extended spoken texts on topics of personal and general interest, including narrations across time frames.",
    interpretiveReading: "I can understand the main idea and most details of extended texts on general and academic topics, including narrations and descriptions across time frames.",
    presentationalSpeaking: "I can deliver well-organized presentations on concrete social, academic, and professional topics, and can present detailed information about events and experiences in various time frames.",
    presentationalWriting: "I can write well-organized texts for a variety of academic and professional purposes, with detail and in various time frames.",
  },
  "advanced-high": {
    interpersonal:
      "I can express myself freely and spontaneously, and for the most part accurately, on concrete topics and on most complex issues. I can usually support my opinion and develop hypotheses on topics of particular interest or expertise.",
    interpretiveListening: "I can easily follow narrative, informational, and descriptive speech, and can understand some discussions on complex or abstract topics.",
    interpretiveReading: "I can easily follow narrative, informational, and descriptive texts, and can understand some texts on complex or abstract topics.",
    presentationalSpeaking: "I can deliver detailed presentations, usually with accuracy, clarity, and precision, on a variety of topics and issues related to community interests and some specialized fields.",
    presentationalWriting: "I can write extensively with significant precision and detail on a variety of topics, most complex issues, and some special fields of interest.",
  },
};

/**
 * Default Can-Do goals suggested for a lesson at a given level.
 */
export function suggestCanDo(level: ActflLevelId): string[] {
  const set = CAN_DO[level];
  return [set.interpersonal, set.interpretiveListening, set.presentationalSpeaking];
}

export interface Language {
  id: string;
  name: string;
  /** BCP-47 tag used by the Web Speech API */
  speechCode: string;
  flag: string;
  /** Right-to-left script */
  rtl?: boolean;
  /** Languages without spaces between words need character-level comparisons */
  noSpaces?: boolean;
}

export const LANGUAGES: Language[] = [
  { id: "it", name: "Italian", speechCode: "it-IT", flag: "🇮🇹" },
  { id: "es", name: "Spanish", speechCode: "es-ES", flag: "🇪🇸" },
  { id: "es-mx", name: "Spanish (Latin America)", speechCode: "es-MX", flag: "🇲🇽" },
  { id: "fr", name: "French", speechCode: "fr-FR", flag: "🇫🇷" },
  { id: "de", name: "German", speechCode: "de-DE", flag: "🇩🇪" },
  { id: "pt", name: "Portuguese", speechCode: "pt-BR", flag: "🇧🇷" },
  { id: "zh", name: "Mandarin Chinese", speechCode: "zh-CN", flag: "🇨🇳", noSpaces: true },
  { id: "ja", name: "Japanese", speechCode: "ja-JP", flag: "🇯🇵", noSpaces: true },
  { id: "ko", name: "Korean", speechCode: "ko-KR", flag: "🇰🇷" },
  { id: "ar", name: "Arabic", speechCode: "ar-SA", flag: "🇸🇦", rtl: true },
  { id: "ru", name: "Russian", speechCode: "ru-RU", flag: "🇷🇺" },
  { id: "hi", name: "Hindi", speechCode: "hi-IN", flag: "🇮🇳" },
  { id: "en", name: "English (ELL / ESL)", speechCode: "en-US", flag: "🇺🇸" },
];

export const LANGUAGE_BY_ID = Object.fromEntries(LANGUAGES.map((l) => [l.id, l])) as Record<string, Language>;

export function getLanguage(id: string): Language {
  return LANGUAGE_BY_ID[id] ?? LANGUAGES[0];
}

/**
 * Speaking rubric aligned to ACTFL performance descriptors (Novice → Advanced).
 */
export const RUBRIC_DOMAINS = [
  {
    domain: "Language Function",
    novice: "Uses memorized words and phrases; lists and labels.",
    intermediate: "Creates with language; asks and answers questions; handles simple tasks.",
    advanced: "Narrates and describes across time frames; handles complications.",
  },
  {
    domain: "Text Type",
    novice: "Isolated words, lists, memorized chunks.",
    intermediate: "Simple sentences and strings of sentences.",
    advanced: "Connected paragraphs with cohesive devices.",
  },
  {
    domain: "Comprehensibility",
    novice: "Understood by sympathetic listeners accustomed to learners, with repetition.",
    intermediate: "Generally understood by those accustomed to learners.",
    advanced: "Understood by native speakers unaccustomed to learners.",
  },
  {
    domain: "Communication Strategies",
    novice: "Imitates, uses gestures, repeats, relies on memorized formulas.",
    intermediate: "Asks for clarification, circumlocutes simply, self-corrects sometimes.",
    advanced: "Paraphrases, elaborates, uses discourse markers, self-corrects.",
  },
  {
    domain: "Vocabulary & Accuracy",
    novice: "High-frequency vocabulary; accuracy limited to memorized material.",
    intermediate: "Vocabulary meets basic needs; accuracy decreases when creating.",
    advanced: "Broad vocabulary; good control of basic structures.",
  },
];
