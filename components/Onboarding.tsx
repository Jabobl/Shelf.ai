import React, { useState, memo } from 'react';
import { UserPreferences, DEFAULT_PREFERENCES } from '../types';
import { ChevronRight, ChevronLeft, Check, FastForward, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingProps {
  onComplete: (preferences: UserPreferences) => void;
  onSkipAll: () => void;
  theme: 'dark' | 'light';
}

const Onboarding = memo(function Onboarding({ onComplete, onSkipAll, theme }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [direction, setDirection] = useState(0);

  const updatePref = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setDirection(1);
      setStep(s => s + 1);
    } else {
      onComplete(preferences);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  };

  const renderProgressBar = () => (
    <div className="w-full bg-accent/10 h-1.5 rounded-full mb-8 overflow-hidden">
      <div 
        className="bg-accent h-full transition-all duration-300 ease-out"
        style={{ width: `${((step + 1) / steps.length) * 100}%` }}
      />
    </div>
  );

  const renderRadioGroup = (
    label: string,
    key: keyof UserPreferences,
    options: { label: string; value: any }[]
  ) => (
    <div className="mb-6">
      <label className={`block text-sm font-bold uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>{label}</label>
      <div className="space-y-2">
        {options.map(opt => {
          const isSelected = preferences[key] === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => updatePref(key, opt.value)}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                isSelected 
                  ? `bg-[var(--complementary-color)] border-[var(--complementary-color)] ${theme === 'dark' ? 'text-white' : 'text-black'} shadow-lg shadow-accent/40` 
                  : theme === 'dark' ? 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:bg-zinc-900' : 'bg-white border-zinc-200 text-black hover:bg-zinc-100'
              }`}
            >
              <span className="font-semibold text-lg">{opt.label}</span>
              {isSelected && <Check size={20} />}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderCheckboxGroup = (
    label: string,
    key: 'appliances' | 'allergies',
    options: { label: string; value: string }[]
  ) => (
    <div className="mb-6">
      <label className={`block text-sm font-bold uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map(opt => {
          const isSelected = (preferences[key] as string[]).includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => {
                const current = preferences[key] as string[];
                const next = isSelected 
                  ? current.filter(v => v !== opt.value)
                  : [...current, opt.value];
                updatePref(key, next);
              }}
              className={`flex items-center justify-center p-4 rounded-xl border transition-all ${
                isSelected 
                  ? `bg-[var(--complementary-color)] border-[var(--complementary-color)] ${theme === 'dark' ? 'text-white' : 'text-black'}` 
                  : theme === 'dark' ? 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800' : 'bg-white border-zinc-200 text-black'
              }`}
            >
              <span className="font-medium text-sm">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderToggle = (label: string, key: keyof UserPreferences) => {
    const isChecked = preferences[key] === true;
    return (
      <button
        onClick={() => updatePref(key, !isChecked)}
        className={`w-full flex items-center justify-between p-5 rounded-2xl border mb-4 transition-all ${
          isChecked 
            ? `bg-[var(--complementary-color)] border-[var(--complementary-color)] ${theme === 'dark' ? 'text-white' : 'text-black'} shadow-lg shadow-accent/40` 
            : theme === 'dark' ? 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:bg-zinc-900' : 'bg-white border-zinc-200 text-black hover:bg-zinc-100'
        }`}
      >
        <span className="font-semibold text-lg">{label}</span>
        <div className={`w-12 h-6 rounded-full transition-colors relative ${isChecked ? 'bg-white/20' : 'bg-zinc-800'}`}>
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isChecked ? 'left-7' : 'left-1'}`} />
        </div>
      </button>
    );
  };

  const steps = [
    {
      title: "Your Kitchen",
      description: "What appliances do you have available?",
      content: (
        <div className="space-y-4">
          {renderCheckboxGroup('Appliances', 'appliances', [
            { label: 'Oven', value: 'oven' },
            { label: 'Stove', value: 'stove' },
            { label: 'Microwave', value: 'microwave' },
            { label: 'Blender', value: 'blender' },
            { label: 'Air Fryer', value: 'air_fryer' },
            { label: 'Rice Cooker', value: 'rice_cooker' },
          ])}
        </div>
      )
    },
    {
      title: "Dietary Needs",
      description: "Any restrictions or specific plans?",
      content: (
        <div className="space-y-6">
          {renderCheckboxGroup('Allergies & Restrictions', 'allergies', [
            { label: 'None', value: 'none' },
            { label: 'Dairy-free', value: 'dairy_free' },
            { label: 'Gluten-free', value: 'gluten_free' },
            { label: 'Nut-free', value: 'nut_free' },
            { label: 'Shellfish-free', value: 'shellfish_free' },
          ])}
          {renderRadioGroup('Dietary Plan', 'specificPlan', [
            { label: 'Keto', value: 'keto' },
            { label: 'Mediterranean', value: 'mediterranean' },
            { label: 'Paleo', value: 'paleo' },
            { label: 'Vegetarian', value: 'vegetarian' },
            { label: 'None', value: 'none' },
          ])}
        </div>
      )
    },
    {
      title: "Nutrition & Waste",
      description: "Set your daily targets and habits.",
      content: (
        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-bold uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Calories per day</label>
            <input 
              type="number" 
              placeholder="e.g. 2000"
              value={preferences.caloriesPerDay || ''}
              onChange={(e) => updatePref('caloriesPerDay', e.target.value ? parseInt(e.target.value) : null)}
              className={`w-full border rounded-2xl p-6 text-2xl font-bold outline-none focus:border-accent transition-all ${theme === 'dark' ? 'bg-zinc-950 border-zinc-900 text-white placeholder-zinc-800' : 'bg-white border-zinc-200 text-black placeholder-zinc-300'}`}
            />
          </div>
          {renderToggle('Reuse ingredients to reduce waste', 'reuseIngredients')}
        </div>
      )
    },
    {
      title: "Experience & System",
      description: "How do you like to cook?",
      content: (
        <div className="space-y-6">
          {renderRadioGroup('Measurement System', 'measurementSystem', [
            { label: 'US (cups/oz)', value: 'us' },
            { label: 'Metric (grams/ml)', value: 'metric' },
          ])}
          {renderRadioGroup('Cooking Experience', 'experienceLevel', [
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' },
          ])}
        </div>
      )
    }
  ];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className={`min-h-screen flex flex-col max-w-md mx-auto relative overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-black text-white' : 'bg-zinc-50 text-black'}`}>
      <div className="flex-1 flex flex-col p-6 pb-32">
        <div className="flex items-center justify-between mb-8">
          {step === 0 ? (
            <button 
              onClick={onSkipAll}
              className="text-sm font-bold text-accent hover:opacity-80 transition-colors flex items-center gap-1"
            >
              <FastForward size={16} />
              Skip All
            </button>
          ) : (
            <button 
              onClick={handleBack}
              className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-900"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <button 
            onClick={handleNext}
            className="text-sm font-bold text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Skip
          </button>
        </div>

        {renderProgressBar()}

        <div className="flex-1 relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0 flex flex-col"
            >
            <h2 className={`text-3xl font-bold mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{steps[step].title}</h2>
              <p className={`text-zinc-500 mb-10 text-lg leading-relaxed ${theme === 'light' ? 'text-black' : ''}`}>{steps[step].description}</p>
              <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {steps[step].content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className={`absolute bottom-0 left-0 right-0 p-6 ${theme === 'dark' ? 'bg-black' : 'bg-zinc-50'}`}>
        <button
          onClick={handleNext}
          className="w-full py-5 bg-accent hover:opacity-90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-accent/40 transition-all flex items-center justify-center gap-2"
        >
          {step === steps.length - 1 ? 'Complete Setup' : 'Continue'}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
});

export default Onboarding;
