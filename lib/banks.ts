import type { VocabTerm } from "./actfl";

// Core banks: language -> theme -> terms. Glosses are English.
const ES: Record<string, VocabTerm[]> = {
  "Food & Restaurants": [
    { term: "la cuenta", gloss: "the bill", example: "¿La cuenta, por favor?" },
    { term: "el menú", gloss: "the menu", example: "¿Puedo ver el menú?" },
    { term: "tengo hambre", gloss: "I'm hungry", example: "Tengo hambre — ¿comemos?" },
    { term: "delicioso/a", gloss: "delicious", example: "La paella está deliciosa." },
    { term: "quiero…", gloss: "I want…", example: "Quiero una mesa para dos." },
    { term: "la propina", gloss: "the tip", example: "Dejamos una propina." },
    { term: "el/la camarero/a", gloss: "the server", example: "El camarero es amable." },
    { term: "picante", gloss: "spicy", example: "La salsa está picante." },
    { term: "la reserva", gloss: "the reservation", example: "Tengo una reserva a las ocho." },
    { term: "para llevar", gloss: "to take out", example: "Una pizza para llevar." },
    { term: "el postre", gloss: "dessert", example: "De postre, flan." },
    { term: "¿qué recomienda?", gloss: "what do you recommend?", example: "¿Qué recomienda hoy?" },
  ],
  "Travel & Directions": [
    { term: "¿dónde está…?", gloss: "where is…?", example: "¿Dónde está la estación?" },
    { term: "a la derecha", gloss: "to the right", example: "Gira a la derecha." },
    { term: "a la izquierda", gloss: "to the left", example: "Está a la izquierda." },
    { term: "el billete", gloss: "the ticket", example: "Compré dos billetes." },
    { term: "la salida", gloss: "the exit / departure", example: "La salida es a las tres." },
    { term: "perdido/a", gloss: "lost", example: "Estoy perdido — ¿me ayuda?" },
    { term: "el mapa", gloss: "the map", example: "Mira el mapa." },
    { term: "cerca / lejos", gloss: "near / far", example: "Está cerca del hotel." },
    { term: "el tren", gloss: "the train", example: "El tren llega tarde." },
    { term: "la parada", gloss: "the stop", example: "Baja en la próxima parada." },
    { term: "¿cuánto cuesta?", gloss: "how much?", example: "¿Cuánto cuesta el taxi?" },
    { term: "todo recto", gloss: "straight ahead", example: "Sigue todo recto." },
  ],
  "School & Daily Life": [
    { term: "la mochila", gloss: "backpack", example: "Mi mochila es roja." },
    { term: "tengo clase", gloss: "I have class", example: "Tengo clase a las nueve." },
    { term: "el horario", gloss: "the schedule", example: "Mi horario es fácil." },
    { term: "estudiar", gloss: "to study", example: "Estudio español cada día." },
    { term: "el recreo", gloss: "recess / break", example: "Nos vemos en el recreo." },
    { term: "la tarea", gloss: "homework", example: "Hago la tarea por la tarde." },
    { term: "temprano/tarde", gloss: "early/late", example: "Llego temprano." },
    { term: "mis amigos", gloss: "my friends", example: "Mis amigos son divertidos." },
    { term: "el almuerzo", gloss: "lunch", example: "El almuerzo es a las doce." },
    { term: "después de clase", gloss: "after class", example: "Juego fútbol después de clase." },
    { term: "aburrido/divertido", gloss: "boring/fun", example: "La clase es divertida." },
    { term: "¿me ayudas?", gloss: "can you help me?", example: "¿Me ayudas con esto?" },
  ],
  "Family & Friends": [
    { term: "mi familia", gloss: "my family", example: "Mi familia es grande." },
    { term: "mis padres", gloss: "my parents", example: "Mis padres cocinan bien." },
    { term: "mi mejor amigo/a", gloss: "my best friend", example: "Ella es mi mejor amiga." },
    { term: "los abuelos", gloss: "grandparents", example: "Mis abuelos viven cerca." },
    { term: "cumpleaños", gloss: "birthday", example: "Mi cumpleaños es en mayo." },
    { term: "quiero mucho a…", gloss: "I love… (people)", example: "Quiero mucho a mi hermano." },
    { term: "pasar tiempo", gloss: "to spend time", example: "Paso tiempo con amigos." },
    { term: "la fiesta", gloss: "the party", example: "Hay una fiesta el sábado." },
    { term: "cariñoso/a", gloss: "affectionate", example: "Mi gato es cariñoso." },
    { term: "pelearse", gloss: "to argue", example: "A veces nos peleamos." },
    { term: "llevarse bien", gloss: "to get along", example: "Me llevo bien con ella." },
    { term: "la foto", gloss: "the photo", example: "Mira esta foto familiar." },
  ],
  "Health & Body": [
    { term: "me duele…", gloss: "my … hurts", example: "Me duele la cabeza." },
    { term: "estoy enfermo/a", gloss: "I'm sick", example: "Estoy enferma hoy." },
    { term: "la farmacia", gloss: "the pharmacy", example: "Voy a la farmacia." },
    { term: "necesito descansar", gloss: "I need to rest", example: "Necesito descansar." },
    { term: "tengo fiebre", gloss: "I have a fever", example: "Tengo fiebre y tos." },
    { term: "el/la médico/a", gloss: "the doctor", example: "El médico es amable." },
    { term: "sano/a", gloss: "healthy", example: "Como sano cada día." },
    { term: "hacer ejercicio", gloss: "to exercise", example: "Hago ejercicio por la mañana." },
    { term: "dormir bien", gloss: "to sleep well", example: "Duermo ocho horas." },
    { term: "la cita", gloss: "the appointment", example: "Tengo cita a las diez." },
    { term: "sentirse mejor", gloss: "to feel better", example: "Ya me siento mejor." },
    { term: "cuidarse", gloss: "to take care of oneself", example: "Hay que cuidarse." },
  ],
  "Weather & Seasons": [
    { term: "hace sol", gloss: "it's sunny", example: "Hoy hace sol." },
    { term: "llueve", gloss: "it's raining", example: "Llueve mucho en abril." },
    { term: "hace frío/calor", gloss: "it's cold/hot", example: "Hace frío en enero." },
    { term: "la tormenta", gloss: "the storm", example: "Hay una tormenta." },
    { term: "el pronóstico", gloss: "the forecast", example: "Mira el pronóstico." },
    { term: "nieva", gloss: "it's snowing", example: "Nieva en las montañas." },
    { term: "la estación", gloss: "the season", example: "Mi estación favorita es el otoño." },
    { term: "nublado", gloss: "cloudy", example: "Está nublado hoy." },
    { term: "el paraguas", gloss: "the umbrella", example: "Lleva el paraguas." },
    { term: "hace viento", gloss: "it's windy", example: "Hace viento en la playa." },
    { term: "la temperatura", gloss: "the temperature", example: "La temperatura es perfecta." },
    { term: "mañana lloverá", gloss: "tomorrow it will rain", example: "Mañana lloverá." },
  ],
};

