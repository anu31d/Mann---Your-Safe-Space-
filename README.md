# mann. · मन
### *A non-clinical AI companion that lives in the space between "I'm fine" and "I need therapy."*

> Built for the Capgemini Hackathon · Healthcare & Wellness · Use Case #21

---

## 📌 Problem Statement
Global mental health systems suffer from a vast **middle-ground gap**. On one side, there are shallow wellness or productivity trackers that gamify self-care with sterile streak metrics, numbers, and rigid charts. On the other end, there are clinical therapy frameworks, which are scarce, stigmatized, expensive, and frequently require immediate financial or professional commitments. Millions of individuals facing sub-clinical, daily distress, career transitions, relationship fatigue, or anxiety belong to the **71% who never speak to a professional**. They are too heavy for "I'm fine" but not ready or fit for formal medical crisis registries.

Current digitized assistants act as simple automated rule-checkers or standard ChatGPT clones that fail to acknowledge the user's personality structure, current attachment styles, or visual metaphors for emotional climate. 

---

## 💡 Proposed Solution
**Mann** (Hindi for *mind*, *heart*, and *the subjective inner seat of emotional feeling*) is an offline-capable, local-first conversational space and a kinetic self-regulation ecosystem. It acts as an empathetic, subjective mirror, avoiding dry medicalized terminology. 

Mann introduces:
1. **Adaptive AI Companion Engine (Whispers Chat)**: Generates safe, personality-bounded guidance utilizing the **@google/genai SDK** over Gemini, adjusted across **64 distinct personality alignments** (16 MBTI profiles * 4 Attachment Styles). It features clean inline badge rendering that strips and formats raw text formatting (`**`), interactive diagnostic input starters, and action trigger shortcuts for each message.
2. **The Untangler (CBT Cognitive Reframer)**: A clinical-grade step-by-step cognitive deconstruction wizard that digests raw anxieties, runs a heuristic diagnostic analysis to detect cognitive distortions, guides users through structured cognitive reframing, and persists reframed thoughts in a gorgeous historic ledger.
3. **The Living Garden (Kinetic Canvas & Almanac)**: Translates psychological wellness states from a sterile numeric percentage scale into an organic vector garden that blooms, shifts, or clouds depending on real-time dialogue and completed apothecary rituals. It is coupled with a permanent side-adjacent **Ecosystem Almanac** breaking down climates, wind speeds, and visual indicators.
4. **Adaptive Guiding Light Pathway Dashboard**: A personalized, zero-click guidance board that dynamically matches active weather (e.g. Cloudy/Withering) and MBTI traits against immediate action items (like pre-filling CBT Thought Record self-doubts or directly watering dopamine elements) to avoid navigation friction.
5. **System Inspector Active Telemetry HUD**: A diagnostic sidebar driver mapping human self-regulation workflows. Under focus-actions, a beautiful telemetry HUD overlay slides into view, analyzing psychological foundations (Attachment styles, Somatic metaphorical states, etc.) with real-time feedback.
6. **Reactive Safety Safeguards (Tiered SOS Dispatch)**: Intercepts crisis indicators semantically without sacrificing the companion's presence, exposing immediate localized helpline overlays and safety tools.

---

## 📖 The Innovation Story: Why Mann is Different
Traditional wellness platforms treat the human spirit like a database dashboard, complete with bar charts, percentages, and gamified pressure. Mann throws away numerical mood tracking in favor of **honest metaphors, unhurried design, and absolute guidance**. 

We asked ourselves: *"What if an application didn't demand change, but simply witnessed and reflected?"*

By selecting a **Deep Dusk** palette (`#121412` and `#1A1625`) styled around twilight gradients—the hour when human isolation is most keenly felt—coupled with organic spring-back particle elements, Mann changes the digital companion landscape. It is not an automated doctor; it is a warm, kinetic pocket garden that changes color and growth density based on how you water your chemical baseline (D.O.S.E. rituals) and record automatic negative thoughts (CBT cognitive reframes).

With the new **Guiding Light** module and **Interactive Whispers Action Bar**, users who experience sudden emotional spikes can bridge their dialogue directly into therapeutic frameworks with a single mouse click.

---

## 🛠 Approach, Methodology & Execution
The development team executed a rigorous, iterative problem-solving workflow:

