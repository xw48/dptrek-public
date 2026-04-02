import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Search, Lightbulb, BookOpen, FlaskConical, PenLine,
  ChevronLeft, ChevronRight
} from "lucide-react";

// Centralized state
import { useAppContext } from "../AppContext";

// PostHog Analytics
import {
  trackModuleStart,
  trackPhaseComplete,
  trackPhaseTime,
  trackReflectionSubmit,
  trackTestComplete,
  trackModuleComplete,
  trackInteractiveExampleStep
} from "../posthog";

// Supabase Database
import {
  saveReflectionResponse,
  saveTestResult,
  saveModuleCompletion,
  trackPhaseAction
} from "../supabaseClient";

// Module configs — add new modules here
import obstructionConfig from "../modules/obstruction/config";
import naggingConfig from '../modules/nagging/config.js';
import interferenceConfig from '../modules/interference/config.js';
import sneakingConfig from '../modules/sneaking/config.js';
import forcedActionConfig from '../modules/forced-action/config.js';

const MODULE_CONFIGS = {
  1: obstructionConfig,
  2: naggingConfig,
  3: interferenceConfig,
  4: sneakingConfig,
  5: forcedActionConfig,
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
      className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all min-w-[90px]
        ${isActive
          ? "bg-purple-600 text-white shadow-md"
          : isUnlocked
            ? "bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-200"
            : "bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-100"
        }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}

