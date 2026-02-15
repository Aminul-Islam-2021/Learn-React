import React, { useState, useEffect } from 'react';

export const PriceFilter = ({ min, max, onChange }) => {
  const [minPrice, setMinPrice] = useState(min || '');
  const [maxPrice, setMaxPrice] = useState(max || '');

  const handleApply = () => {
    onChange({
      min: minPrice ? Number(minPrice) : null,
      max: maxPrice ? Number(maxPrice) : null
    });
  };

  const handleClear = () => {
    setMinPrice('');
    setMaxPrice('');
    onChange({ min: null, max: null });
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Price Range</h3>
      
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          min="0"
        />
        <span>-</span>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          min="0"
        />
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Apply
        </button>
        {(min || max) && (
          <button
            onClick={handleClear}
            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};