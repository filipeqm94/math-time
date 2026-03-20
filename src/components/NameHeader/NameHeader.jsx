import { PLAYER_NAME } from '../../constants.js'
import './NameHeader.css'

export default function NameHeader({
  tab,
  checked,
  wChecked,
  score,
  wScore,
  onPrint,
  onNew,
}) {
  return (
    <div className="header">
      <div>
        <h1 className="title">📐 Math Time!</h1>
        <p className="subtitle">Hey {PLAYER_NAME}! 💪</p>
      </div>
      <div className="header-right">
        {tab === 'math' && checked && (
          <div className="score-badge">
            {score === 20 ? '🏆' : score >= 15 ? '⭐' : '📝'} {score}/20
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
