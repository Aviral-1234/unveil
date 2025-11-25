import React, { useState } from 'react';
import { X, Heart, Zap, RefreshCw, Sparkles } from 'lucide-react';

// Mock Data with sliders
const MOCK_USERS = [
  {
    id: 1,
    username: "NeonGhost",
    age: 24,
    gender: "NB",
    aura_color: "#7B1FA2",
    bio_emojis: "👾 🔮 🎹",
    description: "Living in a cyberpunk fantasy. If you can't handle my techno playlists, we can't vibe.",
    music_taste: "Techno & Synthwave",
    red_flags: "I forget to reply for 3 business days.",
    looking_for: ["Rave Buddy", "Vibes"],
    sliders: { social_battery: 3, texting_style: 2, planning_style: 8, humor: 9 }
  },
  {
    id: 2,
    username: "PixelDrifter",
    age: 26,
    gender: "M",
    aura_color: "#FF3B30",
    bio_emojis: "🏔️ 🎮 🌶️",
    description: "Chasing peaks and high scores. I make the best spicy ramen you'll ever have.",
    music_taste: "Indie Folk & Lo-Fi",
    red_flags: "I will judge your coffee order.",
    looking_for: ["Hiking", "Gaming"],
    sliders: { social_battery: 8, texting_style: 7, planning_style: 5, humor: 6 }
  },
  {
    id: 3,
    username: "VelvetThunder",
    age: 22,
    gender: "F",
    aura_color: "#22c55e",
    bio_emojis: "🌿 🐈‍⬛ 🍵",
    description: "Plant parent and vinyl collector. My cat has to approve of you first.",
    music_taste: "Jazz & Neo-Soul",
    red_flags: "",
    looking_for: ["Casual", "Chat"],
    sliders: { social_battery: 4, texting_style: 9, planning_style: 2, humor: 8 }
  }
];

