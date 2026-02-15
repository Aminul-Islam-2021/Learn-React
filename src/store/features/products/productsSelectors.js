import { createSelector } from "@reduxjs/toolkit";

// Base selectors
const selectProductsState = (state) => state.products;
const selectFiltersState = (state) => state.filters;

// Memoized selectors
export const selectAllProducts = createSelector(
  [selectProductsState],
  (productsState) => productsState.displayedProducts,
);

export const selectFilteredAndSortedProducts = createSelector(
  [(state) => state.products.displayedProducts, (state) => state.filters],
  (products, filters) => {
    if (!products || products.length === 0) return [];

    let filtered = [...products];

    // Apply category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    // Apply price filter
    filtered = filtered.filter((p) => p.price <= filters.priceRange.current);

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter((p) => p.rating >= filters.rating);
    }

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query),
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "price-low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating-high-low":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name-a-z":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-z-a":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return filtered;
  },
);

export const selectPaginatedProducts = createSelector(
  [selectFilteredAndSortedProducts, selectFiltersState],
  (products, filters) => {
    const { page, limit } = filters.pagination;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      products: products.slice(start, end),
      total: products.length,
      page,
      totalPages: Math.ceil(products.length / limit),
    };
  },
);

export const selectCurrentFilters = createSelector(
  [selectFiltersState],
  (filters) => ({
    category: filters.category,
    priceRange: filters.priceRange,
    rating: filters.rating,
    sortBy: filters.sortBy,
    searchQuery: filters.searchQuery,
  }),
);

export const selectPagination = createSelector(
  [selectFiltersState],
  (filters) => filters.pagination,
);

export const selectViewMode = createSelector(
  [selectFiltersState],
  (filters) => filters.viewMode,
);

export const selectHasActiveFilters = createSelector(
  [selectFiltersState],
  (filters) =>
    filters.category !== "all" ||
    filters.priceRange.current < filters.priceRange.max ||
    filters.rating > 0 ||
    filters.searchQuery !== "",
);
