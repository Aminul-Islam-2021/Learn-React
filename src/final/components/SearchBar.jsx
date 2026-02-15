import React, { useState, useEffect, useRef } from 'react';
import { fetchSearchSuggestions } from '../store/features/products/productApi';

const SearchBar = ({ value, onChange, placeholder }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef();

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (value.length >= 2) {
                const results = await fetchSearchSuggestions(value);
                setSuggestions(results);
            } else {
                setSuggestions([]);
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder={placeholder}
                className="w-full border rounded px-3 py-2"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border rounded mt-1 shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((product) => (
                        <li
                            key={product.id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                onChange(product.title); // or navigate to product
                                setShowSuggestions(false);
                            }}
                        >
                            {product.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;