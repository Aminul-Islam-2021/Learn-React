// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   useGetProductsQuery,
//   useGetCategoriesQuery,
//   useGetPriceRangeQuery,
//   useGetRatingRangeQuery,
// } from '../productsApi';
// import {
//   selectPaginatedProducts,
//   selectCurrentFilters,
//   selectViewMode,
//   selectHasActiveFilters,
// } from '../productsSelectors';
// import {
//   setCategory,
//   setCurrentPrice,
//   setRating,
//   setSortBy,
//   setPage,
//   resetFilters,
// } from '../../../filters/filtersSlice';
// import ProductFilters from './ProductFilters';
// import ProductSort from './ProductSort';
// import ProductCard from './ProductCard';
// import Pagination from '../../../components/Pagination';
// import LoadingSpinner from '../../../components/LoadingSpinner';
// import ErrorAlert from '../../../components/ErrorAlert';
// import ViewModeToggle from './ViewModeToggle';
// import ActiveFilters from './ActiveFilters';
// import useDebounce from '../../../hooks/useDebounce';

// const ProductsPage2 = () => {
//   const dispatch = useDispatch();
  
//   // Get current filters from Redux
//   const filters = useSelector(selectCurrentFilters);
//   const viewMode = useSelector(selectViewMode);
//   const hasActiveFilters = useSelector(selectHasActiveFilters);
  
//   // Debounce price range to avoid too many API calls
//   const debouncedPrice = useDebounce(filters.priceRange.current, 500);
  
//   // RTK Query hooks
//   const { 
//     data: productsData, 
//     isLoading: productsLoading,
//     error: productsError,
//     refetch: refetchProducts,
//   } = useGetProductsQuery({
//     category: filters.category,
//     maxPrice: debouncedPrice,
//     minRating: filters.rating || undefined,
//     sort: filters.sortBy !== 'default' ? filters.sortBy : undefined,
//     page: filters.pagination.page,
//     limit: filters.pagination.limit,
//   });

//   const { 
//     data: categories, 
//     isLoading: categoriesLoading 
//   } = useGetCategoriesQuery();

//   const { 
//     data: priceRange,
//     isLoading: priceRangeLoading,
//   } = useGetPriceRangeQuery(filters.category);

//   const { 
//     data: ratingRange,
//     isLoading: ratingRangeLoading,
//   } = useGetRatingRangeQuery(filters.category);

//   // Update price range in filters when category changes
//   useEffect(() => {
//     if (priceRange) {
//       dispatch(setPriceRange({
//         min: priceRange.min,
//         max: priceRange.max,
//         current: priceRange.max,
//       }));
//     }
//   }, [priceRange, dispatch]);

//   // Handle page change
//   const handlePageChange = (newPage) => {
//     dispatch(setPage(newPage));
//     // Scroll to top
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // Handle reset filters
//   const handleResetFilters = () => {
//     dispatch(resetFilters());
//   };

//   if (productsLoading || categoriesLoading || priceRangeLoading || ratingRangeLoading) {
//     return <LoadingSpinner />;
//   }

//   if (productsError) {
//     return <ErrorAlert error={productsError} onRetry={refetchProducts} />;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">
//           Our Products
//           {productsData?.total && (
//             <span className="ml-2 text-sm font-normal text-gray-500">
//               ({productsData.total} items)
//             </span>
//           )}
//         </h1>
//         <div className="flex items-center gap-4">
//           <ViewModeToggle />
//           <ProductSort 
//             currentSort={filters.sortBy}
//             onSortChange={(sort) => dispatch(setSortBy(sort))}
//           />
//         </div>
//       </div>

//       {/* Active Filters */}
//       {hasActiveFilters && (
//         <ActiveFilters 
//           filters={filters}
//           onReset={handleResetFilters}
//         />
//       )}

//       {/* Main Content */}
//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Sidebar Filters */}
//         <aside className="lg:w-1/5">
//           <ProductFilters
//             categories={categories || []}
//             selectedCategory={filters.category}
//             onCategoryChange={(cat) => dispatch(setCategory(cat))}
//             priceRange={filters.priceRange}
//             onPriceChange={(price) => dispatch(setCurrentPrice(price))}
//             ratingRange={ratingRange}
//             selectedRating={filters.rating}
//             onRatingChange={(rating) => dispatch(setRating(rating))}
//             onReset={handleResetFilters}
//           />
//         </aside>

//         {/* Products Grid */}
//         <main className="lg:w-4/5">
//           {productsData?.products?.length > 0 ? (
//             <>
//               <div className={`grid gap-6 ${
//                 viewMode === 'grid' 
//                   ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
//                   : 'grid-cols-1'
//               }`}>
//                 {productsData.products.map((product) => (
//                   <ProductCard 
//                     key={product.id} 
//                     product={product}
//                     viewMode={viewMode}
//                   />
//                 ))}
//               </div>

//               {/* Pagination */}
//               {productsData.totalPages > 1 && (
//                 <div className="mt-8">
//                   <Pagination
//                     currentPage={filters.pagination.page}
//                     totalPages={productsData.totalPages}
//                     onPageChange={handlePageChange}
//                   />
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="text-center py-12">
//               <p className="text-gray-500 mb-4">No products found</p>
//               {hasActiveFilters && (
//                 <button
//                   onClick={handleResetFilters}
//                   className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                 >
//                   Clear all filters
//                 </button>
//               )}
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ProductsPage2;



import React from 'react'

const ProductsPage2 = () => {
  return (
    <div>ProductsPage2</div>
  )
}

export default ProductsPage2