import { STUDENT_NAME } from '../../constants.js'
import './NameHeader.css'

export default function NameHeader({
  tab,
  checked,
  wChecked,
  score,
  wScore,
  total,
  onPrint,
  onNew,
}) {
  return (
    <div className="header">
      <div>
        <h1 className="title">📐 Math Time!</h1>
        <p className="subtitle">Hey {STUDENT_NAME}! 💪</p>
      </div>
      <div className="header-right">
        {tab === 'math' && checked && (
          <div className="score-badge">
            {score === total ? '🏆' : score >= total * 0.75 ? '⭐' : '📝'} {score}/{total}
          </div>
        )}
        {tab === 'word' && wChecked && (
          <div className="score-badge">
            {wScore === 10 ? '🏆' : wScore >= 7 ? '⭐' : '📝'} {wScore}/10
          </div>
        )}
        <button className="btn-print" onClick={onPrint}>
          🖨️ Print Sheet
        </button>
        <button className="btn" onClick={onNew}>
          New Problems 🎲
        </button>
      </div>
    </div>
  )
}
