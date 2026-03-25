import React from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';

interface UsageLimitBannerProps {
  theme: 'dark' | 'light';
  onUpgrade: () => void;
}

export const UsageLimitBanner: React.FC<UsageLimitBannerProps> = ({ theme, onUpgrade }) => {
  const { isSubscribed, remainingFreeRecipes } = useSubscription();

  if (isSubscribed) return null;

  const isWarning = remainingFreeRecipes <= 1;

  return (
    <div 
      onClick={onUpgrade}
      className={`mx-6 mt-4 p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${
        isWarning 
          ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
          : 'bg-accent/10 border-accent/20 text-accent'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          isWarning ? 'bg-amber-500/20' : 'bg-accent/20'
        }`}>
          {isWarning ? <AlertCircle size={20} /> : <Sparkles size={20} />}
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-bold uppercase tracking-widest opacity-60">Daily Limit</p>
          <p className="text-sm font-bold">
            {remainingFreeRecipes === 0 
              ? 'Limit reached for today' 
              : `You have ${remainingFreeRecipes} free recipe${remainingFreeRecipes === 1 ? '' : 's'} left today`}
          </p>
        </div>
      </div>
      <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
        isWarning ? 'bg-amber-500 text-white' : 'bg-accent text-white'
      }`}>
        Upgrade
      </div>
    </div>
  );
};
