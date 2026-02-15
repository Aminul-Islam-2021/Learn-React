import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Transform functions
const transformProduct = (product) => ({
  ...product,
  price: Number(product.price),
  rating: Number(product.rating),
});

// export const productsApi2 = createApi({
//   reducerPath: "productsApi2",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "https://dummyjson.com",
//   }),
//   endpoints: (builder) => ({
//     getProducts: builder.query({
//       query:()=>"/products"
//     }),
//   }),
// });

export const productsApi2 = createApi({
  reducerPath: "productsApi2",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dummyjson.com",
  }),

  // Tag types for cache invalidation
  tagTypes: ["Product", "Category", "Products"],

  endpoints: (builder) => ({
    getProducts: builder.query({
      // Accept parameters for pagination, filtering, etc.
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        // DummyJSON uses different parameter names
        if (params?.limit) queryParams.append("limit", params.limit);
        if (params?.skip) queryParams.append("skip", params.skip);

        // For search
        if (params?.search) {
          return `/products/search?q=${params.search}&${queryParams.toString()}`;
        }

        // For category filtering
        if (params?.category && params.category !== "all") {
          return `/products/category/${params.category}?${queryParams.toString()}`;
        }

        // Note: DummyJSON doesn't support server-side price/rating filtering
        // These would need to be done client-side after fetching

        // For sorting - DummyJSON doesn't support custom sorting in API
        // You would need to handle sorting client-side

        return `/products?${queryParams.toString()}`;
      },

      // Transform response correctly for DummyJSON
      transformResponse: (response, meta, arg) => {
        // DummyJSON returns { products: [], total, skip, limit }
        const products = response.products || response;
        const total = response.total || products.length;

        // Apply client-side filters if needed (since DummyJSON doesn't support server-side)
        let filteredProducts = products.map(transformProduct);

        // Client-side price filtering (if needed)
        if (arg?.minPrice) {
          filteredProducts = filteredProducts.filter(
            (p) => p.price >= arg.minPrice,
          );
        }
        if (arg?.maxPrice) {
          filteredProducts = filteredProducts.filter(
            (p) => p.price <= arg.maxPrice,
          );
        }

        // Client-side rating filtering (if needed)
        if (arg?.minRating) {
          filteredProducts = filteredProducts.filter(
            (p) => p.rating >= arg.minRating,
          );
        }

        // Client-side sorting (if needed)
        if (arg?.sort) {
          const [field, order] = arg.sort.split("-");
          filteredProducts.sort((a, b) => {
            let aVal =
              a[
                field === "price"
                  ? "price"
                  : field === "rating"
                    ? "rating"
                    : "title"
              ];
            let bVal =
              b[
                field === "price"
                  ? "price"
                  : field === "rating"
                    ? "rating"
                    : "title"
              ];

            if (order === "low" || order === "a") {
              return aVal > bVal ? 1 : -1;
            } else {
              return aVal < bVal ? 1 : -1;
            }
          });
        }

        return {
          products: filteredProducts,
          total: total,
          skip: response.skip || 0,
          limit: response.limit || filteredProducts.length,
        };
      },

      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map(({ id }) => ({ type: "Product", id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
  }),
});

export const { useGetProductsQuery } = productsApi2;
