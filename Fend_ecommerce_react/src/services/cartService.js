import axios from "axios";

const API_URL = "http://localhost:3000/api/cart";

export const getCartItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/`, {
      withCredentials: true,
    });
    return response.data.items;
  } catch (error) {
    console.error("Error fetching cart items", error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    await axios.delete(`${API_URL}/clear`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error clearing cart", error);
    throw error;
  }
};

export const addToCart = async (productId, quantity) => {
  try {
    const response = await axios.post(
      `${API_URL}/add`,
      {
        productId,
        quantity,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding to cart", error);
    throw error;
  }
};

export const updateCartItemQuantity = async (itemId, quantity) => {
  try {
    const response = await axios.patch(
      `${API_URL}/items/${itemId}`,
      {
        quantity,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating item quantity", error);
    throw error;
  }
};

export const deleteCartItem = async (itemId) => {
  try {
    const response = await axios.delete(`${API_URL}/delItem/${itemId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting item", error);
    throw error;
  }
};

export const getCartResult = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/cart/result", {
      withCredentials: true,
    });
    return response.data.items;
  } catch (error) {
    console.error("Error fetching cart result", error);
    throw error;
  }
};
