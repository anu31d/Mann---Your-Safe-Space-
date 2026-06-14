/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MoodPetal } from "../types";
import { Sparkles, CloudRain, Sun, Moon, Leaf, LineChart as ChartIcon, Calendar, Activity, Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line,
  ReferenceLine
} from "recharts";

interface GardenCanvasProps {
  mood: MoodPetal;
  streak: number;
  ritualsWatered: number;
}

export default function GardenCanvas({ mood, streak, ritualsWatered }: GardenCanvasProps) {
  const [activeTab, setActiveTab] = useState<"live" | "history">("live");

  // Configs based on mood
  const getMoodConfig = () => {
    switch (mood) {
      case MoodPetal.BLOOMING:
        return {
          title: "Blooming Garden",
          desc: "Your inner world is high energy and vitalized. Flowers are opening.",
          bgGradient: "from-[#1a1c32] via-[#2d1b4e] to-[#40203f]",
          accentColor: "text-pink-400",
          particleColor: "bg-pink-300/40",
          statusText: "Vibrant & Expressive",
          icon: <Sun className="w-5 h-5 text-amber-300 animate-spin-slow" />
        };
      case MoodPetal.GROWING:
        return {
          title: "Growing Meadow",
          desc: "Fleshing out steady foundations. Fresh green shoots taking hold.",
          bgGradient: "from-[#0d1c24] via-[#0f2e2d] to-[#164132]",
          accentColor: "text-emerald-400",
          particleColor: "bg-emerald-300/30",
          statusText: "Steady Grounding",
          icon: <Leaf className="w-5 h-5 text-emerald-300 animate-pulse" />
        };
      case MoodPetal.CLOUDY:
        return {
          title: "Cloudy Solitude",
          desc: "Unsettled winds and overcast thoughts. It is safe to rest here.",
          bgGradient: "from-[#111625] via-[#1c2333] to-[#252f44]",
          accentColor: "text-sky-300",
          particleColor: "bg-sky-200/20",
          statusText: "Gentle Flow (Patience)",
          icon: <CloudRain className="w-5 h-5 text-sky-300 animate-bounce" />
        };
      case MoodPetal.WITHERING:
        return {
          title: "Withering Autumn",
          desc: "Energy is depleted. Gently shedding leaves that no longer serve.",
          bgGradient: "from-[#1c1412] via-[#2e1d15] to-[#3a2012]",
          accentColor: "text-amber-500",
          particleColor: "bg-amber-500/15",
          statusText: "Conserving Depleted Energy",
          icon: <Leaf className="w-5 h-5 text-amber-500" />
        };
      case MoodPetal.DARK:
      default:
        return {
          title: "Nocturnal Sanctuary",
          desc: "Struggling or numb. Sitting in quiet, moonlit restorative dark.",
          bgGradient: "from-[#08080f] via-[#0e0e1a] to-[#151221]",
          accentColor: "text-indigo-400",
          particleColor: "bg-purple-300/10",
          statusText: "Restorative Incubation",
          icon: <Moon className="w-5 h-5 text-indigo-300" />
        };
    }
  };

  const config = getMoodConfig();

  // Helper converters for Recharts mapping
  const moodToNumeric = (m: MoodPetal) => {
    switch (m) {
      case MoodPetal.BLOOMING: return 5;
      case MoodPetal.GROWING: return 4;
      case MoodPetal.CLOUDY: return 3;
      case MoodPetal.WITHERING: return 2;
      case MoodPetal.DARK: return 1;
      default: return 3;
    }
  };

  const moodToEmoji = (m: MoodPetal) => {
    switch (m) {
      case MoodPetal.BLOOMING: return "🌸";
      case MoodPetal.GROWING: return "🌿";
      case MoodPetal.CLOUDY: return "🌧";
      case MoodPetal.WITHERING: return "🍂";
      case MoodPetal.DARK: return "🌑";
      default: return "🌿";
    }
  };

  // 7-day emotional log dataset
  const moodHistoryData = [
    { day: "06/03", moodVal: 5, moodName: "Blooming", emoji: "🌸" },
    { day: "06/04", moodVal: 4, moodName: "Growing", emoji: "🌿" },
    { day: "06/05", moodVal: 3, moodName: "Cloudy", emoji: "🌧" },
    { day: "06/06", moodVal: 1, moodName: "Dark", emoji: "🌑" },
    { day: "06/07", moodVal: 4, moodName: "Growing", emoji: "🌿" },
    { day: "06/08", moodVal: 3, moodName: "Cloudy", emoji: "🌧" },
    { day: "Today", moodVal: moodToNumeric(mood), moodName: mood, emoji: moodToEmoji(mood) }
  ];

  // Custom formatted labels for chart axes
  const formatYAxis = (tick: number) => {
    switch (tick) {
      case 5: return "🌸 Bloom";
      case 4: return "🌿 Grow";
      case 3: return "🌧 Cloud";
      case 2: return "🍂 Wither";
      case 1: return "🌑 Dark";
      default: return "";
    }
  };

  // Custom tooltips for nice styling
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const getInterpretation = (name: string) => {
        switch (name) {
          case "Blooming": return "Vitalized, open & expressive";
          case "Growing": return "Steady progress & grounded ok";
          case "Cloudy": return "Drooping thoughts, carrying uncertainty";
          case "Withering": return "Shedding loads, energy low";
          case "Dark": return "Restorative dark, incubating strength";
          default: return "Processing";
        }
      };

      return (
        <div className="bg-slate-950/95 border border-[#D4A373]/40 rounded-2xl p-3 shadow-2xl backdrop-blur-md">
          <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Atmosphere Record</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-base">{data.emoji}</span>
            <span className="text-sm font-serif font-semibold text-[#D4A373]">{data.moodName}</span>
            <span className="text-[10px] font-mono text-slate-400 ml-auto">{data.day}</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1.5 italic font-sans border-t border-white/5 pt-1.5">
            "{getInterpretation(data.moodName)}"
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="garden-visualizer-card" className="bg-slate-950/60 border border-white/10 rounded-3xl p-5 sm:p-6 relative overflow-hidden backdrop-blur-md shadow-2xl flex flex-col justify-between h-full min-h-[410px] transition-all duration-300 hover:border-[#D4A373]/35 group/canvas hover:shadow-3xl">
      
      {/* Dynamic Ambient Background under the Garden */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} transition-all duration-1000 opacity-40 z-0`} />

      {/* Grid Pattern overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

      {/* Decorative corner glow */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#D4A373]/10 rounded-full blur-2xl pointer-events-none group-hover/canvas:bg-[#D4A373]/20 transition-all duration-500"></div>

      {/* Content Header */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-3.5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#D4A373] font-black">Ecosystem Biometrics</span>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-950/70 backdrop-blur-md border border-white/5 ${config.accentColor}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {mood}
            </span>
          </div>
          <h3 className="font-serif text-xl font-semibold text-slate-100 tracking-tight flex items-center gap-1.5">
            {activeTab === "live" ? config.title : "7-Day Climate Curve"}
          </h3>
        </div>

        {/* Dynamic View Toggle Selector */}
        <div className="flex gap-1 p-0.5 bg-slate-950/60 rounded-xl border border-white/5 shadow-inner self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setActiveTab("live")}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === "live" 
                ? "bg-[#D4A373] text-[#121412] shadow-md" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Ecosystem
          </button>
          
          <button
            onClick={() => setActiveTab("history")}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === "history" 
                ? "bg-[#D4A373] text-[#121412] shadow-md" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ChartIcon className="w-3.5 h-3.5" />
            7-Day Pulse
          </button>
        </div>
      </div>

      {/* Dynamic Content Display with Framer Motion AnimatePresence */}
      <div className="relative flex-1 flex flex-col justify-center min-h-[220px] z-10 py-2">
        <AnimatePresence mode="wait">
          {activeTab === "live" ? (
            <motion.div 
              key="live-canvas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full flex-1 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              {/* Left Side: Interactive Botanical SVGs */}
              <div className="w-full sm:w-2/3 h-full flex items-center justify-center pointer-events-none min-h-[160px]">
                <svg viewBox="0 0 400 200" className="w-full h-full max-h-[180px] drop-shadow-3xl">
                  {/* Ground */}
                  <path d="M 10,180 Q 200,165 390,180 L 390,200 L 10,200 Z" fill="#06080c" opacity="0.95" />
                  <path d="M 30,182 Q 200,172 370,182" stroke="#1e293b" strokeWidth="2.5" fill="none" opacity="0.3" />

                  {/* Render Garden Plants based on state */}
                  <AnimatePresence mode="wait">
                    <motion.g
                      key={mood}
                      style={{ transformOrigin: "bottom center" }}
                      initial={{ opacity: 0, scaleY: 0.7, y: 10 }}
                      animate={{ opacity: 1, scaleY: 1, y: 0 }}
                      exit={{ opacity: 0, scaleY: 0.8, y: 5 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 85,
                        damping: 15,
                        mass: 1.2
                      }}
                    >
                      {mood === MoodPetal.BLOOMING && (
                        <>
                          {/* 1. Tall Central Pink Lotus */}
                          <path d="M 200,180 Q 205,130 195,95" stroke="#059669" strokeWidth="5.5" fill="none" strokeLinecap="round" />
                          <path d="M 195,145 Q 165,140 172,130 Q 188,135 197,148 Z" fill="#047857" />
                          <path d="M 198,125 Q 228,120 220,110 Q 208,115 198,125 Z" fill="#10b981" />
                          
                          <g transform="translate(195, 90)" className="animate-pulse">
                            {/* Layered Lotus petals */}
                            <circle cx="0" cy="0" r="14" fill="#fb7185" opacity="0.6" />
                            <ellipse cx="0" cy="-15" rx="9" ry="14" fill="#ec4899" />
                            <ellipse cx="14" cy="-5" rx="13" ry="9" fill="#ec4899" />
                            <ellipse cx="-14" cy="-5" rx="13" ry="9" fill="#ec4899" />
                            <ellipse cx="10" cy="10" rx="12" ry="10" fill="#f43f5e" />
                            <ellipse cx="-10" cy="10" rx="12" ry="10" fill="#f43f5e" />
                            <ellipse cx="8" cy="-11" rx="11" ry="11" fill="#fb7185" />
                            <ellipse cx="-8" cy="-11" rx="11" ry="11" fill="#fb7185" />
                            {/* Inner core */}
                            <circle cx="0" cy="0" r="7" fill="#facc15" />
                            <circle cx="0" cy="0" r="5" fill="#ffffff" opacity="0.6" />
                          </g>

                          {/* 2. Left Tall Red Tulip */}
                          <path d="M 120,180 Q 115,140 120,115" stroke="#047857" strokeWidth="4" fill="none" strokeLinecap="round" />
                          <path d="M 118,150 Q 95,145 105,135 Q 115,140 118,150 Z" fill="#059669" />
                          <g transform="translate(120, 110)">
                            <path d="M -10,0 C -15,-15 -5,-25 0,-15 C 5,-25 15,-15 10,0 Z" fill="#ef4444" />
                            <path d="M -5,0 C -8,-10 0,-18 5,0 Z" fill="#dc2626" />
                            <circle cx="0" cy="-3" r="3.5" fill="#f59e0b" />
                          </g>

                          {/* 3. Right Glowing Blue Lupine Bell Spire */}
                          <path d="M 280,180 Q 285,135 285,100" stroke="#047857" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                          <path d="M 283,145 Q 305,140 298,130 Z" fill="#059669" />
                          <g transform="translate(285, 100)">
                            {/* Tall stack of lavender/blue bells */}
                            <circle cx="0" cy="15" r="7.5" fill="#6366f1" />
                            <circle cx="-6" cy="7" r="6" fill="#818cf8" />
                            <circle cx="6" cy="7" r="6" fill="#818cf8" />
                            <circle cx="0" cy="0" r="6.5" fill="#4f46e5" />
                            <circle cx="-5" cy="-7" r="5.5" fill="#6366f1" />
                            <circle cx="5" cy="-7" r="5.5" fill="#6366f1" />
                            <circle cx="0" cy="-14" r="5" fill="#a5b4fc" />
                            <circle cx="0" cy="-21" r="3.5" fill="#e0e7ff" />
                          </g>

                          {/* 4. Ground Clover & Daisy Clusters */}
                          <g transform="translate(60, 175)">
                            <circle cx="0" cy="0" r="5.5" fill="#ffffff" />
                            <circle cx="-6" cy="-5" r="4.5" fill="#ffffff" />
                            <circle cx="6" cy="-5" r="4.5" fill="#ffffff" />
                            <circle cx="0" cy="-9" r="4.5" fill="#ffffff" />
                            <circle cx="0" cy="-4" r="3" fill="#fbbf24" />
                          </g>
                          <g transform="translate(340, 178)">
                            <circle cx="0" cy="0" r="6" fill="#fbcfe8" />
                            <circle cx="-5" cy="-5" r="5" fill="#fbcfe8" />
                            <circle cx="5" cy="-5" r="5" fill="#fbcfe8" />
                            <circle cx="0" cy="-9" r="5" fill="#fbcfe8" />
                            <circle cx="0" cy="-4" r="3" fill="#fbbf24" />
                          </g>
                          <g transform="translate(160, 180)">
                            <ellipse cx="-4" cy="-3" rx="4" ry="5.5" fill="#10b981" transform="rotate(-30)" />
                            <ellipse cx="4" cy="-3" rx="4" ry="5.5" fill="#10b981" transform="rotate(30)" />
                            <ellipse cx="0" cy="-7" rx="3.5" ry="5" fill="#10b981" />
                          </g>
                          <g transform="translate(240, 179)">
                            <ellipse cx="-4" cy="-3" rx="4" ry="5.5" fill="#059669" transform="rotate(-30)" />
                            <ellipse cx="4" cy="-3" rx="4" ry="5.5" fill="#059669" transform="rotate(30)" />
                            <ellipse cx="0" cy="-7" rx="3.5" ry="5" fill="#059669" />
                          </g>
                        </>
                      )}

                      {mood === MoodPetal.GROWING && (
                        <>
                          {/* 1. Central Rising Golden Sunflower */}
                          <path d="M 200,180 Q 202,125 205,95" stroke="#059669" strokeWidth="5" fill="none" strokeLinecap="round" />
                          <path d="M 203,135 Q 180,120 188,110 C 195,115 200,125 203,135 Z" fill="#10b981" />
                          <g transform="translate(205, 90)">
                            {/* Radiant sunflower petals */}
                            <circle cx="0" cy="0" r="14" fill="#fbbf24" opacity="0.8" />
                            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, k) => (
                              <ellipse key={k} cx="0" cy="-14" rx="5.5" ry="11" fill="#f59e0b" transform={`rotate(${angle})`} />
                            ))}
                            <circle cx="0" cy="0" r="7.5" fill="#78350f" />
                            <circle cx="0" cy="0" r="5" fill="#451a03" />
                          </g>

                          {/* 2. Left Fresh Pink Tulip Buds */}
                          <path d="M 110,180 Q 115,150 100,130" stroke="#34d399" strokeWidth="4" fill="none" strokeLinecap="round" />
                          <g transform="translate(100, 128)">
                            <ellipse cx="0" cy="0" rx="4.5" ry="8" fill="#f43f5e" />
                            <ellipse cx="-2.5" cy="-2" rx="3" ry="7" fill="#fda4af" opacity="0.9" />
                            <ellipse cx="2.5" cy="-2" rx="3" ry="7" fill="#fda4af" opacity="0.9" />
                          </g>

                          {/* 3. Right Wild Meadow Grass & Forget-Me-Nots */}
                          <path d="M 290,180 Q 285,150 305,135" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" />
                          <path d="M 290,180 Q 300,160 320,150" stroke="#059669" strokeWidth="3" fill="none" strokeLinecap="round" />
                          <g transform="translate(305, 132)">
                            <circle cx="0" cy="0" r="4.5" fill="#38bdf8" />
                            <circle cx="-4" cy="-4" r="4" fill="#38bdf8" />
                            <circle cx="4" cy="-4" r="4" fill="#38bdf8" />
                            <circle cx="0" cy="-7" r="4" fill="#38bdf8" />
                            <circle cx="0" cy="-3" r="2.5" fill="#fef08a" />
                          </g>

                          {/* 4. Organic Foreground Greens */}
                          <path d="M 60,182 Q 70,165 50,150" stroke="#059669" strokeWidth="3.5" fill="none" />
                          <path d="M 330,181 Q 320,165 340,145" stroke="#059669" strokeWidth="3" fill="none" />
                          <g transform="translate(150, 178)">
                            <circle cx="0" cy="0" r="4" fill="#fbbf24" />
                            <circle cx="-4" cy="-3.5" r="3.5" fill="#fbbf24" />
                            <circle cx="4" cy="-3.5" r="3.5" fill="#fbbf24" />
                            <circle cx="0" cy="-6" r="3.5" fill="#fbbf24" />
                            <circle cx="0" cy="-3" r="1.5" fill="#ffffff" />
                          </g>
                        </>
                      )}

                      {mood === MoodPetal.CLOUDY && (
                        <>
                          {/* 1. Central Drooping Indigo Hydrangea */}
                          <path d="M 200,180 Q 195,140 180,115" stroke="#475569" strokeWidth="5" fill="none" strokeLinecap="round" />
                          <path d="M 180,115 Q 160,115 155,123 Z" fill="#334155" />
                          <g transform="translate(180, 110)">
                            {/* Dome of soft blue-gray petals */}
                            <circle cx="0" cy="0" r="15" fill="#64748b" opacity="0.6" />
                            <circle cx="-10" cy="-5" r="7" fill="#818cf8" opacity="0.95" />
                            <circle cx="10" cy="-5" r="7" fill="#818cf8" opacity="0.95" />
                            <circle cx="0" cy="-10" r="7" fill="#a5b4fc" opacity="0.95" />
                            <circle cx="-5" cy="5" r="7.5" fill="#6366f1" opacity="0.95" />
                            <circle cx="5" cy="5" r="7.5" fill="#6366f1" opacity="0.95" />
                            <circle cx="-8" cy="-10" r="5" fill="#94a3b8" />
                            <circle cx="8" cy="-10" r="5" fill="#94a3b8" />
                            <circle cx="0" cy="0" r="4.5" fill="#e2e8f0" />
                          </g>

                          {/* 2. Bowed Bluebell stalks */}
                          <path d="M 120,180 Q 110,140 95,125" stroke="#334155" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                          <g transform="translate(95, 125)">
                            <ellipse cx="0" cy="5" rx="5" ry="9.5" fill="#475569" opacity="0.9" />
                            <circle cx="-3" cy="8" r="4" fill="#1e293b" />
                          </g>

                          <path d="M 270,180 Q 265,145 250,130" stroke="#334155" strokeWidth="4" fill="none" strokeLinecap="round" />
                          <g transform="translate(250, 130)">
                            <ellipse cx="0" cy="5" rx="4.5" ry="9" fill="#475569" opacity="0.9" />
                            <circle cx="3" cy="8" r="3.5" fill="#1e293b" />
                          </g>

                          {/* Overhanging dark clouds and rain droplets */}
                          <g opacity="0.75" className="animate-pulse">
                            <path d="M 30,35 Q 60,15 90,35 Q 110,20 130,35 Q 145,50 130,65 L 30,65 Z" fill="#1e293b" />
                            <path d="M 260,40 Q 290,20 320,40 Q 345,25 365,40 Q 380,55 365,70 L 260,70 Z" fill="#0f172a" />
                          </g>

                          {/* Beautiful slanted rainfall and puddles */}
                          <line x1="80" y1="75" x2="70" y2="125" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 7" opacity="0.5" />
                          <line x1="140" y1="80" x2="130" y2="135" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 7" opacity="0.4" />
                          <line x1="280" y1="80" x2="270" y2="140" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 7" opacity="0.5" />
                          <line x1="330" y1="75" x2="320" y2="125" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 7" opacity="0.3" />

                          {/* Splash indicators under rain */}
                          <ellipse cx="80" cy="180" rx="9" ry="2.5" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.4" />
                          <ellipse cx="280" cy="181" rx="11" ry="3.5" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.5" />
                        </>
                      )}

                      {mood === MoodPetal.WITHERING && (
                        <>
                          {/* 1. Central Dry Oak Specimen */}
                          <path d="M 200,180 Q 198,125 188,95" stroke="#5c4432" strokeWidth="5" fill="none" strokeLinecap="round" />
                          <path d="M 188,95 Q 164,75 145,65" stroke="#5c4432" strokeWidth="3" fill="none" strokeLinecap="round" />
                          <path d="M 188,95 Q 212,85 225,75" stroke="#451a03" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                          <path d="M 166,85 Q 155,95 142,90" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />

                          {/* Fallen leaves and drying chrysanthemums */}
                          <g transform="translate(145, 65)">
                            <ellipse cx="0" cy="0" rx="3.5" ry="6" fill="#78350f" opacity="0.85" transform="rotate(45)" />
                          </g>
                          <g transform="translate(225, 75)">
                            <ellipse cx="0" cy="0" rx="3" ry="5.5" fill="#9a3412" opacity="0.8" transform="rotate(-30)" />
                          </g>

                          {/* 2. Golden fallen foliage lining the garden floor */}
                          <path d="M 60,178 Q 100,172 130,178 Z" fill="#b45309" opacity="0.75" />
                          <path d="M 140,179 Q 200,171 260,179 Z" fill="#7c2d12" opacity="0.85" />
                          <path d="M 270,178 Q 320,173 350,178 Z" fill="#b45309" opacity="0.65" />

                          {/* 3. Single chrysanthemum drying up and losing petals */}
                          <path d="M 110,180 Q 105,155 115,140" stroke="#78350f" strokeWidth="3" fill="none" />
                          <g transform="translate(115, 137)">
                            <circle cx="0" cy="0" r="5" fill="#d97706" />
                            <ellipse cx="-5" cy="-5" rx="2" ry="5" fill="#f59e0b" opacity="0.8" />
                            <ellipse cx="5" cy="5" rx="2" ry="5" fill="#d97706" opacity="0.5" />
                          </g>

                          {/* Hanging/falling leaves drifting down in wind paths */}
                          <g transform="translate(150, 115)" className="animate-bounce" style={{ animationDuration: "3.5s" }}>
                            <path d="M 0,0 Q -12,14 6,17 C 12,9 6,3 0,0 Z" fill="#ca8a04" opacity="0.85" />
                          </g>
                          <g transform="translate(260, 105)" className="animate-bounce" style={{ animationDuration: "5s" }}>
                            <path d="M 0,0 Q 12,12 -5,18 C -10,10 -4,4 0,0 Z" fill="#b45309" opacity="0.8" />
                          </g>
                        </>
                      )}

                      {mood === MoodPetal.DARK && (
                        <>
                          {/* 1. Starlight Sky layer */}
                          <circle cx="60" cy="45" r="1.5" fill="#ffffff" opacity="0.75" className="animate-ping" />
                          <circle cx="150" cy="30" r="1.2" fill="#ffffff" opacity="0.85" />
                          <circle cx="210" cy="40" r="1.6" fill="#ffffff" opacity="0.5" />
                          <circle cx="340" cy="55" r="1.1" fill="#ffffff" opacity="0.8" />
                          <circle cx="290" cy="25" r="1.5" fill="#ffffff" opacity="0.6" className="animate-ping" />

                          {/* 2. Dynamic glowing central Moonlight Lily */}
                          <path d="M 200,180 Q 198,140 200,115" stroke="#1e1b4b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                          <path d="M 200,140 Q 175,130 185,123 Z" fill="#1e1b4b" />
                          <g transform="translate(200, 110)">
                            {/* Moonlit glowing silver petals */}
                            <ellipse cx="0" cy="0" rx="9" ry="14" fill="#c084fc" opacity="0.5" className="animate-pulse" />
                            <ellipse cx="0" cy="-14" rx="8" ry="13" fill="#ffffff" opacity="0.9" />
                            <ellipse cx="-13" cy="-5" rx="11" ry="8" fill="#d8b4fe" opacity="0.95" />
                            <ellipse cx="13" cy="-5" rx="11" ry="8" fill="#d8b4fe" opacity="0.95" />
                            <ellipse cx="-8" cy="8" rx="10" ry="8" fill="#818cf8" opacity="0.85" />
                            <ellipse cx="8" cy="8" rx="10" ry="8" fill="#818cf8" opacity="0.85" />
                            <circle cx="0" cy="0" r="4.5" fill="#e0f2fe" />
                            <circle cx="0" cy="0" r="2.5" fill="#facc15" />
                          </g>

                          {/* 3. Left Glowing Blue Night-Bloom */}
                          <path d="M 115,180 Q 120,155 110,135" stroke="#1e1b4b" strokeWidth="4.0" strokeLinecap="round" fill="none" />
                          <g transform="translate(110, 132)">
                            <circle cx="0" cy="0" r="6" fill="#312e81" />
                            <circle cx="-5" cy="-4" r="5" fill="#6366f1" opacity="0.85" />
                            <circle cx="5" cy="-4" r="5" fill="#6366f1" opacity="0.85" />
                            <circle cx="0" cy="-7" r="5" fill="#818cf8" opacity="0.9" />
                            <circle cx="0" cy="-3" r="2" fill="#ffffff" />
                          </g>

                          {/* 4. Right Glowing Blue Night-Bloom */}
                          <path d="M 285,180 Q 280,150 288,130" stroke="#1e1b4b" strokeWidth="4.0" strokeLinecap="round" fill="none" />
                          <g transform="translate(288, 127)">
                            <circle cx="0" cy="0" r="5.5" fill="#312e81" />
                            <circle cx="-4.5" cy="-3.5" r="4.5" fill="#4f46e5" opacity="0.85" />
                            <circle cx="4.5" cy="-3.5" r="4.5" fill="#4f46e5" opacity="0.85" />
                            <circle cx="0" cy="-6" r="4.5" fill="#6366f1" opacity="0.9" />
                            <circle cx="0" cy="-3" r="1.5" fill="#ffffff" />
                          </g>

                          {/* 5. Mystical yellow-green glowing fireflies */}
                          <g opacity="0.85" className="animate-pulse">
                            <circle cx="70" cy="110" r="2" fill="#eab308" className="animate-bounce" />
                            <circle cx="160" cy="85" r="2" fill="#d9f99d" />
                            <circle cx="230" cy="140" r="1.5" fill="#eab308" />
                            <circle cx="320" cy="95" r="1.8" fill="#d9f99d" className="animate-bounce" />
                            <circle cx="270" cy="70" r="2.2" fill="#eab308" />
                          </g>
                        </>
                      )}
                    </motion.g>
                  </AnimatePresence>

                  {/* Render extra glowing droplets on top if a ritual was completed *during* session */}
                  {ritualsWatered > 0 && (
                    <g>
                      <circle cx="180" cy="115" r="5" fill="#38bdf8" opacity="0.8" className="animate-ping" />
                      <circle cx="225" cy="130" r="7" fill="#818cf8" opacity="0.6" className="animate-ping" />
                    </g>
                  )}
                </svg>

                {/* Floating feedback particles */}
                <div className="absolute inset-0 z-0 pointer-events-none flex justify-around">
                  <div className={`w-1.5 h-1.5 rounded-full ${config.particleColor} animate-bounce`} style={{ animationDelay: "0.2s" }} />
                  <div className={`w-2 h-2 rounded-full ${config.particleColor} animate-bounce`} style={{ animationDelay: "0.7s" }} />
                  <div className={`w-1 h-1 rounded-full ${config.particleColor} animate-bounce`} style={{ animationDelay: "1.2s" }} />
                </div>
              </div>

              {/* Right Side: Micro-Bento Style high-density metrics */}
              <div className="w-full sm:w-1/3 flex flex-row sm:flex-col gap-2.5 shrink-0 pointer-events-auto">
                <div className="flex-1 bg-slate-950/50 backdrop-blur-md rounded-2xl p-3 border border-white/5 shadow-md hover:border-[#D4A373]/20 transition-colors flex flex-col justify-center">
                  <span className="text-[8px] uppercase tracking-wider font-mono text-slate-500 font-bold block mb-1">Consistency Streak</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-serif font-black text-[#D4A373]">{streak}</span>
                    <span className="text-[10px] font-sans text-slate-400">Days Active</span>
                  </div>
                </div>

                <div className="flex-1 bg-slate-950/50 backdrop-blur-md rounded-2xl p-3 border border-white/5 shadow-md hover:border-[#D4A373]/20 transition-colors flex flex-col justify-center">
                  <span className="text-[8px] uppercase tracking-wider font-mono text-slate-500 font-bold block mb-1">Ecosystem Treatment</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-serif font-black text-emerald-400">{ritualsWatered}</span>
                    <span className="text-[10px] font-sans text-slate-400">Vital Elements</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="history-chart"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full flex-1 flex flex-col justify-center select-none"
            >
              {/* Recharts Area Flow Visualization */}
              <div className="w-full h-[180px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={moodHistoryData}
                    margin={{ top: 10, right: 15, left: -24, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4A373" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#D4A373" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#ffffff08" 
                      vertical={false} 
                    />
                    <XAxis 
                      dataKey="day" 
                      stroke="#475569" 
                      fontSize={9} 
                      fontFamily="monospace"
                      tickLine={false}
                      axisLine={false}
                      dy={8}
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={9} 
                      fontFamily="monospace"
                      domain={[1, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      tickFormatter={formatYAxis}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      content={<CustomTooltip />}
                      cursor={{ stroke: "#D4A37320", strokeWidth: 1 }}
                    />
                    
                    {/* Golden Mean / Benchmark Line for Cloudy threshold */}
                    <ReferenceLine y={3} stroke="#ffffff0a" strokeDasharray="2 4" />

                    <Area 
                      type="monotone" 
                      dataKey="moodVal" 
                      stroke="#D4A373" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#colorMood)"
                      activeDot={{ 
                        fill: "#111625", 
                        stroke: "#D4A373", 
                        strokeWidth: 2.5, 
                        r: 6 
                      }}
                      dot={{
                        fill: "#0f172a",
                        stroke: "#D4A373",
                        strokeWidth: 2,
                        r: 4
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Mini Helper Legend */}
              <div className="flex justify-around items-center bg-slate-950/40 p-1.5 rounded-xl border border-white/5 mx-2 mt-2 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D4A373]" /> Daily Pulse</span>
                <span>Y-Axis: Mood Density</span>
                <span>Active Tracking Loop</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Description Footer of current weather status */}
      <div className="relative z-10 flex items-center justify-between border-t border-slate-800/60 pt-3 text-slate-400 text-xs">
        <span className="flex items-center gap-1.5 font-mono">
          {activeTab === "live" ? config.icon : <Activity className="w-4 h-4 text-[#D4A373] animate-pulse" />}
          {activeTab === "live" ? config.statusText : "Fluctuation Amplitude"}
        </span>

        <span className="text-slate-500 max-w-[65%] text-right font-light line-clamp-1 italic">
          {activeTab === "live" ? config.desc : "Select different items in the chat inline menu to watch your curve evolve."}
        </span>
      </div>
    </div>
  );
}
