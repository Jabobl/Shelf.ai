import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

interface ThemeSwitcherProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  accentColor?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme, accentColor }) => {
  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`relative flex items-center w-16 h-8 p-1 rounded-full transition-all duration-700 focus:outline-none group overflow-hidden ${
        theme === 'dark' ? 'bg-[#0c1445] ring-1 ring-white/20' : 'bg-[#38bdf8] ring-1 ring-black/10'
      }`}
      aria-label="Toggle theme"
    >
      {/* Decorative elements (Stars morphing to Clouds) */}
      <div className="absolute inset-0 pointer-events-none">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            animate={{
              x: theme === 'dark' ? (6 + i * 8) : (34 + i * 6),
              y: theme === 'dark' ? (i === 1 ? 6 : 18) : (i === 1 ? 10 : 14),
              width: theme === 'dark' ? (i === 1 ? 3 : 2) : (i === 1 ? 12 : 10),
              height: theme === 'dark' ? (i === 1 ? 3 : 2) : (i === 1 ? 8 : 6),
              backgroundColor: theme === 'dark' ? '#fde047' : '#ffffff',
              opacity: theme === 'dark' ? [0.4, 1, 0.4] : 0.8,
              scale: theme === 'dark' ? [1, 1.2, 1] : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 20,
              opacity: {
                repeat: theme === 'dark' ? Infinity : 0,
                duration: 2 + i,
              },
              scale: {
                repeat: theme === 'dark' ? Infinity : 0,
                duration: 2 + i,
              }
            }}
          />
        ))}
      </div>

      <motion.div
        className="absolute w-6 h-6 rounded-full flex items-center justify-center shadow-lg z-10 overflow-hidden"
        initial={false}
        animate={{
          x: theme === 'dark' ? 32 : 0,
          backgroundColor: theme === 'dark' ? (accentColor || '#10b981') : '#facc15',
          rotate: theme === 'dark' ? 360 : 0,
          boxShadow: theme === 'dark' 
            ? `0 0 15px ${accentColor || '#10b981'}60` 
            : '0 2px 10px rgba(250,204,21,0.4)'
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      >
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={theme === 'dark' ? 'text-white' : 'text-zinc-900'}
          animate={{ rotate: theme === 'dark' ? 45 : 0 }}
        >
          <mask id="moon-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <motion.circle
              animate={{
                cx: theme === 'dark' ? 12 : 30,
                cy: theme === 'dark' ? 4 : 0,
              }}
              r="8"
              fill="black"
            />
          </mask>
          
          <motion.circle
            cx="12"
            cy="12"
            animate={{ r: theme === 'dark' ? 8 : 5 }}
            fill="currentColor"
            mask="url(#moon-mask)"
          />
          
          <motion.g
            stroke="currentColor"
            animate={{ 
              opacity: theme === 'dark' ? 0 : 1,
              scale: theme === 'dark' ? 0.5 : 1
            }}
          >
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </motion.g>
        </motion.svg>
      </motion.div>
    </button>
  );
};
