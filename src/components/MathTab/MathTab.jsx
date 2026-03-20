import { COLORS, typeLabel, typeName, typeAccent, STUDENT_NAME } from '../../constants.js'
import './MathTab.css'

export default function MathTab({
  mode,
  problems,
  answers,
  checked,
  onModeChange,
  onAnswer,
  onCheck,
  onRetry,
}) {
  const score = problems.reduce(
    (a, p, i) => a + (parseInt(answers[i]) === p.answer ? 1 : 0),
    0,
  )
  const allAnswered =
    Object.keys(answers).filter(k => answers[k] !== '').length === 20

  return (
    <>
      {/* Mode filter tabs */}
      <div className="tabs">
        <button
          className={`tab${mode === 'mixed' ? ' tab--active' : ''}`}
          style={mode === 'mixed' ? { borderColor: typeAccent.mixed, color: typeAccent.mixed } : undefined}
          onClick={() => onModeChange('mixed')}
        >
          🎲 Mixed
        </button>
        {Object.entries(typeLabel).map(([t, emoji]) => (
          <button
            key={t}
            className={`tab${mode === t ? ' tab--active' : ''}`}
            style={mode === t ? { borderColor: typeAccent[t], color: typeAccent[t] } : undefined}
            onClick={() => onModeChange(t)}
          >
            {emoji} {typeName[t]}
          </button>
        ))}
      </div>

      {/* Problem grid */}
      <div className="grid">
        {problems.map((p, i) => {
          const ans = answers[i] ?? ''
          const ok = checked && parseInt(ans) === p.answer
          const bad = checked && ans !== '' && parseInt(ans) !== p.answer
          const skip = checked && ans === ''
          const color = COLORS[i % COLORS.length]

          return (
            <div
              key={i}
              className="card"
              style={{
                borderColor: ok ? '#1DD1A1' : bad ? '#FF6B6B' : skip ? '#FFD700' : color + '55',
                background: ok
                  ? 'linear-gradient(135deg,#0d2e27,#1a4a3a)'
                  : bad
                    ? 'linear-gradient(135deg,#2e0d0d,#4a1a1a)'
                    : 'linear-gradient(135deg,#1a1a2e,#16213e)',
              }}
            >
              <div className="card-num">{i + 1}</div>
              <div className="card-type">{typeLabel[p.type]}</div>
              <div className="problem">{p.display} =</div>
              <input
                className="input"
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
              {ok   && <div className="feedback">✅ Correct!</div>}
              {bad  && <div className="feedback feedback--wrong">❌ It's {p.answer}</div>}
              {skip && <div className="feedback feedback--skip">⚠️ Skipped</div>}
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
              {score === 20 ? '🏆' : score >= 18 ? '🌟' : score >= 15 ? '👍' : score >= 10 ? '💪' : '📚'}
            </div>
            <div className="result-text">
              {score === 20
                ? `Perfect score, ${STUDENT_NAME}! You're a math superstar! 🎉`
                : score >= 18
                  ? `Amazing, ${STUDENT_NAME}! So close to perfect!`
                  : score >= 15
                    ? `Great job, ${STUDENT_NAME}! Keep practicing!`
                    : `Good effort, ${STUDENT_NAME}! Keep going!`}
            </div>
            <div className="result-score">{score} out of 20 correct</div>
            <button className="btn" onClick={onRetry}>
              Try Again! 🎲
            </button>
          </div>
        )}
      </div>
    </>
  )
}
