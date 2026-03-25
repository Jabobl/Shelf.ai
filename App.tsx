
import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { Home, Refrigerator, Plus, X, Camera, ChevronRight, ChevronLeft, Star, Settings as SettingsIcon, LayoutGrid, BarChart3, Filter, ChevronDown, ChevronUp, Loader2, AlertCircle, Bookmark, BookmarkCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EditItemModal, FilterSortModal, LeftoversModal } from './components/PantryModals';
import { RecipeStep } from './components/RecipeStep';
import { PantryItem, Meal, TabType, UserPreferences, DEFAULT_PREFERENCES, SortOption, FilterCriteria, MealGenerationParams } from './types';
import { gemini } from './services/geminiService';
import { useSubscription } from './contexts/SubscriptionContext';
import { PaywallModal } from './components/PaywallModal';
import { UsageLimitBanner } from './components/UsageLimitBanner';
import Onboarding from './components/Onboarding';
import Settings from './components/Settings';
import AddItemModal from './components/AddItemModal';
import HomeView from './components/HomeView';
import PantryView from './components/PantryView';
import CookView from './components/CookView';
import HelpView from './components/HelpView';

// --- Mock Initial Data (Empty by default as per rules) ---
const INITIAL_PANTRY: PantryItem[] = [];

const TABS_ORDER: TabType[] = ['home', 'pantry', 'cook', 'settings'];

const tabVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

