import React, { useState } from "react";
import { 
  Leaf, 
  ArrowRight, 
  Flame, 
  Sparkles, 
  BookOpen, 
  Sliders, 
  Activity, 
  Smile, 
  User,
  Wind
} from "lucide-react";
import { UserProfile, MoodPetal, ThoughtMirrorRecord } from "../types";
import GardenCanvas from "./GardenCanvas";
import { motion, AnimatePresence } from "motion/react";

// Blueprints of Psychological and Temperament parameters
const MBTI_COGNITIVE_BLUEPRINTS: Record<string, { title: string; desc: string; strengths: string }> = {
  "INFJ": { title: "The Counselor", desc: "Allying profound quiet empathy with a structured internal compass.", strengths: "Compassion, foresight, integrity." },
  "INFP": { title: "The Mediator", desc: "Allying deep personal values, quiet listening pacing, and a need for soft holding spaces.", strengths: "Authenticity, empathy, poetic expression." },
  "ENFP": { title: "The Campaigner", desc: "Energetic intuition seeking profound interpersonal connection and creative arcs.", strengths: "Warmth, imagination, adaptability." },
  "INTJ": { title: "The Mastermind", desc: "Strategic systemic insight seeking robust logical clarity and structure.", strengths: "Intellect, independence, depth." },
  "INTP": { title: "The Thinker", desc: "Analytical conceptual processing seeking core natural principles.", strengths: "Precision, curiosity, original thinking." },
  "ISFP": { title: "The Artist", desc: "Sensory attunement looking for organic, harmonious emotional alignments.", strengths: "Sensitivity, grace, practical aid." },
  "ISTP": { title: "The Crafter", desc: "Hands-on diagnostic systems, seeking quiet tactile autonomy.", strengths: "Logic, resourcefulness, calmness." },
  "ISFJ": { title: "The Defender", desc: "Humble, dedicated attention protecting the traditions and practical needs of their circle.", strengths: "Loyalty, meticulousness, support." },
  "ISTJ": { title: "The Inspector", desc: "Reliable structural processing maintaining consistent, quiet order.", strengths: "Duty, precision, stability." }
};

const ATTACHMENT_COGNITIVE_BLUEPRINTS: Record<string, { title: string; desc: string; coreNeed: string }> = {
  "Secure": { title: "The Anchored Root", desc: "Fluid emotional pacing with a safe foundational expectation of mutual warmth.", coreNeed: "Sustained gentle pacing." },
  "Anxious": { title: "The Attuned Wave", desc: "High relational attentiveness where delay triggers protective siren alarms.", coreNeed: "Explicit, prompt assurance." },
  "Avoidant": { title: "The Self-Reliant Sprout", desc: "Protective emotional autonomy where tension is processed alone.", coreNeed: "Safe spacing without pressure." },
  "Fearful-Avoidant": { title: "The Sentinel", desc: "Attunement paired with hesitation, cycling between longing and safety barriers.", coreNeed: "Consistent non-demanding warmth." }
};

interface SanctuaryHomeProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isReturningUser: boolean;
  setIsReturningUser: (b: boolean) => void;
  hasNewUserFinishedOnboarding: boolean;
  setHasNewUserFinishedOnboarding: (b: boolean) => void;
  onboardStep: string;
  setOnboardStep: (s: any) => void;
  onboardName: string;
  setOnboardName: (s: string) => void;
  onboardFocus: string;
  setOnboardFocus: (s: string) => void;
  onboardCoping: string;
  setOnboardCoping: (s: string) => void;
  onboardDimE: "E" | "I";
  setOnboardDimE: (s: "E" | "I") => void;
  onboardDimN: "N" | "S";
  setOnboardDimN: (s: "N" | "S") => void;
  onboardDimT: "T" | "F";
  setOnboardDimT: (s: "T" | "F") => void;
  onboardDimJ: "J" | "P";
  setOnboardDimJ: (s: "J" | "P") => void;
  onboardAttachmentVal: "Secure" | "Anxious" | "Avoidant" | "Fearful-Avoidant";
  setOnboardAttachmentVal: (s: "Secure" | "Anxious" | "Avoidant" | "Fearful-Avoidant") => void;
  handleFinalizeOnboarding: () => void;
  renderWhispersChat: (isFullscreen: boolean) => React.ReactNode;
  thoughtRecords: ThoughtMirrorRecord[];
  setThoughtRecords: React.Dispatch<React.SetStateAction<ThoughtMirrorRecord[]>>;
  journalSuccessNotification: boolean;
  setJournalSuccessNotification: (b: boolean) => void;
  journalRawThought: string;
  setJournalRawThought: (s: string) => void;
  journalReframedThought: string;
  setJournalReframedThought: (s: string) => void;
  journalWeightTheme: string;
  setJournalWeightTheme: (s: string) => void;
  journalStep: number;
  setJournalStep: (n: number) => void;
  handleSaveThoughtReframe: (e: React.FormEvent) => void;
  breathPhase: string;
  breathCounter: number;
  cyclesCompleted: number;
  breathLogOutput: string;
  handleStartBreathingCycle: (type: "sigh" | "478") => void;
  activeDopamineChore: string | null;
  dopamineTimer: number;
  dopamineChoreCompleted: boolean;
  handleStartDopamineChore: (chore: string) => void;
  handleFinishDopamineChore: () => void;
  handleSendMessageOf: (text: string) => void;
}

