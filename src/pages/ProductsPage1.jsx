// import React, { useEffect, useState } from "react";
// import {
//   getcategories,
//   getMaxPrice,
//   getMinPrice,
//   getProducts,
//   getProductsByCategory,
// } from "../mockData/dataProcess";
// import StarRating from "../components/Ratings";

// const ProductsPage1 = () => {
//   const allProducts = getProducts();
//   const categories = getcategories();
//   const productsByCategory = getProductsByCategory;
//   const maxprice = getMaxPrice();
//   const minprice = getMinPrice();
//   //   console.log(minprice);

//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [filteredProducts, setFilteredProducts] = useState(allProducts);
//   const [priceRange, setPriceRange] = useState(maxprice);
//   const [selectedRating, setSelectedRating] = useState(0);

//   useEffect(() => {
//     let result = allProducts;

//     // Filter by category
//     if (selectedCategory !== "all") {
//       result = productsByCategory(selectedCategory);
//     }

//     // Filter by price
//     result = result.filter((product) => product.price <= priceRange);

//     // Filter by rating
//     if (selectedRating > 0) {
//       result = result.filter((product) => product.rating >= selectedRating);
//     }

//     setFilteredProducts(result);
//   }, [selectedCategory, priceRange, selectedRating]);

//   const handleCategoryChange = (category) => {
//     setSelectedCategory(category);
//   };
//   const handlePriceRange = (e) => {
//     setPriceRange(Number(e.target.value));
//   };
//   const handleRatingChange = (rating) => {
//     setSelectedRating(rating);
//     // === selectedRating ? 0 : rating
//   };
//   return (
//     <>
//       <div className=" flex flex-row m-4">
//         <div className=" w-1/5 space-y-3">
//           <p className=" text-center text-lg font-semibold text-gray-700">
//             Filters
//           </p>
//           <div>
//             <p className=" mb-2 font-bold">Filter by Category</p>
//             <div className=" flex gap-3 ">
//               <input
//                 type="radio"
//                 name="all"
//                 id="all"
//                 className="radio radio-primary mt-1 cursor-pointer"
//                 checked={selectedCategory === "all"}
//                 onChange={() => handleCategoryChange("all")}
//               />
//               <div>All Categories</div>
//             </div>
//             {categories.map((category, index) => (
//               <div key={index} className=" flex gap-3">
//                 <input
//                   type="radio"
//                   name="category"
//                   id={category}
//                   className="radio radio-primary mt-1 cursor-pointer"
//                   checked={selectedCategory === category}
//                   onChange={() => handleCategoryChange(category)}
//                 />
//                 <label
//                   htmlFor={category}
//                   className="ml-2 text-gray-600 cursor-pointer capitalize"
//                 >
//                   {category}
//                 </label>
//               </div>
//             ))}
//           </div>

//           {/* Price Range Filter */}
//           <div className="md:pr-4">
//             <p className=" mb-2 font-bold">Filter by Price</p>
//             <input
//               type="range"
//               min={minprice}
//               max={maxprice}
//               value={priceRange}
//               onChange={handlePriceRange}
//               className="range range-primary w-full cursor-pointer"
//             />
//             <div className=" text-center text-gray-500 font-bold text-sm">
//               ${priceRange.toFixed()}
//             </div>
//           </div>

//           {/* Filter by Rating*/}
//           <div className="md:pr-4">
//             <p className=" mb-2 font-bold">Filter by Rating</p>
//           </div>

//           <StarRating
//             handleRatingChange={handleRatingChange}
//             initialRating={selectedRating}
//           />
//         </div>
//         <div className=" w-4/5">
//           <div className=" justify-items-center py-4 space-y-8 grid grid-cols-2  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-center ">
//             {filteredProducts?.map((item) => (
//               <div
//                 key={item.id}
//                 className=" border border-gray-200 h-56 w-36 text-center space-y-1 "
//               >
//                 <img
//                   src={item.thumbnail}
//                   alt={item.title}
//                   className="h-28 w-full object-cover bg-gray-100 shadow-lg "
//                 />
//                 <p>{item.title.slice(0, 13)}</p>
//                 <p>{item.description.slice(0, 12)}</p>
//                 <div className="flex justify-between px-4">
//                   <p>{item.price}</p>
//                   <p>{item.rating}</p>
//                 </div>
//                 <button className=" p-1 bg-blue-500 text-white font-semibold w-full ">
//                   Add To Cart
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProductsPage1;

