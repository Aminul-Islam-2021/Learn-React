// Simple API service using fetch
class ProductService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // Main method to fetch products with all filters
  async getProducts(filters = {}) {
    try {
      // Build query string
      const queryParams = this.buildQueryParams(filters);
      const response = await fetch(`${this.baseURL}/products?${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Apply client-side filters if your API doesn't support them
      let filteredData = this.applyClientSideFilters(data, filters);

      return {
        success: true,
        data: filteredData,
        error: null,
      };
    } catch (error) {
      console.error("API Error:", error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }
  }

  // Build query parameters for API
  buildQueryParams(filters) {
    const params = new URLSearchParams();

    // Pagination
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    // Search
    if (filters.search) params.append("search", filters.search);

    // Category
    if (filters.category && filters.category !== "all") {
      params.append("category", filters.category);
    }

    // Subcategory
    // if (filters.subcategory) {
    //   params.append("subcategory", filters.subcategory);
    // }

    // Brand
    // if (filters.brand) {
    //   params.append("brand", filters.brand);
    // }

    // Sorting
    if (filters.sortBy) {
      params.append("sortBy", filters.sortBy);
      params.append("sortOrder", filters.sortOrder || "asc");
    }

    return params.toString();
  }

  // Apply filters that API doesn't support (price, rating, etc.)
  applyClientSideFilters(response, filters) {
    let products = response.products || response.data || response;
    let total = response.total || products.length;

    // Apply price filter
    if (filters.minPrice !== undefined) {
      products = products.filter((p) => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= filters.maxPrice);
    }

    // Apply rating filter
    if (filters.minRating) {
      products = products.filter((p) => p.rating >= filters.minRating);
    }

    // Apply sorting
    if (filters.sortBy) {
      products = this.sortProducts(products, filters.sortBy, filters.sortOrder);
    }

    return {
      products,
      total: products.length,
      originalTotal: total,
    };
  }

  // Sort products
  sortProducts(products, sortBy, sortOrder = "asc") {
    return [...products].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }

  // Get search suggestions
  async getSearchSuggestions(query) {
    if (!query || query.length < 2) return [];

    try {
      const response = await fetch(
        `${this.baseURL}/products/search?q=${query}&limit=5`,
      );
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error("Search suggestions error:", error);
      return [];
    }
  }

  // Get filter options (categories, brands, etc.)
//   async getFilterOptions() {
//     try {
//       const [categories, brands] = await Promise.all([
//         fetch(`${this.baseURL}/categories`).then((res) => res.json()),
//         fetch(`${this.baseURL}/brands`).then((res) => res.json()),
//       ]);

//       return {
//         categories: categories || [],
//         brands: brands || [],
//       };
//     } catch (error) {
//       console.error("Filter options error:", error);
//       return {
//         categories: [],
//         brands: [],
//       };
//     }
//   }
}

// Create and export a singleton instance
export const productService = new ProductService("https://dummyjson.com");
