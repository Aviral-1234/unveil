import React from 'react';
import { motion } from 'framer-motion';
import { Music, Zap, MapPin, Flag, Quote } from 'lucide-react';

// A mini-component for the stats bars (Read-only version of your slider)
const StatBar = ({ label, value, color }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
      <span>{label}</span>
      <span style={{ color }}>{value}/10</span>
    </div>
    <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value * 10}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

export const UserCard = ({ user }) => {
  if (!user) return null;

  // Defaults to handle missing data gracefully
  const {
    username = "Mystery Soul",
    age = "?",
    gender = "",
    aura_color = "#a855f7",
    bio_emojis = "👻",
    sliders = { social_battery: 5, texting_style: 5, planning_style: 5, humor: 5 },
    prompts = [],
    music_taste = "Silence",
    red_flags = "",
    looking_for = [],
    description = ""
  } = user;

  return (
    <div className="relative w-full max-w-sm mx-auto h-[600px] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 select-none">
      
      {/* --- DYNAMIC AURA BACKGROUND --- */}
      {/* This creates the "Image" replacement using their Aura Color */}
      <div 
        className="absolute top-[-20%] left-[-20%] w-[140%] h-[50%] opacity-60 blur-[80px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${aura_color}, transparent 70%)` }}
      />
      
      {/* --- CONTENT SCROLL CONTAINER --- */}
      <div className="relative z-10 h-full overflow-y-auto no-scrollbar p-6">
        
        {/* 1. IDENTITY HEADER */}
        <div className="text-center mt-8 mb-6">
          <div className="w-24 h-24 mx-auto bg-white/10 backdrop-blur-md rounded-full border-2 border-white/20 flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-4 animate-bounce-slow">
            {bio_emojis.split(" ")[0] || "👻"}
          </div>
          <h2 className="text-3xl font-black text-white drop-shadow-lg">{username}, {age}</h2>
          <div className="flex justify-center gap-2 mt-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-white/80 border border-white/5">
              {gender}
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-white/80 border border-white/5">
              {bio_emojis}
            </span>
          </div>
        </div>

        {/* 2. ABOUT ME */}
        {description && (
            <div className="mb-6 bg-black/20 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <p className="text-gray-300 text-sm leading-relaxed italic text-center">
                    "{description}"
                </p>
            </div>
        )}

        {/* 3. VIBE STATS (The RPG Character Sheet) */}
        <div className="bg-gray-800/40 backdrop-blur-md p-5 rounded-2xl border border-white/5 mb-6">
          <h3 className="text-xs font-black text-gray-500 uppercase mb-4 flex items-center gap-2">
            <Zap size={14} className="text-yellow-400"/> Power Levels
          </h3>
          <StatBar label="Social Battery" value={sliders.social_battery} color="#3b82f6" />
          <StatBar label="Texting Game" value={sliders.texting_style} color="#ec4899" />
          <StatBar label="Humor" value={sliders.humor} color="#a855f7" />
          <StatBar label="Planning" value={sliders.planning_style} color="#22c55e" />
        </div>

        {/* 4. DETAILS GRID */}
        <div className="grid grid-cols-1 gap-3 mb-6">
            {/* Music */}
            {music_taste && (
                <div className="bg-white/5 p-3 rounded-xl flex items-center gap-3 border border-white/5">
                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                        <Music size={18} />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">On Rotation</p>
                        <p className="text-sm font-medium text-white truncate">{music_taste}</p>
                    </div>
                </div>
            )}
            
            {/* Looking For */}
            <div className="flex flex-wrap gap-2">
                {looking_for.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-lg text-xs font-bold text-blue-200">
                        {tag}
                    </span>
                ))}
            </div>
        </div>

        {/* 5. PROMPTS (The Conversation Starters) */}
        <div className="space-y-3 mb-6">
          {prompts.map((p, i) => (
            <div key={i} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-4 rounded-xl border border-white/5 relative group hover:border-white/20 transition-colors">
              <Quote size={16} className="absolute top-3 left-3 text-white/10 group-hover:text-white/20 transition-colors" />
              <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1 pl-6">{p.question}</p>
              <p className="text-white text-sm font-medium pl-6 leading-snug">"{p.answer}"</p>
            </div>
          ))}
        </div>

        {/* 6. RED FLAG WARNING (If exists) */}
        {red_flags && (
           <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex gap-3 items-start animate-pulse-slow">
               <Flag className="text-red-500 shrink-0 mt-0.5" size={18} />
               <div>
                   <p className="text-[10px] font-bold text-red-400 uppercase">Warning</p>
                   <p className="text-red-200 text-xs">{red_flags}</p>
               </div>
           </div>
        )}

        {/* Spacer for bottom scrolling */}
        <div className="h-20" />
      </div>

      {/* --- BOTTOM GRADIENT FADE --- */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-20 pointer-events-none" />
    </div>
  );
};