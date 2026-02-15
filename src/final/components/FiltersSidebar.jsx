import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setCategory,
    setSubcategory,
    setPriceRange,
    setMinRating,
    resetFilters,
} from '../store/features/filters/filterSlice';

// Assume you have categories & subcategories from props or a separate API
const FiltersSidebar = ({ categories = [], subcategories = [] }) => {
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.filters);

    return (
        <div className="bg-white p-4 rounded shadow space-y-4">
            <h3 className="font-semibold text-lg">Filters</h3>

            {/* Categories */}
            <div>
                <label className="block font-medium mb-1">Category</label>
                <select
                    value={filters.category}
                    onChange={(e) => dispatch(setCategory(e.target.value))}
                    className="w-full border rounded p-2"
                >
                    <option value="all">All</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* Subcategories (if category selected) */}
            {filters.category !== 'all' && subcategories.length > 0 && (
                <div>
                    <label className="block font-medium mb-1">Subcategory</label>
                    <select
                        value={filters.subcategory}
                        onChange={(e) => dispatch(setSubcategory(e.target.value))}
                        className="w-full border rounded p-2"
                    >
                        <option value="">All</option>
                        {subcategories
                            .filter((sub) => sub.categoryId === filters.category)
                            .map((sub) => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                    </select>
                </div>
            )}

            {/* Price Range */}
            <div>
                <label className="block font-medium mb-1">Price Range</label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice || ''}
                        onChange={(e) =>
                            dispatch(setPriceRange({ min: e.target.value, max: filters.maxPrice }))
                        }
                        className="w-1/2 border rounded p-1"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice || ''}
                        onChange={(e) =>
                            dispatch(setPriceRange({ min: filters.minPrice, max: e.target.value }))
                        }
                        className="w-1/2 border rounded p-1"
                    />
                </div>
            </div>

            {/* Rating */}
            <div>
                <label className="block font-medium mb-1">Min Rating</label>
                <select
                    value={filters.minRating}
                    onChange={(e) => dispatch(setMinRating(Number(e.target.value)))}
                    className="w-full border rounded p-2"
                >
                    <option value={0}>Any</option>
                    <option value={4}>4+ stars</option>
                    <option value={3}>3+ stars</option>
                    <option value={2}>2+ stars</option>
                    <option value={1}>1+ stars</option>
                </select>
            </div>

            {/* Reset button */}
            <button
                onClick={() => dispatch(resetFilters())}
                className="w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
            >
                Reset Filters
            </button>
        </div>
    );
};

export default FiltersSidebar;