import React, { memo } from 'react';
import { ChevronLeft, Refrigerator, Calendar, Settings as SettingsIcon, ChevronRight } from 'lucide-react';
import { TabType } from '../types';

interface HelpViewProps {
  theme: 'dark' | 'light';
  setActiveTab: (tab: TabType) => void;
}

const HelpView: React.FC<HelpViewProps> = memo(({ theme, setActiveTab }) => {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <header className={`px-6 pt-8 pb-4 border-b shrink-0 transition-colors duration-300 ${theme === 'dark' ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-zinc-900 text-zinc-400 hover:text-white' : 'bg-zinc-100 text-black hover:text-black'}`}
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Help & Instructions</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        <div className={`p-6 rounded-3xl shadow-xl transition-colors duration-300 bg-accent text-white shadow-accent/20`}>
          <h2 className="text-2xl font-bold mb-2">Master Shelf.ai</h2>
          <p className="text-white/90 text-sm">Master your kitchen with these simple steps.</p>
        </div>

        <div className="space-y-6">
          <section className="space-y-4">
            <h3 className={`text-sm font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Getting Started</h3>
            <div className="space-y-3">
              <div className={`p-4 rounded-2xl border flex gap-4 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center shrink-0">
                  <Refrigerator size={20} />
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${theme === 'dark' ? 'text-zinc-100' : 'text-black'}`}>1. Fill your Pantry</h4>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Add items manually or use the AI Visual Scan to take a photo of your fridge.</p>
                </div>
              </div>
              <div className={`p-4 rounded-2xl border flex gap-4 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${theme === 'dark' ? 'text-zinc-100' : 'text-black'}`}>2. Generate a Meal</h4>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Go to the Cook tab, answer a few quick questions, and let Gemini suggest the perfect meal based on your pantry.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className={`text-sm font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Personalization</h3>
            <div className="space-y-3">
              <div className={`p-4 rounded-2xl border flex gap-4 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                <div className="w-10 h-10 bg-zinc-100 text-zinc-600 rounded-xl flex items-center justify-center shrink-0">
                  <SettingsIcon size={20} />
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${theme === 'dark' ? 'text-zinc-100' : 'text-black'}`}>Customize your Experience</h4>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Visit Settings to set your measurement system (US/Metric), appliances, and dietary restrictions.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className={`text-sm font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Pro Tips</h3>
            <ul className="space-y-2">
              <li className={`flex items-start gap-2 text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>
                <div className="w-1 h-1 bg-accent rounded-full mt-1.5 shrink-0"></div>
                <span>Set your experience level in Settings to get recipes tailored to your skill.</span>
              </li>
              <li className={`flex items-start gap-2 text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>
                <div className="w-1 h-1 bg-accent rounded-full mt-1.5 shrink-0"></div>
                <span>The AI respects your appliance list—it won't suggest oven recipes if you don't have one!</span>
              </li>
              <li className={`flex items-start gap-2 text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>
                <div className="w-1 h-1 bg-accent rounded-full mt-1.5 shrink-0"></div>
                <span>Visual Scan works best with clear lighting and well-spaced items.</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="p-6 pt-0">
          <button 
            onClick={() => setActiveTab('home')}
            className="w-full py-4 bg-accent text-white font-bold rounded-2xl hover:opacity-90 transition-colors shadow-lg shadow-accent/20"
          >
            Got it, let's cook!
          </button>
        </div>
      </div>
    </div>
  );
});

export default HelpView;
