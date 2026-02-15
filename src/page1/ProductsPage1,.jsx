import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  useGetProductsQuery,
  useGetFilterOptionsQuery,
  useLazySearchProductsQuery,
} from '../productsApi';
import {
  selectApiFilterParams,
  selectActiveFilterCount,
  setCategory,
  setSearch,
  setCurrentPriceRange,
  setMinRating,
  setSorting,
  setPage,
  setLimit,
  resetAllFilters,
} from '../../filters/filtersSlice';
import ProductFilters from './ProductFilters';
import ProductGrid from './ProductGrid';
import ProductList from './ProductList';
import Pagination from '../../../components/Pagination';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorAlert from '../../../components/ErrorAlert';
import SearchBar from './SearchBar';
import ActiveFilters from './ActiveFilters';
import SortDropdown from './SortDropdown';
import ViewModeToggle from './ViewModeToggle';
import FilterSummary from './FilterSummary';
import useDebounce from '../../../hooks/useDebounce';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local UI state
  const [viewMode, setViewMode] = useState('grid');
  const [searchInput, setSearchInput] = useState('');
  
  // Get filter state from Redux
  const filterParams = useSelector(selectApiFilterParams);
  const activeFilterCount = useSelector(selectActiveFilterCount);
  
  // Debounce search input to avoid too many API calls
  const debouncedSearch = useDebounce(searchInput, 500);
  
  // Update search in Redux when debounced value changes
  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);
  
  // Sync URL params with Redux on mount
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = searchParams.get('page');
    const sortBy = searchParams.get('sortBy');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    
    if (category) dispatch(setCategory(category));
    if (search) {
      setSearchInput(search);
      dispatch(setSearch(search));
    }
    if (page) dispatch(setPage(parseInt(page)));
    if (sortBy) {
      const [field, order] = sortBy.split(':');
      dispatch(setSorting({ sortBy: field, sortOrder: order }));
    }
    if (minPrice && maxPrice) {
      dispatch(setCurrentPriceRange({ 
        min: parseInt(minPrice), 
        max: parseInt(maxPrice) 
      }));
    }
  }, [dispatch, searchParams]);
  
  // Update URL when filters change
  useEffect(() => {
    const params = {};
    
    if (filterParams.category) params.category = filterParams.category;
    if (filterParams.search) params.search = filterParams.search;
    if (filterParams.page > 1) params.page = filterParams.page;
    if (filterParams.sortBy !== 'createdAt') {
      params.sortBy = `${filterParams.sortBy}:${filterParams.sortOrder}`;
    }
    if (filterParams.minPrice) params.minPrice = filterParams.minPrice;
    if (filterParams.maxPrice) params.maxPrice = filterParams.maxPrice;
    if (filterParams.minRating) params.minRating = filterParams.minRating;
    
    setSearchParams(params, { replace: true });
  }, [filterParams, setSearchParams]);
  
  // Fetch products with current filters
  const {
    data: productsData,
    isLoading: productsLoading,
    isFetching,
    error: productsError,
    refetch,
  } = useGetProductsQuery(filterParams, {
    // Skip if no filters? Usually we want to fetch anyway
    skip: false,
    // Refetch when window regains focus
    refetchOnFocus: true,
    // Refetch when reconnecting
    refetchOnReconnect: true,
    // Keep previous data while fetching new data
    keepPreviousData: true,
  });
  
  // Fetch filter options (categories, price ranges, etc.)
  const {
    data: filterOptions,
    isLoading: optionsLoading,
  } = useGetFilterOptionsQuery({
    category: filterParams.category,
    search: filterParams.search,
  });
  
  // Infinite scroll setup (optional)
  const { setLastElement } = useInfiniteScroll({
    hasMore: productsData?.hasNext,
    onLoadMore: () => dispatch(nextPage()),
    isLoading: isFetching,
  });
  
  // Handle search input
  const handleSearchChange = useCallback((e) => {
    setSearchInput(e.target.value);
  }, []);
  
  // Handle sort change
  const handleSortChange = useCallback((sortBy, sortOrder) => {
    dispatch(setSorting({ sortBy, sortOrder }));
  }, [dispatch]);
  
  // Handle price change
  const handlePriceChange = useCallback((min, max) => {
    dispatch(setCurrentPriceRange({ min, max }));
  }, [dispatch]);
  
  // Handle clear all filters
  const handleClearAll = useCallback(() => {
    dispatch(resetAllFilters());
    setSearchInput('');
  }, [dispatch]);
  
  if (productsLoading && optionsLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with search and sort */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold">
            Products
            {productsData?.total && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({productsData.total} items)
              </span>
            )}
          </h1>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <SearchBar 
              value={searchInput}
              onChange={handleSearchChange}
              onSearch={(value) => dispatch(setSearch(value))}
              suggestions={productsData?.suggestions}
              className="flex-1 md:w-64"
            />
            
            <ViewModeToggle 
              viewMode={viewMode} 
              onChange={setViewMode} 
            />
          </div>
        </div>
        
        {/* Active filters summary */}
        {activeFilterCount > 0 && (
          <FilterSummary 
            filters={filterParams}
            filterOptions={filterOptions}
            onClear={handleClearAll}
            onRemoveFilter={(type, value) => {
              // Handle individual filter removal
              switch(type) {
                case 'category':
                  dispatch(setCategory(null));
                  break;
                case 'rating':
                  dispatch(setMinRating(null));
                  break;
                case 'price':
                  dispatch(setCurrentPriceRange({
                    min: filterOptions?.priceRange?.min,
                    max: filterOptions?.priceRange?.max,
                  }));
                  break;
                default:
                  break;
              }
            }}
          />
        )}
      </div>
      
      {/* Main content with error handling */}
      {productsError ? (
        <ErrorAlert 
          error={productsError} 
          onRetry={refetch}
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="lg:w-1/5">
            <ProductFilters
              filterOptions={filterOptions}
              selectedFilters={filterParams}
              onCategoryChange={(cat) => dispatch(setCategory(cat))}
              onPriceChange={handlePriceChange}
              onRatingChange={(rating) => dispatch(setMinRating(rating))}
              onClearFilters={handleClearAll}
              isLoading={optionsLoading}
              activeFilterCount={activeFilterCount}
            />
          </aside>
          
          {/* Products grid/list */}
          <main className="lg:w-4/5">
            {/* Sort bar */}
            <div className="mb-4 flex justify-between items-center">
              <SortDropdown
                sortBy={filterParams.sortBy}
                sortOrder={filterParams.sortOrder}
                onChange={handleSortChange}
              />
              
              <div className="text-sm text-gray-500">
                Showing {productsData?.products?.length || 0} of {productsData?.total || 0}
              </div>
            </div>
            
            {/* Products display */}
            {viewMode === 'grid' ? (
              <ProductGrid 
                products={productsData?.products}
                isLoading={isFetching}
                lastElementRef={setLastElement}
              />
            ) : (
              <ProductList 
                products={productsData?.products}
                isLoading={isFetching}
                lastElementRef={setLastElement}
              />
            )}
            
            {/* Pagination (if not using infinite scroll) */}
            {!setLastElement && productsData?.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={filterParams.page}
                  totalPages={productsData.totalPages}
                  onPageChange={(page) => dispatch(setPage(page))}
                />
              </div>
            )}
            
            {/* No results */}
            {productsData?.products?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No products found</p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;