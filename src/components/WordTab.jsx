import { COLORS, typeLabel, typeName, PLAYER_NAME } from '../constants.js'
import { S } from '../styles.js'

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
      <p style={S.wordHint}>
        Read each problem carefully, then write your answer. 10 problems total.
      </p>

      <div style={S.wordGrid}>
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
                ...S.wordCard,
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
              <div style={S.wordHeader}>
                <span style={S.wordNum}>#{i + 1}</span>
                <span style={S.wordTypeTag}>
                  {typeLabel[p.type]} {typeName[p.type]}
                </span>
              </div>
              <p style={S.wordText}>{p.text}</p>
              <div style={S.wordInputRow}>
                <span style={{ color: '#aaa', fontSize: '0.9rem' }}>
                  Answer:
                </span>
                <input
                  style={{
                    ...S.input,
                    flex: 1,
                    maxWidth: '120px',
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
              {ok && <div style={S.feedback}>✅ Correct!</div>}
              {bad && (
                <div style={{ ...S.feedback, color: '#FF6B6B' }}>
                  ❌ The answer is {p.answer}
                </div>
              )}
              {skip && (
                <div style={{ ...S.feedback, color: '#FFD700' }}>
                  ⚠️ You skipped this one
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
              {score === 10
                ? '🏆'
                : score >= 8
                  ? '🌟'
                  : score >= 6
                    ? '👍'
                    : '📚'}
            </div>
            <div style={S.resultText}>
              {score === 10
                ? `Perfect, ${PLAYER_NAME}! 10 out of 10! 🎉`
                : score >= 8
                  ? `Excellent reading, ${PLAYER_NAME}!`
                  : score >= 6
                    ? `Good job, ${PLAYER_NAME}! Keep reading carefully!`
                    : `Keep practicing, ${PLAYER_NAME}! You've got this!`}
            </div>
            <div style={S.resultScore}>{score} out of 10 correct</div>
            <button style={S.btn} onClick={onRetry}>
              Try Again! 🎲
            </button>
          </div>
        )}
      </div>
    </>
  )
}
