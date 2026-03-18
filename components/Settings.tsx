import React, { memo } from 'react';
import { UserPreferences } from '../types';
import { ChevronLeft, Save, Trash2, Moon, Sun, HelpCircle, CheckCircle2 } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

interface SettingsProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  onBack: () => void;
  onReset: () => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  onHelp: () => void;
}

const Settings = memo(function Settings({ preferences, onSave, onBack, onReset, theme, setTheme, onHelp }: SettingsProps) {
  const updatePref = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    onSave({ ...preferences, [key]: value });
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <div className="mb-8">
      <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 px-2 ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>{title}</h3>
      <div className={`rounded-2xl border divide-y overflow-hidden shadow-sm transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 divide-zinc-800' : 'bg-white border-zinc-200 divide-zinc-100'}`}>
        {children}
      </div>
    </div>
  );

  const renderCheckboxGroup = (
    label: string,
    key: 'appliances' | 'allergies',
    options: { label: string; value: string }[]
  ) => (
    <div className={`p-4 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white'}`}>
      <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-zinc-300' : 'text-black'}`}>{label}</label>
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
              className={`flex items-center justify-center p-3 rounded-xl border transition-all text-xs font-bold ${
                isSelected 
                  ? 'bg-accent border-accent text-white' 
                  : theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-black'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderToggle = (label: string, key: keyof UserPreferences) => {
    const isChecked = preferences[key] === true;
    return (
      <div className={`flex items-center justify-between p-4 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white'}`}>
        <span className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-300' : 'text-black'}`}>{label}</span>
        <button
          onClick={() => updatePref(key, !isChecked)}
          className={`w-12 h-6 rounded-full transition-colors relative ${isChecked ? 'bg-accent' : theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${isChecked ? 'left-7' : 'left-1'}`} />
        </button>
      </div>
    );
  };

  const renderRadioGroup = (
    label: string,
    key: keyof UserPreferences,
    options: { label: string; value: any }[]
  ) => (
    <div className={`p-4 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white'}`}>
      <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-zinc-300' : 'text-black'}`}>{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map(opt => {
          const isSelected = preferences[key] === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => updatePref(key, opt.value)}
              className={`flex items-center justify-center p-3 rounded-xl border transition-all text-xs font-bold ${
                isSelected 
                  ? 'bg-accent border-accent text-white' 
                  : theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-black'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderInput = (label: string, key: keyof UserPreferences, type: string = 'number') => (
    <div className={`p-4 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white'}`}>
      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-zinc-300' : 'text-black'}`}>{label}</label>
      <input
        type={type}
        value={preferences[key] || ''}
        onChange={(e) => updatePref(key, type === 'number' ? (e.target.value ? parseInt(e.target.value) : null) : e.target.value)}
        className={`w-full border rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-accent outline-none transition-colors ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-black'}`}
      />
    </div>
  );

  return (
    <div className={`flex flex-col h-full transition-colors duration-300 ${theme === 'dark' ? 'bg-black text-white' : 'bg-zinc-50 text-black'}`}>
      <header className={`px-6 pt-8 pb-4 border-b shrink-0 transition-colors duration-300 ${theme === 'dark' ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="flex items-center justify-between w-full">
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Settings</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-24 custom-scrollbar">
        {renderSection("Appearance & Help", (
          <>
            <div className={`flex items-center justify-between p-4 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-500'}`}>
                  {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div>
                  <p className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-300' : 'text-black'}`}>Theme</p>
                  <p className={`text-[10px] font-bold capitalize ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>{theme} Mode</p>
                </div>
              </div>
              <ThemeSwitcher 
                theme={theme} 
                setTheme={setTheme} 
                accentColor={preferences.accentColor} 
              />
            </div>

            <div className={`p-4 space-y-4 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <label className={`block text-sm font-bold ${theme === 'dark' ? 'text-zinc-300' : 'text-black'}`}>Accent Color</label>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: 'Purple', value: '#a855f7' },
                  { name: 'Indigo', value: '#6366f1' },
                  { name: 'Blue', value: '#3b82f6' },
                  { name: 'Emerald', value: '#10b981' },
                  { name: 'Rose', value: '#f43f5e' },
                  { name: 'Amber', value: '#f59e0b' },
                  { name: 'Zinc', value: '#71717a' },
                ].map(color => (
                  <button
                    key={color.value}
                    onClick={() => updatePref('accentColor', color.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${preferences.accentColor === color.value ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
                <div className="relative">
                  <input 
                    type="color" 
                    value={preferences.accentColor}
                    onChange={(e) => updatePref('accentColor', e.target.value)}
                    className="w-8 h-8 rounded-full border-2 border-transparent bg-transparent cursor-pointer overflow-hidden"
                  />
                </div>
              </div>
            </div>

            {renderRadioGroup("Measurement System", "measurementSystem", [
              { label: "US (cups/oz)", value: "us" },
              { label: "Metric (grams/ml)", value: "metric" },
            ])}
            <button 
              onClick={onHelp}
              className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${theme === 'dark' ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-white hover:bg-zinc-50'}`}
            >
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                <HelpCircle size={20} />
              </div>
              <div>
                <p className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-300' : 'text-black'}`}>Help & Instructions</p>
                <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>How to use Shelf.ai</p>
              </div>
            </button>
          </>
        ))}

        {renderSection("Cooking & Experience", (
          <>
            {renderRadioGroup("Experience Level", "experienceLevel", [
              { label: "Beginner", value: "beginner" },
              { label: "Intermediate", value: "intermediate" },
              { label: "Advanced", value: "advanced" },
            ])}
          </>
        ))}

        {renderSection("Diet & Nutrition", (
          <>
            {renderCheckboxGroup('Allergies & Restrictions', 'allergies', [
              { label: 'None', value: 'none' },
              { label: 'Dairy-free', value: 'dairy_free' },
              { label: 'Gluten-free', value: 'gluten_free' },
              { label: 'Nut-free', value: 'nut_free' },
              { label: 'Shellfish-free', value: 'shellfish_free' },
            ])}
            {renderRadioGroup("Dietary Plan", "specificPlan", [
              { label: "Keto", value: "keto" },
              { label: "Mediterranean", value: "mediterranean" },
              { label: "Paleo", value: "paleo" },
              { label: "Vegetarian", value: "vegetarian" },
              { label: "None", value: "none" },
            ])}
            {renderInput("Calories per day", "caloriesPerDay")}
          </>
        ))}

        {renderSection("Kitchen & Habits", (
          <>
            {renderCheckboxGroup('Appliances', 'appliances', [
              { label: 'Oven', value: 'oven' },
              { label: 'Stove', value: 'stove' },
              { label: 'Microwave', value: 'microwave' },
              { label: 'Blender', value: 'blender' },
              { label: 'Air Fryer', value: 'air_fryer' },
              { label: 'Rice Cooker', value: 'rice_cooker' },
            ])}
            {renderToggle("Reuse Ingredients", "reuseIngredients")}
            {renderRadioGroup("Leftover Preference", "preferLeftovers", [
              { label: "Yes, plan for leftovers", value: "yes" },
              { label: "Occasionally", value: "occasionally" },
              { label: "No leftovers", value: "no" },
            ])}
          </>
        ))}

        {renderSection("AI & Control", (
          <>
            {renderRadioGroup("AI Planning Level", "aiPlanLevel", [
              { label: "Only suggest", value: "ask" },
              { label: "Suggest only", value: "suggest" },
              { label: "Auto-plan", value: "auto" },
            ])}
            {renderRadioGroup("Auto-add Missing", "autoAddMissing", [
              { label: "Automatically", value: "yes" },
              { label: "Ask me first", value: "ask" },
              { label: "Never", value: "never" },
            ])}
            {renderRadioGroup("Biggest Struggle", "biggestStruggle", [
              { label: "Budget", value: "budget" },
              { label: "Time", value: "time" },
              { label: "Motivation", value: "motivation" },
              { label: "Knowledge", value: "knowledge" },
            ])}
          </>
        ))}

        {renderSection("App Info", (
          <div className={`p-4 space-y-2 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white'}`}>
            <div className="flex justify-between text-xs font-bold">
              <span className={`uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Version</span>
              <span className={theme === 'dark' ? 'text-zinc-300' : 'text-black'}>1.2.0</span>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className={`uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Environment</span>
              <span className={theme === 'dark' ? 'text-zinc-300' : 'text-black'}>Production</span>
            </div>
          </div>
        ))}

        <button
          onClick={onReset}
          className="w-full mt-4 p-4 flex items-center justify-center gap-2 text-red-500 font-bold bg-red-900/10 rounded-2xl border border-red-900/20 hover:bg-red-900/20 transition-colors"
        >
          <Trash2 size={20} />
          Reset All Preferences
        </button>
      </div>
    </div>
  );
});

export default Settings;
