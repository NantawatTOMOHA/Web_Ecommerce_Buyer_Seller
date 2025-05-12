import axios from "axios";

const API_URL = "http://localhost:3000/api/products";

export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/allproduct`);
    console.log("API Response:", response.data);
    return response.data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const getSearchedProducts = async (keyword) => {
  try {
    const response = await axios.get(`${API_URL}/search/${keyword}`);
    return response.data.products;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};
