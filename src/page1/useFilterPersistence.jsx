import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

export const useFilterPersistence = (filterActions) => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Save filters to localStorage
  const saveFilters = useCallback((filters) => {
    try {
      localStorage.setItem('productFilters', JSON.stringify(filters));
    } catch (error) {
      console.error('Failed to save filters:', error);
    }
  }, []);

  // Load filters from localStorage
  const loadFilters = useCallback(() => {
    try {
      const saved = localStorage.getItem('productFilters');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load filters:', error);
      return null;
    }
  }, []);

  // Sync filters with URL
  const syncWithUrl = useCallback((filters) => {
    const params = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (typeof value === 'object') {
          params[key] = JSON.stringify(value);
        } else {
          params[key] = String(value);
        }
      }
    });
    
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Load filters from URL
  const loadFromUrl = useCallback(() => {
    const filters = {};
    
    for (const [key, value] of searchParams.entries()) {
      try {
        filters[key] = JSON.parse(value);
      } catch {
        filters[key] = value;
      }
    }
    
    return filters;
  }, [searchParams]);

  return {
    saveFilters,
    loadFilters,
    syncWithUrl,
    loadFromUrl,
  };
};