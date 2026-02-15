// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { fetchProducts } from "./productApi";

// // Async thunk for fetching products
// export const getProducts = createAsyncThunk(
//   "products/products",
//   async (params, { rejectWithValue }) => {
//     try {
//       const data = await fetchProducts(params);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   },
// );

// const productsSlice = createSlice({
//   name: "products",
//   initialState: {
//     items: [],
//     total: 0,
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(getProducts.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload.products;
//         state.total = action.payload.total;
//       })
//       .addCase(getProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to fetch products";
//       });
//   },
// });

// export default productsSlice.reducer;








import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, fetchProductById, fetchCategories } from './productApi';

// Async thunk for fetching products with filters
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (filters, { rejectWithValue }) => {
    try {
      // Convert UI filters to API parameters
      const params = {
        category: filters.category,
        search: filters.searchQuery,
        limit: filters.limit,
        skip: (filters.page - 1) * filters.limit,
        select: 'title,price,rating,thumbnail,category', // Optimize response
      };
      const data = await fetchProducts(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products');
    }
  }
);

// Async thunk for fetching categories
export const getCategories = createAsyncThunk(
  'products/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCategories();
    } catch (error) {
      return rejectWithValue('Failed to fetch categories');
    }
  }
);

// Async thunk for fetching single product
export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (id, { rejectWithValue }) => {
    try {
      return await fetchProductById(id);
    } catch (error) {
      return rejectWithValue('Failed to fetch product');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
    categories: [],
    categoriesLoading: false,
    selectedProduct: null,
    selectedProductLoading: false,
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Categories
      .addCase(getCategories.pending, (state) => {
        state.categoriesLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state) => {
        state.categoriesLoading = false;
      })
      
      // Get Product By Id
      .addCase(getProductById.pending, (state) => {
        state.selectedProductLoading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.selectedProductLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state) => {
        state.selectedProductLoading = false;
      });
  },
});

export const { clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;