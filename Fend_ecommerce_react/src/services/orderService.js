
import interceptorsInstance from "./interceptors";
const API_URL = "/order";

export const getOrderHistory = async () => {
  try {
    const response = await interceptorsInstance.get(`${API_URL}/getorderhistory`, {
      withCredentials: true,
    });
    return response.data.orders;
  } catch (error) {
    console.error("Error fetching order history", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await interceptorsInstance.patch(
      `${API_URL}/seller-orders/${orderId}/status/`,
      { status },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status", error);
    throw error;
  }
};

export const getSellerOrders = async () => {
  try {
    const response = await interceptorsInstance.get(`${API_URL}/seller-orders`, {
      withCredentials: true,
    });
    return response.data.orders;
  } catch (error) {
    console.error("Error fetching seller orders", error);
    throw error;
  }
};

export const placeOrder = async (orderData) => {
  try {
    const response = await interceptorsInstance.post(`${API_URL}/placeorder`, orderData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error placing order", error);
    throw error;
  }
};
