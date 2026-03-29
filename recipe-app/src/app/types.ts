export interface Recipe {
  id: string;
  title: string;
  image: string;
  cuisine: string;
  cookTime: string;
  calories: number;
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
  sourceUrl: string;
  sourcePlatform: "tiktok" | "instagram" | "manual";
  createdAt: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  category: "produce" | "dairy" | "meat" | "pantry" | "frozen" | "bakery" | "other";
}

export interface FridgeItem {
  id: string;
  name: string;
  addedAt: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  amount: string;
  unit: string;
  category: string;
  checked: boolean;
  recipeId: string;
  recipeName: string;
}

export interface HealthySwap {
  original: string;
  swap: string;
  reason: string;
}
