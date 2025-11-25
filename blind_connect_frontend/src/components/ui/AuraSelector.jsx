import React from 'react';
import { Check } from 'lucide-react';

const COLORS = [
  { hex: '#ef4444', name: 'Red' },    // Passion
  { hex: '#f97316', name: 'Orange' }, // Energy
  { hex: '#eab308', name: 'Yellow' }, // Happy
  { hex: '#22c55e', name: 'Green' },  // Nature
  { hex: '#3b82f6', name: 'Blue' },   // Calm
  { hex: '#9333ea', name: 'Purple' }, // Mystery
  { hex: '#ec4899', name: 'Pink' },   // Romance
  { hex: '#ffffff', name: 'White' },  // Pure
];

export const AuraSelector = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {COLORS.map((color) => (
        <button
          key={color.hex}
          type="button"
          onClick={() => onSelect(color.hex)}
          className={`
            relative w-full aspect-square rounded-full transition-all duration-300
            ${selected === color.hex ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-black' : 'hover:scale-105 opacity-70 hover:opacity-100'}
          `}
          style={{ 
            backgroundColor: color.hex,
            boxShadow: selected === color.hex ? `0 0 20px ${color.hex}` : 'none'
          }}
        >
          {selected === color.hex && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Check size={16} className={color.name === 'White' || color.name === 'Yellow' ? 'text-black' : 'text-white'} strokeWidth={4} />
            </div>
          )}
        </button>
      ))}
    </div>
  );
};