import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.thumbnail || product.image}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-sm mb-1 line-clamp-2">
            {product.title}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.rating})</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
            {product.discountPercentage && (
              <span className="text-xs text-green-600">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>
        </div>
      </Link>

      <button className="w-full py-2 bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
