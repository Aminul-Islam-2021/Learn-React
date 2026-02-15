import { useState, useEffect, useCallback, useMemo } from 'react';
import { productService } from '../services/productservice';

export const useProductFilters = (initialFilters = {}) => {
  // Filter states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
    category: 'all',
    subcategory: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    minRating: 0,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialFilters
  });

  // Data states
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter options states
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  // Search suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch products whenever filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // Fetch products function
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    const result = await productService.getProducts(filters);
    
    if (result.success) {
      setProducts(result.data.products);
      setTotalProducts(result.data.total);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  // Update a single filter
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset page when changing filters (except pagination)
      page: key === 'page' ? value : 1
    }));
  }, []);

  // Update multiple filters at once
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page
    }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 12,
      search: '',
      category: 'all',
      subcategory: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      minRating: 0,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  }, []);

  // Clear specific filter
  const clearFilter = useCallback((key) => {
    setFilters(prev => ({
      ...prev,
      [key]: key === 'category' ? 'all' : 
              key === 'minRating' ? 0 : '',
      page: 1
    }));
  }, []);

  // Handle search with debounce
  const handleSearch = useCallback((value) => {
    updateFilter('search', value);
  }, [updateFilter]);

  // Get search suggestions
  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    
    const results = await productService.getSearchSuggestions(query);
    setSuggestions(results);
  }, []);

  // Handle sort change
  const handleSort = useCallback((sortBy, sortOrder) => {
    updateFilters({ sortBy, sortOrder });
  }, [updateFilters]);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    updateFilter('page', newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [updateFilter]);

  // Load filter options on mount
  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    const options = await productService.getFilterOptions();
    setCategories(options.categories);
    setBrands(options.brands);
  };

  // Update subcategories when category changes
  useEffect(() => {
    if (filters.category && filters.category !== 'all') {
      // Fetch subcategories for selected category
      fetchSubcategories(filters.category);
    } else {
      setSubcategories([]);
    }
  }, [filters.category]);

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await fetch(`/api/subcategories?category=${categoryId}`);
      const data = await response.json();
      setSubcategories(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  // Computed values
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category !== 'all') count++;
    if (filters.subcategory) count++;
    if (filters.brand) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.minRating > 0) count++;
    return count;
  }, [filters]);

  const hasActiveFilters = activeFilterCount > 0;

  const pagination = useMemo(() => ({
    currentPage: filters.page,
    totalPages: Math.ceil(totalProducts / filters.limit),
    totalItems: totalProducts,
    itemsPerPage: filters.limit,
    hasNext: filters.page < Math.ceil(totalProducts / filters.limit),
    hasPrev: filters.page > 1
  }), [filters.page, filters.limit, totalProducts]);

  return {
    // State
    filters,
    products,
    loading,
    error,
    categories,
    subcategories,
    brands,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    pagination,
    activeFilterCount,
    hasActiveFilters,
    
    // Actions
    updateFilter,
    updateFilters,
    resetFilters,
    clearFilter,
    handleSearch,
    fetchSuggestions,
    handleSort,
    handlePageChange,
    setShowSuggestions
  };
};