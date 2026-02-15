// import React, { useEffect, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// //import { getProducts } from '../features/products/productsSlice';
// import {
//   setCategory,
//   setSubcategory,
//   setPriceRange,
//   setMinRating,
//   setSort,
//   setSearchQuery,
//   setPage,
//   toggleMobileFilters,
//   closeMobileFilters,
// } from "../store/features/filters/filterSlice";
// import FiltersSidebar from "../components/FiltersSidebar";
// import SearchBar from "../components/SearchBar";
// import ProductCard from "../components/ProductCard";
// import Pagination from "../components/Pagination";
// import ActiveFilters from "../components/ActiveFilters";
// import useDebounce from "../hooks/useDebounce";
// import { getProducts } from "../store/features/products/productsSlice";

// import {
//   fetchProducts,
//   fetchProducts,
//   fetchProducts,
//   fetchProductsFromApi,
// } from "../store/features/products/productApi";

// const ProductsPage5 = () => {
//   const dispatch = useDispatch();
//   const filters = useSelector((state) => state.filters);
//   const {
//     items: products,
//     total,
//     loading,
//     error,
//   } = useSelector((state) => state.products);

//   // Local search input (for debounce)
//   const [searchInput, setSearchInput] = useState(filters.searchQuery);
//   const debouncedSearch = useDebounce(searchInput, 500);

//   // Update global search query when debounced value changes
//   useEffect(() => {
//     dispatch(setSearchQuery(debouncedSearch));
//   }, [debouncedSearch, dispatch]);

//   // Fetch products when filters change
//   useEffect(() => {
//     const params = {
//       category: filters.category !== "all" ? filters.category : undefined,
//       subcategory: filters.subcategory || undefined,
//       minPrice: filters.minPrice,
//       maxPrice: filters.maxPrice,
//       minRating: filters.minRating || undefined,
//       sortBy: filters.sortBy,
//       sortOrder: filters.sortOrder,
//       search: filters.searchQuery || undefined,
//       page: filters.page,
//       limit: filters.limit,
//     };
//     dispatch(getProducts(params));
//   }, [filters, dispatch]);

//   const handleSortChange = (e) => {
//     const [sortBy, sortOrder] = e.target.value.split("-");
//     dispatch(setSort({ sortBy, sortOrder }));
//   };

//   const handlePageChange = (newPage) => {
//     dispatch(setPage(newPage));
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <div className="container mx-auto px-4 py-6">
//       {/* Header with search and sort */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
//         <h1 className="text-2xl font-bold">Products ({total})</h1>
//         <div className="flex items-center gap-2 w-full md:w-auto">
//           <SearchBar
//             value={searchInput}
//             onChange={setSearchInput}
//             placeholder="Search products..."
//           />
//           <select
//             value={`${filters.sortBy}-${filters.sortOrder}`}
//             onChange={handleSortChange}
//             className="border rounded px-3 py-2"
//           >
//             <option value="createdAt-desc">Newest</option>
//             <option value="price-asc">Price: Low to High</option>
//             <option value="price-desc">Price: High to Low</option>
//             <option value="rating-desc">Top Rated</option>
//           </select>
//           {/* Mobile filter toggle */}
//           <button
//             onClick={() => dispatch(toggleMobileFilters())}
//             className="md:hidden bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             Filters
//           </button>
//         </div>
//       </div>

//       {/* Active filters bar */}
//       <ActiveFilters />

//       <div className="flex gap-6">
//         {/* Sidebar - hidden on mobile, shown as drawer */}
//         <FiltersSidebar
//           className="hidden md:block w-64 shrink-0"
//           isMobile={false}
//         />

//         {/* Mobile drawer */}
//         {filters.isMobileFiltersOpen && (
//           <div className="fixed inset-0 z-50 md:hidden">
//             <div
//               className="absolute inset-0 bg-black bg-opacity-50"
//               onClick={() => dispatch(closeMobileFilters())}
//             />
//             <div className="absolute left-0 top-0 h-full w-80 bg-white p-4 overflow-y-auto">
//               <FiltersSidebar isMobile={true} />
//             </div>
//           </div>
//         )}

