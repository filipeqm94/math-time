const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];

const NAMES = [
  "Emma", "Liam", "Sofia", "Noah", "Mia", "Lucas",
  "Ava", "Ethan", "Lily", "Jack", "Zoe", "Owen",
];

const THINGS = [
  { item: "apples" },
  { item: "stickers" },
  { item: "books" },
  { item: "marbles" },
  { item: "crayons" },
  { item: "cookies" },
  { item: "cards" },
  { item: "pennies" },
];

export function makeWordProblem() {
  const type = pick(["add", "sub", "mul", "div", "frac"]);
  const name = pick(NAMES);
  const name2 = pick(NAMES.filter((n) => n !== name));
  const t = pick(THINGS);

  if (type === "add") {
    const a = rand(100, 499), b = rand(100, 499);
    return {
      text: `${name} has ${a} ${t.item}. ${name2} gives ${name} ${b} more ${t.item}. How many ${t.item} does ${name} have in total?`,
      answer: a + b, type,
    };
  } else if (type === "sub") {
    const total = rand(200, 799), used = rand(100, total - 50);
    return {
      text: `${name} had ${total} ${t.item}. ${name} gave away ${used} ${t.item} to friends. How many ${t.item} does ${name} have left?`,
      answer: total - used, type,
    };
  } else if (type === "mul") {
    const bags = rand(3, 9), perBag = rand(3, 9);
    return {
      text: `${name} has ${bags} bags of ${t.item}. Each bag has ${perBag} ${t.item} in it. How many ${t.item} does ${name} have altogether?`,
      answer: bags * perBag, type,
    };
  } else if (type === "div") {
    const groups = rand(3, 8), perGroup = rand(4, 12), total = groups * perGroup;
    return {
      text: `${name} has ${total} ${t.item} to share equally among ${groups} friends. How many ${t.item} does each friend get?`,
      answer: perGroup, type,
    };
  } else {
    const opts = [
      { total: 24, frac: "half", answer: 12 },
      { total: 36, frac: "half", answer: 18 },
      { total: 20, frac: "quarter", answer: 5 },
      { total: 40, frac: "quarter", answer: 10 },
      { total: 50, frac: "half", answer: 25 },
      { total: 60, frac: "quarter", answer: 15 },
      { total: 16, frac: "half", answer: 8 },
    ];
    const o = pick(opts);
    return {
      text: `${name} baked ${o.total} ${t.item}. ${name2} ate ${o.frac} of them. How many ${t.item} did ${name2} eat?`,
      answer: o.answer, type: "frac",
    };
  }
}

export function generateWordProblems() {
  return Array.from({ length: 10 }, makeWordProblem);
}
