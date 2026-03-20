import { COLORS, typeLabel, typeName, PLAYER_NAME } from '../../constants.js'
import './WordTab.css'

export default function WordTab({
  problems,
  answers,
  checked,
  onAnswer,
  onCheck,
  onRetry,
}) {
  const score = problems.reduce(
    (a, p, i) => a + (parseInt(answers[i]) === p.answer ? 1 : 0),
    0,
  )
  const allAnswered =
    Object.keys(answers).filter(k => answers[k] !== '').length === 10

  return (
    <>
      <p className="word-hint">
        Read each problem carefully, then write your answer. 10 problems total.
      </p>

      <div className="word-grid">
        {problems.map((p, i) => {
          const ans = answers[i] ?? ''
          const ok = checked && parseInt(ans) === p.answer
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
                  disabled={checked}
                  onChange={e => !checked && onAnswer(i, e.target.value)}
                />
              </div>
              {ok   && <div className="feedback">✅ Correct!</div>}
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
        ) : (
          <div className="result-panel">
            <div className="result-emoji">
              {score === 10 ? '🏆' : score >= 8 ? '🌟' : score >= 6 ? '👍' : '📚'}
            </div>
            <div className="result-text">
              {score === 10
                ? `Perfect, ${PLAYER_NAME}! 10 out of 10! 🎉`
                : score >= 8
                  ? `Excellent reading, ${PLAYER_NAME}!`
                  : score >= 6
                    ? `Good job, ${PLAYER_NAME}! Keep reading carefully!`
                    : `Keep practicing, ${PLAYER_NAME}! You've got this!`}
            </div>
            <div className="result-score">{score} out of 10 correct</div>
            <button className="btn" onClick={onRetry}>
              Try Again! 🎲
            </button>
          </div>
        )}
      </div>
    </>
  )
}