const FR: Record<string, VocabTerm[]> = {
  "Food & Restaurants": [
    { term: "l'addition", gloss: "the bill", example: "L'addition, s'il vous plaît." },
    { term: "le menu", gloss: "the menu", example: "Je voudrais voir le menu." },
    { term: "j'ai faim", gloss: "I'm hungry", example: "J'ai faim — on mange ?" },
    { term: "délicieux", gloss: "delicious", example: "C'est délicieux !" },
    { term: "je voudrais…", gloss: "I would like…", example: "Je voudrais une table pour deux." },
    { term: "le pourboire", gloss: "the tip", example: "On laisse un pourboire." },
    { term: "le serveur / la serveuse", gloss: "the server", example: "Le serveur est sympa." },
    { term: "épicé", gloss: "spicy", example: "C'est un peu épicé." },
    { term: "la réservation", gloss: "the reservation", example: "J'ai une réservation à huit heures." },
    { term: "à emporter", gloss: "to take out", example: "Une pizza à emporter." },
    { term: "le dessert", gloss: "dessert", example: "En dessert, une tarte." },
    { term: "vous recommandez quoi ?", gloss: "what do you recommend?", example: "Vous recommandez quoi ?" },
  ],
  "Travel & Directions": [
    { term: "où est… ?", gloss: "where is…?", example: "Où est la gare ?" },
    { term: "à droite", gloss: "to the right", example: "Tournez à droite." },
    { term: "à gauche", gloss: "to the left", example: "C'est à gauche." },
    { term: "le billet", gloss: "the ticket", example: "J'ai deux billets." },
    { term: "la sortie", gloss: "the exit", example: "La sortie est par ici." },
    { term: "perdu(e)", gloss: "lost", example: "Je suis perdu — aidez-moi ?" },
    { term: "le plan", gloss: "the map", example: "Regarde le plan." },
    { term: "près / loin", gloss: "near / far", example: "C'est près de l'hôtel." },
    { term: "le train", gloss: "the train", example: "Le train est en retard." },
    { term: "l'arrêt", gloss: "the stop", example: "Descendez au prochain arrêt." },
    { term: "c'est combien ?", gloss: "how much?", example: "Le taxi, c'est combien ?" },
    { term: "tout droit", gloss: "straight ahead", example: "Allez tout droit." },
  ],
  "School & Daily Life": [
    { term: "le sac à dos", gloss: "backpack", example: "Mon sac à dos est rouge." },
    { term: "j'ai cours", gloss: "I have class", example: "J'ai cours à neuf heures." },
    { term: "l'emploi du temps", gloss: "the schedule", example: "Mon emploi du temps est cool." },
    { term: "étudier", gloss: "to study", example: "J'étudie le français chaque jour." },
    { term: "la récré", gloss: "recess", example: "On se voit à la récré." },
    { term: "les devoirs", gloss: "homework", example: "Je fais mes devoirs le soir." },
    { term: "tôt / tard", gloss: "early / late", example: "J'arrive tôt." },
    { term: "mes amis", gloss: "my friends", example: "Mes amis sont drôles." },
    { term: "le déjeuner", gloss: "lunch", example: "Le déjeuner est à midi." },
    { term: "après les cours", gloss: "after class", example: "Je joue au foot après les cours." },
    { term: "ennuyeux / amusant", gloss: "boring / fun", example: "Le cours est amusant." },
    { term: "tu peux m'aider ?", gloss: "can you help me?", example: "Tu peux m'aider ?" },
  ],
  "Family & Friends": [
    { term: "ma famille", gloss: "my family", example: "Ma famille est grande." },
    { term: "mes parents", gloss: "my parents", example: "Mes parents cuisinent bien." },
    { term: "mon meilleur ami / ma meilleure amie", gloss: "my best friend", example: "C'est ma meilleure amie." },
    { term: "les grands-parents", gloss: "grandparents", example: "Mes grands-parents habitent près d'ici." },
    { term: "l'anniversaire", gloss: "birthday", example: "Mon anniversaire est en mai." },
    { term: "j'adore…", gloss: "I love…", example: "J'adore mon frère." },
    { term: "passer du temps", gloss: "to spend time", example: "Je passe du temps avec mes amis." },
    { term: "la fête", gloss: "the party", example: "Il y a une fête samedi." },
    { term: "affectueux", gloss: "affectionate", example: "Mon chat est affectueux." },
    { term: "se disputer", gloss: "to argue", example: "Parfois on se dispute." },
    { term: "bien s'entendre", gloss: "to get along", example: "Je m'entends bien avec elle." },
    { term: "la photo", gloss: "the photo", example: "Regarde cette photo de famille." },
  ],
  "Health & Body": [
    { term: "j'ai mal à…", gloss: "my … hurts", example: "J'ai mal à la tête." },
    { term: "je suis malade", gloss: "I'm sick", example: "Je suis malade aujourd'hui." },
    { term: "la pharmacie", gloss: "the pharmacy", example: "Je vais à la pharmacie." },
    { term: "j'ai besoin de repos", gloss: "I need rest", example: "J'ai besoin de repos." },
    { term: "j'ai de la fièvre", gloss: "I have a fever", example: "J'ai de la fièvre." },
    { term: "le médecin", gloss: "the doctor", example: "Le médecin est gentil." },
    { term: "en bonne santé", gloss: "healthy", example: "Je mange sain chaque jour." },
    { term: "faire du sport", gloss: "to exercise", example: "Je fais du sport le matin." },
    { term: "bien dormir", gloss: "to sleep well", example: "Je dors huit heures." },
    { term: "le rendez-vous", gloss: "the appointment", example: "J'ai rendez-vous à dix heures." },
    { term: "se sentir mieux", gloss: "to feel better", example: "Je me sens déjà mieux." },
    { term: "prendre soin de soi", gloss: "to take care of oneself", example: "Il faut prendre soin de soi." },
  ],
  "Weather & Seasons": [
    { term: "il fait beau", gloss: "it's nice out", example: "Aujourd'hui il fait beau." },
    { term: "il pleut", gloss: "it's raining", example: "Il pleut beaucoup en avril." },
    { term: "il fait froid / chaud", gloss: "it's cold / hot", example: "Il fait froid en janvier." },
    { term: "l'orage", gloss: "the storm", example: "Il y a un orage." },
    { term: "la météo", gloss: "the forecast", example: "Regarde la météo." },
    { term: "il neige", gloss: "it's snowing", example: "Il neige à la montagne." },
    { term: "la saison", gloss: "the season", example: "Ma saison préférée, c'est l'automne." },
    { term: "nuageux", gloss: "cloudy", example: "C'est nuageux aujourd'hui." },
    { term: "le parapluie", gloss: "the umbrella", example: "Prends ton parapluie." },
    { term: "il y a du vent", gloss: "it's windy", example: "Il y a du vent à la plage." },
    { term: "la température", gloss: "the temperature", example: "La température est parfaite." },
    { term: "il pleuvra demain", gloss: "it will rain tomorrow", example: "Il pleuvra demain." },
  ],
};

