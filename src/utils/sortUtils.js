export const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'rating-high-low', label: 'Rating: High to Low' },
  { value: 'name-a-z', label: 'Name: A to Z' },
  { value: 'name-z-a', label: 'Name: Z to A' },
  { value: 'newest', label: 'Newest First' },
];

export const getSortFunction = (sortBy) => {
  switch(sortBy) {
    case 'price-low-high':
      return (a, b) => a.price - b.price;
    case 'price-high-low':
      return (a, b) => b.price - a.price;
    case 'rating-high-low':
      return (a, b) => b.rating - a.rating;
    case 'name-a-z':
      return (a, b) => a.title.localeCompare(b.title);
    case 'name-z-a':
      return (a, b) => b.title.localeCompare(a.title);
    case 'newest':
      return (a, b) => b.id - a.id;
    default:
      return () => 0;
  }
};

export const applySorting = (products, sortBy) => {
  if (sortBy === 'default' || !products) return products;
  const sortFn = getSortFunction(sortBy);
  return [...products].sort(sortFn);
};