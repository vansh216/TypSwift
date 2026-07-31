# ⌨️ TypSwift — Frontend

A modern, fast, and clean typing speed test web application . 

---

## 📁 Project Structure

```
TypSwift/
│
├── public/
│   └── favicon.ico
│
├── src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.jsx         # Login form component
│   │   │   └── RegisterForm.jsx      # Register form component
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Login page
│   │   │   └── Register.jsx          # Register page
│   │   └── api/
│   │       └── auth.api.js           # Auth API calls (login, register)
│   │
│   ├── test/
│   │   ├── components/
│   │   │   ├── TypingArea.jsx        # Main typing input area
│   │   │   ├── Timer.jsx             # Countdown timer
│   │   │   ├── WpmCounter.jsx        # Live WPM display
│   │   │   └── ModeSelector.jsx      # Time mode selector (1,2,3,5,10 min)
│   │   ├── pages/
│   │   │   └── Test.jsx              # Main test page
│   │   └── api/
│   │       └── test.api.js           # Fetch paragraph, submit result
│   │
│   ├── leaderboard/
│   │   ├── components/
│   │   │   └── LeaderboardTable.jsx  # Leaderboard rankings table
│   │   ├── pages/
│   │   │   └── Leaderboard.jsx       # Leaderboard page
│   │   └── api/
│   │       └── leaderboard.api.js    # Fetch leaderboard data
│   │
│   ├── profile/
│   │   ├── components/
│   │   │   ├── StatsCard.jsx         # WPM, accuracy, total tests cards
│   │   │   ├── HistoryTable.jsx      # Past test results table
│   │   │   └── WpmChart.jsx          # WPM progress chart (recharts)
│   │   ├── pages/
│   │   │   └── Profile.jsx           # User profile/dashboard page
│   │   └── api/
│   │       └── profile.api.js        # Fetch history and stats
│   │
│   └── results/
│       ├── components/
│       │   └── ResultCard.jsx        # Single test result display
│       └── pages/
│           └── Results.jsx           # Results page after test ends
│
├── shared/
│   ├── components/
│   │   ├── Navbar.jsx                # Top navigation bar
│   │   ├── ProtectedRoute.jsx        # Blocks unauthenticated users
│   │   └── Loader.jsx                # Loading spinner
│   ├── context/
│   │   └── AuthContext.jsx           # Global auth state (user, token, login, logout)
│   └── api/
│       └── axios.js                  # Axios base config with interceptors
│
├── App.jsx                           # Routes setup
├── main.jsx                          # App entry point
└── index.css                         # Tailwind v4 import
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── .env.example
├── .gitignore
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🤖 AI Features (Coming Soon)

TypSwift is integrating AI powered features to make
your typing improvement journey smarter and more
personalized than ever before.

---
### 📝 Feature 2 — AI Paragraph Generator

Instead of only typing from a fixed paragraph pool —
you will be able to choose any topic and AI will
generate a completely fresh unique paragraph for you
every single time.


**Why this is useful:**
- Never see the same paragraph twice
- Practice typing content relevant to your field
- Developers can practice tech vocabulary
- Students can practice their subject content

---

### 📈 Feature 3 — AI Typing Coach

After completing 5 or more tests, AI will analyze
patterns across ALL your tests and generate a
personalized improvement report and coaching plan.

**What AI coach provides:**
- Weekly progress summary with WPM trend analysis
- Your strongest and weakest time modes identified
- Personalized difficulty recommendation
- Specific finger exercise suggestions based on
  your most common error patterns
- Predicted WPM target for next week based on
  your improvement rate


---




### 🔍 Feature 1 — Post Test AI Analysis

After every completed test, AI will analyze your
performance in detail and give personalized feedback.

**What AI will analyze:**
- Which characters and words you made errors on most
- At which exact second your WPM dropped
- Your accuracy pattern across the test duration
- Finger position error patterns (q/a/z confusion etc)
- Punctuation and special character weak spots

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/vansh216/TypSwift.git
cd TypSwift

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your values

# 4. Start development server
npm run dev
```

---

