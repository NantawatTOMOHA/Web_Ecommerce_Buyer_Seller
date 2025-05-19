import axios from "axios";

const interceptorsInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export const setupInterceptors = (handleLogout) => {
interceptorsInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await handleLogout();
      } catch (err) {
        console.error("Auto logout failed", err);
      }
      window.location.href = "/"; 
    }
    return Promise.reject(error);
  }
);
};

export default interceptorsInstance;