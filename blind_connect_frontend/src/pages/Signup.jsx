import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '../components/ui/Slider';
import { AuraSelector } from '../components/ui/AuraSelector'; 
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Zap, Sparkles, Music, Flag, Search, User } from 'lucide-react';

const LOOKING_FOR_TAGS = [
  "Relationship", "Casual", "Friends", "Gaming Buddy", 
  "Late Night Chats", "Vibes Only", "Gym Partner", "Adventure"
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { completeGoogleSignup, isLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    username: '', 
    age: 20, 
    gender: 'NB',
    bio_emojis: '',
    music_taste: '',
    description: '',
    red_flags: '',
    looking_for: [],
    aura_color: '#9333ea', 
    sliders: { social_battery: 5, texting_style: 5, planning_style: 5, humor: 5 },
    prompts: [
      { question: "My toxic trait is...", answer: "" },
      { question: "The hill I will die on is...", answer: "" }
    ],
    tags: []
  });

  const handleTagToggle = (tag) => {
    setFormData(prev => {
      if (prev.looking_for.includes(tag)) {
        return { ...prev, looking_for: prev.looking_for.filter(t => t !== tag) };
      } else {
        if (prev.looking_for.length >= 3) return prev;
        return { ...prev, looking_for: [...prev.looking_for, tag] };
      }
    });
  };

