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
      className={`relative flex items-center w-16 h-8 p-1 rounded-full transition-colors duration-500 focus:outline-none ${
        theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-200'
      }`}
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute w-6 h-6 rounded-full flex items-center justify-center shadow-lg z-10"
        initial={false}
        animate={{
          x: theme === 'dark' ? 32 : 0,
          backgroundColor: theme === 'dark' ? (accentColor || '#10b981') : '#ffffff',
          rotate: theme === 'dark' ? 360 : 0,
          boxShadow: theme === 'dark' 
            ? `0 0 12px ${accentColor || '#10b981'}40` 
            : '0 2px 4px rgba(0,0,0,0.1)'
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25
        }}
      >
        {theme === 'dark' ? (
          <Moon size={14} className="text-white" fill="white" />
        ) : (
          <Sun size={14} className="text-zinc-900" fill="currentColor" />
        )}
      </motion.div>
      
      <div className="flex justify-between w-full px-1.5 opacity-40">
        <Sun size={12} className={theme === 'light' ? 'invisible' : 'text-zinc-400'} />
        <Moon size={12} className={theme === 'dark' ? 'invisible' : 'text-zinc-500'} />
      </div>
    </button>
  );
};
