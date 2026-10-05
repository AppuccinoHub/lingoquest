import { ACTFL_LEVELS, CAN_DO, getLanguage, getLevel, type ActflLevelId, type Mode, type Skill } from "./actfl";
import type { Lesson, Material, MaterialCategory, VocabItem } from "./types";

interface Ctx {
  lesson: Lesson;
  level: ReturnType<typeof getLevel>;
  langName: string;
  theme: string;
  vocab: VocabItem[];
  terms: string[];
  sentences: string[];
  structures: string[];
  /** first n vocabulary terms joined with commas */
  list: (n: number) => string;
  /** a model sentence, or a fallback built from a vocab term */
  sentence: (i?: number) => string;
  canDo: (typeof CAN_DO)[ActflLevelId];
  band: "Novice" | "Intermediate" | "Advanced";
}

interface Template {
  id: string;
  title: (c: Ctx) => string;
  category: MaterialCategory;
  modes: Mode[];
  skills: Skill[];
  /** inclusive level order range */
  min?: number;
  max?: number;
  minutes: number;
  groupSize: Material["groupSize"];
  lowAnxiety?: boolean;
  arcadeHref?: (c: Ctx) => string;
  build: (c: Ctx) => Pick<Material, "description" | "steps" | "canDo"> & Partial<Pick<Material, "differentiation" | "tip">>;
}

function buildCtx(lesson: Lesson): Ctx {
  const level = getLevel(lesson.level);
  const vocab = lesson.vocabulary.filter((v) => v.term.trim());
  const terms = vocab.map((v) => v.term.trim());
  const sentences = lesson.sentences.filter((s) => s.trim());
  const theme = lesson.theme?.trim() || lesson.title;
  return {
    lesson,
    level,
    langName: getLanguage(lesson.languageId).name,
    theme,
    vocab,
    terms,
    sentences,
    structures: lesson.structures.filter((s) => s.trim()),
    list: (n) => (terms.length ? terms.slice(0, n).join(", ") : "the lesson vocabulary"),
    sentence: (i = 0) => sentences[i % Math.max(sentences.length, 1)] ?? (terms[i] ? `… ${terms[i]} …` : "a model sentence from the lesson"),
    canDo: CAN_DO[lesson.level],
    band: level.band,
  };
}

