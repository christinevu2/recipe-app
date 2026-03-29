"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Recipe, FridgeItem, GroceryItem } from "../types";
import { sampleRecipes } from "../data/sampleRecipes";

interface AppState {
  recipes: Recipe[];
  fridgeItems: FridgeItem[];
  groceryItems: GroceryItem[];
  addRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  addFridgeItem: (name: string) => void;
  removeFridgeItem: (id: string) => void;
  addToGroceryList: (recipe: Recipe) => void;
  toggleGroceryItem: (id: string) => void;
  clearCheckedGrocery: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {}
  return fallback;
}

function saveToStorage(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setRecipes(loadFromStorage("recipes", sampleRecipes));
    setFridgeItems(loadFromStorage("fridgeItems", []));
    setGroceryItems(loadFromStorage("groceryItems", []));
    setLoaded(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!loaded) return;
    saveToStorage("recipes", recipes);
  }, [recipes, loaded]);

  useEffect(() => {
    if (!loaded) return;
    saveToStorage("fridgeItems", fridgeItems);
  }, [fridgeItems, loaded]);

  useEffect(() => {
    if (!loaded) return;
    saveToStorage("groceryItems", groceryItems);
  }, [groceryItems, loaded]);

  const addRecipe = (recipe: Recipe) => {
    setRecipes((prev) => [recipe, ...prev]);
  };

  const deleteRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
    // Also remove grocery items from this recipe
    setGroceryItems((prev) => prev.filter((g) => g.recipeId !== id));
  };

  const addFridgeItem = (name: string) => {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return;
    if (fridgeItems.some((i) => i.name === trimmed)) return;
    setFridgeItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: trimmed, addedAt: new Date().toISOString() },
    ]);
  };

  const removeFridgeItem = (id: string) => {
    setFridgeItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addToGroceryList = (recipe: Recipe) => {
    // Don't add duplicates from the same recipe
    const existingRecipeIds = new Set(groceryItems.filter((g) => g.recipeId === recipe.id).map((g) => g.name));

    const newItems: GroceryItem[] = recipe.ingredients
      .filter((ing) => !existingRecipeIds.has(ing.name))
      .map((ing) => ({
        id: crypto.randomUUID(),
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        category: ing.category,
        checked: fridgeItems.some(
          (f) => ing.name.includes(f.name) || f.name.includes(ing.name)
        ),
        recipeId: recipe.id,
        recipeName: recipe.title,
      }));

    setGroceryItems((prev) => [...prev, ...newItems]);
  };

  const toggleGroceryItem = (id: string) => {
    setGroceryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const clearCheckedGrocery = () => {
    setGroceryItems((prev) => prev.filter((i) => !i.checked));
  };

  // Don't render children until localStorage is loaded to avoid hydration mismatch
  if (!loaded) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        recipes,
        fridgeItems,
        groceryItems,
        addRecipe,
        deleteRecipe,
        addFridgeItem,
        removeFridgeItem,
        addToGroceryList,
        toggleGroceryItem,
        clearCheckedGrocery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
