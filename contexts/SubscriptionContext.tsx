import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SubscriptionState } from '../types';
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged, collection, doc, onSnapshot, setDoc, getDoc, query, where, limit, addDoc, FirebaseUser } from '../firebase';
import { loadStripe } from '@stripe/stripe-js';

interface SubscriptionContextType extends SubscriptionState {
  user: FirebaseUser | null;
  authLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  startSubscription: (priceId: string) => Promise<void>;
  manageSubscription: () => Promise<void>;
  isSubscriptionActive: () => boolean;
  incrementUsage: () => Promise<void>;
  canGenerateRecipe: () => boolean;
  remainingFreeRecipes: number;
}

const FREE_DAILY_LIMIT = 3;

const initialState: SubscriptionState = {
  isSubscribed: false,
  subscriptionStartDate: null,
  subscriptionEndDate: null,
  trialUsed: false,
  dailyUsageCount: 0,
  lastUsageDate: new Date().toISOString().split('T')[0],
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [state, setState] = useState<SubscriptionState>(initialState);

  // Handle Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      if (!u) {
        setState(initialState);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync User Data (Usage Counts)
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const today = new Date().toISOString().split('T')[0];
        
        if (data.lastUsageDate !== today) {
          // Reset daily count if it's a new day
          setDoc(userDocRef, { dailyUsageCount: 0, lastUsageDate: today }, { merge: true });
        } else {
          setState(prev => ({
            ...prev,
            dailyUsageCount: data.dailyUsageCount || 0,
            lastUsageDate: data.lastUsageDate || today,
          }));
        }
      } else {
        // Initialize user doc
        const today = new Date().toISOString().split('T')[0];
        setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          dailyUsageCount: 0,
          lastUsageDate: today,
        });
      }
    }, (error) => {
      console.error('Firestore Error (User Sync):', error);
    });

    return () => unsubscribe();
  }, [user]);

  // Sync Subscription Data
  useEffect(() => {
    if (!user) return;

    const subsRef = collection(db, 'users', user.uid, 'subscriptions');
    const q = query(subsRef, where('status', 'in', ['active', 'trialing']), limit(1));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const sub = snapshot.docs[0].data();
        setState(prev => ({
          ...prev,
          isSubscribed: true,
          subscriptionStartDate: sub.current_period_start?.seconds * 1000 || Date.now(),
          subscriptionEndDate: sub.current_period_end?.seconds * 1000 || null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          isSubscribed: false,
          subscriptionEndDate: null,
        }));
      }
    }, (error) => {
      console.error('Firestore Error (Sub Sync):', error);
    });

    return () => unsubscribe();
  }, [user]);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isSubscriptionActive = () => {
    return state.isSubscribed;
  };

  const startSubscription = async (priceId: string) => {
    if (!user) {
      await login();
      return;
    }

    // Fallback: If a direct payment link is provided, use it.
    const DIRECT_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK || 'https://buy.stripe.com/test_dRm5kC0Mjd3A2b01lC4ko00';
    if (DIRECT_LINK) {
      window.location.href = DIRECT_LINK;
      return;
    }

    try {
      const checkoutSessionsRef = collection(db, 'users', user.uid, 'checkout_sessions');
      const docRef = await addDoc(checkoutSessionsRef, {
        price: priceId,
        success_url: window.location.href, // Return to current page
        cancel_url: window.location.href,
      });

      // Wait for the extension to create the checkout session
      const timeout = setTimeout(() => {
        unsubscribe();
        console.warn("Stripe extension timeout: No checkout URL generated within 10s.");
        alert("The Stripe extension is taking too long to respond. Please ensure it's installed and configured in your Firebase console, and that your project is on the 'Blaze' plan.");
      }, 10000);

      const unsubscribe = onSnapshot(docRef, (snap) => {
        const { url, error } = snap.data() || {};
        if (url) {
          clearTimeout(timeout);
          unsubscribe();
          window.location.assign(url);
        }
        if (error) {
          clearTimeout(timeout);
          unsubscribe();
          console.error(`Stripe Error: ${error.message}`);
          alert(`Subscription Error: ${error.message}`);
        }
      });
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const manageSubscription = async () => {
    if (!user) return;
    
    try {
      const portalSessionsRef = collection(db, 'users', user.uid, 'portal_sessions');
      const docRef = await addDoc(portalSessionsRef, {
        return_url: window.location.href,
      });

      const unsubscribe = onSnapshot(docRef, (snap) => {
        const { url, error } = snap.data() || {};
        if (url) {
          unsubscribe();
          window.location.assign(url);
        }
        if (error) {
          unsubscribe();
          console.error(`Stripe Portal Error: ${error.message}`);
          alert(`Portal Error: ${error.message}`);
        }
      });
    } catch (error) {
      console.error('Portal error:', error);
    }
  };

  const incrementUsage = async () => {
    if (!user || isSubscriptionActive()) return;

    const userDocRef = doc(db, 'users', user.uid);
    const today = new Date().toISOString().split('T')[0];
    
    await setDoc(userDocRef, {
      dailyUsageCount: state.dailyUsageCount + 1,
      lastUsageDate: today,
    }, { merge: true });
  };

  const canGenerateRecipe = () => {
    if (isSubscriptionActive()) return true;
    return state.dailyUsageCount < FREE_DAILY_LIMIT;
  };

  const remainingFreeRecipes = Math.max(0, FREE_DAILY_LIMIT - state.dailyUsageCount);

  return (
    <SubscriptionContext.Provider
      value={{
        ...state,
        user,
        authLoading,
        login,
        logout,
        startSubscription,
        manageSubscription,
        isSubscriptionActive,
        incrementUsage,
        canGenerateRecipe,
        remainingFreeRecipes,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