### 1. The Problem-Solving Process
Our team followed a clinical-to-code design pipeline:
* **Physiological Baseline Calibration**: Mapping chemical triggers (Dopamine, Oxytocin, Serotonin, Endorphins) to practical user interactions.
* **Cognitive Load Minimization**: Stripping away multi-step forms. High-tension users often experience 'action freeze', meaning we must pre-fill text and offer one-click shortcuts for cognitive reframing.
* **Continuous Micro-Testing**: Synthesizing custom mock data with clinical CBT theory while continuously running Vite and typescript lint checks to guarantee immediate compile times.

### 2. Major Steps to the Final Solution
1. **Mental Model Definitions (`/src/types.ts`)**: Built strong typings for user attributes, CBT loops, and biological climates.
2. **Interactive SVG Garden Engine (`/src/components/GardenCanvas.tsx`)**: Created the procedural tree-growth canvas that changes height, weight, and wind behavior dynamically.
3. **The Whispers AI Companion Backend Integration (`/server.ts`)**: Wired Node.js Express server with the custom `@google/genai` TypeScript client to proxy Gemini inference safely behind standard authorization and local security parameters.
4. **Enhanced Whispers Action Sync & CBT Untangler Step-by-Step Wizard (`/src/App.tsx`)**: Made the chat and CBT modules communicate with each other. Whispers Chat responses can now be pushed directly to Step 3 of the CBT Untangler wizard, analyzed heuristically, reframed, and planted in the organic Garden Biome.

---

## 🚀 Key Efficiency & Functional Enhancements Implemented
To make **Whispers Chat** and **The Untangler** highly functional and professional, we added the following tactical systems:

### ✉️ Deep Whispers Chat Enhancements
* **Interactive Message Action Strip**: Each model message now features floating tactical companion buttons:
  * 🔮 **Untangle This**: Automatically takes the response text, strips markdown noise, runs diagnostic distortion analysis, populates it as raw tension in the CBT Untangler, and launches you into CBT Step 3 instantly.
  * 💚 **Pin Insight**: Saves the comforting advice as a permanent journal record in your Wisdom Ledger (`What We Understand` tab).
  * 🌸 **Water Soil**: Waters your botanical garden, incrementing your user streak and updating states.
* **Categorized Suggested Prompts Terminal Control Center**: Replaced the sparse generic prompt buttons with an amazing, high-fidelity terminal categories bar. Users can toggle between **Dove Grounding**, **Crystal Cognitive**, **Breeze Somatic**, and **Sprout Garden** to access highly tailored dialog seed shortcuts.

### 🔮 The Untangler (Clinically Structured CBT Reframer)
* **Live Cognitive Distortion Classifier**: Built a heuristic engine (`analyzeCognitiveDistortion`) that automatically detects negative thought patterns (e.g. *Overgeneralization*, *Mind Reading*, *Catastrophizing*, *All-or-Nothing*) based on user text keywords in real-time.
* **Interactive Distortion Grid (Step 3)**: Replaced static text outputs with a beautiful, tactile choice grid. Users can see the recommended auto-detected distortion, but are free to tap any of the six distortions to read descriptive summaries and see custom therapeutic reframing questions.
* **Targeted Refraining Prompts (Step 4)**: Dynamically maps clinical prompt suggestions specific to the active distortion (e.g., for *Personalization* it asks *"What external factors, calendar loads, or other factors contributed to this?"*).
* **Interactive Balanced Mirror Ledger**: Users can view saved reframes with high-contrast colored cards (**Raw worry tension** crossed out in red; **Balanced perspective** shown in vivid emerald). Each past reframe card includes live, reactive control items:
  * **Discuss Reframe**: Pre-sets the text and brings you to the Whispers Chat conversation.
  * **Plant Seed**: Drops a virtual botanical token onto the garden canvas.
  * **Dissolve**: Smoothly updates state to purge looping elements and restore quiet peace.

---

## 📐 System Architecture & Code Flow

Below is the structured data, communication, and interaction flow of the application:

