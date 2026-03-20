import {
  COLORS,
  typeLabel,
  typeName,
  typeAccent,
  PLAYER_NAME,
} from '../constants.js'
import { S } from '../styles.js'

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
      <div style={S.tabs}>
        <button
          style={{
            ...S.tab,
            ...(mode === 'mixed'
              ? {
                  ...S.tabActive,
                  borderColor: typeAccent.mixed,
                  color: typeAccent.mixed,
                }
              : {}),
          }}
          onClick={() => onModeChange('mixed')}
        >
          🎲 Mixed
        </button>
        {Object.entries(typeLabel).map(([t, emoji]) => (
          <button
            key={t}
            style={{
              ...S.tab,
              ...(mode === t
                ? {
                    ...S.tabActive,
                    borderColor: typeAccent[t],
                    color: typeAccent[t],
                  }
                : {}),
            }}
            onClick={() => onModeChange(t)}
          >
            {emoji} {typeName[t]}
          </button>
        ))}
      </div>

      {/* Problem grid */}
      <div style={S.grid}>
        {problems.map((p, i) => {
          const ans = answers[i] ?? ''
          const ok = checked && parseInt(ans) === p.answer
          const bad = checked && ans !== '' && parseInt(ans) !== p.answer
          const skip = checked && ans === ''
          const color = COLORS[i % COLORS.length]

          return (
            <div
              key={i}
              style={{
                ...S.card,
                borderColor: ok
                  ? '#1DD1A1'
                  : bad
                    ? '#FF6B6B'
                    : skip
                      ? '#FFD700'
                      : color + '55',
                background: ok
                  ? 'linear-gradient(135deg,#0d2e27,#1a4a3a)'
                  : bad
                    ? 'linear-gradient(135deg,#2e0d0d,#4a1a1a)'
                    : 'linear-gradient(135deg,#1a1a2e,#16213e)',
              }}
            >
              <div style={S.cardNum}>{i + 1}</div>
              <div style={S.cardType}>{typeLabel[p.type]}</div>
              <div style={S.problem}>{p.display} =</div>
              <input
                style={{
                  ...S.input,
                  borderColor: ok ? '#1DD1A1' : bad ? '#FF6B6B' : color,
                  color: ok ? '#1DD1A1' : bad ? '#FF6B6B' : '#fff',
                }}
                type='number'
                value={ans}
                placeholder='?'
                disabled={checked}
                onChange={e => !checked && onAnswer(i, e.target.value)}
              />
              {ok && <div style={S.feedback}>✅ Correct!</div>}
              {bad && (
                <div style={{ ...S.feedback, color: '#FF6B6B' }}>
                  ❌ It's {p.answer}
                </div>
              )}
              {skip && (
                <div style={{ ...S.feedback, color: '#FFD700' }}>
                  ⚠️ Skipped
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div style={S.actions}>
        {!checked ? (
          <button
            style={{ ...S.checkBtn, opacity: allAnswered ? 1 : 0.6 }}
            onClick={onCheck}
          >
            Check My Answers ✅
          </button>
        ) : (
          <div style={S.resultPanel}>
            <div style={S.resultEmoji}>
              {score === 20
                ? '🏆'
                : score >= 18
                  ? '🌟'
                  : score >= 15
                    ? '👍'
                    : score >= 10
                      ? '💪'
                      : '📚'}
            </div>
            <div style={S.resultText}>
              {score === 20
                ? `Perfect score, ${PLAYER_NAME}! You're a math superstar! 🎉`
                : score >= 18
                  ? `Amazing, ${PLAYER_NAME}! So close to perfect!`
                  : score >= 15
                    ? `Great job, ${PLAYER_NAME}! Keep practicing!`
                    : `Good effort, ${PLAYER_NAME}! Keep going!`}
            </div>
            <div style={S.resultScore}>{score} out of 20 correct</div>
            <button style={S.btn} onClick={onRetry}>
              Try Again! 🎲
            </button>
          </div>
        )}
      </div>
    </>
  )
}
