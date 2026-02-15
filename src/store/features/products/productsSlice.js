import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productsApi } from "./productsApi";

const initialState = {
  displayedProducts: [],
  selectedProduct: null,
  loading: false,
  error: null,
  cache: {},
};

// Async thunk for custom async logic if needed
export const fetchProductWithDetails = createAsyncThunk(
  "products/fetchWithDetails",
  async (productId, { dispatch, getState }) => {
    // You can combine multiple API calls here
    const response = await dispatch(
      productsApi.endpoints.getProductById.initiate(productId),
    ).unwrap();

    // Fetch additional data if needed
    // const reviews = await fetchReviews(productId);

    return response;
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setDisplayedProducts: (state, action) => {
      state.displayedProducts = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    cacheProduct: (state, action) => {
      const { id, data } = action.payload;
      state.cache[id] = {
        data,
        timestamp: Date.now(),
      };
    },
    clearCache: (state) => {
      state.cache = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductWithDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductWithDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductWithDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setDisplayedProducts,
  clearSelectedProduct,
  clearError,
  cacheProduct,
  clearCache,
} = productsSlice.actions;

export default productsSlice.reducer;
