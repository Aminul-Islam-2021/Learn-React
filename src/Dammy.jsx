// import { useState } from "react";
// import {
//   getcategories,
//   getProducts,
//   getProductsByCategory,
//   maxPrice,
//   minPrice,
// } from "./mockData/dataProcess";

// function App() {
//   const categories = getcategories();
//   //console.log(categories);
//   const [categoriesSet, setCategoriesSet] = useState([...categories]);
//   const products = getProducts();
//   //console.log(products)
//   const productsByCategory = getProductsByCategory("beauty");
//   //console.log(productsByCategory);
//   const maxprice = maxPrice();
//   const minprice = minPrice();
//   //console.log("Max Price:", maxprice);
//   //console.log("Min Price:", minprice);
//   return (
//     <>
//       <div className=" flex gap-4 p-4">
//         <div className="w-1/4">
//           <h2>Category</h2>
//           <br />
//           {categoriesSet.map((category, index) => (
//             <div key={index}>
//               <input type="radio" name="radio-1" className="radio" />
//               {category}
//             </div>
//           ))}
//           <br />
//           <h2>Price Range</h2>
//           <br />
//           <input
//             type="range"
//             min={0}
//             max="100"
//             value="40"
//             className="range text-blue-300 [--range-bg:orange] [--range-thumb:blue] [--range-fill:0]"
//           />
//           <h2>Rating</h2>
//           <br />
//           <div className="rating">
//             <input
//               type="radio"
//               name="rating-4"
//               className="mask mask-star-2 bg-green-500"
//               aria-label="1 star"
//             />
//             <input
//               type="radio"
//               name="rating-4"
//               className="mask mask-star-2 bg-green-500"
//               aria-label="2 star"
//               defaultChecked
//             />
//             <input
//               type="radio"
//               name="rating-4"
//               className="mask mask-star-2 bg-green-500"
//               aria-label="3 star"
//             />
//             <input
//               type="radio"
//               name="rating-4"
//               className="mask mask-star-2 bg-green-500"
//               aria-label="4 star"
//             />
//             <input
//               type="radio"
//               name="rating-4"
//               className="mask mask-star-2 bg-green-500"
//               aria-label="5 star"
//             />
//           </div>
//         </div>
//         <div className="w-3/4">
//           <h2>Filter Products</h2>
//           {products.map((product) => (
//             <div key={product.id}>
//               {product.title} - ${product.price}
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;

import { useState, useEffect } from "react";
import {
  getcategories,
  getProducts,
  getProductsByCategory,
  maxPrice,
  minPrice,
} from "./mockData/dataProcess";
import ProductsPage from "./pages/ProductsPage";

