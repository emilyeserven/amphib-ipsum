import { words } from "./words";
const CATEGORY_WEIGHTS = [
    { category: "connectors", weight: 30 },
    { category: "anatomy", weight: 14 },
    { category: "habitat", weight: 14 },
    { category: "behavior", weight: 14 },
    { category: "scientific", weight: 14 },
    { category: "common", weight: 14 },
];
const totalWeight = CATEGORY_WEIGHTS.reduce((sum, c) => sum + c.weight, 0);
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pickCategory() {
    let roll = Math.random() * totalWeight;
    for (const { category, weight } of CATEGORY_WEIGHTS) {
        roll -= weight;
        if (roll <= 0)
            return category;
    }
    return "connectors";
}
const recentWords = [];
const MAX_RECENT = 5;
function pickWord() {
    let word;
    let attempts = 0;
    do {
        const category = pickCategory();
        word = pickRandom(words[category]);
        attempts++;
    } while (recentWords.includes(word) && attempts < 10);
    recentWords.push(word);
    if (recentWords.length > MAX_RECENT) {
        recentWords.shift();
    }
    return word;
}
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
function generateSentence() {
    const length = randomInt(5, 15);
    const wordList = [];
    for (let i = 0; i < length; i++) {
        wordList.push(pickWord());
    }
    // Insert a comma in longer sentences for natural rhythm
    if (length >= 8 && Math.random() < 0.3) {
        const commaPos = randomInt(2, length - 3);
        wordList[commaPos] = wordList[commaPos] + ",";
    }
    wordList[0] = capitalize(wordList[0]);
    return wordList.join(" ") + ".";
}
function generateParagraph() {
    const sentenceCount = randomInt(3, 7);
    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
        sentences.push(generateSentence());
    }
    return sentences.join(" ");
}
export function generate(type, count) {
    const clamped = Math.max(1, Math.min(99, Math.floor(count)));
    if (type === "paragraphs") {
        const paragraphs = [];
        for (let i = 0; i < clamped; i++) {
            paragraphs.push(generateParagraph());
        }
        return paragraphs.join("\n\n");
    }
    if (type === "sentences") {
        const sentences = [];
        for (let i = 0; i < clamped; i++) {
            sentences.push(generateSentence());
        }
        return sentences.join(" ");
    }
    // words
    const wordList = [];
    for (let i = 0; i < clamped; i++) {
        wordList.push(pickWord());
    }
    wordList[0] = capitalize(wordList[0]);
    return wordList.join(" ") + ".";
}
