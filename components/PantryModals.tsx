
import React, { useState, useEffect, memo } from 'react';
import { X, Filter, SortAsc, ChevronDown, ChevronUp, Save, Trash2, Info } from 'lucide-react';
import { PantryItem, SortOption, FilterCriteria } from '../types';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PantryItem | null;
  onSave: (item: PantryItem) => void;
  onDelete: (id: string) => void;
  theme: 'dark' | 'light';
}

export const EditItemModal = memo(function EditItemModal({ isOpen, onClose, item, onSave, onDelete, theme }: EditItemModalProps) {
  const [editedItem, setEditedItem] = useState<PantryItem | null>(null);

  useEffect(() => {
    if (isOpen && item) {
      setEditedItem({ ...item });
    }
  }, [isOpen, item]);

  if (!isOpen || !editedItem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedItem);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border animate-in zoom-in-95 duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`p-6 border-b flex items-center justify-between ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-100'}`}>
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Edit Item</h3>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-black'}`}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Item Name</label>
            <input 
              type="text" 
              required
              className={`w-full border rounded-xl p-3 font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`}
              value={editedItem.name}
              onChange={e => setEditedItem({...editedItem, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Quantity</label>
              <input 
                type="text" 
                required
                className={`w-full border rounded-xl p-3 font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`}
                value={editedItem.quantity}
                onChange={e => setEditedItem({...editedItem, quantity: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Category</label>
              <select 
                className={`w-full border rounded-xl p-3 font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`}
                value={editedItem.category}
                onChange={e => setEditedItem({...editedItem, category: e.target.value})}
              >
                <option>Produce</option>
                <option>Dairy</option>
                <option>Meat</option>
                <option>Pantry</option>
                <option>Frozen</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className={`pt-4 border-t ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-100'}`}>
            <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Nutritional Info</p>
            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-zinc-600' : 'text-black'}`}>Cal</label>
                <input 
                  type="number" 
                  className={`w-full border rounded-lg p-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-accent ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`}
                  value={editedItem.calories || 0}
                  onChange={e => setEditedItem({...editedItem, calories: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-zinc-600' : 'text-black'}`}>Pro</label>
                <input 
                  type="number" 
                  className={`w-full border rounded-lg p-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-accent ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`}
                  value={editedItem.protein || 0}
                  onChange={e => setEditedItem({...editedItem, protein: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-zinc-600' : 'text-black'}`}>Carb</label>
                <input 
                  type="number" 
                  className={`w-full border rounded-lg p-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-accent ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`}
                  value={editedItem.carbs || 0}
                  onChange={e => setEditedItem({...editedItem, carbs: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-zinc-600' : 'text-black'}`}>Fat</label>
                <input 
                  type="number" 
                  className={`w-full border rounded-lg p-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-accent ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`}
                  value={editedItem.fat || 0}
                  onChange={e => setEditedItem({...editedItem, fat: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={() => {
                onDelete(editedItem.id);
                onClose();
              }}
              className="flex-1 py-3 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Delete
            </button>
            <button 
              type="submit"
              className="flex-[2] py-3 bg-accent text-white font-bold rounded-xl hover:opacity-90 transition-colors shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

interface FilterSortModalProps {
  isOpen: boolean;
  onClose: () => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  filterCriteria: FilterCriteria;
  onFilterChange: (criteria: FilterCriteria) => void;
  theme: 'dark' | 'light';
}

export const FilterSortModal = memo(function FilterSortModal({ isOpen, onClose, sortOption, onSortChange, filterCriteria, onFilterChange, theme }: FilterSortModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-xs rounded-3xl overflow-hidden shadow-2xl border animate-in zoom-in-95 duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`p-6 border-b flex items-center justify-between ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-100'}`}>
          <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Filter & Sort</h3>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-black'}`}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section className="space-y-3">
            <h4 className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Sort By</h4>
            <div className="grid grid-cols-2 gap-2">
              {(['name', 'category', 'calories', 'protein'] as SortOption[]).map(opt => (
                <button
                  key={opt}
                  onClick={() => onSortChange(opt)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all capitalize ${sortOption === opt 
                    ? 'bg-accent border-accent text-white' 
                    : theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-black'}`}
                >
                  {opt === 'protein' ? 'Protein' : opt}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h4 className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Filter Category</h4>
            <select 
              className={`w-full border rounded-xl p-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`}
              value={filterCriteria.category || ''}
              onChange={e => onFilterChange({...filterCriteria, category: e.target.value || undefined})}
            >
              <option value="">All Categories</option>
              <option>Produce</option>
              <option>Dairy</option>
              <option>Meat</option>
              <option>Pantry</option>
              <option>Frozen</option>
              <option>Other</option>
            </select>
          </section>

          <section className="space-y-3">
            <h4 className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Search</h4>
            <input 
              type="text"
              placeholder="Search items..."
              className={`w-full border rounded-xl p-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`}
              value={filterCriteria.search || ''}
              onChange={e => onFilterChange({...filterCriteria, search: e.target.value})}
            />
          </section>

          <button 
            onClick={() => {
              onFilterChange({});
              onSortChange('name');
            }}
            className={`w-full py-3 text-xs font-bold transition-colors ${theme === 'dark' ? 'text-zinc-500 hover:text-accent' : 'text-black hover:text-accent'}`}
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
});

interface LeftoversModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: { name: string, quantity: string }) => void;
  theme: 'dark' | 'light';
}

export const LeftoversModal = memo(function LeftoversModal({ isOpen, onClose, onConfirm, theme }: LeftoversModalProps) {
  const [details, setDetails] = useState({ name: '', quantity: '' });

  useEffect(() => {
    if (isOpen) {
      setDetails({ name: '', quantity: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.name || !details.quantity) return;
    onConfirm(details);
    setDetails({ name: '', quantity: '' });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-xs rounded-3xl overflow-hidden shadow-2xl border animate-in zoom-in-95 duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`p-6 border-b flex items-center justify-between ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-100'}`}>
          <div className="flex items-center gap-2">
            <Info className="text-accent" size={20} />
            <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Identify Leftovers</h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>We found a leftovers container! What's inside?</p>
          
          <div className="space-y-2">
            <label className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Contents</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Pasta Carbonara"
              className={`w-full border rounded-xl p-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`}
              value={details.name}
              onChange={e => setDetails({...details, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Amount</label>
            <input 
              type="text" 
              required
              placeholder="e.g. 1 bowl"
              className={`w-full border rounded-xl p-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`}
              value={details.quantity}
              onChange={e => setDetails({...details, quantity: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-accent text-white font-bold rounded-xl hover:opacity-90 transition-colors shadow-lg shadow-accent/20"
          >
            Add to Pantry
          </button>
        </form>
      </div>
    </div>
  );
});
