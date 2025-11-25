import React, { useEffect, useState } from 'react';
import { Settings, Edit2, Music, Flag, Search, Sparkles } from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../api/axios';

const Profile = () => {
  const { user: storedUser } = useAuthStore();
  const [user, setUser] = useState(storedUser || null);
  const [loading, setLoading] = useState(true);

  // Fetch latest data from DB on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me'); 
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Safe defaults if data is missing
  const DISPLAY_USER = {
    username: user?.username || "MysteryGuest",
    email: user?.email || "loading...",
    aura_color: user?.aura_color || "#7B1FA2",
    bio_emojis: user?.bio_emojis || "👻",
    music_taste: user?.music_taste || "Ask me...",
    description: user?.description || "No bio yet.",
    red_flags: user?.red_flags || null,
    looking_for: user?.looking_for || [],
    sliders: user?.sliders || {
      social_battery: 5, texting_style: 5, planning_style: 5, humor: 5
    },
    prompts: user?.prompts || []
  };

  if (loading && !user) return <div className="text-white text-center p-20">Loading Vibes...</div>;

  return (
    <div className="pb-20 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            My Persona
        </h1>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Settings className="text-gray-400" />
        </button>
      </div>

      {/* Header Card */}
      <div className="bg-gray-900/50 backdrop-blur-md rounded-3xl p-6 border border-white/10 relative overflow-hidden mb-6 shadow-2xl group">
        <div 
          className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px] opacity-40 mix-blend-screen transition-all duration-1000 group-hover:opacity-60"
          style={{ backgroundColor: DISPLAY_USER.aura_color }}
        />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-black border-2 border-white/10 flex items-center justify-center text-4xl shadow-lg shrink-0">
            {DISPLAY_USER.bio_emojis.split(" ")[0] || "👻"}
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold text-white">{DISPLAY_USER.username}</h2>
            <p className="text-sm text-gray-400 mb-2">{DISPLAY_USER.email}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
               {/* Display Bio Emojis as tags */}
               <span className="text-sm bg-white/5 px-2 py-1 rounded-lg border border-white/10 tracking-widest">
                  {DISPLAY_USER.bio_emojis}
               </span>
            </div>
            {/* About Me */}
            <p className="text-gray-300 text-sm mt-3 italic">"{DISPLAY_USER.description}"</p>
          </div>
          <button className="absolute top-4 right-4 p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
            <Edit2 size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Vibe Check Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
         {/* Music */}
         <div className="bg-gray-900/40 p-5 rounded-2xl border border-white/5 flex items-start gap-3">
            <Music className="text-purple-400 shrink-0" size={20} />
            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">On Rotation</h4>
                <p className="text-white text-sm font-medium">{DISPLAY_USER.music_taste}</p>
            </div>
         </div>

         {/* Looking For */}
         <div className="bg-gray-900/40 p-5 rounded-2xl border border-white/5 flex items-start gap-3">
            <Search className="text-pink-400 shrink-0" size={20} />
            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Looking For</h4>
                <div className="flex flex-wrap gap-2">
                    {DISPLAY_USER.looking_for.length > 0 ? DISPLAY_USER.looking_for.map(tag => (
                        <span key={tag} className="text-[10px] font-bold bg-pink-500/20 text-pink-200 px-2 py-1 rounded-md border border-pink-500/30">
                            {tag}
                        </span>
                    )) : <span className="text-gray-500 text-xs">Anything</span>}
                </div>
            </div>
         </div>
      </div>

      {/* Red Flag Warning */}
      {DISPLAY_USER.red_flags && (
        <div className="bg-red-900/10 border border-red-500/20 p-5 rounded-2xl mb-6 flex gap-4 items-center">
             <div className="bg-red-500/20 p-2 rounded-full">
                <Flag className="text-red-400" size={20} />
             </div>
             <div>
                 <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">My Red Flag</h4>
                 <p className="text-red-200 text-sm">{DISPLAY_USER.red_flags}</p>
             </div>
        </div>
      )}

      {/* Sliders Visualization */}
      <div className="space-y-6 bg-gray-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/10 mb-6">
        <h3 className="text-gray-500 text-xs uppercase tracking-[0.2em] font-bold mb-4 flex items-center gap-2">
            <Sparkles size={14} /> Personality Stats
        </h3>
        
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