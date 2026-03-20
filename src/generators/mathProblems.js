import { getDailyRandom } from './seededRandom.js';

let _rng = getDailyRandom();
const rand = (min, max) => Math.floor(_rng() * (max - min + 1)) + min;

export function makeProblem(type) {
  if (type === "add") {
    const a = rand(100, 999), b = rand(100, 999);
    return { display: `${a} + ${b}`, answer: a + b, type };
  } else if (type === "sub") {
    const a = rand(200, 999), b = rand(100, a);
    return { display: `${a} - ${b}`, answer: a - b, type };
  } else if (type === "mul") {
    const a = rand(2, 9), b = rand(2, 9);
    return { display: `${a} x ${b}`, answer: a * b, type };
  } else if (type === "div") {
    const b = rand(2, 9), answer = rand(2, 12), a = b * answer;
    return { display: `${a} / ${b}`, answer, type };
  } else {
    const opts = [
      { display: "1/2 of 24", answer: 12 }, { display: "1/2 of 36", answer: 18 },
      { display: "1/4 of 20", answer: 5 }, { display: "1/4 of 40", answer: 10 },
      { display: "1/2 of 50", answer: 25 }, { display: "1/4 of 100", answer: 25 },
      { display: "1/2 of 16", answer: 8 }, { display: "1/4 of 60", answer: 15 },
    ];
    return { ...opts[rand(0, opts.length - 1)], type: "frac" };
  }
}

export function generateProblems(mode = "mixed") {
  _rng = getDailyRandom();
  if (mode !== "mixed") {
    return Array.from({ length: 20 }, () => makeProblem(mode));
  }
  return [
    ...Array(8).fill("add"),
    ...Array(6).fill("sub"),
    ...Array(3).fill("mul"),
    ...Array(2).fill("div"),
    ...Array(1).fill("frac"),
  ].sort(() => Math.random() - 0.5).map(makeProblem);
}
