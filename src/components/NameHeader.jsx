import { PLAYER_NAME } from '../constants.js'
import { S } from '../styles.js'

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
    <div style={S.header}>
      <div>
        <h1 style={S.title}>📐 Math Time!</h1>
        <p style={S.subtitle}>Hey {PLAYER_NAME}! 💪</p>
      </div>
      <div style={S.headerRight}>
        {tab === 'math' && checked && (
          <div style={S.scoreBadge}>
            {score === 20 ? '🏆' : score >= 15 ? '⭐' : '📝'} {score}/20
          </div>
        )}
        {tab === 'word' && wChecked && (
          <div style={S.scoreBadge}>
            {wScore === 10 ? '🏆' : wScore >= 7 ? '⭐' : '📝'} {wScore}/10
          </div>
        )}
        <button style={S.printBtn} onClick={onPrint}>
          🖨️ Print Sheet
        </button>
        <button style={S.btn} onClick={onNew}>
          New Problems 🎲
        </button>
      </div>
    </div>
  )
}
