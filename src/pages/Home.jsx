import { useMemo, useState } from "react";
import { CheckCircle2, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoGuardian from "../assets/logo-guardian.png";

const MODULES = [
  { id: 1, title: "Obstruction", description: "Learn how websites make it hard for you to cancel subscriptions or delete your account." },
  { id: 2, title: "Nagging", description: "Discover how repeated pop-ups and notifications push you into unwanted decisions." },
  { id: 3, title: "Interface Interference", description: "See how confusing layouts and hidden options trick you into clicking the wrong thing." },
  { id: 4, title: "Sneaking", description: "Understand how extra charges and items are quietly added without your clear consent." },
  { id: 5, title: "Forced Action", description: "Find out how websites force you to sign up or share data just to use basic features." },
];

function ProgressBar({ value }) {
  return (
    <div className="h-4 w-full rounded-full bg-white border border-purple-200 overflow-hidden shadow-sm">
      <div
        className="h-full rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function Button({ children, className = "", variant = "primary", size = "md", ...props }) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const sizes = {
    sm: "text-base px-4 py-2.5",
    md: "text-lg px-6 py-3.5",
    lg: "text-lg px-7 py-4",
    xl: "text-xl px-8 py-4",
  };

  const variants = {
    primary: "bg-purple-600 text-white hover:bg-purple-700 shadow-sm",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
    link: "bg-transparent text-purple-700 hover:underline px-0 py-0 rounded-none",
  };

  return (
    <button
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`relative rounded-2xl bg-white border-2 shadow-md hover:shadow-lg transition-shadow ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const [completedModules, setCompletedModules] = useState([]);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [textSize, setTextSize] = useState("medium"); // small, medium, large
  const [showWelcomeHelper, setShowWelcomeHelper] = useState(true);

  const navigate = useNavigate();

  const progressPercent = useMemo(
    () => (completedModules.length / MODULES.length) * 100,
    [completedModules.length]
  );

  const textSizeScale = useMemo(() => {
    const scales = {
      small: {
        base: 'text-sm',
        heading: 'text-3xl md:text-4xl',
        subheading: 'text-xl md:text-2xl',
        cardTitle: 'text-xl',
        cardText: 'text-base',
        sectionTitle: 'text-2xl'
      },
      medium: {
        base: 'text-base',
        heading: 'text-4xl md:text-5xl',
        subheading: 'text-xl md:text-2xl',
        cardTitle: 'text-2xl',
        cardText: 'text-lg',
        sectionTitle: 'text-3xl'
      },
      large: {
        base: 'text-lg',
        heading: 'text-5xl md:text-6xl',
        subheading: 'text-2xl md:text-3xl',
        cardTitle: 'text-3xl',
        cardText: 'text-xl',
        sectionTitle: 'text-4xl'
      }
    };
    return scales[textSize] || scales.medium;
  }, [textSize]);

  const toggleComplete = (id) => {
    setCompletedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    // Later: send to backend or store
    setFeedbackName("");
    setFeedbackMessage("");
    alert("Thank you! Your feedback has been saved.");
  };

  const resumeLastSession = () => {
    const nextIncomplete = MODULES.find((m) => !completedModules.includes(m.id));
    if (nextIncomplete) navigate(`/module/${nextIncomplete.id}`);
    else alert("Congratulations! You've completed all lessons 🎉");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="mx-auto max-w-full px-8">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between py-4 gap-8">
            {/* Logo */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <span className="text-3xl">🛡️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DP Trek</h1>
                <p className="text-sm text-gray-600">Dark Pattern Education</p>
              </div>
            </div>

            {/* Progress Bar - Takes up remaining space */}
            <div className="flex-1 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl px-8 py-3.5 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-gray-900">Your Learning Progress</span>
                  <span className="px-3 py-1 bg-white border border-purple-200 text-purple-700 text-sm font-bold rounded-lg shadow-sm">
                    {Math.round(progressPercent)}% Complete
                  </span>
                </div>
                <span className="text-base font-bold text-purple-700">
                  {completedModules.length} of {MODULES.length} modules completed
                </span>
              </div>
              <ProgressBar value={progressPercent} />
            </div>

            {/* Text Size Controls */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-3 border border-gray-200 flex-shrink-0">
              <span className="text-sm font-semibold text-gray-700">Text Size:</span>
              <button
                onClick={() => setTextSize("small")}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition ${
                  textSize === "small" ? "bg-purple-600 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                A
              </button>
              <button
                onClick={() => setTextSize("medium")}
                className={`w-9 h-9 rounded-lg text-base font-bold transition ${
                  textSize === "medium" ? "bg-purple-600 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                A
              </button>
              <button
                onClick={() => setTextSize("large")}
                className={`w-9 h-9 rounded-lg text-lg font-bold transition ${
                  textSize === "large" ? "bg-purple-600 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                A
              </button>
            </div>

            {/* Resume Button */}
            <Button
              size="lg"
              onClick={resumeLastSession}
              className="rounded-xl shadow-md hover:shadow-lg flex-shrink-0"
            >
              <Play className="w-5 h-5 mr-2" />
              Resume Last Session
            </Button>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden space-y-4 py-4">
            {/* Top Row: Logo and Resume Button */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <span className="text-2xl">🛡️</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">DP Trek</h1>
                  <p className="text-xs text-gray-600">Dark Pattern Education</p>
                </div>
              </div>

              <Button
                size="md"
                onClick={resumeLastSession}
                className="rounded-xl shadow-md hover:shadow-lg flex-shrink-0"
              >
                <Play className="w-4 h-4 mr-1" />
                Resume
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl px-5 py-4 border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">Learning Progress</span>
                  <span className="px-2 py-1 bg-white border border-purple-200 text-purple-700 text-xs font-bold rounded-lg">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <span className="text-sm font-bold text-purple-700">
                  {completedModules.length} / {MODULES.length}
                </span>
              </div>
              <ProgressBar value={progressPercent} />
            </div>

            {/* Text Size Controls */}
            <div className="flex items-center justify-center gap-3 bg-gray-50 rounded-xl px-5 py-4 border border-gray-200">
              <span className="text-sm font-semibold text-gray-700">Text Size:</span>
              <button
                onClick={() => setTextSize("small")}
                className={`w-12 h-12 rounded-lg text-sm font-bold transition ${
                  textSize === "small" ? "bg-purple-600 text-white shadow-md" : "bg-white text-gray-700 border border-gray-200"
                }`}
              >
                A
              </button>
              <button
                onClick={() => setTextSize("medium")}
                className={`w-12 h-12 rounded-lg text-base font-bold transition ${
                  textSize === "medium" ? "bg-purple-600 text-white shadow-md" : "bg-white text-gray-700 border border-gray-200"
                }`}
              >
                A
              </button>
              <button
                onClick={() => setTextSize("large")}
                className={`w-12 h-12 rounded-lg text-lg font-bold transition ${
                  textSize === "large" ? "bg-purple-600 text-white shadow-md" : "bg-white text-gray-700 border border-gray-200"
                }`}
              >
                A
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Welcome Helper Card - Can be dismissed */}
        {showWelcomeHelper && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl">
                    💡
                  </div>
                  <h3 className={`${textSizeScale.cardTitle} font-bold text-gray-900`}>Welcome! Here's How It Works</h3>
                </div>
                <div className={`${textSizeScale.cardText} text-gray-700 space-y-2`}>
                  <p><strong>Step 1:</strong> Choose a module below to start learning about online tricks</p>
                  <p><strong>Step 2:</strong> Complete the interactive lessons at your own pace</p>
                  <p><strong>Step 3:</strong> Use the "Text Size" buttons above if you need larger text</p>
                  <p><strong>Tip:</strong> You can pause and come back anytime - your progress is saved!</p>
                </div>
              </div>
              <button
                onClick={() => setShowWelcomeHelper(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold flex-shrink-0"
                aria-label="Close welcome message"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <header className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center overflow-hidden shadow-lg">
            <img
              src={logoGuardian}
              alt=""
              className="w-24 h-24 object-cover"
              aria-hidden="true"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <span className="text-5xl" aria-hidden="true">🛡️</span>
          </div>

          <h1 className={`${textSizeScale.heading} font-bold text-gray-900 mb-6 leading-tight`}>
            Welcome to Your Safe Browsing Journey
          </h1>

          <p className={`${textSizeScale.subheading} text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8`}>
            Learn to recognize deceptive website tricks that might confuse or mislead you. Each interactive lesson takes 10-15 minutes and includes real examples you can practice with.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-white rounded-xl px-6 py-4 border-2 border-purple-200 shadow-sm">
              <div className="text-3xl font-bold text-purple-600">{MODULES.length}</div>
              <div className={`${textSizeScale.cardText} text-gray-600 font-semibold`}>Learning Modules</div>
            </div>
            <div className="bg-white rounded-xl px-6 py-4 border-2 border-green-200 shadow-sm">
              <div className="text-3xl font-bold text-green-600">{completedModules.length}</div>
              <div className={`${textSizeScale.cardText} text-gray-600 font-semibold`}>Completed</div>
            </div>
            <div className="bg-white rounded-xl px-6 py-4 border-2 border-blue-200 shadow-sm">
              <div className="text-3xl font-bold text-blue-600">~{MODULES.length * 12} min</div>
              <div className={`${textSizeScale.cardText} text-gray-600 font-semibold`}>Total Time</div>
            </div>
          </div>
        </header>

        {/* Module Cards */}
        <section aria-label="Learning Modules" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`${textSizeScale.sectionTitle} font-bold text-gray-900`}>
              Your Learning Modules
            </h2>
            <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
              <span className="text-2xl">📚</span>
              <span className={`${textSizeScale.cardText} font-semibold text-purple-700`}>
                {MODULES.length - completedModules.length} to go
              </span>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((mod) => {
              const isComplete = completedModules.includes(mod.id);

              return (
                <Card
                  key={mod.id}
                  className={`${isComplete ? "border-green-300 bg-green-50/40" : "border-gray-200"}`}
                >
                  {isComplete && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Module Header with Badge */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md">
                        {mod.id}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md">
                            ~12 min
                          </span>
                        </div>
                        <h3 className={`${textSizeScale.cardTitle} font-semibold text-gray-900`}>
                          {mod.title}
                        </h3>
                      </div>
                    </div>

                    <p className={`${textSizeScale.cardText} text-gray-600 leading-relaxed mb-6`}>
                      {mod.description}
                    </p>

                    {/* What You'll Learn */}
                    <div className={`${textSizeScale.base} bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200`}>
                      <div className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <span>✓</span> What you'll learn:
                      </div>
                      <ul className="text-gray-600 text-sm space-y-1 ml-5">
                        <li>• Recognize this trick</li>
                        <li>• Protect yourself</li>
                        <li>• See real examples</li>
                      </ul>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button
                        size="xl"
                        variant={isComplete ? "secondary" : "primary"}
                        className="w-full"
                        onClick={() => navigate(`/module/${mod.id}`)}
                        aria-label={isComplete ? `Review Module ${mod.id}: ${mod.title}` : `Start Module ${mod.id}: ${mod.title}`}
                      >
                        {isComplete ? "Review Module" : "Start Learning"}
                      </Button>

                      {!isComplete && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full text-gray-500"
                          onClick={() => toggleComplete(mod.id)}
                          aria-label={`Mark Module ${mod.id} as complete`}
                        >
                          Mark as Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Motivational Quote */}
        <section className="mb-16 text-center" aria-label="Inspirational Message">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-8 shadow-md">
            <div className="text-5xl mb-4">🎓</div>
            <p className={`${textSizeScale.subheading} font-semibold text-gray-900 leading-relaxed mb-3`}>
              "Knowledge is your best defense online."
            </p>
            <p className={`${textSizeScale.cardText} text-gray-600`}>
              Every lesson you complete makes you safer and more confident online.
            </p>
          </div>
        </section>

        {/* Feedback */}
        <section className="mb-16" aria-label="Share Your Thoughts">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">💬</div>
              <h2 className={`${textSizeScale.sectionTitle} font-bold text-gray-900 mb-3`}>
                We'd Love Your Feedback
              </h2>
              <p className={`${textSizeScale.cardText} text-gray-600`}>
                Your input helps us improve these lessons for everyone
              </p>
            </div>

            <form
              onSubmit={handleFeedbackSubmit}
              className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-md space-y-6"
            >
              <div className="space-y-2">
                <label htmlFor="feedback-name" className={`${textSizeScale.cardText} font-semibold text-gray-900 block`}>
                  Your Name (optional)
                </label>
                <input
                  id="feedback-name"
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  placeholder="Enter your name"
                  className={`w-full ${textSizeScale.cardText} py-3 px-4 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-500 outline-none`}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="feedback-message" className={`${textSizeScale.cardText} font-semibold text-gray-900 block`}>
                  Your Feedback *
                </label>
                <textarea
                  id="feedback-message"
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="What did you learn? What could be better? Any suggestions?"
                  className={`w-full ${textSizeScale.cardText} p-4 min-h-[150px] rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-500 outline-none`}
                  required
                />
              </div>

              <Button type="submit" size="xl" className="w-full" aria-label="Send your feedback">
                📨 Send Feedback
              </Button>

              <p className={`${textSizeScale.base} text-gray-500 text-center`}>
                * Required field
              </p>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 shadow-sm">
        <div className="mx-auto max-w-full px-8 py-12">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <span className="text-2xl">🛡️</span>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">DP Trek</div>
                  <div className="text-sm text-gray-600">Stay Safe Online</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Learn to recognize and avoid online tricks. Empower yourself with knowledge for safer internet browsing.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Button variant="link" className="text-base block" aria-label="Frequently Asked Questions">
                  ❓ Frequently Asked Questions
                </Button>
                <Button variant="link" className="text-base block" aria-label="Share with family">
                  👨‍👩‍👧‍👦 Share With Family
                </Button>
              </div>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-4">Contact Us</h3>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <p className="text-sm text-gray-700 mb-3">
                  Having trouble? Don't hesitate to ask someone you trust for help.
                </p>
                <Button variant="primary" size="md" className="w-full" aria-label="Get help">
                  📞 Get Help
                </Button>
              </div>
            </div>
          </div>

          {/* Assessment Survey CTA */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-center shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              Ready to Test Your Knowledge?
            </h3>
            <p className="text-purple-100 mb-4 text-lg">
              Complete all modules and take our assessment to see how much you've learned!
            </p>
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white hover:bg-gray-100 text-purple-700 font-bold"
              aria-label="Take the After-Learning Assessment Survey"
            >
              🎯 Take Assessment Survey
            </Button>
          </div>

          {/* Bottom Bar */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              © 2024 Dark Patterns Education • Helping older adults stay safe online
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}