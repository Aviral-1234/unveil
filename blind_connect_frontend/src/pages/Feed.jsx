import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { X, Heart, Zap, RefreshCw } from 'lucide-react';

// Mock Data
const MOCK_USERS = [
  {
    id: 1,
    username: "NeonGhost_99",
    age: 24,
    aura_color: "#7B1FA2",
    tags: ["3AM Drives", "Sci-Fi Books", "Techno"],
    prompts: [
      { q: "My toxic trait is...", a: "I ghost people when I get overwhelmed." },
      { q: "Unpopular opinion...", a: "Coffee is actually gross." }
    ]
  },
  {
    id: 2,
    username: "PixelDrifter",
    age: 26,
    aura_color: "#FF3B30",
    tags: ["Hiking", "Indie Gaming", "Spicy Food"],
    prompts: [
      { q: "I judge people who...", a: "Are rude to waiters." },
      { q: "The hill I will die on...", a: "Gif is pronounced Jif." }
    ]
  },
  {
    id: 3,
    username: "VelvetThunder",
    age: 22,
    aura_color: "#22c55e",
    tags: ["Vinyl Records", "Matcha", "Cats"],
    prompts: [
      { q: "My simple pleasure...", a: "Reading in the park on a sunny day." },
      { q: "Dating me is like...", a: "Adopting a stray cat. Good luck." }
    ]
  }
];

const Card = ({ user, onSwipe }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Background color shift based on swipe direction
  const overlayColor = useTransform(
    x, 
    [-200, 0, 200], 
    ["rgba(239, 68, 68, 0.2)", "rgba(0,0,0,0)", "rgba(34, 197, 94, 0.2)"] 
  );

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) onSwipe('right');
    else if (info.offset.x < -100) onSwipe('left');
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
      className="absolute top-0 w-full max-w-sm h-[600px] rounded-[32px] shadow-2xl cursor-grab overflow-hidden border border-white/10 bg-gray-900"
    >
      {/* Dynamic Overlay for Swipe Feedback */}
      <motion.div style={{ backgroundColor: overlayColor }} className="absolute inset-0 z-20 pointer-events-none" />

      {/* Aura Visual (Top Half) */}
      <div 
        className="absolute top-0 left-0 w-full h-[55%] z-0 transition-colors duration-500"
        style={{ backgroundColor: user.aura_color }}
      >
        <div className="w-full h-full backdrop-blur-3xl bg-black/20 flex flex-col items-center justify-center relative overflow-hidden">
             {/* Abstract Shapes */}
             <div className="absolute w-64 h-64 bg-white/20 rounded-full blur-[80px] -top-10 -right-10 mix-blend-overlay" />
             <div className="absolute w-64 h-64 bg-black/40 rounded-full blur-[80px] -bottom-10 -left-10 mix-blend-multiply" />
             
             <span className="text-8xl opacity-80 filter drop-shadow-lg transform hover:scale-110 transition-transform duration-300">
                {user.age % 2 === 0 ? '👾' : '👽'}
             </span>
             <p className="mt-4 font-bold text-white/50 text-xs tracking-[0.3em] uppercase">Blind Mode</p>
        </div>
      </div>

      {/* Content (Bottom Half) */}
      <div className="absolute bottom-0 w-full h-[50%] bg-gradient-to-t from-black via-gray-900 to-transparent z-10 flex flex-col justify-end p-6 pb-8">
        <div className="flex items-baseline gap-2 mb-3">
          <h2 className="text-3xl font-black text-white">{user.username}</h2>
          <span className="text-xl text-gray-400 font-medium">{user.age}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {user.tags.map(tag => (
            <span key={tag} className="bg-white/10 border border-white/5 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full text-gray-300">
                {tag}
            </span>
          ))}
        </div>

        <div className="space-y-4">
          {user.prompts.map((p, i) => (
            <div key={i} className="text-sm">
              <p className="text-purple-400 font-bold text-xs uppercase mb-1">{p.q}</p>
              <p className="text-gray-200 font-medium leading-snug">"{p.a}"</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Swipe Indicators */}
      <div className="absolute top-6 left-6 text-red-500 border-4 border-red-500 rounded-lg px-2 py-1 font-black text-2xl opacity-0" style={{ transform: 'rotate(-15deg)' }}>
        NOPE
      </div>
      <div className="absolute top-6 right-6 text-green-500 border-4 border-green-500 rounded-lg px-2 py-1 font-black text-2xl opacity-0" style={{ transform: 'rotate(15deg)' }}>
        LIKE
      </div>
    </motion.div>
  );
};

const Feed = () => {
  const [cards, setCards] = useState(MOCK_USERS);

  const handleSwipe = (direction, id) => {
    console.log(`Swiped ${direction} on ${id}`);
    // Delay removal slightly to allow animation to complete
    setTimeout(() => {
        setCards(prev => prev.filter(c => c.id !== id));
    }, 200);
  };

  const resetCards = () => setCards(MOCK_USERS);

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] flex flex-col items-center justify-center relative w-full">
      <div className="text-center mb-6 z-20">
        <h1 className="text-2xl font-black flex items-center justify-center gap-2 text-white italic tracking-tighter">
          <Zap className="text-yellow-400 fill-yellow-400 w-6 h-6" /> 
          DAILY STACK
        </h1>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-1">Vibe check passed</p>
      </div>

      <div className="relative w-full max-w-sm h-[600px] flex items-center justify-center">
        <AnimatePresence>
            {cards.map((user) => (
            <Card 
                key={user.id} 
                user={user} 
                onSwipe={(dir) => handleSwipe(dir, user.id)} 
            />
            )).reverse()} 
        </AnimatePresence>
        
        {cards.length === 0 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <RefreshCw className="text-gray-500" />
            </div>
            <p className="text-gray-400 font-bold mb-4">No more vibes left today.</p>
            <button 
                onClick={resetCards} 
                className="text-brand-primary text-sm font-bold uppercase tracking-widest hover:text-white transition-colors border-b-2 border-brand-primary pb-1"
            >
                Reset Stack
            </button>
          </div>
        )}
      </div>

      {/* Manual Controls */}
      <div className="flex gap-8 mt-8 z-20">
        <button 
            onClick={() => cards.length > 0 && handleSwipe('left', cards[cards.length - 1].id)}
            className="p-5 rounded-full bg-black/40 backdrop-blur-md border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white hover:scale-110 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300"
        >
          <X size={28} strokeWidth={3} />
        </button>
        <button 
            onClick={() => cards.length > 0 && handleSwipe('right', cards[cards.length - 1].id)}
            className="p-5 rounded-full bg-black/40 backdrop-blur-md border border-green-500/30 text-green-500 hover:bg-green-500 hover:text-white hover:scale-110 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-300"
        >
          <Heart size={28} fill="currentColor" strokeWidth={0} />
        </button>
      </div>
    </div>
  );
};

export default Feed;