"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useApp } from "../../store/AppContext";
import { HealthySwap } from "../../types";

const sampleSwaps: HealthySwap[] = [
  { original: "heavy cream", swap: "cashew cream or light coconut milk", reason: "60% fewer calories, dairy-free option" },
  { original: "parmesan cheese", swap: "nutritional yeast", reason: "Lower fat, adds B vitamins, vegan-friendly" },
  { original: "olive oil", swap: "avocado oil spray", reason: "Less oil needed, same healthy fats" },
  { original: "butter", swap: "ghee or olive oil", reason: "Lower saturated fat, more nutrients" },
  { original: "white rice", swap: "cauliflower rice", reason: "80% fewer calories, more fiber" },
  { original: "pasta", swap: "zucchini noodles or chickpea pasta", reason: "More protein and fiber, fewer carbs" },
  { original: "sour cream", swap: "Greek yogurt", reason: "More protein, less fat, same tang" },
  { original: "mayo", swap: "mashed avocado or Greek yogurt", reason: "Healthy fats, more nutrients" },
];

export default function RecipeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { recipes, addToGroceryList, groceryItems } = useApp();
  const recipe = recipes.find((r) => r.id === id);
  const [servings, setServings] = useState(recipe?.servings ?? 4);
  const [showSwaps, setShowSwaps] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  if (!recipe) {
    return (
      <div className="px-4 pt-6 text-center">
        <p className="text-text-muted">Recipe not found</p>
        <Link href="/" className="text-primary text-sm mt-2 inline-block">Back to recipes</Link>
      </div>
    );
  }

  const multiplier = servings / recipe.servings;
  const alreadyInGrocery = groceryItems.some((g) => g.recipeId === recipe.id);

  const scaleAmount = (amount: string) => {
    const num = eval(amount.replace("/", "/"));
    if (isNaN(num)) return amount;
    const scaled = num * multiplier;
    if (scaled === Math.floor(scaled)) return String(scaled);
    return scaled.toFixed(1);
  };

  const toggleStep = (index: number) => {
    const next = new Set(checkedSteps);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setCheckedSteps(next);
  };

  const handleAddToGrocery = () => {
    addToGroceryList(recipe);
  };

  const scaledCalories = Math.round(recipe.calories * multiplier);
  const progress = recipe.steps.length > 0 ? (checkedSteps.size / recipe.steps.length) * 100 : 0;

  // Find relevant swaps for this recipe's ingredients
  const relevantSwaps = sampleSwaps.filter((swap) =>
    recipe.ingredients.some((ing) =>
      ing.name.toLowerCase().includes(swap.original.toLowerCase())
    )
  );

  return (
    <div className="pb-4">
      {/* Hero image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <Link
          href="/"
          className="absolute top-4 left-4 w-9 h-9 glass rounded-full flex items-center justify-center shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
        </Link>

        {/* Stats overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
          <div className="glass rounded-2xl px-3 py-2 flex items-center gap-1.5 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-primary">
              <path fillRule="evenodd" d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3.25a.75.75 0 0 0 0-1.5h-2.5v-3.5Z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-bold">{recipe.cookTime}</span>
          </div>
          <div className="glass rounded-2xl px-3 py-2 flex items-center gap-1.5 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-primary">
              <path fillRule="evenodd" d="M11.097 1.515a.75.75 0 0 1 .388.983l-1.267 2.927h3.032a.75.75 0 0 1 .563 1.243l-6.75 7.5a.75.75 0 0 1-1.3-.674l1.267-2.927H4.002a.75.75 0 0 1-.563-1.243l6.75-7.5a.75.75 0 0 1 .908-.31Z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-bold">{scaledCalories} cal</span>
          </div>
          <div className="glass rounded-2xl px-3 py-2 shadow-lg">
            <span className="text-[10px] font-bold uppercase text-primary">{recipe.sourcePlatform}</span>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5">
        <div className="flex items-start justify-between mb-1">
          <h1 className="text-2xl font-bold tracking-tight leading-tight flex-1">{recipe.title}</h1>
          <span className="bg-surface text-xs font-bold px-3 py-1.5 rounded-full text-text-muted ml-2 mt-1">{recipe.cuisine}</span>
        </div>

        {/* Cooking progress */}
        {checkedSteps.size > 0 && (
          <div className="mt-3 mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-text-muted">Cooking progress</span>
              <span className="text-xs font-bold gradient-text">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full gradient-bg rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Serving adjuster */}
        <div className="flex items-center justify-between bg-surface rounded-2xl p-4 my-4">
          <div>
            <span className="text-sm font-bold">Servings</span>
            <p className="text-xs text-text-muted mt-0.5">{Math.round(scaledCalories / servings)} cal per serving</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-9 h-9 rounded-xl bg-card-bg shadow-sm flex items-center justify-center text-lg font-medium hover:shadow-md transition-all"
            >
              -
            </button>
            <span className="text-xl font-bold w-6 text-center">{servings}</span>
            <button
              onClick={() => setServings(servings + 1)}
              className="w-9 h-9 rounded-xl gradient-bg text-white shadow-sm flex items-center justify-center text-lg font-medium hover:shadow-md transition-all"
            >
              +
            </button>
          </div>
        </div>

        {/* Ingredients */}
        <h2 className="text-lg font-bold mb-3">Ingredients</h2>
        <div className="space-y-2 mb-6">
          {recipe.ingredients.map((ing, i) => (
            <div key={i} className="flex items-center gap-3 bg-surface rounded-xl px-4 py-2.5">
              <div className="w-2 h-2 rounded-full gradient-bg shrink-0" />
              <span className="text-sm flex-1">
                <span className="font-bold">{scaleAmount(ing.amount)} {ing.unit}</span>{" "}
                <span className="text-foreground/70">{ing.name}</span>
              </span>
              <span className="text-[10px] text-text-muted bg-card-bg px-2 py-0.5 rounded-full capitalize">{ing.category}</span>
            </div>
          ))}
        </div>

        {/* Steps */}
        <h2 className="text-lg font-bold mb-3">Steps</h2>
        <div className="space-y-3 mb-6">
          {recipe.steps.map((step, i) => (
            <button
              key={i}
              onClick={() => toggleStep(i)}
              className={`flex items-start gap-3 w-full text-left p-3 rounded-2xl transition-all ${
                checkedSteps.has(i) ? "bg-success-bg" : "bg-surface"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all font-bold text-xs ${
                  checkedSteps.has(i)
                    ? "gradient-bg text-white shadow-md shadow-primary/20"
                    : "bg-card-bg shadow-sm text-text-muted"
                }`}
              >
                {checkedSteps.has(i) ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <p className={`text-sm leading-relaxed pt-1 ${checkedSteps.has(i) ? "text-success line-through" : ""}`}>
                {step}
              </p>
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={handleAddToGrocery}
            disabled={alreadyInGrocery}
            className={`w-full py-3.5 rounded-2xl text-sm font-bold transition-all ${
              alreadyInGrocery
                ? "bg-success-bg text-success"
                : "gradient-bg text-white shadow-lg shadow-primary/30"
            }`}
          >
            {alreadyInGrocery ? "Added to Grocery List!" : "Add to Grocery List"}
          </button>
          <button
            onClick={() => setShowSwaps(!showSwaps)}
            className="w-full py-3.5 rounded-2xl text-sm font-bold bg-surface hover:bg-border transition-colors"
          >
            {showSwaps ? "Hide Healthy Swaps" : "Make it Healthier"}
          </button>
        </div>

        {/* Healthy swaps */}
        {showSwaps && (
          <div className="mt-4 space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-success-bg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-success">
                  <path d="M8 1a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2A.75.75 0 0 1 8 1ZM10.495 3.046a.75.75 0 0 1 1.06 0l1.414 1.414a.75.75 0 0 1-1.06 1.06L10.495 4.106a.75.75 0 0 1 0-1.06Z" />
                </svg>
              </span>
              Healthier Alternatives
            </h3>
            {relevantSwaps.length > 0 ? (
              relevantSwaps.map((swap, i) => (
                <div key={i} className="bg-success-bg rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm line-through text-text-muted">{swap.original}</span>
                    <span className="text-success font-bold">→</span>
                    <span className="text-sm font-bold text-success">{swap.swap}</span>
                  </div>
                  <p className="text-xs text-success/70">{swap.reason}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-muted bg-surface rounded-2xl p-4">
                This recipe is already pretty healthy! No swaps needed.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
