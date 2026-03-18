
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { PantryItem, Meal, UserPreferences, MealGenerationParams } from "../types";

const MODEL_NAME = 'gemini-3.1-pro-preview';

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateSingleMeal(pantry: PantryItem[], params: MealGenerationParams, preferences: UserPreferences): Promise<Meal[]> {
    const prompt = `Generate 1-3 meal options based on these specific requirements:
    Current Pantry: ${JSON.stringify(pantry)}
    User Preferences:
    - Dietary Plan: ${preferences.specificPlan}
    - Allergies/Restrictions: ${preferences.allergies.join(', ')}
    - Target Calories/Day: ${preferences.caloriesPerDay}
    - Available Appliances: ${preferences.appliances.join(', ')}
    - Measurement System: ${preferences.measurementSystem} (USE THIS FOR ALL QUANTITIES)
    - Experience Level: ${preferences.experienceLevel}
    - Reuse Ingredients: ${preferences.reuseIngredients ? 'Yes, prioritize using existing pantry items' : 'No preference'}
    
    Meal Generation Parameters:
    - Cooking for: ${params.peopleCount} people
    - Purpose: ${params.purpose}
    - Meal Types: ${params.mealTypes.join(', ')}
    - Max Time: ${params.maxTime} minutes
    - Complexity: ${params.complexity}
    - Preferred Method: ${params.cookingMethod}
    
    GOALS:
    1. Prioritize using items currently in the pantry.
    2. Strictly adhere to allergies and dietary plans.
    3. Use the preferred measurement system (${preferences.measurementSystem}) for all quantities in the recipe.
    4. Provide clear, step-by-step instructions suitable for a ${preferences.experienceLevel} cook.
    
    Return a JSON array of meals. Each meal must have:
    - name, type, calories, protein, carbs, fat, rating, recipe (array of strings), day (set to "Today")`;

    const response = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              type: { type: Type.STRING },
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fat: { type: Type.NUMBER },
              rating: { type: Type.NUMBER },
              day: { type: Type.STRING },
              recipe: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["id", "name", "type", "day", "recipe"]
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || '[]');
    } catch (e) {
      console.error("Failed to generate meal", e);
      return [];
    }
  }

  async analyzePantryImage(base64Image: string, preferences?: UserPreferences): Promise<Partial<PantryItem>[]> {
    const prompt = `You are a kitchen organization expert. Analyze this image of a fridge or pantry. 
    Identify every food item clearly visible. 
    For each item:
    1. Name (be specific, e.g., "Greek Yogurt" not just "Yogurt")
    2. Quantity (estimate, e.g., "Half full", "2 lbs", "12 pack". Use ${preferences?.measurementSystem || 'US'} system if possible)
    3. Category (Produce, Dairy, Meat, Pantry, Frozen, etc.)
    4. Estimated Macros (Calories, Protein, Carbs, Fat per standard serving)
    
    Return ONLY a JSON array of objects.`;

    const response = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              quantity: { type: Type.STRING },
              category: { type: Type.STRING },
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fat: { type: Type.NUMBER },
              isLeftover: { type: Type.BOOLEAN }
            },
            required: ["name", "quantity", "category"]
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || '[]');
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      return [];
    }
  }

  async analyzeManualItem(name: string, quantity: string, preferences?: UserPreferences): Promise<Partial<PantryItem>> {
    const prompt = `Research this food item: "${name}" with quantity "${quantity}".
    Provide a detailed profile including:
    1. Correct Category (Produce, Dairy, Meat, Pantry, Frozen, Other)
    2. Estimated Nutritional Info (Calories, Protein, Carbs, Fat) for the specified quantity.
    
    Return ONLY a JSON object.`;

    const response = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            quantity: { type: Type.STRING },
            category: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fat: { type: Type.NUMBER }
          },
          required: ["name", "quantity", "category", "calories", "protein", "carbs", "fat"]
        }
      }
    });

    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      return { name, quantity, category: 'Other' };
    }
  }
}

export const gemini = new GeminiService();
