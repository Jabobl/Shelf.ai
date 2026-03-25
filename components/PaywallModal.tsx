import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sparkles, Loader2, LogIn } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, theme }) => {
  const { startSubscription, user, login } = useSubscription();
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      await login();
      return;
    }
    setIsSubscribing(true);
    try {
      // Replace with your actual Stripe Price ID from the Firebase console
      const PRICE_ID = 'price_1234567890'; 
      await startSubscription(PRICE_ID);
      // The user will be redirected to Stripe Checkout
    } catch (error) {
      console.error('Subscription failed', error);
      setIsSubscribing(false);
    }
  };

  const benefits = [
    "Unlimited recipes",
    "Faster results",
    "Priority AI",
    "Future premium features"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
          >
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-accent/20 text-accent rounded-xl flex items-center justify-center">
                  <Sparkles size={24} />
                </div>
                <button 
                  onClick={onClose}
                  className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-100 text-zinc-500 hover:text-black'}`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Unlock Unlimited Recipes</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>You've reached your daily limit. Upgrade to Pro for unlimited meal planning.</p>
              </div>

              <div className="space-y-3">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className={`text-sm ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className={`p-4 rounded-2xl border text-center ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
                <p className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>Monthly Plan</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>$5 <span className="text-sm font-normal text-zinc-500">/ month</span></p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSubscribe}
                  disabled={isSubscribing}
                  className="w-full py-4 bg-accent text-white font-bold rounded-2xl shadow-lg shadow-accent/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubscribing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Redirecting to Stripe...
                    </>
                  ) : !user ? (
                    <>
                      <LogIn size={20} />
                      Login to Subscribe
                    </>
                  ) : (
                    'Subscribe Now'
                  )}
                </button>
                <button
                  onClick={onClose}
                  className={`w-full py-4 font-bold rounded-2xl transition-colors ${theme === 'dark' ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-800'}`}
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
