import React, { useEffect, useState } from "react";
import { getOrderHistory } from "../services/orderService";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const orderData = await getOrderHistory();
      setOrders(orderData);
    } catch (error) {
      console.error("Failed to load orders", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-100 via-white to-blue-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Orders
        </h2>
        {orders.length === 0 ? (
          <p className="text-center text-gray-600">No orders available</p>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-md rounded-xl p-6 relative"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Order # {order.id}
                  </h3>
                  <span
                    className={`px-4 py-1 text-sm rounded-full font-medium ${
                      order.status === "Shipped"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Order Info */}
                <p className="text-sm text-gray-600 mb-1">
                  Date:{" "}
                  <span className="font-medium">
                    {new Date(order.order_date).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Address: <span className="font-medium">{order.address}</span>
                </p>

                {/* Order Items */}
                <div className="divide-y divide-gray-200 mb-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-3 flex justify-between items-start"
                    >
                      <div>
                        <p className="text-gray-800 font-medium">
                          {item.product_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x ฿{item.unit_price} ={" "}
                          <span className="font-semibold text-gray-700">
                            ฿{item.total_price}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-gray-800">
                    {" "}
                    Total: ฿{order.total_amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
