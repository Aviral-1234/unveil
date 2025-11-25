export const Slider = ({ 
  label, 
  value, 
  onChange, 
  min = 1, 
  max = 10, 
  leftLabel, 
  rightLabel 
}) => {
  // Calculate percentage for dynamic gradient
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="w-full font-sans">
      <div className="flex justify-between mb-2 items-center">
        <label className="text-white font-bold text-xs tracking-wider uppercase">{label}</label>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-black text-sm">{value}</span>
          </div>
        </div>
      </div>

      <div className="relative w-full py-3">
        <RcSlider
          min={min}
          max={max}
          value={value}
          onChange={(val) => onChange(val)}
          
          // --- STYLING THE VIBE ---
          trackStyle={{ 
            background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)', 
            height: 8,
            borderRadius: 999,
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)'
          }}
          handleStyle={{
            height: 20,
            width: 20,
            marginTop: -6,
            backgroundColor: '#ffffff',
            border: '3px solid #a855f7',
            opacity: 1,
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.6), 0 4px 8px rgba(0, 0, 0, 0.3)',
            cursor: 'grab'
          }}
          railStyle={{ 
            backgroundColor: 'rgba(55, 65, 81, 0.4)',
            height: 8,
            borderRadius: 999,
            border: '1px solid rgba(75, 85, 99, 0.3)'
          }}
        />
      </div>

      <div className="flex justify-between text-[9px] text-gray-500 mt-1 uppercase font-semibold tracking-[0.1em] px-1">
        <span className="text-left max-w-[45%]">{leftLabel}</span>
        <span className="text-right max-w-[45%]">{rightLabel}</span>
      </div>
    </div>
  );
};