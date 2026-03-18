
export interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  expiryDate?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  isLeftover?: boolean;
}

export type SortOption = 'name' | 'category' | 'calories' | 'protein';

export interface FilterCriteria {
  category?: string;
  minCalories?: number;
  maxCalories?: number;
  search?: string;
}

export interface Meal {
  id: string;
  name: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  rating: number;
  recipe?: string[];
  day: string;
  timestamp?: number;
}

export interface UserPreferences {
  maxCookTime: number | null;
  maxIngredients: number | null;
  specificPlan: 'keto' | 'mediterranean' | 'paleo' | 'vegetarian' | 'none' | null;
  caloriesPerDay: number | null;
  reuseIngredients: boolean | null;
  preferLeftovers: 'yes' | 'occasionally' | 'no' | null;
  appliances: string[];
  allergies: string[];
  measurementSystem: 'us' | 'metric';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | null;
  aiPlanLevel: 'ask' | 'suggest' | 'auto' | null;
  autoAddMissing: 'yes' | 'ask' | 'never' | null;
  biggestStruggle: 'budget' | 'time' | 'motivation' | 'knowledge' | null;
  accentColor: string;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  maxCookTime: null,
  maxIngredients: null,
  specificPlan: null,
  caloriesPerDay: null,
  reuseIngredients: null,
  preferLeftovers: null,
  appliances: [],
  allergies: [],
  measurementSystem: 'us',
  experienceLevel: null,
  aiPlanLevel: null,
  autoAddMissing: null,
  biggestStruggle: null,
  accentColor: '#a855f7', // Default purple-500
};

export interface MealGenerationParams {
  peopleCount: number;
  purpose: 'protein' | 'casual' | 'healthy' | 'quick' | 'other';
  mealTypes: ('Breakfast' | 'Lunch' | 'Dinner' | 'Snack')[];
  maxTime: number;
  complexity: 'simple' | 'moderate' | 'advanced';
  cookingMethod: 'stovetop' | 'oven' | 'air_fryer' | 'one_pan' | 'none';
}

export type TabType = 'home' | 'pantry' | 'cook' | 'settings' | 'help';
