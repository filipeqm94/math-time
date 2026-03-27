import { STUDENT_NAME } from '../../constants.js'
import './NameHeader.css'

export default function NameHeader({
  tab,
  submitted,
  wSubmitted,
  firstCorrect,
  wFirstCorrect,
  problems,
  wordProbs,
  answers,
  wAnswers,
  canNew,
  onPrint,
  onNew,
}) {
  const total  = problems?.length ?? 20
  const wTotal = wordProbs?.length ?? 10

  const corrections  = problems?.filter((p, i) => !firstCorrect.includes(i) && parseInt(answers[i])  === p.answer).length ?? 0
  const wCorrections = wordProbs?.filter((p, i) => !wFirstCorrect.includes(i) && parseInt(wAnswers[i]) === p.answer).length ?? 0

  const finalScore  = firstCorrect.length  + corrections  * 0.5
  const wFinalScore = wFirstCorrect.length + wCorrections * 0.5

  return (
    <div className="header">
      <div>
        <h1 className="title">📐 Math Time!</h1>
        <p className="subtitle">Hey {STUDENT_NAME}! 💪</p>
      </div>
      <div className="header-right">
        {tab === 'math' && submitted && (
          <div className="score-badge">
            {finalScore === total ? '🏆' : finalScore >= total * 0.75 ? '⭐' : '📝'} {finalScore}/{total}
          </div>
        )}
        {tab === 'word' && wSubmitted && (
          <div className="score-badge">
            {wFinalScore === wTotal ? '🏆' : wFinalScore >= wTotal * 0.75 ? '⭐' : '📝'} {wFinalScore}/{wTotal}
          </div>
        )}
        {tab !== 'tables' && (
          <>
            <button className="btn-print" onClick={onPrint}>
              🖨️ Print Sheet
            </button>
            <button
              className="btn"
              onClick={onNew}
              disabled={!canNew}
              style={{ opacity: canNew ? 1 : 0.4, cursor: canNew ? 'pointer' : 'not-allowed' }}
            >
              New Problems 🎲
            </button>
          </>
        )}
      </div>
    </div>
  )
}
