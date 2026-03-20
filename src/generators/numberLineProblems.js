import { getDailyRandom } from './seededRandom.js'

const DENOMINATORS = [2, 3, 4, 6, 8]

let _rng = getDailyRandom()

export function generateNumberLines() {
  _rng = getDailyRandom()
  const rand = (min, max) => Math.floor(_rng() * (max - min + 1)) + min

  // Build all 10 unique combinations and shuffle them
  const combos = []
  for (const denominator of DENOMINATORS) {
    for (const range of [1, 2]) {
      combos.push({ denominator, range })
    }
  }
  for (let i = combos.length - 1; i > 0; i--) {
    const j = Math.floor(_rng() * (i + 1));
    [combos[i], combos[j]] = [combos[j], combos[i]]
  }

  const count = rand(3, 8)
  return combos.slice(0, count).map(({ denominator, range }) => ({
    denominator,
    range,
    blanks: Array.from({ length: denominator * range }, (_, j) => j + 1),
  }))
}
