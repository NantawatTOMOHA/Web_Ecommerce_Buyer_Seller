import axios from "axios";

const API_URL = "http://localhost:3000/api/products";

export const getMyProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/my-products`, {
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
    const response = await axios.get(`${API_URL}/seller/search/${keyword}`, {
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
    await axios.delete(`${API_URL}/delProduct/${id}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const addProduct = async (formData) => {
  const res = await axios.post(`${API_URL}/add`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const updateProduct = async (id, formData) => {
  try {
    await axios.put(`${API_URL}/updateProduct/${id}`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};