const T: Template[] = [
  // ---------------------------------------------------------------- Warm-ups
  {
    id: "picture-talk",
    title: (c) => `Picture Talk: ${c.theme}`,
    category: "warm-up",
    modes: ["interpersonal", "interpretive"],
    skills: ["speaking", "listening"],
    minutes: 5,
    groupSize: "whole class",
    build: (c) => ({
      description: `Project a single high-interest image connected to "${c.theme}". Students call out everything they can name or describe in ${c.langName}, building from words to sentences.`,
      steps: [
        `Show the image and give 20 seconds of silent looking time.`,
        c.band === "Novice"
          ? `Students shout out any word they see: aim to hear ${c.list(5)}.`
          : `Students describe what is happening in one sentence, e.g. "${c.sentence(0)}".`,
        `Record every contribution on the board as a word bank for the rest of the lesson.`,
        c.band !== "Novice" ? `Follow-up: "What happened just before this picture? What happens next?"` : `Point-and-say: you point, class says the word in chorus.`,
      ],
      canDo: c.canDo.interpersonal,
      differentiation: "Provide a word bank on the slide for students who need support; ask heritage speakers to add details or opinions.",
    }),
  },
  {
    id: "speed-round",
    title: () => "Vocabulary Speed Round",
    category: "warm-up",
    modes: ["interpretive"],
    skills: ["listening", "speaking"],
    max: 4,
    minutes: 4,
    groupSize: "whole class",
    build: (c) => ({
      description: `A 60-second flash review of ${c.terms.length || "the"} lesson words. Students respond in chorus so nobody is singled out.`,
      steps: [
        `Say each English meaning; class responds with the ${c.langName} word (${c.list(4)}…).`,
        `Round two: show the word, class gives the meaning.`,
        `Round three: show the picture or gesture only; class says the word.`,
        `Count how many the class got in 60 seconds and try to beat it tomorrow.`,
      ],
      canDo: c.canDo.interpretiveListening,
      tip: "Choral response is the lowest-anxiety speaking there is: nobody hears a single voice.",
    }),
  },
  {
    id: "would-you-rather",
    title: (c) => `Would You Rather: ${c.theme}`,
    category: "warm-up",
    modes: ["interpersonal"],
    skills: ["speaking", "listening"],
    min: 2,
    minutes: 6,
    groupSize: "whole class",
    build: (c) => ({
      description: `Students move to one side of the room to answer forced-choice questions, then justify their choice to a neighbour.`,
      steps: [
        `Write 5 "Would you rather…" questions that use ${c.list(3)}.`,
        `Read one aloud; students move left or right.`,
        `Students turn to a neighbour on their side and give one reason${c.band === "Novice" ? " (a word or phrase is fine)" : " using a complete sentence"}.`,
        `Call on two volunteers per side to share their reason with the class.`,
      ],
      canDo: c.canDo.interpersonal,
    }),
  },
  {
    id: "four-corners",
    title: () => "Four Corners",
    category: "warm-up",
    modes: ["interpretive", "interpersonal"],
    skills: ["listening", "speaking"],
    minutes: 7,
    groupSize: "whole class",
    build: (c) => ({
      description: `Label each corner of the room with a lesson word or category. Students walk to the corner that matches a prompt, then explain why.`,
      steps: [
        `Post four signs: ${c.list(4)}.`,
        `Read a sentence or clue in ${c.langName}; students move to the matching corner.`,
        `In each corner, students say one sentence to a partner about why they are there.`,
        `Shuffle signs after 3 rounds to keep it fresh.`,
      ],
      canDo: c.canDo.interpretiveListening,
      differentiation: "Give early finishers the job of writing the next clue.",
    }),
  },
  {
    id: "daily-question",
    title: () => "Question of the Day Circle",
    category: "warm-up",
    modes: ["interpersonal"],
    skills: ["speaking", "listening"],
    min: 1,
    minutes: 5,
    groupSize: "small groups",
    build: (c) => ({
      description: `A low-stakes routine where every student answers the same question in a small circle before anyone speaks to the whole class.`,
      steps: [
        `Post the question of the day based on "${c.lesson.essentialQuestion || c.theme}".`,
        `Model an answer: "${c.sentence(0)}".`,
        `In groups of 4, students answer in turn; the group chooses one answer to share.`,
        `Groups report their chosen answer; class votes on the most interesting.`,
      ],
      canDo: c.canDo.interpersonal,
      tip: "Students only ever speak to 3 peers before anything is shared publicly, which keeps nerves low.",
    }),
  },

  // ------------------------------------------------------------ Interpretive
  {
    id: "listening-bingo",
    title: () => "Listening Bingo",
    category: "interpretive",
    modes: ["interpretive"],
    skills: ["listening"],
    max: 3,
    minutes: 10,
    groupSize: "individual",
    build: (c) => ({
      description: `Students fill a 3×3 grid with vocabulary from the lesson, then listen to a short teacher story and mark words as they hear them.`,
      steps: [
        `Students choose 9 words from ${c.list(6)}… and write them anywhere on a blank grid.`,
        `Tell a 90-second story in ${c.langName} about "${c.theme}" that uses every word at least once.`,
        `Students mark words as they hear them; first "Bingo!" retells one sentence they heard.`,
        `Replay or retell with a twist (change one detail) for round two.`,
      ],
      canDo: c.canDo.interpretiveListening,
      differentiation: "Slow the story and add gestures for support; speed it up or add distractor words for a challenge.",
    }),
  },
  {
    id: "true-false-teacher-talk",
    title: () => "True / False Teacher Talk",
    category: "interpretive",
    modes: ["interpretive"],
    skills: ["listening"],
    max: 4,
    minutes: 8,
    groupSize: "whole class",
    build: (c) => ({
      description: `Comprehensible input with instant feedback: students show thumbs up or down as you make statements about "${c.theme}".`,
      steps: [
        `Prepare 10 statements in ${c.langName} using the lesson vocabulary, half true and half obviously false.`,
        `Read each statement twice; students signal true or false.`,
        `For false statements, ask volunteers to fix them: "${c.sentence(1)}".`,
        `Finish with 3 statements about students in the room to personalise it.`,
      ],
      canDo: c.canDo.interpretiveListening,
    }),
  },
  {
    id: "infographic-scan",
    title: (c) => `Infographic Scan: ${c.theme}`,
    category: "interpretive",
    modes: ["interpretive"],
    skills: ["reading"],
    min: 1,
    max: 5,
    minutes: 12,
    groupSize: "pairs",
    build: (c) => ({
      description: `Find an authentic ${c.langName} infographic or menu, poster, or schedule about "${c.theme}". Students scan for cognates, numbers, and lesson words before answering gist questions.`,
      steps: [
        `Students circle every cognate and every word from ${c.list(5)}.`,
        `Answer 3 "where would you find…" scanning questions.`,
        c.band === "Novice" ? `Answer 3 yes/no questions about the text.` : `Write 2 sentences summarising the main idea.`,
        `Compare answers with another pair and resolve any disagreements in ${c.langName}.`,
      ],
      canDo: c.canDo.interpretiveReading,
      tip: "Authentic texts count toward the Cultures and Connections standards as well as Communication.",
    }),
  },
  {
    id: "running-dictation",
    title: () => "Running Dictation",
    category: "interpretive",
    modes: ["interpretive", "interpersonal"],
    skills: ["reading", "speaking", "writing"],
    min: 1,
    max: 5,
    minutes: 15,
    groupSize: "pairs",
    build: (c) => ({
      description: `A high-energy reading, speaking, and writing relay. One partner runs to read a sentence posted on the wall, memorises it, and dictates it to the writer.`,
      steps: [
        `Post the model sentences around the room: "${c.sentence(0)}", "${c.sentence(1)}", "${c.sentence(2)}".`,
        `Runner reads, runs back, and dictates; writer writes. Swap roles each sentence.`,
        `Pairs check their text against the originals and fix errors.`,
        `Bonus: pairs put the sentences in a logical order.`,
      ],
      canDo: c.canDo.interpretiveReading,
      differentiation: "Shorten sentences or post them closer for students who need support.",
    }),
  },
  {
    id: "sequencing-strips",
    title: () => "Sequencing Strips",
    category: "interpretive",
    modes: ["interpretive"],
    skills: ["reading"],
    min: 2,
    minutes: 10,
    groupSize: "small groups",
    build: (c) => ({
      description: `Students reorder cut-up sentence strips to rebuild a short text about "${c.theme}".`,
      steps: [
        `Write a 6-8 sentence mini-story using the model sentences (start from "${c.sentence(0)}").`,
        `Cut into strips and shuffle; groups rebuild the order.`,
        `Groups read the story aloud together to check it flows.`,
        `Extension: remove one strip and groups write a replacement.`,
      ],
      canDo: c.canDo.interpretiveReading,
    }),
  },
  {
    id: "authentic-text-hunt",
    title: () => "Authentic Resource Hunt",
    category: "interpretive",
    modes: ["interpretive"],
    skills: ["reading", "listening"],
    min: 3,
    minutes: 20,
    groupSize: "small groups",
    build: (c) => ({
      description: `Groups find a short authentic resource (song, ad, social post, short video) in ${c.langName} about "${c.theme}" and complete a gist-and-detail organiser.`,
      steps: [
        `Each group finds one resource and records the source.`,
        `Complete: main idea, 3 key details, 3 new words, 1 cultural observation.`,
        `Groups swap resources and check each other's organisers.`,
        `Class compiles a shared list of the best resources for the unit.`,
      ],
      canDo: c.canDo.interpretiveReading,
      tip: "Keep a class playlist or padlet of authentic resources to reuse in future years.",
    }),
  },
  {
    id: "cloze-listening",
    title: () => "Cloze Listening",
    category: "interpretive",
    modes: ["interpretive"],
    skills: ["listening", "writing"],
    min: 2,
    minutes: 10,
    groupSize: "individual",
    build: (c) => ({
      description: `A gapped transcript of a short teacher monologue or song. Students fill the blanks with lesson vocabulary as they listen.`,
      steps: [
        `Write a 100-word text using ${c.list(6)}; blank out 10 target words.`,
        `Read at natural pace twice; students fill blanks.`,
        `Reveal answers; students check and tally.`,
        `Discuss any words that were tricky to hear and why.`,
      ],
      canDo: c.canDo.interpretiveListening,
    }),
  },
  {
    id: "gist-detail-ladder",
    title: () => "Gist → Detail → Inference Ladder",
    category: "interpretive",
    modes: ["interpretive"],
    skills: ["reading", "listening"],
    min: 4,
    minutes: 20,
    groupSize: "individual",
    build: (c) => ({
      description: `A three-rung comprehension protocol modelled on the Interpretive task of an IPA.`,
      steps: [
        `Rung 1 (Gist): one sentence summarising a ${c.langName} text about "${c.theme}".`,
        `Rung 2 (Detail): 5 supporting details with evidence from the text.`,
        `Rung 3 (Inference): the author's perspective, audience, and purpose; cultural products or practices mentioned.`,
        `Peer review: swap and check each rung has text evidence.`,
      ],
      canDo: c.canDo.interpretiveReading,
    }),
  },

  // ------------------------------------------------------------ Interpersonal
  {
    id: "find-someone-who",
    title: () => "Find Someone Who…",
    category: "interpersonal",
    modes: ["interpersonal"],
    skills: ["speaking", "listening"],
    min: 1,
    max: 5,
    minutes: 12,
    groupSize: "whole class",
    lowAnxiety: true,
    build: (c) => ({
      description: `Students circulate with a grid of 9 prompts, asking classmates questions until they find someone who matches each box. Everyone is talking at once, so nobody is on stage.`,
      steps: [
        `Build a 3×3 grid of prompts related to "${c.theme}" using ${c.list(5)}.`,
        `Model the question form: "${c.sentence(0)}" → turn into a yes/no question.`,
        `Students may only write a name after asking in ${c.langName} and getting an answer.`,
        `Debrief: "Who found someone who…?" Students report in third person.`,
      ],
      canDo: c.canDo.interpersonal,
      differentiation: "Print the question stems on the grid for students who need support.",
    }),
  },
  {
    id: "info-gap",
    title: () => "Information Gap Grid",
    category: "interpersonal",
    modes: ["interpersonal"],
    skills: ["speaking", "listening"],
    min: 1,
    max: 5,
    minutes: 12,
    groupSize: "pairs",
    lowAnxiety: true,
    build: (c) => ({
      description: `Partner A and Partner B each hold half the information about a schedule, menu, or chart on "${c.theme}". They must ask and answer to complete it, without peeking.`,
      steps: [
        `Create two versions of a table with complementary blanks using ${c.list(6)}.`,
        `Partners sit back to back or with a folder between them.`,
        `They take turns asking questions until both grids are complete.`,
        `Reveal and compare; pairs count how many matched.`,
      ],
      canDo: c.canDo.interpersonal,
      tip: "Info-gap tasks force genuine negotiation of meaning, the heart of the Interpersonal mode.",
    }),
  },
  {
    id: "speed-chat",
    title: () => "Speed Chat Rotation",
    category: "interpersonal",
    modes: ["interpersonal"],
    skills: ["speaking", "listening"],
    min: 2,
    minutes: 12,
    groupSize: "pairs",
    lowAnxiety: true,
    build: (c) => ({
      description: `Two concentric circles. Inner circle stays, outer circle rotates every 90 seconds. Each rotation gets a new question about "${c.theme}".`,
      steps: [
        `Post 5 questions that use the lesson structures (${c.structures[0] ?? "the target structure"}).`,
        `Partners talk for 90 seconds; both must ask at least one follow-up question.`,
        `Rotate. Students may reuse what they said, which builds fluency through repetition.`,
        `Final round: students report one interesting thing they learned about a classmate.`,
      ],
      canDo: c.canDo.interpersonal,
      differentiation: "Hand out sentence-starter cards; let shy students keep the same partner for two rounds.",
    }),
  },
  {
    id: "role-play-cards",
    title: (c) => `Role-Play Cards: ${c.theme}`,
    category: "interpersonal",
    modes: ["interpersonal"],
    skills: ["speaking", "listening"],
    min: 2,
    minutes: 15,
    groupSize: "pairs",
    build: (c) => ({
      description: `Scenario cards with a role, a goal, and a secret twist. Pairs improvise a short exchange in ${c.langName}.`,
      steps: [
        `Write 6 scenario cards built around "${c.theme}" (e.g. a customer and a vendor, two friends planning).`,
        c.band === "Advanced" ? `Add an unexpected complication to each card that students must resolve.` : `Include 3 required words on each card from ${c.list(6)}.`,
        `Pairs rehearse once, then perform for another pair (not the whole class).`,
        `Listening pair gives one compliment and one suggestion using a rubric.`,
      ],
      canDo: c.canDo.interpersonal,
      tip: "Performing for one other pair instead of the class removes most of the fear while keeping accountability.",
    }),
  },
  {
    id: "interview-report",
    title: () => "Interview & Report",
    category: "interpersonal",
    modes: ["interpersonal", "presentational"],
    skills: ["speaking", "listening", "writing"],
    min: 3,
    minutes: 20,
    groupSize: "pairs",
    build: (c) => ({
      description: `Students interview a partner about "${c.theme}" with 5 questions, take notes, then write or say a short third-person report.`,
      steps: [
        `Students write 5 questions using ${c.structures[0] ?? "the lesson structures"}.`,
        `Conduct the interview; note answers in ${c.langName}.`,
        `Produce a ${c.band === "Intermediate" ? "5-sentence" : "paragraph-length"} report about the partner.`,
        `Partner checks the report for accuracy.`,
      ],
      canDo: c.canDo.interpersonal,
    }),
  },
  {
    id: "agree-disagree-line",
    title: () => "Agree / Disagree Continuum",
    category: "interpersonal",
    modes: ["interpersonal"],
    skills: ["speaking", "listening"],
    min: 4,
    minutes: 10,
    groupSize: "whole class",
    build: (c) => ({
      description: `Students stand along a line from "strongly agree" to "strongly disagree" in response to opinion statements about "${c.theme}", then defend their position.`,
      steps: [
        `Read an opinion statement in ${c.langName}; students position themselves.`,
        `Students explain their position to the nearest person who disagrees.`,
        `Invite 2-3 students to share; others may move if persuaded.`,
        `Repeat with 3-4 statements.`,
      ],
      canDo: c.canDo.interpersonal,
    }),
  },
  {
    id: "question-ping-pong",
    title: () => "Question Ping-Pong",
    category: "interpersonal",
    modes: ["interpersonal"],
    skills: ["speaking", "listening"],
    min: 2,
    max: 5,
    minutes: 6,
    groupSize: "pairs",
    lowAnxiety: true,
    build: (c) => ({
      description: `Partners volley questions back and forth about "${c.theme}". Every answer must end with a new question. Count the rally; longest rally wins.`,
      steps: [
        `Model a 4-turn rally with a student volunteer.`,
        `Pairs rally for 2 minutes and count turns; questions must use ${c.list(3)}.`,
        `Pairs report their longest rally; celebrate the top three.`,
        `Round two with a new partner to beat the record.`,
      ],
      canDo: c.canDo.interpersonal,
    }),
  },
  {
    id: "trading-market",
    title: () => "Vocabulary Trading Market",
    category: "interpersonal",
    modes: ["interpersonal"],
    skills: ["speaking", "listening"],
    max: 2,
    minutes: 10,
    groupSize: "whole class",
    lowAnxiety: true,
    build: (c) => ({
      description: `Every student gets a vocabulary card. They must trade cards by saying the word (or a sentence with it) to a partner. The goal: collect a set of 3 related words.`,
      steps: [
        `Print cards for ${c.list(8)}, 2-3 copies each.`,
        `Students approach a classmate, say their word, and trade.`,
        `First to collect 3 words from the same category wins and must say all three in a phrase.`,
        `Reshuffle and play again.`,
      ],
      canDo: c.canDo.interpersonal,
    }),
  },
  {
    id: "mystery-guest",
    title: () => "Mystery Guest",
    category: "interpersonal",
    modes: ["interpersonal"],
    skills: ["speaking", "listening"],
    min: 2,
    minutes: 10,
    groupSize: "small groups",
    build: (c) => ({
      description: `One student secretly draws a vocabulary card. The group asks yes/no questions in ${c.langName} to guess it.`,
      steps: [
        `Prepare cards from ${c.list(8)}.`,
        `Groups of 4; the guest answers only "yes" or "no" in ${c.langName}.`,
        `Groups get 10 questions per card; keep score.`,
        `Rotate guests so everyone speaks.`,
      ],
      canDo: c.canDo.interpersonal,
    }),
  },
  {
    id: "partner-survey",
    title: () => "Partner Survey & Class Graph",
    category: "interpersonal",
    modes: ["interpersonal", "presentational"],
    skills: ["speaking", "listening", "writing"],
    min: 1,
    max: 4,
    minutes: 15,
    groupSize: "whole class",
    build: (c) => ({
      description: `Students survey 5 classmates about "${c.theme}", tally results, and build a class bar graph labelled in ${c.langName}. Connects to math (Connections standard).`,
      steps: [
        `Students write one survey question using ${c.structures[0] ?? "a lesson structure"}.`,
        `Survey 5 classmates; record answers.`,
        `Pool results on the board; build a bar graph.`,
        `Students write 3 sentences interpreting the graph (e.g. "most students…").`,
      ],
      canDo: c.canDo.interpersonal,
    }),
  },

  // ----------------------------------------------------------- Presentational
  {
    id: "one-minute-talk",
    title: () => "One-Minute Mini-Talk",
    category: "presentational",
    modes: ["presentational"],
    skills: ["speaking"],
    min: 2,
    minutes: 15,
    groupSize: "small groups",
    build: (c) => ({
      description: `Students prepare a 60-second talk about "${c.theme}" from a 5-word note card, then deliver it to a group of three (not the class).`,
      steps: [
        `Students choose 5 key words from ${c.list(8)} for their note card.`,
        `Rehearse once silently and once in a whisper.`,
        `Deliver to a group of 3; listeners note one thing they learned.`,
        `Optional: record on a phone for a portfolio.`,
      ],
      canDo: c.canDo.presentationalSpeaking,
      differentiation: "Allow Novice students to use a sentence-frame card instead of key words.",
    }),
  },
  {
    id: "comic-strip",
    title: () => "Vocabulary Comic Strip",
    category: "presentational",
    modes: ["presentational"],
    skills: ["writing"],
    max: 4,
    minutes: 20,
    groupSize: "individual",
    build: (c) => ({
      description: `A 4-panel comic about "${c.theme}" where each panel uses at least one lesson word in a speech bubble.`,
      steps: [
        `Students sketch 4 panels (stick figures welcome).`,
        `Each bubble uses words from ${c.list(6)}; at least one panel uses "${c.sentence(0)}" or a variation.`,
        `Gallery walk: classmates leave a sticky-note reaction in ${c.langName}.`,
        `Display or scan for a class comic book.`,
      ],
      canDo: c.canDo.presentationalWriting,
    }),
  },
  {
    id: "voice-memo",
    title: () => "Private Voice Memo",
    category: "presentational",
    modes: ["presentational"],
    skills: ["speaking"],
    min: 1,
    minutes: 10,
    groupSize: "individual",
    lowAnxiety: true,
    build: (c) => ({
      description: `Students record a 30-60 second voice memo about "${c.theme}" and submit it privately. Only the teacher listens. Many anxious speakers do their best work this way.`,
      steps: [
        `Post the prompt and 3 required words from ${c.list(5)}.`,
        `Students may re-record as many times as they like within 8 minutes.`,
        `Submit via your LMS or the Speak Quest arcade game.`,
        `Give one-line audio feedback focusing on communication, not errors.`,
      ],
      canDo: c.canDo.presentationalSpeaking,
      tip: "Pair this with the Speak Quest game: students practise privately with speech recognition before recording.",
    }),
  },
  {
    id: "poster-gallery",
    title: (c) => `Poster Gallery Walk: ${c.theme}`,
    category: "presentational",
    modes: ["presentational", "interpretive"],
    skills: ["writing", "reading"],
    minutes: 25,
    groupSize: "small groups",
    build: (c) => ({
      description: `Groups create a labelled poster about one aspect of "${c.theme}", then rotate through the gallery completing a scavenger-hunt sheet.`,
      steps: [
        `Assign each group a sub-topic; posters must include ${c.band === "Novice" ? "8 labelled images" : "a title, 5 sentences, and 2 images"}.`,
        `Groups post work around the room.`,
        `Rotate every 2 minutes; find answers to 6 scavenger questions.`,
        `Groups answer one question from visitors in ${c.langName}.`,
      ],
      canDo: c.canDo.presentationalWriting,
    }),
  },
  {
    id: "postcard",
    title: () => "Postcard or Text Message",
    category: "presentational",
    modes: ["presentational"],
    skills: ["writing"],
    min: 1,
    max: 5,
    minutes: 12,
    groupSize: "individual",
    build: (c) => ({
      description: `A short, authentic-feeling piece of writing: a postcard, text thread, or social post about "${c.theme}".`,
      steps: [
        `Give a template (greeting, 3-5 sentences, closing).`,
        `Require 4 words from ${c.list(6)} and the structure "${c.structures[0] ?? "the lesson structure"}".`,
        `Students swap and write a short reply.`,
        `Post the best exchanges on a class wall.`,
      ],
      canDo: c.canDo.presentationalWriting,
    }),
  },
  {
    id: "top-five",
    title: () => "Top-5 List Presentation",
    category: "presentational",
    modes: ["presentational"],
    skills: ["speaking", "writing"],
    max: 2,
    minutes: 12,
    groupSize: "pairs",
    build: (c) => ({
      description: `A list-based presentation that is perfectly matched to Novice text type: pairs present their "Top 5" related to "${c.theme}" with an image each.`,
      steps: [
        `Pairs pick their top 5 from ${c.list(8)} and rank them.`,
        `Each item gets a phrase: number + word + a simple opinion (e.g. "${c.sentence(0)}").`,
        `Present to another pair; audience votes for their favourite item.`,
        `Combine votes for a class Top 5.`,
      ],
      canDo: c.canDo.presentationalSpeaking,
    }),
  },
  {
    id: "story-chain",
    title: () => "Collaborative Story Chain",
    category: "presentational",
    modes: ["presentational"],
    skills: ["writing", "speaking"],
    min: 3,
    minutes: 15,
    groupSize: "small groups",
    build: (c) => ({
      description: `Groups write a story one sentence at a time, passing the paper after each sentence. Every sentence must include a lesson word.`,
      steps: [
        `Start with "${c.sentence(0)}" as the first line.`,
        `Each student adds a sentence using one of ${c.list(6)} and passes the paper.`,
        c.band === "Advanced" ? `Require at least two time frames (past and future) in the story.` : `After 6 passes, groups read the story aloud.`,
        `Groups perform their favourite story as a mini-play.`,
      ],
      canDo: c.canDo.presentationalWriting,
    }),
  },

  // -------------------------------------------------------------------- Games
  {
    id: "flyswatter",
    title: () => "Flyswatter Slap",
    category: "game",
    modes: ["interpretive"],
    skills: ["listening", "reading"],
    max: 2,
    minutes: 8,
    groupSize: "whole class",
    build: (c) => ({
      description: `Lesson words scattered on the board. Two players race to slap the word you say or describe.`,
      steps: [
        `Write ${c.list(10)} randomly across the board.`,
        `Two students at the board with flyswatters; say the English or a clue in ${c.langName}.`,
        `First slap wins a point for their team; rotate players every 2 words.`,
        `Level up: describe the word instead of saying it.`,
      ],
      canDo: c.canDo.interpretiveListening,
    }),
  },
  {
    id: "quiz-bowl",
    title: (c) => `Quiz Bowl: ${c.theme}`,
    category: "game",
    modes: ["interpretive", "interpersonal"],
    skills: ["listening", "speaking"],
    minutes: 15,
    groupSize: "small groups",
    build: (c) => ({
      description: `Team trivia with escalating categories: Vocabulary (100), Sentences (200), Culture (300), Speak It (400).`,
      steps: [
        `Build a 4×4 grid of questions. Vocabulary uses ${c.list(4)}; Culture draws on "${c.lesson.cultureNote || c.theme}".`,
        `"Speak It" questions require the team to produce a sentence like "${c.sentence(0)}".`,
        `Teams confer in ${c.langName} before answering (that is the real practice).`,
        `Highest total wins; everyone who spoke gets a bonus point.`,
      ],
      canDo: c.canDo.interpersonal,
    }),
  },
  {
    id: "charades",
    title: () => "Charades & Pictionary",
    category: "game",
    modes: ["interpersonal"],
    skills: ["speaking"],
    max: 3,
    minutes: 10,
    groupSize: "small groups",
    lowAnxiety: true,
    build: (c) => ({
      description: `Classic guessing games with a twist: guessers must say the word in ${c.langName} and the actor must confirm with a full phrase.`,
      steps: [
        `Cards from ${c.list(10)}.`,
        `Groups of 5; actor draws a card and acts or draws.`,
        `Guesser who gets it says the word; actor replies "Sí/Oui/Ja… ${c.sentence(0)}" or similar confirmation phrase.`,
        `Two minutes per actor; most cards wins.`,
      ],
      canDo: c.canDo.interpersonal,
      tip: "Guessing games put the attention on the clue, not the speaker, which is why anxious students love them.",
    }),
  },
  {
    id: "hot-seat",
    title: () => "Hot Seat (Back to the Board)",
    category: "game",
    modes: ["interpersonal"],
    skills: ["speaking", "listening"],
    min: 1,
    minutes: 10,
    groupSize: "small groups",
    build: (c) => ({
      description: `One team member faces away from the board while teammates describe the projected word in ${c.langName} without saying it.`,
      steps: [
        `Project a word from ${c.list(8)} behind the hot-seat student.`,
        `Teammates describe, define, or give examples; no English, no gestures.`,
        `One minute per word; rotate the hot seat.`,
        c.band === "Novice" ? `Allow a word bank of describing words on the wall.` : `Ban the 3 most obvious related words for extra challenge.`,
      ],
      canDo: c.canDo.interpersonal,
    }),
  },
  {
    id: "sentence-auction",
    title: () => "Sentence Auction",
    category: "game",
    modes: ["interpretive"],
    skills: ["reading"],
    min: 3,
    minutes: 15,
    groupSize: "small groups",
    build: (c) => ({
      description: `Teams bid play money on sentences they believe are grammatically correct. Buying a wrong sentence loses the money.`,
      steps: [
        `Write 10 sentences based on "${c.sentence(0)}" and the structure "${c.structures[0] ?? "the lesson structure"}"; make 5 of them subtly wrong.`,
        `Teams get $1000 and bid on sentences.`,
        `Reveal: correct sentences keep their value, wrong ones lose it.`,
        `Teams fix the wrong sentences to win back half the money.`,
      ],
      canDo: c.canDo.interpretiveReading,
    }),
  },
  {
    id: "board-race",
    title: () => "Board Race Relay",
    category: "game",
    modes: ["presentational"],
    skills: ["writing"],
    max: 4,
    minutes: 8,
    groupSize: "whole class",
    build: (c) => ({
      description: `Teams line up; one marker per team. Each runner writes one word or sentence on the board, then passes the marker.`,
      steps: [
        `Call a category related to "${c.theme}" (e.g. words from ${c.list(3)}).`,
        c.band === "Novice" ? `Runners write any word in that category.` : `Runners write a full sentence containing the category word.`,
        `Teams check each other's boards; correct items score.`,
        `Three rounds; most points wins.`,
      ],
      canDo: c.canDo.presentationalWriting,
    }),
  },
  {
    id: "taboo",
    title: () => "Taboo: Forbidden Words",
    category: "game",
    modes: ["interpersonal"],
    skills: ["speaking", "listening"],
    min: 2,
    minutes: 12,
    groupSize: "small groups",
    build: (c) => ({
      description: `Describe the target word without using the three forbidden words on the card. Builds circumlocution, a core Intermediate strategy.`,
      steps: [
        `Make cards: target word from ${c.list(10)} plus 3 taboo words each.`,
        `Groups of 4; clue-giver has 60 seconds to get as many cards as possible.`,
        `A buzzer-holder watches for taboo words.`,
        `Record the best circumlocutions on the board as model language.`,
      ],
      canDo: c.canDo.interpersonal,
    }),
  },
  {
    id: "two-truths",
    title: () => "Two Truths and a Lie",
    category: "game",
    modes: ["interpersonal", "presentational"],
    skills: ["speaking", "listening"],
    min: 2,
    minutes: 10,
    groupSize: "small groups",
    build: (c) => ({
      description: `Students write three statements about themselves related to "${c.theme}", one false. Groups guess the lie by asking follow-up questions.`,
      steps: [
        `Each student writes 3 statements using ${c.list(4)} (model: "${c.sentence(0)}").`,
        `Read to the group; group asks up to 3 follow-up questions.`,
        `Group votes; reveal the lie.`,
        `Points for fooling the group and for catching the lie.`,
      ],
      canDo: c.canDo.interpersonal,
    }),
  },
  {
    id: "battleship",
    title: () => "Battleship Grid",
    category: "game",
    modes: ["interpersonal"],
    skills: ["speaking", "listening"],
    min: 1,
    max: 4,
    minutes: 15,
    groupSize: "pairs",
    lowAnxiety: true,
    build: (c) => ({
      description: `A grid where rows are subjects or people and columns are lesson words. To "fire", a student must say the full combination correctly.`,
      steps: [
        `Rows: yo / tú / él… (or lesson-specific subjects). Columns: ${c.list(5)}.`,
        `Each player hides 3 ships on their grid.`,
        `To call a square, say the sentence (e.g. "${c.sentence(0)}"). Correct sentence = valid shot.`,
        `First to sink all ships wins.`,
      ],
      canDo: c.canDo.interpersonal,
    }),
  },

  // --------------------------------------------------------------- Assessment
  {
    id: "exit-ticket",
    title: () => "Exit Ticket: 3-2-1",
    category: "assessment",
    modes: ["presentational"],
    skills: ["writing"],
    minutes: 5,
    groupSize: "individual",
    build: (c) => ({
      description: `A quick formative check before the bell.`,
      steps: [
        `3 words from today's lesson you can use (from ${c.list(8)}).`,
        `2 ${c.band === "Novice" ? "phrases" : "sentences"} about "${c.theme}".`,
        `1 question you still have, or one thing you want to say but cannot yet.`,
        `Sort tickets into "got it / nearly / reteach" piles for tomorrow's warm-up.`,
      ],
      canDo: c.canDo.presentationalWriting,
    }),
  },
  {
    id: "can-do-self-check",
    title: () => "Can-Do Self-Assessment",
    category: "assessment",
    modes: ["interpersonal", "interpretive", "presentational"],
    skills: ["speaking", "listening", "reading", "writing"],
    minutes: 5,
    groupSize: "individual",
    build: (c) => ({
      description: `Students rate themselves on the lesson's Can-Do statements: "Not yet", "With help", "I can", "I can teach it". Self-assessment is a core practice in the NCSSFL-ACTFL Can-Do framework.`,
      steps: c.lesson.canDo.length
        ? c.lesson.canDo.map((s, i) => `Can-Do ${i + 1}: ${s}`)
        : [c.canDo.interpersonal, c.canDo.interpretiveListening, c.canDo.presentationalSpeaking],
      canDo: c.canDo.interpersonal,
      tip: "Students can track the same statements in the arcade; their self-checks are stored on their device.",
    }),
  },
  {
    id: "ipa-blueprint",
    title: (c) => `IPA Blueprint: ${c.theme}`,
    category: "assessment",
    modes: ["interpretive", "interpersonal", "presentational"],
    skills: ["speaking", "listening", "reading", "writing"],
    min: 2,
    minutes: 45,
    groupSize: "individual",
    build: (c) => ({
      description: `An Integrated Performance Assessment outline: three linked tasks across the three modes, all built around "${c.theme}".`,
      steps: [
        `Interpretive task: students read or listen to an authentic ${c.langName} text on "${c.theme}" and complete a comprehension guide (key words, main idea, details, inference).`,
        `Interpersonal task: in pairs, students discuss the text and plan something related (unrehearsed, 3-4 minutes).`,
        `Presentational task: students produce a ${c.band === "Novice" ? "labelled poster or short recorded message" : "short talk or written piece"} for a real audience.`,
        `Score each task with the ACTFL performance rubric; share the rubric before students begin.`,
      ],
      canDo: c.canDo.presentationalSpeaking,
    }),
  },
  {
    id: "speaking-rubric",
    title: () => "Speaking Rubric (ACTFL-aligned)",
    category: "assessment",
    modes: ["interpersonal", "presentational"],
    skills: ["speaking"],
    minutes: 0,
    groupSize: "individual",
    build: (c) => ({
      description: `A ready-to-print rubric for any speaking task in this lesson, with the ${c.level.label} descriptors as the "meets" column.`,
      steps: [
        `Language function: ${c.level.summary}`,
        `Text type: ${c.level.textType}.`,
        `Comprehensibility: understood by a ${c.band === "Advanced" ? "native speaker unaccustomed to learners" : "sympathetic listener accustomed to learners"}.`,
        `Strategies: ${c.band === "Novice" ? "repeats, imitates, uses gestures" : c.band === "Intermediate" ? "asks for clarification, circumlocutes" : "paraphrases, elaborates, self-corrects"}.`,
        `Open the full rubric from the Rubric tab to print.`,
      ],
      canDo: c.canDo.presentationalSpeaking,
    }),
  },
  {
    id: "quick-check",
    title: () => "Whiteboard Quick Check",
    category: "assessment",
    modes: ["interpretive", "presentational"],
    skills: ["listening", "writing"],
    minutes: 6,
    groupSize: "individual",
    build: (c) => ({
      description: `Mini-whiteboards for instant, whole-class formative assessment. Every student answers every question and nobody is singled out.`,
      steps: [
        `Say a definition or show an image; students write the word (${c.list(5)}).`,
        `Say an English sentence; students write it in ${c.langName} (model: "${c.sentence(0)}").`,
        `"Boards up!" on three; scan for patterns.`,
        `Reteach any item fewer than 80% got right.`,
      ],
      canDo: c.canDo.interpretiveListening,
    }),
  },

  // ------------------------------------------------------------------ Culture
  {
    id: "culture-venn",
    title: () => "Cultural Comparison Venn",
    category: "culture",
    modes: ["interpersonal", "presentational"],
    skills: ["speaking", "writing"],
    min: 1,
    minutes: 15,
    groupSize: "pairs",
    build: (c) => ({
      description: `Compare how "${c.theme}" looks in a ${c.langName}-speaking community and in students' own community. Targets the Comparisons standard.`,
      steps: [
        `Share a short cultural note: "${c.lesson.cultureNote || `how ${c.theme} is experienced in a ${c.langName}-speaking culture`}".`,
        `Pairs fill a Venn diagram ${c.band === "Novice" ? "with words and phrases" : "with sentences"} in ${c.langName}.`,
        `Share one similarity and one difference with another pair.`,
        `Discuss: what surprised you?`,
      ],
      canDo: c.canDo.interpersonal,
    }),
  },
  {
    id: "three-ps",
    title: () => "Products, Practices, Perspectives",
    category: "culture",
    modes: ["interpretive", "presentational"],
    skills: ["reading", "speaking"],
    min: 2,
    minutes: 20,
    groupSize: "small groups",
    build: (c) => ({
      description: `Use the ACTFL cultural framework to analyse one cultural element connected to "${c.theme}".`,
      steps: [
        `Product: what tangible or intangible thing is involved? (e.g. a food, song, object, holiday)`,
        `Practice: what do people do with it, when, and with whom?`,
        `Perspective: what values or beliefs explain the practice?`,
        `Groups present their triangle in ${c.langName}${c.band === "Novice" ? " using key words and images" : ""}.`,
      ],
      canDo: c.canDo.presentationalSpeaking,
    }),
  },
  {
    id: "community-connection",
    title: () => "Community Connection Task",
    category: "culture",
    modes: ["interpersonal"],
    skills: ["speaking", "listening"],
    min: 3,
    minutes: 30,
    groupSize: "individual",
    build: (c) => ({
      description: `Students use ${c.langName} beyond the classroom (Communities standard): interview a speaker, visit a local business, or join an online community related to "${c.theme}".`,
      steps: [
        `Students prepare 5 questions using the lesson structures.`,
        `Complete the interaction (in person, video call, or asynchronous message).`,
        `Record 3 things learned and 1 new word or expression.`,
        `Share a 1-minute reflection with a small group.`,
      ],
      canDo: c.canDo.interpersonal,
    }),
  },
  {
    id: "cross-curricular",
    title: () => "Cross-Curricular Link",
    category: "culture",
    modes: ["interpretive", "presentational"],
    skills: ["reading", "writing"],
    minutes: 15,
    groupSize: "pairs",
    build: (c) => ({
      description: `Connect "${c.theme}" to another subject (Connections standard): a math problem, a science fact, a geography map, or a history timeline, all in ${c.langName}.`,
      steps: [
        `Choose the link: numbers and prices, nutrition and health, climate and geography, or history.`,
        `Create a mini-task using 5 words from ${c.list(6)}.`,
        `Swap with another pair and solve.`,
        `Discuss which words were new and useful in both subjects.`,
      ],
      canDo: c.canDo.interpretiveReading,
    }),
  },

  // ----------------------------------------------------------------- Homework
  {
    id: "voice-journal",
    title: () => "Voice Journal Prompt",
    category: "homework",
    modes: ["presentational"],
    skills: ["speaking"],
    min: 1,
    minutes: 10,
    groupSize: "individual",
    lowAnxiety: true,
    build: (c) => ({
      description: `A private spoken journal entry recorded at home about "${c.theme}". No audience, unlimited retries.`,
      steps: [
        `Prompt: "${c.lesson.essentialQuestion || `Tell me about ${c.theme}`}".`,
        `Requirements: ${c.band === "Novice" ? "30 seconds, 5 lesson words" : c.band === "Intermediate" ? "60 seconds, connected sentences, 2 questions" : "90 seconds, two time frames, one opinion"}.`,
        `Warm up with the Speak Quest arcade game first.`,
        `Submit privately; teacher replies with a short audio comment.`,
      ],
      canDo: c.canDo.presentationalSpeaking,
    }),
  },
  {
    id: "family-interview",
    title: () => "Family or Friend Interview",
    category: "homework",
    modes: ["interpersonal", "presentational"],
    skills: ["speaking", "writing"],
    min: 2,
    minutes: 20,
    groupSize: "individual",
    build: (c) => ({
      description: `Students teach a family member 5 words about "${c.theme}" and interview them (in English or ${c.langName}), then report back in ${c.langName}.`,
      steps: [
        `Teach 5 words from ${c.list(5)} to someone at home.`,
        `Ask them 3 questions about the topic.`,
        `Write ${c.band === "Novice" ? "3 phrases" : "a short paragraph"} reporting what they said.`,
        `Share with a partner in class tomorrow.`,
      ],
      canDo: c.canDo.presentationalWriting,
    }),
  },
  {
    id: "flashcards",
    title: () => "Flashcard Deck + Spaced Review",
    category: "homework",
    modes: ["interpretive"],
    skills: ["reading"],
    minutes: 10,
    groupSize: "individual",
    build: (c) => ({
      description: `A print-or-digital flashcard set for all ${c.terms.length || "lesson"} words with a review schedule.`,
      steps: [
        `Front: ${c.langName} word; back: meaning and an example sentence (e.g. "${c.sentence(0)}").`,
        `Day 1: all cards. Day 2: missed cards. Day 4: all cards. Day 7: all cards.`,
        `Students sort cards into "know / almost / not yet" piles each session.`,
        `Play Vocab Blitz in the arcade to test recall under time pressure.`,
      ],
      canDo: c.canDo.interpretiveReading,
    }),
  },

  // ------------------------------------------------------------------- Arcade
  {
    id: "arcade-speak",
    title: () => "Speak Quest (digital)",
    category: "arcade",
    modes: ["presentational", "interpersonal"],
    skills: ["speaking"],
    minutes: 10,
    groupSize: "individual",
    lowAnxiety: true,
    arcadeHref: (c) => `/play/${c.lesson.id}/speak`,
    build: (c) => ({
      description: `Students speak the lesson's words and sentences to their own device. Speech recognition scores them privately and awards XP. Nobody else hears a thing.`,
      steps: [
        `Students open the arcade link on a phone, tablet, or laptop with a microphone.`,
        `Stage 1 repeats words (${c.list(3)}…), Stage 2 repeats sentences, Stage 3 answers open prompts.`,
        `Each attempt earns XP; three stars for 85%+ match.`,
        `Review the class leaderboard (optional, names can be hidden).`,
      ],
      canDo: c.canDo.presentationalSpeaking,
      tip: "Works in Chrome and Edge; in other browsers the game falls back to a timed self-rating.",
    }),
  },
  {
    id: "arcade-blitz",
    title: () => "Vocab Blitz (digital)",
    category: "arcade",
    modes: ["interpretive"],
    skills: ["reading"],
    minutes: 5,
    groupSize: "individual",
    arcadeHref: (c) => `/play/${c.lesson.id}/blitz`,
    build: (c) => ({
      description: `A 60-second multiple-choice sprint over the ${c.terms.length || "lesson"} vocabulary words with combo multipliers.`,
      steps: [
        `Students see a meaning and tap the matching ${c.langName} word.`,
        `Consecutive correct answers build a combo multiplier.`,
        `Best score is saved; badges unlock at 5× combo and 90% accuracy.`,
        `Use as a 5-minute opener on devices.`,
      ],
      canDo: c.canDo.interpretiveReading,
    }),
  },
  {
    id: "arcade-scramble",
    title: () => "Sentence Scramble (digital)",
    category: "arcade",
    modes: ["interpretive", "presentational"],
    skills: ["reading", "writing"],
    minutes: 5,
    groupSize: "individual",
    arcadeHref: (c) => `/play/${c.lesson.id}/scramble`,
    build: (c) => ({
      description: `Students rebuild the lesson's model sentences from shuffled chunks, then say them aloud for bonus XP.`,
      steps: [
        `Sentences come from the lesson: "${c.sentence(0)}", "${c.sentence(1)}"…`,
        `Tap chunks in order; wrong taps cost a heart.`,
        `Bonus: read the finished sentence aloud for extra XP.`,
        `Add more model sentences to the lesson to extend the game.`,
      ],
      canDo: c.canDo.interpretiveReading,
    }),
  },
];

