import React from "react";
import { useProductFilters } from "../hooks/useProductFilters";
import { SearchBar } from "../components/SearchBar";
import { CategoryFilter } from "../components/CategoryFilter";
import { PriceFilter } from "../components/PriceFilter";
import { RatingFilter } from "../components/RatingFilter";
import { SortDropdown } from "../components/SortDropdown";
import { ActiveFilters } from "../components/ActiveFilter";
import { Pagination } from "../components/Pagination";
import ProductCard from "../components/ProductCard";

const SampleProductsPage = () => {
  const {
    // State
    filters,
    products,
    loading,
    error,
    categories,
    subcategories,
    suggestions,
    pagination,
    activeFilterCount,
    hasActiveFilters,

    // Actions
    updateFilter,
    updateFilters,
    resetFilters,
    clearFilter,
    handleSearch,
    fetchSuggestions,
    handleSort,
    handlePageChange,
    setShowSuggestions,
  } = useProductFilters();

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold">
            Products
            {!loading && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({pagination.totalItems} items)
              </span>
            )}
          </h1>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <SearchBar
              value={filters.search}
              onChange={(value) => {
                handleSearch(value);
                fetchSuggestions(value);
              }}
              suggestions={suggestions}
              onSelectSuggestion={(product) => {
                // Handle suggestion selection
                console.log("Selected:", product);
              }}
              placeholder="Search products..."
            />

            <SortDropdown
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
              onChange={handleSort}
            />
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mt-4">
            <ActiveFilters
              filters={filters}
              categories={categories}
              onRemove={(key) => clearFilter(key)}
              onClearAll={resetFilters}
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-1/5">
          <div className="bg-white p-4 rounded-lg shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">Filters</h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  Reset
                </button>
              )}
            </div>

            <CategoryFilter
              categories={categories}
              selectedCategory={filters.category}
              subcategories={subcategories}
              selectedSubcategory={filters.subcategory}
              onCategoryChange={(cat) => updateFilter("category", cat)}
              onSubcategoryChange={(sub) => updateFilter("subcategory", sub)}
            />

            <PriceFilter
              min={filters.minPrice}
              max={filters.maxPrice}
              onChange={({ min, max }) => {
                updateFilters({ minPrice: min, maxPrice: max });
              }}
            />

            <RatingFilter
              selected={filters.minRating}
              onChange={(rating) => updateFilter("minRating", rating)}
            />
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:w-4/5">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 mb-4">No products found</p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Loading indicator for pagination */}
          {loading && products.length > 0 && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SampleProductsPage;
