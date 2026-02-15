// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   category: 'all',
//   subcategory: '',
//   minPrice: null,
//   maxPrice: null,
//   minRating: 0,
//   sortBy: 'createdAt',
//   sortOrder: 'desc',
//   searchQuery: '',
//   page: 1,
//   limit: 12,
//   // UI state for mobile
//   isMobileFiltersOpen: false,
// };

// const filtersSlice = createSlice({
//   name: 'filters',
//   initialState,
//   reducers: {
//     setCategory: (state, action) => {
//       state.category = action.payload;
//       state.subcategory = ''; // reset subcategory
//       state.page = 1;
//     },
//     setSubcategory: (state, action) => {
//       state.subcategory = action.payload;
//       state.page = 1;
//     },
//     setPriceRange: (state, action) => {
//       state.minPrice = action.payload.min;
//       state.maxPrice = action.payload.max;
//       state.page = 1;
//     },
//     setMinRating: (state, action) => {
//       state.minRating = action.payload;
//       state.page = 1;
//     },
//     setSort: (state, action) => {
//       state.sortBy = action.payload.sortBy;
//       state.sortOrder = action.payload.sortOrder;
//     },
//     setSearchQuery: (state, action) => {
//       state.searchQuery = action.payload;
//       state.page = 1;
//     },
//     setPage: (state, action) => {
//       state.page = action.payload;
//     },
//     resetFilters: () => initialState,
//     toggleMobileFilters: (state) => {
//       state.isMobileFiltersOpen = !state.isMobileFiltersOpen;
//     },
//     closeMobileFilters: (state) => {
//       state.isMobileFiltersOpen = false;
//     },
//   },
// });

// export const {
//   setCategory,
//   setSubcategory,
//   setPriceRange,
//   setMinRating,
//   setSort,
//   setSearchQuery,
//   setPage,
//   resetFilters,
//   toggleMobileFilters,
//   closeMobileFilters,
// } = filtersSlice.actions;

// export default filtersSlice.reducer;










import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  category: 'all',
  searchQuery: '',
  minPrice: null,
  maxPrice: null,
  minRating: 0,
  sortBy: 'default', // 'price-asc', 'price-desc', 'rating-desc', 'title-asc'
  page: 1,
  limit: 12,
  // UI state
  isMobileFiltersOpen: false,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
      state.page = 1;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setPriceRange: (state, action) => {
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
      state.page = 1;
    },
    setMinRating: (state, action) => {
      state.minRating = action.payload;
      state.page = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    toggleMobileFilters: (state) => {
      state.isMobileFiltersOpen = !state.isMobileFiltersOpen;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setCategory,
  setSearchQuery,
  setPriceRange,
  setMinRating,
  setSortBy,
  setPage,
  toggleMobileFilters,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;