import React from 'react';
import { Settings, Edit2 } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Profile = () => {
  // Pull real data from store if available, fallback to mock
  const { user } = useAuthStore();
  
  const DISPLAY_USER = {
    username: user?.username || "MysteryGuest",
    email: user?.email || "me@example.com",
    aura_color: user?.aura_color || "#7B1FA2",
    sliders: user?.sliders || {
      social_battery: 5,
      texting_style: 5,
      planning_style: 5,
      humor: 5
    },
    prompts: user?.prompts || [
      { question: "My toxic trait is...", answer: "I steal hoodies." },
      { question: "Unpopular opinion...", answer: "Mint chocolate is toothpaste." }
    ]
  };

  return (
    <div className="pb-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            My Persona
        </h1>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Settings className="text-gray-400" />
        </button>
      </div>

      {/* Header Card */}
      <div className="bg-gray-900/50 backdrop-blur-md rounded-3xl p-6 border border-white/10 relative overflow-hidden mb-6 shadow-2xl">
        <div 
          className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px] opacity-40 mix-blend-screen"
          style={{ backgroundColor: DISPLAY_USER.aura_color }}
        />
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-24 h-24 rounded-full bg-black border-2 border-white/10 flex items-center justify-center text-4xl shadow-lg">
            👻
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{DISPLAY_USER.username}</h2>
            <p className="text-sm text-gray-400">{DISPLAY_USER.email}</p>
            <div className="flex gap-2 mt-2">
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-white/70 border border-white/5">
                    Level 1
                </span>
            </div>
          </div>
          <button className="ml-auto p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
            <Edit2 size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Sliders Visualization */}
      <div className="space-y-6 bg-gray-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/10 mb-6">
        <h3 className="text-gray-500 text-xs uppercase tracking-[0.2em] font-bold mb-4">Personality Stats</h3>
        
        {Object.entries(DISPLAY_USER.sliders).map(([key, val]) => (
          <div key={key}>
            <div className="flex justify-between text-xs mb-2 font-medium">
              <span className="capitalize text-gray-300">{key.replace('_', ' ')}</span>
              <span className="text-purple-400 font-mono">{val}/10</span>
            </div>
            <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                style={{ width: `${val * 10}%` }} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* Prompts Grid */}
      <div className="grid gap-4">
        {DISPLAY_USER.prompts.map((p, i) => (
          <div key={i} className="bg-gray-900/50 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-colors group">
            <p className="text-purple-400 text-xs font-bold uppercase tracking-wide mb-2 group-hover:text-purple-300 transition-colors">
                {p.question}
            </p>
            <p className="text-white text-lg font-medium leading-relaxed">"{p.answer}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;