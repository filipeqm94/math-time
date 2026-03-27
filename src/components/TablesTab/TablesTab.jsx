import { useState } from 'react'
import './TablesTab.css'

const OPS = [
  {
    id: 'add',
    label: '➕ Add',
    symbol: '+',
    color: '#1dd1a1',
    name: 'Addition',
  },
  {
    id: 'subtract',
    label: '➖ Subtract',
    symbol: '−',
    color: '#feca57',
    name: 'Subtraction',
  },
  {
    id: 'multiply',
    label: '✖️ Multiply',
    symbol: '×',
    color: '#54a0ff',
    name: 'Multiplication',
  },
  {
    id: 'divide',
    label: '➗ Divide',
    symbol: '÷',
    color: '#ff9f43',
    name: 'Division',
  },
]

const BASES = Array.from({ length: 10 }, (_, i) => i + 1) // 1–10
const STEPS = Array.from({ length: 10 }, (_, i) => i + 1) // 1–10

// For subtract: show (base+n) − base = n  → always non-negative, mirrors addition
// For divide:   show (base×n) ÷ base = n  → always whole number
function getEquation(op, base, n) {
  if (op === 'multiply') return { left: `${base} × ${n}`, result: base * n }
  if (op === 'add') return { left: `${base} + ${n}`, result: base + n }
  if (op === 'subtract') return { left: `${base + n} − ${base}`, result: n }
  if (op === 'divide') return { left: `${base * n} ÷ ${base}`, result: n }
}

function handlePrint(op) {
  const opInfo = OPS.find(o => o.id === op)
  let html = `<html><head><title>${opInfo.name} Tables</title><style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; padding: 24px; }
    h1 { text-align: center; font-size: 1.3rem; margin-bottom: 20px; }
    .grid { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; }
    .card { border: 2px solid #333; border-radius: 8px; padding: 10px 16px; width: 148px; }
    .card-title { font-weight: 900; font-size: 0.95rem; text-align: center;
                  border-bottom: 1px solid #ccc; padding-bottom: 6px; margin-bottom: 6px; }
    .line { font-family: monospace; font-size: 0.9rem; font-weight: 700;
            padding: 2px 0; white-space: pre; }
  </style></head><body>
  <h1>${opInfo.name} Tables</h1><div class="grid">`

  for (const base of BASES) {
    html += `<div class="card"><div class="card-title">Table of ${base}</div>`
    for (const n of STEPS) {
      const { left, result } = getEquation(op, base, n)
      // pad left so '=' signs line up
      html += `<div class="line">${left.padEnd(9)} = ${result}</div>`
    }
    html += `</div>`
  }

  html += `</div></body></html>`

  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
  win.print()
}

export default function TablesTab() {
  const [op, setOp] = useState('multiply')
  const [quizMode, setQuizMode] = useState(false)
  const [revealed, setRevealed] = useState(new Set())

  const opInfo = OPS.find(o => o.id === op)

  const toggleReveal = key => {
    setRevealed(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const switchOp = newOp => {
    setOp(newOp)
    setRevealed(new Set())
  }
  const switchMode = isQuiz => {
    setQuizMode(isQuiz)
    setRevealed(new Set())
  }

  return (
    <div className='tables-tab'>
      <div className='tables-ops'>
        {OPS.map(o => (
          <button
            key={o.id}
            className={`tables-op${op === o.id ? ' tables-op--active' : ''}`}
            style={
              op === o.id ? { borderColor: o.color, color: o.color } : undefined
            }
            onClick={() => switchOp(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className='tables-toolbar'>
        <div className='tables-mode-row'>
          <button
            className={`tables-toggle${!quizMode ? ' tables-toggle--active' : ''}`}
            onClick={() => switchMode(false)}
          >
            📖 Study
          </button>
          <button
            className={`tables-toggle${quizMode ? ' tables-toggle--active' : ''}`}
            onClick={() => switchMode(true)}
          >
            🧠 Quiz Me
          </button>
          {quizMode && (
            <span className='tables-hint'>Tap any answer to reveal it</span>
          )}
        </div>
        <button className='btn-print' onClick={() => handlePrint(op)}>
          🖨️ Print Tables
        </button>
      </div>

      <div className='tabuadas'>
        {BASES.map(base => (
          <div
            key={base}
            className='tabuada-card'
            style={{ borderColor: opInfo.color + '55' }}
          >
            <div className='tabuada-title' style={{ color: opInfo.color }}>
              Table of {base}
            </div>
            {STEPS.map(n => {
              const { left, result } = getEquation(op, base, n)
              const key = `${base}_${n}`
              const visible = !quizMode || revealed.has(key)

              return (
                <div key={n} className='tabuada-line'>
                  <span className='tabuada-eq'>{left} =</span>
                  <span
                    className={`tabuada-result${quizMode ? ' tabuada-result--quiz' : ''}${quizMode && visible ? ' tabuada-result--shown' : ''}`}
                    style={visible ? { color: opInfo.color } : undefined}
                    onClick={quizMode ? () => toggleReveal(key) : undefined}
                  >
                    {visible ? result : '?'}
                  </span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
