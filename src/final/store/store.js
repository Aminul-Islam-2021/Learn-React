// import { configureStore } from '@reduxjs/toolkit';
// import filtersReducer from './features/filters/filterSlice';
// import productsReducer from './features/products/productsSlice';

// export const store = configureStore({
//   reducer: {
//     filters: filtersReducer,
//     products: productsReducer,
//   },
// });



import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Simple API function
export const fetchProductsFromAPI = async () => {
  const response = await axios.get('https://dummyjson.com/products');
  return response.data;
};

// Async thunk
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await fetchProductsFromAPI();
    return response;
  }
);

// Products slice
const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

// Create store
export const store = configureStore({
  reducer: {
    products: productsSlice.reducer
  }
});




