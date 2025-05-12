import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getCartItems,
  clearCart,
  getCartResult,
} from "../services/cartService";
import { placeOrder } from "../services/orderService";

const Payment = () => {
  const location = useLocation();
  const { address: initialAddress } = location.state || {};
  const [cartItems, setCartItems] = useState([]);
  const [cartForOrder, setCartForOrder] = useState([]);
  const [address, setAddress] = useState(initialAddress || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const displayItems = await getCartItems();
        const orderItems = await getCartResult();
        setCartItems(displayItems);
        setCartForOrder(orderItems);
      } catch (err) {
        console.error("Failed to fetch cart data:", err);
      }
    };
    fetchCart();
  }, []);

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        return total + parseFloat(item.total_price);
      }, 0)
      .toFixed(2);
  };

  const handlePayment = async () => {
    if (!address.trim()) {
      alert("Please enter a shipping address.");
      return;
    }

    const orderData = {
      items: cartForOrder,
      address,
    };

    try {
      setLoading(true);
      await placeOrder(orderData);
      await clearCart();
      navigate("/order");
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(70vh-130px)] w-full bg-gradient-to-r from-blue-100 via-white to-blue-100 py-10">
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg space-y-6">
        <h2 className="text-2xl font-bold">Order Summary</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600">No items in the cart.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between border-b pb-2">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{item.total_price} THB</span>
              </div>
            ))}

            <div className="flex justify-between font-semibold pt-4 border-t">
              <span>Total:</span>
              <span>{getTotalPrice()} THB</span>
            </div>

            <div className="pt-4">
              <textarea
                className="w-full border p-2 rounded"
                rows="3"
                placeholder="Enter your shipping address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <button
              className="w-full shadow-md bg-white dark:bg-gray-900 dark:text-white py-2 rounded"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
