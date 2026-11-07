# Lesson JSON

Generate and Import both use this object. LingoQuest checks it in the browser, then saves a **new** lesson. It does not reuse an id from the JSON, and it does not read or write student progress.

Activities and arcade games are not separate fields. After a lesson is saved, the app builds them from `vocabulary`, `sentences`, `structures`, `canDo`, and `cultureNote`.

```json
{
  "title": "string",
  "languageId": "it",
  "level": "novice-mid",
  "theme": "string",
  "essentialQuestion": "string",
  "canDo": ["I can ..."],
  "vocabulary": [{ "term": "un caffè", "translation": "an espresso coffee" }],
  "sentences": ["Vorrei un caffè, per favore."],
  "structures": ["Vorrei… (I would like…)"],
  "cultureNote": "string"
}
```

| Field | What it is |
| --- | --- |
| `title` | Name of the lesson |
| `languageId` | Language code: `it`, `es`, `fr`, `de`, `pt`, `zh`, `ja`, `ko`, `ar`, `ru`, `hi`, `en`, or `es-mx` |
| `level` | `novice-low`, `novice-mid`, `novice-high`, `intermediate-low`, `intermediate-mid`, `intermediate-high`, `advanced-low`, `advanced-mid`, `advanced-high` |
| `theme` | Topic or unit |
| `essentialQuestion` | The question the lesson is built around |
| `canDo` | Student goals. At least two. Do not claim an ACTFL endorsement. |
| `vocabulary` | Words with articles where the language uses them, plus an English meaning. At least three. |
| `sentences` | Model sentences in the target language. At least two. The arcade speaks these. |
| `structures` | Functional chunks and patterns, with a short English gloss. At least one. |
| `cultureNote` | A culture note without absolutes such as “always” or “never”. |

An example is in `docs/examples/cafe-al-bar.example.json`.