## ⚙️ Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.0.0 | UI library |
| `react-dom` | ^19.0.0 | React DOM rendering |
| `react-router-dom` | ^7.0.0 | Client side routing |
| `axios` | ^1.7.0 | HTTP requests to backend |
| `recharts` | ^2.12.0 | WPM progress chart on results page |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^6.0.0 | Build tool and dev server |
| `@vitejs/plugin-react` | ^4.0.0 | React support for Vite |
| `tailwindcss` | ^4.0.0 | Utility first CSS framework |
| `@tailwindcss/vite` | ^4.0.0 | Tailwind v4 Vite plugin |

---

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## 🗺️ Pages and Routes

| Route | Page | Auth Required | Description |
|-------|------|---------------|-------------|
| `/` | Home | ❌ | Mode selector and start button |
| `/login` | Login | ❌ | User login form |
| `/register` | Register | ❌ | User registration form |
| `/test` | Test | ❌ | Main typing test screen |
| `/results` | Results | ✅ | Test result after completion |
| `/leaderboard` | Leaderboard | ❌ | Top scores by time mode |
| `/profile` | Profile | ✅ | User stats, history, and progress |

---

## 🔐 Auth Flow

```
User visits app
      ↓
AuthContext checks localStorage for token
      ↓
Token found?
  YES → fetch /api/auth/me → set user in context → stay logged in
  NO  → user is guest
      ↓
User logs in → token saved to localStorage + context
      ↓
User refreshes → token read from localStorage → still logged in
      ↓
Token expires (7 days) → axios interceptor catches 401 → auto logout
```

---

## ⌨️ Typing Test Flow

```
User selects time mode (1, 2, 3, 5, 10 min or custom)
      ↓
Frontend calls GET /api/test/paragraph?duration=5
      ↓
Paragraph loaded on screen
      ↓
User starts typing → timer starts
      ↓
Every keystroke → compare with paragraph → color characters
      ↓
Every second → calculate live WPM → update counter
      ↓
Timer hits 0 → test ends
      ↓
POST /api/test/submit → save result
      ↓
Redirect to /results
```

---

## 🎨 Key UI Features

| Feature | Description |
|---------|-------------|
| Live WPM counter | Updates every keystroke while typing |
| Character coloring | Green for correct, red for wrong, gray for untyped |
| Smooth cursor | Animated blinking cursor that slides between characters |
| Line scrolling | Only 3 lines visible at a time, scrolls up smoothly |
| Time modes | 1 · 2 · 3 · 5 · 10 minutes + custom input |
| Keyboard shortcuts | `Tab` to restart, `Esc` to stop test |
| WPM graph | Line chart showing speed over time on results page |
| Guest mode | Play without login — results not saved |

---

## 📊 State Management

Auth state is managed globally using **React Context**:

```
AuthContext provides:
├── user          → logged in user object (null if guest)
├── token         → JWT token string
├── isLoggedIn    → boolean
├── loading       → checking auth on startup
├── login()       → call after successful login
├── logout()      → clear token and user
└── register()    → call after successful register
```

All other state (test state, results, leaderboard data) is managed locally inside each feature using `useState` and `useEffect`.

---

## 🔒 Protected Routes

The `ProtectedRoute` component wraps pages that require login:

```
User visits /profile without login
      ↓
ProtectedRoute checks AuthContext
      ↓
isLoggedIn = false → redirect to /login
isLoggedIn = true  → render the page
```

---

## 📱 Responsive Design

| Breakpoint | Target |
|------------|--------|
| Mobile | Leaderboard and profile pages |
| Tablet | All pages |
| Desktop | Full experience including typing test |

Note: The typing test is primarily designed for desktop keyboard use.

---

## 🗺️ What's Connected to Backend

| Frontend Action | Backend Route |
|----------------|--------------|
| Login form submit | `POST /api/auth/login` |
| Register form submit | `POST /api/auth/register` |
| App startup token check | `GET /api/auth/me` |
| Test starts | `GET /api/test/paragraph` |
| Test ends | `POST /api/test/submit` |
| Profile page loads | `GET /api/user/stats` |
| History section loads | `GET /api/user/history` |
| Leaderboard page loads | `GET /api/Leaderboard` |

---

## 👤 Author

Built by **Vansh Kumar Patel**
Project: **TypSwift** — A fast, clean typing speed test app