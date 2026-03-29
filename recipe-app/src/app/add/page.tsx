"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../store/AppContext";
import { Recipe, Ingredient } from "../types";
import { cuisines } from "../data/sampleRecipes";

const defaultIngredientCategory = (name: string): Ingredient["category"] => {
  const n = name.toLowerCase();
  if (["chicken", "beef", "pork", "salmon", "turkey", "shrimp", "steak", "bacon", "sausage", "fish", "lamb"].some((m) => n.includes(m))) return "meat";
  if (["milk", "cream", "cheese", "yogurt", "butter", "egg", "mayo"].some((m) => n.includes(m))) return "dairy";
  if (["lettuce", "tomato", "onion", "garlic", "spinach", "pepper", "avocado", "lemon", "lime", "cilantro", "basil", "cucumber", "carrot", "potato", "mushroom", "jalapeño", "ginger", "green onion", "scallion"].some((m) => n.includes(m))) return "produce";
  if (["bread", "tortilla", "bun", "roll", "noodle", "pita"].some((m) => n.includes(m))) return "bakery";
  return "pantry";
};

export default function AddRecipe() {
  const router = useRouter();
  const { addRecipe } = useApp();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"initial" | "extracted" | "manual">("initial");

  // Form state
  const [title, setTitle] = useState("");
  const [cuisine, setCuisine] = useState("Italian");
  const [cookTime, setCookTime] = useState("");
  const [servingsInput, setServingsInput] = useState("2");
  const [caloriesInput, setCaloriesInput] = useState("");
  const [ingredientLines, setIngredientLines] = useState<string[]>([""]);
  const [stepLines, setStepLines] = useState<string[]>([""]);

  const handleExtract = () => {
    if (!url) return;
    setLoading(true);
    // Simulated AI extraction — will be replaced with real API call
    setTimeout(() => {
      setTitle("Creamy Garlic Pasta");
      setCuisine("Italian");
      setCookTime("20 min");
      setServingsInput("2");
      setCaloriesInput("480");
      setIngredientLines(["8 oz pasta", "4 cloves garlic", "1 cup heavy cream", "1/2 cup parmesan cheese", "2 tbsp butter", "salt and pepper to taste"]);
      setStepLines([
        "Cook pasta according to package directions.",
        "Mince garlic and sauté in butter until fragrant.",
        "Add heavy cream and bring to a simmer.",
        "Stir in parmesan until melted and smooth.",
        "Toss pasta in the sauce. Season with salt and pepper.",
      ]);
      setLoading(false);
      setMode("extracted");
    }, 2000);
  };

  const parseIngredient = (line: string): Ingredient => {
    // Simple parser: tries to extract "amount unit name" from a string like "2 cups spinach"
    const match = line.match(/^([\d\/.\s]+)?\s*(tbsp|tsp|cup|cups|oz|lb|lbs|cloves|pieces|whole|stalks|can|cans)?\s*(.+)$/i);
    if (match) {
      return {
        amount: (match[1] || "1").trim(),
        unit: (match[2] || "").trim(),
        name: (match[3] || line).trim(),
        category: defaultIngredientCategory(match[3] || line),
      };
    }
    return { amount: "1", unit: "", name: line.trim(), category: "pantry" };
  };

  const handleSave = () => {
    const recipe: Recipe = {
      id: crypto.randomUUID(),
      title: title.trim(),
      image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=400&fit=crop",
      cuisine,
      cookTime: cookTime.trim(),
      calories: parseInt(caloriesInput) || 0,
      servings: parseInt(servingsInput) || 2,
      ingredients: ingredientLines.filter((l) => l.trim()).map(parseIngredient),
      steps: stepLines.filter((l) => l.trim()),
      sourceUrl: url || "",
      sourcePlatform: url.includes("tiktok") ? "tiktok" : url.includes("instagram") ? "instagram" : "manual",
      createdAt: new Date().toISOString().split("T")[0],
    };
    addRecipe(recipe);
    router.push("/");
  };

  const addIngredientLine = () => setIngredientLines([...ingredientLines, ""]);
  const addStepLine = () => setStepLines([...stepLines, ""]);

  const updateIngredient = (i: number, val: string) => {
    const next = [...ingredientLines];
    next[i] = val;
    setIngredientLines(next);
  };

  const updateStep = (i: number, val: string) => {
    const next = [...stepLines];
    next[i] = val;
    setStepLines(next);
  };

  const removeIngredient = (i: number) => {
    if (ingredientLines.length <= 1) return;
    setIngredientLines(ingredientLines.filter((_, idx) => idx !== i));
  };

  const removeStep = (i: number) => {
    if (stepLines.length <= 1) return;
    setStepLines(stepLines.filter((_, idx) => idx !== i));
  };

  const canSave = title.trim() && ingredientLines.some((l) => l.trim()) && stepLines.some((l) => l.trim());

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface hover:bg-border transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          Add <span className="gradient-text">Recipe</span>
        </h1>
      </div>

      {/* URL Input — always show unless in manual mode */}
      {mode !== "manual" && (
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">
            Paste a TikTok or Instagram link
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://www.tiktok.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-4 py-3.5 rounded-2xl bg-surface border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-text-muted"
            />
            <button
              onClick={handleExtract}
              disabled={!url || loading}
              className="px-6 py-3.5 gradient-bg text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Extract"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full gradient-bg opacity-20 animate-ping" />
            <div className="absolute inset-2 rounded-full gradient-bg opacity-40 animate-ping" style={{ animationDelay: "0.2s" }} />
            <div className="absolute inset-4 rounded-full gradient-bg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white">
                <path fillRule="evenodd" d="M11.097 1.515a.75.75 0 0 1 .388.983l-1.267 2.927h3.032a.75.75 0 0 1 .563 1.243l-6.75 7.5a.75.75 0 0 1-1.3-.674l1.267-2.927H4.002a.75.75 0 0 1-.563-1.243l6.75-7.5a.75.75 0 0 1 .908-.31Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="font-bold text-sm">Extracting recipe with AI...</p>
          <p className="text-text-muted text-xs mt-1">Reading video description and ingredients</p>
        </div>
      )}

      {/* Recipe form (shown after extract or manual) */}
      {(mode === "extracted" || mode === "manual") && !loading && (
        <div className="space-y-4">
          <div className="bg-surface rounded-2xl p-4">
            {mode === "extracted" && (
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-success-bg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-success">
                    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.844-8.791a.75.75 0 0 0-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 1 0-1.114 1.004l2.25 2.5a.75.75 0 0 0 1.15-.043l4.25-5.5Z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-success">Recipe extracted! Edit anything below.</span>
              </div>
            )}

            {/* Title */}
            <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Recipe name"
              className="w-full px-4 py-2.5 rounded-xl bg-card-bg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
            />

            {/* Cuisine */}
            <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Cuisine</label>
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-card-bg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
            >
              {cuisines.filter((c) => c !== "All").map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            {/* Cook time, servings, calories */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Cook Time</label>
                <input
                  type="text"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  placeholder="20 min"
                  className="w-full px-4 py-2.5 rounded-xl bg-card-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Servings</label>
                <input
                  type="number"
                  value={servingsInput}
                  onChange={(e) => setServingsInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-card-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Calories</label>
                <input
                  type="number"
                  value={caloriesInput}
                  onChange={(e) => setCaloriesInput(e.target.value)}
                  placeholder="400"
                  className="w-full px-4 py-2.5 rounded-xl bg-card-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                />
              </div>
            </div>

            {/* Ingredients */}
            <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Ingredients</label>
            <div className="space-y-1.5 mb-3">
              {ingredientLines.map((line, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={line}
                    onChange={(e) => updateIngredient(i, e.target.value)}
                    placeholder="e.g. 2 cups spinach"
                    className="flex-1 px-4 py-2 rounded-xl bg-card-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {ingredientLines.length > 1 && (
                    <button onClick={() => removeIngredient(i)} className="text-text-muted hover:text-danger p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addIngredientLine} className="text-xs text-primary font-bold py-1">
                + Add ingredient
              </button>
            </div>

            {/* Steps */}
            <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">Steps</label>
            <div className="space-y-1.5 mb-2">
              {stepLines.map((step, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="w-6 h-6 rounded-lg bg-card-bg flex items-center justify-center text-[10px] font-bold text-text-muted mt-1 shrink-0">{i + 1}</span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => updateStep(i, e.target.value)}
                    placeholder="Describe this step..."
                    className="flex-1 px-4 py-2 rounded-xl bg-card-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {stepLines.length > 1 && (
                    <button onClick={() => removeStep(i)} className="text-text-muted hover:text-danger p-1 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addStepLine} className="text-xs text-primary font-bold py-1">
                + Add step
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!canSave}
            className="w-full py-3.5 gradient-bg text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/30 disabled:opacity-50 disabled:shadow-none transition-all"
          >
            Save Recipe
          </button>
        </div>
      )}

      {/* Or add manually */}
      {mode === "initial" && !loading && (
        <div className="text-center py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-text-muted text-xs font-medium">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <button
            onClick={() => setMode("manual")}
            className="px-8 py-3 bg-surface rounded-2xl text-sm font-bold hover:bg-border transition-colors"
          >
            Add Manually
          </button>
        </div>
      )}
    </div>
  );
}
