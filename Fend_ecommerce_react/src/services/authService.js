// services/authService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during registration", error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error during login", error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching profile", error);
    throw error;
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await axios.put(`${API_URL}/updateProfile`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error during logout", error);
    throw error;
  }
};