function App() {
  const categories = getcategories();
  const allProducts = getProducts();
  const maxprice = maxPrice();
  const minprice = minPrice();
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // State for filters
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState(maxprice);
  const [selectedRating, setSelectedRating] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let result = allProducts;

    // Filter by category
    if (selectedCategory !== "all") {
      result = getProductsByCategory(selectedCategory);
    }

    // Filter by price
    result = result.filter((product) => product.price <= priceRange);

    // Filter by rating
    if (selectedRating > 0) {
      result = result.filter((product) => product.rating >= selectedRating);
    }

    setFilteredProducts(result);
  }, [selectedCategory, priceRange, selectedRating, allProducts]);

  // Update paginated products when filtered products or page changes
  useEffect(() => {
    // Calculate total pages
    const totalPagesCount = Math.ceil(
      filteredProducts.length / productsPerPage,
    );
    setTotalPages(totalPagesCount);

    // Get current page products
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct,
    );

    setPaginatedProducts(currentProducts);
  }, [filteredProducts, currentPage, productsPerPage]);

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
    setPriceRange(maxprice);
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
   
    <div className="flex gap-4 p-4 min-h-screen bg-gray-50">
      {/* Sidebar Filters */}
      <div className="w-1/4 bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Filters</h2>
          <button
            onClick={resetFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Reset All
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Category</h3>
          <div className="space-y-2">
            {/* All Categories Option */}
            <div className="flex items-center">
              <input
                type="radio"
                name="category"
                id="all"
                className="radio radio-primary"
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

            {/* Individual Categories */}
            {categories.map((category, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  id={category}
                  className="radio radio-primary"
                  checked={selectedCategory === category}
                  onChange={() => handleCategoryChange(category)}
                />
                <label
                  htmlFor={category}
                  className="ml-2 text-gray-600 cursor-pointer capitalize"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Price Range</h3>
            <span className="text-blue-600 font-medium">
              ${priceRange.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={minprice}
            max={maxprice}
            value={priceRange}
            onChange={handlePriceChange}
            className="range range-primary w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>${minprice.toFixed(2)}</span>
            <span>${maxprice.toFixed(2)}</span>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Minimum Rating
          </h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  id={`rating-${rating}`}
                  className="radio radio-primary"
                  checked={selectedRating === rating}
                  onChange={() => handleRatingChange(rating)}
                />
                <div className="ml-2 flex items-center">
                  <div className="rating rating-xs">
                    {[...Array(5)].map((_, i) => (
                      <input
                        key={i}
                        type="radio"
                        name={`rating-display-${rating}`}
                        className="mask mask-star-2 bg-yellow-400"
                        checked={i < rating}
                        readOnly
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">{rating}.0 & above</span>
                </div>
              </div>
            ))}

            {/* Clear Rating Option */}
            <div className="flex items-center mt-3">
              <input
                type="radio"
                name="rating"
                id="rating-0"
                className="radio radio-primary"
                checked={selectedRating === 0}
                onChange={() => handleRatingChange(0)}
              />
              <label htmlFor="rating-0" className="ml-2 text-gray-600">
                All Ratings
              </label>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Active Filters</h4>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Category:{" "}
              <span className="font-medium capitalize">{selectedCategory}</span>
            </p>
            <p className="text-sm text-gray-600">
              Max Price:{" "}
              <span className="font-medium">${priceRange.toFixed(2)}</span>
            </p>
            <p className="text-sm text-gray-600">
              Min Rating:{" "}
              <span className="font-medium">{selectedRating || "Any"}</span>
            </p>
            <p className="text-sm text-gray-600">
              Results:{" "}
              <span className="font-medium">
                {filteredProducts.length} products
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Products Display */}
      <div className="w-3/4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Products</h2>
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {allProducts.length} products
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters</p>
            <button onClick={resetFilters} className="btn btn-primary">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                    {product.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.title}
                </h3>
                <div className="flex items-center mb-4">
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input
                        key={i}
                        type="radio"
                        name={`rating-${product.id}`}
                        className="mask mask-star-2 bg-yellow-400"
                        checked={i < Math.floor(product.rating)}
                        readOnly
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <button className="btn btn-primary btn-sm">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>


        )}
      </div>
    </div>
  );
}

export default App;

// import { useState, useEffect } from "react";
// import {
//   getcategories,
//   getProducts,
//   getProductsByCategory,
//   maxPrice,
//   minPrice,
// } from "./mockData/dataProcess";

// function App() {
//   const categories = getcategories();
//   const allProducts = getProducts();
//   const maxprice = maxPrice();
//   const minprice = minPrice();

//   // State for filters
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [priceRange, setPriceRange] = useState(maxprice);
//   const [selectedRating, setSelectedRating] = useState(0);
//   const [sortOption, setSortOption] = useState("default");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredProducts, setFilteredProducts] = useState(allProducts);

//   // Apply filters and sorting
//   useEffect(() => {
//     let result = allProducts;

//     // Filter by category
//     if (selectedCategory !== "all") {
//       result = getProductsByCategory(selectedCategory);
//     }

//     // Filter by price
//     result = result.filter(product => product.price <= priceRange);

//     // Filter by rating
//     if (selectedRating > 0) {
//       result = result.filter(product => product.rating >= selectedRating);
//     }

//     // Filter by search query
//     if (searchQuery.trim() !== "") {
//       result = result.filter(product =>
//         product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         product.category.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Apply sorting
//     result = sortProducts(result, sortOption);

//     setFilteredProducts(result);
//   }, [selectedCategory, priceRange, selectedRating, sortOption, searchQuery, allProducts]);

//   // Sorting function
//   const sortProducts = (products, option) => {
//     const sortedProducts = [...products];

//     switch (option) {
//       case "price-low-high":
//         return sortedProducts.sort((a, b) => a.price - b.price);

