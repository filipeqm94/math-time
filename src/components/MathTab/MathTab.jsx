import { COLORS, typeLabel, typeName, typeAccent, STUDENT_NAME } from '../../constants.js'
import './MathTab.css'

export default function MathTab({
  mode,
  problems,
  answers,
  checked,
  submitted,
  firstCorrect,
  onModeChange,
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
          const isFirstCorrect = firstCorrect.includes(i)
          const ok = checked && ans !== '' && parseInt(ans) === p.answer
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
                disabled={submitted || isFirstCorrect}
                onChange={e => onAnswer(i, e.target.value)}
              />
              {ok && isFirstCorrect  && <div className="feedback">✅ Correct!</div>}
              {ok && !isFirstCorrect && checked && <div className="feedback feedback--correction">✅ +0.5 correction</div>}
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
            {firstCorrect.length < total && (
              <button className="btn-check" style={{ marginBottom: '12px' }} onClick={onSubmit}>
                Submit Results 📬
              </button>
            )}
            {firstCorrect.length === total && (
              <button className="btn-check" onClick={onSubmit}>Submit Results 📬</button>
            )}
          </div>
        ) : (
          <div className="result-panel">
            <div className="result-emoji">
              {finalScore === total ? '🏆' : finalScore >= total * 0.9 ? '🌟' : finalScore >= total * 0.75 ? '👍' : '💪'}
            </div>
            <div className="result-text">
              {finalScore === total
                ? `Perfect score, ${STUDENT_NAME}! You're a math superstar! 🎉`
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
