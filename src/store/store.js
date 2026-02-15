// import { configureStore } from '@reduxjs/toolkit';
// import { setupListeners } from '@reduxjs/toolkit/query';
// import { productsApi } from '../features/products/productsApi';
// import productsReducer from '../features/products/productsSlice';
// import filtersReducer from '../features/filters/filtersSlice';
// import cartReducer from '../features/cart/cartSlice';

// export const store = configureStore({
//   reducer: {
//     // RTK Query API reducer
//     [productsApi.reducerPath]: productsApi.reducer,

//     // Feature reducers
//     products: productsReducer,
//     filters: filtersReducer,
//     cart: cartReducer,
//   },
//   // Adding the api middleware enables caching, invalidation, polling, etc.
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(productsApi.middleware),
// });

// // optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// setupListeners(store.dispatch);

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {},
});
