import { words, type WordList } from "./words";

type Category = keyof WordList;

type UnitType = "paragraphs" | "sentences" | "words";

export type ScientificMode = "include" | "exclude" | "only";

const CATEGORY_WEIGHTS: { category: Category; weight: number }[] = [
  { category: "connectors", weight: 30 },
  { category: "anatomy", weight: 14 },
  { category: "habitat", weight: 14 },
  { category: "behavior", weight: 14 },
  { category: "scientific", weight: 14 },
  { category: "common", weight: 14 },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickCategory(scientificMode: ScientificMode): Category {
  if (scientificMode === "only") return "scientific";

  const activeWeights =
    scientificMode === "include"
      ? CATEGORY_WEIGHTS
      : CATEGORY_WEIGHTS.filter((c) => c.category !== "scientific");
  const activeTotal = activeWeights.reduce((sum, c) => sum + c.weight, 0);

  let roll = Math.random() * activeTotal;
  for (const { category, weight } of activeWeights) {
    roll -= weight;
    if (roll <= 0) return category;
  }
  return "connectors";
}

const recentWords: string[] = [];
const MAX_RECENT = 5;

function pickWord(scientificMode: ScientificMode): string {
  let word: string;
  let attempts = 0;

  do {
    const category = pickCategory(scientificMode);
    word = pickRandom(words[category]);
    attempts++;
  } while (recentWords.includes(word) && attempts < 10);

  recentWords.push(word);
  if (recentWords.length > MAX_RECENT) {
    recentWords.shift();
  }

  return word;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function generateSentence(scientificMode: ScientificMode): string {
  const length = randomInt(5, 15);
  const wordList: string[] = [];

  for (let i = 0; i < length; i++) {
    wordList.push(pickWord(scientificMode));
  }

  // Insert a comma in longer sentences for natural rhythm
  if (length >= 8 && Math.random() < 0.3) {
    const commaPos = randomInt(2, length - 3);
    wordList[commaPos] = wordList[commaPos] + ",";
  }

  wordList[0] = capitalize(wordList[0]);
  return wordList.join(" ") + ".";
}

function generateParagraph(scientificMode: ScientificMode): string {
  const sentenceCount = randomInt(3, 7);
  const sentences: string[] = [];

  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence(scientificMode));
  }

  return sentences.join(" ");
}

export function generate(
  type: UnitType,
  count: number,
  scientificMode: ScientificMode = "include",
): string {
  const clamped = Math.max(1, Math.min(99, Math.floor(count)));

  if (type === "paragraphs") {
    const paragraphs: string[] = [];
    for (let i = 0; i < clamped; i++) {
      paragraphs.push(generateParagraph(scientificMode));
    }
    return paragraphs.join("\n\n");
  }

  if (type === "sentences") {
    const sentences: string[] = [];
    for (let i = 0; i < clamped; i++) {
      sentences.push(generateSentence(scientificMode));
    }
    return sentences.join(" ");
  }

  // words
  const wordList: string[] = [];
  for (let i = 0; i < clamped; i++) {
    wordList.push(pickWord(scientificMode));
  }
  wordList[0] = capitalize(wordList[0]);
  return wordList.join(" ") + ".";
}