function IframePhase({ phase, onNext, onPrev, config, textSizeScale = { base: 'text-base', large: 'text-lg', xl: 'text-xl' } }) {
  const [bottomMessage, setBottomMessage] = useState(null);
  const [showOverlay, setShowOverlay] = useState(phase.title === "Experiment");
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const isExperiment = phase.title === "Experiment";

  // Listen for task completion from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'task_complete') {
        setTaskCompleted(true);
        const result = event.data.result; // 'accepted' or 'declined'

        if (isExperiment) {
          // Experiment: tell user if they did correct or made a mistake
          if (result === 'declined') {
            setBottomMessage({
              text: "✅ Well done! You successfully resisted all the nagging attempts. You didn't give in to the pressure — that's exactly the right thing to do!",
              type: "success"
            });
          } else {
            setBottomMessage({
              text: "⚠️ You gave in and accepted. The website kept pressuring you with repeated popups, and you eventually clicked 'Allow' or 'Subscribe'. Next time, keep saying no — each popup is just the same request in a different disguise!",
              type: "warning"
            });
          }
        }
      }
      // Also handle legacy user_interacted for other modules (obstruction etc.)
      if (event.data.type === 'user_interacted') {
        setTaskCompleted(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isExperiment]);

  const handleLeave = () => {
    setTaskCompleted(true);
    setBottomMessage({
      text: isExperiment
        ? "✅ Good choice! You left the website instead of giving in to the nagging. This is a smart way to protect yourself."
        : "🚪 You left the simulated website! This is a good way to avoid deceptive practices.",
      type: "success"
    });
    if (config) trackPhaseAction({ moduleId: config.id, moduleTitle: config.title, phase: phase.title, action: 'leave_clicked' });
  };

  const handleReport = () => {
    setTaskCompleted(true);
    setBottomMessage({
      text: "📢 Thank you for reporting! This helps protect other users from deceptive patterns.",
      type: "info"
    });
    if (config) trackPhaseAction({ moduleId: config.id, moduleTitle: config.title, phase: phase.title, action: 'report_clicked' });
  };

  const handleStartExperiment = () => {
    setShowOverlay(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className={`bg-blue-50 border border-blue-200 rounded-xl px-3 py-1.5 text-blue-800 ${textSizeScale.base} font-medium`}>
        💡 {phase.instruction}
      </div>

      {/* Simulation Frame with Header */}
      <div className="rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg relative">
        {/* Simulation Header - Outside iframe */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2 flex justify-between items-center border-b-4 border-amber-700">
          {/* Leave button with tooltip */}
          <div className="relative group">
            <button
              onClick={handleLeave}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg uppercase text-sm tracking-wide transition-all hover:scale-105 shadow-md"
            >
              Leave
            </button>
            <div className="absolute left-0 top-full mt-2 w-52 bg-gray-900 text-white text-sm font-medium rounded-lg px-3 py-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
              Leave this simulated website
              <div className="absolute -top-1.5 left-5 w-3 h-3 bg-gray-900 rotate-45" />
            </div>
          </div>

          <div className="bg-white text-amber-700 font-extrabold py-2 px-5 rounded-lg uppercase text-sm tracking-widest shadow-md">
            ⚠ {phase.simulationLabel || "Simulation Website"}
          </div>

          {/* Report button with tooltip */}
          <div className="relative group">
            <button
              onClick={handleReport}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg uppercase text-sm tracking-wide transition-all hover:scale-105 shadow-md"
            >
              Report
            </button>
            <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 text-white text-sm font-medium rounded-lg px-3 py-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
              Report this website to a regulatory agency
              <div className="absolute -top-1.5 right-5 w-3 h-3 bg-gray-900 rotate-45" />
            </div>
          </div>
        </div>

        {/* Iframe - Just the website content */}
        <div className="relative w-full" style={{ height: "calc(100vh - 210px)" }}>
          {iframeLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10 gap-3">
              <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-500 font-medium">Loading simulation...</p>
            </div>
          )}
          <div className={`w-full h-full ${showOverlay ? 'filter blur-sm' : ''}`}>
            <iframe
              src={phase.iframeSrc}
              className="w-full h-full"
              title="Interactive simulation"
              onLoad={() => setIframeLoading(false)}
            />
          </div>
        </div>

        {/* Overlay for Experiment Phase */}
        {showOverlay && (
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-10 p-4 sm:p-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl shadow-2xl border-4 border-purple-400 animate-fade-in">
              <h3 className={`${textSizeScale['2xl']} font-black text-gray-900 mb-4 flex items-center gap-3`}>
                <span className="text-3xl sm:text-4xl">🎯</span>
                Now Apply What You've Learned!
              </h3>
              
              {phase.experimentReminder && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <p className={`${textSizeScale.base} text-amber-900 font-semibold mb-2`}>
                    <strong>Remember:</strong> {phase.experimentReminder}
                  </p>
                  {phase.experimentTip && (
                    <p className={`${textSizeScale.base} text-amber-800`}>
                      {phase.experimentTip}
                    </p>
                  )}
                </div>
              )}

              <p className={`${textSizeScale.large} text-gray-700 mb-4 sm:mb-6`}>
                Please apply the knowledge you've learned when exploring this example, and try your best to navigate away from the pattern and make decisions in favor of your benefits!
              </p>

              <button
                onClick={handleStartExperiment}
                className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold ${textSizeScale.large} py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition shadow-lg hover:shadow-2xl hover:scale-105 transform`}
              >
                Start Exercise →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Static bottom message — stays until user presses another action */}
      {bottomMessage && (
        <div className={`rounded-xl px-4 sm:px-5 py-3 sm:py-4 ${textSizeScale.base} font-medium ${
          bottomMessage.type === 'success'
            ? 'bg-green-50 border-2 border-green-400 text-green-800'
            : bottomMessage.type === 'warning'
            ? 'bg-amber-50 border-2 border-amber-400 text-amber-800'
            : 'bg-blue-50 border-2 border-blue-400 text-blue-800'
        }`}>
          {bottomMessage.text}
        </div>
      )}

      {/* Continue Button — only after task is completed */}
      {taskCompleted ? (
        <div className="flex items-center justify-between">
          {onPrev ? (
            <button onClick={onPrev} className="btn-secondary">
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>
          ) : <div />}
          <button onClick={onNext} className="btn-primary">
            Continue <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className={`bg-purple-50 border-2 border-purple-300 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-purple-800 ${textSizeScale.base} font-medium text-center`}>
          👆 Please interact with the simulation above to continue
        </div>
      )}
    </div>
  );
}

function ReflectionPhase({ phase, onNext, onPrev, config, textSizeScale = { base: 'text-base', large: 'text-lg', xl: 'text-xl', '2xl': 'text-2xl' } }) {
  const [answers, setAnswers] = useState({});
  const [otherText, setOtherText] = useState({});
  const [comments, setComments] = useState({});
  // State for feeling_combined type
  const [selectedFeelings, setSelectedFeelings] = useState([]);
  const [intensities, setIntensities] = useState({});

  const allAnswered = phase.questions.every(q => {
    if (q.type === 'feeling_combined') {
      return selectedFeelings.length > 0;
    }
    const hasAnswer = answers[q.id];
    if (hasAnswer && q.options.find(opt => opt.id === answers[q.id])?.needsText) {
      return otherText[q.id]?.trim();
    }
    return hasAnswer;
  });

  const answeredCount = phase.questions.reduce((count, q) => {
    if (q.type === 'feeling_combined') return count + (selectedFeelings.length > 0 ? 1 : 0);
    return count + (answers[q.id] ? 1 : 0);
  }, 0);

  const handleAnswer = (qId, optId) => {
    setAnswers(prev => ({ ...prev, [qId]: optId }));
    const option = phase.questions.find(q => q.id === qId)?.options.find(opt => opt.id === optId);
    if (!option?.needsText) {
      setOtherText(prev => {
        const newState = { ...prev };
        delete newState[qId];
        return newState;
      });
    }
  };

  const handleOtherText = (qId, text) => {
    setOtherText(prev => ({ ...prev, [qId]: text }));
  };

  const handleComment = (qId, text) => {
    setComments(prev => ({ ...prev, [qId]: text }));
  };

  const toggleFeeling = (feelingId) => {
    setSelectedFeelings(prev => {
      if (prev.includes(feelingId)) {
        // Remove feeling and its intensity
        setIntensities(p => { const n = { ...p }; delete n[feelingId]; return n; });
        return prev.filter(f => f !== feelingId);
      } else {
        // Add feeling with default intensity 3
        setIntensities(p => ({ ...p, [feelingId]: 3 }));
        return [...prev, feelingId];
      }
    });
  };

  const intensityLabels = ["", "Slightly", "A little", "Moderately", "Strongly", "Extremely"];

  return (
    <div className="flex flex-col gap-6">
      {/* Helpful Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-xl flex-shrink-0">
            💭
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Share Your Thoughts</h3>
            <p className="text-sm text-gray-600">There are no wrong answers! We want to understand your experience and perspective.</p>
          </div>
        </div>
      </div>

      {/* Questions */}
      {phase.questions.map((q, i) => {

        {/* === FEELING COMBINED: chips + slider + frequency === */}
        if (q.type === 'feeling_combined') {
          return (
            <div key={q.id} className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition">
              <p className="text-base sm:text-lg font-bold text-gray-900 mb-5">
                {i + 1}. {q.question}
              </p>

              {/* Multi-select feeling chips */}
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-600 mb-3">Select all that apply:</p>
                <div className="flex flex-wrap gap-2.5">
                  {q.feelings.map(f => {
                    const isSelected = selectedFeelings.includes(f.id);
                    return (
                      <button
                        key={f.id}
                        onClick={() => toggleFeeling(f.id)}
                        className={`px-5 py-2.5 rounded-full text-sm sm:text-base font-semibold transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-700 border border-gray-200'
                        }`}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Per-feeling intensity sliders */}
              {selectedFeelings.length > 0 && (
                <div className="mb-5 bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <p className="text-sm font-semibold text-gray-700 mb-4">{q.intensityLabel}</p>
                  <div className="flex flex-col gap-4">
                    {selectedFeelings.map(fId => {
                      const feeling = q.feelings.find(f => f.id === fId);
                      const val = intensities[fId] || 3;
                      return (
                        <div key={fId}>
                          <p className="text-sm font-bold text-purple-800 mb-1.5">{feeling?.label}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 w-12 text-right">Slightly</span>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={val}
                              onChange={(e) => setIntensities(prev => ({ ...prev, [fId]: Number(e.target.value) }))}
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                            <span className="text-xs text-gray-500 w-16">Extremely</span>
                          </div>
                          <div className="text-center mt-1">
                            <span className="inline-block bg-white px-2.5 py-0.5 rounded-full text-xs font-bold text-purple-700 border border-purple-200">
                              {val}/5 — {intensityLabels[val]}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          );
        }

        {/* === STANDARD SINGLE-SELECT QUESTION === */}
        const selectedOption = q.options.find(opt => opt.id === answers[q.id]);
        const needsOtherText = selectedOption?.needsText;

        return (
          <div key={q.id} className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition">
            <p className="text-base sm:text-lg font-bold text-gray-900 mb-4">
              {i + 1}. {q.question}
            </p>
            
            {/* Options */}
            <div className="space-y-2.5">
              {q.options.map(opt => {
                const isSelected = answers[q.id] === opt.id;

                return (
                  <div key={opt.id}>
                    <button
                      onClick={() => handleAnswer(q.id, opt.id)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl text-sm sm:text-base font-medium transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-2 border-purple-500 bg-purple-50 text-purple-900 shadow-sm'
                          : 'border-2 border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                        isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-400'
                      }`}>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="flex-1">{opt.text}</span>
                    </button>
                    
                    {/* "Other" text input */}
                    {isSelected && opt.needsText && (
                      <div className="mt-2 ml-8">
                        <textarea
                          value={otherText[q.id] || ''}
                          onChange={(e) => handleOtherText(q.id, e.target.value)}
                          placeholder="Please share your thoughts..."
                          className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          rows="3"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Optional Comment Field */}
            {answers[q.id] && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💬 Additional thoughts? (Optional)
                </label>
                <textarea
                  value={comments[q.id] || ''}
                  onChange={(e) => handleComment(q.id, e.target.value)}
                  placeholder="Feel free to share any additional thoughts or examples..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                  rows="2"
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Progress Indicator */}
      <div className="flex items-center gap-3 px-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(answeredCount / phase.questions.length) * 100}%`
            }}
          />
        </div>
        <span className="text-sm font-semibold text-gray-600">
          {answeredCount} / {phase.questions.length}
        </span>
      </div>

      {/* Continue Button */}
      {allAnswered && (
        <div className="flex items-center justify-between pt-2">
          {onPrev ? (
            <button onClick={onPrev} className="btn-secondary">
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>
          ) : <div />}
          <button onClick={() => {
            // Save all reflection answers to Supabase
            phase.questions.forEach(q => {
              if (q.type === 'feeling_combined') {
                saveReflectionResponse({
                  moduleId: config.id,
                  moduleTitle: config.title,
                  questionId: q.id,
                  questionText: q.question,
                  answerType: 'feeling_combined',
                  selectedFeelings: selectedFeelings,
                  intensities: intensities,
                });
              } else if (answers[q.id]) {
                const opt = q.options.find(o => o.id === answers[q.id]);
                saveReflectionResponse({
                  moduleId: config.id,
                  moduleTitle: config.title,
                  questionId: q.id,
                  questionText: q.question,
                  answerType: 'single_select',
                  selectedOption: answers[q.id],
                  selectedOptionText: opt?.text || '',
                  otherText: otherText[q.id] || null,
                  comment: comments[q.id] || null,
                });
              }
            });
            onNext();
          }} className="btn-primary">
            Continue <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

// Interactive Example Component - Card Stacking with Better Space Usage
function InteractiveExample({ example, config }) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = example.steps.length;

  const step = example.steps[currentStep];

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      // Track interactive example step
      trackInteractiveExampleStep(
        config.id,
        config.title,
        example.title,
        newStep + 1,
        totalSteps
      );
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition sm:col-span-2">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 sm:px-5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <span className="text-xl">{example.icon}</span>
          <span className="font-bold text-xs sm:text-sm uppercase tracking-wide">Real-world Example</span>
        </div>
        <span className="text-white text-sm font-semibold">Step {currentStep + 1}/{totalSteps}</span>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6">
        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{example.title}</h3>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* LEFT: Larger Card Stack */}
          <div className="relative" style={{ height: '520px' }}>
            {/* Stacked Cards */}
            {example.images.map((img, idx) => {
              const isActive = step.imageIndex === idx;
              const isPast = idx < step.imageIndex;
              const isFuture = idx > step.imageIndex;
              
              let transform = '';
              let zIndex = 0;
              let opacity = 1;
              
              if (isFuture) {
                const offset = (idx - step.imageIndex) * 20;
                transform = `translateX(${offset}px) scale(${1 - (idx - step.imageIndex) * 0.05})`;
                zIndex = totalSteps - idx;
                opacity = 0.6;
              } else if (isActive) {
                transform = 'translateX(0) scale(1)';
                zIndex = totalSteps;
                opacity = 1;
              } else if (isPast) {
                const offset = (step.imageIndex - idx) * -30;
                transform = `translateX(${offset}px) scale(${1 - (step.imageIndex - idx) * 0.05})`;
                zIndex = idx;
                opacity = 0.3;
              }
              
              return (
                <div
                  key={idx}
                  className="absolute inset-0 rounded-lg overflow-hidden shadow-lg bg-white transition-all duration-500 ease-out"
                  style={{ transform, zIndex, opacity }}
                >
                  <img src={img} alt={`Step ${idx + 1}`} className="w-full h-full object-contain" />
                  
                  {isActive && (
                    <>
                      {step.highlights?.map((highlight, hIdx) => (
                        <div
                          key={hIdx}
                          className="absolute border-3 border-red-500 rounded bg-red-500 bg-opacity-10 animate-pulse pointer-events-none"
                          style={{
                            top: highlight.top,
                            left: highlight.left,
                            width: highlight.width,
                            height: highlight.height,
                            boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.3)',
                          }}
                        />
                      ))}

                      {step.arrows?.map((arrow, aIdx) => (
                        <div
                          key={aIdx}
                          className="absolute pointer-events-none hidden sm:block"
                          style={{
                            top: arrow.top,
                            left: arrow.left,
                            animation: 'bounce 1.5s ease-in-out infinite',
                          }}
                        >
                          <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M50 10 L50 70 M50 70 L30 50 M50 70 L70 50"
                              stroke={arrow.color || "#ef4444"}
                              strokeWidth="9"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ filter: 'drop-shadow(0 2px 6px rgba(239, 68, 68, 0.5))' }}
                            />
                          </svg>
                        </div>
                      ))}

                      {step.labels?.map((label, lIdx) => (
                        <div
                          key={lIdx}
                          className="absolute bg-red-500 bg-opacity-95 text-white px-2.5 py-1.5 rounded-md text-xs font-bold shadow-lg pointer-events-none"
                          style={{
                            top: label.top,
                            left: label.left,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {label.text}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT: Info Panel */}
          <div className="flex flex-col justify-between">
            {/* Step Description */}
            <div className="space-y-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg px-4 py-3">
                <p className="text-base text-blue-900 leading-relaxed font-medium">{step.text}</p>
              </div>

              {/* Key Insights - Use the empty space! */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg px-4 py-3">
                <h4 className="text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
                  <span>💡</span> What to Notice:
                </h4>
                <ul className="text-sm text-purple-800 space-y-1.5">
                  {currentStep === 0 && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Look for the "GET STARTED" button</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Notice the friendly, harmless appearance</span>
                      </li>
                    </>
                  )}
                  {currentStep === 1 && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Still looks innocent at this stage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>The deception isn't obvious yet</span>
                      </li>
                    </>
                  )}
                  {currentStep === 2 && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Gray "MANAGE" button is easy to miss</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Blue "ACCEPT" button grabs your attention</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Deliberately designed to push you toward "Accept"</span>
                      </li>
                    </>
                  )}
                  {currentStep === 3 && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Accepting = one click, easy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Rejecting = multiple steps, confusing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>This imbalance is the obstruction pattern</span>
                      </li>
                    </>
                  )}
                  {currentStep === 4 && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Toggle wording: "Allowed" ON = ads allowed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Must toggle LEFT to protect privacy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Confusing design makes users unsure</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Progress Dots */}
              <div className="flex gap-2">
                {example.steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentStep
                        ? 'bg-blue-500 w-8'
                        : idx < currentStep
                        ? 'bg-blue-300 w-2'
                        : 'bg-gray-300 w-2'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center gap-3 mt-6">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 transition flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={nextStep}
                disabled={currentStep === totalSteps - 1}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
                  currentStep === totalSteps - 1
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {currentStep === totalSteps - 1 ? (
                  <>Completed ✓</>
                ) : (
                  <>Next <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LearningPhase({ phase, onNext, onPrev, config, textSizeScale = { base: 'text-base', large: 'text-lg', xl: 'text-xl', '2xl': 'text-2xl', '3xl': 'text-3xl' } }) {
  const [expandedCards, setExpandedCards] = useState({});

  const toggleCard = (i) => {
    setExpandedCards(prev => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <p className="text-xl font-semibold leading-relaxed">{phase.summary}</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {phase.keyPoints.map((point, i) => {
          // Check if this is an interactive example
          if (point.interactive) {
            return <InteractiveExample key={i} example={point.interactive} config={config} />;
          }

          const isExpanded = expandedCards[i];
          
          // Regular card with expand/collapse
          return (
            <div key={i} className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-3">{point.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{point.title}</h3>
              <p className="text-base text-gray-600 leading-relaxed">{point.text}</p>

              {/* Expanded detail */}
              {point.detail && isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">{point.detail}</p>
                </div>
              )}

              {/* Learn more / Show less toggle */}
              {point.detail && (
                <button
                  onClick={() => toggleCard(i)}
                  className="mt-4 text-purple-600 font-semibold text-sm hover:text-purple-800 transition flex items-center gap-1"
                >
                  {isExpanded ? (
                    <>Show less <ChevronLeft className="w-4 h-4 rotate-90" /></>
                  ) : (
                    <>Learn more <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between">
        {onPrev ? (
          <button onClick={onPrev} className="btn-secondary">
            <ChevronLeft className="w-5 h-5" /> Previous
          </button>
        ) : <div />}
        <button onClick={onNext} className="btn-primary">
          Continue <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function TestPhase({ phase, onComplete, textSizeScale = { base: 'text-base', large: 'text-lg', xl: 'text-xl' } }) {
  const [testCompleted, setTestCompleted] = useState(false);

  // Listen for completion message from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      // Check if message is from test completion
      if (event.data.type === 'test-complete' && event.data.passed) {
        setTestCompleted(true);
        // Scroll to show the completion button
        setTimeout(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 300);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // If this is a simulation-based test
  if (phase.isSimulation) {
    return (
      <div className="flex flex-col gap-2">
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 text-amber-800 text-base font-medium">
          🎯 {phase.instruction}
        </div>
        <div className="w-full rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg" style={{ height: "calc(100vh - 160px)" }}>
          <iframe
            src={phase.iframeSrc}
            className="w-full h-full"
            title="Test simulation"
          />
        </div>
        
        {/* Completion Button - Only shows after test is PASSED */}
        {testCompleted && (
          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-4 border-green-400 rounded-2xl p-8 text-center shadow-2xl">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
              Excellent Work!
            </h3>
            <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-xl mx-auto">
              You've successfully completed the test! You can now protect yourself from obstruction dark patterns. Ready to celebrate your achievement?
            </p>
            <button 
              onClick={onComplete}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black text-lg sm:text-xl py-4 px-10 sm:px-12 rounded-xl transition shadow-lg hover:shadow-2xl hover:scale-105 transform inline-flex items-center gap-3"
            >
              <span className="text-2xl">🏆</span>
              <span>Complete Module & Celebrate!</span>
            </button>
            <p className="text-sm text-gray-600 mt-4">
              Click above to see your achievement certificate
            </p>
          </div>
        )}
      </div>
    );
  }

  // Otherwise, use question-based test
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
      <div className="flex flex-col items-center gap-6 py-12">
        <div className={`text-8xl ${passed ? "animate-bounce" : ""}`}>
          {passed ? "🎉" : "😅"}
        </div>
        <div className={`text-center rounded-2xl p-10 w-full max-w-sm border-2 ${passed ? "bg-green-50 border-green-300" : "bg-orange-50 border-orange-300"}`}>
          <p className="text-6xl font-black mb-3" style={{ color: passed ? "#16a34a" : "#ea580c" }}>
            {score} / {phase.questions.length}
          </p>
          <p className="text-xl font-semibold text-gray-800 mb-1">
            {passed ? "Well done!" : "Almost there!"}
          </p>
          <p className="text-base text-gray-500">
            {passed ? "You've passed this module." : "You need 75% to pass. Try again!"}
          </p>
        </div>
        <div className="flex gap-4">
          {!passed && <button onClick={handleRetry} className="btn-secondary">Try Again</button>}
          {passed && (
            <button onClick={onComplete} className="btn-primary">
              Complete Module <ChevronRight className="w-5 h-5" />
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

// Congratulations/Completion Phase
function CongratulationsPhase({ config, onGoHome, onNextModule, hasNextModule }) {
  return (
    <div className="flex flex-col items-center gap-8 py-12 px-4">
      <div className="text-9xl animate-bounce">🎉</div>

      <div className="bg-white border border-green-200 rounded-3xl p-8 sm:p-10 max-w-lg w-full shadow-xl text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
          Module Complete!
        </h1>
        <p className="text-lg text-gray-500 mb-8">
          You've learned how to spot and resist the <span className="font-semibold text-gray-700">{config.title}</span> dark pattern.
        </p>

        {/* Achievement Badge */}
        <div className="flex items-center justify-center gap-4 bg-green-50 border border-green-200 rounded-2xl px-6 py-5 mb-8">
          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl font-black shadow-md">
            ✓
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Module {config.id} Completed</p>
            <p className="text-lg font-bold text-gray-900">{config.title}</p>
          </div>
        </div>

        {/* Survey */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 mb-4 text-left">
          <p className="text-white font-bold text-base mb-0.5">Help us improve! 📋</p>
          <p className="text-purple-200 text-sm mb-3">Share your feedback — takes 2 minutes.</p>
          <a
            href="https://forms.google.com/your-survey-link-here"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-purple-700 font-bold text-sm py-2 px-5 rounded-lg hover:bg-purple-50 transition shadow-sm"
          >
            Take Survey →
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onGoHome}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
          >
            🏠 Back to Home
          </button>
          {hasNextModule && (
            <button
              onClick={onNextModule}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-md flex items-center justify-center gap-2"
            >
              Next Module <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Confetti Effect (CSS) */}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function Module() {
  const { id } = useParams();
  const navigate = useNavigate();
  const config = MODULE_CONFIGS[Number(id)];

  const { textSize, setTextSize, textSizeScale } = useAppContext();

  const [currentPhase, setCurrentPhase] = useState(() =>
    localStorage.getItem(`dptrek_phase_${id}`) || "experience"
  );
  const [unlockedPhases, setUnlockedPhases] = useState(() => {
    const saved = localStorage.getItem(`dptrek_unlocked_${id}`);
    return saved ? JSON.parse(saved) : ["experience"];
  });
  const [moduleCompleted, setModuleCompleted] = useState(false);
  const phaseStartTime = useRef(Date.now());

  useEffect(() => {
    localStorage.setItem(`dptrek_phase_${id}`, currentPhase);
  }, [currentPhase, id]);

  useEffect(() => {
    localStorage.setItem(`dptrek_unlocked_${id}`, JSON.stringify(unlockedPhases));
  }, [unlockedPhases, id]);

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

  // Track module start on mount
  useEffect(() => {
    trackModuleStart(config.id, config.title);
  }, [config.id, config.title]);

  const goToPrevPhase = () => {
    const prev = PHASES[currentIndex - 1];
    if (prev) {
      phaseStartTime.current = Date.now();
      setCurrentPhase(prev);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToNextPhase = () => {
    const next = PHASES[currentIndex + 1];
    if (next) {
      const duration = Math.round((Date.now() - phaseStartTime.current) / 1000);
      trackPhaseTime(config.id, config.title, currentPhase, duration);
      trackPhaseComplete(config.id, config.title, currentPhase);
      phaseStartTime.current = Date.now();
      setUnlockedPhases(prev => prev.includes(next) ? prev : [...prev, next]);
      setCurrentPhase(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleComplete = () => {
    const duration = Math.round((Date.now() - phaseStartTime.current) / 1000);
    trackPhaseTime(config.id, config.title, currentPhase, duration);
    trackModuleComplete(config.id, config.title);
    saveModuleCompletion({ moduleId: config.id, moduleTitle: config.title });
    localStorage.removeItem(`dptrek_phase_${id}`);
    localStorage.removeItem(`dptrek_unlocked_${id}`);
    setModuleCompleted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const phaseData = config.phases[currentPhase];

  // Show congratulations page if module completed
  if (moduleCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="bg-white border-b-2 border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-center gap-2">
            <img 
              src="/DPTrek_logo.png" 
              alt="DP Trek" 
              className="h-10 w-auto"
            />
          </div>
        </div>
        <CongratulationsPhase
          config={config}
          onGoHome={handleGoHome}
          hasNextModule={!!MODULE_CONFIGS[Number(id) + 1]}
          onNextModule={() => navigate(`/module/${Number(id) + 1}`)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="px-6 py-2 flex items-center justify-between gap-4">

          {/* Left: Home */}
          <Link to="/" className="flex items-center gap-1.5 text-gray-500 hover:text-purple-700 font-semibold transition flex-shrink-0">
            <ChevronLeft className="w-4 h-4" />
            <img src="/DPTrek_logo.png" alt="DP Trek" className="h-8 w-auto" />
          </Link>

          {/* Center: Phase tabs */}
          <div className="flex items-center gap-1.5 flex-1 justify-center">
            {PHASES.map((phase, i) => (
              <div key={phase} className="flex items-center gap-1.5">
                <PhaseTab
                  phase={phase}
                  isActive={currentPhase === phase}
                  isUnlocked={unlockedPhases.includes(phase)}
                  onClick={setCurrentPhase}
                />
                {i < PHASES.length - 1 && (
                  <div className={`w-6 h-0.5 ${unlockedPhases.includes(PHASES[i + 1]) ? "bg-purple-300" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Right: Text size + progress */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-xs font-semibold text-gray-400 mr-1">Size:</span>
              {[["small","text-sm"],["medium","text-base"],["large","text-lg"]].map(([size, cls]) => (
                <button
                  key={size}
                  onClick={() => setTextSize(size)}
                  className={`w-7 h-7 rounded-lg ${cls} font-bold transition ${
                    textSize === size ? "bg-purple-600 text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                  }`}
                >A</button>
              ))}
            </div>
            <div className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {currentIndex + 1} / {PHASES.length}
            </div>
          </div>

        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-2 sm:py-3">
        <div className="mb-2">
          <span className={`${textSizeScale.sm || 'text-sm'} font-bold text-purple-600 uppercase tracking-widest`}>Module {config.id}</span>
          <h1 className={`${textSizeScale['2xl'] || 'text-2xl'} font-bold text-gray-900 mt-0.5`}>{config.title}</h1>
        </div>

        {currentPhase === "experience"  && <IframePhase    phase={phaseData} onNext={goToNextPhase} onPrev={null}            config={config} textSizeScale={textSizeScale} />}
        {currentPhase === "reflection"  && <ReflectionPhase phase={phaseData} onNext={goToNextPhase} onPrev={goToPrevPhase} config={config} textSizeScale={textSizeScale} />}
        {currentPhase === "learning"    && <LearningPhase  phase={phaseData} onNext={goToNextPhase} onPrev={goToPrevPhase} config={config} textSizeScale={textSizeScale} />}
        {currentPhase === "experiment"  && <IframePhase    phase={phaseData} onNext={goToNextPhase} onPrev={goToPrevPhase} config={config} textSizeScale={textSizeScale} />}
        {currentPhase === "test"        && <TestPhase      phase={phaseData} onComplete={handleComplete} textSizeScale={textSizeScale} />}
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
          background: white; color: #7c3aed; font-weight: 700;
          border: 2px solid #7c3aed;
          font-size: 1rem; padding: 0.75rem 1.75rem;
          border-radius: 0.75rem; cursor: pointer; transition: all 0.2s;
        }
        .btn-secondary:hover { background: #f5f3ff; }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: #f3f4f6; color: #374151; font-weight: 700;
          font-size: 1rem; padding: 0.75rem 1.75rem;
          border-radius: 0.75rem; transition: background 0.2s; cursor: pointer;
        }
        .btn-secondary:hover { background: #e5e7eb; }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}