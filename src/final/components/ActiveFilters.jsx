import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setCategory,
    setSubcategory,
    setPriceRange,
    setMinRating,
    setSearchQuery,
} from '../store/features/filters/filterSlice';

const ActiveFilters = () => {
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.filters);

    const removeFilter = (type) => {
        switch (type) {
            case 'category':
                dispatch(setCategory('all'));
                break;
            case 'subcategory':
                dispatch(setSubcategory(''));
                break;
            case 'price':
                dispatch(setPriceRange({ min: null, max: null }));
                break;
            case 'rating':
                dispatch(setMinRating(0));
                break;
            case 'search':
                dispatch(setSearchQuery(''));
                break;
            default:
                break;
        }
    };

    const activeFilters = [];

    if (filters.category !== 'all')
        activeFilters.push({ type: 'category', label: `Category: ${filters.category}` });
    if (filters.subcategory)
        activeFilters.push({ type: 'subcategory', label: `Subcategory: ${filters.subcategory}` });
    if (filters.minPrice || filters.maxPrice) {
        const min = filters.minPrice || '0';
        const max = filters.maxPrice || '∞';
        activeFilters.push({ type: 'price', label: `Price: $${min} - $${max}` });
    }
    if (filters.minRating > 0)
        activeFilters.push({ type: 'rating', label: `${filters.minRating}+ Stars` });
    if (filters.searchQuery)
        activeFilters.push({ type: 'search', label: `Search: "${filters.searchQuery}"` });

    if (activeFilters.length === 0) return null;

    return (
        <div className="bg-gray-100 p-2 rounded flex flex-wrap gap-2 mb-4">
            <span className="text-sm text-gray-600">Active filters:</span>
            {activeFilters.map((filter) => (
                <span
                    key={filter.type}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                >
                    {filter.label}
                    <button onClick={() => removeFilter(filter.type)} className="ml-1 font-bold">×</button>
                </span>
            ))}
        </div>
    );
};

export default ActiveFilters;