```
                                  USER INTERACTION
                                         │
                                         ▼
 ┌───────────────────────────────────────────────────────────────────────────────┐
 │                                  CLIENT-SIDE                                  │
 │                            React (Vite) / Tailwind CS                         │
 ├───────────────────────────────────────────────────────────────────────────────┤
 │                                                                               │
 │   ┌──────────────────────┐    ┌─────────────────────┐    ┌────────────────┐   │
 │   │    WHISPERS CHAT     │───►│    THE UNTANGLER    │───►│ HISTORIC LEDGER│   │
 │   │ (Interactive Action) │    │  (CBT distortion)   │    │  (Wisdom Logs) │   │
 │   └──────────┬───────────┘    └──────────┬──────────┘    └────────┬───────┘   │
 │              │                           │                        │           │
 │              │                           ▼                        ▼           │
 │              │               ┌────────────────────────────────────────┐       │
 │              │               │        React State & Local Engine      │       │
 │              │               │     - Profile info (MBTI, Attachment)  │       │
 │              ├──────────────►│     - Thought Records Ledger (JSON)    │       │
 │              │               │     - D.O.S.E Apothecary States        │       │
 │              │               └───────────────────▲────────────────────┘       │
 │              │                                   │                            │
 │              ▼                                   ▼                            │
 │     ┌──────────────────┐               ┌────────────────────┐                 │
 │     │  GARDEN CANVAS   │               │   LOCAL STORAGE    │                 │
 │     │ (Interactive SVG)│               │ (Secured Sync loop)│                 │
 │     └──────────────────┘               └────────────────────┘                 │
 └──────────────────────────────────────────────────┬────────────────────────────┘
                                                    │ Secure Proxy Tunnel (Port 3000)
                                                    ▼
 ┌───────────────────────────────────────────────────────────────────────────────┐
 │                                 BACKEND SERVER                                │
 │                             Node.js / Express Server                          │
 ├───────────────────────────────────────────────────────────────────────────────┤
 │                                                                               │
 │       ┌────────────────────────┐           ┌──────────────────────────┐       │
 │       │     Express routing    │◄─────────►│     @google/genai SDK    │       │
 │       │    (Proxy Middleware)  │           │    (Server-Side Client)  │       │
 │       └────────────────────────┘           └─────────────┬────────────┘       │
 └──────────────────────────────────────────────────────────┼────────────────────┘
                                                            ▼
                                                     Gemini 1.5 Pro
                                                (System Context Prompts)
```

### 📦 Key Components & Files
* `/src/App.tsx`: Central hub coordinating persistent reactive states, tab selection, and local synchronization routines.
* `/src/components/SanctuaryHome.tsx`: Incorporates central onboarding states, physical breathing timers, and Dopamine chores.
* `/src/components/GardenCanvas.tsx`: Maps active wellness climates into organic, wind-swayed virtual vector plant models.
* `/src/components/JourneyMap.tsx`: Calculates historic cognitive regulation logs to render interactive milestones.
* `/src/types.ts`: Holds data parameters including `UserProfile`, `ThoughtMirrorRecord`, and `MoodPetal` weather types.

---

## ⚙️ Setup & Local Run Instructions

Ensure you have Node.js 18+ installed on your workspace.

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Environment Configuration**: Set up your credentials dynamically by creating your local environment file:
   ```bash
   cp .env.example .env
   ```
   Add your server API credentials (`GEMINI_API_KEY`) safely inside `.env`.
3. **Execution**:
   * Hot-reloading Local Server development: `npm run dev`
   * TypeScript Syntactic Linter check: `npm run lint`
   * Production Compilation: `npm run build`
   * Port & Host Bindings: Runs on port `3000`.

---

## 🛡️ Challenges & Learnings

* **State Synchronization Integrity**: Keeping user sessions intact across accidental tab refreshes or iframe disconnects is central to trust. We resolved this by building robust **interactive syncing loops** (`useEffect` hooks) mapping the full state footprint (`profile`, `messages`, `thoughtRecords`, and `rituals`) directly into client `LocalStorage` cleanly upon updates.
* **Linguistic Cognitive Translation**: Converting open-ended conversation text into rigid CBT step-by-step fields is highly intimidating for stressed users. We addressed this by writing the heuristic `analyzeCognitiveDistortion` diagnostic, letting users tap a fast action button ("Untangle This") to skip manual transcription completely and land right inside Step 3 of their CBT workflow on a single click.
* **Iframe Sandbox Interventions**: Standard popups and external window redirections are restricted inside target iframe wrappers. To bypass these limitations gracefully, we built native inline alert, toast, and distress panel overlays inside the primary DOM tree, ensuring uninterrupted user interactions.

---

*mann. · मन · Mind. Heart. The soft place where both live.*
