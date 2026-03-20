import { useState, useCallback } from "react";
import { STUDENT_NAME } from "./constants.js";
import { saveSession } from "./lib/supabase.js";
import { generateProblems } from "./generators/mathProblems.js";
import { generateWordProblems } from "./generators/wordProblems.js";
import { printProblems, printWordProblems } from "./print/printHelpers.js";
import NameHeader from "./components/NameHeader/NameHeader.jsx";
import MathTab from "./components/MathTab/MathTab.jsx";
import WordTab from "./components/WordTab/WordTab.jsx";
import "./App.css";

export default function App() {
  const [tab, setTab]               = useState("math");
  const [mode, setMode]             = useState("mixed");
  const [problems, setProblems]     = useState(() => generateProblems("mixed"));
  const [wordProbs, setWordProbs]   = useState(() => generateWordProblems());
  const [answers, setAnswers]       = useState({});
  const [wAnswers, setWAnswers]     = useState({});
  const [checked, setChecked]       = useState(false);
  const [wChecked, setWChecked]     = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [wSubmitted, setWSubmitted] = useState(false);
  const [firstCorrect, setFirstCorrect]   = useState([]);
  const [wFirstCorrect, setWFirstCorrect] = useState([]);

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

  const handleModeChange = (m) => { setMode(m); generate(m); };

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

  const handleSubmit = useCallback((probs, ans, fc, tab, mode) => {
    const corrections = probs.filter((p, i) => !fc.includes(i) && parseInt(ans[i]) === p.answer).length;
    const finalScore = fc.length + corrections * 0.5;
    saveSession({ tab, mode, firstCorrect: fc.length, corrections, finalScore, total: probs.length });
    setSubmitted(true);
  }, []);

  const handleWSubmit = useCallback((probs, ans, fc) => {
    const corrections = probs.filter((p, i) => !fc.includes(i) && parseInt(ans[i]) === p.answer).length;
    const finalScore = fc.length + corrections * 0.5;
    saveSession({ tab: "word", mode: "word", firstCorrect: fc.length, corrections, finalScore, total: probs.length });
    setWSubmitted(true);
  }, []);

  const canNew = tab === "math" ? (!checked || submitted) : (!wChecked || wSubmitted);

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
        onPrint={() => tab === "math"
          ? printProblems(problems, mode, STUDENT_NAME)
          : printWordProblems(wordProbs, STUDENT_NAME)
        }
        onNew={() => tab === "math" ? generate(mode) : generateWord()}
        canNew={canNew}
      />

      <div className="main-tabs">
        <button
          className={`main-tab${tab === "math" ? " main-tab--active" : ""}`}
          onClick={() => setTab("math")}
        >
          🔢 Math Equations
        </button>
        <button
          className={`main-tab${tab === "word" ? " main-tab--active" : ""}`}
          onClick={() => setTab("word")}
        >
          📖 Word Problems
        </button>
      </div>

      {tab === "math" && (
        <MathTab
          mode={mode}
          problems={problems}
          answers={answers}
          checked={checked}
          submitted={submitted}
          firstCorrect={firstCorrect}
          onModeChange={handleModeChange}
          onAnswer={(i, val) => setAnswers((prev) => ({ ...prev, [i]: val }))}
          onCheck={() => handleCheck(problems, answers)}
          onSubmit={() => handleSubmit(problems, answers, firstCorrect, "math", mode)}
        />
      )}

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
        />
      )}
    </div>
  );
}
