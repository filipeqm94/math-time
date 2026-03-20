import { useState, useCallback } from "react";
import { PLAYER_NAME } from "./constants.js";
import { generateProblems } from "./generators/mathProblems.js";
import { generateWordProblems } from "./generators/wordProblems.js";
import { printProblems, printWordProblems } from "./print/printHelpers.js";
import NameHeader from "./components/NameHeader/NameHeader.jsx";
import MathTab from "./components/MathTab/MathTab.jsx";
import WordTab from "./components/WordTab/WordTab.jsx";
import "./App.css";

export default function App() {
  const [tab, setTab]             = useState("math");
  const [mode, setMode]           = useState("mixed");
  const [problems, setProblems]   = useState(() => generateProblems("mixed"));
  const [wordProbs, setWordProbs] = useState(() => generateWordProblems());
  const [answers, setAnswers]     = useState({});
  const [wAnswers, setWAnswers]   = useState({});
  const [checked, setChecked]     = useState(false);
  const [wChecked, setWChecked]   = useState(false);

  const generate = useCallback((m) => {
    setProblems(generateProblems(m));
    setAnswers({});
    setChecked(false);
  }, []);

  const generateWord = useCallback(() => {
    setWordProbs(generateWordProblems());
    setWAnswers({});
    setWChecked(false);
  }, []);

  const handleModeChange = (m) => { setMode(m); generate(m); };

  const score  = problems.reduce((a, p, i) => a + (parseInt(answers[i])  === p.answer ? 1 : 0), 0);
  const wScore = wordProbs.reduce((a, p, i) => a + (parseInt(wAnswers[i]) === p.answer ? 1 : 0), 0);

  return (
    <div className="app">
      <NameHeader
        tab={tab}
        checked={checked}
        wChecked={wChecked}
        score={score}
        wScore={wScore}
        onPrint={() => tab === "math"
          ? printProblems(problems, mode, PLAYER_NAME)
          : printWordProblems(wordProbs, PLAYER_NAME)
        }
        onNew={() => tab === "math" ? generate(mode) : generateWord()}
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
          onModeChange={handleModeChange}
          onAnswer={(i, val) => setAnswers((prev) => ({ ...prev, [i]: val }))}
          onCheck={() => setChecked(true)}
          onRetry={() => generate(mode)}
        />
      )}

      {tab === "word" && (
        <WordTab
          problems={wordProbs}
          answers={wAnswers}
          checked={wChecked}
          onAnswer={(i, val) => setWAnswers((prev) => ({ ...prev, [i]: val }))}
          onCheck={() => setWChecked(true)}
          onRetry={generateWord}
        />
      )}
    </div>
  );
}
