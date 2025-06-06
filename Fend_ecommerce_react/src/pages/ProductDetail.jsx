import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { addToCart } from "../services/cartService";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getProductById(id)
      .then(setProduct)
      .catch((err) => console.error("Failed to fetch product", err));
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      setMessage("Added to cart!");
      setTimeout(() => {
        setMessage("");
      }, 3000); 
    } catch {
      setMessage("Invalid");
      setTimeout(() => {
        setMessage("");
      }, 3000); 
    }
  };

  const handleIncreaseQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!product) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-[calc(70vh-130px)] w-full bg-gradient-to-r from-blue-100 via-white to-blue-100 py-10">
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Product Image */}
          <div  className="relative">
            <img
              src={product.image_base64}
              alt={product.name}
              className={`w-full h-auto rounded-lg shadow-md ${product.quantity === 0 ? 'opacity-50' : ''}`}

            />
            {product.quantity === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-black bg-opacity-70 text-white text-2xl font-bold px-6 py-3 rounded">
                  SOLD OUT
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Product Details */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <div className="text-gray-700 bg-gray-50 border border-gray-200 rounded-md p-3 h-32 overflow-y-auto">
              {product.description}
            </div>
            <p className="text-lg text-primary font-semibold">
              ฿{product.price}
            </p>
            <p className="text-sm text-gray-500">
              In Stock: {product.quantity}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Sold by: {product.seller_name}
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6 w-full">
              {/* Quantity Adjustment */}
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={handleDecreaseQuantity}
                  className="px-3 py-2 text-lg font-semibold text-gray-700 hover:bg-gray-200"
                >
                  -
                </button>

                <input
                  type="number"
                  readOnly
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  className="w-14 h-10  text-center leading-10  border-0 py-2 text-lg font-semibold text-gray-800"
                />
                
                <button
                  onClick={handleIncreaseQuantity}
                  disabled={product.quantity === 0}
                  className="px-3 py-2 text-lg font-semibold text-gray-700 hover:bg-gray-200"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 focus:outline-none"
              >
                {product.quantity === 0 ? "Out of Stock" : "Add to cart"}
              </button>
            </div>

            {/* Popup Message (Top Bar) */}
            {message && (
              <div className="fixed top-10 left-1/2 transform -translate-x-1/2 px-4 py-3 bg-green-400 text-white text-xl font-semibold text-center shadow-md rounded-lg z-50 animate-fadeInOut">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
