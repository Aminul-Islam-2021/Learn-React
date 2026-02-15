import React from 'react';

export const CategoryFilter = ({ 
  categories = [], 
  selectedCategory,
  subcategories = [],
  selectedSubcategory,
  onCategoryChange,
  onSubcategoryChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Categories</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === 'all'}
              onChange={() => onCategoryChange('all')}
              className="text-blue-500"
            />
            <span>All Categories</span>
          </label>
          
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category.id}
                onChange={() => onCategoryChange(category.id)}
                className="text-blue-500"
              />
              <span className="capitalize">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {selectedCategory !== 'all' && subcategories.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Subcategories</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="subcategory"
                checked={!selectedSubcategory}
                onChange={() => onSubcategoryChange('')}
                className="text-blue-500"
              />
              <span>All Subcategories</span>
            </label>
            
            {subcategories.map((sub) => (
              <label key={sub.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="subcategory"
                  checked={selectedSubcategory === sub.id}
                  onChange={() => onSubcategoryChange(sub.id)}
                  className="text-blue-500"
                />
                <span className="capitalize">{sub.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};