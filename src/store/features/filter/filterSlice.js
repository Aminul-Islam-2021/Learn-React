import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: "all",
  priceRange: {
    min: 0,
    max: 1000,
    current: 1000,
  },
  rating: 0,
  sortBy: "default",
  searchQuery: "",
  pagination: {
    page: 1,
    limit: 12,
  },
  viewMode: "grid", // 'grid' or 'list'
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
      // Reset pagination when changing category
      state.pagination.page = 1;
    },

    setPriceRange: (state, action) => {
      const { min, max, current } = action.payload;
      if (min !== undefined) state.priceRange.min = min;
      if (max !== undefined) state.priceRange.max = max;
      if (current !== undefined) {
        state.priceRange.current = Math.min(current, state.priceRange.max);
      }
      state.pagination.page = 1;
    },

    setCurrentPrice: (state, action) => {
      state.priceRange.current = Math.min(action.payload, state.priceRange.max);
      state.pagination.page = 1;
    },

    setRating: (state, action) => {
      state.rating = action.payload;
      state.pagination.page = 1;
    },

    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.pagination.page = 1;
    },

    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },

    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },

    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },

    resetFilters: (state) => {
      return initialState;
    },

    resetPagination: (state) => {
      state.pagination.page = 1;
    },
  },
});

export const {
  setCategory,
  setPriceRange,
  setCurrentPrice,
  setRating,
  setSortBy,
  setSearchQuery,
  setPage,
  setLimit,
  setViewMode,
  resetFilters,
  resetPagination,
} = filtersSlice.actions;

export default filtersSlice.reducer;
