
import interceptorsInstance from "./interceptors";

const API_URL = "/products";

export const getMyProducts = async () => {
  try {
    const response = await interceptorsInstance.get(`${API_URL}/my-products`, {
      withCredentials: true,
    });
    return response.data.products;
  } catch (error) {
    console.error("Error fetching seller products:", error);
    throw error;
  }
};

export const getSearchedMyProducts = async (keyword) => {
  try {
    const response = await interceptorsInstance.get(`${API_URL}/seller/search/${keyword}`, {
      withCredentials: true,
    });
    return response.data.products;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};
export const deleteProduct = async (id) => {
  try {
    await interceptorsInstance.delete(`${API_URL}/delProduct/${id}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const addProduct = async (formData) => {
  const res = await interceptorsInstance.post(`${API_URL}/add`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const updateProduct = async (id, formData) => {
  try {
    await interceptorsInstance.put(`${API_URL}/updateProduct/${id}`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};