//       case "price-high-low":
//         return sortedProducts.sort((a, b) => b.price - a.price);

//       case "rating-high-low":
//         return sortedProducts.sort((a, b) => b.rating - a.rating);

//       case "rating-low-high":
//         return sortedProducts.sort((a, b) => a.rating - b.rating);

//       case "name-asc":
//         return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));

//       case "name-desc":
//         return sortedProducts.sort((a, b) => b.title.localeCompare(a.title));

//       // Assuming products have createdAt property
//       case "newest":
//         return sortedProducts.sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id));

//       case "oldest":
//         return sortedProducts.sort((a, b) => new Date(a.createdAt || a.id) - new Date(b.createdAt || b.id));

//       default:
//         return sortedProducts; // Default/Featured sorting
//     }
//   };

//   const handleCategoryChange = (category) => {
//     setSelectedCategory(category);
//   };

//   const handlePriceChange = (e) => {
//     setPriceRange(Number(e.target.value));
//   };

//   const handleRatingChange = (rating) => {
//     setSelectedRating(rating === selectedRating ? 0 : rating);
//   };

//   const handleSortChange = (e) => {
//     setSortOption(e.target.value);
//   };

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const resetFilters = () => {
//     setSelectedCategory("all");
//     setPriceRange(maxprice);
//     setSelectedRating(0);
//     setSortOption("default");
//     setSearchQuery("");
//   };

//   return (
//     <div className="flex gap-4 p-4 min-h-screen bg-gray-50">
//       {/* Sidebar Filters */}
//       <div className="w-1/4 bg-white p-6 rounded-lg shadow-md">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-bold text-gray-800">Filters</h2>
//           <button
//             onClick={resetFilters}
//             className="btn btn-outline btn-sm btn-error"
//           >
//             Reset All
//           </button>
//         </div>

//         {/* Search Bar */}
//         <div className="mb-6">
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text font-semibold">Search Products</span>
//             </label>
//             <input
//               type="text"
//               placeholder="Search by name or category..."
//               className="input input-bordered input-sm w-full"
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//           </div>
//         </div>

//         {/* Category Filter */}
//         <div className="mb-8">
//           <h3 className="text-lg font-semibold text-gray-700 mb-4">Category</h3>
//           <div className="space-y-2">
//             <div className="flex items-center">
//               <input
//                 type="radio"
//                 name="category"
//                 id="all"
//                 className="radio radio-primary"
//                 checked={selectedCategory === "all"}
//                 onChange={() => handleCategoryChange("all")}
//               />
//               <label htmlFor="all" className="ml-2 text-gray-600 cursor-pointer">
//                 All Categories
//               </label>
//             </div>

//             {categories.map((category, index) => (
//               <div key={index} className="flex items-center">
//                 <input
//                   type="radio"
//                   name="category"
//                   id={category}
//                   className="radio radio-primary"
//                   checked={selectedCategory === category}
//                   onChange={() => handleCategoryChange(category)}
//                 />
//                 <label htmlFor={category} className="ml-2 text-gray-600 cursor-pointer capitalize">
//                   {category}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Price Range Filter */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold text-gray-700">Price Range</h3>
//             <span className="text-blue-600 font-medium">${priceRange.toFixed(2)}</span>
//           </div>
//           <input
//             type="range"
//             min={minprice}
//             max={maxprice}
//             value={priceRange}
//             onChange={handlePriceChange}
//             className="range range-primary w-full"
//           />
//           <div className="flex justify-between text-sm text-gray-500 mt-2">
//             <span>${minprice.toFixed(2)}</span>
//             <span>${maxprice.toFixed(2)}</span>
//           </div>
//         </div>

//         {/* Rating Filter */}
//         <div className="mb-8">
//           <h3 className="text-lg font-semibold text-gray-700 mb-4">Minimum Rating</h3>
//           <div className="space-y-2">
//             {[5, 4, 3, 2, 1].map((rating) => (
//               <div key={rating} className="flex items-center">
//                 <input
//                   type="radio"
//                   name="rating"
//                   id={`rating-${rating}`}
//                   className="radio radio-primary"
//                   checked={selectedRating === rating}
//                   onChange={() => handleRatingChange(rating)}
//                 />
//                 <div className="ml-2 flex items-center">
//                   <div className="rating rating-xs">
//                     {[...Array(5)].map((_, i) => (
//                       <input
//                         key={i}
//                         type="radio"
//                         name={`rating-display-${rating}`}
//                         className="mask mask-star-2 bg-yellow-400"
//                         checked={i < rating}
//                         readOnly
//                       />
//                     ))}
//                   </div>
//                   <span className="ml-2 text-gray-600">
//                     {rating}.0 & above
//                   </span>
//                 </div>
//               </div>
//             ))}

//             <div className="flex items-center mt-3">
//               <input
//                 type="radio"
//                 name="rating"
//                 id="rating-0"
//                 className="radio radio-primary"
//                 checked={selectedRating === 0}
//                 onChange={() => handleRatingChange(0)}
//               />
//               <label htmlFor="rating-0" className="ml-2 text-gray-600">
//                 All Ratings
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Active Filters Summary */}
//         <div className="bg-gray-50 p-4 rounded-lg">
//           <h4 className="font-medium text-gray-700 mb-2">Active Filters</h4>
//           <div className="space-y-1 text-sm">
//             <div className="flex justify-between">
//               <span className="text-gray-600">Category:</span>
//               <span className="font-medium capitalize">{selectedCategory}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Max Price:</span>
//               <span className="font-medium">${priceRange.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Min Rating:</span>
//               <span className="font-medium">{selectedRating || "Any"}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Search:</span>
//               <span className="font-medium">{searchQuery || "None"}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Sort By:</span>
//               <span className="font-medium">
//                 {sortOption === "default" ? "Default" :
//                  sortOption === "price-low-high" ? "Price: Low to High" :
//                  sortOption === "price-high-low" ? "Price: High to Low" :
//                  sortOption === "rating-high-low" ? "Rating: High to Low" :
//                  sortOption === "rating-low-high" ? "Rating: Low to High" :
//                  sortOption === "name-asc" ? "Name: A to Z" :
//                  sortOption === "name-desc" ? "Name: Z to A" :
//                  sortOption === "newest" ? "Newest" : "Oldest"}
//               </span>
//             </div>
//             <div className="pt-2 border-t border-gray-300">
//               <div className="flex justify-between font-semibold">
//                 <span>Results:</span>
//                 <span className="text-primary">{filteredProducts.length} products</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="w-3/4">
//         {/* Header with Sorting */}
//         <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">Products</h2>
//               <p className="text-gray-600">
//                 Showing {filteredProducts.length} of {allProducts.length} products
//               </p>
//             </div>

