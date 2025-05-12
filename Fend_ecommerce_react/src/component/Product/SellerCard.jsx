import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";

const SellerCard = ({ product, onDelete, onEdit, onView }) => {
  return (
    <div
      className="relative bg-white rounded-xl hover:scale-105 shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer flex flex-col h-[430px]" // fixed height
      onClick={() => onView(product)}
    >
      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(product.id);
        }}
        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full z-10"
        title="Delete Product"
      >
        <MdDelete />
      </button>

      {/* Edit Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(product);
        }}
        className="absolute top-2 right-12 bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full z-10"
        title="Edit Product"
      >
        <MdEdit />
      </button>

      <img
        src={product.image_base64}
        alt={product.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-xl font-semibold mb-1">{product.name}</h2>

        {/* Description with truncate */}
        <p className="text-gray-600 text-sm truncate mb-2">
          {product.description}
        </p>

        <p className="text-sm text-gray-500">Seller: {product.seller_name}</p>
        <p className="mt-2 text-lg font-bold text-gray-800">฿{product.price}</p>
        <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
        <p className="text-xs text-gray-400 mt-auto">
          Created: {new Date(product.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default SellerCard;
