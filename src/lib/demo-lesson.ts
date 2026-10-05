import type { Lesson } from "./types";

export const DEMO_LESSON_ID = "demo-la-comida";

export const DEMO_LESSON: Lesson = {
  id: DEMO_LESSON_ID,
  title: "La comida: What do you like to eat?",
  languageId: "es",
  level: "novice-mid",
  theme: "Food & meals",
  essentialQuestion: "¿Qué te gusta comer y por qué?",
  canDo: [
    "I can say what foods I like and don't like using memorized phrases.",
    "I can recognize familiar food words when I hear them in a short conversation.",
    "I can present my favorite meal using a list of words and simple phrases.",
  ],
  vocabulary: [
    { term: "la manzana", translation: "the apple" },
    { term: "el pan", translation: "the bread" },
    { term: "el queso", translation: "the cheese" },
    { term: "la leche", translation: "the milk" },
    { term: "el pollo", translation: "the chicken" },
    { term: "el arroz", translation: "the rice" },
    { term: "la ensalada", translation: "the salad" },
    { term: "el agua", translation: "the water" },
    { term: "el desayuno", translation: "breakfast" },
    { term: "el almuerzo", translation: "lunch" },
    { term: "la cena", translation: "dinner" },
    { term: "delicioso", translation: "delicious" },
  ],
  sentences: [
    "Me gusta el pollo con arroz.",
    "No me gusta la leche.",
    "¿Qué te gusta comer?",
    "Para el desayuno como pan y queso.",
    "La ensalada es deliciosa.",
    "Quiero agua, por favor.",
  ],
  structures: ["me gusta / no me gusta + noun", "¿Qué te gusta…?", "Para el desayuno / almuerzo / la cena como…"],
  cultureNote:
    "In Spain, lunch (la comida) is the main meal and often eaten around 2–3 pm; dinner is light and late. Compare with mealtimes at home.",
  createdAt: 0,
  updatedAt: 0,
};