const handleSliderChange = (key, val) => {
    setFormData(prev => ({
      ...prev,
      sliders: { ...prev.sliders, [key]: val }
    }));
};


  const handleSubmit = async () => {
    try {
      await completeGoogleSignup(formData);
      navigate('/feed');
    } catch (err) {
      console.error(err);
    }
  };

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 100 : -100, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Dynamic Background */}
        <div 
            className="absolute inset-0 opacity-20 transition-colors duration-700 blur-[100px]"
            style={{ background: `radial-gradient(circle at 50% 50%, ${formData.aura_color}, transparent 70%)` }}
        />

        <div className="z-10 w-full max-w-lg">
            {/* Progress Bar */}
            <div className="flex gap-2 mb-8 justify-center">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-white' : 'w-4 bg-white/20'}`} />
                ))}
            </div>

            <AnimatePresence mode='wait' custom={step}>
                <motion.div
                    key={step}
                    custom={step}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="bg-gray-900/40 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl"
                >
                    {/* STEP 1: IDENTITY */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-2">
                                <User size={28} className="text-blue-400" /> Identity
                            </h2>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Display Name</label>
                                <input 
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-lg focus:border-purple-500 outline-none transition"
                                    placeholder="e.g. Midnight Rider"
                                    value={formData.username}
                                    onChange={e => setFormData(prev => ({...prev, username: e.target.value}))}
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/3">
                                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Age</label>
                                    <input type="number" className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-center focus:border-purple-500 outline-none" 
                                        value={formData.age} onChange={e => setFormData(prev => ({...prev, age: Number(e.target.value)}))}
                                    />
                                </div>
                                <div className="w-2/3">
                                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Gender</label>
                                    <div className="flex bg-black/50 rounded-xl p-1 border border-white/10">
                                        {['M', 'F', 'NB'].map(g => (
                                            <button 
                                                key={g}
                                                onClick={() => setFormData(prev => ({...prev, gender: g}))}
                                                className={`flex-1 py-3 rounded-lg text-sm font-bold transition ${formData.gender === g ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Bio (3 Emojis)</label>
                                <input 
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-2xl text-center tracking-widest focus:border-purple-500 outline-none transition"
                                    placeholder="👽 🎧 🌙"
                                    maxLength={8} // Approx length for 3 emojis + spaces
                                    value={formData.bio_emojis}
                                    onChange={e => setFormData(prev => ({...prev, bio_emojis: e.target.value}))}
                                />
                            </div>
                            <button onClick={() => setStep(2)} className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition">
                                Next <ChevronRight size={20}/>
                            </button>
                        </div>
                    )}

                    {/* STEP 2: VIBE CHECK */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400 flex items-center gap-2">
                                <Zap size={28} className="text-green-400" /> The Vibe
                            </h2>
                            
                            <div className="space-y-6">
                                <div className="bg-black/20 p-4 rounded-xl">
                                    <Slider 
                                      label="Social Battery" 
                                      value={formData.sliders.social_battery} 
                                      onChange={(v) => handleSliderChange('social_battery', v)} 
                                      leftLabel="Introvert" 
                                      rightLabel="Extrovert" 
                                    />
                                </div>
                                <div className="bg-black/20 p-4 rounded-xl">
                                    <Slider 
                                      label="Texting Style" 
                                      value={formData.sliders.texting_style} 
                                      onChange={(v) => handleSliderChange('texting_style', v)} 
                                      leftLabel="Dry" 
                                      rightLabel="Spammy" 
                                    />
                                </div>
                                <div className="bg-black/20 p-4 rounded-xl">
                                    <Slider 
                                      label="Planning" 
                                      value={formData.sliders.planning_style} 
                                      onChange={(v) => handleSliderChange('planning_style', v)} 
                                      leftLabel="Go w/ Flow" 
                                      rightLabel="Itinerary" 
                                    />
                                </div>
                                <div className="bg-black/20 p-4 rounded-xl">
                                    <Slider 
                                      label="Humor" 
                                      value={formData.sliders.humor} 
                                      onChange={(v) => handleSliderChange('humor', v)} 
                                      leftLabel="Dark" 
                                      rightLabel="Silly" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-1"><Music size={12}/> Music Taste</label>
                                    <input 
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm focus:border-green-500 outline-none"
                                        placeholder="e.g. Techno, Indie Rock, 90s Hip Hop"
                                        value={formData.music_taste}
                                        onChange={e => setFormData(prev => ({...prev, music_taste: e.target.value}))}
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <p className="text-sm text-gray-400 mb-3">Pick your Aura Color</p>
                                <AuraSelector selected={formData.aura_color} onSelect={(c) => setFormData(prev => ({...prev, aura_color: c}))} />
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="p-4 rounded-xl bg-white/10 hover:bg-white/20"><ChevronLeft/></button>
                                <button onClick={() => setStep(3)} className="flex-1 bg-white text-black font-bold py-4 rounded-xl">Continue</button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: INTENTIONS & DETAILS */}
                    {step === 3 && (
                        <div className="space-y-5">
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500 flex items-center gap-2">
                                <Search size={28} className="text-rose-500" /> Details
                            </h2>

                            <div>
                                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Looking For (Max 3)</label>
                                <div className="flex flex-wrap gap-2">
                                    {LOOKING_FOR_TAGS.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => handleTagToggle(tag)}
                                            className={`px-3 py-2 rounded-full text-xs font-bold border transition-all ${
                                                formData.looking_for.includes(tag) 
                                                ? 'bg-pink-500 border-pink-500 text-white' 
                                                : 'bg-black/30 border-white/10 text-gray-400 hover:border-white/30'
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">About Me (Max 200 words)</label>
                                <textarea 
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm focus:border-pink-500 outline-none h-24 resize-none"
                                    placeholder="What makes you, you?"
                                    value={formData.description}
                                    onChange={e => setFormData(prev => ({...prev, description: e.target.value}))}
                                />
                                <div className="text-right text-[10px] text-gray-500">
                                    {formData.description.split(' ').length}/200 words
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-1 text-red-400"><Flag size={12}/> My Red Flags</label>
                                <input 
                                    className="w-full bg-red-900/10 border border-red-500/20 rounded-xl p-3 text-sm focus:border-red-500 outline-none text-red-200 placeholder-red-500/30"
                                    placeholder="I put milk before cereal..."
                                    value={formData.red_flags}
                                    onChange={e => setFormData(prev => ({...prev, red_flags: e.target.value}))}
                                />
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setStep(2)} className="p-4 rounded-xl bg-white/10 hover:bg-white/20"><ChevronLeft/></button>
                                <button onClick={() => setStep(4)} className="flex-1 bg-white text-black font-bold py-4 rounded-xl">Next</button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: SPICY PROMPTS */}
                    {step === 4 && (
                        <div className="space-y-6">
                             <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center gap-2">
                                <Sparkles size={28} className="text-yellow-400" /> Prompts
                            </h2>
                            
                            {formData.prompts.map((p, i) => (
                                <div key={i} className="group">
                                    <p className="text-orange-300 font-bold text-sm mb-2 ml-1">{p.question}</p>
                                    <input 
                                        className="w-full bg-black/50 border border-white/10 focus:border-orange-500 rounded-xl p-4 outline-none transition-all"
                                        placeholder="Don't be shy..."
                                        value={p.answer}
                                        onChange={(e) => {
                                            const newPrompts = [...formData.prompts];
                                            newPrompts[i].answer = e.target.value;
                                            setFormData(prev => ({...prev, prompts: newPrompts}));
                                        }}
                                    />
                                </div>
                            ))}

                            <div className="flex gap-4 mt-8">
                                <button onClick={() => setStep(3)} className="p-4 rounded-xl bg-white/10 hover:bg-white/20"><ChevronLeft/></button>
                                <button 
                                    onClick={handleSubmit} 
                                    disabled={isLoading}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/50 hover:scale-[1.02] transition-transform flex justify-center items-center gap-2"
                                >
                                    {isLoading ? <Sparkles className="animate-spin"/> : <>Finish <Zap size={20} fill="currentColor"/></>}
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    </div>
  );
};

export default Onboarding;