import React, { useEffect, useState } from "react";
import {
  getcategories,
  getMaxPrice,
  getMinPrice,
  getProducts,
  getProductsByCategory,
  getMinPriceByCategory,
  getMaxPriceByCategory,
  getMinRatingByCategory,
  getMaxRatingByCategory,
  getAvailableRatingsByCategory,
} from "../mockData/dataProcess";
import StarRating from "../components/Ratings";

const ProductsPage1 = () => {
  const allProducts = getProducts();
  const categories = getcategories();
  const productsByCategory = getProductsByCategory;

  // Global min/max (for initial state)
  const globalMaxPrice = getMaxPrice();
  const globalMinPrice = getMinPrice();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  // Price range states
  const [priceRange, setPriceRange] = useState(globalMaxPrice);
  const [categoryMinPrice, setCategoryMinPrice] = useState(globalMinPrice);
  const [categoryMaxPrice, setCategoryMaxPrice] = useState(globalMaxPrice);

  // Rating states
  const [selectedRating, setSelectedRating] = useState(0);
  const [categoryMinRating, setCategoryMinRating] = useState(0);
  const [categoryMaxRating, setCategoryMaxRating] = useState(5);
  const [availableRatings, setAvailableRatings] = useState([]);

  // Sorting states
  const [sortBy, setSortBy] = useState("default");
  const [displayedProducts, setDisplayedProducts] = useState(allProducts);

  // Update category-specific min/max when category changes
  useEffect(() => {
    // Update price range for selected category
    const minPrice = getMinPriceByCategory(selectedCategory);
    const maxPrice = getMaxPriceByCategory(selectedCategory);

    setCategoryMinPrice(minPrice);
    setCategoryMaxPrice(maxPrice);

    // Reset price range to max of selected category
    setPriceRange(maxPrice);

    // Update rating info for selected category
    const minRating = getMinRatingByCategory(selectedCategory);
    const maxRating = getMaxRatingByCategory(selectedCategory);
    const ratings = getAvailableRatingsByCategory(selectedCategory);

    setCategoryMinRating(minRating);
    setCategoryMaxRating(maxRating);
    setAvailableRatings(ratings);

    // Reset selected rating when category changes
    setSelectedRating(0);
  }, [selectedCategory]);

  // Filter products based on all criteria
  useEffect(() => {
    let result = allProducts;

    // Filter by category
    if (selectedCategory !== "all") {
      result = productsByCategory(selectedCategory);
    }

    // Filter by price
    result = result.filter((product) => product.price <= priceRange);

    // Filter by rating
    if (selectedRating > 0) {
      result = result.filter((product) => product.rating >= selectedRating);
    }

    setFilteredProducts(result);
  }, [
    selectedCategory,
    priceRange,
    selectedRating,
    allProducts,
    productsByCategory,
  ]);

  // Add this sorting effect
  useEffect(() => {
    let sorted = [...filteredProducts];

    switch (sortBy) {
      case "price-low-high":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating-high-low":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      // case "name-a-z":
      //   sorted.sort((a, b) => a.title.localeCompare(b.title));
      //   break;
      // case "name-z-a":
      //   sorted.sort((a, b) => b.title.localeCompare(a.title));
      //   break;
      case "newest":
        sorted.sort((a, b) => b.id - a.id);
        break;
      default:
        // Keep original order
        break;
    }

    setDisplayedProducts(sorted);
  }, [filteredProducts, sortBy]);

  // Add sort handler
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Add category handler
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Add price range handler
  const handlePriceRange = (e) => {
    setPriceRange(Number(e.target.value));
  };

  // Add rating handler
  const handleRatingChange = (rating) => {
    setSelectedRating(rating === selectedRating ? 0 : rating);
  };

  return (
    <>
      <div className="flex flex-row m-4">
        <div className="w-1/5 space-y-3">
          <p className="text-center text-lg font-semibold text-gray-700">
            Filters
          </p>

          {/* Category Filter */}
          <div>
            <p className="mb-2 font-bold">Filter by Category</p>
            <div className="flex gap-3">
              <input
                type="radio"
                name="category"
                id="all"
                className="radio radio-primary mt-1 cursor-pointer"
                checked={selectedCategory === "all"}
                onChange={() => handleCategoryChange("all")}
              />
              <label htmlFor="all" className="text-gray-600 cursor-pointer">
                All Categories
              </label>
            </div>
            {categories.map((category, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="radio"
                  name="category"
                  id={category}
                  className="radio radio-primary mt-1 cursor-pointer"
                  checked={selectedCategory === category}
                  onChange={() => handleCategoryChange(category)}
                />
                <label
                  htmlFor={category}
                  className="text-gray-600 cursor-pointer capitalize"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>

          {/* Price Range Filter */}
          <div className="md:pr-4">
            <p className="mb-2 font-bold">Filter by Price</p>
            <div className="text-sm text-gray-600 mb-1">
              Range: ${categoryMinPrice.toFixed(2)} - $
              {categoryMaxPrice.toFixed(2)}
            </div>
            <input
              type="range"
              min={categoryMinPrice}
              max={categoryMaxPrice}
              value={priceRange}
              onChange={handlePriceRange}
              step="0.01"
              className="range range-primary w-full cursor-pointer"
            />
            <div className="text-center text-gray-500 font-bold text-sm">
              Max Price: ${priceRange.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 text-center">
              Showing products up to ${priceRange.toFixed(2)}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="md:pr-4">
            <p className="mb-2 font-bold">Filter by Rating</p>
            <div className="text-sm text-gray-600 mb-2">
              Available ratings: {categoryMinRating.toFixed(1)} -{" "}
              {categoryMaxRating.toFixed(1)} stars
            </div>

            {/* Custom rating buttons for this category */}
            <div className="space-y-2">
              {availableRatings.map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`rating-${rating}`}
                    checked={selectedRating === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="checkbox checkbox-primary checkbox-sm cursor-pointer"
                  />
                  <label
                    htmlFor={`rating-${rating}`}
                    className="flex items-center cursor-pointer"
                  >
                    <span className="text-yellow-400 mr-1">★</span>
                    <span>{rating}+ stars</span>
                  </label>
                </div>
              ))}
            </div>

            {/* Optional: Clear rating filter button */}
            {selectedRating > 0 && (
              <button
                onClick={() => setSelectedRating(0)}
                className="mt-2 text-xs text-blue-500 hover:text-blue-700"
              >
                Clear Rating Filter
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-4/5">
          <div className="px-4 flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Showing {filteredProducts.length} products
            </p>
            {/* Sorting Dropdown */}
            {/* Sorting Dropdown - Compact Version */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="default">Sort</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating-high-low">Top Rated</option>
                {/* <option value="name-a-z">Name A-Z</option>
                <option value="name-z-a">Name Z-A</option> */}
                <option value="newest">Newest</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {/* Sorting Dropdown */}
            {/* <div className="flex items-center gap-2">
              <label
                htmlFor="sort"
                className="text-sm text-gray-600 font-medium"
              >
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={handleSortChange}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
              >
                <option value="default">Default</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating-high-low">Rating: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
                <option value="newest">Newest First</option>
              </select>
            </div> */}
          </div>
          <div className="justify-items-center py-4 space-y-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-center">
            {displayedProducts?.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 h-56 w-36 text-center space-y-2"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-28 w-full object-cover bg-gray-100 shadow-lg"
                />
                <p className="text-xs font-semibold">
                  {item.title.slice(0, 13)}
                </p>
                <p className="text-xs text-gray-500">
                  {item.description.slice(0, 12)}
                </p>
                <div className="flex justify-between px-2 text-xs">
                  <p className="font-bold">${item.price}</p>
                  <p className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    {item.rating}
                  </p>
                </div>
                <button className="p-1 bg-blue-500 text-white font-semibold w-full text-md hover:bg-blue-600 transition-colors">
                  Add To Cart
                </button>
              </div>
            ))}
          </div>

          {/* Show message if no products found */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No products match your filters
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsPage1;
