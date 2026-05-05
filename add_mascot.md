New Layout — 3 Layer Dashboard
┌─────────────────────────────────────────────────────┐
│  Welcome, Angela!              MINDfulness matters! │
│  April 20, 2026                                     │
└─────────────────────────────────────────────────────┘

LAYER 1 (Top)
┌─────────────────────────┬───────────────────────────┐
│  🐷 ATM                 │  🔥 5 day streak           │
│  The Generous Lover     │                           │
│  [6 trait chips]        │  🐷 (Mia / chat button)   │
│  [Daily Quote image]    │  [Wardrobe panel]         │
└─────────────────────────┴───────────────────────────┘

LAYER 2 (Middle)
┌─────────────────────────┬───────────────────────────┐
│                         │  😬 😕 😣 😖 😭 😭 ❓    │
│  📅 Calendar            │  Mood Tracker             │
│  (events + dots)        ├───────────────────────────┤
│                         │  📝 My Journal            │
│                         │  [sticky note + past]     │
└─────────────────────────┴───────────────────────────┘

LAYER 3 (Bottom — smaller font)
┌─────────────────────────────────────────────────────┐
│  Your Status Score                                  │
│  PHQ-9: 15/27   GAD-7: 5/21   Suicidal: 60/100     │
│  Overall: Needs Attention                           │
└─────────────────────────────────────────────────────┘
Auth + Onboarding Flow
/login  →  /quiz  →  [shareable card popup]  →  /  (dashboard)
First time login → redirected to quiz
Quiz completed → shareable card popup → click "Let's go!" → dashboard
Returning user → straight to dashboard (quiz already done)
Claude Code Prompt — Part by Part
Here's the build order with a prompt per part:

PART 1 — Auth Routes
# MINDfulness — PART 1: Authentication

## Task
Add simple username/password authentication to the student app.

## Requirements:

### Backend:
- Add `users` table to SQLite:
  - id, username, password (plain text for prototype — no hashing needed), student_id (FK → students.id)
- Seed one user: username="angela", password="password123", student_id=1
- Add endpoints:
  - POST /auth/login → body: { username, password } → returns { success, student_id, has_completed_quiz }
  - GET /auth/me?student_id=1 → returns { student_id, username, has_completed_quiz }
- Add `has_completed_quiz` boolean column to `users` table (default false)

### Frontend:
- `/login` page:
  - Centered card layout
  - MINDfulness logo/title at top
  - Username input + Password input
  - "Login" button
  - On success: if has_completed_quiz=false → redirect to /quiz, else → redirect to /
  - On failure: show "Incorrect username or password"
  - Simple session storage to keep user logged in (store student_id in localStorage)
- Protect `/` route: if not logged in → redirect to /login

## Design:
- Same soft pink/purple color palette as rest of app
- No navbar
- Clean centered card, rounded corners, soft shadow

## Build this part only. Stop and wait for confirmation before continuing.
PART 2 — MINDtype Quiz + Shareable Card Popup
# MINDfulness — PART 2: MINDtype Quiz + Shareable Card

## Task
Build the onboarding quiz that assigns students a MINDtype personality.

## Quiz Page (`/quiz`):

### 3 Questions (show one at a time, with progress bar):

**Q1: It's 11pm and your assignment is due tomorrow. You:**
- A) Already submitted it last week 🙂
- B) Just started, no worries
- C) What assignment??
- D) Crying while eating instant noodles 😭

**Q2: Your friend needs £50. You:**
- A) Send it immediately, no questions 💳
- B) "I'm also broke sorry"
- C) Pretend you didn't see the message
- D) Send it but screenshot it for memories

**Q3: How do you handle stress?**
- A) Sleep through it 😴
- B) Retail therapy — buy something
- C) Tell everyone about it
- D) Bottle it up and explode later

### Scoring Logic (hardcoded mapping):
- Mostly A → **ZZZ** (Sleepy Cow 🐮)
- Mostly B + Q2=A → **ATM** (Generous Pig 🐷)
- Mostly C → **MAIN** (Delusional Fox 🦊)
- Mostly D → **TOFU** (Soft Sheep 🐑)
- Mixed/other → **404** (Chaos Raccoon 🦝)

### After submitting quiz:
1. Save result to backend: POST /quiz/submit → body: { student_id, mindtype_code }
2. Show **Shareable Card Popup** (modal overlay)

---

## Shareable Card Popup (modal):