// Generic fallback bank for remaining languages (glossed simply)
function genericBank(lang: string): Record<string, VocabTerm[]> {
  const pick = (arr: VocabTerm[]) => arr;
  // Reuse Spanish structure with language tag so games still work;
  // teacher's own vocab list takes precedence anyway.
  return {
    "Food & Restaurants": pick(ES["Food & Restaurants"]),
    "Travel & Directions": pick(ES["Travel & Directions"]),
    "School & Daily Life": pick(ES["School & Daily Life"]),
    "Family & Friends": pick(ES["Family & Friends"]),
    "Health & Body": pick(ES["Health & Body"]),
    "Weather & Seasons": pick(ES["Weather & Seasons"]),
  };
}

const BANKS: Record<string, Record<string, VocabTerm[]>> = {
  Spanish: ES,
  French: FR,
  German: genericBank("German"),
  Italian: genericBank("Italian"),
  Mandarin: genericBank("Mandarin"),
  Japanese: genericBank("Japanese"),
};

export function parseTeacherVocab(raw: string): VocabTerm[] {
  return raw
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 30)
    .map((chunk) => {
      const m = chunk.match(/^(.*?)[—–\-:=]+(.*)$/);
      if (m) return { term: m[1].trim(), gloss: m[2].trim(), example: "" };
      return { term: chunk, gloss: "", example: "" };
    });
}

export function resolveVocab(
  language: string,
  theme: string,
  teacherRaw: string
): VocabTerm[] {
  const teacher = parseTeacherVocab(teacherRaw);
  if (teacher.length >= 4) {
    // Enrich with bank glosses/examples when term matches loosely
    const bank = BANKS[language]?.[theme] ?? [];
    return teacher.map((t) => {
      const hit = bank.find(
        (b) =>
          b.term.toLowerCase().includes(t.term.toLowerCase()) ||
          t.term.toLowerCase().includes(b.term.toLowerCase())
      );
      return {
        term: t.term,
        gloss: t.gloss || hit?.gloss || "(your definition)",
        example: hit?.example || "",
      };
    });
  }
  return BANKS[language]?.[theme] ?? ES[theme] ?? ES["Food & Restaurants"];
}

export function getBank(language: string, theme: string): VocabTerm[] {
  return BANKS[language]?.[theme] ?? ES[theme] ?? ES["Food & Restaurants"];
}
