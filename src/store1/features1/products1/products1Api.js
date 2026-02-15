import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || "http://localhost:3001/api/v1/",
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if needed
      const token = getState().auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["Products", "Product", "Categories", "Brands"],

  endpoints: (builder) => ({
    // ============= ADVANCED PRODUCT QUERY WITH BACKEND FILTERS =============
    getProducts: builder.query({
      query: (params) => {
        // Build query string with all filter parameters
        const queryParams = new URLSearchParams();

        // Pagination
        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);

        // Filtering
        if (params.category) queryParams.append("category", params.category);
        if (params.brand) queryParams.append("brand", params.brand);
        if (params.minPrice) queryParams.append("minPrice", params.minPrice);
        if (params.maxPrice) queryParams.append("maxPrice", params.maxPrice);
        if (params.minRating) queryParams.append("minRating", params.minRating);
        if (params.inStock !== undefined)
          queryParams.append("inStock", params.inStock);

        // Searching
        if (params.search) queryParams.append("search", params.search);

        // Sorting
        if (params.sortBy) {
          queryParams.append("sortBy", params.sortBy);
          queryParams.append("sortOrder", params.sortOrder || "asc");
        }

        // Field selection
        if (params.fields) queryParams.append("fields", params.fields);

        // Advanced filters
        if (params.tags) queryParams.append("tags", params.tags.join(","));
        if (params.attributes) {
          Object.entries(params.attributes).forEach(([key, value]) => {
            queryParams.append(`attr[${key}]`, value);
          });
        }

        return `/products?${queryParams.toString()}`;
      },

      // Transform response based on your backend API structure
      transformResponse: (response) => {
        // Handle different API response structures
        if (response.data && response.meta) {
          // REST API with metadata
          return {
            products: response.data,
            total: response.meta.total,
            page: response.meta.page,
            limit: response.meta.limit,
            totalPages: response.meta.totalPages,
            hasNext: response.meta.hasNext,
            hasPrev: response.meta.hasPrev,
          };
        } else if (response.products && response.pagination) {
          // Custom structure
          return {
            products: response.products,
            ...response.pagination,
          };
        } else {
          // Simple array response
          return {
            products: response,
            total: response.length,
            page: 1,
            limit: response.length,
            totalPages: 1,
          };
        }
      },

      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map(({ id }) => ({ type: "Product", id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    // ============= GET FILTER OPTIONS FROM BACKEND =============
    getFilterOptions: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.category) queryParams.append("category", params.category);
        if (params.search) queryParams.append("search", params.search);

        return `/products/filters?${queryParams.toString()}`;
      },

      transformResponse: (response) => ({
        categories: response.categories || [],
        brands: response.brands || [],
        priceRange: response.priceRange || { min: 0, max: 10000 },
        ratings: response.ratings || [1, 2, 3, 4, 5],
        tags: response.tags || [],
        attributes: response.attributes || {},
        inStock: response.inStock || { available: 0, outOfStock: 0 },
      }),

      providesTags: ["Products"],
    }),

    // ============= SEARCH PRODUCTS WITH AUTOCOMPLETE =============
    searchProducts: builder.query({
      query: (searchTerm) => `/products/search?q=${searchTerm}&limit=10`,

      transformResponse: (response) => ({
        suggestions: response.suggestions || [],
        products: response.products || [],
      }),

      // Keep unused data for 5 minutes
      keepUnusedDataFor: 300,
    }),

    // ============= GET SINGLE PRODUCT =============
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // ============= GET RELATED PRODUCTS =============
    getRelatedProducts: builder.query({
      query: ({ productId, limit = 4 }) =>
        `/products/${productId}/related?limit=${limit}`,
      providesTags: ["Products"],
    }),

    // ============= BULK PRODUCT FETCH =============
    getProductsByIds: builder.query({
      query: (ids) => `/products/bulk?ids=${ids.join(",")}`,
      providesTags: (result) =>
        result?.map(({ id }) => ({ type: "Product", id })),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetFilterOptionsQuery,
  useSearchProductsQuery,
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
  useGetProductsByIdsQuery,
  useLazyGetProductsQuery,
  useLazySearchProductsQuery,
} = productsApi;