function getComplementaryColor(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Convert to HSL
  let r_norm = r / 255, g_norm = g / 255, b_norm = b / 255;
  let max = Math.max(r_norm, g_norm, b_norm), min = Math.min(r_norm, g_norm, b_norm);
  let h = 0, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r_norm: h = (g_norm - b_norm) / d + (g_norm < b_norm ? 6 : 0); break;
      case g_norm: h = (b_norm - r_norm) / d + 2; break;
      case b_norm: h = (r_norm - g_norm) / d + 4; break;
    }
    h /= 6;
  }
  
  // Rotate Hue by 180 degrees (0.5 in 0-1 range)
  h = (h + 0.5) % 1;
  
  // Convert back to RGB
  let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  let p = 2 * l - q;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  const r_new = Math.round(hue2rgb(p, q, h + 1/3) * 255);
  const g_new = Math.round(hue2rgb(p, q, h) * 255);
  const b_new = Math.round(hue2rgb(p, q, h - 1/3) * 255);
  
  return `#${((1 << 24) + (r_new << 16) + (g_new << 8) + b_new).toString(16).slice(1)}`;
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [direction, setDirection] = useState(0);
  const [pantry, setPantry] = useState<PantryItem[]>(INITIAL_PANTRY);
  const [isScanning, setIsScanning] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [pantryError, setPantryError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Pantry Enhancements State
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({});
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [leftoversToIdentify, setLeftoversToIdentify] = useState<Partial<PantryItem>[]>([]);
  const [isTabDragDisabled, setIsTabDragDisabled] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  // Subscription Hook
  const { canGenerateRecipe, incrementUsage, authLoading, user, isSubscribed } = useSubscription();

  // Meal Generation Questionnaire State
  const [mealGenStep, setMealGenStep] = useState<number>(0);
  const [mealGenParams, setMealGenParams] = useState<MealGenerationParams>({
    peopleCount: 2,
    purpose: 'casual',
    mealTypes: ['Dinner'],
    maxTime: 30,
    complexity: 'moderate',
    cookingMethod: 'none'
  });
  const [generatedMeals, setGeneratedMeals] = useState<Meal[]>([]);
  const [mealHistory, setMealHistory] = useState<Meal[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Meal[]>([]);

  // Onboarding & Preferences State
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  // Dial Scroll Ref
  const dialRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!dialRef.current) return;
    isDragging.current = true;
    startY.current = e.pageY - dialRef.current.offsetTop;
    scrollTop.current = dialRef.current.scrollTop;
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    isDragging.current = false;
  }, []);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    isDragging.current = false;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !dialRef.current) return;
    e.stopPropagation();
    e.preventDefault();
    const y = e.pageY - dialRef.current.offsetTop;
    const walk = (y - startY.current) * 2; // Scroll speed
    dialRef.current.scrollTop = scrollTop.current - walk;
  }, []);

  const handleTabChange = useCallback((newTab: TabType) => {
    const currentIndex = TABS_ORDER.indexOf(activeTab);
    const newIndex = TABS_ORDER.indexOf(newTab);
    if (currentIndex !== -1 && newIndex !== -1) {
      setDirection(newIndex > currentIndex ? 1 : -1);
    }
    setActiveTab(newTab);
  }, [activeTab]);

  const handleSwipe = useCallback((swipeDirection: 'left' | 'right') => {
    const currentIndex = TABS_ORDER.indexOf(activeTab);
    if (currentIndex === -1) return;

    if (swipeDirection === 'left') {
      if (currentIndex < TABS_ORDER.length - 1) {
        handleTabChange(TABS_ORDER[currentIndex + 1]);
      }
    } else {
      if (currentIndex > 0) {
        handleTabChange(TABS_ORDER[currentIndex - 1]);
      }
    }
  }, [activeTab, handleTabChange]);

  // Persistence
  useEffect(() => {
    const savedPantry = localStorage.getItem('shelf_pantry');
    const savedMeals = localStorage.getItem('shelf_generated_meals');
    const savedHistory = localStorage.getItem('shelf_meal_history');
    const savedSavedRecipes = localStorage.getItem('shelf_saved_recipes');
    const savedPrefs = localStorage.getItem('shelf_preferences');
    const savedTheme = localStorage.getItem('shelf_theme');
    const onboardingDone = localStorage.getItem('shelf_onboarding_done');
    const savedActiveTab = localStorage.getItem('shelf_active_tab');
    const savedMealGenParams = localStorage.getItem('shelf_meal_gen_params');
    const savedSortOption = localStorage.getItem('shelf_sort_option');
    const savedFilterCriteria = localStorage.getItem('shelf_filter_criteria');
    const savedCollapsedCategories = localStorage.getItem('shelf_collapsed_categories');
    const savedMealGenStep = localStorage.getItem('shelf_meal_gen_step');

    if (savedPantry) setPantry(JSON.parse(savedPantry));
    if (savedMeals) setGeneratedMeals(JSON.parse(savedMeals));
    if (savedHistory) setMealHistory(JSON.parse(savedHistory));
    if (savedSavedRecipes) setSavedRecipes(JSON.parse(savedSavedRecipes));
    if (savedPrefs) setPreferences(JSON.parse(savedPrefs));
    if (savedTheme) setTheme(savedTheme as 'dark' | 'light');
    if (savedActiveTab) setActiveTab(savedActiveTab as TabType);
    if (savedMealGenParams) setMealGenParams(JSON.parse(savedMealGenParams));
    if (savedSortOption) setSortOption(savedSortOption as SortOption);
    if (savedFilterCriteria) setFilterCriteria(JSON.parse(savedFilterCriteria));
    if (savedCollapsedCategories) setCollapsedCategories(JSON.parse(savedCollapsedCategories));
    if (savedMealGenStep) setMealGenStep(parseInt(savedMealGenStep));
    
    setHasCompletedOnboarding(onboardingDone === 'true');

    const checkApiKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      } else {
        setHasApiKey(true); // Fallback for local dev if needed
      }
    };
    checkApiKey();
  }, []);

  useEffect(() => {
    localStorage.setItem('shelf_pantry', JSON.stringify(pantry));
  }, [pantry]);

  useEffect(() => {
    localStorage.setItem('shelf_generated_meals', JSON.stringify(generatedMeals));
  }, [generatedMeals]);

  useEffect(() => {
    localStorage.setItem('shelf_meal_history', JSON.stringify(mealHistory));
  }, [mealHistory]);

  useEffect(() => {
    localStorage.setItem('shelf_saved_recipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  useEffect(() => {
    localStorage.setItem('shelf_preferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('shelf_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('shelf_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('shelf_meal_gen_params', JSON.stringify(mealGenParams));
  }, [mealGenParams]);

  useEffect(() => {
    localStorage.setItem('shelf_sort_option', sortOption);
  }, [sortOption]);

  useEffect(() => {
    localStorage.setItem('shelf_filter_criteria', JSON.stringify(filterCriteria));
  }, [filterCriteria]);

  useEffect(() => {
    localStorage.setItem('shelf_collapsed_categories', JSON.stringify(collapsedCategories));
  }, [collapsedCategories]);

  useEffect(() => {
    localStorage.setItem('shelf_meal_gen_step', mealGenStep.toString());
  }, [mealGenStep]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', preferences.accentColor);
    const complementary = getComplementaryColor(preferences.accentColor);
    document.documentElement.style.setProperty('--complementary-color', complementary);
    
    // Calculate contrast color for complementary
    const hex = complementary.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    const contrast = brightness > 128 ? '#000000' : '#ffffff';
    document.documentElement.style.setProperty('--complementary-contrast', contrast);
  }, [preferences.accentColor]);

  const handleOpenKeyDialog = useCallback(async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  }, []);

  const handleOnboardingComplete = useCallback((prefs: UserPreferences) => {
    setPreferences(prefs);
    setHasCompletedOnboarding(true);
    localStorage.setItem('shelf_onboarding_done', 'true');
  }, []);

  const handleSkipAll = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    setHasCompletedOnboarding(true);
    localStorage.setItem('shelf_onboarding_done', 'true');
  }, []);

  const handleResetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    setHasCompletedOnboarding(false);
    localStorage.removeItem('shelf_onboarding_done');
    setActiveTab('home');
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!hasApiKey) {
      await handleOpenKeyDialog();
    }

    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      const newItems = await gemini.analyzePantryImage(base64, preferences);
      
      const normalItems: PantryItem[] = [];
      const leftovers: Partial<PantryItem>[] = [];

      newItems.forEach(item => {
        if (item.isLeftover || item.name?.toLowerCase().includes('leftover')) {
          leftovers.push(item);
        } else {
          normalItems.push({
            id: Math.random().toString(36).substr(2, 9),
            name: item.name || 'Unknown',
            quantity: item.quantity || '1 unit',
            category: item.category || 'Other',
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat
          });
        }
      });

      setPantry(prev => [...prev, ...normalItems]);
      setLeftoversToIdentify(prev => [...prev, ...leftovers]);
      setIsScanning(false);
      setIsAddItemModalOpen(false);
      setActiveTab('pantry');
    };
    reader.readAsDataURL(file);
  }, [hasApiKey, handleOpenKeyDialog, preferences]);

  const handleLeftoversConfirm = useCallback((details: { name: string, quantity: string }) => {
    const newItem: PantryItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: details.name,
      quantity: details.quantity,
      category: 'Other',
      isLeftover: true
    };
    setPantry(prev => [...prev, newItem]);
    setLeftoversToIdentify(prev => prev.slice(1));
  }, []);

  const handleSaveItem = useCallback((item: PantryItem) => {
    setPantry(prev => prev.map(i => i.id === item.id ? item : i));
  }, []);

  const handleDeleteItem = useCallback((id: string) => {
    setPantry(prev => prev.filter(i => i.id !== id));
  }, []);

  const toggleCategoryCollapse = useCallback((category: string) => {
    setCollapsedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  }, []);

  const handleManualAdd = useCallback(async (item: { name: string, quantity: string }) => {
    if (!hasApiKey) {
      await handleOpenKeyDialog();
    }
    setIsResearching(true);
    try {
      const profile = await gemini.analyzeManualItem(item.name, item.quantity, preferences);
      const newItem: PantryItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: profile.name || item.name,
        quantity: profile.quantity || item.quantity,
        category: profile.category || 'Other',
        calories: profile.calories,
        protein: profile.protein,
        carbs: profile.carbs,
        fat: profile.fat
      };
      setPantry(prev => [...prev, newItem]);
      setIsAddItemModalOpen(false);
    } catch (error) {
      console.error("Manual research error:", error);
      const newItem: PantryItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: item.name,
        quantity: item.quantity,
        category: 'Other'
      };
      setPantry(prev => [...prev, newItem]);
      setIsAddItemModalOpen(false);
    } finally {
      setIsResearching(false);
    }
  }, [hasApiKey, handleOpenKeyDialog, preferences]);

  const toggleSaveRecipe = useCallback((meal: Meal) => {
    setSavedRecipes(prev => {
      const isSaved = prev.some(m => m.id === meal.id);
      if (isSaved) {
        return prev.filter(m => m.id !== meal.id);
      } else {
        return [...prev, meal];
      }
    });
  }, []);

  const handleGenerateSingleMeal = useCallback(async () => {
    if (pantry.length === 0) {
      setPantryError("Your pantry is empty! Add some ingredients first so Shelf AI can suggest a recipe.");
      return;
    }

    if (!canGenerateRecipe()) {
      setIsPaywallOpen(true);
      return;
    }

    if (!hasApiKey) {
      await handleOpenKeyDialog();
    }
    setIsPlanLoading(true);
    try {
      const meals = await gemini.generateSingleMeal(pantry, mealGenParams, preferences);
      if (meals && meals.length > 0) {
        const timestampedMeals = meals.map(m => ({ ...m, timestamp: Date.now() }));
        setGeneratedMeals(timestampedMeals);
        setMealHistory(prev => [...timestampedMeals, ...prev].slice(0, 50)); // Keep last 50
        setMealGenStep(100);
        incrementUsage();
      }
    } catch (error) {
      console.error("Meal generation error:", error);
    } finally {
      setIsPlanLoading(false);
    }
  }, [pantry, hasApiKey, handleOpenKeyDialog, mealGenParams, preferences]);

  const weeklyHistory = useMemo(() => 
    mealHistory.filter(m => m.timestamp && m.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000),
  [mealHistory]);

  const weeklyStats = useMemo(() => 
    weeklyHistory.reduce((acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 }),
  [weeklyHistory]);

  const groupedPantry = useMemo(() => {
    return pantry
      .filter(item => {
        if (filterCriteria.category && item.category !== filterCriteria.category) return false;
        if (filterCriteria.search && !item.name.toLowerCase().includes(filterCriteria.search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'name') return a.name.localeCompare(b.name);
        if (sortOption === 'calories') return (b.calories || 0) - (a.calories || 0);
        if (sortOption === 'protein') return (b.protein || 0) - (a.protein || 0);
        if (sortOption === 'category') return a.category.localeCompare(b.category);
        return 0;
      })
      .reduce((acc, item) => {
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item);
        return acc;
      }, {} as Record<string, PantryItem[]>);
  }, [pantry, filterCriteria, sortOption]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#F27D26] animate-spin mx-auto mb-4" />
          <p className="text-white/60 font-medium tracking-wider uppercase text-xs">Initializing Shelf.ai</p>
        </div>
      </div>
    );
  }

  if (hasCompletedOnboarding === false) {
    return <Onboarding onComplete={handleOnboardingComplete} onSkipAll={handleSkipAll} theme={theme} />;
  }

  return (
    <div className={`flex flex-col h-screen max-w-md mx-auto shadow-2xl overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-black text-white' : 'bg-zinc-50 text-black'}`}>
      {/* Header */}
      {activeTab !== 'settings' && (
        <header className={`px-6 pt-8 pb-4 border-b shrink-0 transition-colors duration-300 ${theme === 'dark' ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Shelf.ai</h1>
              <p className="text-sm font-medium text-accent/60">Smart kitchen companion</p>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeTab}
            custom={direction}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag={isTabDragDisabled ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                handleSwipe('left');
              } else if (swipe > swipeConfidenceThreshold) {
                handleSwipe('right');
              }
            }}
            className="absolute inset-0 overflow-y-auto pb-24 px-0"
          >
            {activeTab === 'settings' && (
              <Settings 
                preferences={preferences} 
                onSave={setPreferences} 
                onBack={() => handleTabChange('home')} 
                onReset={handleResetPreferences}
                theme={theme}
                setTheme={setTheme}
                onHelp={() => handleTabChange('help')}
                onUpgrade={() => setIsPaywallOpen(true)}
              />
            )}
            {activeTab === 'home' && (
              <>
                {!isSubscribed && <UsageLimitBanner theme={theme} onUpgrade={() => setIsPaywallOpen(true)} />}
                <HomeView 
                  theme={theme}
                  generatedMeals={generatedMeals}
                  savedRecipes={savedRecipes}
                  pantryCount={pantry.length}
                  weeklyHistory={weeklyHistory}
                  weeklyStats={weeklyStats}
                  setActiveTab={handleTabChange}
                  setSelectedMeal={setSelectedMeal}
                />
              </>
            )}

            {activeTab === 'pantry' && (
              <PantryView 
                theme={theme}
                preferences={preferences}
                isScanning={isScanning}
                groupedPantry={groupedPantry}
                collapsedCategories={collapsedCategories}
                setIsFilterModalOpen={setIsFilterModalOpen}
                setIsAddItemModalOpen={setIsAddItemModalOpen}
                toggleCategoryCollapse={toggleCategoryCollapse}
                setEditingItem={setEditingItem}
              />
            )}

            {activeTab === 'cook' && (
              <>
                {!isSubscribed && <UsageLimitBanner theme={theme} onUpgrade={() => setIsPaywallOpen(true)} />}
                <CookView 
                  theme={theme}
                  preferences={preferences}
                  mealGenStep={mealGenStep}
                  mealGenParams={mealGenParams}
                  isPlanLoading={isPlanLoading}
                  generatedMeals={generatedMeals}
                  setMealGenStep={setMealGenStep}
                  setMealGenParams={setMealGenParams}
                  handleGenerateSingleMeal={handleGenerateSingleMeal}
                  setSelectedMeal={setSelectedMeal}
                  dialRef={dialRef}
                  handleMouseDown={handleMouseDown}
                  handleMouseLeave={handleMouseLeave}
                  handleMouseUp={handleMouseUp}
                  handleMouseMove={handleMouseMove}
                  setIsTabDragDisabled={setIsTabDragDisabled}
                />
              </>
            )}

            {activeTab === 'help' && (
              <HelpView 
                theme={theme}
                setActiveTab={handleTabChange}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <motion.nav 
        drag={isTabDragDisabled ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          const threshold = 30;
          if (info.offset.x < -threshold) handleSwipe('left');
          else if (info.offset.x > threshold) handleSwipe('right');
        }}
        className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto backdrop-blur-md border-t safe-bottom px-6 py-3 flex justify-between items-center z-50 transition-colors duration-300 ${theme === 'dark' ? 'bg-black/80 border-zinc-900' : 'bg-white/80 border-zinc-200'}`}
      >
        <NavButton active={activeTab === 'home'} icon={<Home size={22} />} label="Home" onClick={() => handleTabChange('home')} />
        <NavButton active={activeTab === 'pantry'} icon={<Refrigerator size={22} />} label="Pantry" onClick={() => handleTabChange('pantry')} />
        <NavButton 
          active={activeTab === 'cook'} 
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11h10a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2z" />
              <path d="M15 13h6" />
              <path d="M5 7c0-1.1.9-2 2-2" />
              <path d="M9 7c0-1.1.9-2 2-2" />
              <path d="M13 7c0-1.1.9-2 2-2" />
            </svg>
          } 
          label="Cook" 
          onClick={() => handleTabChange('cook')} 
        />
        <NavButton active={activeTab === 'settings'} icon={<SettingsIcon size={22} />} label="Settings" onClick={() => handleTabChange('settings')} />
      </motion.nav>

      {/* Settings Modal (Pop up) - Removed as it's now a tab */}

      {/* Add Item Modal */}
      <AddItemModal 
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onAddManual={handleManualAdd}
        onScanImage={handleFileUpload}
        isScanning={isScanning}
        isResearching={isResearching}
        theme={theme}
      />

      {/* Pantry Error Modal */}
      {pantryError && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`w-full max-w-xs rounded-3xl overflow-hidden shadow-2xl border animate-in zoom-in-95 duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                <AlertCircle size={32} />
              </div>
              <div className="space-y-2">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Empty Pantry</h3>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>{pantryError}</p>
              </div>
              <button 
                onClick={() => setPantryError(null)}
                className={`w-full py-4 font-bold rounded-2xl transition-colors ${theme === 'dark' ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-zinc-100 text-black hover:bg-zinc-200'}`}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pantry Enhancements Modals */}
      <EditItemModal 
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        item={editingItem}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
        theme={theme}
      />

      <FilterSortModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        sortOption={sortOption}
        onSortChange={setSortOption}
        filterCriteria={filterCriteria}
        onFilterChange={setFilterCriteria}
        theme={theme}
      />

      <PaywallModal 
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        theme={theme}
      />

      <LeftoversModal 
        isOpen={leftoversToIdentify.length > 0}
        onClose={() => setLeftoversToIdentify(prev => prev.slice(1))}
        onConfirm={handleLeftoversConfirm}
        theme={theme}
      />

      {/* Recipe Modal */}
      {selectedMeal && (
        <div 
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedMeal(null)}
        >
          <div 
            className={`w-full max-w-md rounded-t-3xl p-8 pb-12 shadow-2xl border-t animate-in slide-in-from-bottom-full duration-500 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-accent' : 'text-accent'}`}>{selectedMeal.type}</span>
                <h3 className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{selectedMeal.name}</h3>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleSaveRecipe(selectedMeal)}
                  className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-zinc-800 text-accent hover:bg-zinc-700' : 'bg-zinc-100 text-accent hover:bg-zinc-200'}`}
                >
                  {savedRecipes.some(m => m.id === selectedMeal.id) ? (
                    <BookmarkCheck size={24} fill="currentColor" />
                  ) : (
                    <Bookmark size={24} />
                  )}
                </button>
                <button 
                  onClick={() => setSelectedMeal(null)}
                  className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-100 text-zinc-500 hover:text-black'}`}
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
              <section>
                <h4 className={`text-sm font-bold uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Nutrition</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className={`p-3 rounded-xl border text-center ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
                    <p className={`text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>Cal</p>
                    <p className="text-sm font-bold text-accent">{selectedMeal.calories}</p>
                  </div>
                  <div className={`p-3 rounded-xl border text-center ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
                    <p className={`text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>Pro</p>
                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>{selectedMeal.protein}g</p>
                  </div>
                  <div className={`p-3 rounded-xl border text-center ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
                    <p className={`text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>Carb</p>
                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>{selectedMeal.carbs}g</p>
                  </div>
                  <div className={`p-3 rounded-xl border text-center ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
                    <p className={`text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>Fat</p>
                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>{selectedMeal.fat}g</p>
                  </div>
                </div>
              </section>

              <section>
                <h4 className={`text-sm font-bold uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Instructions</h4>
                <div className="space-y-4">
                  {selectedMeal.recipe?.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${theme === 'dark' ? 'bg-accent/20 text-accent' : 'bg-accent/10 text-accent'}`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <RecipeStep step={step} theme={theme} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const NavButton = memo(function NavButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all relative ${active ? 'text-accent scale-110' : 'text-accent/40 hover:text-accent/60'}`}
    >
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-highlight"
          className="absolute -bottom-1 w-5 h-1 rounded-full bg-accent"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
});
