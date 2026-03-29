"use client";

import { useApp } from "../store/AppContext";

const categoryEmoji: Record<string, string> = {
  produce: "🥬",
  meat: "🥩",
  dairy: "🧀",
  pantry: "🫙",
  bakery: "🍞",
  frozen: "🧊",
  other: "📦",
};

const categoryOrder = ["produce", "meat", "dairy", "pantry", "bakery", "frozen", "other"];

export default function GroceryList() {
  const { groceryItems, toggleGroceryItem, clearCheckedGrocery } = useApp();

  const grouped = categoryOrder
    .map((category) => ({
      category,
      items: groceryItems.filter((i) => i.category === category),
    }))
    .filter((g) => g.items.length > 0);

  const checkedCount = groceryItems.filter((i) => i.checked).length;
  const totalCount = groceryItems.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm text-text-muted font-medium">Shopping time</p>
          <h1 className="text-2xl font-bold tracking-tight">
            Grocery <span className="gradient-text">List</span>
          </h1>
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <div className="text-4xl mb-3">🛒</div>
          <p className="text-lg font-semibold mb-1">No items yet</p>
          <p className="text-sm">Add ingredients from a recipe to start your list!</p>
        </div>
      ) : (
        <>
          {/* Progress card */}
          <div className="bg-surface rounded-2xl p-4 mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10">
                  <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="14" fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="3"
                      strokeDasharray={`${progress * 0.88} 88`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ff6b35" />
                        <stop offset="100%" stopColor="#ff3cac" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold">{checkedCount} of {totalCount} items</p>
                  <p className="text-xs text-text-muted">
                    {totalCount - checkedCount === 0 ? "All done!" : `${totalCount - checkedCount} left to get`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {checkedCount > 0 && (
                  <button
                    onClick={clearCheckedGrocery}
                    className="px-3 py-2 bg-card-bg rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all text-danger"
                  >
                    Clear done
                  </button>
                )}
                <button className="px-4 py-2 bg-card-bg rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all">
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Grouped items */}
          <div className="space-y-5 mb-8">
            {grouped.map(({ category, items: categoryItems }) => {
              const categoryChecked = categoryItems.filter(i => i.checked).length;
              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{categoryEmoji[category] || "📦"}</span>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      {category}
                    </h2>
                    <span className="text-[10px] text-text-muted bg-surface px-2 py-0.5 rounded-full">
                      {categoryChecked}/{categoryItems.length}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {categoryItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => toggleGroceryItem(item.id)}
                        className={`flex items-center gap-3 w-full text-left p-3.5 rounded-2xl transition-all card-hover ${
                          item.checked ? "bg-surface" : "bg-card-bg shadow-sm shadow-black/5"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                            item.checked
                              ? "gradient-bg shadow-sm shadow-primary/20"
                              : "border-2 border-border"
                          }`}
                        >
                          {item.checked && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className={`text-sm font-semibold ${item.checked ? "line-through text-text-muted" : ""}`}>
                              {item.name}
                            </span>
                            <span className="text-xs text-text-muted">{item.amount} {item.unit}</span>
                          </div>
                          <p className="text-[11px] text-text-muted truncate">{item.recipeName}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
