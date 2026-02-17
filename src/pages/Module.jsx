<<<<<<< HEAD
import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Search, Lightbulb, BookOpen, FlaskConical, PenLine,
  ChevronLeft, ChevronRight, CheckCircle2, XCircle, Home
} from "lucide-react";

// Module configs — add new modules here
import obstructionConfig from "../modules/obstruction/config";

const MODULE_CONFIGS = {
  1: obstructionConfig,
  // 2: naggingConfig,
  // 3: interfaceConfig,
};

const PHASES = ["experience", "reflection", "learning", "experiment", "test"];

const PHASE_META = {
  experience:  { label: "Experience",  Icon: Search        },
  reflection:  { label: "Reflection",  Icon: Lightbulb     },
  learning:    { label: "Learning",    Icon: BookOpen      },
  experiment:  { label: "Experiment",  Icon: FlaskConical  },
  test:        { label: "Test",        Icon: PenLine       },
};

function PhaseTab({ phase, isActive, isUnlocked, onClick }) {
  const { label, Icon } = PHASE_META[phase];
  return (
    <button
      onClick={() => isUnlocked && onClick(phase)}
      disabled={!isUnlocked}
      className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl text-xs font-bold transition-all
        ${isActive
          ? "bg-purple-600 text-white shadow-md scale-105"
          : isUnlocked
            ? "bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-200"
            : "bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-100"
        }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}

function IframePhase({ phase, onNext }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 text-blue-800 text-base font-medium">
        💡 {phase.instruction}
      </div>
      <div className="w-full rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg" style={{ height: "560px" }}>
        <iframe
          src={phase.iframeSrc}
          className="w-full h-full"
          title="Interactive simulation"
        />
      </div>
      <div className="flex justify-end">
        <button onClick={onNext} className="btn-primary">
          Continue <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function ReflectionPhase({ phase, onNext }) {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});

  const allAnswered = phase.questions.every(q => answers[q.id]);

  const handleAnswer = (qId, optId) => {
    if (revealed[qId]) return;
    setAnswers(prev => ({ ...prev, [qId]: optId }));
    setRevealed(prev => ({ ...prev, [qId]: true }));
  };

  return (
    <div className="flex flex-col gap-8">
      {phase.questions.map((q, i) => (
        <div key={q.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-lg font-bold text-gray-900 mb-5">{i + 1}. {q.question}</p>
          <div className="grid gap-3">
            {q.options.map(opt => {
              const isSelected = answers[q.id] === opt.id;
              const isCorrect = opt.id === q.correct;
              const isRevealed = revealed[q.id];

              let style = "border-2 border-gray-200 bg-gray-50 text-gray-700 hover:border-purple-300 hover:bg-purple-50";
              if (isRevealed && isCorrect) style = "border-2 border-green-400 bg-green-50 text-green-800";
              else if (isRevealed && isSelected && !isCorrect) style = "border-2 border-red-400 bg-red-50 text-red-800";

              return (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(q.id, opt.id)}
                  disabled={isRevealed}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all flex items-center gap-3 ${style}`}
                >
                  {isRevealed && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />}
                  {isRevealed && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                  {!(isRevealed && (isCorrect || (isSelected && !isCorrect))) && (
                    <span className="w-5 h-5 rounded-full border-2 border-current flex-shrink-0" />
                  )}
                  {opt.text}
                </button>
              );
            })}
          </div>
          {revealed[q.id] && (
            <div className="mt-4 bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 text-sm text-purple-800">
              💡 {q.explanation}
            </div>
          )}
        </div>
      ))}
      {allAnswered && (
        <div className="flex justify-end">
          <button onClick={onNext} className="btn-primary">
            Continue <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

function LearningPhase({ phase, onNext }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <p className="text-xl font-semibold leading-relaxed">{phase.summary}</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {phase.keyPoints.map((point, i) => (
          <div key={i} className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-3">{point.icon}</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{point.title}</h3>
            <p className="text-base text-gray-600 leading-relaxed">{point.text}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button onClick={onNext} className="btn-primary">
          Continue <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function TestPhase({ phase, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = phase.questions.every(q => answers[q.id]);

  const score = useMemo(() => {
    if (!submitted) return 0;
    return phase.questions.filter(q => answers[q.id] === q.correct).length;
  }, [submitted]);

  const passed = score >= Math.ceil(phase.questions.length * 0.75);

  const handleRetry = () => { setAnswers({}); setSubmitted(false); };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className={`text-8xl ${passed ? "animate-bounce" : ""}`}>
          {passed ? "🎉" : "😅"}
        </div>
        <div className={`text-center rounded-2xl p-8 w-full max-w-md border-2 ${passed ? "bg-green-50 border-green-300" : "bg-orange-50 border-orange-300"}`}>
          <p className="text-4xl font-bold mb-2" style={{ color: passed ? "#16a34a" : "#ea580c" }}>
            {score} / {phase.questions.length}
          </p>
          <p className="text-xl font-semibold text-gray-800 mb-1">
            {passed ? "Well done! Module complete!" : "Almost there!"}
          </p>
          <p className="text-base text-gray-600">
            {passed ? "You've successfully completed this module." : "Review the learning section and try again."}
          </p>
        </div>
        <div className="w-full flex flex-col gap-4">
          {phase.questions.map((q, i) => {
            const isCorrect = answers[q.id] === q.correct;
            return (
              <div key={q.id} className={`rounded-xl p-4 border-2 ${isCorrect ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
                <div className="flex items-start gap-2 mb-2">
                  {isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" /> : <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />}
                  <p className="text-base font-semibold text-gray-900">{i + 1}. {q.question}</p>
                </div>
                {!isCorrect && (
                  <p className="text-sm text-gray-700 ml-7">
                    ✅ Correct: <span className="font-semibold">{q.options.find(o => o.id === q.correct)?.text}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4">
          {!passed && <button onClick={handleRetry} className="btn-secondary">Try Again</button>}
          {passed && (
            <button onClick={onComplete} className="btn-primary">
              Back to Home <Home className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-amber-800 text-base font-medium">
        📝 Answer all questions. You need 75% to pass.
      </div>
      {phase.questions.map((q, i) => (
        <div key={q.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-lg font-bold text-gray-900 mb-5">{i + 1}. {q.question}</p>
          <div className="grid gap-3">
            {q.options.map(opt => {
              const isSelected = answers[q.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all flex items-center gap-3
                    ${isSelected
                      ? "border-2 border-purple-500 bg-purple-50 text-purple-800"
                      : "border-2 border-gray-200 bg-gray-50 text-gray-700 hover:border-purple-300 hover:bg-purple-50"
                    }`}
                >
                  <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                    ${isSelected ? "border-purple-500 bg-purple-500" : "border-gray-400"}`}>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </span>
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {allAnswered && (
        <div className="flex justify-end">
          <button onClick={() => setSubmitted(true)} className="btn-primary">
            Submit Answers <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function Module() {
  const { id } = useParams();
  const navigate = useNavigate();
  const config = MODULE_CONFIGS[Number(id)];

  const [currentPhase, setCurrentPhase] = useState("experience");
  const [unlockedPhases, setUnlockedPhases] = useState(["experience"]);

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-700 mb-4">Module not found</p>
          <Link to="/" className="text-purple-600 font-semibold hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const currentIndex = PHASES.indexOf(currentPhase);

  const goToNextPhase = () => {
    const next = PHASES[currentIndex + 1];
    if (next) {
      setUnlockedPhases(prev => prev.includes(next) ? prev : [...prev, next]);
      setCurrentPhase(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleComplete = () => navigate("/");

  const phaseData = config.phases[currentPhase];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b-2 border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-purple-700 font-semibold transition flex-shrink-0">
            <ChevronLeft className="w-5 h-5" /> Home
          </Link>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {PHASES.map((phase, i) => (
              <div key={phase} className="flex items-center gap-2 flex-shrink-0">
                <PhaseTab
                  phase={phase}
                  isActive={currentPhase === phase}
                  isUnlocked={unlockedPhases.includes(phase)}
                  onClick={setCurrentPhase}
                />
                {i < PHASES.length - 1 && (
                  <div className={`w-6 h-0.5 flex-shrink-0 ${unlockedPhases.includes(PHASES[i + 1]) ? "bg-purple-300" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-sm font-semibold text-gray-500 flex-shrink-0">
            {currentIndex + 1} / {PHASES.length}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <span className="text-sm font-bold text-purple-600 uppercase tracking-widest">Module {config.id}</span>
          <h1 className="text-4xl font-bold text-gray-900 mt-1">{config.title}</h1>
          <p className="text-lg text-gray-500 mt-1">{config.subtitle}</p>
        </div>

        {currentPhase === "experience"  && <IframePhase    phase={phaseData} onNext={goToNextPhase} />}
        {currentPhase === "reflection"  && <ReflectionPhase phase={phaseData} onNext={goToNextPhase} />}
        {currentPhase === "learning"    && <LearningPhase  phase={phaseData} onNext={goToNextPhase} />}
        {currentPhase === "experiment"  && <IframePhase    phase={phaseData} onNext={goToNextPhase} />}
        {currentPhase === "test"        && <TestPhase      phase={phaseData} onComplete={handleComplete} />}
      </main>

      <style>{`
        .btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: #7c3aed; color: white; font-weight: 700;
          font-size: 1rem; padding: 0.75rem 1.75rem;
          border-radius: 0.75rem; transition: background 0.2s; cursor: pointer;
        }
        .btn-primary:hover { background: #6d28d9; }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: #f3f4f6; color: #374151; font-weight: 700;
          font-size: 1rem; padding: 0.75rem 1.75rem;
          border-radius: 0.75rem; transition: background 0.2s; cursor: pointer;
        }
        .btn-secondary:hover { background: #e5e7eb; }
      `}</style>
    </div>
  );
}
=======
import { useParams, Link } from "react-router-dom";

export default function Module() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Module {id}</h1>
        <p className="mt-2 text-gray-600">
          This is a placeholder. Next we’ll build the real module content.
        </p>
        <Link to="/" className="inline-block mt-6 text-purple-700 font-semibold hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
>>>>>>> d12734862dd9b76e961a286bacca9dbb306c2a36