export const CATEGORY_META: Record<MaterialCategory, { label: string; blurb: string }> = {
  "warm-up": { label: "Warm-ups", blurb: "Bell-ringers and openers" },
  interpretive: { label: "Interpretive", blurb: "Listening, reading, viewing" },
  interpersonal: { label: "Interpersonal", blurb: "Partner and group talk" },
  presentational: { label: "Presentational", blurb: "Speaking and writing for an audience" },
  game: { label: "Classroom games", blurb: "Competitive and cooperative play" },
  assessment: { label: "Assessment", blurb: "Formative checks, rubrics, IPAs" },
  culture: { label: "Culture & 5 Cs", blurb: "Cultures, Connections, Comparisons, Communities" },
  homework: { label: "Homework", blurb: "Extension beyond class" },
  arcade: { label: "Student arcade", blurb: "Digital games in this app" },
};

export const CATEGORY_ORDER: MaterialCategory[] = [
  "warm-up",
  "interpretive",
  "interpersonal",
  "presentational",
  "game",
  "assessment",
  "culture",
  "homework",
  "arcade",
];

export function generateMaterials(lesson: Lesson): Material[] {
  const ctx = buildCtx(lesson);
  const order = ctx.level.order;
  return T.filter((t) => (t.min === undefined || order >= t.min) && (t.max === undefined || order <= t.max)).map((t) => {
    const built = t.build(ctx);
    return {
      id: t.id,
      title: t.title(ctx),
      category: t.category,
      modes: t.modes,
      skills: t.skills,
      minutes: t.minutes,
      groupSize: t.groupSize,
      lowAnxiety: t.lowAnxiety,
      arcadeHref: t.arcadeHref?.(ctx),
      ...built,
    };
  });
}

export function countForLevel(level: ActflLevelId): number {
  const order = getLevel(level).order;
  return T.filter((t) => (t.min === undefined || order >= t.min) && (t.max === undefined || order <= t.max)).length;
}

export const TOTAL_TEMPLATES = T.length;
export const LEVEL_COUNTS = Object.fromEntries(ACTFL_LEVELS.map((l) => [l.id, countForLevel(l.id)])) as Record<ActflLevelId, number>;

export function materialToText(m: Material): string {
  const lines = [
    m.title,
    `${CATEGORY_META[m.category].label} · ${m.modes.join(", ")} · ${m.minutes ? `${m.minutes} min` : "reference"} · ${m.groupSize}`,
    "",
    m.description,
    "",
    ...m.steps.map((s, i) => `${i + 1}. ${s}`),
  ];
  if (m.differentiation) lines.push("", `Differentiation: ${m.differentiation}`);
  if (m.tip) lines.push("", `Tip: ${m.tip}`);
  lines.push("", `Can-Do: ${m.canDo}`);
  return lines.join("\n");
}
