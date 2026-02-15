import { products } from "./mockData";

export const getcategories = () => {
  const categories = products.map((product) => product.category);
  //const categories = products.map((product) => console.log(product.category));

  // 1st way
  //  return [...new Set(categories)];

  // 2nd way
  //    return categories.reduce((acc, category) => {
  //     if (!acc.includes(category)) {
  //       acc.push(category);
  //     }
  //     return acc;
  //   }, []);

  // 3rd way
  return categories.filter((category, index) => {
    return categories.indexOf(category) === index;
  });
};

export const getProducts = () => {
  return products;
};

export const getProductsByCategory = (category) => {
  return products.filter((product) => product.category === category);
};

// max price
export const getMaxPrice = () => {
  return Math.max(...products.map((product) => product.price));
};

// min price
export const getMinPrice = () => {
  return Math.min(...products.map((product) => product.price));
};

// Add these functions to your dataProcess.js file

// Get min price for a specific category
export const getMinPriceByCategory = (category) => {
  const products =
    category === "all" ? getProducts() : getProductsByCategory(category);
  return Math.min(...products.map((p) => p.price));
};

// Get max price for a specific category
export const getMaxPriceByCategory = (category) => {
  const products =
    category === "all" ? getProducts() : getProductsByCategory(category);
  return Math.max(...products.map((p) => p.price));
};

// Get min rating for a specific category
export const getMinRatingByCategory = (category) => {
  const products =
    category === "all" ? getProducts() : getProductsByCategory(category);
  const result = Math.min(...products.map((p) => p.rating));
  console.log(result);
  return Math.min(...products.map((p) => p.rating));
};

// Get max rating for a specific category
export const getMaxRatingByCategory = (category) => {
  const products =
    category === "all" ? getProducts() : getProductsByCategory(category);
  return Math.max(...products.map((p) => p.rating));
};

// Get available ratings for a specific category (unique ratings)
export const getAvailableRatingsByCategory = (category) => {
  const products =
    category === "all" ? getProducts() : getProductsByCategory(category);
  return [...new Set(products.map((p) => Math.floor(p.rating)))].sort(
    (a, b) => a - b,
  );
};

// Add these sorting functions
export const sortProducts = (products, sortBy) => {
  const sortedProducts = [...products];

  switch (sortBy) {
    case "price-low-high":
      return sortedProducts.sort((a, b) => a.price - b.price);
    case "price-high-low":
      return sortedProducts.sort((a, b) => b.price - a.price);
    case "rating-high-low":
      return sortedProducts.sort((a, b) => b.rating - a.rating);
    // case 'name-a-z':
    //   return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
    // case 'name-z-a':
    //   return sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
    case "newest":
      // Assuming you have an id or date field that indicates newer items
      return sortedProducts.sort((a, b) => b.id - a.id);
    default:
      return products;
  }
};
