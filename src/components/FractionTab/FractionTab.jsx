import { COLORS, STUDENT_NAME } from '../../constants.js'
import './FractionTab.css'

function isBlankCorrect(p, i, j, answers) {
  return (
    parseInt(answers[`${i}_${j}_n`]) === p.blanks[j] &&
    parseInt(answers[`${i}_${j}_d`]) === p.denominator
  )
}

function isProblemCorrect(p, i, answers) {
  return p.blanks.every((_, j) => isBlankCorrect(p, i, j, answers))
}

function isProblemComplete(p, i, answers) {
  return p.blanks.every(
    (_, j) =>
      (answers[`${i}_${j}_n`] ?? '') !== '' &&
      (answers[`${i}_${j}_d`] ?? '') !== '',
  )
}

export default function FractionTab({
  problems,
  answers,
  checked,
  submitted,
  firstCorrect,
  onAnswer,
  onCheck,
  onSubmit,
  onEditAnswers,
}) {
  const total = problems.length
  const allAnswered = problems.every((p, i) => isProblemComplete(p, i, answers))

  const corrections = problems.filter(
    (p, i) => !firstCorrect.includes(i) && isProblemCorrect(p, i, answers),
  ).length
  const finalScore = firstCorrect.length + corrections * 0.5

  return (
    <>
      <p className='frac-hint'>
        Fill in the missing fractions on each number line. 🍕
      </p>

      <div className='nl-list'>
        {problems.map((p, i) => {
          const { denominator, range } = p
          const color = COLORS[i % COLORS.length]
          const isFC = firstCorrect.includes(i)
          const ok = checked && isProblemCorrect(p, i, answers)
          const bad = checked && !isProblemCorrect(p, i, answers)

          const totalTicks = denominator * range + 1 // including 0 position

          return (
            <div
              key={i}
              className='nl-card'
              style={{
                borderColor: ok ? '#1DD1A1' : bad ? '#FF6B6B' : color + '55',
                background: ok
                  ? 'linear-gradient(135deg,#0d2e27,#1a4a3a)'
                  : bad
                    ? 'linear-gradient(135deg,#2e0d0d,#4a1a1a)'
                    : 'linear-gradient(135deg,#1a1a2e,#16213e)',
              }}
            >
              <div className='nl-card-header'>
                <span className='nl-card-num'>#{i + 1}</span>
                <span className='nl-card-tag'>0 → {range}</span>
              </div>

              <div className='nl-track-wrap'>
                <div className='nl-track'>
                  {Array.from({ length: totalTicks }, (_, pos) => {
                    const isStart = pos === 0
                    const blankIdx = pos - 1 // blanks start at pos 1
                    const isWholeNumber = pos % denominator === 0
                    const wholeNum = pos / denominator

                    // Per-blank correct/wrong (after check)
                    const numVal = isStart
                      ? null
                      : (answers[`${i}_${blankIdx}_n`] ?? '')
                    const denomVal = isStart
                      ? null
                      : (answers[`${i}_${blankIdx}_d`] ?? '')
                    const blankCorrect =
                      !isStart &&
                      checked &&
                      isBlankCorrect(p, i, blankIdx, answers)
                    const blankWrong =
                      !isStart &&
                      checked &&
                      !isBlankCorrect(p, i, blankIdx, answers)

                    return (
                      <div key={pos} className='nl-tick'>
                        {isWholeNumber && (
                          <span className='nl-whole'>{wholeNum}</span>
                        )}

                        <div className='nl-frac'>
                          {isStart ? (
                            <span className='nl-prefilled'>0</span>
                          ) : (
                            <div
                              className='nl-fraction-inputs'
                              style={{
                                borderColor: blankCorrect
                                  ? '#1DD1A1'
                                  : blankWrong
                                    ? '#FF6B6B'
                                    : color,
                                color: blankCorrect
                                  ? '#1DD1A1'
                                  : blankWrong
                                    ? '#FF6B6B'
                                    : '#fff',
                              }}
                            >
                              <input
                                className='nl-input'
                                type='number'
                                value={numVal}
                                placeholder='?'
                                disabled={submitted || isFC}
                                onChange={e =>
                                  onAnswer(`${i}_${blankIdx}_n`, e.target.value)
                                }
                              />
                              <div className='nl-fraction-line' />
                              <input
                                className='nl-input'
                                type='number'
                                value={denomVal}
                                placeholder='?'
                                disabled={submitted || isFC}
                                onChange={e =>
                                  onAnswer(`${i}_${blankIdx}_d`, e.target.value)
                                }
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {ok && isFC && (
                <div className='nl-feedback' style={{ color: '#1dd1a1' }}>
                  ✅ Correct!
                </div>
              )}
              {ok && !isFC && checked && (
                <div className='nl-feedback' style={{ color: '#54a0ff' }}>
                  ✅ +0.5 correction
                </div>
              )}
              {bad && (
                <div className='nl-feedback' style={{ color: '#ff6b6b' }}>
                  ❌ Check the highlighted boxes above
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className='actions'>
        {!checked ? (
          <button
            className='btn-check'
            style={{ opacity: allAnswered ? 1 : 0.6 }}
            onClick={onCheck}
          >
            Check My Answers ✅
          </button>
        ) : !submitted ? (
          <div className='result-panel'>
            <div className='result-emoji'>
              {firstCorrect.length === total
                ? '🏆'
                : firstCorrect.length >= total * 0.75
                  ? '👍'
                  : '📚'}
            </div>
            <div className='result-text'>
              {firstCorrect.length === total
                ? `Perfect first try, ${STUDENT_NAME}! 🎉`
                : `${firstCorrect.length}/${total} on first try — fix the ones in red above!`}
            </div>
            <div className='result-score'>
              {firstCorrect.length}/{total} first attempt
            </div>
            <button
              className='btn-check'
              style={{ marginBottom: '10px' }}
              onClick={onSubmit}
            >
              Submit Results 📬
            </button>
            <br />
            <button className='btn' onClick={onEditAnswers}>
              ✏️ Fix a typo
            </button>
          </div>
        ) : (
          <div className='result-panel'>
            <div className='result-emoji'>
              {finalScore === total
                ? '🏆'
                : finalScore >= total * 0.9
                  ? '🌟'
                  : finalScore >= total * 0.75
                    ? '👍'
                    : '💪'}
            </div>
            <div className='result-text'>
              {finalScore === total
                ? `Perfect score, ${STUDENT_NAME}! 🎉`
                : `Great effort, ${STUDENT_NAME}!`}
            </div>
            <div className='result-score'>
              {finalScore}/{total} points
            </div>
            <div className='result-breakdown'>
              {firstCorrect.length} × 1pt + {corrections} × 0.5pt
            </div>
          </div>
        )}
      </div>
    </>
  )
}
