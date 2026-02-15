import React from 'react';

export const ActiveFilters = ({ filters, categories, onRemove, onClearAll }) => {
  const getCategoryName = (id) => {
    const category = categories.find(c => c.id === id);
    return category?.name || id;
  };

  const filterLabels = [];

  if (filters.search) {
    filterLabels.push({ key: 'search', label: `Search: "${filters.search}"` });
  }

  if (filters.category && filters.category !== 'all') {
    filterLabels.push({ key: 'category', label: `Category: ${getCategoryName(filters.category)}` });
  }

  if (filters.subcategory) {
    filterLabels.push({ key: 'subcategory', label: 'Subcategory' });
  }

  if (filters.brand) {
    filterLabels.push({ key: 'brand', label: `Brand: ${filters.brand}` });
  }

  if (filters.minPrice || filters.maxPrice) {
    const min = filters.minPrice || '0';
    const max = filters.maxPrice || '∞';
    filterLabels.push({ key: 'price', label: `Price: $${min} - $${max}` });
  }

  if (filters.minRating > 0) {
    filterLabels.push({ key: 'rating', label: `${filters.minRating}+ Stars` });
  }

  if (filterLabels.length === 0) return null;

  return (
    <div className="bg-gray-50 p-3 rounded-lg flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-600">Active filters:</span>
      
      {filterLabels.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
        >
          {filter.label}
          <button
            onClick={() => onRemove(filter.key)}
            className="ml-1 hover:text-blue-600"
          >
            ×
          </button>
        </span>
      ))}
      
      <button
        onClick={onClearAll}
        className="text-sm text-red-500 hover:text-red-700 ml-auto"
      >
        Clear all
      </button>
    </div>
  );
};