//             {/* Sorting Options */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
//               <label className="text-sm font-medium text-gray-700">Sort by:</label>
//               <select
//                 className="select select-bordered select-sm w-full sm:w-48"
//                 value={sortOption}
//                 onChange={handleSortChange}
//               >
//                 <option value="default">Default / Featured</option>
//                 <option value="price-low-high">Price: Low to High</option>
//                 <option value="price-high-low">Price: High to Low</option>
//                 <option value="rating-high-low">Rating: High to Low</option>
//                 <option value="rating-low-high">Rating: Low to High</option>
//                 <option value="name-asc">Name: A to Z</option>
//                 <option value="name-desc">Name: Z to A</option>
//                 <option value="newest">Newest First</option>
//                 <option value="oldest">Oldest First</option>
//               </select>

//               {/* View Toggle (Grid/List) - Optional */}
//               <div className="join">
//                 <button className="join-item btn btn-sm" title="Grid View">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//                   </svg>
//                 </button>
//                 <button className="join-item btn btn-sm btn-outline" title="List View">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Quick Stats */}
//           <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
//             <div className="stat bg-gray-50 p-3 rounded">
//               <div className="stat-title text-xs">Avg Price</div>
//               <div className="stat-value text-lg">
//                 ${filteredProducts.length > 0
//                   ? (filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length).toFixed(2)
//                   : "0.00"}
//               </div>
//             </div>
//             <div className="stat bg-gray-50 p-3 rounded">
//               <div className="stat-title text-xs">Avg Rating</div>
//               <div className="stat-value text-lg">
//                 {filteredProducts.length > 0
//                   ? (filteredProducts.reduce((sum, p) => sum + p.rating, 0) / filteredProducts.length).toFixed(1)
//                   : "0.0"}
//               </div>
//             </div>
//             <div className="stat bg-gray-50 p-3 rounded">
//               <div className="stat-title text-xs">Highest Price</div>
//               <div className="stat-value text-lg">
//                 ${filteredProducts.length > 0
//                   ? Math.max(...filteredProducts.map(p => p.price)).toFixed(2)
//                   : "0.00"}
//               </div>
//             </div>
//             <div className="stat bg-gray-50 p-3 rounded">
//               <div className="stat-title text-xs">Lowest Price</div>
//               <div className="stat-value text-lg">
//                 ${filteredProducts.length > 0
//                   ? Math.min(...filteredProducts.map(p => p.price)).toFixed(2)
//                   : "0.00"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Products Display */}
//         {filteredProducts.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-lg shadow">
//             <div className="text-5xl mb-4">🔍</div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
//             <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
//             <button
//               onClick={resetFilters}
//               className="btn btn-primary"
//             >
//               Reset All Filters
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* Sort Indicator */}
//             <div className="text-sm text-gray-600 mb-4 flex items-center gap-2">
//               <span className="font-medium">Sorted by:</span>
//               <span className="badge badge-primary badge-outline">
//                 {sortOption === "default" ? "Default" :
//                  sortOption === "price-low-high" ? "Price: Low to High" :
//                  sortOption === "price-high-low" ? "Price: High to Low" :
//                  sortOption === "rating-high-low" ? "Rating: High to Low" :
//                  sortOption === "rating-low-high" ? "Rating: Low to High" :
//                  sortOption === "name-asc" ? "Name: A to Z" :
//                  sortOption === "name-desc" ? "Name: Z to A" :
//                  sortOption === "newest" ? "Newest First" : "Oldest First"}
//               </span>
//             </div>

