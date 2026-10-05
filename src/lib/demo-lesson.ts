import type { Lesson } from "./types";

export const DEMO_LESSON_ID = "demo-il-cibo";

export const DEMO_LESSON: Lesson = {
  id: DEMO_LESSON_ID,
  title: "Il cibo e i sapori: What do you like to eat?",
  languageId: "it",
  level: "novice-mid",
  theme: "Food, meals & dining in Italy",
  essentialQuestion: "Cosa ti piace mangiare e perché?",
  canDo: [
    "I can say what foods and drinks I like and don't like using memorized Italian phrases.",
    "I can recognize familiar Italian food and café words when I hear them in a conversation.",
    "I can present my favorite meal or order a simple snack in an Italian bar or trattoria.",
  ],
  vocabulary: [
    { term: "la pizza", translation: "the pizza" },
    { term: "la pasta", translation: "the pasta" },
    { term: "il pane", translation: "the bread" },
    { term: "il formaggio", translation: "the cheese" },
    { term: "il gelato", translation: "the ice cream / gelato" },
    { term: "la mela", translation: "the apple" },
    { term: "il caffè", translation: "the coffee / espresso" },
    { term: "l'acqua fresca", translation: "the fresh water" },
    { term: "la colazione", translation: "breakfast" },
    { term: "il pranzo", translation: "lunch" },
    { term: "la cena", translation: "dinner" },
    { term: "delizioso", translation: "delicious" },
    { term: "il pomodoro", translation: "the tomato" },
    { term: "il cappuccino", translation: "the cappuccino" },
  ],
  sentences: [
    "Mi piace la pizza con il pomodoro.",
    "Non mi piace il formaggio.",
    "Cosa ti piace mangiare a pranzo?",
    "Per colazione prendo un cappuccino e un cornetto.",
    "Il gelato al pistacchio è delizioso.",
    "Vorrei un bicchiere d'acqua fresca, per favore.",
    "Il conto, per favore.",
  ],
  structures: [
    "mi piace / non mi piace + noun",
    "Cosa ti piace mangiare…?",
    "Per colazione / pranzo / cena prendo…",
    "Vorrei… per favore",
  ],
  cultureNote:
    "In Italy, food is central to community life and daily conversation. Breakfast (la prima colazione) is usually a quick espresso or cappuccino with a cornetto at the neighborhood bar standing at the counter. Cappuccino is traditionally enjoyed strictly in the morning, while lunch (il pranzo) and dinner (la cena) are sit-down meals shared with friends or family.",
  createdAt: 0,
  updatedAt: 0,
};
