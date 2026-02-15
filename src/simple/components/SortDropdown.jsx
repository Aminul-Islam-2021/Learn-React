import React from 'react';

export const SortDropdown = ({ sortBy, sortOrder, onChange }) => {
  const options = [
    { value: 'createdAt-desc', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating-desc', label: 'Top Rated' },
    { value: 'title-asc', label: 'Name: A to Z' },
    { value: 'title-desc', label: 'Name: Z to A' },
  ];

  const handleChange = (e) => {
    const [newSortBy, newSortOrder] = e.target.value.split('-');
    onChange(newSortBy, newSortOrder);
  };

  const currentValue = `${sortBy}-${sortOrder}`;

  return (
    <select
      value={currentValue}
      onChange={handleChange}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};