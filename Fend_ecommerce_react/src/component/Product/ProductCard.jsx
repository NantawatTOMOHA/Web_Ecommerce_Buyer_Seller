import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, delay }) => {
  return (
    <Link
      to={`/products/${product.id}`}
      data-aos="fade-up"
      data-aos-delay={delay}
      className="space-y-4 cursor-pointer hover:scale-105 transition-transform duration-200 bg-white rounded-lg shadow-md hover:shadow-xl p-4 flex flex-col h-[450px]"
    >
      <div className="relative">
        <img
          src={product.image_base64}
          alt={product.name}
          className={`h-64 w-full object-cover rounded-md mb-2 ${product.quantity === 0 ? 'opacity-50' : ''}`}
        />
        {product.quantity === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-black bg-opacity-70 text-white text-lg font-bold px-4 py-2 rounded">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-500 mb-1">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 mb-2">
          {product.description}
        </p>

        <div className="mt-auto">
          <span className="text-xl font-bold text-gray-800">
            ฿{product.price}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
