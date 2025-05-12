import React from "react";
const ProductDetailModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl min-h-[500px] min-w-[700px] p-6 relative flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl"
          title="Close"
        >
          &times;
        </button>

        {/* Left Column - Image */}
        <div className="md:w-1/2 w-full mb-4 md:mb-0 flex items-center justify-center">
          <img
            src={product.image_base64}
            alt={product.name}
            className="rounded-xl shadow-md h-full max-h-[400px] object-cover w-full"
          />
        </div>

        {/* Right Column - Details */}
        <div className="md:w-1/2 w-full pl-0 md:pl-6 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-3 text-gray-800">
              {product.name}
            </h2>

            {/* Description with fixed height + scroll */}
            <div className="text-gray-700 mb-4 max-h-32 overflow-y-auto pr-2">
              {product.description}
            </div>

            <div className="text-sm text-gray-500 mb-2">
              <span className="font-medium">Seller:</span> {product.seller_name}
            </div>

            <div className="text-xl text-green-600 font-bold mb-2">
              ฿{product.price}
            </div>

            <div className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Quantity:</span> {product.quantity}
            </div>
          </div>

          <div className="text-xs text-gray-400 mt-4">
            Created: {new Date(product.created_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
