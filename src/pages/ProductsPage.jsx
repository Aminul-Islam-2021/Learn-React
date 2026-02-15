import React, { useEffect, useState } from "react";
import {
  getcategories,
  getMaxPrice,
  getMinPrice,
  getProducts,
  getProductsByCategory,
} from "../mockData/dataProcess";

const ProductsPage = () => {
  const categories = getcategories();
  const allProducts = getProducts();
  const maxPrice = getMaxPrice();
  const minPrice = getMinPrice();
  const productByCategory = getProductsByCategory;

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState(maxPrice);
  const [selectedRating, setSelectedRating] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const productsPerPage = 6;

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let result = allProducts;

    // Filter by category
    if (selectedCategory !== "all") {
      result = productByCategory(selectedCategory);
    }

    // Filter by price
    result = result.filter((product) => product.price <= priceRange);

    // Filter by rating
    if (selectedRating > 0) {
      result = result.filter((product) => product.rating >= selectedRating);
    }
    setFilteredProducts(result);

    // Pagination
    const total = Math.ceil(result.length / productsPerPage);
    setTotalPages(total);
    setCurrentPage(1); // Reset to first page on filter change
  }, [selectedCategory, priceRange, selectedRating, allProducts]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    setPaginatedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [currentPage, filteredProducts, productsPerPage]);

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handlePriceChange = (e) => {
    setPriceRange(Number(e.target.value));
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating === selectedRating ? 0 : rating);
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setPriceRange(maxPrice);
    setSelectedRating(0);
    setCurrentPage(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = maxVisiblePages;
      }
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  return (
    <div className=" flex gap-4 p-4 min-h-screen">
      {/* Sidebar Filter */}
      <div className="w-1/4">
        <div className=" flex justify-between">
          <h2 className="text-xl font-bold text-gray-800">Filters</h2>
          <button
            onClick={resetFilters}
            className="btn btn-outline btn-sm btn-error"
          >
            Reset All
          </button>
        </div>
        {/* Category Filter */}
        <div>
          <h3>Category</h3>
          <div className=" space-y-2">
            <div className=" flex items-center">
              <input
                type="radio"
                name="category"
                id="all"
                className=" radio radio-primary"
                checked={selectedCategory === "all"}
                onChange={() => handleCategoryChange("all")}
              />
              <label
                htmlFor="all"
                className="ml-2 text-gray-600 cursor-pointer"
              >
                All Categories
              </label>
            </div>
            {categories.map((category, index) => (
              <div key={index} className=" flex items-center">
                <input
                  type="radio"
                  name="category"
                  id={category}
                  className=" radio radio-primary"
                  checked={selectedCategory === category}
                  onChange={() => handleCategoryChange(category)}
                />
                <label
                  htmlFor={category}
                  className="ml-2 text-gray-600 cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="mt-4 mb-6">
          <div className=" flex justify-between items-center">
            <h3>Price Range</h3>
            <span className=" font-medium">${priceRange}</span>
          </div>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRange}
            onChange={handlePriceChange}
            className=" w-full range range-primary"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>${minPrice.toFixed(2)}</span>
            <span>${maxPrice.toFixed(2)}</span>
          </div>
        </div>
        {/* Rating Filter */}
        <div className="mb-6">
          <h3>Rating</h3>
          <div className=" space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`flex items-center gap-3 w-full p-2 rounded-lg transition-all ${selectedRating === rating ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"}`}
              >
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-700 text-sm">
                  {rating}.0 & above
                </span>
                {selectedRating === rating && (
                  <span className="ml-auto text-blue-600">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={() => handleRatingChange(0)}
              className={`flex items-center justify-between w-full p-2 rounded-lg transition-all ${selectedRating === 0 ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"}`}
            >
              <span className="text-gray-700 text-sm">All Ratings</span>
              {selectedRating === 0 && (
                <span className="text-blue-600">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
        {/* Active Filters Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Active Filters</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium capitalize">{selectedCategory}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Max Price:</span>
              <span className="font-medium">${priceRange.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Min Rating:</span>
              <span className="font-medium">{selectedRating || "Any"}</span>
            </div>
            <div className="pt-2 border-t border-gray-300">
              <div className="flex justify-between font-semibold">
                <span>Total Results:</span>
                <span className="text-primary">
                  {filteredProducts.length} products
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Products Grid */}
      <div className="w-3/4">
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No products found
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow">
                <h2>{product.title}</h2>
              </div>
            ))}
          </div>
        )}
        {/* Pagination Component */}
        {filteredProducts.length > productsPerPage && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Page Info */}
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">
                  {(currentPage - 1) * productsPerPage + 1}-
                  {Math.min(
                    currentPage * productsPerPage,
                    filteredProducts.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold">{filteredProducts.length}</span>{" "}
                products
              </div>
              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                {/* First Page Button */}
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="btn btn-sm btn-square btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
                  title="First Page"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Previous Page Button */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="btn btn-sm btn-square btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous Page"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`btn btn-sm ${currentPage === pageNum ? "btn-primary" : "btn-ghost"}`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {/* Ellipsis if needed */}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                </div>

                {/* Next Page Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="btn btn-sm btn-square btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next Page"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Last Page Button */}
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="btn btn-sm btn-square btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Last Page"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Items Per Page Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  className="select select-bordered select-sm w-20"
                  disabled
                >
                  <option>{productsPerPage}</option>
                </select>
                <span className="text-sm text-gray-600">per page</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(currentPage / totalPages) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <span>{Math.round((currentPage / totalPages) * 100)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
