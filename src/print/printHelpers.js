import { typeName } from '../constants.js'

function buildPrintHTML(title, date, playerName, body, total, isWord) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>
  @page { size: A4; margin: 15mm 15mm 15mm 15mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; color: #111; background: #fff; font-size: 11pt; }

  .header { display: flex; justify-content: space-between; align-items: flex-end;
            border-bottom: 3px solid #222; padding-bottom: 8px; margin-bottom: 14px; }
  .header h1  { font-size: 18pt; font-weight: 900; }
  .header p   { font-size: 9pt; color: #555; margin-top: 3px; }
  .header-right { font-size: 10pt; text-align: right; line-height: 1.8; }
  .header-right .field { border-bottom: 1.5px solid #333; min-width: 160px; display: inline-block; }

  .two-col { display: flex; gap: 24px; }
  .two-col .math-table { flex: 1; }
  .math-table { width: 100%; border-collapse: collapse; }
  .math-table tr { height: 46px; }
  .math-table tr:nth-child(even) { background: #f5f5f5; }
  .math-table td { padding: 4px 8px; vertical-align: middle; }
  td.num  { width: 28px; font-size: 9pt; color: #666; }
  td.prob { font-size: 15pt; font-weight: bold; letter-spacing: 0.5px; }
  td.ans  { width: 110px; border-bottom: 2px solid #444; }

  .word-item  { margin-bottom: 16px; padding: 10px 12px; border: 1.5px solid #ddd;
                border-radius: 5px; background: #fafafa; page-break-inside: avoid; }
  .word-q     { font-size: 11pt; line-height: 1.5; margin-bottom: 8px; }
  .word-num   { font-weight: bold; color: #555; margin-right: 5px; }
  .work-area  { font-size: 9pt; color: #aaa; margin-bottom: 6px;
                border-top: 1px dashed #ccc; padding-top: 4px; height: 28px; }
  .word-ans   { font-size: 10pt; }

  .footer { margin-top: 18px; border-top: 1px solid #ccc; padding-top: 6px;
            font-size: 8.5pt; color: #999; text-align: center; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body>
<div class="header">
  <div>
    <h1>📐 ${title}</h1>
    <p>${isWord
      ? 'Read each problem carefully and show your work!'
      : 'Solve each equation and write your answer on the line.'
    }</p>
  </div>
  <div class="header-right">
    <div>Name: <span class="field">&nbsp;&nbsp;&nbsp;&nbsp;${playerName}&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
    <div>Date: <span class="field">&nbsp;&nbsp;&nbsp;${date}&nbsp;&nbsp;&nbsp;</span></div>
    <div>Score: _______ / ${total}</div>
  </div>
</div>
${body}
<div class="footer">Keep trying — every mistake is a learning opportunity! 🌟</div>
</body></html>`
}

function openAndPrint(html) {
  const w = window.open('', '_blank')
  w.document.write(html)
  w.document.close()
  setTimeout(() => w.print(), 450)
}

export function printProblems(problems, mode, playerName) {
  const title =
    mode === 'mixed' ? 'Mixed Math Practice' : `${typeName[mode]} Practice`
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const leftCol = problems.slice(0, 10)
  const rightCol = problems.slice(10, 20)

  const makeRows = (arr, offset = 0) =>
    arr
      .map(
        (p, i) => `
      <tr>
        <td class="num">${i + 1 + offset}.</td>
        <td class="prob">${p.display} =</td>
        <td class="ans"></td>
      </tr>`,
      )
      .join('')

  const body = `
    <div class="two-col">
      <table class="math-table"><tbody>${makeRows(leftCol, 0)}</tbody></table>
      <table class="math-table"><tbody>${makeRows(rightCol, 10)}</tbody></table>
    </div>`

  openAndPrint(buildPrintHTML(title, date, playerName, body, 20, false))
}

export function printWordProblems(problems, playerName) {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const body = problems
    .map(
      (p, i) => `
    <div class="word-item">
      <p class="word-q"><span class="word-num">${i + 1}.</span> ${p.text}</p>
      <div class="work-area">Work space:</div>
      <div class="word-ans">Answer: ___________________________</div>
    </div>`,
    )
    .join('')

  openAndPrint(
    buildPrintHTML('Word Problems Practice', date, playerName, body, 10, true),
  )
}
