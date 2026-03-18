import React, { memo } from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { Meal, TabType } from '../types';

interface HomeViewProps {
  theme: 'dark' | 'light';
  generatedMeals: Meal[];
  savedRecipes: Meal[];
  pantryCount: number;
  weeklyStats: { calories: number; protein: number; carbs: number; fat: number };
  weeklyHistory: Meal[];
  onSelectMeal: (meal: Meal) => void;
  setActiveTab: (tab: TabType) => void;
}

const HomeView: React.FC<HomeViewProps> = memo(({ 
  theme, 
  generatedMeals, 
  savedRecipes, 
  pantryCount, 
  weeklyStats, 
  weeklyHistory, 
  onSelectMeal, 
  setActiveTab 
}) => {
  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <section>
        <h2 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-zinc-100' : 'text-black'}`}>Latest Suggestions</h2>
        <div className="space-y-4">
          {generatedMeals.length > 0 ? (
            generatedMeals.map(meal => (
              <div 
                key={meal.id} 
                onClick={() => onSelectMeal(meal)}
                className={`p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer transition-all hover:scale-[1.02] ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold border-2 ${theme === 'dark' ? 'bg-complementary/10 border-complementary text-complementary' : 'bg-complementary/5 border-complementary text-black'}`}>
                  {meal.type[0]}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-zinc-100' : 'text-black'}`}>{meal.name}</h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>
                    {meal.calories} kcal • {meal.protein}g protein
                  </p>
                </div>
                <div className="flex items-center gap-1 text-complementary font-bold text-sm">
                  <Star size={14} fill="currentColor" className={theme === 'dark' ? 'text-complementary' : 'text-black'} />
                  <span className={theme === 'dark' ? 'text-complementary' : 'text-black'}>{meal.rating}</span>
                </div>
              </div>
            ))
          ) : (
            <div className={`rounded-2xl p-8 text-center border-2 border-dashed ${theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
              <p className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-400' : 'text-black'}`}>No meals generated yet</p>
              <button 
                onClick={() => setActiveTab('cook')}
                className={`mt-4 font-bold text-sm hover:underline ${theme === 'dark' ? 'text-accent' : 'text-black'}`}
              >
                Generate a meal
              </button>
            </div>
          )}
        </div>
      </section>

      {savedRecipes.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-black'}`}>Saved Recipes</h2>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${theme === 'dark' ? 'text-accent bg-accent/10' : 'text-black bg-zinc-200'}`}>{savedRecipes.length}</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar snap-x">
            {savedRecipes.map(meal => (
              <div 
                key={meal.id} 
                onClick={() => onSelectMeal(meal)}
                className={`min-w-[200px] snap-start p-4 rounded-2xl shadow-sm border space-y-3 cursor-pointer transition-all hover:scale-[1.02] ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${theme === 'dark' ? 'bg-accent/30 text-accent' : 'bg-accent/20 text-black'}`}>
                  {meal.type[0]}
                </div>
                <div>
                  <h3 className={`font-semibold text-sm line-clamp-1 ${theme === 'dark' ? 'text-zinc-100' : 'text-black'}`}>{meal.name}</h3>
                  <p className={`text-[10px] ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>
                    {meal.calories} kcal • {meal.maxTime} min
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-zinc-100' : 'text-black'}`}>Pantry Status</h2>
        <div className={`rounded-2xl p-6 shadow-lg relative overflow-hidden ${theme === 'dark' ? 'bg-accent text-white shadow-accent/20' : 'bg-accent text-black shadow-none'}`}>
          <div className="relative z-10">
            <p className={`${theme === 'dark' ? 'text-white/90' : 'text-black'} text-sm font-medium`}>Total Items</p>
            <h3 className="text-3xl font-bold">{pantryCount}</h3>
            <button 
              onClick={() => setActiveTab('pantry')}
              className={`mt-4 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${theme === 'dark' ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-black/10 hover:bg-black/20 text-black'}`}
            >
              Manage Pantry <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-zinc-100' : 'text-black'}`}>Weekly History</h2>
        {weeklyHistory.length > 0 ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border-2 grid grid-cols-4 gap-2 text-center transition-colors ${theme === 'dark' ? 'bg-zinc-900 border-complementary' : 'bg-white border-complementary'}`}>
              <div>
                <p className={`text-[10px] uppercase font-bold ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Calories</p>
                <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{weeklyStats.calories}</p>
              </div>
              <div>
                <p className={`text-[10px] uppercase font-bold ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Protein</p>
                <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{weeklyStats.protein}g</p>
              </div>
              <div>
                <p className={`text-[10px] uppercase font-bold ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Carbs</p>
                <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{weeklyStats.carbs}g</p>
              </div>
              <div>
                <p className={`text-[10px] uppercase font-bold ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Fat</p>
                <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{weeklyStats.fat}g</p>
              </div>
            </div>
            <div className="space-y-3">
              {weeklyHistory.slice(0, 5).map(meal => (
                <div 
                  key={meal.id + (meal.timestamp || '')} 
                  onClick={() => onSelectMeal(meal)}
                  className={`p-3 rounded-xl border flex items-center justify-between group cursor-pointer hover:border-accent transition-colors ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${theme === 'dark' ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-black'}`}>
                      {meal.type[0]}
                    </div>
                    <div>
                      <h4 className={`text-xs font-semibold ${theme === 'dark' ? 'text-zinc-100' : 'text-black'}`}>{meal.name}</h4>
                      <p className={`text-[10px] ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>{new Date(meal.timestamp || 0).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className={`${theme === 'dark' ? 'text-zinc-500' : 'text-black'} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`rounded-2xl p-6 text-center border-2 border-dashed ${theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
            <p className={`text-xs font-bold ${theme === 'dark' ? 'text-zinc-400' : 'text-black'}`}>No history for the past 7 days</p>
          </div>
        )}
      </section>
    </div>
  );
});

export default HomeView;