### Layout (fixed 400×400px card inside modal):
┌─────────────────────────────────┐
│ ✨ MINDfulness MINDtype ✨ │
│ │
│ [artwork image here] │
│ (see image notes below) │
│ │
│ ATM — The Generous Lover │
│ │
│ 💳 Generous 💞 Gift-giver │
│ 😅 Chaotic 🤗 People-pleaser │
│ ✨ Magnetic 😭 Overwhelmed │
│ │
│ mindfulness.imperial.ac.uk │
└─────────────────────────────────┘


### Artwork Image Note (IMPORTANT):
- The shareable card artwork images will be provided as pre-generated PNG files
- They will be placed in: `frontend/public/mindtype-assets/`
- File naming convention:
  - `atm.png` → ATM artwork
  - `zzz.png` → ZZZ artwork
  - `main.png` → MAIN artwork
  - `tofu.png` → TOFU artwork
  - `404.png` → 404 artwork
- For now, use placeholder colored boxes (pink gradient div) where the image goes
- When the real artwork PNGs are added to the folder, they will automatically appear
- Use: `<img src="/mindtype-assets/{mindtype_code.toLowerCase()}.png" onError fallback to colored div />`

### Card Styling:
- Soft pink-to-purple gradient background
- White text
- Rounded corners, shadow
- Fixed size: 400×400px (square, Instagram-friendly)

### Buttons below card:
- **"Download Card"** → use html2canvas to screenshot the card div → download as PNG
  - Install: `npm install html2canvas`
- **"Let's go! →"** → mark has_completed_quiz=true in backend → redirect to `/`

---

## Backend additions:
- Add `mindtype_code` column to `users` table (string, nullable)
- POST /quiz/submit → body: { student_id, mindtype_code } → saves mindtype, sets has_completed_quiz=true
- GET /quiz/result?student_id=1 → returns { mindtype_code, mindtype_name, animal, traits[] }

