
import React, { useState, useEffect, memo } from 'react';
import { X, Camera, Upload, Plus, Loader2 } from 'lucide-react';
import { PantryItem } from '../types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddManual: (item: { name: string, quantity: string }) => void;
  onScanImage: (file: File) => void;
  isScanning: boolean;
  isResearching: boolean;
  theme: 'dark' | 'light';
}

const AddItemModal = memo(function AddItemModal({ isOpen, onClose, onAddManual, onScanImage, isScanning, isResearching, theme }: AddItemModalProps) {
  const [mode, setMode] = useState<'choice' | 'manual' | 'scan'>('choice');
  const [manualItem, setManualItem] = useState({
    name: '',
    quantity: ''
  });

  useEffect(() => {
    if (isOpen) {
      setMode('choice');
      setManualItem({
        name: '',
        quantity: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualItem.name || !manualItem.quantity) return;
    onAddManual(manualItem);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onScanImage(file);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border animate-in zoom-in-95 duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`p-6 border-b flex items-center justify-between ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-100'}`}>
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            {mode === 'choice' && 'Add to Pantry'}
            {mode === 'manual' && 'Manual Entry'}
            {mode === 'scan' && 'Visual Scan'}
          </h3>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-black'}`}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {mode === 'choice' && (
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => setMode('manual')}
                className={`flex items-center gap-4 p-5 rounded-2xl border transition-all group ${theme === 'dark' ? 'bg-zinc-800/50 hover:bg-zinc-800 border-zinc-700' : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-100'}`}
              >
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
                  <Plus size={24} />
                </div>
                <div className="text-left">
                  <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Manual Entry</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Type in name, weight, and macros</p>
                </div>
              </button>

              <button 
                onClick={() => setMode('scan')}
                className={`flex items-center gap-4 p-5 rounded-2xl border transition-all group ${theme === 'dark' ? 'bg-zinc-800/50 hover:bg-zinc-800 border-zinc-700' : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-100'}`}
              >
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-900/20 group-hover:scale-110 transition-transform">
                  <Camera size={24} />
                </div>
                <div className="text-left">
                  <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>AI Visual Scan</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Take a photo to detect multiple items</p>
                </div>
              </button>
            </div>
          )}

          {mode === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Item Name</label>
                  <input 
                    type="text" 
                    required
                    disabled={isResearching}
                    placeholder="e.g. Chicken Breast"
                    className={`w-full border rounded-xl p-4 font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-50 ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`}
                    value={manualItem.name}
                    onChange={e => setManualItem({...manualItem, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Amount (e.g. 500g, 2 pieces)</label>
                  <input 
                    type="text" 
                    required
                    disabled={isResearching}
                    placeholder="500g"
                    className={`w-full border rounded-xl p-4 font-bold focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-50 ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`}
                    value={manualItem.quantity}
                    onChange={e => setManualItem({...manualItem, quantity: e.target.value})}
                  />
                </div>
              </div>

              <div className={`p-4 rounded-2xl border flex gap-4 ${isResearching ? 'bg-accent/20 border-accent/30' : theme === 'dark' ? 'bg-zinc-800/30 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isResearching ? 'bg-accent text-white' : theme === 'dark' ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-200 text-black'}`}>
                  {isResearching ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-black'}`}>AI Research Enabled</h4>
                  <p className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>Shelf AI will automatically find the category and nutritional profile for this item.</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  disabled={isResearching}
                  onClick={() => setMode('choice')}
                  className={`flex-1 py-4 font-bold rounded-2xl transition-colors disabled:opacity-50 ${theme === 'dark' ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 text-black hover:bg-zinc-200'}`}
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={isResearching}
                  className={`flex-[2] py-4 bg-accent font-bold rounded-2xl hover:opacity-90 transition-colors shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-50 ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                >
                  {isResearching ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Researching...
                    </>
                  ) : (
                    'Add Item'
                  )}
                </button>
              </div>
            </form>
          )}

          {mode === 'scan' && (
            <div className="space-y-6 text-center py-4">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-2 ${theme === 'dark' ? 'bg-emerald-900/20 text-emerald-500 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                {isScanning ? <Loader2 size={40} className="animate-spin" /> : <Camera size={40} />}
              </div>
              
              <div>
                <h4 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {isScanning ? 'Analyzing Image...' : 'Ready to Scan'}
                </h4>
                <p className={`text-sm max-w-[250px] mx-auto ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>
                  {isScanning 
                    ? 'Shelf AI is identifying items and estimating nutritional data.' 
                    : 'Take a clear photo of your ingredients or fridge shelf.'}
                </p>
              </div>

              {!isScanning && (
                <div className="flex flex-col gap-3">
                  <label className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/20 cursor-pointer flex items-center justify-center gap-2">
                    <Camera size={20} />
                    Take Photo
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                  </label>
                  <label className={`w-full py-4 font-bold rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-2 border ${theme === 'dark' ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-700' : 'bg-zinc-100 text-black hover:bg-zinc-200 border-zinc-200'}`}>
                    <Upload size={20} />
                    Upload from Gallery
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                  <p className={`text-[10px] leading-tight mt-1 italic px-2 ${theme === 'dark' ? 'text-zinc-500' : 'text-black'}`}>
                    Image scanning may not be perfect—please review your pantry after adding items to ensure everything was detected correctly.
                  </p>
                  <button 
                    onClick={() => setMode('choice')}
                    className={`text-sm font-bold pt-2 ${theme === 'dark' ? 'text-zinc-500 hover:text-zinc-400' : 'text-black hover:text-black/80'}`}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default AddItemModal;