const UserCard = ({ user }) => {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-white/10">
      {/* Header with gradient */}
      <div 
        className="h-32 relative flex items-end p-4"
        style={{ 
          background: `linear-gradient(135deg, ${user.aura_color}60, ${user.aura_color})`
        }}
      >
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            {user.username}
            <span className="text-sm font-normal opacity-80">{user.age}</span>
          </h2>
          <p className="text-white/80 text-xs">{user.bio_emojis}</p>
        </div>
      </div>
      
      {/* Scrollable content */}
      <div className="p-4 space-y-3 overflow-y-auto" style={{ height: 'calc(100% - 128px)' }}>
        <p className="text-gray-300 text-sm leading-relaxed">{user.description}</p>
        
        {/* Quick info */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-purple-400 font-bold">MUSIC</span>
            <span className="text-gray-400">{user.music_taste}</span>
          </div>
          
          {user.red_flags && (
            <div className="flex items-start gap-2 bg-red-900/20 border border-red-500/30 rounded-lg p-2">
              <span className="text-red-400 font-bold">🚩</span>
              <span className="text-red-300">{user.red_flags}</span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-1.5 mt-2">
            {user.looking_for.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-[10px] font-semibold border border-purple-500/30">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Personality Sliders */}
        <div className="space-y-2.5 pt-2 border-t border-white/5">
          <h4 className="text-[10px] text-gray-500 uppercase tracking-wider font-bold flex items-center gap-1">
            <Sparkles size={10} /> Personality
          </h4>
          {Object.entries(user.sliders).map(([key, val]) => (
            <div key={key}>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="capitalize text-gray-400">{key.replace('_', ' ')}</span>
                <span className="text-purple-400 font-mono">{val}</span>
              </div>
              <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
                  style={{ width: `${val * 10}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Card = ({ user, onSwipe, index, totalCards }) => {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Mouse events
  const handleMouseDown = (e) => {
    if (index !== 0) return;
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || index !== 0) return;
    const newX = e.clientX - startPos.x;
    setDragOffset({ x: newX, y: 0 });
  };

  const handleMouseUp = () => {
    if (!isDragging || index !== 0) return;
    setIsDragging(false);
    
    if (dragOffset.x > 100) {
      onSwipe('right');
    } else if (dragOffset.x < -100) {
      onSwipe('left');
    }
    setDragOffset({ x: 0, y: 0 });
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    if (index !== 0) return;
    setIsDragging(true);
    setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || index !== 0) return;
    const newX = e.touches[0].clientX - startPos.x;
    setDragOffset({ x: newX, y: 0 });
  };

  const handleTouchEnd = () => {
    if (!isDragging || index !== 0) return;
    setIsDragging(false);
    
    if (dragOffset.x > 100) {
      onSwipe('right');
    } else if (dragOffset.x < -100) {
      onSwipe('left');
    }
    setDragOffset({ x: 0, y: 0 });
  };

  const scale = 1 - (index * 0.04);
  const yOffset = index * 8;
  const zIndex = totalCards - index;
  const rotation = dragOffset.x * 0.08;

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="absolute top-0 w-full max-w-md h-[500px] select-none"
      style={{ 
        zIndex: zIndex,
        cursor: index === 0 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        pointerEvents: index === 0 ? 'auto' : 'none',
        transform: `scale(${scale}) translateY(${yOffset}px) translateX(${dragOffset.x}px) rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      {/* Swipe indicators */}
      {index === 0 && (
        <>
          {dragOffset.x < -50 && (
            <div className="absolute top-6 left-4 text-red-500 border-4 border-red-500 rounded-lg px-3 py-1 font-black text-xl z-50 transform -rotate-12 pointer-events-none">
              NOPE
            </div>
          )}
          {dragOffset.x > 50 && (
            <div className="absolute top-6 right-4 text-green-500 border-4 border-green-500 rounded-lg px-3 py-1 font-black text-xl z-50 transform rotate-12 pointer-events-none">
              LIKE
            </div>
          )}
        </>
      )}
      
      <UserCard user={user} />
    </div>
  );
};

const Feed = () => {
  const [cards, setCards] = useState(MOCK_USERS);

  const handleSwipe = (direction) => {
    console.log(`Swiped ${direction} on ${cards[0]?.username}`);
    setCards(prev => prev.slice(1));
  };

  const resetCards = () => setCards(MOCK_USERS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-4 z-20">
        <h1 className="text-2xl font-black flex items-center justify-center gap-2 text-white">
          <Zap className="text-yellow-400 fill-yellow-400 w-6 h-6" /> 
          DAILY STACK
        </h1>
        <p className="text-gray-500 text-[10px] font-medium uppercase tracking-widest mt-1">Vibe check passed</p>
      </div>

      <div className="relative w-full max-w-md h-[500px] flex items-center justify-center mb-6">
        {cards.length > 0 ? (
          cards.slice(0, 3).map((user, index) => (
            <Card 
              key={user.id} 
              user={user} 
              index={index}
              totalCards={Math.min(cards.length, 3)}
              onSwipe={handleSwipe}
            />
          ))
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <RefreshCw className="text-gray-500" size={20} />
            </div>
            <p className="text-gray-400 font-bold text-sm mb-4">No more vibes today</p>
            <button 
              onClick={resetCards} 
              className="text-purple-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors border-b-2 border-purple-500 pb-1 hover:border-white"
            >
              Reset Stack
            </button>
          </div>
        )}
      </div>

      {cards.length > 0 && (
        <div className="flex gap-6 z-20">
          <button 
            onClick={() => handleSwipe('left')}
            className="p-4 rounded-full bg-black/40 backdrop-blur-md border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white hover:scale-110 transition-all duration-200 active:scale-95"
          >
            <X size={24} strokeWidth={3} />
          </button>
          <button 
            onClick={() => handleSwipe('right')}
            className="p-4 rounded-full bg-black/40 backdrop-blur-md border border-green-500/30 text-green-500 hover:bg-green-500 hover:text-white hover:scale-110 transition-all duration-200 active:scale-95"
          >
            <Heart size={24} fill="currentColor" strokeWidth={0} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Feed;