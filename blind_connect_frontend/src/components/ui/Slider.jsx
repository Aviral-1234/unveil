import React from 'react';

export const Slider = ({ 
  label, 
  value, 
  onChange, 
  min = 1, 
  max = 10, 
  leftLabel, 
  rightLabel 
}) => {
  
  // Safety check: ensure value is never null/undefined
  const safeValue = value || min;
  
  // Calculate percentage for the colored fill
  const percentage = ((safeValue - min) / (max - min)) * 100;

  return (
    <div className="w-full font-sans">
      {/* Label and Value Display */}
      <div className="flex justify-between mb-3 items-end">
        <label className="text-white font-bold text-sm tracking-wide">{label}</label>
        <span className="text-purple-400 font-black text-lg">{safeValue}</span>
      </div>

      <div className="relative w-full h-8 flex items-center select-none">
        
        {/* 1. VISUAL TRACK (The background bar) */}
        <div className="absolute w-full h-3 bg-gray-700 rounded-full overflow-hidden border border-white/10">
           {/* Gradient Fill */}
           <div 
             style={{ width: `${percentage}%` }}
             className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
           />
        </div>

        {/* 2. THE LOGIC (Invisible Input) 
            - appearance-none is CRITICAL here to strip browser defaults
            - z-index 20 ensures it sits ON TOP of the visual track
        */}
        <input
          type="range"
          min={min}
          max={max}
          step={1} // Prevents floating point errors
          value={safeValue}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-20 appearance-none"
          style={{ margin: 0 }} // Resets browser margin defaults
        />

        {/* 3. VISUAL THUMB (The glowing circle) 
            - pointer-events-none lets clicks pass through to the input below
        */}
        <div 
          style={{ left: `${percentage}%` }}
          className="absolute h-6 w-6 bg-white rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8)] border-2 border-purple-500 transform -translate-x-1/2 pointer-events-none z-10 transition-all duration-75 ease-out"
        />
      </div>

      {/* Side Labels */}
      <div className="flex justify-between text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
};