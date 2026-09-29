# DPTrek — Developer Documentation

> **This is a snapshot repo for the DPTrek live demo hosted on https://dptrek-psi.vercel.app/**
> Last updated: Sep 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Getting Started](#4-getting-started)
5. [Architecture Overview](#5-architecture-overview)
6. [Routing](#6-routing)
7. [State Management (AppContext)](#7-state-management-appcontext)
8. [Home Page (`Home.jsx`)](#8-home-page-homejsx)
9. [Module System (`Module.jsx`)](#9-module-system-modulejsx)
   - [Phase 1: Experience](#phase-1-experience)
   - [Phase 2: Reflection](#phase-2-reflection)
   - [Phase 3: Learning](#phase-3-learning)
   - [Phase 4: Experiment](#phase-4-experiment)
   - [Phase 5: Test](#phase-5-test)
   - [Congratulations Screen](#congratulations-screen)
10. [Module Configs (`src/modules/`)](#10-module-configs-srcmodules)
11. [Interactive HTML Simulations (`public/modules/`)](#11-interactive-html-simulations-publicmodules)
12. [Backend — Supabase](#12-backend--supabase)
13. [Analytics — PostHog](#13-analytics--posthog)
14. [Post-Training Survey](#14-post-training-survey)
15. [Accessibility Features](#15-accessibility-features)
16. [Security Measures](#16-security-measures)
17. [Deployment (Vercel)](#17-deployment-vercel)
18. [How to Add a New Module](#18-how-to-add-a-new-module)
19. [Known Considerations](#19-known-considerations)

---

## 1. Project Overview

DP Trek is an interactive web application that teaches older adults how to recognize and defend against **dark patterns** — deceptive design tricks used by websites and apps. Each module covers one type of dark pattern through a structured 5-phase learning cycle:

1. **Experience** — Interact with a realistic simulation of the dark pattern
2. **Reflection** — Answer questions about what you noticed
3. **Learning** — Read educational content with real-world examples
4. **Experiment** — Apply your knowledge to a second simulation
5. **Test** — Prove your understanding through a scored assessment

There are currently **5 modules**:

| ID | Module | Dark Pattern Type |
|----|--------|-------------------|
| 1 | Obstruction | Making cancellation/deletion hard |
| 2 | Nagging | Repeated pop-ups pushing unwanted decisions |
| 3 | Interface Interference | Confusing layouts, hidden options |
| 4 | Sneaking | Hidden charges and pre-checked options |
| 5 | Forced Action | Forced sign-ups, mandatory data sharing |

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2 |
| Routing | React Router | 7.13 |
| Build Tool | Vite | 7.3 |
| Styling | Tailwind CSS | 3.4 |
| Icons | Lucide React | 0.564 |
| Database | Supabase | 2.99 |
| Analytics | PostHog | 1.357 |
| Cookies | js-cookie | 3.0 |
| Deployment | Vercel | — |

---

## 3. Project Structure

```
dp-trek/
├── public/
│   ├── DPTrek_logo.png
│   ├── facebook-screen1.png          # Used in learning phase examples
│   ├── facebook-screen2.png
│   ├── facebook-screen3.png
│   └── modules/                       # Standalone HTML simulations
│       ├── forced-action/
│       │   ├── experience.html
│       │   ├── experiment.html
│       │   └── test.html
│       ├── interference/
│       │   ├── experience.html
│       │   ├── experiment.html
│       │   └── test.html
│       ├── nagging/
│       │   ├── experience.html
│       │   ├── experiment.html
│       │   └── test.html
│       ├── obstruction/
│       │   ├── experience.html
│       │   ├── experiment.html
│       │   └── test.html
│       └── sneaking/
│           ├── experience.html
│           ├── experiment.html
│           └── test.html
│
├── src/
│   ├── main.jsx                       # Entry point
│   ├── App.jsx                        # Router + providers
│   ├── AppContext.jsx                  # Global state (text size, progress, survey)
│   ├── supabaseClient.js              # Database functions
│   ├── posthog.js                     # Analytics tracking
│   ├── index.css                      # Tailwind imports
│   ├── App.css                        # Minimal global styles
│   │
│   ├── components/
│   │   └── Navbar.jsx                 # (Currently unused — nav is inline in pages)
│   │
│   ├── modules/                       # Module configuration files
│   │   ├── forced-action/config.js
│   │   ├── interference/config.js
│   │   ├── nagging/config.js
│   │   ├── obstruction/config.js
│   │   └── sneaking/config.js
│   │
│   └── pages/
│       ├── Home.jsx                   # Landing page, module cards, survey
│       └── Module.jsx                 # Core module engine (all 5 phases)
│
├── index.html                         # HTML entry
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
└── vercel.json                        # SPA routing for Vercel
```

---

## 4. Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

### Environment

There are **no `.env` files**. API keys for Supabase and PostHog are embedded directly in the source code. Both are **public client-side keys** by design:
- **Supabase anon key** — read/write access controlled by Row Level Security (RLS)
- **PostHog project key** — client-side analytics, no sensitive data

---

## 5. Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Vercel     │────▶│   React SPA  │────▶│   Supabase   │
│  (hosting)   │     │  (Vite build)│     │  (database)  │
└─────────────┘     └──────┬───────┘     └──────────────┘
                           │
                    ┌──────┴───────┐
                    │   PostHog    │
                    │ (analytics)  │
                    └──────────────┘
```

**Data flow:**
1. User opens the app → `Home.jsx` renders module cards
2. User clicks a module → navigates to `/module/:id` → `Module.jsx` loads config
3. Module.jsx renders the 5-phase learning cycle
4. Interactive simulations load in **sandboxed iframes** from `public/modules/`
5. Iframes communicate with React via `postMessage`
6. User responses saved to **Supabase**; interactions tracked in **PostHog**
7. Progress stored locally in **cookies** (via js-cookie) and **localStorage**

---

## 6. Routing

Defined in `src/App.jsx`:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Home` | Landing page with module cards, progress, feedback, survey |
| `/module/:id` | `Module` | Module learning engine (id = 1–5) |

All routes are client-side. `vercel.json` rewrites all paths to `index.html` for SPA support.

---

## 7. State Management (AppContext)

`src/AppContext.jsx` provides centralized state via React Context:

| State | Type | Cookie Key | Description |
|-------|------|-----------|-------------|
| `textSize` | `"small" \| "medium" \| "large"` | `dptrek_textsize` | User's text size preference |
| `highContrast` | `boolean` | `dptrek_contrast` | High contrast mode toggle |
| `completedModules` | `number[]` | `dptrek_progress` | Array of completed module IDs |
| `surveyCompleted` | `boolean` | `dptrek_survey` | Whether post-training survey is done |
| `textSizeScale` | `object` | — | Memoized Tailwind class mappings |

**Methods:**
- `setTextSize(size)` — update text size
- `setHighContrast(bool)` — toggle contrast mode (also toggles `high-contrast` class on `<html>`)
- `toggleComplete(id)` — add/remove module from completed list
- `setSurveyCompleted(bool)` — mark survey as done

All state persists across sessions via cookies (365-day expiry).

**Text Size Scale** maps each size tier to Tailwind classes:

```javascript
textSizeScale.base      // "text-sm" | "text-base" | "text-lg"
textSizeScale.heading   // "text-3xl md:text-4xl" | "text-4xl md:text-5xl" | "text-5xl md:text-6xl"
textSizeScale.cardTitle // "text-xl" | "text-2xl" | "text-3xl"
textSizeScale.cardText  // "text-base" | "text-lg" | "text-xl"
// ... and more
```

---

## 8. Home Page (`Home.jsx`)

The home page includes:

### Header
- Logo + hamburger menu
- Progress bar (X/5 modules, percentage)
- Text size controls (S/M/L buttons)
- High contrast toggle
- "Resume Last Session" button

### Main Content
- Welcome helper card (dismissable)
- Hero section with DPTrek branding
- Quick stats (modules, completed, total time)
- **Survey banner** — appears when all 5 modules are complete
- Module cards grid (5 cards)
  - Shows completion status (green checkmark)
  - "Start Learning" or "Review Module" button
  - "Mark as Complete" shortcut
- Motivational quote section
- Feedback form (name + message → saves to Supabase)

### Footer
- Brand info, quick links, help section
- Share modal (email, WhatsApp, copy link)
- Side menu drawer (project, team, feedback links)

### Post-Training Survey
- Triggered when `completedModules.length >= 5`
- 8 sections, 28 total Likert-scale questions
- Responses saved to Supabase `survey_responses` table
- Completion tracked in cookies

---

## 9. Module System (`Module.jsx`)

This is the core engine. It loads a module config by ID and renders the appropriate phase.

### Phase Navigation

```
Experience → Reflection → Learning → Experiment → Test → Congratulations
```

- Phases unlock sequentially — user must complete current phase to proceed
- Tab bar at top shows all phases (locked ones grayed out)
- Phase state persisted to localStorage:
  - `dptrek_phase_{id}` — current phase name
  - `dptrek_unlocked_{id}` — array of unlocked phase names

### Phase 1: Experience

- Renders an **iframe** loading the HTML simulation (e.g., `/modules/nagging/experience.html`)
- Header bar with: **Leave** button (red), **"Simulation Website"** label, **Report** button
- Listens for `postMessage` from iframe:
  - `{ type: 'task_complete', result: 'accepted' | 'declined' }` — simulation finished
  - `{ type: 'user_interacted' }` — user engaged with simulation
- Shows feedback message (success/warning) based on result
- "Continue" button unlocks after interaction

### Phase 2: Reflection

- Renders questions defined in the module config
- **Question types:**
  - `single_select` — radio-button style options
    - If an option has `needsText: true`, a textarea appears when selected
    - Optional comment field per question
  - `feeling_combined` — multi-select feeling chips + intensity slider (1–5) per feeling
- Progress bar shows answered/total
- All responses saved to Supabase `reflection_responses` table
- Must answer all questions to continue

### Phase 3: Learning

- Summary card (purple gradient)
- Key points grid (2 columns):
  - **Static cards** — icon, title, text, optional expandable detail
  - **Interactive examples** — multi-step image carousel with highlights, arrows, and labels
    - Used for real-world examples (e.g., Facebook privacy settings walkthrough)
    - Previous/Next navigation, progress dots

### Phase 4: Experiment

- Same iframe engine as Experience
- Starts with an **overlay modal** showing instructions
- User clicks "Start Exercise →" to dismiss overlay and interact
- Optional `experimentReminder` and `experimentTip` shown

### Phase 5: Test

**Two modes:**

1. **Simulation-based** (`isSimulation: true`):
   - Loads iframe with test.html
   - Listens for `{ type: 'test-complete', score, total, passed }`
   - Results saved to Supabase `test_results` table

2. **Question-based** (`isSimulation: false`):
   - Multiple-choice questions with correct answers
   - Pass threshold: **75%** (`score >= Math.ceil(total * 0.75)`)
   - Failed: "Try Again" button resets the test
   - Passed: "Complete Module" button

### Congratulations Screen

- Shown after test completion
- Bouncing 🎉 emoji, achievement badge
- Buttons: "Back to Home" and "Next Module →"
- Module marked as complete in AppContext + Supabase

---

## 10. Module Configs (`src/modules/`)

Each module has a `config.js` exporting its full configuration. Structure:

```javascript
export default {
  id: 1,                    // Module number (1-5)
  title: "Obstruction",     // Display name
  subtitle: "When websites make things unnecessarily difficult",
  color: "red",             // Tailwind color theme

  phases: {
    experience: {
      title: "Experience",
      instruction: "Try to cancel your subscription...",
      iframeSrc: "/modules/obstruction/experience.html",
    },

    reflection: {
      title: "Reflection",
      questions: [
        {
          id: "r1",
          question: "What did you notice?",
          type: "single_select",          // or "feeling_combined"
          options: [
            { id: "a", text: "It was hard to find cancel" },
            { id: "b", text: "Other", needsText: true },
          ],
        },
      ],
    },

    learning: {
      title: "Learning",
      summary: "Obstruction is when...",
      keyPoints: [
        {
          icon: "📖",
          title: "What is Obstruction?",
          text: "Explanation...",
          detail: "Extended explanation...",     // optional expandable
        },
        {
          interactive: {                        // optional interactive example
            icon: "📱",
            title: "Real-world: Facebook",
            images: ["/facebook-screen1.png"],
            steps: [
              {
                text: "Notice the small text...",
                imageIndex: 0,
                highlights: [{ top: '87%', left: '7%', width: '86%', height: '5%' }],
                arrows: [{ top: '82%', left: '47%', color: '#3b82f6' }],
                labels: [{ text: 'Hidden option', top: '90%', left: '10%' }],
              },
            ],
          },
        },
      ],
    },

    experiment: {
      title: "Experiment",
      instruction: "Now try to find the hidden option...",
      iframeSrc: "/modules/obstruction/experiment.html",
      experimentReminder: "Remember what you learned!",
      experimentTip: "Look for small text links",
    },

    test: {
      title: "Test",
      instruction: "Complete these scenarios...",
      iframeSrc: "/modules/obstruction/test.html",
      isSimulation: true,     // true = iframe test, false = multiple choice
      // If isSimulation: false:
      questions: [
        {
          id: "q1",
          question: "What is obstruction?",
          options: [
            { id: "a", text: "Making things hard to find" },
            { id: "b", text: "Showing pop-ups" },
          ],
          correct: "a",
        },
      ],
    },
  },
};
```

### Module Color Mapping

| Module | Color | Used for |
|--------|-------|----------|
| Obstruction | `red` | Theme accents |
| Nagging | `orange` | Theme accents |
| Interface Interference | `blue` | Theme accents |
| Sneaking | `teal` | Theme accents |
| Forced Action | `rose` | Theme accents |

---

## 11. Interactive HTML Simulations (`public/modules/`)

Each module has 3 standalone HTML files that run inside iframes:

| File | Purpose | Loaded During |
|------|---------|---------------|
| `experience.html` | First simulation — user experiences the dark pattern | Experience phase |
| `experiment.html` | Second simulation — user applies knowledge | Experiment phase |
| `test.html` | Scored assessment scenarios | Test phase |

### Communication Protocol (postMessage)

**Iframe → Parent (React):**

```javascript
// Simulation complete
window.parent.postMessage({
  type: 'task_complete',
  result: 'accepted' | 'declined'
}, window.location.origin);

// User interacted
window.parent.postMessage({
  type: 'user_interacted'
}, window.location.origin);

// Test complete (test.html only)
window.parent.postMessage({
  type: 'test-complete',
  score: 2,
  total: 2,
  passed: true
}, window.location.origin);
```

**Security:**
- All `postMessage` calls use `window.location.origin` (not wildcard `'*'`)
- Parent validates `event.origin === window.location.origin` before processing
- Iframes are sandboxed: `sandbox="allow-same-origin allow-scripts"`

### Test HTML Structure

Test files typically contain:
- An intro screen with instructions
- Multiple scenarios (2 per module)
- A transition modal between scenarios (emoji + title + feedback badge)
- A completion modal showing final score (X / Y)
- Score and pass/fail communicated to parent via postMessage

---

## 12. Backend — Supabase

### Connection

```javascript
// src/supabaseClient.js
const SUPABASE_URL = 'https://iwagajqgbatqtxntzhth.supabase.co';
const SUPABASE_ANON_KEY = '...'; // Public anon key
```

### Session Management

Each user gets a persistent `sessionId` stored in localStorage (`dptrek_session_id`). Generated as a random UUID on first visit.

### Database Tables & Functions

| Function | Table | When Called |
|----------|-------|------------|
| `initSession(textSize)` | `sessions` | App load |
| `saveReflectionResponse({...})` | `reflection_responses` | Reflection phase submit |
| `saveTestResult({...})` | `test_results` | Test phase complete |
| `saveModuleCompletion({...})` | `module_completions` | Module finished |
| `saveFeedback({name, message})` | `feedback` | Home page feedback form |
| `saveSurveyResponse(responses)` | `survey_responses` | Post-training survey |
| `trackPhaseAction({...})` | `phase_tracking` | Leave/Report button clicks |

### Table Schemas (inferred from insert calls)

**sessions:**
- `session_id` (text, primary key)
- `text_size` (text)
- `created_at` (auto)

**reflection_responses:**
- `session_id`, `module_id`, `module_title`
- `question_id`, `question_text`
- `answer_type` ("single_select" | "feeling_combined")
- `selected_option`, `selected_option_text`, `other_text`, `comment`
- `selected_feelings` (jsonb), `intensities` (jsonb)

**test_results:**
- `session_id`, `module_id`, `module_title`
- `score`, `total`, `passed`

**module_completions:**
- `session_id`, `module_id`, `module_title`

**feedback:**
- `session_id`, `name`, `message`

**survey_responses:**
- `session_id`, `responses` (jsonb — structured by section)

**phase_tracking:**
- `session_id`, `module_id`, `module_title`, `phase`, `action`

### Supabase SQL Setup

To set up the database from scratch, run the following SQL in the **Supabase SQL Editor** (`Project → SQL Editor → New Query`):

```sql
-- Drop existing tables if any (fresh start)
DROP TABLE IF EXISTS phase_tracking;
DROP TABLE IF EXISTS module_completions;
DROP TABLE IF EXISTS test_results;
DROP TABLE IF EXISTS reflection_responses;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS sessions;

-- 1. Sessions
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  text_size TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Reflection Responses
CREATE TABLE reflection_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  module_id INTEGER NOT NULL,
  module_title TEXT NOT NULL,
  question_id TEXT NOT NULL,
  question_text TEXT,
  answer_type TEXT NOT NULL,
  selected_option TEXT,
  selected_option_text TEXT,
  other_text TEXT,
  comment TEXT,
  selected_feelings TEXT[],
  intensity INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Test Results
CREATE TABLE test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  module_id INTEGER NOT NULL,
  module_title TEXT NOT NULL,
  score INTEGER,
  total INTEGER,
  passed BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Module Completions
CREATE TABLE module_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  module_id INTEGER NOT NULL,
  module_title TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Feedback
CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT,
  name TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Phase Tracking
CREATE TABLE phase_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  module_id INTEGER NOT NULL,
  module_title TEXT NOT NULL,
  phase TEXT NOT NULL,
  action TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS on all tables (for public educational tool)
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE reflection_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE test_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE module_completions DISABLE ROW LEVEL SECURITY;
ALTER TABLE feedback DISABLE ROW LEVEL SECURITY;
ALTER TABLE phase_tracking DISABLE ROW LEVEL SECURITY;
```

> **How to run:** Go to your Supabase dashboard → click **SQL Editor** in the left sidebar → click **New Query** → paste the entire SQL block above → click **Run**. All 6 tables will be created and RLS will be disabled.

---

## 13. Analytics — PostHog

### Setup (`src/posthog.js`)

```javascript
const POSTHOG_KEY = 'phc_PYstlQ5v5rqOBBNa1FwzYcTbCA6GpTcV4V8JDUnxbU8';
const POSTHOG_HOST = 'https://app.posthog.com';
```

Auto-capture is **disabled** — all events are tracked manually.

### Events Tracked

| Function | Event | When |
|----------|-------|------|
| `trackHomePageLoad()` | Home page view | Home.jsx mount |
| `trackModuleClick(id, name)` | Module card clicked | Home page |
| `trackModuleStart(id, name)` | Module started | Module.jsx mount |
| `trackPhaseComplete(id, name, phase)` | Phase finished | Phase navigation |
| `trackPhaseTime(id, name, phase, seconds)` | Time in phase | Phase navigation |
| `trackReflectionSubmit(id, name, answers, ...)` | Reflection submitted | Reflection phase |
| `trackTestComplete(id, name, score, total, passed)` | Test finished | Test phase |
| `trackModuleComplete(id, name)` | Module completed | Congratulations |
| `trackTextSizeChange(size)` | Text size changed | Home page controls |
| `trackSurveyClick(id, name)` | Survey link clicked | Congratulations |
| `trackInteractiveExampleStep(...)` | Example step viewed | Learning phase |

---

## 14. Post-Training Survey

Located in `Home.jsx`. Appears when all 5 modules are completed.

### Trigger
- Green banner appears above the motivational quote section
- "Take Survey" button opens the survey modal

### Survey Sections (28 questions total)

| Section | # Questions |
|---------|------------|
| Enjoyment | 4 |
| Confidence | 3 |
| Perceived Ease of Use | 3 |
| Aesthetic Appeal | 3 |
| Reward | 3 |
| Attitude of Coping with Dark Patterns | 5 |
| Risk of Dark Patterns | 4 |
| Future Behavioral Intention | 3 |

### Scale
5-point Likert: Strongly disagree → Somewhat disagree → Neutral → Somewhat agree → Strongly agree

### Data Storage
- Responses saved to Supabase `survey_responses` table as structured JSON
- Completion tracked in cookie `dptrek_survey`

---

## 15. Accessibility Features

Designed for older adults:

| Feature | Implementation |
|---------|---------------|
| **Text size adjustment** | 3 tiers (S/M/L) — affects all text via `textSizeScale` |
| **High contrast mode** | Dark background, high-contrast colors via CSS variables |
| **Large click targets** | Buttons are `xl` size with generous padding |
| **Clear labels** | Descriptive button text, `aria-label` attributes |
| **Keyboard navigation** | Semantic HTML, focusable elements |
| **Simple language** | Written for non-technical users |
| **Progress persistence** | Cookies + localStorage — users can leave and return |
| **Simulation disclaimers** | "This is a simulated website" warnings in HTML files |

### High Contrast CSS Variables

```css
--hc-bg: #000000
--hc-surface: #1a1a1a
--hc-text: #ffffff
--hc-text-secondary: #e0e0e0
--hc-border: #ffffff
--hc-accent: #ffdd00
--hc-link: #66ccff
```

---

## 16. Security Measures

| Measure | Details |
|---------|---------|
| **postMessage origin validation** | Parent checks `event.origin === window.location.origin` |
| **postMessage targeting** | Iframes use `window.location.origin` (not `'*'`) |
| **Iframe sandboxing** | `sandbox="allow-same-origin allow-scripts"` |
| **JSON.parse guards** | try-catch around all cookie/localStorage JSON parsing |
| **Public keys only** | Supabase anon key and PostHog key are public by design |
| **No real data collection** | Simulations warn users not to enter real information |

---

## 17. Deployment (Vercel)

### Config (`vercel.json`)

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures all routes are handled by the React SPA.

### Build Command
```
npm run build
```

### Output Directory
```
dist/
```

### Deploy
Push to the connected Git repository. Vercel auto-deploys on push.

---

## 18. How to Add a New Module

### Step 1: Create the config

Create `src/modules/{module-name}/config.js`:

```javascript
export default {
  id: 6,                          // Next available ID
  title: "New Pattern",
  subtitle: "Description of the dark pattern",
  color: "amber",                 // Tailwind color

  phases: {
    experience: {
      title: "Experience",
      instruction: "...",
      iframeSrc: "/modules/{module-name}/experience.html",
    },
    reflection: {
      title: "Reflection",
      questions: [/* ... */],
    },
    learning: {
      title: "Learning",
      summary: "...",
      keyPoints: [/* ... */],
    },
    experiment: {
      title: "Experiment",
      instruction: "...",
      iframeSrc: "/modules/{module-name}/experiment.html",
    },
    test: {
      title: "Test",
      instruction: "...",
      iframeSrc: "/modules/{module-name}/test.html",
      isSimulation: true,
    },
  },
};
```

### Step 2: Create the HTML simulations

Create 3 files in `public/modules/{module-name}/`:
- `experience.html`
- `experiment.html`
- `test.html`

Each must communicate via postMessage:

```javascript
// When simulation completes:
window.parent.postMessage({
  type: 'task_complete',
  result: 'accepted'  // or 'declined'
}, window.location.origin);

// For test.html:
window.parent.postMessage({
  type: 'test-complete',
  score: score,
  total: total,
  passed: score >= passingThreshold
}, window.location.origin);
```

### Step 3: Register the module

In `src/pages/Module.jsx`, add the import and register in `MODULE_CONFIGS`:

```javascript
import newPatternConfig from '../modules/{module-name}/config';

const MODULE_CONFIGS = {
  1: obstructionConfig,
  2: naggingConfig,
  3: interferenceConfig,
  4: sneakingConfig,
  5: forcedActionConfig,
  6: newPatternConfig,       // Add here
};
```

### Step 4: Update the MODULES array in Home.jsx

```javascript
const MODULES = [
  // ... existing modules
  {
    id: 6,
    title: "New Pattern",
    description: "Description for the home page card."
  },
];
```

### Step 5: Update the survey trigger

The survey currently triggers when `completedModules.length >= MODULES.length`. Since `MODULES.length` is dynamic, this should work automatically.

---

## 19. Known Considerations

1. **Bundle size warning** — The build produces a single JS chunk >500KB. Consider code-splitting with dynamic `import()` if this becomes a performance issue.

2. **No `.env` file** — API keys are hardcoded. This is intentional (public client keys), but if you add server-side logic or private keys in the future, use environment variables.

3. **Supabase RLS** — Ensure Row Level Security policies are properly configured on all tables. The anon key allows client-side inserts — RLS controls what operations are permitted.

4. **localStorage cleanup** — Phase progress (`dptrek_phase_*`, `dptrek_unlocked_*`) is cleared on module completion but remains if a user abandons a module mid-way.

5. **No authentication** — Users are anonymous. Session tracking is via a random UUID. There is no login system.

6. **Survey table** — The `survey_responses` table must exist in Supabase with a `session_id` (text) column and a `responses` (jsonb) column for the survey to save successfully.

7. **Navbar component** — `src/components/Navbar.jsx` exists but is currently unused. Navigation is built inline within Home.jsx and Module.jsx.

8. **Mobile responsiveness** — The home page has separate desktop (`xl:`) and mobile layouts. Module simulations (iframes) work best on tablet/desktop-sized screens.

---

## Quick Reference: Key Files

| What | Where |
|------|-------|
| App entry | `src/main.jsx` |
| Routes | `src/App.jsx` |
| Global state | `src/AppContext.jsx` |
| Home page | `src/pages/Home.jsx` |
| Module engine | `src/pages/Module.jsx` |
| Module configs | `src/modules/{name}/config.js` |
| HTML simulations | `public/modules/{name}/*.html` |
| Database client | `src/supabaseClient.js` |
| Analytics | `src/posthog.js` |
| Tailwind config | `tailwind.config.js` |
| Vite config | `vite.config.js` |
| Deploy config | `vercel.json` |
