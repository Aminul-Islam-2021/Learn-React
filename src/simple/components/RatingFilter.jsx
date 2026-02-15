import React from 'react';

export const RatingFilter = ({ selected, onChange }) => {
  const ratings = [4, 3, 2, 1];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Minimum Rating</h3>
      
      <div className="space-y-2">
        {ratings.map((rating) => (
          <label key={rating} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={selected === rating}
              onChange={() => onChange(rating)}
              className="text-yellow-400"
            />
            <div className="flex items-center gap-1">
              <span>{rating}</span>
              <span>★</span>
              <span className="text-gray-500">& up</span>
            </div>
          </label>
        ))}
        
        {selected > 0 && (
          <button
            onClick={() => onChange(0)}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Clear rating
          </button>
        )}
      </div>
    </div>
  );
};