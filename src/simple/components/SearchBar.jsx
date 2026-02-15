import React, { useState, useEffect, useRef } from 'react';

export const SearchBar = ({ 
  value, 
  onChange, 
  suggestions = [], 
  onSelectSuggestion,
  placeholder = "Search products..."
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((product) => (
            <div
              key={product.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
              onClick={() => {
                onSelectSuggestion?.(product);
                setShowSuggestions(false);
              }}
            >
              <img src={product.thumbnail} alt={product.title} className="w-8 h-8 object-cover rounded" />
              <div>
                <div className="font-medium">{product.title}</div>
                <div className="text-sm text-gray-600">${product.price}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};