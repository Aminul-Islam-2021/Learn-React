import { createSlice } from "@reduxjs/toolkit";

// Structure that matches backend API expectations
const initialState = {
  // Basic filters
  category: null,
  brand: null,
  search: "",

  // Range filters
  priceRange: {
    min: null, // null means use backend default
    max: null,
    currentMin: null,
    currentMax: null,
  },

  // Rating filter
  minRating: null,

  // Stock filter
  inStock: null, // true, false, or null for all

  // Advanced filters
  tags: [], // Array of selected tags
  attributes: {}, // Dynamic attributes like { color: 'red', size: 'xl' }

  // Sorting
  sortBy: "createdAt", // field to sort by
  sortOrder: "desc", // 'asc' or 'desc'

  // Pagination
  page: 1,
  limit: 12,

  // Field selection (for performance)
  fields: "id,title,price,rating,thumbnail", // fields to return

  // UI State (not sent to backend)
  ui: {
    viewMode: "grid",
    showFilters: true,
    expandedSections: ["categories", "price"],
  },
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    // ============= BASIC FILTERS =============
    setCategory: (state, action) => {
      state.category = action.payload;
      state.page = 1; // Reset pagination
    },

    setBrand: (state, action) => {
      state.brand = action.payload;
      state.page = 1;
    },

    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1;
    },

    // ============= PRICE RANGE =============
    setPriceRange: (state, action) => {
      const { min, max } = action.payload;
      state.priceRange.min = min;
      state.priceRange.max = max;
      state.priceRange.currentMin = min;
      state.priceRange.currentMax = max;
      state.page = 1;
    },

    setCurrentPriceRange: (state, action) => {
      const { min, max } = action.payload;
      state.priceRange.currentMin = min;
      state.priceRange.currentMax = max;
      state.page = 1;
    },

    // ============= RATING =============
    setMinRating: (state, action) => {
      state.minRating = action.payload;
      state.page = 1;
    },

    // ============= STOCK =============
    setInStock: (state, action) => {
      state.inStock = action.payload;
      state.page = 1;
    },

    // ============= TAGS =============
    addTag: (state, action) => {
      if (!state.tags.includes(action.payload)) {
        state.tags.push(action.payload);
        state.page = 1;
      }
    },

    removeTag: (state, action) => {
      state.tags = state.tags.filter((tag) => tag !== action.payload);
      state.page = 1;
    },

    setTags: (state, action) => {
      state.tags = action.payload;
      state.page = 1;
    },

    // ============= ATTRIBUTES =============
    setAttribute: (state, action) => {
      const { key, value } = action.payload;
      state.attributes[key] = value;
      state.page = 1;
    },

    removeAttribute: (state, action) => {
      delete state.attributes[action.payload];
      state.page = 1;
    },

    clearAttributes: (state) => {
      state.attributes = {};
      state.page = 1;
    },

    // ============= SORTING =============
    setSorting: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      state.sortBy = sortBy;
      state.sortOrder = sortOrder;
      // Don't reset page for sorting
    },

    // ============= PAGINATION =============
    setPage: (state, action) => {
      state.page = action.payload;
    },

    setLimit: (state, action) => {
      state.limit = action.payload;
      state.page = 1;
    },

    nextPage: (state) => {
      state.page += 1;
    },

    prevPage: (state) => {
      state.page = Math.max(1, state.page - 1);
    },

    // ============= FIELD SELECTION =============
    setFields: (state, action) => {
      state.fields = action.payload;
    },

    // ============= UI STATE =============
    setViewMode: (state, action) => {
      state.ui.viewMode = action.payload;
    },

    toggleFilters: (state) => {
      state.ui.showFilters = !state.ui.showFilters;
    },

    toggleSection: (state, action) => {
      const section = action.payload;
      if (state.ui.expandedSections.includes(section)) {
        state.ui.expandedSections = state.ui.expandedSections.filter(
          (s) => s !== section,
        );
      } else {
        state.ui.expandedSections.push(section);
      }
    },

    // ============= RESET =============
    resetAllFilters: () => initialState,

    resetBasicFilters: (state) => {
      state.category = null;
      state.brand = null;
      state.search = "";
      state.page = 1;
    },

    resetPriceRange: (state) => {
      state.priceRange.currentMin = state.priceRange.min;
      state.priceRange.currentMax = state.priceRange.max;
      state.page = 1;
    },

    resetAdvancedFilters: (state) => {
      state.tags = [];
      state.attributes = {};
      state.minRating = null;
      state.inStock = null;
      state.page = 1;
    },
  },
});

// ============= SELECTORS =============

// Convert frontend filters to backend API parameters
export const selectApiFilterParams = (state) => {
  const filters = state.filters;
  const params = {};

  // Basic filters
  if (filters.category) params.category = filters.category;
  if (filters.brand) params.brand = filters.brand;
  if (filters.search) params.search = filters.search;

  // Price range
  if (filters.priceRange.currentMin !== null) {
    params.minPrice = filters.priceRange.currentMin;
  }
  if (filters.priceRange.currentMax !== null) {
    params.maxPrice = filters.priceRange.currentMax;
  }

  // Rating
  if (filters.minRating) params.minRating = filters.minRating;

  // Stock
  if (filters.inStock !== null) params.inStock = filters.inStock;

  // Tags (convert array to comma-separated)
  if (filters.tags.length > 0) params.tags = filters.tags.join(",");

  // Attributes
  if (Object.keys(filters.attributes).length > 0) {
    params.attributes = filters.attributes;
  }

  // Sorting
  params.sortBy = filters.sortBy;
  params.sortOrder = filters.sortOrder;

  // Pagination
  params.page = filters.page;
  params.limit = filters.limit;

  // Field selection
  if (filters.fields) params.fields = filters.fields;

  return params;
};

// Get active filter count
export const selectActiveFilterCount = (state) => {
  const filters = state.filters;
  let count = 0;

  if (filters.category) count++;
  if (filters.brand) count++;
  if (filters.search) count++;
  if (
    filters.priceRange.currentMin !== filters.priceRange.min ||
    filters.priceRange.currentMax !== filters.priceRange.max
  )
    count++;
  if (filters.minRating) count++;
  if (filters.inStock !== null) count++;
  if (filters.tags.length > 0) count++;
  if (Object.keys(filters.attributes).length > 0) count++;

  return count;
};

export const {
  setCategory,
  setBrand,
  setSearch,
  setPriceRange,
  setCurrentPriceRange,
  setMinRating,
  setInStock,
  addTag,
  removeTag,
  setTags,
  setAttribute,
  removeAttribute,
  clearAttributes,
  setSorting,
  setPage,
  setLimit,
  nextPage,
  prevPage,
  setFields,
  setViewMode,
  toggleFilters,
  toggleSection,
  resetAllFilters,
  resetBasicFilters,
  resetPriceRange,
  resetAdvancedFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
