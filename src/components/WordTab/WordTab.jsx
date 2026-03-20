import { COLORS, typeLabel, typeName, STUDENT_NAME } from '../../constants.js'
import './WordTab.css'

export default function WordTab({
  problems,
  answers,
  checked,
  submitted,
  firstCorrect,
  onAnswer,
  onCheck,
  onSubmit,
}) {
  const total = problems.length
  const allAnswered = problems.every((_, i) => (answers[i] ?? '') !== '')

  const corrections = problems.filter(
    (p, i) => !firstCorrect.includes(i) && parseInt(answers[i]) === p.answer
  ).length
  const finalScore = firstCorrect.length + corrections * 0.5

  return (
    <>
      <p className="word-hint">
        Read each problem carefully, then write your answer. {total} problems total.
      </p>

      <div className="word-grid">
        {problems.map((p, i) => {
          const ans = answers[i] ?? ''
          const isFirstCorrect = firstCorrect.includes(i)
          const ok = ans !== '' && parseInt(ans) === p.answer
          const bad = checked && ans !== '' && parseInt(ans) !== p.answer
          const skip = checked && ans === ''
          const color = COLORS[i % COLORS.length]

          return (
            <div
              key={i}
              className="word-card"
              style={{
                borderColor: ok ? '#1DD1A1' : bad ? '#FF6B6B' : skip ? '#FFD700' : color + '55',
                background: ok
                  ? 'linear-gradient(135deg,#0d2e27,#1a4a3a)'
                  : bad
                    ? 'linear-gradient(135deg,#2e0d0d,#4a1a1a)'
                    : 'linear-gradient(135deg,#1a1a2e,#16213e)',
              }}
            >
              <div className="word-header">
                <span className="word-num">#{i + 1}</span>
                <span className="word-type-tag">
                  {typeLabel[p.type]} {typeName[p.type]}
                </span>
              </div>
              <p className="word-text">{p.text}</p>
              <div className="word-input-row">
                <span className="word-answer-label">Answer:</span>
                <input
                  className="input word-input"
                  style={{
                    borderColor: ok ? '#1DD1A1' : bad ? '#FF6B6B' : color,
                    color: ok ? '#1DD1A1' : bad ? '#FF6B6B' : '#fff',
                  }}
                  type='number'
                  value={ans}
                  placeholder='?'
                  disabled={submitted || isFirstCorrect}
                  onChange={e => onAnswer(i, e.target.value)}
                />
              </div>
              {ok && isFirstCorrect  && <div className="feedback">✅ Correct!</div>}
              {ok && !isFirstCorrect && checked && <div className="feedback feedback--correction">✅ +0.5 correction</div>}
              {bad  && <div className="feedback feedback--wrong">❌ The answer is {p.answer}</div>}
              {skip && <div className="feedback feedback--skip">⚠️ You skipped this one</div>}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="actions">
        {!checked ? (
          <button
            className="btn-check"
            style={{ opacity: allAnswered ? 1 : 0.6 }}
            onClick={onCheck}
          >
            Check My Answers ✅
          </button>
        ) : !submitted ? (
          <div className="result-panel">
            <div className="result-emoji">
              {firstCorrect.length === total ? '🏆' : firstCorrect.length >= total * 0.75 ? '👍' : '📚'}
            </div>
            <div className="result-text">
              {firstCorrect.length === total
                ? `Perfect first try, ${STUDENT_NAME}! 🎉`
                : `${firstCorrect.length}/${total} on first try — fix the ones in red above!`}
            </div>
            <div className="result-score">{firstCorrect.length}/{total} first attempt</div>
            <button className="btn-check" onClick={onSubmit}>Submit Results 📬</button>
          </div>
        ) : (
          <div className="result-panel">
            <div className="result-emoji">
              {finalScore === total ? '🏆' : finalScore >= total * 0.9 ? '🌟' : finalScore >= total * 0.75 ? '👍' : '💪'}
            </div>
            <div className="result-text">
              {finalScore === total
                ? `Perfect score, ${STUDENT_NAME}! 🎉`
                : `Great effort, ${STUDENT_NAME}!`}
            </div>
            <div className="result-score">{finalScore}/{total} points</div>
            <div className="result-breakdown">
              {firstCorrect.length} × 1pt + {corrections} × 0.5pt
            </div>
          </div>
        )}
      </div>
    </>
  )
}
