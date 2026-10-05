import type { LessonInput } from "@/lib/types"

export const SAMPLES: LessonInput[] = [
  {
    id: "sample-market",
    title: "At the market",
    language: "Spanish",
    level: "Novice High",
    topic: "buying food at a market",
    objective: "Students can request a food and ask the price.",
    vocabulary: `la manzana — apple
el pan — bread
el queso — cheese
el tomate — tomato
un kilo — a kilo
la bolsa — bag
¿cuánto cuesta? — how much does it cost
quiero — I want
por favor — please
demasiado caro — too expensive
gracias — thank you
¿tiene? — do you have`,
    grammar: "quiero + the food; ¿cuánto cuesta + the food?",
    culture: "In many Spanish-speaking countries you greet the vendor before you ask for a price.",
    notes: "A few students shut down if I call on them to order in front of the class.",
    updatedAt: 1,
  },
  {
    id: "sample-week",
    title: "My school week",
    language: "French",
    level: "Intermediate Low",
    topic: "describing a school week",
    objective: "Students can say what they have on a given day and give a reason.",
    vocabulary: `le lundi — Monday
le mercredi — Wednesday
le vendredi — Friday
un cours — a class
la cantine — cafeteria
après les cours — after class
j'ai — I have
mon sac — my bag
un contrôle — a quiz
fatigué — tired
je suis en retard — I'm late
parce que — because`,
    grammar: "j'ai + class; parce que + a reason",
    culture: "The school week and the lunch hour are not the same shape as a typical U.S. schedule.",
    notes: "Speaking in front of the room is the part they dread. Pair work is fine.",
    updatedAt: 1,
  },
  {
    id: "sample-hello",
    title: "Meeting someone",
    language: "Mandarin",
    level: "Novice Mid",
    topic: "meeting someone for the first time",
    objective: "Students can greet, say their name, and ask the other person's name.",
    vocabulary: `nǐ hǎo — hello
wǒ jiào — my name is
nǐ ne — and you
hěn gāoxìng — glad
rènshi nǐ — to meet you
xuésheng — student
lǎoshī — teacher
zàijiàn — goodbye
xièxie — thank you
qǐng wèn — excuse me`,
    grammar: "Wǒ jiào + name; Nǐ ne?",
    culture: "A greeting often comes with a small question about the other person, not only a name.",
    notes: "They will type forever if I let them. I want the words in their mouths without a spotlight.",
    updatedAt: 1,
  },
]

export function findSample(id: string) {
  return SAMPLES.find((lesson) => lesson.id === id) ?? null
}
