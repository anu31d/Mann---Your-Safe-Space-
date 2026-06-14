/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { MoodPetal, DoseRitual, ChatMessage, UserProfile, ThoughtMirrorRecord } from "./types";
import GardenCanvas from "./components/GardenCanvas";
import { JourneyMap } from "./components/JourneyMap";
import SanctuaryHome from "./components/SanctuaryHome";
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  AlertTriangle, 
  BookOpen, 
  Heart, 
  ShieldAlert, 
  User, 
  Check, 
  HeartCrack, 
  Flame, 
  Smile, 
  Eye, 
  Zap,
  Activity,
  Award,
  MessageSquare,
  Leaf,
  Sliders,
  Home,
  Info,
  Map,
  Compass,
  ArrowRight,
  Menu,
  X,
  Compass as CompassIcon,
  HelpCircle,
  Clock,
  CheckCircle,
  ThumbsUp,
  Volume2
} from "lucide-react";

// Pre-configured profiles representing Mode B/C (Arjun) and first-time guests
const initialArjunProfile: UserProfile = {
  name: "Arjun",
  mbti: "INFP",
  attachmentStyle: "Anxious",
  gardenState: MoodPetal.CLOUDY,
  streak: 6,
  recentJournalTheme: "Work stress, feeling disconnected from purpose",
  lastRitualCompleted: "The Unsent Letter (Oxytocin)",
  emergencyContactName: "Priya (Sister)",
  emergencyContactPhone: "+91-9876543210",
  doseBalance: {
    serotonin: "Low",
    dopamine: "Moderate",
    oxytocin: "Low"
  }
};

const initialNewUserProfile: UserProfile = {
  name: "",
  mbti: "Not Set",
  attachmentStyle: "Not Set",
  gardenState: MoodPetal.GROWING,
  streak: 1,
  recentJournalTheme: "Fresh Start",
  lastRitualCompleted: "None yet",
  emergencyContactName: "Priya (Sister)",
  emergencyContactPhone: "+91-9876543210",
  doseBalance: {
    serotonin: "Balanced",
    dopamine: "Balanced",
    oxytocin: "Balanced"
  }
};

const defaultRituals: DoseRitual[] = [
  {
    id: "unsent-letter",
    name: "The Unsent Letter",
    type: "Oxytocin",
    description: "Write your raw emotional weight onto physical paper directed to someone you miss. Do not mail it. Keep it in your safe compartment.",
    time: "10 min",
    completed: false,
    color: "from-pink-500/10 to-rose-500/5 border-pink-500/20"
  },
  {
    id: "ten-min-walk",
    name: "The 10-Minute Walk",
    type: "Serotonin",
    description: "Step outdoors with zero devices. Scan the horizon level to reset your master circadian network pathways and release melatonin build-ups.",
    time: "10 min",
    completed: false,
    color: "from-emerald-500/10 to-teal-500/5 border-emerald-500/20"
  },
  {
    id: "tiny-thing-done",
    name: "One Tiny Thing Done",
    type: "Dopamine",
    description: "Pick a microaction requiring under 60 seconds (folding one piece of clothing, centering a tea-mug). Execute it with complete presence.",
    time: "2 min",
    completed: false,
    color: "from-amber-500/10 to-orange-500/5 border-amber-500/20"
  },
  {
    id: "sigh-breathing",
    name: "Physiological Sighs",
    type: "Endorphin",
    description: "A double sharp inhale through your nose followed by a heavy slow release blow from the lips. Instantly slows high pacing cardiac alarms.",
    time: "2 min",
    completed: false,
    color: "from-indigo-500/10 to-blue-500/5 border-indigo-500/20"
  }
];

// Poetic MBTI mappings
const MBTI_COGNITIVE_BLUEPRINTS: Record<string, { title: string; desc: string; strengths: string }> = {
  "INFP": {
    title: "The Attuned Dreamer",
    desc: "A deeply imaginative soul who experiences emotional cycles with poetic intensity. Guided by a core sense of absolute authenticity, you process stressors internally and value quiet, safe reflection over clinical systems.",
    strengths: "Extraordinary emotional depth, deep creative capacity, sensitive intuition."
  },
  "INFJ": {
    title: "The Compassionate Sage",
    desc: "A rare and insightful systems investigator. You possess a complex, rich vocabulary for internal feelings, balancing quiet self-reliance with a deep sensory awareness of other souls' hidden struggles.",
    strengths: "Subtle holistic vision, empathetic counsel, resolute resilience."
  },
  "ENFP": {
    title: "The Vibrant Synthesizer",
    desc: "An energetic spark of boundless options. Under heavy tension, your biological system defaults to hyper-connecting ideas, seeking novel inspiration, and sharing emotional currents dynamically with others.",
    strengths: "High conceptual flexibility, inspirational warmth, infectious hope."
  },
  "INTJ": {
    title: "The Quiet Architect",
    desc: "A structured, self-governing intelligence. Your mind digests emotional distress as functional friction to be understood, analyzed, and reframed using crisp structural models.",
    strengths: "Rigorous clarity, structured self-regulation, strategic vision."
  },
  "Default": {
    title: "The Kind Traveler",
    desc: "A thoughtful, self-examining human exploring their internal landscape. You balance internal processing with relational warmth, seeking steady, quiet spaces to grow.",
    strengths: "Patient self-awareness, responsive empathy, quiet adaptability."
  }
};

// Poetic Attachment style mappings
const ATTACHMENT_COGNITIVE_BLUEPRINTS: Record<string, { title: string; desc: string; coreNeed: string }> = {
  "Anxious": {
    title: "The Vulnerable Connector",
    desc: "You prioritize relationships above all and hold a highly active radar for gaps in response. Relational uncertainty triggers a visceral 'danger alert' in your nervous system, requiring steady, poetic reassuring warmth to de-escalate.",
    coreNeed: "Reaffirming presence, slow steady word pacing, absolute consistency."
  },
  "Avoidant": {
    title: "The Self-Reliant Anchor",
    desc: "Under high emotional load, your system automatically retreats to an internal sanctuary. You prefer to untangle knots alone before talking, feeling that requests for disclosure are pressures on your core autonomy.",
    coreNeed: "Full physical space, non-demanding listening, quiet self-regulation gateways."
  },
  "Secure": {
    title: "The Harmonious Explorer",
    desc: "You balance closeness and isolation easily. You trust that short-term silences are safe pauses, not hidden rejections, allowing you to ask for comfort or offer structured help with clear mental equilibrium.",
    coreNeed: "Constructive dialog, healthy boundaries, shared interactive reflection."
  },
  "Fearful-Avoidant": {
    title: "The Hesitant Seeker",
    desc: "Your heart deeply craves authentic connection, yet closeness activates an automatic protective barrier. This continuous push-pull between desiring touch and fearing compromise is an exhaustion pattern that requires profound patience.",
    coreNeed: "Slow step-by-step trust building, somatic calming, zero pressure."
  }
};

/**
 * ----------------------------------------------------------------------------
 * CLINICAL COGNITIVE BEHAVIORAL THERAPY (CBT) COGNITIVE DISTORTIONS ENGINE
 * ----------------------------------------------------------------------------
 * A robust database of common automatic filter distortions, with descriptions
 * and tailored therapeutic prompts for effective reframing.
 */
export interface DistortionDefinition {
  key: string;
  emoji: string;
  title: string;
  desc: string;
  reframePrompt: string;
}

export const COGNITIVE_DISTORTIONS: DistortionDefinition[] = [
  {
    key: "mind_reading",
    emoji: "🔮",
    title: "Mind Reading",
    desc: "Assuming you know what other people are thinking or feeling, particularly that they are judging or disliking you, without cold concrete evidence.",
    reframePrompt: "What is an objective, fact-based alternative explanation for their action or delay?"
  },
  {
    key: "all_or_nothing",
    emoji: "⚖️",
    title: "All-or-Nothing Thinking",
    desc: "Viewing situations in black-and-white categories. If a situation falls short of perfect, you perceive it as a utter failure with no middle path.",
    reframePrompt: "Can you identify the realistic gray area, or a partial success in this scenario?"
  },
  {
    key: "catastrophizing",
    emoji: "💥",
    title: "Catastrophizing",
    desc: "Blowing details out of proportion, predicting the absolute worst-case outcome, and assuming you won't be able to survive or cope with it.",
    reframePrompt: "If the worst-case happens, what is your realistic coping step? What is the most likely, realistic middle outcome?"
  },
  {
    key: "emotional_reasoning",
    emoji: "🌊",
    title: "Emotional Reasoning",
    desc: "Believing that because you feel a negative emotion, it must reflect the exact objective reality of your situation ('I feel guilty, so I must be awful').",
    reframePrompt: "What are the physical, verifiable facts separate from your high-intensity feelings?"
  },
  {
    key: "personalization",
    emoji: "👤",
    title: "Personalization",
    desc: "Holding yourself personally responsible or to blame for an external event or another person's mood that isn't under your full control.",
    reframePrompt: "What external calendar constraints, loads, or other factors contributed to this outcome?"
  },
  {
    key: "overgeneralization",
    emoji: "🕸️",
    title: "Overgeneralization",
    desc: "Viewing a single unfavorable incident as a continuous, endless pattern of defeat, using wide statements like 'always', 'never', 'nobody'.",
    reframePrompt: "What are specific times or facts in your past where this rule did not apply?"
  }
];

/**
 * Heuristically parses an unfiltered automatic thought to recommend a likely cognitive distortion.
 * Used to power the live, self-diagnosing CBT compass instantly as the user types.
 */
export const analyzeCognitiveDistortion = (text: string): DistortionDefinition => {
  if (!text) return COGNITIVE_DISTORTIONS[0];
  const norm = text.toLowerCase();
  
  if (norm.includes("never") || norm.includes("always") || norm.includes("nobody") || norm.includes("everyone") || norm.includes("nothing")) {
    return COGNITIVE_DISTORTIONS[5]; // Overgeneralization
  }
  if (norm.includes("fail") || norm.includes("worst") || norm.includes("disaster") || norm.includes("doom") || norm.includes("ruin") || norm.includes("perfect")) {
    if (norm.includes("worst") || norm.includes("disaster") || norm.includes("die") || norm.includes("cope")) {
      return COGNITIVE_DISTORTIONS[2]; // Catastrophizing
    }
    return COGNITIVE_DISTORTIONS[1]; // All-or-Nothing
  }
  if (norm.includes("think") || norm.includes("knows") || norm.includes("realize") || norm.includes("judg") || norm.includes("hate") || norm.includes("angry") || norm.includes("disappointed")) {
    return COGNITIVE_DISTORTIONS[0]; // Mind Reading
  }
  if (norm.includes("feel") || norm.includes("guts") || norm.includes("vibe") || norm.includes("sensing") || norm.includes("feel like")) {
    return COGNITIVE_DISTORTIONS[3]; // Emotional Reasoning
  }
  if (norm.includes("my fault") || norm.includes("blame") || norm.includes("because of me") || norm.includes("i ruined")) {
    return COGNITIVE_DISTORTIONS[4]; // Personalization
  }

  return COGNITIVE_DISTORTIONS[0]; // Default Mind Reading
};

/**
 * Cleanly formats dynamic text by parsing inline bold markers (**) and italics (*)
 * into clean, responsive HTML tags, and completely removing literal asterisk characters.
 * This guarantees no raw asterisks (*) are visible anywhere in user-facing elements.
 */
