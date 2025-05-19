import React, { useEffect, useState } from "react";
import {
  getCartItems,
  updateCartItemQuantity,
  deleteCartItem,
} from "../services/cartService";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error("Failed to load cart", error);
    }
  };

  const handleIncrease = async (id, currentQuantity) => {
    try {
      await updateCartItemQuantity(id, currentQuantity + 1);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total_price: (item.unit_price * (item.quantity + 1)).toFixed(2),
              }
            : item
        )
      );
    } catch (err) {
      console.error("Error increasing quantity", err);
    }
  };

  const handleDecrease = async (id, currentQuantity) => {
    if (currentQuantity <= 1) return;
    try {
      await updateCartItemQuantity(id, currentQuantity - 1);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
                total_price: (item.unit_price * (item.quantity - 1)).toFixed(2),
              }
            : item
        )
      );
    } catch (err) {
      console.error("Error decreasing quantity", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCartItem(id);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting item", err);
    }
  };

  const handleOrder = () => {
    if (!address.trim()) {
      alert("Please enter the address before placing the order");
      return;
    }
    navigate("/payment", { state: { address } });
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.total_price),
    0
  );

  return (
    <div className="min-h-[calc(80vh-80px)] w-full max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty</p>
      ) : (
        <>
          <div className="flex flex-col gap-4 mb-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
              >
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    ฿{item.unit_price} x {item.quantity}
                  </p>
                  <p className="text-md font-bold text-primary">
                    Total: ฿{item.total_price}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDecrease(item.id, item.quantity)}
                    className="px-3 py-0.5 border border-gray-900 text-gray-900 rounded hover:bg-orange-100"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleIncrease(item.id, item.quantity)}
                    className="px-2.5 py-0.5 border border-gray-900 text-gray-900 rounded hover:bg-green-100"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total price and address input */}
          <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="w-full md:w-2/3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Address
              </label>
              <textarea
                rows="4"
                className="w-full border rounded-md p-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
              />
            </div>
            <div className="w-full md:w-1/3 text-right">
              <p className="text-xl font-bold mb-4">
                Total: ฿{totalPrice.toFixed(2)}
              </p>
              <button
                onClick={handleOrder}
                className="px-6 py-2 shadow-md bg-white dark:bg-gray-900 dark:text-white rounded hover:bg-green-700 w-full md:w-auto"
              >
                Place Order
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
