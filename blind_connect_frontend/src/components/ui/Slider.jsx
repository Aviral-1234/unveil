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
  
  const safeValue = value || min;
  const percentage = ((safeValue - min) / (max - min)) * 100;

  return (
    <div className="w-full font-sans">
      <div className="flex justify-between mb-3 items-end">
        <label className="text-white font-bold text-sm tracking-wide">{label}</label>
        <span className="text-purple-400 font-black text-lg">{safeValue}</span>
      </div>

      <div className="relative w-full h-8 flex items-center select-none">
        {/* Track */}
        <div className="absolute w-full h-3 bg-gray-700 rounded-full overflow-hidden border border-white/10">
           <div 
             style={{ width: `${percentage}%` }}
             className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
           />
        </div>

        {/* Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={safeValue}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-20 appearance-none"
          style={{ margin: 0 }}
        />

        {/* Thumb */}
        <div 
          style={{ left: `${percentage}%` }}
          className="absolute h-6 w-6 bg-white rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8)] border-2 border-purple-500 transform -translate-x-1/2 pointer-events-none z-10 transition-all duration-75 ease-out"
        />
      </div>

      <div className="flex justify-between text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
};