import { useState, useCallback } from "react";
import { STUDENT_NAME } from "./constants.js";
import { saveSession } from "./lib/supabase.js";
import { generateProblems } from "./generators/mathProblems.js";
import { generateWordProblems } from "./generators/wordProblems.js";
import { generateNumberLines } from "./generators/numberLineProblems.js";
import { printProblems, printWordProblems, printNumberLines } from "./print/printHelpers.js";
import NameHeader from "./components/NameHeader/NameHeader.jsx";
import MathTab from "./components/MathTab/MathTab.jsx";
import WordTab from "./components/WordTab/WordTab.jsx";
import TablesTab from "./components/TablesTab/TablesTab.jsx";
import "./App.css";

function isProblemCorrectNL(p, i, answers) {
  return p.blanks.every((expected, j) =>
    parseInt(answers[`${i}_${j}_n`]) === expected &&
    parseInt(answers[`${i}_${j}_d`]) === p.denominator
  );
}

export default function App() {
  const [tab, setTab]               = useState("math");
  const [mode, setMode]             = useState("mixed");
  const [fracMode, setFracMode]     = useState("cards"); // 'cards' | 'numberlines'
  const [problems, setProblems]     = useState(() => generateProblems("mixed"));
  const [wordProbs, setWordProbs]   = useState(() => generateWordProblems());
  const [nlProbs, setNlProbs]       = useState(() => generateNumberLines());
  const [answers, setAnswers]       = useState({});
  const [wAnswers, setWAnswers]     = useState({});
  const [nlAnswers, setNlAnswers]   = useState({});
  const [checked, setChecked]       = useState(false);
  const [wChecked, setWChecked]     = useState(false);
  const [nlChecked, setNlChecked]   = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [wSubmitted, setWSubmitted] = useState(false);
  const [nlSubmitted, setNlSubmitted] = useState(false);
  const [firstCorrect, setFirstCorrect]     = useState([]);
  const [wFirstCorrect, setWFirstCorrect]   = useState([]);
  const [nlFirstCorrect, setNlFirstCorrect] = useState([]);

  const generate = useCallback((m) => {
    setProblems(generateProblems(m));
    setAnswers({});
    setChecked(false);
    setSubmitted(false);
    setFirstCorrect([]);
  }, []);

  const generateWord = useCallback(() => {
    setWordProbs(generateWordProblems());
    setWAnswers({});
    setWChecked(false);
    setWSubmitted(false);
    setWFirstCorrect([]);
  }, []);

  const generateNL = useCallback(() => {
    setNlProbs(generateNumberLines());
    setNlAnswers({});
    setNlChecked(false);
    setNlSubmitted(false);
    setNlFirstCorrect([]);
  }, []);

  const handleModeChange = (m) => {
    setMode(m);
    generate(m);
    if (m !== 'frac') setFracMode('cards');
  };

  const editAnswers   = useCallback(() => { setChecked(false);   setFirstCorrect([]);   }, []);
  const editWAnswers  = useCallback(() => { setWChecked(false);  setWFirstCorrect([]);  }, []);
  const editNLAnswers = useCallback(() => { setNlChecked(false); setNlFirstCorrect([]); }, []);

  const handleCheck = useCallback((probs, ans) => {
    const correct = probs.map((p, i) => parseInt(ans[i]) === p.answer ? i : -1).filter(i => i >= 0);
    setFirstCorrect(correct);
    setChecked(true);
  }, []);

  const handleWCheck = useCallback((probs, ans) => {
    const correct = probs.map((p, i) => parseInt(ans[i]) === p.answer ? i : -1).filter(i => i >= 0);
    setWFirstCorrect(correct);
    setWChecked(true);
  }, []);

  const handleNLCheck = useCallback((probs, ans) => {
    const correct = probs.map((p, i) => isProblemCorrectNL(p, i, ans) ? i : -1).filter(i => i >= 0);
    setNlFirstCorrect(correct);
    setNlChecked(true);
  }, []);

  const handleSubmit = useCallback((probs, ans, fc, tabName, modeName) => {
    const corrections = probs.filter((p, i) => !fc.includes(i) && parseInt(ans[i]) === p.answer).length;
    const finalScore = fc.length + corrections * 0.5;
    saveSession({ tab: tabName, mode: modeName, firstCorrect: fc.length, corrections, finalScore, total: probs.length });
    setSubmitted(true);
  }, []);

  const handleWSubmit = useCallback((probs, ans, fc) => {
    const corrections = probs.filter((p, i) => !fc.includes(i) && parseInt(ans[i]) === p.answer).length;
    const finalScore = fc.length + corrections * 0.5;
    saveSession({ tab: "word", mode: "word", firstCorrect: fc.length, corrections, finalScore, total: probs.length });
    setWSubmitted(true);
  }, []);

  const handleNLSubmit = useCallback((probs, ans, fc) => {
    const corrections = probs.filter((p, i) => !fc.includes(i) && isProblemCorrectNL(p, i, ans)).length;
    const finalScore = fc.length + corrections * 0.5;
    saveSession({ tab: "math", mode: "numberlines", firstCorrect: fc.length, corrections, finalScore, total: probs.length });
    setNlSubmitted(true);
  }, []);

  const isNL = tab === "math" && mode === "frac" && fracMode === "numberlines";

  const canNew = tab === "math"
    ? isNL ? (!nlChecked || nlSubmitted) : (!checked || submitted)
    : (!wChecked || wSubmitted);

  const handlePrint = () => {
    if (tab === "word") return printWordProblems(wordProbs, STUDENT_NAME);
    if (isNL) return printNumberLines(nlProbs, STUDENT_NAME);
    return printProblems(problems, mode, STUDENT_NAME);
  };

  const handleNew = () => {
    if (tab === "word") return generateWord();
    if (isNL) return generateNL();
    return generate(mode);
  };

  return (
    <div className="app">
      <NameHeader
        tab={tab}
        checked={checked}
        wChecked={wChecked}
        submitted={submitted}
        wSubmitted={wSubmitted}
        firstCorrect={firstCorrect}
        wFirstCorrect={wFirstCorrect}
        problems={problems}
        wordProbs={wordProbs}
        answers={answers}
        wAnswers={wAnswers}
        onPrint={handlePrint}
        onNew={handleNew}
        canNew={canNew}
      />

      <div className="main-tabs">
        <button className={`main-tab${tab === "math" ? " main-tab--active" : ""}`} onClick={() => setTab("math")}>
          🔢 Math Equations
        </button>
        <button className={`main-tab${tab === "word" ? " main-tab--active" : ""}`} onClick={() => setTab("word")}>
          📖 Word Problems
        </button>
        <button className={`main-tab${tab === "tables" ? " main-tab--active" : ""}`} onClick={() => setTab("tables")}>
          📋 Tables
        </button>
      </div>

      {tab === "math" && (
        <MathTab
          mode={mode}
          fracMode={fracMode}
          problems={problems}
          answers={answers}
          checked={checked}
          submitted={submitted}
          firstCorrect={firstCorrect}
          nlProbs={nlProbs}
          nlAnswers={nlAnswers}
          nlChecked={nlChecked}
          nlSubmitted={nlSubmitted}
          nlFirstCorrect={nlFirstCorrect}
          onModeChange={handleModeChange}
          onFracModeChange={setFracMode}
          onAnswer={(i, val) => setAnswers((prev) => ({ ...prev, [i]: val }))}
          onCheck={() => handleCheck(problems, answers)}
          onSubmit={() => handleSubmit(problems, answers, firstCorrect, "math", mode)}
          onEditAnswers={editAnswers}
          onNlAnswer={(key, val) => setNlAnswers((prev) => ({ ...prev, [key]: val }))}
          onNlCheck={() => handleNLCheck(nlProbs, nlAnswers)}
          onNlSubmit={() => handleNLSubmit(nlProbs, nlAnswers, nlFirstCorrect)}
          onNlEditAnswers={editNLAnswers}
        />
      )}

      {tab === "tables" && <TablesTab />}

      {tab === "word" && (
        <WordTab
          problems={wordProbs}
          answers={wAnswers}
          checked={wChecked}
          submitted={wSubmitted}
          firstCorrect={wFirstCorrect}
          onAnswer={(i, val) => setWAnswers((prev) => ({ ...prev, [i]: val }))}
          onCheck={() => handleWCheck(wordProbs, wAnswers)}
          onSubmit={() => handleWSubmit(wordProbs, wAnswers, wFirstCorrect)}
          onEditAnswers={editWAnswers}
        />
      )}
    </div>
  );
}