//         {/* Products grid */}
//         <div className="flex-1">
//           {loading && products.length === 0 ? (
//             <div className="text-center py-10">Loading...</div>
//           ) : error ? (
//             <div className="text-center py-10 text-red-500">Error: {error}</div>
//           ) : products.length > 0 ? (
//             <>
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {products.map((product) => (
//                   <ProductCard key={product.id} product={product} />
//                 ))}
//               </div>
//               <Pagination
//                 currentPage={filters.page}
//                 totalPages={Math.ceil(total / filters.limit)}
//                 onPageChange={handlePageChange}
//               />
//             </>
//           ) : (
//             <div className="text-center py-10">No products found.</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductsPage5;

// import React, { useEffect, useMemo, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getProducts, getCategories } from '../store/features/products/productsSlice';
// import {
//     setCategory,
//     setSearchQuery,
//     setPriceRange,
//     setMinRating,
//     setSortBy,
//     setPage,
// } from '../store/features/filters/filterSlice';
// import { fetchSearchSuggestions } from '../store/features/products/productApi';
// import SearchBar from '../components/SearchBar';
// import FiltersSidebar from '../components/FiltersSidebar';
// import ProductCard from '../components/ProductCard';
// import Pagination from '../components/Pagination';
// import useDebounce from '../hooks/useDebounce';

// const ProductsPage5 = () => {
//     const dispatch = useDispatch();
//     const filters = useSelector(state => state.filters);
//     const { items: rawProducts, loading, error, total, categories } = useSelector(state => state.products);

//     // Local state for search suggestions
//     const [suggestions, setSuggestions] = useState([]);
//     const debouncedSearch = useDebounce(filters.searchQuery, 300);

//     // Fetch categories on mount
//     useEffect(() => {
//         dispatch(getCategories());
//     }, [dispatch]);

//     // Fetch products when relevant filters change
//     useEffect(() => {
//         dispatch(getProducts(filters));
//     }, [filters.category, filters.searchQuery, filters.page, filters.limit, dispatch]);

//     // Fetch search suggestions
//     useEffect(() => {
//         const getSuggestions = async () => {
//             if (debouncedSearch.length >= 2) {
//                 const results = await fetchSearchSuggestions(debouncedSearch);
//                 setSuggestions(results);
//             } else {
//                 setSuggestions([]);
//             }
//         };
//         getSuggestions();
//     }, [debouncedSearch]);

//     // Apply client-side filters (price, rating) and sorting
//     const processedProducts = useMemo(() => {
//         if (!rawProducts) return [];

//         // Filter by price (client-side)
//         let filtered = rawProducts.filter(p => {
//             const meetsMin = filters.minPrice ? p.price >= filters.minPrice : true;
//             const meetsMax = filters.maxPrice ? p.price <= filters.maxPrice : true;
//             return meetsMin && meetsMax;
//         });

//         // Filter by rating (client-side)
//         if (filters.minRating > 0) {
//             filtered = filtered.filter(p => p.rating >= filters.minRating);
//         }

//         // Apply sorting (client-side)
//         if (filters.sortBy === 'price-asc') {
//             filtered.sort((a, b) => a.price - b.price);
//         } else if (filters.sortBy === 'price-desc') {
//             filtered.sort((a, b) => b.price - a.price);
//         } else if (filters.sortBy === 'rating-desc') {
//             filtered.sort((a, b) => b.rating - a.rating);
//         } else if (filters.sortBy === 'title-asc') {
//             filtered.sort((a, b) => a.title.localeCompare(b.title));
//         }

//         return filtered;
//     }, [rawProducts, filters.minPrice, filters.maxPrice, filters.minRating, filters.sortBy]);

//     return (
//         <div className="container mx-auto px-4 py-6">
//             {/* Header with search */}
//             <div className="mb-6">
//                 <SearchBar
//                     value={filters.searchQuery}
//                     onChange={(value) => dispatch(setSearchQuery(value))}
//                     suggestions={suggestions}
//                     onSelectSuggestion={(product) => {
//                         // Handle suggestion click (e.g., navigate to product)
//                         console.log('Selected:', product);
//                     }}
//                     placeholder="Search products..."
//                 />
//             </div>

//             <div className="flex flex-col md:flex-row gap-6">
//                 {/* Sidebar Filters */}
//                 <aside className="md:w-1/4">
//                     <FiltersSidebar
//                         categories={categories}
//                         filters={filters}
//                         onCategoryChange={(cat) => dispatch(setCategory(cat))}
//                         onPriceChange={(min, max) => dispatch(setPriceRange({ min, max }))}
//                         onRatingChange={(rating) => dispatch(setMinRating(rating))}
//                         onSortChange={(sort) => dispatch(setSortBy(sort))}
//                     />
//                 </aside>

//                 {/* Products Grid */}
//                 <main className="md:w-3/4">
//                     {loading && <div className="text-center py-10">Loading products...</div>}
//                     {error && <div className="text-center py-10 text-red-500">Error: {error}</div>}

//                     {!loading && !error && (
//                         <>
//                             <div className="mb-4 text-sm text-gray-600">
//                                 Showing {processedProducts.length} of {total} products
//                             </div>

//                             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                                 {processedProducts.map(product => (
//                                     <ProductCard key={product.id} product={product} />
//                                 ))}
//                             </div>

//                             {processedProducts.length === 0 && (
//                                 <div className="text-center py-10 text-gray-500">
//                                     No products match your filters
//                                 </div>
//                             )}

//                             <Pagination
//                                 currentPage={filters.page}
//                                 totalPages={Math.ceil(total / filters.limit)}
//                                 onPageChange={(page) => dispatch(setPage(page))}
//                             />
//                         </>
//                     )}
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default ProductsPage5;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/store";

const ProductsPage5 = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  // Fetch on component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  // Log state changes
  useEffect(() => {
    console.log("Current items:", items);
    console.log("Loading:", loading);
    console.log("Error:", error);
  }, [items, loading, error]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      <h2>Products ({items.length})</h2>
      <pre>{JSON.stringify(items.slice(0, 2), null, 2)}</pre>
    </div>
  );
};

export default ProductsPage5;