//             {/* Products Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredProducts.map((product) => (
//                 <div
//                   key={product.id}
//                   className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
//                 >
//                   {/* Product Image Placeholder */}
//                   <div className="h-48 bg-linear-to-r from-blue-50 to-purple-50 flex items-center justify-center">
//                     <div className="text-4xl text-gray-300">
//                       {product.category === "beauty" ? "💄" :
//                        product.category === "electronics" ? "📱" : "👕"}
//                     </div>
//                   </div>

//                   <div className="p-5">
//                     {/* Category & Badges */}
//                     <div className="flex justify-between items-start mb-3">
//                       <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
//                         {product.category}
//                       </span>
//                       {product.createdAt && (
//                         <span className="text-xs text-gray-500">
//                           {new Date(product.createdAt).toLocaleDateString()}
//                         </span>
//                       )}
//                     </div>

//                     {/* Title */}
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 h-14">
//                       {product.title}
//                     </h3>

//                     {/* Rating */}
//                     <div className="flex items-center mb-4">
//                       <div className="rating rating-sm">
//                         {[...Array(5)].map((_, i) => (
//                           <input
//                             key={i}
//                             type="radio"
//                             name={`rating-${product.id}`}
//                             className="mask mask-star-2 bg-yellow-400"
//                             checked={i < Math.floor(product.rating)}
//                             readOnly
//                           />
//                         ))}
//                       </div>
//                       <span className="ml-2 text-sm text-gray-600">
//                         {product.rating.toFixed(1)}
//                       </span>
//                       <span className="ml-2 text-xs text-gray-400">
//                         ({Math.floor(Math.random() * 100) + 1} reviews)
//                       </span>
//                     </div>

//                     {/* Price & Action */}
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <span className="text-2xl font-bold text-gray-900">
//                           ${product.price.toFixed(2)}
//                         </span>
//                         {product.originalPrice && (
//                           <span className="ml-2 text-sm text-gray-500 line-through">
//                             ${product.originalPrice.toFixed(2)}
//                           </span>
//                         )}
//                       </div>
//                       <button className="btn btn-primary btn-sm">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                         </svg>
//                         Add to Cart
//                       </button>
//                     </div>

//                     {/* Quick Info */}
//                     <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
//                       <div className="text-gray-500">SKU:</div>
//                       <div className="text-right font-medium">PROD-{product.id.toString().padStart(3, '0')}</div>
//                       <div className="text-gray-500">In Stock:</div>
//                       <div className="text-right">
//                         <span className="badge badge-success badge-sm">Available</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