export default function SanctuaryHome({
  profile,
  setProfile,
  isReturningUser,
  setIsReturningUser,
  hasNewUserFinishedOnboarding,
  setHasNewUserFinishedOnboarding,
  onboardStep,
  setOnboardStep,
  onboardName,
  setOnboardName,
  onboardFocus,
  setOnboardFocus,
  onboardCoping,
  setOnboardCoping,
  onboardDimE,
  setOnboardDimE,
  onboardDimN,
  setOnboardDimN,
  onboardDimT,
  setOnboardDimT,
  onboardDimJ,
  setOnboardDimJ,
  onboardAttachmentVal,
  setOnboardAttachmentVal,
  handleFinalizeOnboarding,
  renderWhispersChat,
  thoughtRecords,
  setThoughtRecords,
  journalSuccessNotification,
  setJournalSuccessNotification,
  journalRawThought,
  setJournalRawThought,
  journalReframedThought,
  setJournalReframedThought,
  journalWeightTheme,
  setJournalWeightTheme,
  journalStep,
  setJournalStep,
  handleSaveThoughtReframe,
  breathPhase,
  breathCounter,
  cyclesCompleted,
  breathLogOutput,
  handleStartBreathingCycle,
  activeDopamineChore,
  dopamineTimer,
  dopamineChoreCompleted,
  handleStartDopamineChore,
  handleFinishDopamineChore,
  handleSendMessageOf
}: SanctuaryHomeProps) {
  
  // Local state for feelings navigation
  const [activeFeeling, setActiveFeeling] = useState<string | null>(null);
  const [activeFeelingDestination, setActiveFeelingDestination] = useState<string | null>(null);

  // Unified, high-fidelity, out-of-the-box Breathing Interactive Visualizer
  const renderBeautifulBreathingOrb = (sizeClass: string = "w-44 h-44") => {
    const isIdle = breathPhase === "idle";
    const currentScale = breathPhase === "inhale" ? 1.35 : breathPhase === "hold" ? 1.30 : breathPhase === "exhale" ? 0.85 : 1.0;
    
    // Custom gradient colors based on phase
    const getPhaseInfo = () => {
      switch (breathPhase) {
        case "inhale":
          return {
            gradient: "from-teal-500/20 via-emerald-500/15 to-indigo-950/40",
            border: "border-teal-400",
            glow: "shadow-[0_0_80px_rgba(20,184,166,0.6)]",
            text: "Inhale...",
            subtext: "Expanding lungs deeply",
            indicatorColor: "bg-teal-400",
            ringRotate: 45
          };
        case "hold":
          return {
            gradient: "from-amber-500/20 via-orange-500/15 to-indigo-950/40",
            border: "border-amber-400",
            glow: "shadow-[0_0_90px_rgba(245,158,11,0.55)]",
            text: "Hold...",
            subtext: "Stay suspended in peace",
            indicatorColor: "bg-amber-400",
            ringRotate: 90
          };
        case "exhale":
          return {
            gradient: "from-indigo-500/20 via-pink-500/15 to-indigo-950/40",
            border: "border-indigo-400",
            glow: "shadow-[0_0_50px_rgba(99,102,241,0.45)]",
            text: "Exhale...",
            subtext: "Shed all remaining tension",
            indicatorColor: "bg-indigo-400",
            ringRotate: 180
          };
        case "idle":
        default:
          return {
            gradient: "from-[#D4A373]/15 via-indigo-950/20 to-teal-950/10",
            border: "border-[#D4A373]/30",
            glow: "shadow-[0_0_50px_rgba(212,163,115,0.3)]",
            text: "Breathe",
            subtext: "Steady & safe meadow rhythm",
            indicatorColor: "bg-[#D4A373]",
            ringRotate: 0
          };
      }
    };

    const phase = getPhaseInfo();

    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center select-none" id="somatic-circadian-breathing-stage">
          {/* Outer rotating decorative alignment rings */}
          <div 
            className={`absolute w-56 h-56 rounded-full border border-dashed border-white/5 transition-all duration-[3000ms] ${
              !isIdle ? "rotate-180 opacity-40 scale-105" : "rotate-0 opacity-20 scale-100"
            }`} 
            style={{ transform: `rotate(${phase.ringRotate}deg)` }}
          />
          <div 
            className={`absolute w-48 h-48 rounded-full border border-white/5 transition-all duration-[4000ms] ${
              !isIdle ? "-rotate-180 opacity-50 scale-95" : "rotate-0 opacity-10 scale-100"
            }`} 
            style={{ transform: `rotate(-${phase.ringRotate * 1.5}deg)` }}
          />

          {/* Core Concentric Breath Orb */}
          <div
            style={{ transform: `scale(${currentScale})` }}
            className={`rounded-full bg-gradient-to-tr ${phase.gradient} border ${phase.border} ${phase.glow} ${sizeClass} flex flex-col items-center justify-center transition-all duration-[1000ms] ease-in-out relative z-10 group/orb`}
          >
            {/* Animated sonar wave elements */}
            {!isIdle && (
              <>
                <span className={`absolute inset-0 rounded-full border ${phase.border} scale-110 opacity-25 animate-ping duration-[3000ms]`} />
                <span className={`absolute inset-1 rounded-full border ${phase.border} scale-120 opacity-10 animate-ping duration-[6000ms]`} />
              </>
            )}

            {/* Glowing botanical core flame */}
            <span className="text-3xl font-serif text-[#D4A373] drop-shadow-[0_0_10px_rgba(212,163,115,0.5)]">मन</span>
            
            {/* Phase instruction copy */}
            <span className="text-xs font-mono uppercase tracking-widest text-slate-100 mt-2 font-bold transition-all">
              {phase.text}
            </span>

            {/* Countdown seconds remaining */}
            {!isIdle && (
              <span className="text-[10px] font-mono font-black text-slate-400 mt-0.5 select-none animate-pulse">
                {breathCounter}s
              </span>
            )}
          </div>

          {/* Floating botanical lung leaves mapped to breathing flow (Out-of-the-box!) */}
          <div className="absolute inset-x-0 w-full flex justify-between pointer-events-none px-4 z-20">
            <div 
              style={{ 
                transform: `scale(${currentScale * 0.95}) rotate(${isIdle ? 0 : breathPhase === 'inhale' ? '-35' : '10'}deg)`,
                opacity: isIdle ? 0.3 : 0.8
              }}
              className="transition-all duration-[1000ms] ease-in-out text-sm"
              title="Left Biological Expansion"
            >
              🍃
            </div>
            <div 
              style={{ 
                transform: `scale(${currentScale * 0.95}) rotate(${isIdle ? 0 : breathPhase === 'inhale' ? '35' : '-10'}deg)`,
                opacity: isIdle ? 0.3 : 0.8
              }}
              className="transition-all duration-[1000ms] ease-in-out text-sm"
              title="Right Biological Expansion"
            >
              🍃
            </div>
          </div>
        </div>

        {/* Dynamic Descriptive Guidance */}
        <div className="text-center space-y-1">
          <p className="text-[11px] font-serif font-black uppercase tracking-wider text-[#D4A373] animate-pulse">
            {isIdle ? "Click below to begin soothing cycles" : phase.subtext}
          </p>
          <p className="text-[10px] font-mono text-slate-550 uppercase select-none">
            {isIdle ? "Calibration Steady" : `${cyclesCompleted}/3 Breath Cycles Fully Calibrated`}
          </p>
        </div>
      </div>
    );
  };

  // Helper mapping feeling selection to personalized interventions
  const feelingMapping: Record<string, {
    question: string;
    description: string;
    themeColor: string;
    options: Array<{
      label: string;
      subtext: string;
      action: () => void;
    }>;
  }> = {
    mind: {
      question: "Somatic mind over-arousal. What is your mind spinning on?",
      description: "When the mind won't stop, thoughts expand into high-frequency loops. Let's direct this physical energy gently.",
      themeColor: "from-sky-500/10 to-indigo-500/5 border-sky-400/25",
      options: [
        {
          label: "A future event or worry",
          subtext: "Analyze threat perceptions systematically using CBT double-standard checks.",
          action: () => {
            setJournalRawThought("");
            setJournalReframedThought("");
            setJournalWeightTheme("Future Event / Worry");
            setJournalStep(2);
            setActiveFeelingDestination("cbt");
            setProfile(p => ({ ...p, gardenState: MoodPetal.CLOUDY }));
          }
        },
        {
          label: "Something I said or did",
          subtext: "Reflect on social communication feedback triggers and self-criticism.",
          action: () => {
            setJournalRawThought("");
            setJournalReframedThought("");
            setJournalWeightTheme("Social Reflection / Doubt");
            setJournalStep(2);
            setActiveFeelingDestination("cbt");
            setProfile(p => ({ ...p, gardenState: MoodPetal.CLOUDY }));
          }
        },
        {
          label: "High engine-pacing stress",
          subtext: "Reset cardiac alarms immediately with quick slow-exhale double sigh exercises.",
          action: () => {
            setActiveFeelingDestination("breathing");
            handleStartBreathingCycle("sigh");
            setProfile(p => ({ ...p, gardenState: MoodPetal.GROWING }));
          }
        },
        {
          label: "Let's sit and talk to Mann",
          subtext: "Open a completely unedited conversational holding ledger to vent.",
          action: () => {
            const initialPrompt = "I feel like my mind won't stop spinning right now. Let's talk through this overthinking loop.";
            handleSendMessageOf(initialPrompt);
            setActiveFeelingDestination("chat");
            setProfile(p => ({ ...p, gardenState: MoodPetal.CLOUDY }));
          }
        }
      ]
    },
    heart: {
      question: "Relational distance. What happened, Arjun?",
      description: "Connection is vital. Under anxiety or stress, any delay or silence triggers danger alarms in your empathetic nervous core.",
      themeColor: "from-pink-500/10 to-rose-500/5 border-pink-400/25",
      options: [
        {
          label: "We had an argument",
          subtext: "Sit with this relational friction during a quiet, validation-led chat with Mann.",
          action: () => {
            const prompt = "We had an argument and my heart feels heavy. I'm worried about the distance.";
            handleSendMessageOf(prompt);
            setActiveFeelingDestination("chat");
            setProfile(p => ({ ...p, gardenState: MoodPetal.WITHERING }));
          }
        },
        {
          label: "I feel ignored / disconnected",
          subtext: "Validate relational safety demands against your anxious attachment blueprint.",
          action: () => {
            setJournalRawThought("Someone is ignoring me, which means I'm exhausting them and they are pulling away.");
            setJournalReframedThought("Gaps in communication reflect their personal workload and calendar, not my relational worth.");
            setJournalWeightTheme("Relational Disconnect");
            setJournalStep(3);
            setActiveFeelingDestination("cbt");
            setProfile(p => ({ ...p, gardenState: MoodPetal.WITHERING }));
          }
        },
        {
          label: "Someone left / I miss them",
          subtext: "Write a raw 'Unsent Letter' to safely externalize missing them without mailing it.",
          action: () => {
            setJournalStep(2);
            setJournalWeightTheme("Unsent Letter");
            setJournalRawThought("");
            setJournalReframedThought("");
            setActiveFeelingDestination("journal");
            setProfile(p => ({ ...p, gardenState: MoodPetal.WITHERING }));
          }
        },
        {
          label: "It's complicated",
          subtext: "Express your heart's situation with poetic, slow-paced support.",
          action: () => {
            const prompt = "It's quite complicated. I just feel hurt and disconnected, and need a safe place to hold these thoughts.";
            handleSendMessageOf(prompt);
            setActiveFeelingDestination("chat");
            setProfile(p => ({ ...p, gardenState: MoodPetal.DARK }));
          }
        }
      ]
    },
    overload: {
      question: "Sensory compression. What is the overload like?",
      description: "When executive function is fully depleted, everything collides. Freezing is normal. Let's step out of the storm.",
      themeColor: "from-amber-500/10 to-orange-500/5 border-amber-400/25",
      options: [
        {
          label: "I am frozen / stuck in place",
          subtext: "Release cognitive freeze using a 60-second microaction dopamine boost challenge.",
          action: () => {
            setActiveFeelingDestination("dopamine");
            setProfile(p => ({ ...p, gardenState: MoodPetal.DARK }));
          }
        },
        {
          label: "Heavy heart rate / sensory alarm",
          subtext: "De-escalate high physiological sirens with slow somatic double-sigh exhale pacing.",
          action: () => {
            setActiveFeelingDestination("breathing");
            handleStartBreathingCycle("sigh");
            setProfile(p => ({ ...p, gardenState: MoodPetal.GROWING }));
          }
        },
        {
          label: "Brain fog / energy depletion",
          subtext: "Sit with quiet botanical feedback and water soil stats to restore foundations.",
          action: () => {
            setActiveFeelingDestination("garden");
            setProfile(p => ({ ...p, gardenState: MoodPetal.WITHERING }));
          }
        },
        {
          label: "I need to write it down",
          subtext: "Pour out heavy raw details step-by-step into a clinical ledger.",
          action: () => {
            setJournalWeightTheme("Sensory Overload");
            setJournalStep(2);
            setJournalRawThought("");
            setJournalReframedThought("");
            setActiveFeelingDestination("cbt");
          }
        }
      ]
    },
    moment: {
      question: "Conserving energy. What sounds most comforting?",
      description: "Resting is not a waste of time. It is a vital circadian reset that sustains your somatic meadow.",
      themeColor: "from-emerald-500/10 to-teal-500/5 border-emerald-400/25",
      options: [
        {
          label: "Somatic deep breathing",
          subtext: "Follow the slow, continuous 4-7-8 rhythm of the glowing sanctuary orb.",
          action: () => {
            setActiveFeelingDestination("breathing");
            handleStartBreathingCycle("478");
            setProfile(p => ({ ...p, gardenState: MoodPetal.GROWING }));
          }
        },
        {
          label: "Walk in peaceful silence",
          subtext: "A 10-minute walk guidelines list to release melatonin build-ups.",
          action: () => {
            setActiveFeelingDestination("walk");
            setProfile(p => ({ ...p, gardenState: MoodPetal.GROWING }));
          }
        },
        {
          label: "Comfort me with a poetic dialogue",
          subtext: "Open the chat stream to receive validation tailored to your system.",
          action: () => {
            const prompt = "I just need a quiet, gentle conversation to rest my thoughts.";
            handleSendMessageOf(prompt);
            setActiveFeelingDestination("chat");
          }
        },
        {
          label: "Tend to my quiet garden",
          subtext: "Examine living soil biometrics and observe visual blooms.",
          action: () => {
            setActiveFeelingDestination("garden");
            setProfile(p => ({ ...p, gardenState: MoodPetal.GROWING }));
          }
        }
      ]
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn transition-all max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center select-text">
      
      {/* 1. ONBOARDING CHANNEL */}
      {!isReturningUser && !hasNewUserFinishedOnboarding ? (
        <div id="onboarding-wizard-container" className="bg-gradient-to-tr from-slate-950 to-slate-900/40 border border-[#D4A373]/20 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md max-w-xl mx-auto w-full min-h-[500px] flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] font-serif text-9xl select-none pointer-events-none text-[#D4A373]">मन</div>
          
          {/* Header */}
          <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4 select-none">
            <span className="w-5 h-5 rounded-full bg-[#D4A373]/15 text-[#D4A373] text-[9px] font-mono font-bold flex items-center justify-center">✦</span>
            <span className="text-xs uppercase font-mono tracking-widest text-[#D4A373] font-medium">Conversational Calibration</span>
            <span className="ml-auto text-[10px] font-mono text-slate-500">
              Step {onboardStep === 'welcome' ? 1 : onboardStep === 'needs' ? 2 : onboardStep === 'coping' ? 3 : onboardStep === 'eb' ? 4 : onboardStep === 'ns' ? 5 : onboardStep === 'tf' ? 6 : onboardStep === 'jp' ? 7 : onboardStep === 'attachment' ? 8 : 9} of 9
            </span>
          </div>

          <div className="space-y-6 flex-1 flex flex-col justify-center">
            
            {/* Mann's dialog balloon */}
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-[#D4A373]/15 text-[#D4A373] flex items-center justify-center text-xs shrink-0 select-none">
                मन
              </div>
              <div className="p-4 rounded-3xl bg-slate-900/40 text-slate-200 border border-white/5 text-xs sm:text-sm font-light leading-relaxed font-sans max-w-md">
                {onboardStep === "welcome" && (
                  <p>
                    "Hey. I'm Mann (मन). I sit in the quiet space between 'I'm fine' and 'I need therapy.' I am here to support you when life is heavy. Before we begin, tell me... what name or baseline preferred title should I carry in our thoughts?"
                  </p>
                )}
                {onboardStep === "needs" && (
                  <p>
                    "Warmly met, {onboardName}. We avoid standard clinical assessments here. Instead, tell me... what general theme is sitting heaviest in your system today?"
                  </p>
                )}
                {onboardStep === "coping" && (
                  <p>
                    "I hear you. When things become overwhelming and tension runs hot, what is your default nervous system safeguard?"
                  </p>
                )}
                {onboardStep === "eb" && (
                  <p>
                    "A very understandable protection. When you need to recover energy after a heavy week, how do you naturally restore:"
                  </p>
                )}
                {onboardStep === "ns" && (
                  <p>
                    "Understood. When making key choices, do you trust your intuitive gut feelings or practical realities?"
                  </p>
                )}
                {onboardStep === "tf" && (
                  <p>
                    "When someone important shares a heavy burden with you, do you listen and validate warmly, or do you logically analyze?"
                  </p>
                )}
                {onboardStep === "jp" && (
                  <p>
                    "When handling your daily priorities, are you steadied by a clear structured listing or a flexible open space?"
                  </p>
                )}
                {onboardStep === "attachment" && (
                  <p>
                    "And finally, when someone important takes a long time to reply to your messages:"
                  </p>
                )}
                {onboardStep === "reveal" && (
                  <p>
                    "Here is what your emotional system carries, {onboardName}."
                  </p>
                )}
              </div>
            </div>

            {/* Input steps options */}
            <div className="animate-fadeIn pt-2 pl-10">
              
              {onboardStep === "welcome" && (
                <div className="space-y-4">
                  <input 
                    type="text"
                    required
                    value={onboardName}
                    onChange={(e) => setOnboardName(e.target.value)}
                    placeholder="My name is..."
                    className="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 text-xs focus:outline-none focus:border-[#D4A373]/50 focus:ring-1 focus:ring-[#D4A373]/50 transition-all font-sans font-medium placeholder-slate-550"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && onboardName.trim()) setOnboardStep("needs");
                    }}
                  />
                  <button
                    type="button"
                    disabled={!onboardName.trim()}
                    onClick={() => setOnboardStep("needs")}
                    className="px-5 py-3 bg-[#D4A373] disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-mono font-black rounded-xl hover:bg-[#c59262] transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg active:scale-98"
                  >
                    <span>Begin calibration</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {onboardStep === "needs" && (
                <div className="grid grid-cols-1 gap-2 max-w-sm">
                  {[
                    { val: "Stress", label: "Stress (High operational pressure)", emoji: "🤯" },
                    { val: "Anxiety", label: "Anxiety (Panic spirals / cycles)", emoji: "😰" },
                    { val: "Relationships", label: "Relationships (Friction or cold silence)", emoji: "💔" },
                    { val: "Motivation", label: "Motivation (Executive depletion / freeze)", emoji: "🔥" },
                    { val: "Loneliness", label: "Loneliness (Isolation cold spots)", emoji: "🌧" },
                    { val: "Self Growth", label: "Self Growth (Circadian calibration)", emoji: "🌱" }
                  ].map(item => (
                    <button
                      key={item.val}
                      onClick={() => {
                        setOnboardFocus(item.val);
                        setOnboardStep("coping");
                      }}
                      className="w-full text-left p-3 rounded-xl bg-white/[0.02] hover:bg-[#D4A373]/12 border border-white/5 hover:border-[#D4A373]/25 text-xs text-slate-300 transition-all flex items-center gap-3 cursor-pointer"
                    >
                      <span>{item.emoji}</span>
                      <span className="font-light">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {onboardStep === "coping" && (
                <div className="grid grid-cols-1 gap-2 max-w-sm">
                  {[
                    { val: "Talk to someone", label: "Talk to someone (Relational connection)", emoji: "🗣" },
                    { val: "Keep it inside", label: "Keep it locked inside (Internal chamber)", emoji: "🔒" },
                    { val: "Write it down", label: "Write it down (Linguistic externalization)", emoji: "✏️" },
                    { val: "Distract myself", label: "Distract my mind (Cognitive spacing)", emoji: "🎮" }
                  ].map(item => (
                    <button
                      key={item.val}
                      onClick={() => {
                        setOnboardCoping(item.val);
                        setOnboardStep("eb");
                      }}
                      className="w-full text-left p-3 rounded-xl bg-white/[0.02] hover:bg-[#D4A373]/12 border border-white/5 hover:border-[#D4A373]/25 text-xs text-slate-300 transition-all flex items-center gap-3 cursor-pointer"
                    >
                      <span>{item.emoji}</span>
                      <span className="font-light">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {onboardStep === "eb" && (
                <div className="space-y-2 max-w-sm text-left">
                  <button
                    onClick={() => { setOnboardDimE("I"); setOnboardStep("ns"); }}
                    className="w-full text-left p-3.5 rounded-xl bg-white/[0.02] hover:bg-[#D4A373]/12 border border-white/5 hover:border-[#D4A373]/25 text-xs text-slate-300 font-light leading-relaxed cursor-pointer"
                  >
                    ○ Spend quiet time completely alone in my thoughts and creative space
                  </button>
                  <button
                    onClick={() => { setOnboardDimE("E"); setOnboardStep("ns"); }}
                    className="w-full text-left p-3.5 rounded-xl bg-white/[0.02] hover:bg-[#D4A373]/12 border border-white/5 hover:border-[#D4A373]/25 text-xs text-slate-300 font-light leading-relaxed cursor-pointer"
                  >
                    ○ Spend time around trusted companions to share experiences
                  </button>
                </div>
              )}

              {onboardStep === "ns" && (
                <div className="space-y-2 max-w-sm text-left">
                  <button
                    onClick={() => { setOnboardDimN("N"); setOnboardStep("tf"); }}
                    className="w-full text-left p-3.5 rounded-xl bg-white/[0.02] hover:bg-[#D4A373]/12 border border-white/5 hover:border-[#D4A373]/25 text-xs text-slate-300 font-light leading-relaxed cursor-pointer"
                  >
                    ○ Visceral gut feelings, inspiration, and exploring what could be
                  </button>
                  <button
                    onClick={() => { setOnboardDimN("S"); setOnboardStep("tf"); }}
                    className="w-full text-left p-3.5 rounded-xl bg-white/[0.02] hover:bg-[#D4A373]/12 border border-white/5 hover:border-[#D4A373]/25 text-xs text-slate-300 font-light leading-relaxed cursor-pointer"
                  >
                    ○ Hard reality facts, proven models, and concrete practical history
                  </button>
                </div>
              )}

              {onboardStep === "tf" && (
                <div className="space-y-2 max-w-sm text-left">
                  <button
                    onClick={() => { setOnboardDimT("F"); setOnboardStep("jp"); }}
                    className="w-full text-left p-3.5 rounded-xl bg-white/[0.02] hover:bg-[#D4A373]/12 border border-white/5 hover:border-[#D4A373]/25 text-xs text-slate-300 font-light leading-relaxed cursor-pointer"
                  >
                    ○ Listen warmly, offer holding safety, and ensure they feel emotionally valid
                  </button>
                  <button
                    onClick={() => { setOnboardDimT("T"); setOnboardStep("jp"); }}
                    className="w-full text-left p-3.5 rounded-xl bg-white/[0.02] hover:bg-[#D4A373]/12 border border-white/5 hover:border-[#D4A373]/25 text-xs text-slate-300 font-light leading-relaxed cursor-pointer"
                  >
                    ○ Analyze the issues logically, identify friction, and find steady resolutions
                  </button>
                </div>
              )}

              {onboardStep === "jp" && (
                <div className="space-y-2 max-w-sm text-left">
                  <button
                    onClick={() => { setOnboardDimJ("J"); setOnboardStep("attachment"); }}
                    className="w-full text-left p-3.5 rounded-xl bg-white/[0.02] hover:bg-[#D4A373]/12 border border-white/5 hover:border-[#D4A373]/25 text-xs text-slate-300 font-light leading-relaxed cursor-pointer"
                  >
                    ○ A clear pathway, daily list, and checking things off systematically
                  </button>
                  <button
                    onClick={() => { setOnboardDimJ("P"); setOnboardStep("attachment"); }}
                    className="w-full text-left p-3.5 rounded-xl bg-white/[0.02] hover:bg-[#D4A373]/12 border border-white/5 hover:border-[#D4A373]/25 text-xs text-slate-300 font-light leading-relaxed cursor-pointer"
                  >
                    ○ Fluid spaces, tracking what flows in the hour, leaving options open
                  </button>
                </div>
              )}

              {onboardStep === "attachment" && (
                <div className="space-y-2 max-w-sm text-left">
                  {[
                    { val: "Anxious", label: "○ 'I worry something is wrong, checking my inbox repeatedly.'" },
                    { val: "Avoidant", label: "○ 'I try not to think about it, keeping a self-reliant distance.'" },
                    { val: "Secure", label: "○ 'They are probably busy. I feel secure in our core connection.'" },
                    { val: "Fearful-Avoidant", label: "○ 'I feel anxious of rejection or freeze, but hesitant to text.'" }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => {
                        setOnboardAttachmentVal(opt.val as any);
                        setOnboardStep("reveal");
                      }}
                      className="w-full text-left p-3 rounded-xl bg-white/[0.02] hover:bg-[#D4A373]/12 border border-white/5 hover:border-[#D4A373]/25 text-xs text-slate-305 font-light leading-relaxed cursor-pointer"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {onboardStep === "reveal" && (
                <div className="space-y-6 max-w-md -ml-6 border-t border-white/5 pt-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[#D4A373] text-[9.5px] font-mono tracking-widest uppercase font-black">Intake Synthesis Completed</span>
                    <h3 className="text-md font-serif text-slate-100 font-medium pb-2">
                      "I understand how your emotional roots align."
                    </h3>
                  </div>

                  <div className="p-5 bg-[#D4A373]/5 border border-[#D4A373]/20 rounded-2xl space-y-4">
                    <p className="text-xs font-light text-slate-300 italic font-serif leading-relaxed">
                      "You process loops deeply, {onboardName}. Silences or gaps can trigger relational alarms in your empathetic system—not because of a weakness, but because you possess a highly attuned heart. Let's garden this soil together."
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5 text-left">
                      <div>
                        <span className="text-[8px] uppercase font-mono text-[#D4A373] tracking-widest block">Core Style</span>
                        <span className="text-xs text-slate-200 font-medium">{onboardAttachmentVal} Attachment</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase font-mono text-[#D4A373] tracking-widest block">Personality Type</span>
                        <span className="text-xs text-slate-200 font-medium">The {onboardDimE}{onboardDimN}{onboardDimT}{onboardDimJ} Lens</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setOnboardStep("welcome")}
                      className="px-3 py-1.5 text-[9px] font-mono text-slate-500 hover:text-slate-300 uppercase cursor-pointer"
                    >
                      🔄 Reset Calibration
                    </button>
                    <button
                      type="button"
                      onClick={handleFinalizeOnboarding}
                      className="px-5 py-3 bg-[#D4A373] text-slate-950 text-xs font-mono font-black rounded-xl hover:bg-[#c59262] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                      <span>Enter Sanctuary</span>
                      <Leaf className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      ) : (
        
        // 2. RETURNING USER CENTRAL GUIDED SANCTUARY ORB ENVIRONMENT
        <div className="w-full flex flex-col space-y-6">
          
          {activeFeelingDestination ? (
            
            // IF INTERVENTIVE VIEW IN SANCTUARY IS LAUNCHED
            <div className="animate-fadeIn w-full flex flex-col space-y-4">
              
              {/* Back to Central Sanctuary bar */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <button
                  onClick={() => {
                    setActiveFeeling(null);
                    setActiveFeelingDestination(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-[#D4A373]/15 border border-white/10 hover:border-[#D4A373]/30 text-[10px] font-mono uppercase tracking-wider text-slate-350 hover:text-[#D4A373] transition-all cursor-pointer flex items-center gap-1.5 shadow-lg active:scale-95"
                >
                  <span>← Return to Sanctuary Portal</span>
                </button>
                <span className="text-[9px] font-mono text-slate-500 uppercase">
                  ACTIVE GROUNDING COMPANION
                </span>
              </div>

              {/* RENDER DYNAMIC COMPONENT */}
              <div className="w-full">
                
                {/* 1. CHAT CORE DISPLAY */}
                {activeFeelingDestination === "chat" && (
                  <div className="w-full max-w-4xl mx-auto">
                    {renderWhispersChat(true)}
                  </div>
                )}

                {/* 2. CBT COMPASSION REFLECTION */}
                {activeFeelingDestination === "cbt" && (
                  <div className="max-w-xl mx-auto w-full bg-slate-950/40 border border-[#D4A373]/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
                    <span className="text-[8px] font-mono bg-[#D4A373]/15 text-[#D4A373] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">Holding Space Engine</span>
                    <h3 className="text-lg font-serif font-bold text-slate-200 mt-2">The CBT Thought Untangler</h3>
                    <p className="text-xs text-slate-400 font-light leading-relaxed mb-6">Disassemble raw automatic thoughts using compassionate double-standard tests.</p>

                    {journalSuccessNotification ? (
                      <div className="py-12 px-6 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl text-center space-y-4 animate-fadeIn">
                        <span className="text-3xl">🌿</span>
                        <h4 className="text-sm font-serif font-medium text-emerald-450">Reframe Anchored Safely</h4>
                        <p className="text-xs text-slate-300 font-light leading-relaxed max-w-xs mx-auto">
                          "Your reframe is anchored. Internal environment soil statistics updated dynamically. Rest here when ready."
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSaveThoughtReframe} className="space-y-5 text-left">
                        <div>
                          <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">1. Isolate Raw Worry Thought:</label>
                          <input 
                            type="text" 
                            value={journalRawThought} 
                            onChange={(e) => setJournalRawThought(e.target.value)} 
                            placeholder="e.g. My friend hasn't replied. I must be exhausting them." 
                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#D4A373]/50" 
                            required
                          />
                        </div>

                        <div className="p-3 bg-[#D4A373]/5 border border-[#D4A373]/20 rounded-2xl">
                          <span className="text-[8.5px] uppercase font-mono text-amber-500 block mb-1 font-bold">Cognitive distortion filter: Mind-reading / checking bias</span>
                          <p className="text-[10px] text-slate-400 font-light leading-snug">
                            "When we lack immediate relational confirmation, our protective attachment styles convert fatigue into abandonment alerts."
                          </p>
                        </div>

                        <div>
                          <label className="block text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">2. Draft a Compassionate Reframe:</label>
                          <textarea 
                            rows={3} 
                            value={journalReframedThought} 
                            onChange={(e) => setJournalReframedThought(e.target.value)} 
                            placeholder="What would you tell a friend carrying this load?" 
                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-[#D4A373]/50" 
                            required
                          />
                        </div>

                        <button 
                          type="submit" 
                          className="w-full py-2.5 bg-emerald-500 text-slate-950 text-xs font-mono font-black rounded-xl hover:bg-emerald-600 transition-colors shadow-lg cursor-pointer"
                        >
                          ✓ Settle and Water Roots
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* 3. GUIDED JOURNALING (UNSENT LETTER) */}
                {activeFeelingDestination === "journal" && (
                  <div className="max-w-xl mx-auto w-full bg-slate-950/40 border border-[#D4A373]/20 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                    <span className="text-[8px] font-mono bg-[#D4A373]/15 text-[#D4A373] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">Oxytocin Ritual</span>
                    <h3 className="text-lg font-serif font-bold text-slate-200 mt-2">The Unsent Letter</h3>
                    <p className="text-xs text-slate-400 font-light leading-relaxed mb-6">Write down raw emotional weight directed outwards. Keeping it completely safe, unmailed, and contained.</p>

                    {journalSuccessNotification ? (
                      <div className="py-12 px-6 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl text-center space-y-4 animate-fadeIn">
                        <span className="text-3xl">✉️</span>
                        <h4 className="text-sm font-serif font-medium text-emerald-450">Written into Safe Ledger</h4>
                        <p className="text-xs text-slate-300 font-light leading-relaxed max-w-xs mx-auto">
                          "Your letter is safely held in your encrypted local cabinet. The emotional charge has been unweighted. Return when ready."
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 text-left">
                        <p className="text-xs text-slate-300 font-serif italic">"Dear person, here is what I have carried..."</p>
                        <textarea
                          rows={5}
                          value={journalRawThought}
                          onChange={(e) => setJournalRawThought(e.target.value)}
                          placeholder="Write completely unfiltered. This will never be sent to anyone."
                          className="w-full bg-[#1e201e]/30 border border-white/5 rounded-xl p-3 text-xs text-slate-200 font-sans tracking-wide leading-relaxed focus:outline-none"
                        />
                        <button
                          type="button"
                          disabled={!journalRawThought.trim()}
                          onClick={() => {
                            setThoughtRecords(prev => [
                              {
                                id: `${Date.now()}`,
                                pattern: "Oxytocin Activation: Unsent Letter",
                                original: "Written to preserve internal equilibrium.",
                                alternative: "Contained safe reflection without social friction.",
                                timestamp: "Just now"
                              },
                              ...prev
                            ]);
                            setProfile(p => ({ ...p, streak: p.streak + 1 }));
                            setJournalSuccessNotification(true);
                            setJournalRawThought("");
                            setTimeout(() => setJournalSuccessNotification(false), 3000);
                          }}
                          className="w-full py-2.5 bg-[#D4A373] text-slate-950 text-xs font-mono font-black rounded-xl hover:bg-[#c59262] cursor-pointer"
                        >
                          ✓ Contain in Closet
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. ACTIVE BREATH pacers */}
                {activeFeelingDestination === "breathing" && (
                  <div className="max-w-xl mx-auto w-full bg-slate-950/50 border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
                    <span className="px-2.5 py-0.5 rounded-full text-[8.5px] font-mono font-black bg-indigo-500/10 text-indigo-400 uppercase tracking-widest border border-indigo-500/20">
                      Somatic Heart-Rate Reset
                    </span>
                    <h3 className="text-lg font-serif font-light text-slate-200">Physiological Breathing Sync</h3>

                    <div className="py-6 flex justify-center">
                      {renderBeautifulBreathingOrb("w-44 h-44")}
                    </div>

                    <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl max-w-sm mx-auto select-text">
                      <p className="text-xs text-slate-200 font-sans leading-relaxed min-h-[40px]">
                        "{breathLogOutput || "Select a clinical pacing structure below to unlock calm."}"
                      </p>
                    </div>

                    <div className="flex gap-2 max-w-xs mx-auto">
                      <button 
                        type="button"
                        onClick={() => handleStartBreathingCycle("sigh")} 
                        className="flex-1 py-1.5 bg-[#D4A373] hover:bg-[#c59262] text-slate-950 text-[10px] font-mono font-black rounded-xl transition-all cursor-pointer shadow-md"
                      >
                        Double-Sigh
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleStartBreathingCycle("478")} 
                        className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-305 text-[10px] font-mono rounded-xl transition-all cursor-pointer"
                      >
                        4-7-8 Sync
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. DOPAMINE CHORES */}
                {activeFeelingDestination === "dopamine" && (
                  <div className="max-w-xl mx-auto w-full bg-slate-950/40 border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center space-y-4">
                    <span className="px-2 py-0.5 rounded-full text-[8.5px] font-mono font-black bg-amber-500/15 text-amber-400 uppercase tracking-widest">
                      Executive Spark
                    </span>
                    <h3 className="text-lg font-serif text-slate-200">The 60-Second Momentum Boost</h3>
                    <p className="text-xs text-slate-400 font-light max-w-sm mx-auto">Choose one tiny microaction requiring under 60 seconds to release a frozen mind state. Do not overthink.</p>

                    {activeDopamineChore ? (
                      <div className="bg-slate-950 p-6 rounded-2xl border border-[#D4A373]/20 space-y-4 max-w-xs mx-auto">
                        <div className="text-center">
                          <span className="text-[9px] font-mono uppercase text-[#D4A373]">Momentum timer</span>
                          <div className="text-3xl font-serif text-amber-500 font-bold mt-1">{dopamineTimer}s left</div>
                        </div>
                        <p className="text-xs text-slate-300">Active Task: <strong>{activeDopamineChore}</strong></p>
                        <button 
                          onClick={handleFinishDopamineChore} 
                          className="w-full py-2 bg-amber-500 text-slate-950 text-xs font-mono font-black rounded-lg hover:bg-amber-600 transition-colors cursor-pointer"
                        >
                          Mark Completed ✓
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                          {[
                            { label: "Wipe down screen", emoji: "🧼" },
                            { label: "Align coffee mug", emoji: "☕" },
                            { label: "Arrange one book", emoji: "📚" },
                            { label: "Sip hydration", emoji: "💧" }
                          ].map(chore => (
                            <button
                              key={chore.label}
                              onClick={() => handleStartDopamineChore(chore.label)}
                              className="p-3 bg-slate-900/60 border border-white/5 hover:border-[#D4A373]/20 hover:bg-white/[0.01] rounded-xl text-left text-xs transition-all flex items-center gap-2 cursor-pointer"
                            >
                              <span>{chore.emoji}</span>
                              <span className="text-slate-300 font-light truncate">{chore.label}</span>
                            </button>
                          ))}
                        </div>

                        {dopamineChoreCompleted && (
                          <div className="p-3 bg-emerald-950/20 border border-emerald-500/10 rounded-2xl max-w-xs mx-auto animate-fadeIn select-none">
                            <span className="text-xs font-mono text-emerald-400">✓ Moment boost recorded! Momentum builds now.</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 6. EXPANDED BEAUTIFUL GARDEN BIOME */}
                {activeFeelingDestination === "garden" && (
                  <div className="w-full space-y-6">
                    <div className="border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative min-h-[380px]">
                      <GardenCanvas 
                        mood={profile.gardenState}
                        streak={profile.streak}
                        ritualsWatered={thoughtRecords.length}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-1.5">
                        <span className="text-xs text-slate-500 block">💧 Soil Hydration</span>
                        <span className="text-md font-mono font-bold text-emerald-400">{75 + thoughtRecords.length * 5}%</span>
                      </div>
                      <div className="p-4 bg-slate-950/40 border border-[#D4A373]/20 rounded-2xl space-y-1.5">
                        <span className="text-xs text-[#D4A373] block">⚡ Biological Vitals</span>
                        <span className="text-md font-mono font-bold text-amber-300">{profile.streak * 1.5} mmol</span>
                      </div>
                      <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-1.5">
                        <span className="text-xs text-slate-500 block">🌿 Active Sprouts</span>
                        <span className="text-md font-mono font-bold text-sky-400">{2 + thoughtRecords.length} Sprouts</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. WALK IN PEACEFUL SILENCE (PHONELESS WALK) */}
                {activeFeelingDestination === "walk" && (
                  <div className="max-w-xl mx-auto w-full bg-gradient-to-tr from-slate-950 to-[#122e23]/30 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                    <span className="px-2 py-0.5 rounded-full text-[8.5px] font-mono font-black bg-emerald-400/15 text-emerald-400 uppercase tracking-widest border border-emerald-500/20">
                      Circadian Serotonin Pacing
                    </span>
                    <div className="text-left space-y-2">
                      <h3 className="text-lg font-serif font-black text-slate-200">The 10-Minute Phoneless Walk</h3>
                      <p className="text-xs text-slate-400 font-light leading-relaxed">
                        "Shedding devices and looking at the continuous horizon resets our retina master clock. This resets high structural stress. Sit with these guidelines and walk cleanly in presence."
                      </p>
                    </div>

                    <div className="space-y-3.5 text-left pt-2 border-t border-white/5">
                      {[
                        { stage: "Clear the Threshold", desc: "Leave all digital devices in your closet. Place one hand on your chest, breathe once, and walk out." },
                        { stage: "Horizon-Level Vision", desc: "Keep your gaze flat and scanning steady. Avoid looking at the pavement; let your peripheral vision feed depth to your cortex." },
                        { stage: "Pulsate Footfalls", desc: "Coordinate your paces to match the gentle, slow pulsation of the Sanctuary Orb." }
                      ].map((step, sIdx) => (
                        <div key={sIdx} className="p-3 bg-black/20 rounded-xl border border-white/[0.02] flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-[#D4A373]/15 text-[#D4A373] text-[9px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">{sIdx+1}</span>
                          <div className="space-y-0.5 min-w-0">
                            <h4 className="text-xs font-serif font-bold text-slate-200">{step.stage}</h4>
                            <p className="text-[10px] text-slate-400 font-light leading-snug">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setProfile(prev => ({
                          ...prev,
                          streak: prev.streak + 1,
                          doseBalance: { ...prev.doseBalance, serotonin: "Balanced & Restored" },
                          lastRitualCompleted: "The 10-Minute Walk"
                        }));
                        setThoughtRecords(prev => [
                          {
                            id: `walk-${Date.now()}`,
                            pattern: "Circadian Serotonin Alignment",
                            original: "Felt mentally foggy, stuck inside, and hyperactive.",
                            alternative: "Completed a quiet phoneless 10-minute horizon walk. Master circadian network calibrated.",
                            timestamp: "Just now"
                          },
                          ...prev
                        ]);
                        setJournalSuccessNotification(true);
                        setTimeout(() => {
                          setJournalSuccessNotification(false);
                          setActiveFeeling(null);
                          setActiveFeelingDestination(null);
                        }, 3000);
                      }}
                      className="w-full py-2.5 bg-emerald-500 text-slate-950 text-xs font-mono font-black rounded-xl hover:bg-emerald-600 cursor-pointer shadow-lg transition-transform active:scale-98"
                    >
                      ✓ Seal Walk Ritual Complete
                    </button>
                    {journalSuccessNotification && <span className="text-[10px] text-emerald-400 block animate-pulse">✓ Moisture absorbed into garden biome soil stats!</span>}
                  </div>
                )}

              </div>

            </div>
          ) : (
            
            // THE DEFAULT SACRED HOME SCREEN: CALM FEELING ENTRANCE VIEW
            <div className="space-y-8 animate-fadeIn max-w-xl mx-auto w-full text-center py-6 sm:py-10 flex flex-col justify-center min-h-[500px]">
              
              {/* Climate state line indicator */}
              <div className="flex justify-center items-center gap-1.5 text-[10px] font-mono text-slate-500 select-none">
                <span>Streak:</span>
                <span className="text-amber-500 flex items-center gap-0.5 font-bold">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  {profile.streak} Days
                </span>
                <span className="mx-1">•</span>
                <span>Biome Climate:</span>
                <span className="text-[#D4A373] font-black">{profile.gardenState}</span>
              </div>

              {/* Glowing breathing SVG/CSS Orb */}
              <div className="flex flex-col items-center justify-center space-y-4 py-2 select-none relative">
                <div 
                  onClick={() => {
                    setActiveFeelingDestination("breathing");
                    if (breathPhase === "idle") {
                      handleStartBreathingCycle("sigh");
                    }
                  }}
                  className="cursor-pointer font-sans"
                >
                  {renderBeautifulBreathingOrb("w-36 h-36")}
                </div>
              </div>

              {/* Emotion Selector Panel */}
              <div className="space-y-4">
                <div className="space-y-1 select-none">
                  <h3 className="text-lg font-serif font-light text-slate-100">
                    "What's feeling hardest right now, {profile.name || "traveller"}?"
                  </h3>
                </div>

                {activeFeeling ? (
                  
                  // Active Sub-Step Stepper inside Sanctuary
                  <div className={`p-5 rounded-3xl bg-gradient-to-tr ${feelingMapping[activeFeeling].themeColor} border border-[#D4A373]/20 space-y-4 animate-scaleUp text-left max-w-md mx-auto relative overflow-hidden backdrop-blur-md`}>
                    
                    <div className="flex justify-between items-start border-b border-white/5 pb-2">
                      <span className="text-[9px] font-mono text-[#D4A373] uppercase tracking-widest font-black">Under calibration check</span>
                      <button 
                        onClick={() => setActiveFeeling(null)}
                        className="text-[10px] font-mono text-slate-400 hover:text-white"
                      >
                        ← Back
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-sm font-serif font-semibold text-slate-200">
                        {feelingMapping[activeFeeling].question}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                        {feelingMapping[activeFeeling].description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2 pt-2">
                      {feelingMapping[activeFeeling].options.map(opt => (
                        <button
                          key={opt.label}
                          onClick={opt.action}
                          className="p-3 text-left bg-black/40 hover:bg-[#D4A373]/10 border border-white/5 hover:border-[#D4A373]/20 rounded-xl transition-all cursor-pointer group"
                        >
                          <span className="text-xs font-medium text-slate-200 group-hover:text-white block">
                            ○ {opt.label}
                          </span>
                          <span className="text-[9.5px] text-slate-500 group-hover:text-slate-400 block font-light leading-snug mt-0.5">
                            {opt.subtext}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                ) : (

                  // Effortless Primary choices
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                    {[
                      { key: "mind", label: "😰 My mind won't stop", sub: "Overthinking, doubt loops", color: "hover:border-sky-500/40 hover:bg-sky-950/10" },
                      { key: "heart", label: "💔 My heart hurts", sub: "Relationship delays, silence, coldness", color: "hover:border-pink-500/40 hover:bg-pink-950/10" },
                      { key: "overload", label: "😵 Everything feels too much", sub: "Executive freeze, severe tension, stress", color: "hover:border-amber-500/40 hover:bg-amber-950/10" },
                      { key: "moment", label: "🌙 I just need a moment", sub: "Conserving energy, quiet grounding, rest", color: "hover:border-emerald-500/40 hover:bg-emerald-950/10" }
                    ].map(item => (
                      <button
                        key={item.key}
                        onClick={() => setActiveFeeling(item.key)}
                        className={`p-4 rounded-2xl bg-slate-950/40 border border-white/5 ${item.color} text-left transition-all duration-350 cursor-pointer shadow-md hover:-translate-y-0.5 active:translate-y-0`}
                      >
                        <span className="text-xs font-semibold text-slate-200 block">{item.label}</span>
                        <span className="text-[9.5px] text-slate-550 font-light block leading-snug mt-1">{item.sub}</span>
                      </button>
                    ))}
                  </div>

                )}
              </div>

            </div>

          )}

        </div>
      )}
    </div>
  );
}
