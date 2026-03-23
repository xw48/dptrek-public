import { useMemo, useState, useEffect } from "react";
import { CheckCircle2, Play, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// PostHog Analytics
import { trackHomePageLoad, trackTextSizeChange, trackModuleClick } from "../posthog";

// Supabase Database
import { saveFeedback, initSession } from "../supabaseClient";

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
  // Load progress from cookies on initial mount
  const [completedModules, setCompletedModules] = useState(() => {
    const savedProgress = Cookies.get('dptrek_progress');
    return savedProgress ? JSON.parse(savedProgress) : [];
  });
  
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [textSize, setTextSize] = useState(() => {
    // Load text size from cookies on initial mount
    const savedSize = Cookies.get('dptrek_textsize');
    return savedSize || "medium";
  });
  const [showWelcomeHelper, setShowWelcomeHelper] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(() => {
    return Cookies.get('dptrek_contrast') === 'high';
  });

  const navigate = useNavigate();

  // Track home page load
  useEffect(() => {
    trackHomePageLoad();
    initSession(textSize);
  }, []);

  // Save progress to cookies whenever it changes
  useEffect(() => {
    Cookies.set('dptrek_progress', JSON.stringify(completedModules), { expires: 365 });
  }, [completedModules]);

  // Save text size to cookies whenever it changes
  useEffect(() => {
    Cookies.set('dptrek_textsize', textSize, { expires: 365 });
  }, [textSize]);

  // Save contrast preference and toggle body class
  useEffect(() => {
    Cookies.set('dptrek_contrast', highContrast ? 'high' : 'normal', { expires: 365 });
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

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

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    const success = await saveFeedback({ name: feedbackName, message: feedbackMessage });
    setFeedbackName("");
    setFeedbackMessage("");
    if (success) {
      alert("Thank you! Your feedback has been saved.");
    } else {
      alert("Thank you for your feedback!");
    }
  };

  const resumeLastSession = () => {
    const nextIncomplete = MODULES.find((m) => !completedModules.includes(m.id));
    if (nextIncomplete) navigate(`/module/${nextIncomplete.id}`);
    else alert("Congratulations! You've completed all lessons 🎉");
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url).then(() => {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    });
  };

  const handleEmailShare = () => {
    const subject = "Check out DP Trek - Learn to Stay Safe Online";
    const body = `Hi!\n\nI wanted to share this helpful website with you: DP Trek\n\nIt teaches older adults how to recognize deceptive website tricks and stay safe online. The lessons are interactive and easy to follow.\n\nCheck it out here: ${window.location.origin}\n\nBest regards`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleWhatsAppShare = () => {
    const text = `Check out DP Trek - an educational website that teaches how to stay safe online and recognize deceptive website tricks!\n\n${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="mx-auto max-w-full px-8">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between py-4 gap-8">
            {/* Menu Button + Logo */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <button
                onClick={() => setSideMenuOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              <img 
                src="/DPTrek_logo.png" 
                alt="DP Trek Logo" 
                className="h-12 w-auto"
              />
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
                onClick={() => {
                  setTextSize("small");
                  trackTextSizeChange("small");
                }}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition ${
                  textSize === "small" ? "bg-purple-600 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                A
              </button>
              <button
                onClick={() => {
                  setTextSize("medium");
                  trackTextSizeChange("medium");
                }}
                className={`w-9 h-9 rounded-lg text-base font-bold transition ${
                  textSize === "medium" ? "bg-purple-600 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                A
              </button>
              <button
                onClick={() => {
                  setTextSize("large");
                  trackTextSizeChange("large");
                }}
                className={`w-9 h-9 rounded-lg text-lg font-bold transition ${
                  textSize === "large" ? "bg-purple-600 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                A
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition flex items-center gap-1.5 ${
                  highContrast
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
                aria-label="Toggle high contrast mode"
              >
                ◐ Contrast
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
            {/* Top Row: Menu, Logo and Resume Button */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSideMenuOpen(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </button>
                <img 
                  src="/DPTrek_logo.png" 
                  alt="DP Trek Logo" 
                  className="h-10 w-auto"
                />
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

            {/* Text Size & Contrast Controls */}
            <div className="flex items-center justify-center gap-3 bg-gray-50 rounded-xl px-5 py-4 border border-gray-200 flex-wrap">
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
              <div className="w-px h-8 bg-gray-300 mx-1"></div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`h-12 px-4 rounded-lg text-sm font-bold transition flex items-center gap-1.5 ${
                  highContrast
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200"
                }`}
                aria-label="Toggle high contrast mode"
              >
                ◐ Contrast
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
          {/* DPTrek Text with one-time entrance animation */}
          <div className="mb-6 overflow-hidden">
            <h1 className="hero-title text-7xl md:text-8xl font-black bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
              DPTrek
            </h1>
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
                        onClick={() => {
                          trackModuleClick(mod.id, mod.title);
                          navigate(`/module/${mod.id}`);
                        }}
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
                <Button variant="link" className="text-base block" aria-label="Share with family" onClick={handleShare}>
                  👨‍👩‍👧‍👦 Share
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
              © 2026 Dark Patterns Education • Helping older adults stay safe online
            </p>
          </div>
        </div>
      </footer>

      {/* Side Menu Drawer */}
      {sideMenuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40 transition-opacity"
            onClick={() => setSideMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute top-0 left-0 h-full w-72 bg-white shadow-2xl flex flex-col animate-slideIn">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <img src="/DPTrek_logo.png" alt="DP Trek" className="h-9 w-auto" />
              <button
                onClick={() => setSideMenuOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {/* Drawer Links */}
            <nav className="flex-1 px-4 py-4 space-y-1">
              <a
                href="#project"
                onClick={() => setSideMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
              >
                📋 Project
              </a>
              <a
                href="#team"
                onClick={() => setSideMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
              >
                👥 Team
              </a>
              <a
                href="#feedback"
                onClick={() => setSideMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
              >
                💬 Send Feedback
              </a>
            </nav>
            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-400">DP Trek © 2026</p>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-3xl">👨‍👩‍👧‍👦</span>
                  Share
                </h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-white hover:text-gray-200 text-3xl font-bold"
                  aria-label="Close share modal"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <p className={`${textSizeScale.cardText} text-gray-700 leading-relaxed`}>
                Help your loved ones stay safe online! Share DP Trek with friends and family members who could benefit from learning about online safety.
              </p>

              {/* Success Message */}
              {shareSuccess && (
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 text-center animate-pulse">
                  <p className={`${textSizeScale.cardText} text-green-800 font-semibold`}>
                    ✅ Link copied to clipboard!
                  </p>
                </div>
              )}

              {/* Website URL Display */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Website Address:</p>
                <p className={`${textSizeScale.base} text-purple-600 font-mono break-all`}>
                  {window.location.origin}
                </p>
              </div>

              {/* Share Options */}
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleEmailShare}
                >
                  <span className="text-2xl mr-3">✉️</span>
                  Share via Email
                </Button>

                <Button
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleWhatsAppShare}
                >
                  <span className="text-2xl mr-3">💬</span>
                  Share via WhatsApp
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full"
                  onClick={handleCopyLink}
                >
                  <span className="text-2xl mr-3">📋</span>
                  Copy Link
                </Button>
              </div>

              <div className={`${textSizeScale.base} bg-blue-50 border border-blue-200 rounded-xl p-4`}>
                <p className="text-blue-800">
                  <strong>💡 Tip:</strong> You can also write down the website address and share it in person or over the phone!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* One-time entrance animation */}
      <style>{`
        @keyframes heroEntrance {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .hero-title {
          animation: heroEntrance 1.2s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.25s ease-out;
        }

        /* High Contrast Mode */
        .high-contrast {
          --hc-bg: #000000;
          --hc-surface: #1a1a1a;
          --hc-text: #ffffff;
          --hc-text-secondary: #e0e0e0;
          --hc-border: #ffffff;
          --hc-accent: #ffdd00;
          --hc-link: #66ccff;
        }

        .high-contrast body,
        .high-contrast .min-h-screen {
          background-color: var(--hc-bg) !important;
          color: var(--hc-text) !important;
        }

        .high-contrast .bg-white,
        .high-contrast .bg-gray-50,
        .high-contrast .bg-gray-100 {
          background-color: var(--hc-surface) !important;
          color: var(--hc-text) !important;
        }

        .high-contrast .border-gray-200,
        .high-contrast .border-gray-300,
        .high-contrast .border-purple-200 {
          border-color: #555 !important;
        }

        .high-contrast .text-gray-900,
        .high-contrast .text-gray-800,
        .high-contrast .text-gray-700 {
          color: var(--hc-text) !important;
        }

        .high-contrast .text-gray-600,
        .high-contrast .text-gray-500,
        .high-contrast .text-gray-400 {
          color: var(--hc-text-secondary) !important;
        }

        .high-contrast .text-purple-600,
        .high-contrast .text-purple-700 {
          color: var(--hc-accent) !important;
        }

        .high-contrast .bg-purple-600 {
          background-color: var(--hc-accent) !important;
          color: #000000 !important;
        }

        .high-contrast .bg-gradient-to-r {
          background: var(--hc-surface) !important;
        }

        .high-contrast .bg-purple-50,
        .high-contrast .bg-indigo-50,
        .high-contrast .bg-blue-50,
        .high-contrast .bg-green-50 {
          background-color: #1a1a2e !important;
        }

        .high-contrast .shadow-sm,
        .high-contrast .shadow-md,
        .high-contrast .shadow-lg {
          box-shadow: 0 0 0 1px #555 !important;
        }

        .high-contrast a,
        .high-contrast button.text-purple-700 {
          color: var(--hc-link) !important;
        }

        .high-contrast input,
        .high-contrast textarea {
          background-color: #1a1a1a !important;
          color: #ffffff !important;
          border-color: #666 !important;
        }

        .high-contrast .hero-title {
          -webkit-text-fill-color: var(--hc-accent) !important;
          color: var(--hc-accent) !important;
        }

        .high-contrast footer {
          background-color: var(--hc-surface) !important;
          border-color: #555 !important;
        }
      `}</style>
    </div>
  );
}