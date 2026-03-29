"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "./store/AppContext";
import { cuisines } from "./data/sampleRecipes";

export default function Home() {
  const { recipes } = useApp();
  const [search, setSearch] = useState("");
  const [activeCuisine, setActiveCuisine] = useState("All");

  const filtered = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(search.toLowerCase()) ||
      recipe.ingredients.some((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      );
    const matchesCuisine =
      activeCuisine === "All" || recipe.cuisine === activeCuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm text-text-muted font-medium">What&apos;s cooking?</p>
          <h1 className="text-2xl font-bold tracking-tight">
            My <span className="gradient-text">Recipes</span>
          </h1>
        </div>
        <Link
          href="/add"
          className="gradient-bg text-white rounded-2xl w-11 h-11 flex items-center justify-center text-2xl font-light shadow-lg shadow-primary/30 pulse-glow"
        >
          +
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="text"
          placeholder="Search recipes or ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-surface border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-text-muted"
        />
      </div>

      {/* Cuisine filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 -mx-4 px-4 scrollbar-hide">
        {cuisines.map((cuisine) => (
          <button
            key={cuisine}
            onClick={() => setActiveCuisine(cuisine)}
            className={`px-4 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeCuisine === cuisine
                ? "gradient-bg text-white shadow-md shadow-primary/20"
                : "bg-surface text-text-muted hover:text-foreground"
            }`}
          >
            {cuisine}
          </button>
        ))}
      </div>

      {/* Featured recipe (first one) */}
      {filtered.length > 0 && (
        <Link
          href={`/recipe/${filtered[0].id}`}
          className="block mb-4 card-hover"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-lg shadow-black/10">
            <div className="aspect-[16/10] relative">
              <img
                src={filtered[0].image}
                alt={filtered[0].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="glass text-xs font-bold px-3 py-1.5 rounded-full text-foreground">
                  {filtered[0].cuisine}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-bold text-lg text-white leading-tight mb-1">
                  {filtered[0].title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-white/80">
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                      <path fillRule="evenodd" d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3.25a.75.75 0 0 0 0-1.5h-2.5v-3.5Z" clipRule="evenodd" />
                    </svg>
                    {filtered[0].cookTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                      <path fillRule="evenodd" d="M11.097 1.515a.75.75 0 0 1 .388.983l-1.267 2.927h3.032a.75.75 0 0 1 .563 1.243l-6.75 7.5a.75.75 0 0 1-1.3-.674l1.267-2.927H4.002a.75.75 0 0 1-.563-1.243l6.75-7.5a.75.75 0 0 1 .908-.31Z" clipRule="evenodd" />
                    </svg>
                    {filtered[0].calories} cal
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-white text-[10px] font-semibold uppercase">
                    {filtered[0].sourcePlatform}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Recipe grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.slice(1).map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipe/${recipe.id}`}
            className="card-hover"
          >
            <div className="rounded-2xl overflow-hidden bg-card-bg shadow-sm shadow-black/5">
              <div className="aspect-square relative">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-2 right-2">
                  <span className="glass text-[10px] font-bold px-2 py-1 rounded-full">
                    {recipe.cuisine}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-bold text-sm text-white leading-tight mb-0.5">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-white/80">
                    <span>{recipe.cookTime}</span>
                    <span>·</span>
                    <span>{recipe.calories} cal</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-text-muted">
          <div className="text-4xl mb-3">🍳</div>
          <p className="text-lg font-semibold mb-1">No recipes found</p>
          <p className="text-sm">Try a different search or add a new recipe!</p>
        </div>
      )}
    </div>
  );
}