const renderCleanMessageText = (text: string): React.ReactNode[] | string => {
  if (!text) return "";
  
  const boldParts = text.split("**");
  return boldParts.map((boldPart, bIdx) => {
    const isBold = bIdx % 2 === 1;
    const italicParts = boldPart.split("*");
    const formattedSegment = italicParts.map((italicPart, iIdx) => {
      const isItalic = iIdx % 2 === 1;
      
      if (isItalic) {
        return (
          <em key={`em-${bIdx}-${iIdx}`} className="italic font-normal text-slate-200">
            {italicPart}
          </em>
        );
      }
      return italicPart;
    });

    if (isBold) {
      return (
        <strong key={`strong-${bIdx}`} className="font-semibold text-white">
          {formattedSegment}
        </strong>
      );
    }
    return <span key={`span-${bIdx}`}>{formattedSegment}</span>;
  });
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "chat" | "journal" | "garden" | "records" | "about">("home");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  
  // DUAL MODE STATE (Controlled by the instant switcher for Hackathon Judges)
  const [isReturningUser, setIsReturningUser] = useState<boolean>(true);
  const [hasNewUserFinishedOnboarding, setHasNewUserFinishedOnboarding] = useState<boolean>(true);
  
  // Core Profile and Records Persistence State (Synchronized Dynamically with Local Storage)
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("mann-profile");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialArjunProfile;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem("mann-messages");
      if (saved && JSON.parse(saved).length > 0) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: "welcome-arjun",
        role: "model",
        content: "Welcome back, Arjun. The garden is breathing quietly under overcast skies.\n\nYesterday seemed difficult. What would help water your roots today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputText, setInputText] = useState<string>("Share what is warming or compressing your mind...");
  
  // Quick pre-clear the input text field when editing
  useEffect(() => {
    if (inputText === "Share what is warming or compressing your mind...") {
      setInputText("");
    }
  }, []);

  const [loading, setLoading] = useState<boolean>(false);

  const [thoughtRecords, setThoughtRecords] = useState<ThoughtMirrorRecord[]>(() => {
    try {
      const saved = localStorage.getItem("mann-thoughts");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: "historical-1",
        pattern: "All-or-Nothing Checking",
        original: "If my colleague doesn't reply to my slack update, they must think my workspace draft is ridiculous.",
        alternative: "They are balancing their own load today. Gaps in replies reflect their calendar constraints, not my core talent.",
        timestamp: "2 days ago"
      },
      {
        id: "historical-2",
        pattern: "Mind Reading bias",
        original: "Priya hasn't messaged back. She's likely tired of my emotional requests and pulling away.",
        alternative: "Priya handles her active parenting duties. Her delay is an ordinary timeout, not a deliberate relational retreat.",
        timestamp: "Yesterday"
      }
    ];
  });

  const [rituals, setRituals] = useState<DoseRitual[]>(() => {
    try {
      const saved = localStorage.getItem("mann-rituals");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultRituals;
  });

  // State managers to power the interactive CBT Categorizer & Tactile Seeds Toast
  const [selectedDistortionKey, setSelectedDistortionKey] = useState<string>("mind_reading");
  const [showSeedToast, setShowSeedToast] = useState<boolean>(false);
  const [seedToastMessage, setSeedToastMessage] = useState<string>("");
  const [currentPromptCategory, setCurrentPromptCategory] = useState<"grounding" | "cognitive" | "somatic" | "garden">("grounding");

  const [sosPanelOpen, setSosPanelOpen] = useState<boolean>(false);

  // Synchronize state with standard local storage securely
  useEffect(() => {
    try {
      localStorage.setItem("mann-profile", JSON.stringify(profile));
    } catch (e) {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem("mann-messages", JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem("mann-thoughts", JSON.stringify(thoughtRecords));
    } catch (e) {}
  }, [thoughtRecords]);

  useEffect(() => {
    try {
      localStorage.setItem("mann-rituals", JSON.stringify(rituals));
    } catch (e) {}
  }, [rituals]);

  // Active micro-dose Dopamine Challenge game state
  const [activeDopamineChore, setActiveDopamineChore] = useState<string | null>(null);
  const [dopamineTimer, setDopamineTimer] = useState<number>(0);
  const [dopamineChoreCompleted, setDopamineChoreCompleted] = useState<boolean>(false);
  let timerRef = useRef<NodeJS.Timeout | null>(null);

  // Active breathwork simulator states
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale" | "idle">("idle");
  const [breathCounter, setBreathCounter] = useState<number>(0);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);
  const [breathLogOutput, setBreathLogOutput] = useState<string>("");
  let breathInterval = useRef<NodeJS.Timeout | null>(null);

  // Guided Journal Stepper States (never a blank page!)
  const [journalStep, setJournalStep] = useState<number>(1);
  const [journalWeightTheme, setJournalWeightTheme] = useState<string>("");
  const [journalRawThought, setJournalRawThought] = useState<string>("");
  const [journalReframedThought, setJournalReframedThought] = useState<string>("");
  const [journalSuccessNotification, setJournalSuccessNotification] = useState<boolean>(false);

  // Onboarding Step State (Mode A)
  const [onboardStep, setOnboardStep] = useState<"welcome" | "needs" | "coping" | "eb" | "ns" | "tf" | "jp" | "attachment" | "reveal">("welcome");
  
  // Custom onboarding selections temporary holders
  const [onboardName, setOnboardName] = useState("");
  const [onboardFocus, setOnboardFocus] = useState("");
  const [onboardCoping, setOnboardCoping] = useState("");
  const [onboardDimE, setOnboardDimE] = useState<"E" | "I">("I");
  const [onboardDimN, setOnboardDimN] = useState<"N" | "S">("N");
  const [onboardDimT, setOnboardDimT] = useState<"T" | "F">("F");
  const [onboardDimJ, setOnboardDimJ] = useState<"J" | "P">("P");
  const [onboardAttachmentVal, setOnboardAttachmentVal] = useState<"Secure" | "Anxious" | "Avoidant" | "Fearful-Avoidant">("Anxious");

  // Redesigned feeling investigator state
  const [activeFeeling, setActiveFeeling] = useState<string | null>(null);
  const [activeFeelingDestination, setActiveFeelingDestination] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Handle Switching between Onboarding Wizard and Arjun Presets instantly 
  const handleToggleDemoMode = (mode: "onboard" | "arjun") => {
    setActiveFeeling(null);
    setActiveFeelingDestination(null);
    if (mode === "onboard") {
      setIsReturningUser(false);
      setHasNewUserFinishedOnboarding(false);
      setOnboardStep("welcome");
      setOnboardName("");
      setProfile(initialNewUserProfile);
      setMessages([]);
      setThoughtRecords([]);
      setRituals(defaultRituals.map(r => ({ ...r, completed: false })));
      setActiveTab("home");
    } else {
      setIsReturningUser(true);
      setHasNewUserFinishedOnboarding(true);
      setProfile(initialArjunProfile);
      setThoughtRecords([
        {
          id: "hist-1",
          pattern: "All-or-Nothing Checking",
          original: "If my colleague doesn't reply to my slack update, they must think my workspace draft is ridiculous.",
          alternative: "They are balancing their own load today. Gaps in replies reflect their calendar constraints, not my core talent.",
          timestamp: "2 days ago"
        }
      ]);
      setMessages([
        {
          id: "welcome-arjun",
          role: "model",
          content: "Welcome back, Arjun. The garden is breathing quietly under overcast skies.\n\nYesterday seemed difficult. What would help water your roots today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setRituals(defaultRituals.map((r, i) => i === 0 ? { ...r, completed: true } : r));
      setActiveTab("home");
    }
  };

  // Safe client-side message parsing to identify Tier 3 warnings and CBT updates
  const parseSpecialResponses = (text?: string) => {
    if (!text) return;
    const lowerText = text.toLowerCase();
    if (text.includes("SOS_TRIGGERED:") || text.includes("SOS Alert Sent") || lowerText.includes("sos alert sent") || lowerText.includes("crisis")) {
      setSosPanelOpen(true);
      setProfile(prev => ({ ...prev, gardenState: MoodPetal.DARK }));
    }
  };

  // Full-stack API Connector with reliable mock biological fallback
  const triggerCompanionResponse = async (currentMessages: ChatMessage[]) => {
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: currentMessages,
          profile,
          mode: isReturningUser ? "returning" : "new"
        })
      });

      if (response.ok) {
        const data = await response.json();
        const modelReply = data?.text || "I am right here with you. Tell me what is sitting heaviest in your thoughts.";
        const modelMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: "model",
          content: modelReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, modelMsg]);
        parseSpecialResponses(modelReply);
      } else {
        throw new Error("HTTP " + response.status);
      }
    } catch (err) {
      console.warn("API offline or blocked, launching deep psychological local fallback:", err);
      // Fallback matching response metrics
      setTimeout(() => {
        const lastMsg = currentMessages[currentMessages.length - 1];
        const lastContent = lastMsg ? lastMsg.content : "";
        const fallbackText = getClientFallback(lastContent);
        const modelMsg: ChatMessage = {
          id: `model-fallback-${Date.now()}`,
          role: "model",
          content: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, modelMsg]);
        parseSpecialResponses(fallbackText);
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  // Local therapeutic copy generator for offline scenarios
  const getClientFallback = (text: string): string => {
    const norm = text.toLowerCase().trim();
    if (norm.includes("suicide") || norm.includes("die") || norm.includes("self-harm") || norm.includes("disappear") || norm.includes("hurt") || norm.includes("end my life")) {
      return `I hear how heavy this feels. Please know you matter, and you don't have to carry this alone.\n\n🚨 **SOS Alert Sent** 🚨\nMann is dispatching a protective check-in alert to your emergency contact, **Priya (Sister)**, via WhatsApp now. She's being alerted that you need warm support.\n\nHere are professional human channels ready to speak right now:\n- **iCall India:** 9152987821\n- **Vandrevala Foundation:** 1860-2662-345 (24/7)\n- **National Helpline:** 112\n\nI am keeping this space entirely safe for you. Breathe slowly. I am not going anywhere.\n\n[SOS_TRIGGERED: TRUE]`;
    }
    if (norm.includes("vent") || norm.includes("out of my head") || norm.includes("heavy")) {
      return `I'm opening a blank holding ledger. Write every single unedited word here. Don't worry about grammar, or making sense, or being fair. Just let the ink pour out of your head onto this screen. What's the very first heavy thought that comes up?`;
    }
    if (norm.includes("plan") || norm.includes("overwhelmed")) {
      return `When every demand collides at once, our cognitive load spikes into a state of frozen alarm. Let's make an immediate structural boundary. What is *one single task* on your horizon that we can look at, and strip everything else away for the next hour?`;
    }
    if (norm.includes("breathing") || norm.includes("calm")) {
      return `Under anxiety, your heart's emergency loop fires. Let's reset it somatic-style. Try breathing immediately: double sharp inhale, followed by a long, slow whistle blow. It tells your vagal nerve that you are completely safe. Let's do it three times.`;
    }
    if (norm.includes("understand") || norm.includes("why")) {
      return `Your INFP systems default to deep introspection. Combined with an anxious attachment pattern, any quietness from other people can feel like a silent verdict on your worth. This is a cognitive lens, not actual reality. Let's look at one event that triggered this anxiety today.`;
    }

    return `It takes courage to say 'I need space to sit with this.' As an INFP, you carry emotional weight deeply. What is the quietest thought trying to be heard in your mind right now?`;
  };

  const handleSendMessageOf = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInputText("");
    
    // Smooth transition straight to conversational workspace
    setActiveTab("chat");
    triggerCompanionResponse(updated);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    handleSendMessageOf(inputText);
  };

  // Complete Onboarding Stage & Synthesize MBTI + Attachment Style
  const handleFinalizeOnboarding = () => {
    const calculatedMbti = `${onboardDimE}${onboardDimN}${onboardDimT}${onboardDimJ}`;
    const finalizedProfile: UserProfile = {
      name: onboardName || "Kind Companion",
      mbti: calculatedMbti,
      attachmentStyle: onboardAttachmentVal,
      gardenState: MoodPetal.GROWING,
      streak: 1,
      recentJournalTheme: onboardFocus ? `Nervous system compression from ${onboardFocus.toLowerCase()}` : "Beginning a new grounding journey",
      lastRitualCompleted: "Calibration Assessment Finished",
      emergencyContactName: "Priya (Sister)",
      emergencyContactPhone: "+91-9876543210",
      doseBalance: {
        serotonin: "Balanced",
        dopamine: "Steady",
        oxytocin: "Restoring"
      }
    };
    setProfile(finalizedProfile);
    setHasNewUserFinishedOnboarding(true);
    setMessages([
      {
        id: "onboard-complete-init",
        role: "model",
        content: `Welcome to your calm sanctuary, ${finalizedProfile.name}.\n\nYour garden climate is currently set to **🌿 Growing**. As a **${finalizedProfile.mbti}** with a **${finalizedProfile.attachmentStyle}** attachment style, we have aligned our cognitive pacing to support you under tension. It is safe to rest here.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setActiveTab("home");
  };

  // Triggering the dopamine interactive challenge
  const handleStartDopamineChore = (chore: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveDopamineChore(chore);
    setDopamineTimer(60);
    setDopamineChoreCompleted(false);
    timerRef.current = setInterval(() => {
      setDopamineTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleFinishDopamineChore = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDopamineChoreCompleted(true);
    setActiveDopamineChore(null);
    setProfile(prev => ({
      ...prev,
      doseBalance: { ...prev.doseBalance, dopamine: "Surging & Restored" },
      streak: prev.streak + 1
    }));
    
    // Add positive feedback
    setThoughtRecords(prev => [
      {
        id: `dopamine-record-${Date.now()}`,
        pattern: "Behavioral Activation (Dopamine Booster)",
        original: "I felt frozen under heavy chores and feared starting.",
        alternative: "I chose to wash my mug or arrange one book in 60 seconds. Doing it built immediate momentum.",
        timestamp: "Just now"
      },
      ...prev
    ]);
  };

  // Interactive Breathwork Simulator Engine (Active pacing)
  const handleStartBreathingCycle = (type: "sigh" | "478") => {
    if (breathInterval.current) clearInterval(breathInterval.current);
    setCyclesCompleted(0);
    setBreathPhase("inhale");
    setBreathCounter(type === "sigh" ? 4 : 4);
    setBreathLogOutput("Inhale deeply through your nose...");
    
    let cyclePhase: "inhale" | "hold" | "exhale" = "inhale";
    let count = type === "sigh" ? 4 : 4;

    breathInterval.current = setInterval(() => {
      count--;
      setBreathCounter(count);

      if (count <= 0) {
        if (cyclePhase === "inhale") {
          cyclePhase = "hold";
          count = type === "sigh" ? 2 : 7;
          setBreathPhase("hold");
          setBreathLogOutput(type === "sigh" ? "Take a second quick expansion breath..." : "Hold gently, let your system absorb the stillness...");
        } else if (cyclePhase === "hold") {
          cyclePhase = "exhale";
          count = type === "sigh" ? 6 : 8;
          setBreathPhase("exhale");
          setBreathLogOutput("Exhale slowly. Un-clench your shoulders entirely...");
        } else {
          // One full cycle completed!
          cyclePhase = "inhale";
          count = 4;
          setBreathPhase("inhale");
          setBreathLogOutput("Inhale again deeply, filling your belly...");
          setCyclesCompleted(prev => {
            const next = prev + 1;
            if (next >= 3) {
              clearInterval(breathInterval.current!);
              setBreathPhase("idle");
              setBreathLogOutput("Wonderful. Your parasympathetic nerve has registered safety. Your garden soil has absorbed this moisture.");
              setProfile(p => ({
                ...p,
                streak: p.streak + 1,
                doseBalance: { ...p.doseBalance, serotonin: "Replenished & Calm" }
              }));
              return 3;
            }
            return next;
          });
        }
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (breathInterval.current) clearInterval(breathInterval.current);
    };
  }, []);

  // CBT reframer submission details with dynamic distortion category resolution
  const handleSaveThoughtReframe = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!journalRawThought.trim() || !journalReframedThought.trim()) return;

    const matchedDistortion = COGNITIVE_DISTORTIONS.find(d => d.key === selectedDistortionKey);
    const patternTitle = matchedDistortion 
      ? `🔮 ${matchedDistortion.title}` 
      : "⚖️ Balanced Reframe";

    const newRecord: ThoughtMirrorRecord = {
      id: `cbt-${Date.now()}`,
      pattern: patternTitle,
      original: journalRawThought.trim(),
      alternative: journalReframedThought.trim(),
      timestamp: "Just now"
    };

    setThoughtRecords(prev => [newRecord, ...prev]);
    setProfile(p => ({
      ...p,
      recentJournalTheme: `Reframed ${patternTitle.toLowerCase()} around: ${journalWeightTheme.toLowerCase()}`,
      streak: p.streak + 1
    }));
    setJournalSuccessNotification(true);
    setTimeout(() => {
      setJournalSuccessNotification(false);
      setJournalStep(1);
      setJournalRawThought("");
      setJournalReframedThought("");
    }, 4500);
  };

  /**
   * Copy helper that links Whispers Chat directly to The Untangler.
   * Auto-analyzes the text & populates the Wizard!
   */
  const handleCopyMessageToCbt = (text: string) => {
    // Strip trailing or bracket trigger variables
    const cleanText = text
      .replace(/\[\w+.*?\]/g, "")
      .replace(/[\*\r\n]/g, " ")
      .trim();

    setJournalRawThought(cleanText);
    
    // Seed standard initial compassionate helper
    setJournalReframedThought("This is a high-intensity stress alarm talking. I notice this pattern, and I choose to pace myself kindly.");
    setJournalWeightTheme("Linguistic Chat Flow Reflection");
    
    // Automatically perform the structural diagnostic pattern analysis
    const recommended = analyzeCognitiveDistortion(cleanText);
    setSelectedDistortionKey(recommended.key);
    
    // Take the user straight to Step 3 of the diagnostic analyzer!
    setJournalStep(3);
    setActiveTab("journal");

    setSeedToastMessage("🔮 Copied raw tension text directly to The Untangler CBT Step 3!");
    setShowSeedToast(true);
    setTimeout(() => setShowSeedToast(false), 3000);
  };

  /**
   * Pins comforting advice as a direct permanent entry note in What We Understand Wisdom Ledger!
   */
  const handleMirrorAsInsight = (text: string) => {
    const cleanText = text.replace(/\[\w+.*?\]/g, "").trim();
    const newRecord: ThoughtMirrorRecord = {
      id: `insight-${Date.now()}`,
      pattern: "💡 Comfort Insights",
      original: "Grounded guidance received in Whispers workspace",
      alternative: cleanText,
      timestamp: "Just now"
    };
    setThoughtRecords(prev => [newRecord, ...prev]);
    setSeedToastMessage("🌿 Synced this comforting companion insight to your Wisdom Ledger!");
    setShowSeedToast(true);
    setTimeout(() => setShowSeedToast(false), 4000);
  };

  // Helper text for current active affirmation
  const activeAffirmation = isReturningUser 
    ? "Arjun, when the skies are heavy with responsibility, remember that your worth resides in your unique presence, not your endless productivity. You are allowed to take up space simply by breathing."
    : (profile.name 
        ? `${profile.name}, cloudy skies are just clouds resting on their continuous journey. Your quiet stillness is not a failure of purpose, but a recovery of clarity.`
        : "Dear traveler, there is no active expectation for you to solve, fix, or hold together anything tonight. Allow yourself to rest.");

  // Helper to render the beautiful chat experience (both on Home dashboard and dedicated Whispers Chat tab)
  const renderWhispersChat = (isFullscreen: boolean) => {
    return (
      <div id="whispers-chat-core-panel" className={`${
        isFullscreen 
          ? "flex-1 w-full max-w-4xl mx-auto flex flex-col space-y-6" 
          : "lg:col-span-7 flex flex-col space-y-6"
      } bg-slate-950/30 border border-white/5 rounded-3xl p-5 md:p-6 shadow-2xl relative`}>
        
        {/* Compact personal header with mood trigger */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
          <div>
            <span className="block text-[8px] uppercase font-mono tracking-widest text-[#D4A373] font-black">
              Somatic Conversational Core
            </span>
            <h2 className="text-xl font-serif text-slate-100 font-light mt-0.5">
              "I'm here, {profile.name}."
            </h2>
          </div>
          
          {/* Quiet Mood / Climate Indicators */}
          <div className="flex gap-1" id="chat-climate-indicators">
            {[
              { key: MoodPetal.BLOOMING, emoji: "🌸", name: "Blooming" },
              { key: MoodPetal.GROWING, emoji: "🌿", name: "Growing" },
              { key: MoodPetal.CLOUDY, emoji: "🌧", name: "Cloudy" },
              { key: MoodPetal.WITHERING, emoji: "🍂", name: "Withering" },
              { key: MoodPetal.DARK, emoji: "🌑", name: "Resting" }
            ].map(climate => {
              const isActive = profile.gardenState === climate.key;
              return (
                <button
                  key={climate.key}
                  id={`climate-${climate.key}`}
                  onClick={() => {
                    setProfile(p => ({ ...p, gardenState: climate.key }));
                    setBreathLogOutput(`Botanical alignment shifting dynamically into ${climate.name} state...`);
                  }}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all border cursor-pointer ${
                    isActive 
                      ? 'bg-[#D4A373]/15 border-[#D4A373]/55 scale-105' 
                      : 'bg-white/[0.01] border-white/5 hover:bg-white/5'
                  }`}
                  title={`Set internal climate to ${climate.name}`}
                >
                  {climate.emoji}
                </button>
              );
            })}
          </div>
        </div>

        {/* Calibrated Sparkles Affirmation */}
        <div className="p-4 bg-[#D4A373]/5 border border-[#D4A373]/15 rounded-2xl relative overflow-hidden select-text">
          <span className="block text-[8px] uppercase tracking-widest font-mono text-[#D4A373] font-bold mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Linguistic Calibration
          </span>
          <p className="text-[11px] text-[#E0D8D0] font-light leading-relaxed italic font-serif">
            "{activeAffirmation}"
          </p>
        </div>

        {/* Chat Content Panel Container */}
        <div className="flex flex-col border border-white/5 bg-slate-950/60 rounded-2xl overflow-hidden min-h-[480px]" id="chat-messages-container">
          {/* Active header */}
          <div className="px-4 py-3 border-b border-white/5 bg-slate-950/90 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono tracking-wider uppercase text-slate-400">Listening (Secure Space)</span>
            </div>
            <button
              type="button"
              id="clear-chat-stream-btn"
              onClick={() => {
                setMessages([]);
                setMessages([
                  {
                    id: `welcome-${Date.now()}`,
                    role: "model",
                    content: `Welcome, ${profile.name || "traveller"}. Your inner environment remains ${profile.gardenState}. I'm right here with you. What is sitting heaviest in your thoughts today?`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]);
              }}
              className="p-1 px-2.5 rounded bg-white/5 hover:bg-white/10 text-[9px] font-mono text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Clear Stream
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[420px] custom-scrollbar select-text">
            {messages.length === 0 ? (
              <div className="text-center py-10 space-y-2 max-w-xs mx-auto animate-fadeIn">
                <span className="text-xl">💬</span>
                <p className="text-[11px] text-slate-400 font-light italic">
                  "Yesterday seemed difficult, Arjun. How is your heart carrying into today?"
                </p>
              </div>
            ) : (
              messages.map((item, idx) => {
                const isModel = item.role === "model";
                
                const strippedContent = item.content
                  .replace(/\[LAUNCH_CBT\]/g, "")
                  .replace(/\[LAUNCH_JOURNAL\]/g, "")
                  .replace(/\[LAUNCH_BREATHING\]/g, "")
                  .replace(/\[LAUNCH_DOPAMINE\]/g, "")
                  .replace(/\[MBTI_INSIGHT\]/g, "")
                  .replace(/\[ATTACHMENT_INSIGHT\]/g, "")
                  .trim();

                const isCbtTriggered = item.content.includes("[LAUNCH_CBT]");
                const isJournalTriggered = item.content.includes("[LAUNCH_JOURNAL]");
                const isBreathingTriggered = item.content.includes("[LAUNCH_BREATHING]");
                const isDopamineTriggered = item.content.includes("[LAUNCH_DOPAMINE]");
                const isMbtiInsight = item.content.includes("[MBTI_INSIGHT]");
                const isAttachmentInsight = item.content.includes("[ATTACHMENT_INSIGHT]");

                return (
                  <div 
                    key={item.id || idx} 
                    id={`chat-message-${item.id || idx}`}
                    className={`flex gap-3 max-w-2xl select-text animate-slideUp ${
                      isModel ? "" : "ml-auto flex-row-reverse"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                      isModel 
                        ? "bg-[#D4A373]/15 text-[#D4A373]" 
                        : "bg-slate-800 text-slate-300"
                    }`}>
                      {isModel ? "मन" : <User className="w-3.5 h-3.5" />}
                    </div>
                    
                    <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
                      isModel 
                        ? "bg-slate-900/40 text-slate-200 border border-white/5" 
                        : "bg-[#D4A373]/10 border border-[#D4A373]/15 text-[#E0D8D0]"
                    }`}>
                      <div className="select-text font-light text-slate-300 leading-relaxed font-sans text-xs sm:text-sm">
                        {strippedContent.split('\n').map((line, lIdx) => {
                          if (line.includes("SOS Alert Sent")) {
                            const cleanLine = line.replace(/\*\//g, "").replace(/\*\*/g, "").replace(/\*/g, "");
                            return (
                              <div key={lIdx} className="p-3 my-2 bg-red-950/20 border border-red-500/30 rounded-xl text-red-300 flex items-center gap-2 text-xs animate-pulse font-semibold">
                                <span>🚨</span>
                                <span>{cleanLine}</span>
                              </div>
                            );
                          }
                          return (
                            <p key={lIdx} className="mb-2 select-text font-light text-slate-300 leading-relaxed">
                              {renderCleanMessageText(line)}
                            </p>
                          );
                        })}
                      </div>

                      {/* 1. INLINE CBT WIDGET */}
                      {isCbtTriggered && (
                        <div id="inline-cbt-thought-mirror" className="mt-4 p-4 bg-gradient-to-tr from-slate-950 to-slate-900 border border-[#D4A373]/20 rounded-2xl space-y-3 shadow-lg select-text">
                          <div className="flex items-center gap-2 border-b border-white/5 pb-1.5">
                            <span className="text-xs">⚖️</span>
                            <span className="text-[9px] uppercase font-mono tracking-widest font-extrabold text-[#D4A373]">Thought Untangler</span>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="text-[8px] uppercase font-mono text-slate-400 block mb-0.5">Raw automatic thought:</label>
                              <input 
                                type="text" 
                                value={journalRawThought || "I keep thinking everyone hates me."} 
                                onChange={(e) => setJournalRawThought(e.target.value)} 
                                className="w-full bg-slate-950 border border-white/5 rounded-xl px-2.5 py-1 text-xs text-slate-300 focus:outline-[#D4A373]/30"
                              />
                            </div>
                            <div className="p-2.5 bg-[#D4A373]/5 border border-[#D4A373]/25 rounded-xl">
                              <span className="text-[8px] font-mono uppercase text-amber-500 block">Cognitive distortion: Mind-Reading</span>
                              <p className="text-[9px] text-slate-400 font-light leading-snug">When we lack immediate replies, our protective alarms tend to generate highly critical assumptions.</p>
                            </div>
                            <div>
                              <label className="text-[8px] uppercase font-mono text-slate-400 block mb-0.5">Your Compassionate Reframe:</label>
                              <textarea 
                                rows={2}
                                required
                                value={journalReframedThought} 
                                placeholder="What is a more loving, fact-based view?"
                                onChange={(e) => setJournalReframedThought(e.target.value)} 
                                className="w-full bg-slate-950 border border-white/5 rounded-xl p-2 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <button 
                              type="button" 
                              id="settle-reframe-record-btn"
                              onClick={() => {
                                setThoughtRecords(prev => [
                                  {
                                    id: "inline-" + Date.now(),
                                    pattern: "Mind-Reading loop",
                                    original: journalRawThought || "Everyone hates me.",
                                    alternative: journalReframedThought || "They are balancing their own workload; schedules do not dictate my worth.",
                                    timestamp: "Just now"
                                  },
                                  ...prev
                                ]);
                                setProfile(p => ({ ...p, streak: p.streak + 1 }));
                                setJournalSuccessNotification(true);
                                setJournalRawThought("");
                                setJournalReframedThought("");
                                setTimeout(() => setJournalSuccessNotification(false), 3500);
                              }}
                              className="w-full py-1.5 bg-[#D4A373] text-slate-950 text-[10px] font-mono font-black rounded-lg cursor-pointer text-center hover:bg-[#c59262] transition-all"
                            >
                              ✓ Settle Reframe Record
                            </button>
                            {journalSuccessNotification && <span className="text-[9px] font-mono text-emerald-400 block text-center mt-1">✓ Mirrored into clinical garden biome!</span>}
                          </div>
                        </div>
                      )}

                      {/* 2. INLINE JOURNAL */}
                      {isJournalTriggered && (
                        <div id="inline-guided-journal" className="mt-4 p-4 bg-slate-950 border border-white/5 rounded-2xl space-y-3">
                          {journalStep === 1 ? (
                            <div className="space-y-2">
                              <p className="text-xs text-slate-350 italic">"Would writing help?"</p>
                              <div className="flex gap-2">
                                <button type="button" onClick={() => setJournalStep(2)} className="px-3 py-1 bg-[#D4A373] text-slate-950 text-[9px] font-mono font-black rounded-md cursor-pointer">Yes, help me write</button>
                                <button type="button" onClick={() => handleSendMessageOf("Let's keep talking.")} className="px-3 py-1 bg-white/5 text-slate-400 text-[9px] font-mono rounded-md cursor-pointer">Keep talking</button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3 text-left">
                              <p className="text-[8px] uppercase font-mono tracking-widest text-[#D4A373]">GUIDED WRITING STEPPER: PAGE {journalStep - 1} OF 3</p>
                              {journalStep === 2 && (
                                <div className="space-y-2">
                                  <label className="text-[10px] text-slate-300">Central focus theme of worry:</label>
                                  <input type="text" value={journalWeightTheme} onChange={(e) => setJournalWeightTheme(e.target.value)} placeholder="e.g. Work blocks / relation delay" className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"/>
                                  <button type="button" onClick={() => setJournalStep(3)} className="w-full py-1 bg-[#D4A373] text-slate-950 text-[9px] font-mono font-bold rounded-md cursor-pointer">Next Stage →</button>
                                </div>
                              )}
                              {journalStep === 3 && (
                                <div className="space-y-2">
                                  <label className="text-[10px] text-slate-300">Unfilteredautomatic raw thought loop:</label>
                                  <textarea value={journalRawThought} onChange={(e) => setJournalRawThought(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-xs text-slate-200 focus:outline-none" rows={2}/>
                                  <button type="button" onClick={() => setJournalStep(4)} className="w-full py-1 bg-[#D4A373] text-slate-950 text-[9px] font-mono font-bold rounded-md cursor-pointer">Continue to Reframe →</button>
                                </div>
                              )}
                              {journalStep === 4 && (
                                <div className="space-y-2">
                                  <label className="text-[10px] text-slate-300">Compassionate, loving reframe perspective:</label>
                                  <textarea value={journalReframedThought} onChange={(e) => setJournalReframedThought(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-xs text-slate-200 focus:outline-none" rows={2}/>
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      setThoughtRecords(prev => [
                                        { id: "inline-journal-"+Date.now(), pattern: "Guided Journal Entry", original: journalRawThought || "Unspecified worry", alternative: journalReframedThought || "Taking steady paces forward", timestamp: "Just now" },
                                        ...prev
                                      ]);
                                      setProfile(p => ({ ...p, streak: p.streak + 1 }));
                                      setJournalSuccessNotification(true);
                                      setJournalStep(1);
                                      setJournalRawThought("");
                                      setJournalReframedThought("");
                                      setTimeout(() => setJournalSuccessNotification(false), 3000);
                                    }}
                                    className="w-full py-1.5 bg-emerald-500 text-slate-950 text-[9px] font-mono font-bold rounded-md cursor-pointer"
                                  >
                                    ✓ Commit Journal Entry
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 3. BREATHING CENTERING */}
                      {isBreathingTriggered && (
                        <div id="inline-breathing-pacing" className="mt-4 p-4 bg-[#D4A373]/5 border border-indigo-500/20 rounded-2xl space-y-3">
                          <span className="text-[8px] font-mono uppercase bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full">Somatic Core Grounding</span>
                          <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-white/5">
                            <div className="relative w-12 h-12 rounded-full border border-indigo-500/30 bg-indigo-500/[0.02] flex items-center justify-center shrink-0">
                              {breathPhase !== 'idle' && (
                                <span className="absolute inset-0 rounded-full border border-indigo-500 animate-ping opacity-25 scale-110" />
                              )}
                              <span className="text-xs font-bold font-mono text-indigo-300">{breathCounter}s</span>
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <span className="text-[8px] font-mono text-indigo-400 uppercase block">{breathPhase === 'idle' ? 'IDLE' : `PHASE: ${breathPhase}`}</span>
                              <p className="text-[11px] text-slate-355 leading-snug truncate">{breathLogOutput || "Ready to stabilize hyper-paced chest alarm."}</p>
                              <p className="text-[9px] text-slate-500">{cyclesCompleted}/3 breaths calibrated</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleStartBreathingCycle("sigh")} className="flex-1 py-1 bg-indigo-950/40 text-indigo-300 text-[9px] font-mono border border-indigo-500/20 rounded-md cursor-pointer">💨 Double-Sigh</button>
                            <button type="button" onClick={() => handleStartBreathingCycle("478")} className="flex-1 py-1 bg-slate-900 text-slate-300 text-[9px] font-mono border border-white/5 rounded-md cursor-pointer">🧘 4-7-8 Centering</button>
                          </div>
                        </div>
                      )}

                      {/* 4. INLINE DOPAMINE */}
                      {isDopamineTriggered && (
                        <div id="inline-dopamine-spark" className="mt-4 p-4 bg-gradient-to-tr from-slate-950 to-slate-900 border border-amber-500/20 rounded-2xl space-y-3">
                          <span className="text-[8px] font-mono uppercase bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">Biological Action Spark</span>
                          {activeDopamineChore ? (
                            <div className="bg-slate-950 p-3 rounded-xl border border-[#D4A373]/20 space-y-2">
                              <div className="flex justify-between text-[8px] font-mono text-amber-500">
                                <span>Task spark timer</span>
                                <span>{dopamineTimer}s left</span>
                              </div>
                              <p className="text-[11px] text-slate-200 font-medium">Chore: <span className="font-semibold text-white">{activeDopamineChore}</span></p>
                              <button type="button" onClick={handleFinishDopamineChore} className="w-full py-1 bg-amber-500 text-slate-950 text-[9px] font-mono font-bold rounded-md cursor-pointer">Mark completed ✓</button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-[10px] text-slate-400 font-light">Choose one 60s microaction to release cognitive freeze:</p>
                              <div className="grid grid-cols-2 gap-1.5">
                                {[
                                  { label: "Align coffee mugs", emoji: "☕" },
                                  { label: "Arrange my shoes", emoji: "👟" },
                                  { label: "Sip hydration", emoji: "💧" },
                                  { label: "Wipe down display table", emoji: "🧼" }
                                ].map(chore => (
                                  <button
                                    key={chore.label}
                                    type="button"
                                    onClick={() => handleStartDopamineChore(chore.label)}
                                    className="p-1.5 bg-slate-950/60 border border-white/5 hover:border-[#D4A373]/20 rounded-lg text-left text-[9.5px] transition-all flex items-center gap-1.5 truncate cursor-pointer"
                                  >
                                    <span>{chore.emoji}</span>
                                    <span className="truncate text-slate-350">{chore.label}</span>
                                  </button>
                                ))}
                              </div>
                              {dopamineChoreCompleted && <p className="text-[9px] text-[#D4A373] block text-center font-mono">✓ Spark recorded! Dopamine levels replenishing.</p>}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 5. MBTI INSIGHT */}
                      {isMbtiInsight && (
                        <div id="inline-mbti-feedback" className="mt-4 p-4 bg-gradient-to-tr from-slate-950 to-slate-900 border border-[#D4A373]/20 rounded-2xl space-y-2">
                          <span className="text-[8px] font-mono uppercase bg-[#D4A373]/15 text-[#D4A373] px-2 py-0.5 rounded-full">Personality Insight</span>
                          <h4 className="text-xs font-serif font-bold text-slate-200">The {MBTI_COGNITIVE_BLUEPRINTS[profile.mbti]?.title || "Compassionate Observer"} — {profile.mbti} Mode</h4>
                          <p className="text-[11.5px] text-slate-400 leading-relaxed font-light">{MBTI_COGNITIVE_BLUEPRINTS[profile.mbti]?.desc || "Refining deep intuitive listening and internal value synchronization."}</p>
                          <div className="p-2 bg-white/[0.01] border border-white/5 rounded-lg">
                            <span className="text-[8px] font-mono uppercase text-[#D4A373] block">Cognitive strengths:</span>
                            <p className="text-[9.5px] text-slate-500 font-light leading-snug">{MBTI_COGNITIVE_BLUEPRINTS[profile.mbti]?.strengths || "Profoundly protective of their close circle, and a patient counselor."}</p>
                          </div>
                        </div>
                      )}

                      {/* 6. ATTACHMENT INSIGHT */}
                      {isAttachmentInsight && (
                        <div id="inline-attachment-feedback" className="mt-4 p-4 bg-gradient-to-tr from-slate-950 to-slate-900 border border-[#D4A373]/20 rounded-2xl space-y-2">
                          <span className="text-[8px] font-mono uppercase bg-[#D4A373]/15 text-[#D4A373] px-2 py-0.5 rounded-full">Attachment Pattern Insight</span>
                          <h4 className="text-xs font-serif font-bold text-slate-200">{ATTACHMENT_COGNITIVE_BLUEPRINTS[profile.attachmentStyle]?.title || "The Connected Watcher"} Alignment</h4>
                          <p className="text-[11.5px] text-slate-400 leading-relaxed font-light">{ATTACHMENT_COGNITIVE_BLUEPRINTS[profile.attachmentStyle]?.desc || "Clinical mapping of relational boundaries and communication delay patterns."}</p>
                          <div className="p-2 bg-white/[0.01] border border-white/5 rounded-lg">
                            <span className="text-[8px] font-mono uppercase text-[#D4A373] block">Relational safety demand:</span>
                            <p className="text-[9.5px] text-slate-500 font-light leading-snug">{ATTACHMENT_COGNITIVE_BLUEPRINTS[profile.attachmentStyle]?.coreNeed || "Gentle reassurance pacing and explicit, humble validation."}</p>
                          </div>
                        </div>
                      )}

                      {/* Hover action shortcuts for model responses */}
                      {isModel && (
                        <div className="flex flex-wrap gap-3 mt-2.5 pt-2 border-t border-white/[0.03]" id={`model-actions-${item.id || idx}`}>
                          <button
                            type="button"
                            onClick={() => handleCopyMessageToCbt(strippedContent)}
                            className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-[#D4A373] transition-colors cursor-pointer"
                            title="Untangle raw tension inside this advice"
                          >
                            <BookOpen className="w-3 h-3 text-[#D4A373]" />
                            <span>Untangle This</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleMirrorAsInsight(strippedContent)}
                            className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                            title="Pin this wisdom to What We Understand log"
                          >
                            <Heart className="w-3 h-3 text-emerald-400" />
                            <span>Pin Insight</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setProfile(p => ({ ...p, streak: p.streak + 1 }));
                              setSeedToastMessage("🌸 You successfully watered the soil! Streaks + 1");
                              setShowSeedToast(true);
                              setTimeout(() => setShowSeedToast(false), 3000);
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-sky-450 transition-colors cursor-pointer"
                            title="Water botanical garden biome"
                          >
                            <Sparkles className="w-3 h-3 text-sky-400" />
                            <span>Water Soil</span>
                          </button>
                        </div>
                      )}

                      <span className="text-[8px] font-mono text-slate-500 block text-right mt-1.5 uppercase select-none">
                        {item.timestamp || "Steady"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            
            {loading && (
              <div className="flex gap-3 max-w-lg select-none">
                <div className="w-7 h-7 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center animate-spin">
                  <RefreshCw className="w-3 h-3 text-slate-500" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/40 border border-white/5 text-[11px] text-slate-400 font-mono tracking-widest animate-pulse">
                  Mann is holding space, reflecting...
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Upgraded Categorized Suggested Prompts Terminal Control Center */}
          <div className="px-4 py-3.5 bg-slate-950/95 border-t border-white/5 space-y-3 select-none">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-[8.5px] uppercase font-mono tracking-widest text-[#D4A373] font-bold">Linguistic Comfort Pilot Guidance:</p>
              
              {/* Terminal Category Tabs */}
              <div className="flex gap-1 bg-white/[0.02] border border-white/5 rounded-lg p-0.5" id="suggested-prompts-tabs">
                {[
                  { id: "grounding", label: "🕊️ Grounding" },
                  { id: "cognitive", label: "🔮 Cognitive" },
                  { id: "somatic", label: "🌬️ Somatic" },
                  { id: "garden", label: "🌸 Garden" }
                ].map(category => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setCurrentPromptCategory(category.id as any)}
                    className={`px-2 py-0.5 rounded text-[8.5px] font-mono transition-colors cursor-pointer ${
                      currentPromptCategory === category.id 
                        ? "bg-[#D4A373]/15 text-[#D4A373] font-bold border border-[#D4A373]/25" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categorized Pill Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5" id="suggested-prompts-pills">
              {currentPromptCategory === "grounding" && [
                { label: "🕊️ Release Tension Step-by-Step", content: "I feel completely overwhelmed, help me step-by-step." },
                { label: "🌧️ Sit with Quiet Disconnection", content: "I feel deeply disconnected and lost. Speak with me poetics." },
                { label: "💭 Open Blank Ink Vent Ledger", content: "I need a private blank space to vent out heavy words unfiltered." }
              ].map(option => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleSendMessageOf(option.content)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/[0.01] hover:bg-[#D4A373]/10 border border-white/5 hover:border-[#D4A373]/25 text-[10px] text-left text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-between group"
                >
                  <span>{option.label}</span>
                  <span className="text-[8px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">Launch →</span>
                </button>
              ))}

              {currentPromptCategory === "cognitive" && [
                { label: "🔮 Analyze automatic thoughts", content: "I need support evaluating some negative thoughts." },
                { label: "⚖️ Deconstruct perfect standards", content: "I feel like I have to be absolutely perfect at work." },
                { label: "🕸️ Reframe always/never loops", content: "I keep thinking rules are always working against me." }
              ].map(option => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleSendMessageOf(option.content)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/[0.01] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/25 text-[10px] text-left text-slate-350 hover:text-white transition-all cursor-pointer flex items-center justify-between group"
                >
                  <span>{option.label}</span>
                  <span className="text-[8px] font-mono text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">Untangle →</span>
                </button>
              ))}

              {currentPromptCategory === "somatic" && [
                { label: "🌬️ Double-Sigh Coaching Paces", content: "Can we practice somatic double-sigh breathing?" },
                { label: "🧘 4-7-8 Deep Circular Centering", content: "Run a 4-7-8 breathing circle simulation with me." },
                { label: "⚡ Overcome Active Action Freeze", content: "I am experiencing a frozen state. Let's do a fast active chore." }
              ].map(option => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleSendMessageOf(option.content)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/[0.01] hover:bg-sky-500/10 border border-white/5 hover:border-sky-500/25 text-[10px] text-left text-slate-350 hover:text-white transition-all cursor-pointer flex items-center justify-between group"
                >
                  <span>{option.label}</span>
                  <span className="text-[8px] font-mono text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity">Sigh →</span>
                </button>
              ))}

              {currentPromptCategory === "garden" && [
                { label: "🌸 Stream Analysis Report", content: "Analyze my mental garden state and count my stream wins." },
                { label: "🌿 Calibrate Internal Atmosphere", content: "Let's change our internal garden atmosphere together." },
                { label: "🌱 Seed Check-Ins", content: "What are some micro-dose rituals I can practice for low Serotonin?" }
              ].map(option => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleSendMessageOf(option.content)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/[0.01] hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/25 text-[10px] text-left text-slate-350 hover:text-white transition-all cursor-pointer flex items-center justify-between group"
                >
                  <span>{option.label}</span>
                  <span className="text-[8px] font-mono text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">Garden →</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Field Form */}
          <form onSubmit={handleSendMessage} className="p-3.5 bg-slate-950/98 border-t border-white/5 flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Share what is warming or compressing your mind..."
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#D4A373]/40 focus:ring-1 focus:ring-[#D4A373]/40 text-slate-200 font-light"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="p-3 bg-[#D4A373] hover:bg-[#c59262] text-[#121412] rounded-xl disabled:bg-slate-800 disabled:text-slate-500 transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div id="mann-app-layout" className="w-full min-h-screen text-[#E0D8D0] font-sans selection:bg-[#D4A373]/30 selection:text-white bg-[#0a0c0a] flex flex-col md:flex-row relative overflow-x-hidden">
      
      {/* 1. LEFT NAVIGATION SIDEBAR */}
      <aside 
        id="side-navigation-dock" 
        className={`fixed inset-y-0 left-0 w-72 bg-slate-950/95 border-r border-[#D4A373]/10 p-6 flex flex-col justify-between shrink-0 z-50 transform transition-transform duration-300 backdrop-blur-lg md:sticky md:top-0 md:h-screen md:translate-x-0 md:flex ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-[#E6C594] via-[#D4A373] to-[#B07E4D] text-[#121412] font-serif font-black text-xl rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(212,163,115,0.25)] select-none">
                मन
              </div>
              <div>
                <h1 className="text-lg font-serif font-bold text-[#D4A373] leading-none mb-0.5 tracking-wide">
                  Mann (मन)
                </h1>
                <p className="text-[9px] uppercase font-mono tracking-widest text-[#D4A373]/60 font-medium">
                  Caring Companion
                </p>
              </div>
            </div>
            
            {/* Close button inside mobile menu */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Status Profile Card */}
          <div className="p-4 bg-white/[0.02] border border-[#D4A373]/10 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center">
                <User className="w-4 h-4 text-[#D4A373]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[8px] uppercase font-mono tracking-wider font-extrabold text-[#D4A373]/60">Active Spirit</p>
                <p className="text-sm font-serif font-semibold text-slate-200 truncate">{profile.name || "Traveller"}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.03]">
              <div>
                <p className="text-[8px] font-mono tracking-wider text-slate-500 uppercase">Personality</p>
                <p className="text-xs font-medium text-[#D4A373] truncate">{profile.mbti === "Not Set" ? "Exploring..." : profile.mbti}</p>
              </div>
              <div>
                <p className="text-[8px] font-mono tracking-wider text-slate-500 uppercase">Streak</p>
                <p className="text-xs font-medium text-amber-500 flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-current animate-pulse" />
                  {profile.streak} Days
                </p>
              </div>
            </div>
          </div>

          {/* Integrated Navigation Links */}
          <nav className="space-y-1" id="sidebar-tabs-list">
            {[
              { id: "home", label: "Overview Sanctuary", icon: Home },
              { id: "chat", label: "Whispers Chat", icon: MessageSquare },
              { id: "journal", label: "The Untangler (CBT)", icon: Sliders },
              { id: "garden", label: "My Quiet Garden", icon: Leaf },
              { id: "records", label: "What We Understand", icon: BookOpen },
              { id: "about", label: "About Mann", icon: Info }
            ].map((navItem) => {
              const Icon = navItem.icon;
              const isActive = activeTab === navItem.id;
              
              // Only block access to features if first-time onboarding is active and incomplete
              const isLocked = !isReturningUser && !hasNewUserFinishedOnboarding && navItem.id !== "home";

              return (
                <button
                  key={navItem.id}
                  disabled={isLocked}
                  onClick={() => {
                    setActiveTab(navItem.id as any);
                    setSidebarOpen(false);
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-left text-xs font-medium tracking-normal flex items-center justify-between transition-all duration-200 ${
                    isActive
                      ? "bg-[#D4A373] text-[#121412] font-semibold shadow-lg shadow-[#D4A373]/15"
                      : isLocked 
                        ? "text-slate-600 cursor-not-allowed opacity-50"
                        : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.02] cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "" : "text-slate-500"}`} />
                    <span>{navItem.label}</span>
                  </div>
                  {isLocked && <span className="text-[9px] font-mono tracking-wider uppercase bg-white/5 px-1 rounded">Locked</span>}
                </button>
              );
            })}
          </nav>

          {/* SOS Escalation Safety Valve */}
          <div id="sos-panel-btn-container" className="pt-2">
            <button 
              type="button"
              onClick={() => {
                setSosPanelOpen(prev => !prev);
                setSidebarOpen(false);
              }}
              className={`w-full py-3 rounded-2xl text-[10px] font-mono uppercase tracking-widest font-black flex items-center justify-center gap-2 transition-all duration-300 border ${
                sosPanelOpen 
                  ? "bg-red-600 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.45)] animate-pulse" 
                  : "bg-red-950/20 text-red-400 border-red-500/20 hover:border-red-500/40 hover:bg-red-950/40"
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>🚨 SOS SHIELD</span>
            </button>
          </div>
        </div>

        {/* Hackathon Judge Preset Hub (Dual Mode) */}
        <div id="demo-mode-switcher-card" className="space-y-3 pt-4 border-t border-white/[0.04] mt-auto select-none">
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-3">
            <p className="text-[8px] uppercase font-mono text-[#D4A373] font-black tracking-widest mb-2 flex items-center justify-between">
              <span>DEMO MODE SWITCHER</span>
              <span className="bg-[#D4A373]/15 px-1.5 py-0.5 rounded text-[7px] text-amber-500">JUDGES PIN</span>
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <button 
                onClick={() => handleToggleDemoMode("onboard")}
                className={`py-1.5 px-1 rounded-xl text-[9px] font-mono text-center font-bold tracking-tight transition-all uppercase ${
                  (!isReturningUser && !hasNewUserFinishedOnboarding) 
                    ? 'bg-[#D4A373] text-[#121412] shadow-md shadow-[#D4A373]/10 font-black' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5'
                }`}
                title="Evaluate step-by-step custom assessments without rigid questionnaires"
              >
                1. ONBOARD
              </button>
              <button 
                onClick={() => handleToggleDemoMode("arjun")}
                className={`py-1.5 px-1 rounded-xl text-[9px] font-mono text-center font-bold tracking-tight transition-all uppercase ${
                  isReturningUser 
                    ? 'bg-[#D4A373] text-[#121412] shadow-md shadow-[#D4A373]/10 font-black' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5'
                }`}
                title="Enter Arjun's preloaded state immediately to review behavioral history memory"
              >
                2. RETURNING
              </button>
            </div>
            <p className="text-[7.5px] text-slate-500 text-center font-light leading-snug mt-2">
              Review personal memory dynamics or custom intake flows instantly in 60 seconds.
            </p>
          </div>

          <div className="flex items-center justify-between text-[8px] font-mono text-slate-600 px-1">
            <span>Mann clinical biome v1.1</span>
            <span>Local Encrypted</span>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* RIGHT DISPLAY VIEWPORT */}
      <div className="flex-1 flex flex-col min-h-screen relative p-4 md:p-6 lg:p-8 min-w-0">
        
        {/* Background ambient aesthetics */}
        <div className="absolute top-[80px] left-[-100px] w-[500px] h-[500px] bg-[#D4A373]/5 rounded-full blur-[140px] pointer-events-none select-none -z-10 animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[100px] right-[-100px] w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[125px] pointer-events-none select-none -z-10 animate-pulse duration-[10000ms]" />

        {/* Mobile menu sticky top wrapper */}
        <header className="md:hidden w-full flex items-center justify-between pb-3 border-b border-white/5 mb-5 relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#E6C594] via-[#D4A373] to-[#B07E4D] text-[#121412] font-serif font-black text-xl rounded-full flex items-center justify-center">
              मन
            </div>
            <div>
              <h2 className="text-md font-serif text-slate-200 leading-none">Mann (मन)</h2>
              <p className="text-[8px] uppercase tracking-widest text-[#D4A373] font-mono font-bold">Caring Companion</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-xl bg-white/5 text-slate-300 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* SOS Crisis Panel Warning Overlay */}
        {sosPanelOpen && (
          <div id="sos-panel-emergency-card" className="mb-6 bg-red-950/40 border border-red-500/40 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md animate-fadeIn z-30">
            <div className="absolute -right-12 -top-12 text-red-500/10 font-serif text-9xl select-none pointer-events-none">🚨</div>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl shrink-0 animate-bounce">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold bg-red-500/20 text-red-200 uppercase tracking-widest border border-red-500/40">
                  TIER 3 Safety Active
                </span>
                <h3 className="text-lg font-serif font-bold text-red-100">
                  I Want to Settle & Safely Anchor
                </h3>
              </div>
              <button 
                onClick={() => setSosPanelOpen(false)}
                className="ml-auto p-1.5 rounded-xl bg-white/5 text-red-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-red-200 leading-relaxed font-light mb-5 max-w-3xl select-text">
              "We have initiated a localized check-in message queue to your registered guardian, Priya (sister), at +91-9876543210. She knows you need her. Please put one hand on your chest, feel your heartbeat. You are steady. You are here. We can decompress together step-by-step."
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a href="tel:9152987821" className="p-3 bg-red-900/30 hover:bg-red-900/50 border border-red-500/20 rounded-2xl transition-all flex flex-col justify-center text-center">
                <span className="text-[8.5px] font-mono text-red-400 uppercase tracking-wider font-extrabold mb-0.5">India iCall</span>
                <span className="text-xs font-semibold text-white">9152987821</span>
              </a>
              <a href="tel:18602662345" className="p-3 bg-red-900/30 hover:bg-red-900/50 border border-red-500/20 rounded-2xl transition-all flex flex-col justify-center text-center">
                <span className="text-[8.5px] font-mono text-red-400 uppercase tracking-wider font-extrabold mb-0.5">Vandrevala (24/7)</span>
                <span className="text-xs font-semibold text-white">1860-2662-345</span>
              </a>
              <div className="p-3 bg-slate-900/80 border border-white/5 rounded-2xl flex flex-col justify-center text-center">
                <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider font-extrabold mb-0.5">National Emergency</span>
                <span className="text-xs font-semibold text-white">Dial 112 (Free)</span>
              </div>
            </div>
          </div>
        )}

        {/* MAIN VIEWPORT SWITCHER */}
        <main className="flex-1 flex flex-col min-h-0">

          {/* TAB 1: OVERVIEW SANCTUARY (HOME) */}
          {activeTab === "home" && (
            <SanctuaryHome
              profile={profile}
              setProfile={setProfile}
              isReturningUser={isReturningUser}
              setIsReturningUser={setIsReturningUser}
              hasNewUserFinishedOnboarding={hasNewUserFinishedOnboarding}
              setHasNewUserFinishedOnboarding={setHasNewUserFinishedOnboarding}
              onboardStep={onboardStep}
              setOnboardStep={setOnboardStep}
              onboardName={onboardName}
              setOnboardName={setOnboardName}
              onboardFocus={onboardFocus}
              setOnboardFocus={setOnboardFocus}
              onboardCoping={onboardCoping}
              setOnboardCoping={setOnboardCoping}
              onboardDimE={onboardDimE}
              setOnboardDimE={setOnboardDimE}
              onboardDimN={onboardDimN}
              setOnboardDimN={setOnboardDimN}
              onboardDimT={onboardDimT}
              setOnboardDimT={setOnboardDimT}
              onboardDimJ={onboardDimJ}
              setOnboardDimJ={setOnboardDimJ}
              onboardAttachmentVal={onboardAttachmentVal}
              setOnboardAttachmentVal={setOnboardAttachmentVal}
              handleFinalizeOnboarding={handleFinalizeOnboarding}
              renderWhispersChat={renderWhispersChat}
              thoughtRecords={thoughtRecords}
              setThoughtRecords={setThoughtRecords}
              journalSuccessNotification={journalSuccessNotification}
              setJournalSuccessNotification={setJournalSuccessNotification}
              journalRawThought={journalRawThought}
              setJournalRawThought={setJournalRawThought}
              journalReframedThought={journalReframedThought}
              setJournalReframedThought={setJournalReframedThought}
              journalWeightTheme={journalWeightTheme}
              setJournalWeightTheme={setJournalWeightTheme}
              journalStep={journalStep}
              setJournalStep={setJournalStep}
              handleSaveThoughtReframe={handleSaveThoughtReframe}
              breathPhase={breathPhase}
              breathCounter={breathCounter}
              cyclesCompleted={cyclesCompleted}
              breathLogOutput={breathLogOutput}
              handleStartBreathingCycle={handleStartBreathingCycle}
              activeDopamineChore={activeDopamineChore}
              dopamineTimer={dopamineTimer}
              dopamineChoreCompleted={dopamineChoreCompleted}
              handleStartDopamineChore={handleStartDopamineChore}
              handleFinishDopamineChore={handleFinishDopamineChore}
              handleSendMessageOf={handleSendMessageOf}
            />
          )}

          {/* TAB 2: WHISPERS CHAT (PURE CONVERSATION Tab view) */}
          {activeTab === "chat" && (
            <div className="flex-1 w-full max-w-4xl mx-auto h-full flex flex-col justify-center animate-fadeIn select-text" id="whispers-chat-tab-view">
              {renderWhispersChat(true)}
            </div>
          )}

          {/* TAB 3: THE UNTANGLER (CBT REFRAMER JOURNAL) */}
          {activeTab === "journal" && (
            <div id="cbt-thought-mirror-view" className="flex-1 max-w-xl mx-auto w-full bg-gradient-to-tr from-slate-950 to-slate-900/50 border border-white/5 rounded-3xl shadow-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-white/5 bg-slate-950/95">
                <span className="text-[8px] font-mono tracking-widest text-[#D4A373] uppercase font-black">Hold Space Tool</span>
                <h3 className="text-md font-serif font-bold text-slate-200">The Thought Untangler</h3>
                <p className="text-[10px] text-slate-400 font-light">Disassemble negative automatic filters using secure double-standard tests.</p>
              </div>

              <div className="p-6 space-y-6">
                
                {journalSuccessNotification ? (
                  <div className="py-12 px-6 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl text-center space-y-4 animate-fadeIn">
                    <span className="text-3xl">🌿</span>
                    <h4 className="text-sm font-serif font-medium text-emerald-400">Recorded in CBT Ledger</h4>
                    <p className="text-xs text-slate-300 font-light leading-relaxed max-w-sm mx-auto">
                      "Your reframe has been mirrored dynamically. Garden soils refreshed. Complete a 10-minute walk ritual next to solidify this."
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSaveThoughtReframe} className="space-y-5">
                    
                    {/* Stepper Wizard Indicator */}
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-b border-white/5 pb-2">
                      <span>CBT Section Progression</span>
                      <span>Card Page {journalStep} of 4</span>
                    </div>

                    {/* Step 1: Stress Weight Area */}
                    {journalStep === 1 && (
                      <div className="space-y-4 animate-fadeIn">
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">1. What weight of tension is on your heart today?</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "Work / Career blocks",
                            "Relational Distance",
                            "Studies & Academics",
                            "Vague heavy pressure"
                          ].map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                setJournalWeightTheme(tag);
                                setJournalStep(2);
                              }}
                              className={`p-3 text-xs text-left rounded-xl border transition-all cursor-pointer ${
                                journalWeightTheme === tag 
                                  ? 'bg-[#D4A373]/15 border-[#D4A373]/40 text-[#D4A373] font-semibold'
                                  : 'bg-white/[0.01] border-white/5 hover:bg-white/5 text-slate-300'
                              }`}
                            >
                              <span>✦ {tag}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 2: Automatic raw thought input */}
                    {journalStep === 2 && (
                      <div className="space-y-4 animate-fadeIn">
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">2. Isolate the Raw, automatic Negative thought:</label>
                        <p className="text-[10px] text-slate-400 font-light">What is the most brutal, unedited criticism looping in your mind right now?</p>
                        
                        <textarea
                          required
                          rows={3}
                          value={journalRawThought}
                          onChange={(e) => setJournalRawThought(e.target.value)}
                          placeholder="e.g. My sister hasn't texted me. I must be exhausting her and she's pulling away."
                          className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#D4A373]/50"
                        />

                        <div className="flex justify-between items-center pt-2">
                          <button type="button" onClick={() => setJournalStep(1)} className="text-[10.5px] font-mono text-slate-400 hover:underline">← Back</button>
                          <button 
                            type="button" 
                            disabled={!journalRawThought.trim()} 
                            onClick={() => {
                              // Auto recommendation analysis
                              const autoDetected = analyzeCognitiveDistortion(journalRawThought);
                              setSelectedDistortionKey(autoDetected.key);
                              setJournalStep(3);
                            }}
                            className="px-4 py-2 bg-[#D4A373] text-slate-950 text-xs font-mono font-black rounded-lg hover:bg-[#c59262] cursor-pointer"
                          >
                            Analyze my thought
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Diagnostic distortion analyzer */}
                    {journalStep === 3 && (() => {
                      const detected = analyzeCognitiveDistortion(journalRawThought);
                      const activeDistortion = COGNITIVE_DISTORTIONS.find(d => d.key === selectedDistortionKey) || detected;
                      
                      return (
                        <div className="space-y-4 animate-fadeIn">
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">3. Identify cognitive lens distortion:</label>
                          <p className="text-[10px] text-slate-450 font-light leading-relaxed">We recommended the highlighted distortion, but you can select any to customize your therapy lens:</p>
                          
                          {/* Selected Distortion Detail Panel */}
                          <div className="p-4 bg-slate-950/85 rounded-2xl border border-[#D4A373]/30 space-y-2.5 font-sans">
                            <div className="flex items-center gap-2 justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{activeDistortion.emoji}</span>
                                <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wide">{activeDistortion.title}</span>
                              </div>
                              {detected.key === activeDistortion.key && (
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-mono rounded-full border border-emerald-500/20">✨ Auto-Detected</span>
                              )}
                            </div>
                            
                            <p className="text-[11px] text-slate-300 leading-relaxed font-light">
                              {activeDistortion.desc}
                            </p>
                          </div>

                          {/* Grid of All Interactive Cognitive Distortions */}
                          <div className="grid grid-cols-2 gap-1.5 pt-1.5" id="cbt-distortions-grid">
                            {COGNITIVE_DISTORTIONS.map(dist => {
                              const isSelected = selectedDistortionKey === dist.key;
                              return (
                                <button
                                  key={dist.key}
                                  type="button"
                                  onClick={() => setSelectedDistortionKey(dist.key)}
                                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                                    isSelected 
                                      ? "bg-[#D4A373]/15 border-[#D4A373]/50 text-amber-400 font-semibold scale-[1.02]" 
                                      : "bg-slate-900/35 border-white/5 hover:border-white/10 text-slate-300"
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs">{dist.emoji}</span>
                                    <span className="text-[10px] font-semibold truncate">{dist.title}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          <div className="flex justify-between pt-2">
                            <button type="button" onClick={() => setJournalStep(2)} className="text-[10.5px] font-mono text-slate-400 hover:underline">← Edit Thought</button>
                            <button 
                              type="button" 
                              onClick={() => {
                                // Dynamic reframe suggestion prompt mapping
                                const active_dist = COGNITIVE_DISTORTIONS.find(d => d.key === selectedDistortionKey);
                                let suggested_reframe = "I notice this automatic " + (active_dist?.title || "view") + " pattern. In reality, I will slow down and balance my steps with facts rather than emotional fear.";
                                setJournalReframedThought(suggested_reframe);
                                setJournalStep(4);
                              }} 
                              className="px-4 py-2 bg-[#D4A373] text-slate-950 text-xs font-mono font-black rounded-lg hover:bg-[#c59262] cursor-pointer"
                            >
                              Continue to Reframe
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Step 4: Write Reframe & Submit */}
                    {journalStep === 4 && (() => {
                      const activeDistortion = COGNITIVE_DISTORTIONS.find(d => d.key === selectedDistortionKey) || COGNITIVE_DISTORTIONS[0];
                      return (
                        <div className="space-y-4 animate-fadeIn">
                          <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1">
                            <span className="text-[8px] font-mono uppercase tracking-widest text-[#D4A373]">Reframing Lens:</span>
                            <div className="flex items-center gap-1.5 text-xs text-amber-400">
                              <span>{activeDistortion.emoji}</span>
                              <span className="font-semibold">{activeDistortion.title}</span>
                            </div>
                          </div>

                          <label className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">4. Draft your compassionate Reframe:</label>
                          <p className="text-[10px] text-amber-500/80 italic font-serif leading-relaxed">
                            💡 Reframe Prompt: "{activeDistortion.reframePrompt}"
                          </p>

                          <textarea
                            required
                            rows={3}
                            value={journalReframedThought}
                            onChange={(e) => setJournalReframedThought(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-[#D4A373]/50"
                          />

                          <div className="flex justify-between items-center pt-2">
                            <button type="button" onClick={() => setJournalStep(3)} className="text-[10.5px] font-mono text-slate-400 hover:underline">← Back</button>
                            <button
                              type="submit"
                              className="px-5 py-2.5 bg-emerald-500 text-[#0a0c0a] text-xs font-mono font-black rounded-xl hover:bg-emerald-600 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>Mirror this Thought</span>
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                  </form>
                )}

              </div>

              {/* HISTORICAL REFRAMES RECORDS (THE ACTIVE LEDGER INSIDE TAB 3) */}
              <div className="border-t border-white/5 bg-slate-950/60 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#D4A373]" />
                      Active Balanced Mirror Ledger
                    </h4>
                    <p className="text-[9.5px] text-slate-500 font-light mt-0.5">Tactile cognitive record ledger synced securely to Local Storage.</p>
                  </div>
                  <span className="text-[10px] font-mono bg-white/5 text-slate-400 px-2 py-0.5 rounded-full">{thoughtRecords.length} records</span>
                </div>

                {thoughtRecords.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-white/5 rounded-2xl text-slate-500 space-y-1">
                    <span className="text-lg">🧘</span>
                    <p className="text-[10.5px] text-slate-400 font-light">Your ledger is looking wonderfully clear and settled.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1" id="cbt-tab-records-list">
                    {thoughtRecords.map(rec => (
                      <div key={rec.id} className="p-3 bg-slate-950 border border-white/5 rounded-2xl space-y-3 relative group hover:border-[#D4A373]/20 transition-all select-text">
                        <div className="flex items-center justify-between border-b border-white/[0.04] pb-1.5">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[8.5px] font-mono text-[#D4A373] tracking-wide">
                            {rec.pattern}
                          </span>
                          <span className="text-[8px] font-mono text-slate-500">{rec.timestamp}</span>
                        </div>

                        <div className="space-y-1.5 text-[11px] leading-relaxed">
                          <div>
                            <span className="text-[8px] uppercase tracking-wider font-mono text-red-400/80 block">Raw worry tension:</span>
                            <p className="text-slate-400 italic line-through decoration-red-950/55">{rec.original}</p>
                          </div>
                          <div>
                            <span className="text-[8px] uppercase tracking-wider font-mono text-emerald-400 block">Balanced perspective:</span>
                            <p className="text-slate-200 text-xs font-serif">{rec.alternative}</p>
                          </div>
                        </div>

                        {/* Interactive tactile button action strip */}
                        <div className="flex items-center justify-between border-t border-white/[0.03] pt-2">
                          <div className="flex gap-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setInputText(`I want to talk about this CBT balanced thought: "${rec.alternative}"`);
                                setActiveTab("chat");
                              }}
                              className="inline-flex items-center gap-1 text-[9px] font-mono text-slate-400 hover:text-[#D4A373] transition-colors cursor-pointer"
                              title="Send this reframe to Whispers Chat"
                            >
                              <MessageSquare className="w-3 h-3 text-[#D4A373]" />
                              <span>Discuss Reframe</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setProfile(p => ({ ...p, streak: p.streak + 1 }));
                                setSeedToastMessage("🌱 Sown as seed! Growing peaceful roots in your garden canvas.");
                                setShowSeedToast(true);
                                setTimeout(() => setShowSeedToast(false), 3000);
                              }}
                              className="inline-flex items-center gap-1 text-[9px] font-mono text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                              title="Plant on virtual garden map"
                            >
                              <Sparkles className="w-3 h-3 text-emerald-400" />
                              <span>Plant Seed</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setThoughtRecords(prev => prev.filter(p => p.id !== rec.id));
                              setSeedToastMessage("🗑️ Dissolved this thought loop back into silent sand.");
                              setShowSeedToast(true);
                              setTimeout(() => setShowSeedToast(false), 3000);
                            }}
                            className="text-[9px] font-mono text-slate-500 hover:text-red-400 transition-colors hover:underline cursor-pointer"
                            title="Purge record"
                          >
                            Dissolve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: GARDEN BIOME */}
          {activeTab === "garden" && (
            <div id="garden-canvas-bento" className="flex-1 max-w-4xl mx-auto w-full space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-400 uppercase tracking-widest border border-emerald-500/20 font-mono">
                  Somatic climate simulation
                </span>
                <h3 className="text-xl font-serif text-slate-100 font-light">Your Living Sanctuary Biome</h3>
                <p className="text-xs text-slate-400 font-light">This quiet space represents your physiological grounding. It quietly grows alongside your breakthroughs.</p>
              </div>

              {/* Garden Canvas Wrapper */}
              <div className="border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
                <GardenCanvas 
                  mood={profile.gardenState}
                  streak={profile.streak}
                  ritualsWatered={thoughtRecords.length}
                />
              </div>

              {/* Soil ecology report */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2 text-center">
                  <span className="text-md">💧 Hydration Level</span>
                  <p className="text-lg font-serif font-bold text-emerald-400 font-mono">{75 + thoughtRecords.length * 5}%</p>
                  <p className="text-[10px] text-slate-500 font-light">Directly boosted by your customized CBT reframing logs.</p>
                </div>
                <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2 text-center">
                  <span className="text-md">🌋 Biochemical Vitals</span>
                  <p className="text-lg font-serif font-bold text-amber-500 font-mono">{profile.streak * 1.5} mmol</p>
                  <p className="text-[10px] text-slate-500 font-light">Tracks total day-streaks of active mental self-reloading.</p>
                </div>
                <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2 text-center">
                  <span className="text-md">🍃 Sprouting Sprouts</span>
                  <p className="text-lg font-serif font-bold text-sky-400 font-mono">{2 + thoughtRecords.length} Active</p>
                  <p className="text-[10px] text-slate-500 font-light">Total botanical ornaments active in your tranquil landscape.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WHAT WE UNDERSTAND (INSIGHTS) */}
          {activeTab === "records" && (
            <div id="insights-records-view" className="flex-1 max-w-4xl mx-auto w-full space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[8.5px] font-extrabold bg-amber-500/10 text-amber-500 uppercase tracking-widest border border-amber-500/20 font-mono">
                  Somatic Profile & records ledgers
                </span>
                <h3 className="text-xl font-serif text-slate-100 font-light">What We Understand About Your Systems</h3>
                <p className="text-xs text-slate-400 font-light">A slow, compassionate blueprint compiling personality intuition, connection defaults, and CBT memory history.</p>
              </div>

              {/* Identity Blueprint detail card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Personality Spark Card */}
                <div className="p-5 bg-gradient-to-tr from-slate-950 to-slate-900/40 border border-[#D4A373]/15 rounded-3xl space-y-3 relative overflow-hidden select-text">
                  <span className="block text-[8px] uppercase font-mono tracking-widest text-[#D4A373] font-black">YOUR INDIVIDUAL SPARK MBTI</span>
                  <h4 className="text-md font-serif font-bold text-white flex items-center gap-2">
                    <span>✨</span>
                    <span>{MBTI_COGNITIVE_BLUEPRINTS[profile.mbti]?.title || MBTI_COGNITIVE_BLUEPRINTS["Default"].title}</span>
                    <span className="text-xs font-mono font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">{profile.mbti}</span>
                  </h4>
                  <p className="text-xs text-slate-300 font-light leading-relaxed select-text">
                    {MBTI_COGNITIVE_BLUEPRINTS[profile.mbti]?.desc || MBTI_COGNITIVE_BLUEPRINTS["Default"].desc}
                  </p>
                  <p className="text-[10px] text-amber-500 font-medium">
                    <strong className="uppercase">Emotional Gateway:</strong> {MBTI_COGNITIVE_BLUEPRINTS[profile.mbti]?.strengths || MBTI_COGNITIVE_BLUEPRINTS["Default"].strengths}
                  </p>
                </div>

                {/* Connection Style Card */}
                <div className="p-5 bg-gradient-to-tr from-slate-950 to-slate-900/40 border border-[#D4A373]/15 rounded-3xl space-y-3 relative overflow-hidden select-text">
                  <span className="block text-[8px] uppercase font-mono tracking-widest text-[#D4A373] font-black">YOUR RELATION BLUEPRINT ATTACHMENT</span>
                  <h4 className="text-md font-serif font-bold text-white flex items-center gap-2">
                    <span>❤️</span>
                    <span>{ATTACHMENT_COGNITIVE_BLUEPRINTS[profile.attachmentStyle]?.title || "The Companion traveler"}</span>
                    <span className="text-xs font-mono font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">{profile.attachmentStyle} Style</span>
                  </h4>
                  <p className="text-xs text-slate-300 font-light leading-relaxed select-text">
                    {ATTACHMENT_COGNITIVE_BLUEPRINTS[profile.attachmentStyle]?.desc || "Compassionate regulation pathways mapping relational parameters under pressure."}
                  </p>
                  <p className="text-[10px] text-amber-500 font-medium">
                    <strong className="uppercase">Core biochemical balance need:</strong> {ATTACHMENT_COGNITIVE_BLUEPRINTS[profile.attachmentStyle]?.coreNeed || "Gentle holding loops"}
                  </p>
                </div>

              </div>

              {/* HISTORICAL REFRAMES RECORDS (THE THOUGHT MIRROR LOG) */}
              <div className="p-5 bg-slate-950/60 border border-white/5 rounded-3xl space-y-4 select-text">
                <div className="border-b border-white/5 pb-2">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">CBT Thought Reframer Archives</h4>
                  <p className="text-[9.5px] text-zinc-500 font-light">A safe record block tracking previously customized distortions.</p>
                </div>

                {thoughtRecords.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">No reframed doubts archived yet. Open the Untangler to start watering roots.</p>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar select-text">
                    {thoughtRecords.map(item => (
                      <div key={item.id} className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl space-y-2 select-text">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-mono text-amber-500 font-medium uppercase tracking-wider">{item.pattern}</span>
                          <span className="text-slate-500">{item.timestamp}</span>
                        </div>
                        <p className="text-xs text-red-400 font-light italic select-text">“{item.original}”</p>
                        <p className="text-xs text-emerald-400 font-medium select-text">✓ “{item.alternative}”</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CLINICAL PSYCHOLOGY MAP (Renders JourneyMap for Hackathon Judges) */}
              <div className="p-5 bg-white/[0.01] border border-white/5 rounded-3xl space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <span className="text-[8.5px] font-mono uppercase text-[#D4A373] tracking-widest font-black">Hackathon Judge validation panel</span>
                  <h4 className="text-sm font-serif text-slate-200">Clinical Psychology Architecture</h4>
                  <p className="text-[10px] text-slate-400 font-light">Understand why MANN feels completely different under the hood. Our parameters connect directly to physical brain chemical pathways.</p>
                </div>
                
                <JourneyMap 
                  profile={profile as any}
                  messages={messages}
                  thoughtRecords={thoughtRecords}
                  rituals={rituals}
                  isDemoMode={true}
                />
              </div>

            </div>
          )}

          {/* TAB 6: ABOUT MANN (APPLICATION FEATURES WORKBOOK) */}
          {activeTab === "about" && (
            <div id="about-mann-workbook-view" className="flex-1 max-w-4xl mx-auto w-full space-y-8 animate-fadeIn select-text pb-10">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-[8.5px] font-extrabold bg-[#D4A373]/10 text-[#D4A373] uppercase tracking-widest border border-[#D4A373]/20 font-mono">
                  The Clinical Companion Architecture
                </span>
                <h3 className="text-2xl font-serif text-slate-100 font-light">About Mann (मन)</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed max-w-2xl">
                  Mann is an integrated, offline-first emotional companion that merges cognitive therapy, behavioral activation, personality-paired diagnostics, and biological rhythm feedback into a singular, conversational interface. It reduces operational decision friction to zero while retaining complete clinical intelligence.
                </p>
              </div>

              {/* Grid of App Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 select-text">
                
                {/* 1. Overview Sanctuary Card */}
                <div className="p-5 bg-slate-950/40 border border-white/5 rounded-3xl space-y-3 hover:border-[#D4A373]/20 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏕️</span>
                    <h4 className="text-sm font-serif font-semibold text-slate-100">Overview Sanctuary</h4>
                  </div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    A beautiful, unified central entrance. Rather than forcing the selection of disparate clinical menus, we present simple, emotional gateways (e.g. <em>“My mind won't stop”</em>). Your selection launches calibrated sub-sessions dynamically tailored to your immediate mental friction.
                  </p>
                </div>

                {/* 2. Whispers Chat Card */}
                <div className="p-5 bg-slate-950/40 border border-white/5 rounded-3xl space-y-3 hover:border-[#D4A373]/20 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💬</span>
                    <h4 className="text-sm font-serif font-semibold text-slate-100">Whispers Chat</h4>
                  </div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    A secure conversational space that speaks directly to your MBTI cognitive style and attachment triggers. Features invisible automated extraction: if your descriptions contain heavy triggers, CBT Reframing sheets, Journaling prompts, or Breathing pacers automatically rise inside the thread.
                  </p>
                </div>

                {/* 3. The Untangler Card */}
                <div className="p-5 bg-slate-950/40 border border-white/5 rounded-3xl space-y-3 hover:border-[#D4A373]/20 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚖️</span>
                    <h4 className="text-sm font-serif font-semibold text-slate-100">Automatic CBT Reframers</h4>
                  </div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Based on standard Cognitive Behavioral Therapy (CBT). Identifies personal cognitive distortion patterns (such as <em>All-or-Nothing</em>, <em>Mind-Reading</em>, or <em>Catastrophizing</em>), holds them in a protected mirror ledger, and guides you to forge gentle, balanced reframes.
                  </p>
                </div>

                {/* 4. My Quiet Garden Card */}
                <div className="p-5 bg-slate-950/40 border border-white/5 rounded-3xl space-y-3 hover:border-[#D4A373]/20 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🌿</span>
                    <h4 className="text-sm font-serif font-semibold text-slate-100">Quiet Garden Ecosystem</h4>
                  </div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    A living generative botanical biome. Your overall emotional state dictates the global climate (Blooming, Cloudy, Dark), while completing mindfulness cycles or reframing thoughts adds physical soil hydration stats, growing and unlocking spectacular new flowers.
                  </p>
                </div>

                {/* 5. What We Understand Card */}
                <div className="p-5 bg-slate-950/40 border border-white/5 rounded-3xl space-y-3 hover:border-[#D4A373]/20 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🗃️</span>
                    <h4 className="text-sm font-serif font-semibold text-slate-100">Behavioral Ledgers</h4>
                  </div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    A persistent repository tracking your personal growth logs over time. Contains your full profile blueprints, structured historical CBT archives, and visual biome stats showing how mental calibration translates into sustained positive streaks.
                  </p>
                </div>

                {/* 6. Three-Tier Critical Safety Card */}
                <div className="p-5 bg-slate-950/40 border border-white/5 rounded-3xl space-y-3 hover:border-[#D4A373]/20 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🚨</span>
                    <h4 className="text-sm font-serif font-semibold text-slate-100">Three-Tier Clinical Safety Valve</h4>
                  </div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Built-in crisis detection triggers safe biological emergency routines. If severe words of self-harm or hopelessness are detailed, the companion automatically notifies emergency contacts (such as your sister <strong>Priya</strong>) with warm check-ins while offering immediate national hotline connections.
                  </p>
                </div>

              </div>

              {/* The DOSE Chemistry System Explanation Panel */}
              <div className="p-6 bg-gradient-to-tr from-[#122e23]/20 to-slate-950 border border-emerald-500/10 rounded-3xl space-y-4 select-text">
                <span className="px-2 py-0.5 rounded-full text-[8px] font-mono font-black bg-emerald-400/15 text-emerald-400 uppercase tracking-widest border border-emerald-500/20">
                  Neurochemical Balance Engine
                </span>
                <div className="space-y-1">
                  <h4 className="text-lg font-serif font-light text-slate-200">The D.O.S.E. System</h4>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Mann balances four core neurotransmitters by translating simple screen actions into positive physiological cascades:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                  <div className="p-3.5 bg-black/30 rounded-2xl border border-white/[0.02]">
                    <span className="text-xs font-mono font-black text-amber-400 block mb-1">⚡ DOPAMINE</span>
                    <p className="text-[11px] text-slate-350 leading-relaxed font-light">
                      Triggered by completion of 60-second interactive <strong>Momentum Chores</strong>. Breaks executive freeze by focusing on low-energy physical alignment.
                    </p>
                  </div>
                  <div className="p-3.5 bg-black/30 rounded-2xl border border-white/[0.02]">
                    <span className="text-xs font-mono font-black text-indigo-400 block mb-1">🧘 SEROTONIN</span>
                    <p className="text-[11px] text-slate-355 leading-relaxed font-light">
                      Calibrated by the <strong>Somatic Breathing pacing</strong> cycles or the <strong>Circadian Horizons Walk</strong>, which reset cortical tension via visual horizon expansion.
                    </p>
                  </div>
                  <div className="p-3.5 bg-black/30 rounded-2xl border border-white/[0.02]">
                    <span className="text-xs font-mono font-black text-pink-400 block mb-1">🌸 OXYTOCIN</span>
                    <p className="text-[11px] text-slate-350 leading-relaxed font-light">
                      Watered by recording <strong>Unsent Letters in Closet</strong> or expressing vulnerability inside the Whispers Chat stream, triggering emotional balance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
