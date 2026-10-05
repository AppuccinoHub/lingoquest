import { LessonPlan, SupplementalMaterial, ACTFLProficiency, ACTFLMode } from '@/types/actfl';

export function generateDozensMaterials(lesson: LessonPlan): SupplementalMaterial[] {
  const vocabSample = lesson.coreVocabulary.slice(0, 4).map(v => v.target).join(', ');
  const firstWord = lesson.coreVocabulary[0]?.target || 'Palabra 1';
  const secondWord = lesson.coreVocabulary[1]?.target || 'Palabra 2';
  const lang = lesson.targetLanguage;
  const level = lesson.level;

  const generated: SupplementalMaterial[] = [
    {
      id: `gen-bellringer-${Date.now()}-1`,
      title: `⚡ "Spot the Impostor" 3-Min Bellringer (${lesson.theme})`,
      category: 'bellringer',
      categoryLabel: 'Quick Bellringer',
      actflMode: 'Interpretive',
      target5C: ['Communication', 'Comparisons'],
      proficiencyLevel: level,
      estimatedMinutes: 5,
      anxietyRating: 'Zero Stress (Silent/Team)',
      summary: 'Silent visual projection warm-up where students identify the single culturally out-of-place item in 180 seconds.',
      content: `### 🎯 Bellringer: Spot the Cultural Impostor
**Theme:** ${lesson.theme} | **Target Language:** ${lang}

**Project on the board as students enter:**
Four vocabulary items are listed below, but ONE is an impostor that doesn't fit the cultural setting:
1. **${firstWord}** (${lesson.coreVocabulary[0]?.native || 'Item 1'})
2. **${secondWord}** (${lesson.coreVocabulary[1]?.native || 'Item 2'})
3. **${lesson.coreVocabulary[2]?.target || 'Tapas'}** (${lesson.coreVocabulary[2]?.native || 'Item 3'})
4. **Fast Food Cheeseburger & French Fries** (Traditional American diner)

**Silent Tasks:**
- Write on your mini whiteboard: which number is the impostor and why in 1 simple sentence.
- Sentence Frame for ${level}: *"El número __ no corresponde porque pertenece a otra cultura."*
- *No verbal sharing until the gong rings! (Zero speaking anxiety).*`
    },
    {
      id: `gen-escape-${Date.now()}-2`,
      title: `🗝️ "Operation Secret Vault" 4-Station Digital/Paper Escape Room`,
      category: 'escape_room',
      categoryLabel: 'Classroom Escape Room',
      actflMode: 'Interpersonal',
      target5C: ['Communication', 'Cultures', 'Connections'],
      proficiencyLevel: level,
      estimatedMinutes: 25,
      anxietyRating: 'Zero Stress (Silent/Team)',
      summary: 'Four cooperative team puzzle stations where students crack codes by deciphering real-world authentic texts.',
      content: `### 🗝️ Operation Secret Vault: ${lesson.title}
**Teacher Instructions:** Form teams of 3-4. Each squad receives 4 puzzle envelopes. Teams only speak in quiet whispers inside their huddle!

#### Station 1: The Cryptogram Message
Decode this intercepted communication using our vocabulary:
- Cipher text: *"${lesson.keyPhrases[0]?.target || 'Quisiera el plato principal por favor'}"*
- Question: What is the primary need of the secret agent? (Food, navigation, or emergency assistance?)

#### Station 2: The Currency & Logic Lock
The agent paid 20 currency units. Using ${vocabSample}, calculate the change received if each item costs 3.50.
- Digit for lock: (Total change remainder) = **[ __ ]**

#### Station 3: The Cultural Artifact Filter
Match the authentic cultural norm to the scenario:
- Focus: ${lesson.culturalTopic}
- If true, the code letter is **A**; if false, it is **B**.

#### Station 4: The Final Whispered Code
To open the treasure box at the teacher's desk, the team captain steps forward and quietly whispers the secret passcode phrase:
> *"**${lesson.keyPhrases[1]?.target || lesson.keyPhrases[0]?.target}**"*`
    },
    {
      id: `gen-bracket-${Date.now()}-3`,
      title: `🥊 "Vocabulary Madness" 8-Word Showdown Bracket`,
      category: 'vocab_bracket',
      categoryLabel: 'Gamified Vocab Bracket',
      actflMode: 'Interpersonal',
      target5C: ['Communication', 'Comparisons'],
      proficiencyLevel: level,
      estimatedMinutes: 15,
      anxietyRating: 'Low Stress (Pairs/Sound Effects)',
      summary: 'High-engagement March Madness-style debate bracket where students vote and use scaffolded 3-word arguments.',
      content: `### 🥊 Vocabulary Madness Championship Bracket
**Theme:** ${lesson.theme}

**The Elite 8 Matchups:**
- **Match 1:** ${lesson.coreVocabulary[0]?.target || 'Item 1'} 🆚 ${lesson.coreVocabulary[1]?.target || 'Item 2'}
- **Match 2:** ${lesson.coreVocabulary[2]?.target || 'Item 3'} 🆚 ${lesson.coreVocabulary[3]?.target || 'Item 4'}
- **Match 3:** ${lesson.coreVocabulary[4]?.target || 'Item 5'} 🆚 ${lesson.coreVocabulary[5]?.target || 'Item 6'}
- **Match 4:** ${lesson.coreVocabulary[6]?.target || 'Item 7'} 🆚 ${lesson.coreVocabulary[7]?.target || 'Item 8'}

**Low-Anxiety Speaking Rules:**
1. Students ONLY need to deliver a two-card combo:
   - Green Card: *"Prefiero [Word] porque..."*
   - Red Card: *"No me convence [Word] porque..."*
2. Introverted students can hold up colored ping-pong paddles or vote on their phones before any volunteer reads their card!`
    },
    {
      id: `gen-graphic-${Date.now()}-4`,
      title: `📊 "Sentence Architecture" Visual Scaffolding Organizer`,
      category: 'graphic_organizer',
      categoryLabel: 'Graphic Organizer',
      actflMode: 'Interpretive',
      target5C: ['Communication', 'Connections'],
      proficiencyLevel: level,
      estimatedMinutes: 12,
      anxietyRating: 'Zero Stress (Silent/Team)',
      summary: 'Color-coded Lego-style syntax puzzle map breaking down sentence building into bite-sized tactile chunks.',
      content: `### 📊 Sentence Architecture Organizer (Lego Block System)
Students who struggle with speaking anxiety freeze because they don't know how to start the sentence.
Use this color-coded 3-Tier Builder:

| Block 1: Courtesy Opener (Blue) | Block 2: Action / Need (Yellow) | Block 3: Target Details (Green) |
| :--- | :--- | :--- |
| Disculpe / Pardon / Sumimasen | Quisiera / Je voudrais / Kore o... | ${lesson.coreVocabulary[0]?.target || 'Un café con leche'} |
| Por favor / S'il vous plaît | ¿Dónde está / Où se trouve...? | ${lesson.coreVocabulary[1]?.target || 'La cuenta'} |
| Buenos días / Bonjour | Me gustaría recomendar... | ${lesson.coreVocabulary[2]?.target || 'Para llevar'} |

**Class Activity:**
Cut these into tactile cards. Students build 3 valid sentences silently at their desk before playing with an audio partner.`
    },
    {
      id: `gen-dialogue-${Date.now()}-5`,
      title: `🕶️ "Undercover Informant" Low-Stakes Whispering Cards`,
      category: 'dialogue_script',
      categoryLabel: 'Secret Agent Speaking Cards',
      actflMode: 'Interpersonal',
      target5C: ['Communication'],
      proficiencyLevel: level,
      estimatedMinutes: 15,
      anxietyRating: 'Low Stress (Pairs/Sound Effects)',
      summary: 'Two-person undercover spy dialogue cards with comic-book style prompts so students act in character rather than feeling tested.',
      content: `### 🕶️ Undercover Informant: Two-Player Mission
*Educational psychology note:* When kids pretend to be secret agents using funny walkie-talkie voices or whispering, their affective filter drops by over 60%!

**Agent Alpha Card:**
- *Secret Objective:* Meet Informant Beta at the bench.
- *Voice style:* Smooth spy whisper.
- *Line 1:* "${lesson.keyPhrases[0]?.target || 'Buenos días, camarada.'}"
- *Your Goal:* If Beta responds correctly, slide them the top secret microfilm.

**Agent Beta Card:**
- *Secret Objective:* Verify Alpha's identity.
- *Voice style:* Sunglasses on, looking around cautiously.
- *Counter-Response:* "${lesson.keyPhrases[1]?.target || 'Todo está en orden.'}"`
    },
    {
      id: `gen-cultural-${Date.now()}-6`,
      title: `🎟️ "Culture Shock Reflex" 3-2-1 Exit Ticket`,
      category: 'cultural_ticket',
      categoryLabel: 'Cultural Exit Ticket',
      actflMode: 'Interpretive',
      target5C: ['Cultures', 'Comparisons'],
      proficiencyLevel: level,
      estimatedMinutes: 6,
      anxietyRating: 'Zero Stress (Silent/Team)',
      summary: 'Quick reflective formative assessment connecting target culture practices with home culture customs.',
      content: `### 🎟️ 3-2-1 Cultural Discovery Exit Ticket
**Topic:** ${lesson.culturalTopic}

Fill out before the bell rings:
- **3 Facts** I learned today about how people in the target culture experience daily life:
  1. __________________________________________________________________
  2. __________________________________________________________________
  3. __________________________________________________________________
- **2 Differences or Similarities** compared to my own neighborhood:
  1. __________________________________________________________________
  2. __________________________________________________________________
- **1 Question** I still have or one game challenge I want to retry tomorrow:
  1. __________________________________________________________________`
    },
    {
      id: `gen-rubric-${Date.now()}-7`,
      title: `🎮 "Gamer Level-Up" ACTFL Can-Do Self-Assessment Rubric`,
      category: 'rubric',
      categoryLabel: 'Gamified Proficiency Rubric',
      actflMode: 'Presentational',
      target5C: ['Communication'],
      proficiencyLevel: level,
      estimatedMinutes: 8,
      anxietyRating: 'Zero Stress (Silent/Team)',
      summary: 'Translates intimidating ACTFL performance descriptors into gamified XP tiers with actionable level-up tips.',
      content: `### 🎮 Gamer Level-Up Matrix: ACTFL ${level}
Replace intimidating letter grades with quest mastery tiers:

- 🥉 **Tier 1: Rookie Scout (Novice Low / Mid)**
  - *Ability:* Uses single words, emojis, or pre-made scripts.
  - *XP Earned:* +100 XP
  - *How to Level Up:* Try adding "por favor" or one descriptive color/number!

- 🥈 **Tier 2: Knight Quester (Novice High)**
  - *Ability:* Can formulate 2 continuous sentences and ask a question.
  - *XP Earned:* +250 XP
  - *How to Level Up:* Connect thoughts using *"y"*, *"pero"*, or *"porque"*.

- 🥇 **Tier 3: Guild Master (Intermediate Low / Mid)**
  - *Ability:* Sustains a 1-minute back-and-forth dialogue even when unexpected words appear.
  - *XP Earned:* +500 XP
  - *How to Level Up:* Ask follow-up questions to keep the conversation alive!`
    },
    {
      id: `gen-infograph-${Date.now()}-8`,
      title: `📰 "Real World Micro-Reading" Authentic Infographic & Comprehension Hunt`,
      category: 'infographic_reading',
      categoryLabel: 'Authentic Infographic Hunt',
      actflMode: 'Interpretive',
      target5C: ['Cultures', 'Connections'],
      proficiencyLevel: level,
      estimatedMinutes: 14,
      anxietyRating: 'Zero Stress (Silent/Team)',
      summary: 'Short authentic reading flyer with visual icons and scavenger hunt comprehension check.',
      content: `### 📰 Authentic Real-World Reading Hunt: ${lesson.theme}
**Context:** Below is a real sign posted at a neighborhood shop / community board.

**Authentic Text Excerpt:**
> *"¡Bienvenidos a nuestro establecimiento familiar! Horario: Lunes a Sábado de 09:00 a 20:30. Aceptamos efectivo y tarjetas. Especialidad de la casa: ${lesson.coreVocabulary[0]?.target || 'Platos típicos'} preparados artesanalmente todos los días. ¡Buen provecho!"*

**Comprehension Scavenger Hunt:**
1. What days is this venue open? ____________________
2. Can you pay with a debit card? ____________________
3. What is their house specialty? ____________________
4. What polite phrase do they use to wish diners well? ____________________`
    },
    {
      id: `gen-peer-${Date.now()}-9`,
      title: `🛡️ "Confidence Co-Pilot" Peer Shield Card`,
      category: 'peer_scaffold',
      categoryLabel: 'Confidence Co-Pilot',
      actflMode: 'Interpersonal',
      target5C: ['Communication'],
      proficiencyLevel: level,
      estimatedMinutes: 10,
      anxietyRating: 'Zero Stress (Silent/Team)',
      summary: 'Tactile role cards giving the shy speaker a "Lifeline" button and giving the partner explicit coaching prompts.',
      content: `### 🛡️ Confidence Co-Pilot Card
*For students who report feeling embarrassed speaking in front of peers.*

**Role 1: The Navigator (Shy Speaker)**
- You have 2 "Shield Lifelines" per conversation:
  - *Yellow Card (Pause Time):* "Dame un segundo..." (Gives you 10 seconds of silence to think).
  - *Blue Card (Word Hint):* Partner must whisper the next word to you like a supportive theater prompter!

**Role 2: The Co-Pilot (Supporter)**
- You cannot correct pronunciation harshly!
- You can only offer high-fives or prompt: *"¿Quieres decir ${lesson.coreVocabulary[0]?.target || 'esto'}?"*`
    },
    {
      id: `gen-station-${Date.now()}-10`,
      title: `🎲 "Roll & Chat" 4-Corner Game Station Challenge`,
      category: 'game_station',
      categoryLabel: 'Station Review Game',
      actflMode: 'Interpersonal',
      target5C: ['Communication', 'Communities'],
      proficiencyLevel: level,
      estimatedMinutes: 20,
      anxietyRating: 'Low Stress (Pairs/Sound Effects)',
      summary: 'Physical dice-rolling board game where numbers determine silly voice modifiers (robot, pirate, whisper, sports announcer).',
      content: `### 🎲 Roll & Chat: Silly Voice Modifiers
*By focusing on making a funny voice, students forget to worry about their foreign language accent!*

**Rules:** Roll a 6-sided die:
- **1 = Robot Voice:** Monotone, beep-boop cadence. Say: *"**${lesson.coreVocabulary[0]?.target || 'Hola'}**"*
- **2 = Opera Singer:** Dramatic vibrating pitch. Say: *"**${lesson.coreVocabulary[1]?.target || 'Gracias'}**"*
- **3 = Secret Spy Whisper:** Shield your mouth. Say: *"**${lesson.keyPhrases[0]?.target || 'Quisiera un café'}**"*
- **4 = Excited Sports Announcer:** GOOOOL energy!
- **5 = Sloth / Super Slow Motion:** Take 10 seconds to say one word.
- **6 = Double Score Bonus:** Teach your partner one brand new slang expression!`
    }
  ];

  return generated;
}
