export type TemplateKey =
  | "like"
  | "want"
  | "have"
  | "howMuch"
  | "where"
  | "invite"
  | "problem"
  | "opinion"
  | "yesterday"
  | "questionLike"

export type LangPack = {
  name: string
  bcp47: string
  framed: boolean
  scriptNote?: string
  hello: string
  thanks: string
  please: string
  yes: string
  no: string
  goodbye: string
  tooMuch: string
  repair: string
  nameLine: string
  because: string
  like: string
  want: string
  have: string
  howMuch: string
  where: string
  invite: string
  problem: string
  opinion: string
  yesterday: string
  questionLike: string
}

export const PACKS: LangPack[] = [
  {
    name: "Spanish",
    bcp47: "es-ES",
    framed: true,
    hello: "Hola",
    thanks: "Gracias",
    please: "por favor",
    yes: "Sí",
    no: "No",
    goodbye: "Hasta luego",
    tooMuch: "Es demasiado caro",
    repair: "¿Puede repetir, por favor?",
    nameLine: "Me llamo…",
    because: "porque",
    like: "Me gusta {item}",
    want: "Quiero {item}",
    have: "Tengo {item}",
    howMuch: "¿Cuánto cuesta {item}?",
    where: "¿Dónde está {item}?",
    invite: "¿Quieres {item}?",
    problem: "No hay {item}",
    opinion: "Creo que {item} es mejor",
    yesterday: "Ayer compré {item}",
    questionLike: "¿Te gusta {item}?",
  },
  {
    name: "French",
    bcp47: "fr-FR",
    framed: true,
    hello: "Bonjour",
    thanks: "Merci",
    please: "s'il vous plaît",
    yes: "Oui",
    no: "Non",
    goodbye: "Au revoir",
    tooMuch: "C'est trop cher",
    repair: "Vous pouvez répéter, s'il vous plaît ?",
    nameLine: "Je m'appelle…",
    because: "parce que",
    like: "J'aime {item}",
    want: "Je voudrais {item}",
    have: "J'ai {item}",
    howMuch: "C'est combien, {item} ?",
    where: "Où est {item} ?",
    invite: "Tu veux {item} ?",
    problem: "Il n'y a pas de {item}",
    opinion: "Je pense que {item} est mieux",
    yesterday: "Hier, j'ai pris {item}",
    questionLike: "Tu aimes {item} ?",
  },
  {
    name: "German",
    bcp47: "de-DE",
    framed: true,
    hello: "Hallo",
    thanks: "Danke",
    please: "bitte",
    yes: "Ja",
    no: "Nein",
    goodbye: "Tschüss",
    tooMuch: "Das ist zu teuer",
    repair: "Können Sie das wiederholen, bitte?",
    nameLine: "Ich heiße…",
    because: "weil",
    like: "Ich mag {item}",
    want: "Ich möchte {item}",
    have: "Ich habe {item}",
    howMuch: "Was kostet {item}?",
    where: "Wo ist {item}?",
    invite: "Möchtest du {item}?",
    problem: "Es gibt kein {item}",
    opinion: "Ich finde {item} besser",
    yesterday: "Gestern hatte ich {item}",
    questionLike: "Magst du {item}?",
  },
  {
    name: "Italian",
    bcp47: "it-IT",
    framed: true,
    hello: "Ciao",
    thanks: "Grazie",
    please: "per favore",
    yes: "Sì",
    no: "No",
    goodbye: "Arrivederci",
    tooMuch: "È troppo caro",
    repair: "Può ripetere, per favore?",
    nameLine: "Mi chiamo…",
    because: "perché",
    like: "Mi piace {item}",
    want: "Vorrei {item}",
    have: "Ho {item}",
    howMuch: "Quanto costa {item}?",
    where: "Dov'è {item}?",
    invite: "Vuoi {item}?",
    problem: "Non c'è {item}",
    opinion: "Penso che {item} sia meglio",
    yesterday: "Ieri ho preso {item}",
    questionLike: "Ti piace {item}?",
  },
  {
    name: "Portuguese",
    bcp47: "pt-BR",
    framed: true,
    hello: "Olá",
    thanks: "Obrigado",
    please: "por favor",
    yes: "Sim",
    no: "Não",
    goodbye: "Até logo",
    tooMuch: "É muito caro",
    repair: "Pode repetir, por favor?",
    nameLine: "Eu me chamo…",
    because: "porque",
    like: "Eu gosto de {item}",
    want: "Eu quero {item}",
    have: "Eu tenho {item}",
    howMuch: "Quanto custa {item}?",
    where: "Onde está {item}?",
    invite: "Você quer {item}?",
    problem: "Não tem {item}",
    opinion: "Acho que {item} é melhor",
    yesterday: "Ontem eu comprei {item}",
    questionLike: "Você gosta de {item}?",
  },
  {
    name: "Mandarin",
    bcp47: "zh-CN",
    framed: true,
    scriptNote: "Lines are in pinyin with tone marks, so a class can say them before character reading is solid.",
    hello: "Nǐ hǎo",
    thanks: "Xièxie",
    please: "qǐng",
    yes: "Shì",
    no: "Bù",
    goodbye: "Zàijiàn",
    tooMuch: "Tài guì le",
    repair: "Qǐng zài shuō yí biàn",
    nameLine: "Wǒ jiào…",
    because: "yīnwèi",
    like: "Wǒ xǐhuan {item}",
    want: "Wǒ yào {item}",
    have: "Wǒ yǒu {item}",
    howMuch: "{item} duōshao qián?",
    where: "{item} zài nǎlǐ?",
    invite: "Nǐ yào {item} ma?",
    problem: "Méiyǒu {item}",
    opinion: "Wǒ juéde {item} hǎo",
    yesterday: "Zuótiān wǒ mǎile {item}",
    questionLike: "Nǐ xǐhuan {item} ma?",
  },
  {
    name: "Japanese",
    bcp47: "ja-JP",
    framed: true,
    scriptNote: "Lines are in romaji so the speaking game works before kana is automatic.",
    hello: "Konnichiwa",
    thanks: "Arigatō",
    please: "onegai shimasu",
    yes: "Hai",
    no: "Iie",
    goodbye: "Sayōnara",
    tooMuch: "Takai desu",
    repair: "Mō ichido onegai shimasu",
    nameLine: "Watashi wa … desu",
    because: "kara",
    like: "{item} ga suki desu",
    want: "{item} o kudasai",
    have: "{item} ga arimasu",
    howMuch: "{item} wa ikura desu ka",
    where: "{item} wa doko desu ka",
    invite: "{item} wa dō desu ka",
    problem: "{item} wa arimasen",
    opinion: "{item} no hō ga ii desu",
    yesterday: "Kinō {item} o kaimashita",
    questionLike: "{item} wa suki desu ka",
  },
  {
    name: "Arabic",
    bcp47: "ar-SA",
    framed: true,
    scriptNote: "Lines are transliterated. If your class reads script, swap the printed model and keep the task.",
    hello: "Marhaban",
    thanks: "Shukran",
    please: "min fadlik",
    yes: "Naam",
    no: "La",
    goodbye: "Ma'a as-salama",
    tooMuch: "Ghali jiddan",
    repair: "Mumkin i'adat dhalik?",
    nameLine: "Ismi…",
    because: "li'anna",
    like: "Uhibbu {item}",
    want: "Uridu {item}",
    have: "Ladayya {item}",
    howMuch: "Kam thaman {item}?",
    where: "Ayna {item}?",
    invite: "Hal turidu {item}?",
    problem: "La yujad {item}",
    opinion: "A'taqid anna {item} afdal",
    yesterday: "Ams ishtaraytu {item}",
    questionLike: "Hal tuhibbu {item}?",
  },
  {
    name: "English",
    bcp47: "en-US",
    framed: true,
    hello: "Hello",
    thanks: "Thank you",
    please: "please",
    yes: "Yes",
    no: "No",
    goodbye: "See you later",
    tooMuch: "That's too expensive",
    repair: "Could you repeat that, please?",
    nameLine: "My name is…",
    because: "because",
    like: "I like {item}",
    want: "I want {item}",
    have: "I have {item}",
    howMuch: "How much is {item}?",
    where: "Where is {item}?",
    invite: "Do you want {item}?",
    problem: "There is no {item}",
    opinion: "I think {item} is better",
    yesterday: "Yesterday I got {item}",
    questionLike: "Do you like {item}?",
  },
]

const OTHER: LangPack = {
  name: "Other",
  bcp47: "en-US",
  framed: false,
  scriptNote:
    "Models lock onto the words you typed. Ask students to say the function in the target language and include that word.",
  hello: "hello",
  thanks: "thank you",
  please: "please",
  yes: "yes",
  no: "no",
  goodbye: "goodbye",
  tooMuch: "too much",
  repair: "please repeat",
  nameLine: "my name is",
  because: "because",
  like: "{item}",
  want: "{item}",
  have: "{item}",
  howMuch: "{item}",
  where: "{item}",
  invite: "{item}",
  problem: "{item}",
  opinion: "{item}",
  yesterday: "{item}",
  questionLike: "{item}",
}

export const LANGUAGE_NAMES = [...PACKS.map((pack) => pack.name), "Other"]

export function packFor(language: string): LangPack {
  return PACKS.find((pack) => pack.name.toLowerCase() === language.trim().toLowerCase()) ?? OTHER
}
