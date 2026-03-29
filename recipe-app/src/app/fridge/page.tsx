"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "../store/AppContext";

export default function Fridge() {
  const { recipes, fridgeItems, addFridgeItem, removeFridgeItem } = useApp();
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    addFridgeItem(newItem);
    setNewItem("");
  };

  const itemNames = fridgeItems.map((i) => i.name);

  const recipeMatches = recipes.map((recipe) => {
    const recipeIngredients = recipe.ingredients.map((i) => i.name.toLowerCase());
    const matched = recipeIngredients.filter((ing) =>
      itemNames.some((fridgeItem) => ing.includes(fridgeItem) || fridgeItem.includes(ing))
    );
    const missing = recipeIngredients.filter(
      (ing) => !itemNames.some((fridgeItem) => ing.includes(fridgeItem) || fridgeItem.includes(ing))
    );
    return { recipe, matched, missing, matchPercent: matched.length / recipeIngredients.length };
  });

  const canMake = recipeMatches.filter((m) => m.missing.length === 0);
  const almostThere = recipeMatches
    .filter((m) => m.missing.length > 0 && m.missing.length <= 2)
    .sort((a, b) => a.missing.length - b.missing.length);

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="mb-5">
        <p className="text-sm text-text-muted font-medium">What do you have?</p>
        <h1 className="text-2xl font-bold tracking-tight">
          My <span className="gradient-text">Fridge</span>
        </h1>
      </div>

      {/* Add ingredient */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add an ingredient..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1 px-4 py-3.5 rounded-2xl bg-surface border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-text-muted"
        />
        <button
          onClick={handleAdd}
          disabled={!newItem.trim()}
          className="px-5 py-3.5 gradient-bg text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none transition-all"
        >
          Add
        </button>
      </div>

      {/* Current ingredients */}
      {fridgeItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {fridgeItems.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1.5 bg-surface px-3.5 py-2 rounded-2xl text-sm font-medium"
            >
              {item.name}
              <button
                onClick={() => removeFridgeItem(item.id)}
                className="text-text-muted hover:text-danger transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Fridge stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-surface rounded-2xl p-3 text-center">
          <p className="text-xl font-bold gradient-text">{fridgeItems.length}</p>
          <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Ingredients</p>
        </div>
        <div className="bg-success-bg rounded-2xl p-3 text-center">
          <p className="text-xl font-bold text-success">{canMake.length}</p>
          <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Can Make</p>
        </div>
        <div className="bg-tag-bg rounded-2xl p-3 text-center">
          <p className="text-xl font-bold text-primary">{almostThere.length}</p>
          <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Almost</p>
        </div>
      </div>

      {/* Empty state */}
      {fridgeItems.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <div className="text-4xl mb-3">🧊</div>
          <p className="text-lg font-semibold mb-1">Your fridge is empty</p>
          <p className="text-sm">Add ingredients to see what you can cook!</p>
        </div>
      )}

      {/* Can make */}
      {canMake.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-success-bg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-success">
                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.844-8.791a.75.75 0 0 0-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 1 0-1.114 1.004l2.25 2.5a.75.75 0 0 0 1.15-.043l4.25-5.5Z" clipRule="evenodd" />
              </svg>
            </span>
            Ready to cook
          </h2>
          <div className="space-y-2">
            {canMake.map(({ recipe }) => (
              <Link
                key={recipe.id}
                href={`/recipe/${recipe.id}`}
                className="flex items-center gap-3 bg-success-bg rounded-2xl p-3 card-hover"
              >
                <img src={recipe.image} alt={recipe.title} className="w-14 h-14 rounded-xl object-cover shadow-sm" />
                <div className="flex-1">
                  <h3 className="font-bold text-sm">{recipe.title}</h3>
                  <p className="text-xs text-text-muted">{recipe.cookTime} · {recipe.calories} cal</p>
                </div>
                <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-white">
                    <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Almost there */}
      {almostThere.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-tag-bg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-primary">
                <path fillRule="evenodd" d="M11.097 1.515a.75.75 0 0 1 .388.983l-1.267 2.927h3.032a.75.75 0 0 1 .563 1.243l-6.75 7.5a.75.75 0 0 1-1.3-.674l1.267-2.927H4.002a.75.75 0 0 1-.563-1.243l6.75-7.5a.75.75 0 0 1 .908-.31Z" clipRule="evenodd" />
              </svg>
            </span>
            Almost there
          </h2>
          <div className="space-y-2">
            {almostThere.map(({ recipe, missing }) => (
              <Link
                key={recipe.id}
                href={`/recipe/${recipe.id}`}
                className="flex items-center gap-3 bg-surface rounded-2xl p-3 card-hover"
              >
                <img src={recipe.image} alt={recipe.title} className="w-14 h-14 rounded-xl object-cover shadow-sm" />
                <div className="flex-1">
                  <h3 className="font-bold text-sm">{recipe.title}</h3>
                  <p className="text-xs text-primary font-medium">
                    Need: {missing.join(", ")}
                  </p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-text-muted">
                  <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
