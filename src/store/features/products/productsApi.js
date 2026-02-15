import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Transform functions
const transformProduct = (product) => ({
  ...product,
  price: Number(product.price),
  rating: Number(product.rating),
});

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || "https://dummyjson.com/products",
    // Add request interceptor for auth if needed
    prepareHeaders: (headers) => {
      // const token = localStorage.getItem('token');
      // if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),

  // Tag types for cache invalidation
  tagTypes: ["Product", "Category", "Products"],

  endpoints: (builder) => ({
    // Get all products with filtering, sorting, pagination
    getProducts: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params?.category && params.category !== "all") {
          queryParams.append("category", params.category);
        }
        if (params?.minPrice) queryParams.append("price_gte", params.minPrice);
        if (params?.maxPrice) queryParams.append("price_lte", params.maxPrice);
        if (params?.minRating)
          queryParams.append("rating_gte", params.minRating);
        if (params?.sort) {
          const [field, order] = params.sort.split("-");
          queryParams.append(
            "_sort",
            field === "price"
              ? "price"
              : field === "rating"
                ? "rating"
                : "title",
          );
          queryParams.append(
            "_order",
            order === "low" || order === "a" ? "asc" : "desc",
          );
        }
        if (params?.page) queryParams.append("_page", params.page);
        if (params?.limit) queryParams.append("_limit", params.limit);

        return `products?${queryParams.toString()}`;
      },
      // Transform response
      transformResponse: (response) => ({
        products: response.map(transformProduct),
        total: response.length, // In real API, this would come from headers
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: "Product", id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    // Get single product
    getProductById: builder.query({
      query: (id) => `products/${id}`,
      transformResponse: transformProduct,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // Get all categories
    getCategories: builder.query({
      query: () => "categories",
      providesTags: ["Category"],
    }),

    // Get products by category
    getProductsByCategory: builder.query({
      query: (category) => `products?category=${category}`,
      transformResponse: (response) => response.map(transformProduct),
      providesTags: (result, error, category) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product", id })),
              { type: "Products", id: `CATEGORY_${category}` },
            ]
          : [{ type: "Products", id: `CATEGORY_${category}` }],
    }),

    // Get price range for products/category
    getPriceRange: builder.query({
      query: (category) => {
        const url =
          category && category !== "all"
            ? `products?category=${category}`
            : "products";
        return url;
      },
      transformResponse: (response) => {
        const prices = response.map((p) => Number(p.price));
        return {
          min: Math.min(...prices),
          max: Math.max(...prices),
        };
      },
      providesTags: ["Products"],
    }),

    // Get rating range for products/category
    getRatingRange: builder.query({
      query: (category) => {
        const url =
          category && category !== "all"
            ? `products?category=${category}`
            : "products";
        return url;
      },
      transformResponse: (response) => {
        const ratings = response.map((p) => Number(p.rating));
        return {
          min: Math.min(...ratings),
          max: Math.max(...ratings),
          available: [...new Set(ratings.map((r) => Math.floor(r)))].sort(),
        };
      },
      providesTags: ["Products"],
    }),

    // Search products
    searchProducts: builder.query({
      query: (searchTerm) => `products?q=${searchTerm}`,
      transformResponse: (response) => response.map(transformProduct),
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Product", id }))
          : [{ type: "Products", id: "SEARCH" }],
    }),

    // Mutations
    addProduct: builder.mutation({
      query: (product) => ({
        url: "products",
        method: "POST",
        body: product,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `products/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
  useGetPriceRangeQuery,
  useGetRatingRangeQuery,
  useSearchProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
