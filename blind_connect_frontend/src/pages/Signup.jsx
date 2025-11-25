import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '../components/ui/Slider';
import { AuraSelector } from '../components/ui/AuraSelector'; // Assuming you have this
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Zap, Sparkles } from 'lucide-react';


const Onboarding = () => {
  const navigate = useNavigate();
  const { completeGoogleSignup, isLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  
  // No email/password here!
  const [formData, setFormData] = useState({
    username: '', 
    age: 20, 
    gender: 'NB',
    aura_color: '#9333ea', // Default purple
    sliders: { social_battery: 5, texting_style: 5, planning_style: 5, humor: 5 },
    prompts: [
      { question: "My toxic trait is...", answer: "" },
      { question: "The hill I will die on is...", answer: "" }
    ],
    tags: []
  });

  const handleSubmit = async () => {
    try {
      await completeGoogleSignup(formData);
      navigate('/feed');
    } catch (err) {
      console.error(err);
    }
  };

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 100 : -100, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Dynamic Background based on Aura */}
        <div 
            className="absolute inset-0 opacity-20 transition-colors duration-700 blur-[100px]"
            style={{ background: `radial-gradient(circle at 50% 50%, ${formData.aura_color}, transparent 70%)` }}
        />

        <div className="z-10 w-full max-w-lg">
            {/* Progress Bar */}
            <div className="flex gap-2 mb-8 justify-center">
                {[1, 2, 3].map(i => (
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
                    className="bg-gray-900/40 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl"
                >
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                Who are you?
                            </h2>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Display Name</label>
                                <input 
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-lg focus:border-purple-500 outline-none transition"
                                    placeholder="e.g. Midnight Rider"
                                    value={formData.username}
                                    onChange={e => setFormData({...formData, username: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/3">
                                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Age</label>
                                    <input type="number" className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-center focus:border-purple-500 outline-none" 
                                        value={formData.age} onChange={e => setFormData({...formData, age: Number(e.target.value)})}
                                    />
                                </div>
                                <div className="w-2/3">
                                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Gender</label>
                                    <div className="flex bg-black/50 rounded-xl p-1 border border-white/10">
                                        {['M', 'F', 'NB'].map(g => (
                                            <button 
                                                key={g}
                                                onClick={() => setFormData({...formData, gender: g})}
                                                className={`flex-1 py-3 rounded-lg text-sm font-bold transition ${formData.gender === g ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setStep(2)} className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition">
                                Next <ChevronRight size={20}/>
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
                                The Vibe Check
                            </h2>
                            
                            <div className="space-y-6">
                                {/* Pass custom styles to your Slider component to match dark mode */}
                                <div className="bg-black/20 p-4 rounded-xl">
                                    <Slider label="Social Battery" value={formData.sliders.social_battery} onChange={(v) => setFormData({...formData, sliders: {...formData.sliders, social_battery: v}})} leftLabel="Introvert" rightLabel="Extrovert" />
                                </div>
                                <div className="bg-black/20 p-4 rounded-xl">
                                    <Slider label="Humor Style" value={formData.sliders.humor} onChange={(v) => setFormData({...formData, sliders: {...formData.sliders, humor: v}})} leftLabel="Dark" rightLabel="Silly" />
                                </div>
                            </div>

                            <div className="pt-2">
                                <p className="text-sm text-gray-400 mb-3">Pick your Aura Color</p>
                                <AuraSelector selected={formData.aura_color} onSelect={(c) => setFormData({...formData, aura_color: c})} />
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="p-4 rounded-xl bg-white/10 hover:bg-white/20"><ChevronLeft/></button>
                                <button onClick={() => setStep(3)} className="flex-1 bg-white text-black font-bold py-4 rounded-xl">Continue</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                             <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-500">
                                Spicy Takes
                            </h2>
                            
                            {formData.prompts.map((p, i) => (
                                <div key={i} className="group">
                                    <p className="text-purple-300 font-bold text-sm mb-2 ml-1">{p.question}</p>
                                    <input 
                                        className="w-full bg-black/50 border border-white/10 focus:border-pink-500 rounded-xl p-4 outline-none transition-all"
                                        placeholder="Don't be shy..."
                                        value={p.answer}
                                        onChange={(e) => {
                                            const newPrompts = [...formData.prompts];
                                            newPrompts[i].answer = e.target.value;
                                            setFormData({...formData, prompts: newPrompts});
                                        }}
                                    />
                                </div>
                            ))}

                            <div className="flex gap-4 mt-8">
                                <button onClick={() => setStep(2)} className="p-4 rounded-xl bg-white/10 hover:bg-white/20"><ChevronLeft/></button>
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