// // productsAPI.js
// import axios from 'axios';

// const API_BASE = "https://dummyjson.com"; // replace with your actual API

// export const fetchProducts = async (params) => {
//   const response = await axios.get(`${API_BASE}/products`, { params });
//   return response.data; // assume { products: [], total, page, limit }
// };

// export const fetchSearchSuggestions = async (query) => {
//   const response = await axios.get(`${API_BASE}/products/search`, {
//     params: { q: query, limit: 5 },
//   });
//   return response.data.products; // array of products
// };










import axios from 'axios';

const API_BASE = 'https://dummyjson.com';

// Fetch products with all parameters
export const fetchProducts = async (params = {}) => {
  let url = `${API_BASE}/products`;
  const queryParams = new URLSearchParams();

  // 1. Category endpoint (special case)
  if (params.category && params.category !== 'all') {
    url = `${API_BASE}/products/category/${params.category}`;
  }
  
  // 2. Search endpoint (overrides category)
  if (params.search) {
    url = `${API_BASE}/products/search`;
    queryParams.append('q', params.search);
  }

  // 3. Pagination
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.skip) queryParams.append('skip', params.skip);
  
  // 4. Field selection (optional)
  if (params.select) queryParams.append('select', params.select);

  const finalUrl = queryParams.toString() ? `${url}?${queryParams}` : url;
  const response = await axios.get(finalUrl);
  return response.data; // { products, total, skip, limit }
};

// Fetch all categories
export const fetchCategories = async () => {
  const response = await axios.get(`${API_BASE}/products/categories`);
  return response.data; // Array of category objects { slug, name, url }
};

// Fetch single product by ID
export const fetchProductById = async (id) => {
  const response = await axios.get(`${API_BASE}/products/${id}`);
  return response.data;
};

// Search suggestions (uses search endpoint with small limit)
export const fetchSearchSuggestions = async (query) => {
  if (!query || query.length < 2) return [];
  const response = await axios.get(
    `${API_BASE}/products/search?q=${query}&limit=5&select=title,price,thumbnail`
  );
  return response.data.products;
};