## MINDtype Data (hardcode in backend):
```python
MINDTYPES = {
  "ATM": {
    "name": "The Generous Lover",
    "animal": "Pig",
    "emoji": "🐷",
    "color": "#f9a8d4",
    "traits": [
      {"emoji": "💳", "label": "Generous"},
      {"emoji": "💞", "label": "Gift-giver"},
      {"emoji": "😅", "label": "Chaotic"},
      {"emoji": "🤗", "label": "People-pleaser"},
      {"emoji": "✨", "label": "Magnetic"},
      {"emoji": "😭", "label": "Overwhelmed"}
    ],
    "quote": "You give love like a vending machine — endlessly."
  },
  "ZZZ": {
    "name": "The Unbothered One",
    "animal": "Cow",
    "emoji": "🐮",
    "color": "#bbf7d0",
    "traits": [
      {"emoji": "😴", "label": "Unbothered"},
      {"emoji": "🌿", "label": "Chill"},
      {"emoji": "🤷", "label": "Go-with-flow"},
      {"emoji": "💤", "label": "Sleep-lover"},
      {"emoji": "🧘", "label": "Peaceful"},
      {"emoji": "😶", "label": "Hard to read"}
    ],
    "quote": "Stress? Never heard of her."
  },
  "404": {
    "name": "The Chaos Gremlin",
    "animal": "Raccoon",
    "emoji": "🦝",
    "color": "#e9d5ff",
    "traits": [
      {"emoji": "🌙", "label": "Night owl"},
      {"emoji": "🗑️", "label": "Dumpster diver"},
      {"emoji": "⚡", "label": "Impulsive"},
      {"emoji": "😈", "label": "Chaotic"},
      {"emoji": "🎲", "label": "Unpredictable"},
      {"emoji": "🤌", "label": "Somehow survives"}
    ],
    "quote": "Submitted at 11:59pm. Got a distinction."
  },
  "TOFU": {
    "name": "The Soft Overthinker",
    "animal": "Sheep",
    "emoji": "🐑",
    "color": "#fef3c7",
    "traits": [
      {"emoji": "💭", "label": "Overthinks"},
      {"emoji": "🥺", "label": "Sensitive"},
      {"emoji": "📖", "label": "Studious"},
      {"emoji": "😰", "label": "Anxious"},
      {"emoji": "🤍", "label": "Kind"},
      {"emoji": "🌧️", "label": "Feels deeply"}
    ],
    "quote": "You felt that email was passive aggressive. It was."
  },
  "MAIN": {
    "name": "The Delusional Optimist",
    "animal": "Fox",
    "emoji": "🦊",
    "color": "#fed7aa",
    "traits": [
      {"emoji": "✨", "label": "Main character"},
      {"emoji": "🌈", "label": "Optimistic"},
      {"emoji": "🎭", "label": "Dramatic"},
      {"emoji": "💅", "label": "Confident"},
      {"emoji": "🚀", "label": "Dreamer"},
      {"emoji": "😅", "label": "Delusional"}
    ],
    "quote": "It will work out. It always does. (It doesn't.)"
  }
}
Build this part only. Stop and wait for confirmation before continuing.

---

### PART 3 — Dashboard Layout (3 Layers)

MINDfulness — PART 3: Main Dashboard Layout (3 Layers)
Task
Rebuild the Home.jsx dashboard with the new 3-layer layout.
No navbar. All content on one scrollable page.

LAYER 1 — Top Row (2 columns)
LEFT: Personality Card
Fetch student's MINDtype from GET /quiz/result?student_id=1
Show:
MINDtype code + name (e.g. "ATM — The Generous Lover")
Animal emoji large (🐷)
6 trait chips in a 2×3 grid (emoji + label each)
Daily Quote section below traits:
Small inspirational image (hardcode from /public/quotes/ folder, rotate randomly)
Quote text overlaid on image
For now use a colored gradient div as placeholder
RIGHT: Streak + Mia + Wardrobe
Streak counter at top:
🔥 icon + "X day streak"
Streak = consecutive days with either a journal entry OR mood log
Calculate from database: count consecutive days backwards from today
Mia mascot (large, centered):
Show the animal emoji for their MINDtype (e.g. 🐷 for ATM) in a large circle
This is the chat button — clicking it navigates to /chat
Label below: "Chat with Mia!"
Subtle pulse animation to draw attention
Wardrobe panel below Mia:
Title: "Mia's Wardrobe 👗"
Show 5 milestone items as a row:
Day 1: 🎀 Pink bow
Day 3: 👒 Sun hat
Day 7: 🧣 Cozy scarf
Day 14: 🏠 Cozy room
Day 30: 👑 Crown
Unlocked items (streak >= milestone): colored, clickable, shows "Equipped ✓" if selected
Locked items: grey, shows "Day X" label
Clicking an unlocked item "equips" it (save to localStorage for prototype)
Show currently equipped item below Mia emoji: e.g. "Wearing: 🎀 Pink bow"
LAYER 2 — Middle Row (2 columns)
LEFT: Mental Wellness Calendar
Same as previously built calendar component
Monthly grid with event dots
Next event notice above calendar
Compact size to fit in column
RIGHT (stacked vertically):
Top half: Mood Tracker
"How are you feeling today?" title
7-day emoji strip (Mon–Sun)
Empty dashed circles / filled emoji circles
Click circle → MoodPickerModal (as previously designed)
"More >" link top-right → /mood-stats placeholder
Bottom half: My Journal
"My Journal" title
Yellow sticky note textarea ("What's on your mind?")
Submit button
"Click to see past entries" thought bubble → opens PastEntriesModal
LAYER 3 — Bottom (full width, smaller font)
Status Score Bar:
Smaller font size (text-sm)
Subtle background (light grey or very light pink)
Single row layout:
"Your Status Score:"
PHQ-9 (Depression): 15/27
GAD-7 (Anxiety): 5/21
Suicidal Risk: 60/100
Overall badge: "Needs Attention" (amber) or "Normal" (green) or "High Risk" (red)
Small note: "Scores updated by MINDfulness analytics engine"
Read from risk_scores table for student_id=1
Backend additions needed:
GET /streak?student_id=1 → calculate and return current streak count
Logic: count consecutive days (going backwards from today) where journal_entries OR mood_logs exist for that student
GET /wardrobe?student_id=1 → returns { streak, unlocked_items: [...], equipped_item }
For prototype: equipped_item stored in localStorage on frontend (no backend needed)
Component updates:
Home.jsx → full rebuild with 3-layer layout
New: StreakCounter.jsx
New: WardrobePanel.jsx
New: PersonalityCard.jsx (left panel of Layer 1)
Keep: EventsCalendar.jsx, MoodTracker.jsx, JournalSection.jsx, StatusScore.jsx
Build this part only. Stop and wait for confirmation before continuing.

---

### Quick Reference — Build Order:

| Part | What | Key output |
|---|---|---|
| **Part 1** | Auth (login page + session) | `/login` → `/quiz` or `/` |
| **Part 2** | Quiz + shareable card popup | `/quiz` → card → `/` |
| **Part 3** | 3-layer dashboard | Full home page rebuild |