import { LessonPlan, SupplementalMaterial } from '@/types/actfl';

export const SAMPLE_LESSONS: LessonPlan[] = [
  {
    id: 'spanish-novice-cafe',
    title: 'El Mercado y La Cafetería: Survival Ordering & Flavors',
    targetLanguage: 'Spanish',
    level: 'Novice Mid',
    theme: 'Food & Culinary Traditions in the Hispanic World',
    culturalTopic: 'Tapas culture in Madrid & Mercado de San Juan in Mexico City',
    essentialQuestions: [
      'How does the way we order and share food reflect cultural values of hospitality and community?',
      'How can I navigate ordering food politely without panic in a Spanish-speaking neighborhood?'
    ],
    canDoStatements: [
      {
        id: 'cd-1',
        text: 'I can express my preferences for basic foods and beverages using memorized words and polite expressions.',
        mode: 'Interpersonal',
        level: 'Novice Mid'
      },
      {
        id: 'cd-2',
        text: 'I can identify prices, dish names, and meal categories on an authentic café chalkboard menu.',
        mode: 'Interpretive',
        level: 'Novice Mid'
      },
      {
        id: 'cd-3',
        text: 'I can present a short order for my friend and myself using simple sentence frames.',
        mode: 'Presentational',
        level: 'Novice Mid'
      }
    ],
    coreVocabulary: [
      { target: 'Quisiera...', native: 'I would like...', phonetic: 'kee-SYEH-rah', emoji: '🍽️', contextSentence: 'Quisiera un jugo de naranja, por favor.' },
      { target: '¿Cuánto cuesta?', native: 'How much does it cost?', phonetic: 'KWAHN-toh KWEH-stah', emoji: '🏷️', contextSentence: 'Disculpe, ¿cuánto cuesta la empanada?' },
      { target: 'La cuenta, por favor', native: 'The check, please', phonetic: 'lah KWEN-tah por fah-VOR', emoji: '🧾', contextSentence: 'Para terminar, la cuenta por favor.' },
      { target: 'Un vaso de agua fresca', native: 'A glass of fresh water / agua fresca', phonetic: 'oon VAH-soh deh AH-gwah', emoji: '🥤', contextSentence: 'Quisiera un vaso de agua fresca con limón.' },
      { target: 'Delicioso / Rica', native: 'Delicious / tasty', phonetic: 'deh-lee-SYOH-soh', emoji: '😋', contextSentence: '¡Esta tortilla española está muy rica!' },
      { target: 'Sin hielo / Con hielo', native: 'Without ice / With ice', phonetic: 'seen YEH-loh', emoji: '🧊', contextSentence: 'Un té frío sin hielo, por favor.' },
      { target: 'Tenedor y servilleta', native: 'Fork and napkin', phonetic: 'teh-neh-DOR ee sehr-vee-YEH-tah', emoji: '🍴', contextSentence: '¿Me trae un tenedor y una servilleta?' },
      { target: 'Tapas para compartir', native: 'Appetizers/tapas to share', phonetic: 'TAH-pahs PAH-rah com-par-TEER', emoji: '🥘', contextSentence: 'Pedimos tres tapas para compartir entre todos.' }
    ],
    keyPhrases: [
      { target: '¡Hola! Para mí, una porción de churros con chocolate.', english: 'Hello! For me, an order of churros with hot chocolate.' },
      { target: 'Disculpe camarero, ¿qué plato recomienda hoy?', english: 'Excuse me waiter, which dish do you recommend today?' },
      { target: '¿Lleva mariscos o nueces? Tengo alergia.', english: 'Does it contain shellfish or nuts? I have an allergy.' },
      { target: 'Todo estuvo riquísimo, muchas gracias.', english: 'Everything was delicious, thank you very much.' }
    ],
    materials: [
      {
        id: 'mat-1',
        title: '☕ "Café Speed Run" 3-Minute Bellringer',
        category: 'bellringer',
        categoryLabel: 'Bellringer / Warm-up',
        actflMode: 'Interpretive',
        target5C: ['Communication', 'Cultures'],
        proficiencyLevel: 'Novice Mid',
        estimatedMinutes: 5,
        anxietyRating: 'Zero Stress (Silent/Team)',
        summary: 'Visual menu decode puzzle. Students spot 3 differences between prices in Madrid vs Oaxaca in 180 seconds.',
        content: `### 🎯 Bellringer: Menu Decoder (Zero Talking Required)
**Scenario:** You landed at Madrid Airport's "Cafetería La Granja". You have 5 euros (€5.00).

1. Look at the chalkboard items:
   - *Café con leche* — €1.80
   - *Zumo de naranja natural* — €2.60
   - *Tostada con tomate y aceite* — €2.20
   - *Porción de churros (4 uds)* — €2.50

2. **Your Mission:** 
   - Which combo can you buy with exactly €5.00?
   - Write your order in your notebook using the frame: *"Para mí, Quisiera [ITEM] y [ITEM]."*
   - Fast Finisher Bonus: How is an authentic Spanish "tostada con tomate" prepared differently from an American breakfast toast?`
      },
      {
        id: 'mat-2',
        title: '🕵️‍♂️ The Locked Tapas Pantry: Mini Escape Room Quest',
        category: 'escape_room',
        categoryLabel: 'Low-Anxiety Escape Room',
        actflMode: 'Interpersonal',
        target5C: ['Communication', 'Connections', 'Comparisons'],
        proficiencyLevel: 'Novice Mid',
        estimatedMinutes: 20,
        anxietyRating: 'Zero Stress (Silent/Team)',
        summary: 'Team-based puzzle where students unlock 4 digital padlock clues by translating dietary ingredients.',
        content: `### 🔐 Escape Room: The Midnight Tapas Mystery
**Goal:** Your team is locked inside Abuela's legendary kitchen in Seville. Crack the 4-digit master lock code before dinner time!

#### Clue #1: The Allergy Safe (Digit 1)
Translate the secret warning note:
> *"No pedimos gambas ni pulpo porque Mateo es alérgico a los mariscos."*
Count the letters in the Spanish word for "shellfish" -> That is Digit #1: **________**

#### Clue #2: The Bill Breakdown (Digit 2)
Solve the waiter's arithmetic riddle:
> *"Dos cafés (€4) más una tortilla de patatas (€6) menos un descuento especial de dos euros."*
What is the final total? The first digit of this total is Digit #2: **________**

#### Clue #3: The Missing Ingredient (Digit 3)
Traditional *Guacamole* from Puebla requires: aguacate, sal, lima, cilantro y...
Count the number of syllables in *Aguacate* -> Digit #3: **________**

#### Clue #4: Secret Passcode Word (Digit 4)
The waiter whispers: *"Si dices 'delicioso', el chef sonríe."* How many vowels in 'delicioso'? -> Digit #4: **________**`
      },
      {
        id: 'mat-3',
        title: '🏆 The Great Tapas Bracket: March Madness Food Tournament',
        category: 'vocab_bracket',
        categoryLabel: 'Vocab / Culture Bracket',
        actflMode: 'Interpersonal',
        target5C: ['Communication', 'Cultures', 'Comparisons'],
        proficiencyLevel: 'Novice Mid',
        estimatedMinutes: 15,
        anxietyRating: 'Low Stress (Pairs/Sound Effects)',
        summary: 'Sweet 16 tournament bracket where students debate favorites using 2-word sentence stems.',
        content: `### 🏆 Torneo de Comida: The 8-Dish Tapas Showdown
Students pair up. For each matchup, they only have to point and speak ONE sentence stem:
- *"Prefiero X porque es más delicioso."*
- *"No me gusta Y porque no tiene queso."*

**Round 1 Matchups:**
1. *Tortilla Española* (Potato Omelette) 🆚 *Patatas Bravas* (Spicy Crispy Potatoes)
2. *Churros con Chocolate* 🆚 *Flan Casero con Caramelo*
3. *Empanada Gallega* (Savory Meat Pie) 🆚 *Croquetas de Jamón*
4. *Horchata de Chufa* 🆚 *Jugo de Maracuyá*

**Debrief Scaffold for Introverts:**
Allow students to vote anonymously using colored token slips or emoji cards before any verbal reveal!`
      },
      {
        id: 'mat-4',
        title: '📊 Venn Diagram Graphic Organizer: Street Food vs Sit-Down Dining',
        category: 'graphic_organizer',
        categoryLabel: 'Visual Graphic Organizer',
        actflMode: 'Interpretive',
        target5C: ['Cultures', 'Comparisons'],
        proficiencyLevel: 'Novice Mid',
        estimatedMinutes: 12,
        anxietyRating: 'Zero Stress (Silent/Team)',
        summary: 'Differentiated graphic organizer with word bank comparing taquerías callejeras with café formal seating.',
        content: `### 📊 Graphic Organizer: Cultural Meal Habits
**Directions:** Place the 8 word tiles into the Venn Diagram:
- Left Circle: *La Taquería Callejera (Mexico City street stand)*
- Right Circle: *La Cafetería Tradicional (Madrid sit-down)*
- Center Intersect: *Ambos (Both cultural environments)*

**Tile Bank:**
1. *"Se come de pie o en banquetas rápidas"*
2. *"La sobremesa dura más de una hora charlando"*
3. *"Se dice 'Buen provecho' a desconocidos"*
4. *"Salsa verde y roja en la mesa"*
5. *"Se pide 'La cuenta, por favor' al mozo"*
6. *"Comida fresca hecha al instante"*
7. *"Propinas y cortesía esencial"*
8. *"Uso común de servilletas de papel en el mostrador"*`
      },
      {
        id: 'mat-5',
        title: '🪪 Secret Agent Roleplay Cards: Low-Stakes Whispering Quest',
        category: 'dialogue_script',
        categoryLabel: 'Secret Agent Speaking Cards',
        actflMode: 'Interpersonal',
        target5C: ['Communication'],
        proficiencyLevel: 'Novice Mid',
        estimatedMinutes: 15,
        anxietyRating: 'Playful Challenge',
        summary: 'Micro-roleplay cards where students whisper a spy code phrase to a friend acting as a secret café informant.',
        content: `### 🕶️ Secret Agent Cafe Mission Cards
*Why this reduces speaking anxiety:* Students aren't "being judged on their Spanish in front of 30 peers". They are undercover operatives on a covert mission whispering a codeword in pairs!

**Agent Card A (The Operative):**
- Objective: Obtain the envelope hidden under the bread basket.
- Whisper Phrase: *"Disculpe camarero, ¿el agua fresca tiene limón?"*
- Secret Response Trigger: Wait until Partner responds with *"Solo si no tiene hielo."*

**Agent Card B (The Informant Café Worker):**
- Objective: Verify the spy without alerting the table next to you.
- Trigger Phrase: When Partner mentions *"limón"*, hand over the token and reply:
- Whisper: *"Solo si no tiene hielo. Aquí tiene su servilleta."*`
      },
      {
        id: 'mat-6',
        title: '⭐ ACTFL Proficiency Quick Rubric (Student-Friendly Can-Do Checklist)',
        category: 'rubric',
        categoryLabel: 'Gamified Proficiency Rubric',
        actflMode: 'Presentational',
        target5C: ['Communication'],
        proficiencyLevel: 'Novice Mid',
        estimatedMinutes: 5,
        anxietyRating: 'Zero Stress (Silent/Team)',
        summary: 'Self-assessment checklist translated into gaming RPG tiers (Apprentice, Adventurer, Champion, Legend).',
        content: `### 🎮 Quest Mastery Rubric: Food & Ordering
| Level | RPG Tier | What I can do in the Target Language |
| :--- | :--- | :--- |
| **Novice Low** | 🛡️ *Level 1 Apprentice* | I can say single words (*"Agua"*, *"Café"*, *"Gracias"*) and point. |
| **Novice Mid** | ⚔️ *Level 2 Adventurer* | I can ask for 2+ items politely using frames (*"Quisiera una empanada"* and *"¿Cuánto cuesta?"*). |
| **Novice High** | 🔮 *Level 3 Champion* | I can connect simple thoughts with conjunctions (*"porque"*, *"pero sin hielo"*) and ask what the waiter recommends. |
| **Intermediate Low** | 👑 *Level 4 Legend* | I can handle a minor mishap (wrong drink brought, missing fork, asking for a bill change) in full sentences. |`
      }
    ]
  },
  {
    id: 'french-novice-city',
    title: 'Flâner dans la Ville: Navigating Paris Like a Local',
    targetLanguage: 'French',
    level: 'Novice High',
    theme: 'Urban Life, Transport & Metro Culture',
    culturalTopic: 'The Parisian Metro, Le Flâneur lifestyle, and neighborhood boulangeries',
    essentialQuestions: [
      'How does public transport shape the daily rhythm and eco-habits of francophone urbanites?',
      'How do polite formulas like "Bonjour madame" change how people welcome you in France?'
    ],
    canDoStatements: [
      {
        id: 'fr-cd-1',
        text: 'I can ask for directions to a subway line or monument using street landmarks.',
        mode: 'Interpersonal',
        level: 'Novice High'
      },
      {
        id: 'fr-cd-2',
        text: 'I can understand a simplified metro plan and station announcement.',
        mode: 'Interpretive',
        level: 'Novice High'
      }
    ],
    coreVocabulary: [
      { target: 'Pardon, pour aller à...?', native: 'Excuse me, how do I get to...?', phonetic: 'par-DOH, poor ah-lay ah', emoji: '🗺️', contextSentence: 'Pardon monsieur, pour aller à la Tour Eiffel ?' },
      { target: 'Tout droit / À gauche / À droite', native: 'Straight ahead / To the left / To the right', phonetic: 'too drwah / ah gohsh / ah drwaht', emoji: '🧭', contextSentence: 'Continuez tout droit, puis tournez à gauche.' },
      { target: 'Un ticket de métro', native: 'A metro ticket', phonetic: 'uhn tee-kay duh may-troh', emoji: '🎫', contextSentence: 'Je voudrais deux tickets de métro, s’il vous plaît.' },
      { target: 'La station la plus proche', native: 'The closest station', phonetic: 'lah stah-syoh lah ploo prohsh', emoji: '🚇', contextSentence: 'Où se trouve la station de métro la plus proche ?' },
      { target: 'C’est à côté de la boulangerie', native: 'It is next to the bakery', phonetic: 'sayt ah koh-tay duh lah boo-lahn-zhree', emoji: '🥖', contextSentence: 'Le musée est juste à côté de la boulangerie.' }
    ],
    keyPhrases: [
      { target: 'Bonjour madame ! Est-ce loin d’ici à pied ?', english: 'Hello madam! Is it far from here on foot?' },
      { target: 'Non, c’est à cinq minutes seulement.', english: 'No, it is only five minutes away.' },
      { target: 'Prenez la ligne 4 en direction de Châtelet.', english: 'Take Line 4 towards Châtelet.' }
    ],
    materials: [
      {
        id: 'fr-mat-1',
        title: '🚇 Metro Station Maze: Detective Transit Map',
        category: 'escape_room',
        categoryLabel: 'Transit Logic Puzzle',
        actflMode: 'Interpretive',
        target5C: ['Communication', 'Connections'],
        proficiencyLevel: 'Novice High',
        estimatedMinutes: 15,
        anxietyRating: 'Zero Stress (Silent/Team)',
        summary: 'Color-coded line map challenge where students navigate from Gare du Nord to Saint-Germain without speaking out loud.',
        content: `### 🚇 Detective Metro Mission: The Lost Louvre Key
**Scenario:** You have 3 transit tokens and need to reach *Saint-Michel*.
Follow the conductor's instructions:
1. *Départ:* Gare du Nord. Prenez la Ligne 4 (violette) direction *Mairie de Montrouge*.
2. Sautez 3 arrêts. Où êtes-vous ?
3. En cas de travaux à *Réaumur*, descendez à *Châtelet*.`
      },
      {
        id: 'fr-mat-2',
        title: '🥐 The "Politeness Magic Key" Bellringer',
        category: 'bellringer',
        categoryLabel: 'Cultural Norms Warm-up',
        actflMode: 'Interpretive',
        target5C: ['Cultures', 'Comparisons'],
        proficiencyLevel: 'Novice High',
        estimatedMinutes: 6,
        anxietyRating: 'Zero Stress (Silent/Team)',
        summary: 'Spot the social faux pas: Why does saying "Où sont les toilettes ?" without "Bonjour" freeze French shopkeepers?',
        content: `### 🥐 Cultural Reality Check: The Sacred "Bonjour"
In France, entering any boutique without making eye contact and saying *"Bonjour Monsieur / Madame"* is seen as rude.
**Student Task:** Rank these 4 interactions from most polite to accidental faux pas!`
      }
    ]
  },
  {
    id: 'japanese-novice-conbini',
    title: 'Convenience Store Quests: Surviving a Tokyo 7-Eleven / Lawson',
    targetLanguage: 'Japanese',
    level: 'Novice Low',
    theme: 'Daily Errands, Snacks & Helpful Courtesy',
    culturalTopic: 'The Konbini culture in Japan, heated onigiri, and polite customer phrases',
    essentialQuestions: [
      'How do convenience stores reflect Japanese design for hyper-efficient community service?',
      'How can I buy snacks using just 3 polite polite set phrases?'
    ],
    canDoStatements: [
      {
        id: 'jp-cd-1',
        text: 'I can identify snack items (onigiri, green tea, bento) and indicate quantity using finger counters or basic numerals.',
        mode: 'Interpersonal',
        level: 'Novice Low'
      }
    ],
    coreVocabulary: [
      { target: 'これをお願いします (Kore o onegaishimasu)', native: 'This one please', phonetic: 'koh-reh oh oh-neh-gah-ee-shee-mahs', emoji: '🍙', contextSentence: 'しゃけのおにぎり、これをお願いします。' },
      { target: '温めてください (Atatamete kudasai)', native: 'Please warm it up', phonetic: 'ah-tah-tah-meh-teh koo-dah-sah-ee', emoji: '🍱', contextSentence: 'お弁当、温めてください。' },
      { target: '大丈夫です / 結構です (Daijoubu desu)', native: 'No thank you / I am good (for bag/receipt)', phonetic: 'dye-joh-boo des', emoji: '🛍️', contextSentence: '袋は大丈夫です。(I do not need a bag.)' },
      { target: 'ありがとうございます (Arigatou gozaimasu)', native: 'Thank you very much', phonetic: 'ah-ree-gah-toh goh-zye-mahs', emoji: '🙇‍♂️', contextSentence: 'レシートを受け取って、ありがとうございます。' }
    ],
    keyPhrases: [
      { target: 'スプーンをつけてください (Supuun o tsukete kudasai)', english: 'Please include a spoon.' },
      { target: 'Suicaで払います (Suica de haraimasu)', english: 'I will pay with Suica IC card.' }
    ],
    materials: [
      {
        id: 'jp-mat-1',
        title: '🍙 Konbini Bento Cashier Speed Quiz',
        category: 'bellringer',
        categoryLabel: 'Bilingual Quick Match',
        actflMode: 'Interpretive',
        target5C: ['Communication', 'Cultures'],
        proficiencyLevel: 'Novice Low',
        estimatedMinutes: 5,
        anxietyRating: 'Zero Stress (Silent/Team)',
        summary: 'Yes/No gesture bellringer matching cashier questions (Bag? Warm up?) to the correct response.',
        content: `### 🍙 Quick Konbini Challenge
The clerk says: *"Obento atatamemasu ka?"* (Would you like your bento warmed up?)
What do you press on your desk buzzer or card?
- A) *Daijoubu desu* (No need)
- B) *Onegaishimasu* (Yes please!)`
      }
    ]
  }
];
