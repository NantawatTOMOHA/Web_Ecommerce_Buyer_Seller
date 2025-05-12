import React, { useEffect, useState } from "react";
import { getSellerOrders, updateOrderStatus } from "../services/orderService";
import OrderCard from "../component/Product/OrderCard";

const SellerOrder = () => {
  const [orders, setOrders] = useState([]);

  const sortOrders = (orders) => {
    return orders.sort((a, b) => {
      if (a.status === "Pending" && b.status !== "Pending") return -1;
      if (a.status !== "Pending" && b.status === "Pending") return 1;
      return new Date(b.order_date) - new Date(a.order_date); // ล่าสุดก่อน
    });
  };

  const fetchOrders = async () => {
    try {
      const res = await getSellerOrders();
      setOrders(sortOrders(res));
    } catch (error) {
      console.error("Failed to fetch seller orders:", error);
    }
  };

  const handleMarkShipped = async (orderId) => {
    try {
      await updateOrderStatus(orderId, "Shipped");
      setOrders((prevOrders) =>
        sortOrders(
          prevOrders.map((order) =>
            order.order_id === orderId ? { ...order, status: "Shipped" } : order
          )
        )
      );
    } catch {
      alert("Failed to update order status.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Seller Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        orders.map((order) => (
          <OrderCard
            key={order.order_id}
            order={order}
            onMarkShipped={handleMarkShipped}
          />
        ))
      )}
    </div>
  );
};

export default SellerOrder;
