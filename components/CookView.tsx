import React, { memo } from 'react';
import { LayoutGrid, Loader2, BarChart3, Star, ChevronRight } from 'lucide-react';
import { Meal, MealGenerationParams, UserPreferences } from '../types';

interface CookViewProps {
  theme: 'dark' | 'light';
  preferences: UserPreferences;
  mealGenStep: number;
  mealGenParams: MealGenerationParams;
  isPlanLoading: boolean;
  generatedMeals: Meal[];
  setMealGenStep: (step: number) => void;
  setMealGenParams: (params: MealGenerationParams) => void;
  handleGenerateSingleMeal: () => void;
  setSelectedMeal: (meal: Meal) => void;
  dialRef: React.RefObject<HTMLDivElement | null>;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseLeave: () => void;
  handleMouseUp: () => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  setIsTabDragDisabled: (disabled: boolean) => void;
}

const CookView: React.FC<CookViewProps> = memo(({
  theme,
  preferences,
  mealGenStep,
  mealGenParams,
  isPlanLoading,
  generatedMeals,
  setMealGenStep,
  setMealGenParams,
  handleGenerateSingleMeal,
  setSelectedMeal,
  dialRef,
  handleMouseDown,
  handleMouseLeave,
  handleMouseUp,
  handleMouseMove,
  setIsTabDragDisabled
}) => {
  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
      {mealGenStep === 0 && (
        <div className="space-y-8 py-4">
          <div className="text-center space-y-2">
            <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-accent ${theme === 'dark' ? 'bg-accent/20' : 'bg-accent/10'}`}>
              <LayoutGrid size={32} />
            </div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Meal Generator</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Let's find the perfect meal for you right now.</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between gap-6 p-4 rounded-2xl border border-zinc-100/10 bg-zinc-500/5">
              <label className={`text-sm font-bold uppercase tracking-widest leading-tight flex-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>
                How many people are you cooking for?
              </label>
              <div className="relative group h-32 w-20 shrink-0">
                <div 
                  ref={dialRef}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  onScroll={(e) => {
                    const container = e.currentTarget;
                    const itemHeight = 40; // 32px (h-8) + 8px (gap-2)
                    // Calculate which item is closest to the center of the 128px (h-32) container
                    const scrollCenter = container.scrollTop + 64; 
                    const index = Math.round((scrollCenter - 48 - 16) / itemHeight);
                    const newCount = Math.max(1, Math.min(20, index + 1));
                    if (newCount !== mealGenParams.peopleCount) {
                      setMealGenParams({...mealGenParams, peopleCount: newCount});
                    }
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    setIsTabDragDisabled(true);
                  }}
                  onTouchMove={(e) => {
                    e.stopPropagation();
                  }}
                  onTouchEnd={() => {
                    setIsTabDragDisabled(false);
                  }}
                  onTouchCancel={() => {
                    setIsTabDragDisabled(false);
                  }}
                  onWheel={(e) => {
                    e.stopPropagation();
                    if (dialRef.current) {
                      dialRef.current.scrollTop += e.deltaY;
                    }
                  }}
                  className="flex flex-col items-center gap-2 overflow-y-auto h-full py-12 px-2 snap-y snap-mandatory no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing select-none"
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                    <button
                      key={num}
                      onClick={() => {
                        setMealGenParams({...mealGenParams, peopleCount: num});
                        if (dialRef.current) {
                          const itemHeight = 40;
                          dialRef.current.scrollTo({
                            top: (num - 1) * itemHeight,
                            behavior: 'smooth'
                          });
                        }
                      }}
                      className={`flex-shrink-0 w-8 h-8 rounded-lg font-bold border transition-all snap-center flex items-center justify-center text-sm ${mealGenParams.peopleCount === num 
                        ? `scale-125 z-10 shadow-lg` 
                        : theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300' : 'bg-white border-zinc-200 text-black'}`}
                      style={mealGenParams.peopleCount === num ? { 
                        backgroundColor: preferences.accentColor,
                        borderColor: preferences.accentColor,
                        color: 'var(--complementary-contrast)', 
                        boxShadow: `0 10px 15px -3px ${preferences.accentColor}40`,
                        outline: `2px solid ${preferences.accentColor}`,
                        outlineOffset: '2px'
                      } : {}}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                {/* Gradient overlays for vertical */}
                <div className={`absolute inset-x-0 top-0 h-12 pointer-events-none rounded-t-2xl ${theme === 'dark' ? 'bg-gradient-to-b from-black via-black/80 to-transparent' : 'bg-gradient-to-b from-zinc-50 via-zinc-50/80 to-transparent'} opacity-95`}></div>
                <div className={`absolute inset-x-0 bottom-0 h-12 pointer-events-none rounded-b-2xl ${theme === 'dark' ? 'bg-gradient-to-t from-black via-black/80 to-transparent' : 'bg-gradient-to-t from-zinc-50 via-zinc-50/80 to-transparent'} opacity-95`}></div>
              </div>
            </div>

            <div className="space-y-4">
              <label className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>What is the purpose of this meal?</label>
              <div className="grid grid-cols-2 gap-3">
                {(['protein', 'casual', 'healthy', 'quick'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setMealGenParams({...mealGenParams, purpose: p})}
                    className={`py-4 rounded-2xl font-bold border transition-all capitalize ${mealGenParams.purpose === p 
                      ? `bg-accent border-accent ${theme === 'dark' ? 'text-white' : 'text-black'}` 
                      : theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-white border-zinc-200 text-black'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setMealGenStep(1)}
              className="w-full py-4 bg-accent text-white font-bold rounded-2xl hover:opacity-90 transition-colors shadow-lg shadow-accent/20"
            >
              Next Step
            </button>
          </div>
        </div>
      )}

      {mealGenStep === 1 && (
        <div className="space-y-8 py-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <label className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Which meal type(s)?</label>
              <div className="grid grid-cols-2 gap-3">
                {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      const current = mealGenParams.mealTypes;
                      const next = current.includes(type) 
                        ? current.filter(t => t !== type) 
                        : [...current, type];
                      setMealGenParams({...mealGenParams, mealTypes: next});
                    }}
                    className={`py-4 rounded-2xl font-bold border transition-all ${mealGenParams.mealTypes.includes(type) 
                      ? 'bg-accent border-accent text-white' 
                      : theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-white border-zinc-200 text-black'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>How much time do you have?</label>
              <div className="grid grid-cols-3 gap-3">
                {[15, 30, 60].map(time => (
                  <button
                    key={time}
                    onClick={() => setMealGenParams({...mealGenParams, maxTime: time})}
                    className={`py-4 rounded-2xl font-bold border transition-all ${mealGenParams.maxTime === time 
                      ? 'bg-accent border-accent text-white' 
                      : theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-black'}`}
                  >
                    {time}m
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setMealGenStep(0)}
                className={`flex-1 py-4 font-bold rounded-2xl border transition-all ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-black'}`}
              >
                Back
              </button>
              <button 
                onClick={() => setMealGenStep(2)}
                className="flex-[2] py-4 bg-accent text-white font-bold rounded-2xl hover:opacity-90 transition-colors shadow-lg shadow-accent/20"
              >
                Next Step
              </button>
            </div>
          </div>
        </div>
      )}

      {mealGenStep === 2 && (
        <div className="space-y-8 py-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <label className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Complexity level?</label>
              <div className="grid grid-cols-3 gap-3">
                {(['simple', 'moderate', 'advanced'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setMealGenParams({...mealGenParams, complexity: c})}
                    className={`py-4 rounded-2xl font-bold border transition-all capitalize ${mealGenParams.complexity === c 
                      ? 'bg-accent border-accent text-white' 
                      : theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-black'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Preferred cooking method?</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'stovetop', label: 'Stovetop' },
                  { id: 'oven', label: 'Oven' },
                  { id: 'air_fryer', label: 'Air Fryer' },
                  { id: 'one_pan', label: 'One-pan' },
                  { id: 'none', label: 'No preference' }
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setMealGenParams({...mealGenParams, cookingMethod: method.id as any})}
                    className={`py-4 rounded-2xl font-bold border transition-all ${mealGenParams.cookingMethod === method.id 
                      ? 'bg-accent border-accent text-white' 
                      : theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-black'}`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setMealGenStep(1)}
                className={`flex-1 py-4 font-bold rounded-2xl border transition-all ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-black'}`}
              >
                Back
              </button>
              <button 
                onClick={handleGenerateSingleMeal}
                disabled={isPlanLoading}
                className="flex-[2] py-4 bg-accent text-white font-bold rounded-2xl hover:opacity-90 transition-colors shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
              >
                {isPlanLoading ? <Loader2 className="animate-spin" size={20} /> : <BarChart3 size={20} />}
                Generate Meal
              </button>
            </div>
          </div>
        </div>
      )}

      {mealGenStep === 100 && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Your Meal Options</h2>
            <button 
              onClick={() => setMealGenStep(0)}
              className="text-xs font-bold text-accent hover:underline"
            >
              Start Over
            </button>
          </div>

          <div className="space-y-4">
            {generatedMeals.map(meal => (
              <div 
                key={meal.id} 
                onClick={() => setSelectedMeal(meal)}
                className={`p-4 rounded-2xl shadow-sm border cursor-pointer hover:border-accent transition-colors ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${theme === 'dark' ? 'text-accent bg-accent/20' : 'text-accent bg-accent/10'}`}>{meal.type}</span>
                    <h4 className={`font-bold mt-1 ${theme === 'dark' ? 'text-zinc-100' : 'text-black'}`}>{meal.name}</h4>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star size={12} fill="currentColor" /> {meal.rating}
                  </div>
                </div>
                
                <div className={`flex gap-4 border-t pt-3 mt-3 ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-100'}`}>
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>PRO</span>
                    <span className={`text-xs font-bold ${theme === 'dark' ? 'text-zinc-300' : 'text-black'}`}>{meal.protein}g</span>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>CAL</span>
                    <span className="text-xs font-bold text-accent">{meal.calories}</span>
                  </div>
                  <div className={`ml-auto flex items-center text-[10px] font-bold ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>
                    View Recipe <ChevronRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default CookView;
