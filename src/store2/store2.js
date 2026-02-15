import { configureStore } from "@reduxjs/toolkit";
import { productsApi2 } from "./features2/products2/productsApi2";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store2 = configureStore({
  reducer: {
    [productsApi2.reducerPath]: productsApi2.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi2.middleware),
});

setupListeners(store2.dispatch);
