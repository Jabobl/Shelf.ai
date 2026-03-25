import React from 'react';
import { Calendar, CreditCard, CheckCircle2, XCircle, ChevronRight, Sparkles, LogIn, LogOut } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';

interface SubscriptionStatusCardProps {
  theme: 'dark' | 'light';
  onUpgrade: () => void;
}

export const SubscriptionStatusCard: React.FC<SubscriptionStatusCardProps> = ({ theme, onUpgrade }) => {
  const { isSubscribed, subscriptionStartDate, subscriptionEndDate, cancelSubscription, user, login, logout, authLoading } = useSubscription();

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const daysRemaining = subscriptionEndDate 
    ? Math.max(0, Math.ceil((subscriptionEndDate - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  if (authLoading) {
    return (
      <div className={`p-6 rounded-3xl border animate-pulse ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className={`h-20 rounded-2xl ${theme === 'dark' ? 'bg-zinc-800/50' : 'bg-zinc-100'}`} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`p-6 rounded-3xl border shadow-sm transition-all ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1">
            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Account Required</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>Login to manage your subscription and sync your pantry across devices.</p>
          </div>
        </div>
        <button
          onClick={login}
          className="w-full py-4 bg-accent text-white font-bold rounded-2xl shadow-lg shadow-accent/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
        >
          <LogIn size={18} />
          Login with Google
        </button>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className={`p-6 rounded-3xl border shadow-sm transition-all ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <XCircle size={16} className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'} />
              <span className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Free Plan</span>
            </div>
            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>You are on Free Plan</h3>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-100 text-zinc-400' : 'bg-zinc-100 text-zinc-500'}`}>
            <CreditCard size={20} />
          </div>
        </div>

        <div className="space-y-4">
          <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Upgrade to Pro for unlimited recipe generations and priority AI processing.
          </p>
          <button
            onClick={onUpgrade}
            className="w-full py-4 bg-accent font-bold rounded-2xl shadow-lg shadow-accent/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 text-white"
          >
            <Sparkles size={18} />
            Upgrade to Pro ($5/month)
          </button>
          
          <button
            onClick={logout}
            className={`w-full py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${theme === 'dark' ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            <LogOut size={14} />
            Logout ({user.email})
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-3xl border shadow-sm transition-all ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">Pro Plan</span>
          </div>
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>You are subscribed</h3>
        </div>
        <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
          <Sparkles size={20} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>Started</p>
            <p className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-black'}`}>{formatDate(subscriptionStartDate)}</p>
          </div>
          <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>Next Billing</p>
            <p className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-black'}`}>{formatDate(subscriptionEndDate)}</p>
          </div>
        </div>

        <div className={`flex items-center justify-between p-4 rounded-2xl border ${theme === 'dark' ? 'bg-accent/10 border-accent/20' : 'bg-accent/5 border-accent/10'}`}>
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-accent" />
            <span className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-black'}`}>{daysRemaining} days remaining</span>
          </div>
          <ChevronRight size={16} className="text-accent" />
        </div>

        <div className="space-y-3">
          <button
            onClick={cancelSubscription}
            className={`w-full py-4 font-bold rounded-2xl transition-colors border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800' : 'bg-zinc-50 border-zinc-200 text-black hover:bg-zinc-100'}`}
          >
            Manage Subscription
          </button>
          
          <button
            onClick={logout}
            className={`w-full py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${theme === 'dark' ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            <LogOut size={14} />
            Logout ({user.email})
          </button>
        </div>
      </div>
    </div>
  );
};
