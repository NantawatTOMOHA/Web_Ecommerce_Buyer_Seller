import React from "react";

const OrderCard = ({ order, onMarkShipped }) => {
  return (
    <div className="relative border rounded-2xl p-6 shadow-sm bg-white mb-6 hover:shadow-md transition-shadow">
      {/* Status Top Right */}
      <div className="absolute top-4 right-4">
        <span
          className={`px-3 py-1 text-sm rounded-full font-medium ${
            order.status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Order #{order.order_id}
        </h2>
        <p className="text-sm text-gray-400">
          {new Date(order.order_date).toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
        <p>
          <span className="font-semibold text-gray-800">Buyer:</span>{" "}
          {order.buyer_name}
        </p>
        <p>
          <span className="font-semibold text-gray-800">Address:</span>{" "}
          {order.address}
        </p>
        <p>
          <span className="font-semibold text-gray-800">Total:</span> ฿
          {order.total_amount}
        </p>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold text-gray-800 mb-2">Items</h4>
        <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
          {order.items.map((item) => (
            <li key={item.product_id}>
              {item.product_name} - Qty: {item.quantity}, Price: ฿
              {item.unit_price}, Total: ฿{item.total_price}
            </li>
          ))}
        </ul>
      </div>

      {/* Button bottom right */}
      {order.status === "Pending" && (
        <div className="flex justify-end mt-6">
          <button
            onClick={() => onMarkShipped(order.order_id)}
            className="px-5 py-2 rounded-lg bg-blue-950 hover:bg-blue-600 text-white font-medium shadow-sm"
          >
            Mark as Shipped
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
