import React, { useState, memo, useMemo, useCallback } from 'react';
import { COOKING_TERMS } from '../constants/cookingTerms';
import { X, Info } from 'lucide-react';

interface RecipeStepProps {
  step: string;
  theme: 'dark' | 'light';
}

export const RecipeStep: React.FC<RecipeStepProps> = memo(({ step, theme }) => {
  const [activeTerm, setActiveTerm] = useState<{ term: string; definition: string } | null>(null);

  const words = useMemo(() => step.split(/(\s+)/), [step]); // Keep whitespace

  const renderContent = useCallback(() => {
    return words.map((word, index) => {
      // Clean word for lookup (remove punctuation)
      const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
      const definition = COOKING_TERMS[cleanWord];

      if (definition) {
        return (
          <span
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTerm({ term: cleanWord, definition });
            }}
            className="cursor-help font-bold text-accent hover:opacity-80 underline decoration-dotted underline-offset-4 transition-colors"
          >
            {word}
          </span>
        );
      }
      return word;
    });
  }, [words]);

  return (
    <div className="relative">
      <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
        {renderContent()}
      </p>

      {activeTerm && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200"
          onClick={() => setActiveTerm(null)}
        >
          <div 
            className={`w-full max-w-xs rounded-2xl p-6 shadow-2xl border animate-in zoom-in-95 duration-200 ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-accent">
                <Info size={18} />
                <h4 className="font-bold capitalize">{activeTerm.term}</h4>
              </div>
              <button 
                onClick={() => setActiveTerm(null)}
                className={`p-1 rounded-full transition-colors ${
                  theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-500' : 'hover:bg-zinc-100 text-zinc-400'
                }`}
              >
                <X size={18} />
              </button>
            </div>
            <div className={`space-y-2 ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}`}>
              {activeTerm.definition.split(/\d\.\s/).filter(Boolean).map((step, i) => (
                <div key={i} className="flex gap-3 text-sm leading-relaxed">
                  <span className="font-bold text-accent">{i + 1}.</span>
                  <span>{step.trim()}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setActiveTerm(null)}
              className="w-full mt-6 py-3 bg-accent text-white font-bold rounded-xl hover:opacity-90 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
