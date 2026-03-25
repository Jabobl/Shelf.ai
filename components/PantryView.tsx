import React, { memo } from 'react';
import { Filter, Plus, Camera, ChevronDown, ChevronUp } from 'lucide-react';
import { PantryItem, UserPreferences } from '../types';

interface PantryViewProps {
  theme: 'dark' | 'light';
  preferences: UserPreferences;
  isScanning: boolean;
  groupedPantry: Record<string, PantryItem[]>;
  collapsedCategories: string[];
  setIsFilterModalOpen: (open: boolean) => void;
  setIsAddItemModalOpen: (open: boolean) => void;
  toggleCategoryCollapse: (category: string) => void;
  setEditingItem: (item: PantryItem) => void;
}

const PantryView: React.FC<PantryViewProps> = memo(({
  theme,
  preferences,
  isScanning,
  groupedPantry,
  collapsedCategories,
  setIsFilterModalOpen,
  setIsAddItemModalOpen,
  toggleCategoryCollapse,
  setEditingItem
}) => {
  return (
    <div className="p-6 space-y-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Your Pantry</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800' : 'bg-zinc-100 text-black hover:bg-zinc-200'}`}
          >
            <Filter size={18} />
          </button>
          <button 
            onClick={() => setIsAddItemModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm cursor-pointer hover:opacity-90 transition-colors shadow-lg shadow-accent/20 ${theme === 'dark' ? 'text-white' : 'text-black'}`}
            style={{ backgroundColor: preferences.accentColor }}
          >
            <Plus size={18} />
            Add Item
          </button>
        </div>
      </div>

      {isScanning && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-pulse border ${theme === 'dark' ? 'bg-accent/20 border-accent/30 text-accent' : 'bg-accent/10 border-accent/20 text-accent'}`}>
          <Camera className={theme === 'dark' ? 'text-accent' : 'text-accent'} />
          <p className="text-sm font-medium">Gemini is analyzing your kitchen...</p>
        </div>
      )}

      <div className="space-y-6">
        {(Object.entries(groupedPantry) as [string, PantryItem[]][]).map(([category, items]) => (
          <div key={category} className="space-y-2">
            <button 
              onClick={() => toggleCategoryCollapse(category)}
              className="flex items-center justify-between w-full text-left group"
            >
              <h3 className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>{category} ({items.length})</h3>
              <div className={`h-px flex-1 mx-4 transition-colors ${theme === 'dark' ? 'bg-zinc-800 group-hover:bg-complementary/30' : 'bg-zinc-200 group-hover:bg-complementary/20'}`}></div>
              {collapsedCategories.includes(category) ? <ChevronDown size={14} className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'} /> : <ChevronUp size={14} className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'} />}
            </button>
            
            {!collapsedCategories.includes(category) && (
              <div className="grid grid-cols-1 gap-3 animate-in slide-in-from-top-2 duration-200">
                {items.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => setEditingItem(item)}
                    className={`p-4 rounded-xl border flex items-center justify-between group cursor-pointer hover:border-accent transition-colors ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      {item.isLeftover && <div className="w-2 h-2 bg-amber-500 rounded-full"></div>}
                      <div>
                        <h4 className={`font-semibold ${theme === 'dark' ? 'text-zinc-100' : 'text-black'}`}>{item.name}</h4>
                        <p className={`text-xs font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>{item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-complementary">
                        <span className={theme === 'dark' ? 'text-complementary' : 'text-black'}>{item.calories || 0} kcal</span>
                      </p>
                      <p className={`text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Edit</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export default PantryView;
